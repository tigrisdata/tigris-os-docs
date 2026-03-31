# S3 API compatibility

TAG implements the commonly used S3 REST API operations, acting as a caching
proxy between S3 clients and Tigris object storage. Compatibility is validated
against 214 tests from the [ceph/s3-tests](https://github.com/ceph/s3-tests)
suite.

:::info[Path-Style Addressing Only]

TAG supports path-style addressing only (`http://host:port/bucket/key`).
Virtual-hosted style (`http://bucket.host:port/key`) is not supported. Configure
your S3 client accordingly.

:::

## Supported operations

### Service

| Operation   | Notes               |
| ----------- | ------------------- |
| ListBuckets | Forwarded to Tigris |

### Bucket

| Operation            | Notes                                  |
| -------------------- | -------------------------------------- |
| CreateBucket         | Forwarded to Tigris                    |
| DeleteBucket         | Forwarded to Tigris                    |
| HeadBucket           | Forwarded to Tigris                    |
| ListObjects (V1/V2)  | Forwarded to Tigris                    |
| ListMultipartUploads | Forwarded to Tigris                    |
| GetBucketLocation    | Returns configured region              |
| GetBucketVersioning  | Forwarded to Tigris                    |
| GetBucketACL         | Forwarded to Tigris                    |
| GetBucketPolicy      | Forwarded to Tigris                    |
| GetBucketCORS        | Forwarded to Tigris                    |
| GetBucketTagging     | Forwarded to Tigris                    |
| GetBucketLifecycle   | Forwarded to Tigris                    |
| DeleteObjects        | Bulk delete; invalidates cache entries |

### Object

| Operation           | Notes                                                 |
| ------------------- | ----------------------------------------------------- |
| GetObject           | Cache-first; supports `Range` and conditional headers |
| HeadObject          | Served from cached metadata when available            |
| PutObject           | Invalidates cache before forwarding                   |
| DeleteObject        | Invalidates cache before forwarding                   |
| CopyObject          | Invalidates destination cache before forwarding       |
| GetObjectTagging    | Forwarded to Tigris                                   |
| PutObjectTagging    | Forwarded to Tigris                                   |
| DeleteObjectTagging | Forwarded to Tigris                                   |
| GetObjectACL        | Forwarded to Tigris                                   |
| PutObjectACL        | Forwarded to Tigris                                   |

### Multipart upload

| Operation               | Notes                                      |
| ----------------------- | ------------------------------------------ |
| InitiateMultipartUpload | Forwarded to Tigris                        |
| UploadPart              | Forwarded to Tigris                        |
| UploadPartCopy          | Forwarded to Tigris                        |
| CompleteMultipartUpload | Idempotent — successful completions cached |
| AbortMultipartUpload    | Forwarded to Tigris                        |
| ListParts               | Forwarded to Tigris                        |

## AWS chunked transfer encoding

TAG supports AWS chunked transfer encoding (streaming SigV4), used by
[warp](https://github.com/minio/warp) and many AWS SDKs for large uploads.

In **transparent proxy mode** (default), chunked uploads are forwarded as-is
since the original signatures remain valid.

In **signing mode**, TAG decodes the chunked body on-the-fly — stripping chunk
framing and per-chunk signatures — and forwards the raw payload as
`UNSIGNED-PAYLOAD`. This is a streaming operation with no buffering of the full
object.

## Caching behavior

For details on `X-Cache` response headers, request coalescing, range request
optimization, write-through invalidation, and client cache-control headers, see
[Cache Control](cache-control.md).

## Authentication

All requests must be signed with AWS Signature Version 4 (SigV4). Presigned URL
authentication (`X-Amz-Algorithm` query parameter) is also supported. See
[Security and Access Control](security.mdx) for the full authentication flow.

## Not supported

The following S3 features are not implemented by TAG. These requests are
forwarded to Tigris as-is, where Tigris itself may or may not support them:

- Object versioning (version-specific GET/DELETE)
- Server-side encryption (SSE-C, SSE-S3, SSE-KMS)
- Object Lock / WORM retention
- POST object (browser-based HTML form uploads)
- Public Access Block configuration
- Bucket ownership controls
- Virtual-hosted style addressing
- Website hosting configuration
- Replication configuration
- Inventory, analytics, and metrics configuration
- Storage class transitions (Glacier, Intelligent Tiering)

## S3 compatibility test coverage

TAG's compatibility is validated using a curated subset of tests from
[ceph/s3-tests](https://github.com/ceph/s3-tests):

| Category             | Tests   | Coverage                                                |
| -------------------- | ------- | ------------------------------------------------------- |
| Header validation    | 48      | Content-Type, MD5, Content-Length, dates, authorization |
| Core list operations | 55      | Prefix, delimiter, max-keys, marker, continuation       |
| Object operations    | 34      | Read, write, metadata, ETags, ranges, conditionals      |
| Bucket operations    | 33      | Create, delete, list, naming rules                      |
| Multipart uploads    | 20      | Initiate, upload, complete, abort, copy parts           |
| Copy operations      | 9       | Same-bucket, cross-bucket, metadata handling            |
| Tagging              | 15      | Object and bucket tag CRUD                              |
| **Total**            | **214** |                                                         |

The test suite is executed as part of TAG's CI pipeline on every release to
ensure that there is no regressions in S3 API compatibility.

---
title: S3 API Compatibility
sidebar_label: S3 Compatibility
description:
  S3 operations supported by TAG, caching behavior per operation, addressing
  style, authentication modes, and unsupported features.
---

# S3 API compatibility

TAG implements the commonly used S3 REST API operations, acting as a caching
proxy between S3 clients and Tigris object storage. Compatibility is validated
against 214 tests from the [ceph/s3-tests](https://github.com/ceph/s3-tests)
suite.

:::warning[Path-Style Addressing Only]

TAG supports path-style addressing only (`http://host:port/bucket/key`).
Virtual-hosted style (`http://bucket.host:port/key`) is not supported. Configure
your S3 client accordingly.

:::

## Supported operations

### Service

| Operation   | Method | Path | Notes |
| ----------- | ------ | ---- | ----- |
| ListBuckets | GET    | `/`  |       |

### Bucket

All bucket operations support both `/{bucket}` and `/{bucket}/` path forms for
compatibility with clients that send trailing slashes.

| Operation            | Method             | Path / Query            | Notes                                                |
| -------------------- | ------------------ | ----------------------- | ---------------------------------------------------- |
| CreateBucket         | PUT                | `/{bucket}`             |                                                      |
| DeleteBucket         | DELETE             | `/{bucket}`             |                                                      |
| HeadBucket           | HEAD               | `/{bucket}`             |                                                      |
| ListObjects V1       | GET                | `/{bucket}`             |                                                      |
| ListObjects V2       | GET                | `/{bucket}?list-type=2` |                                                      |
| ListMultipartUploads | GET                | `/{bucket}?uploads`     |                                                      |
| GetBucketLocation    | GET                | `/{bucket}?location`    | Returns configured region                            |
| GetBucketVersioning  | GET / PUT          | `/{bucket}?versioning`  | Forwarded to Tigris                                  |
| GetBucketACL         | GET / PUT          | `/{bucket}?acl`         | Forwarded to Tigris                                  |
| GetBucketPolicy      | GET / PUT / DELETE | `/{bucket}?policy`      | Forwarded to Tigris                                  |
| GetBucketCORS        | GET / PUT / DELETE | `/{bucket}?cors`        | Forwarded to Tigris                                  |
| GetBucketTagging     | GET / PUT / DELETE | `/{bucket}?tagging`     | Forwarded to Tigris                                  |
| GetBucketLifecycle   | GET / PUT / DELETE | `/{bucket}?lifecycle`   | Forwarded to Tigris                                  |
| DeleteObjects        | POST               | `/{bucket}?delete`      | Bulk delete with XML body; invalidates cache entries |

### Object

| Operation           | Method | Path / Query              | Notes                                                                  |
| ------------------- | ------ | ------------------------- | ---------------------------------------------------------------------- |
| GetObject           | GET    | `/{bucket}/{key}`         | Cache-first; supports `Range` and conditional headers                  |
| HeadObject          | HEAD   | `/{bucket}/{key}`         | Served from cached metadata when available                             |
| PutObject           | PUT    | `/{bucket}/{key}`         | Invalidates cache before forwarding                                    |
| DeleteObject        | DELETE | `/{bucket}/{key}`         | Invalidates cache before forwarding                                    |
| CopyObject          | PUT    | `/{bucket}/{key}`         | Detected via `X-Amz-Copy-Source` header; invalidates destination cache |
| GetObjectTagging    | GET    | `/{bucket}/{key}?tagging` |                                                                        |
| PutObjectTagging    | PUT    | `/{bucket}/{key}?tagging` |                                                                        |
| DeleteObjectTagging | DELETE | `/{bucket}/{key}?tagging` |                                                                        |
| GetObjectACL        | GET    | `/{bucket}/{key}?acl`     |                                                                        |
| PutObjectACL        | PUT    | `/{bucket}/{key}?acl`     |                                                                        |

### Multipart upload

| Operation               | Method | Path / Query                            | Notes                                      |
| ----------------------- | ------ | --------------------------------------- | ------------------------------------------ |
| InitiateMultipartUpload | POST   | `/{bucket}/{key}?uploads`               |                                            |
| UploadPart              | PUT    | `/{bucket}/{key}?uploadId=&partNumber=` |                                            |
| UploadPartCopy          | PUT    | `/{bucket}/{key}?uploadId=&partNumber=` | Detected via `X-Amz-Copy-Source` header    |
| CompleteMultipartUpload | POST   | `/{bucket}/{key}?uploadId=`             | Idempotent — successful completions cached |
| AbortMultipartUpload    | DELETE | `/{bucket}/{key}?uploadId=`             |                                            |
| ListParts               | GET    | `/{bucket}/{key}?uploadId=`             |                                            |

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
[Cache Control and Revalidation](./cache-control).

## Authentication

All requests must be signed with AWS Signature Version 4 (SigV4). Presigned URL
authentication (`X-Amz-Algorithm` query parameter) is also supported. See
[Security and Access Control](./security) for the full authentication flow.

## Not supported

The following S3 features are not implemented by TAG. These requests are
forwarded to Tigris as-is, where Tigris itself may or may not support them:

- Object versioning (version-specific GET/DELETE)
- Server-side encryption (SSE-C, SSE-S3, SSE-KMS)
- Object Lock / WORM retention
- POST object (browser-based HTML form uploads)
- Public Access Block configuration
- Bucket ownership controls
- Multi-range requests (single `Range` header only)
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

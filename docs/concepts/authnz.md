# Authentication & Authorization

Tigris, being S3-compatible, offers S3-supported authentication and
authorization methods. AWS S3 evolved in offerings for their authentication and
authorization needs. We currently support what AWS S3 recommends to their users
for the AuthN and AuthZ needs.

## Authentication

Tigris offers two mechanisms for authentication.

- AWS signature version 4
- Session token

### AWS Signature version 4

This authentication method is based on a hash-based signature. The first
selected element of the request is picked and converted to a string. A signing
key signs this formed string version, and a hash-based message authentication
code (`HMAC`) is derived. The signing key is derived from the secret access key.
The AWS S3 SDK handles this signature generation part.

The server then receives a request along with the signature and the
`access_key_id`. The server recreates the signature and compares it to the
incoming signature. This is how the server authenticates and fetches the
authenticated user’s context.

This mechanism relies on the access key - Tigris supports IAM’s
`CreateAccessKey` API to generate access keys. These keys are stored on the
Tigris server in an encrypted form with `AES` `256-bit` encryption.

![Double encryption of access key](/img/auth/double-encryption-of-key.png)

### Session Token

This mechanism is based on the idea of temporary credentials. Within Tigris,
this is mainly used for human users when interacting with Tigris’s web console.
The session token has a limited lifetime. Tigris uses `JWT` (JSON Web Token) as
the session token. This token is signed by an authentication provider using the
`RS256` algorithm. When the user logs in to Tigris’s web console, Tigris’s
authentication service issues the `JWT`. This `JWT` contains the metadata about
the user, for example, the org ids and the user id.

This session token is signed by Tigris’s authentication service using `RS256`.
This token is fed to the AWS S3 client as a session token field. When a Tigris
server receives a request containing the session token via header
`x-amz-security-token`, Tigris validates the signature of the `JWT` by using the
public key rendered by Tigris’s authentication service. If the signature is
valid, Tigris server further validates the claims made by the token. Such as
issuer, audience, and expiration.

![Session token based authentication](/img/auth/session-token-auth.png)

## Authorization

Tigris supports Role-Based-Access-Control (RBAC) and AWS's IAM policies
mechanism for the authorization system.

When you create an access key, you can assign a role to it. This role is mapped
to a bucket. This role is a simplified version of IAM policies. This role is
used to determine the access level of the key.

### Role-Based-Access-Control (RBAC)

Bucket roles are cumulative:

| Role        | Access                                                                                                                          |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `ReadOnly`  | Read objects and bucket metadata, list objects, and create snapshots and forks.                                                 |
| `ReadWrite` | Everything in `ReadOnly`, plus object writes, deletes, copies, tagging, and multipart uploads. No bucket configuration changes. |
| `Editor`    | Everything in `ReadWrite`, plus bucket configuration and deletion.                                                              |
| `Admin`     | Full organization access.                                                                                                       |

An Editor can manage CORS, lifecycle rules, bucket tags, ownership controls,
inventory, bucket ACLs, custom domains, delete protection, shadow buckets,
origins, object notifications, storage tiers, snapshots, and forks. An Editor
can make a bucket public, disable delete protection, and delete the bucket.

An Editor cannot manage bucket shares or create and manage IAM policies. Only
the bucket owner or an organization admin can manage shares.

:::caution

Bucket metadata returned to an Editor includes the stored shadow-bucket
credentials and the object notification authentication details. Give the Editor
role only to users who are permitted to read those secrets. To let a user write
objects without this access, use `ReadWrite`.

:::

The table below lists the gateway operations granted directly by each bucket
role. These operation names are not IAM policy action names.

| Operation                          | Admin | Editor | ReadWrite | ReadOnly |
| ---------------------------------- | ----- | ------ | --------- | -------- |
| AbortMultipartUpload               | ✅    | ✅     | ✅        | ❌       |
| BundleObjects                      | ✅    | ✅     | ✅        | ✅       |
| CompleteMultipartUpload            | ✅    | ✅     | ✅        | ❌       |
| CopyObject                         | ✅    | ✅     | ✅        | ❌       |
| CreateBucket                       | ✅    | ✅     | ❌        | ❌       |
| CreateBucketFork                   | ✅    | ✅     | ✅        | ✅       |
| CreateBucketSnapshot               | ✅    | ✅     | ✅        | ✅       |
| DeleteBucket                       | ✅    | ✅     | ❌        | ❌       |
| DeleteBucketCors                   | ✅    | ✅     | ❌        | ❌       |
| DeleteBucketInventoryConfiguration | ✅    | ✅     | ❌        | ❌       |
| DeleteBucketLifecycleConfiguration | ✅    | ✅     | ❌        | ❌       |
| DeleteBucketOwnershipControls      | ✅    | ✅     | ❌        | ❌       |
| DeleteBucketPolicy                 | ✅    | ✅     | ❌        | ❌       |
| DeleteBucketTagging                | ✅    | ✅     | ❌        | ❌       |
| DeleteMultipleObjects              | ✅    | ✅     | ✅        | ❌       |
| DeleteObject                       | ✅    | ✅     | ✅        | ❌       |
| DeleteObjectTagging                | ✅    | ✅     | ✅        | ❌       |
| DeleteObjectVersion                | ✅    | ✅     | ✅        | ❌       |
| GetAccessKey                       | ✅    | ✅     | ✅        | ✅       |
| GetBucketACL                       | ✅    | ✅     | ❌        | ❌       |
| GetBucketAccelerateConfiguration   | ✅    | ✅     | ✅        | ✅       |
| GetBucketCors                      | ✅    | ✅     | ❌        | ❌       |
| GetBucketInventoryConfiguration    | ✅    | ✅     | ❌        | ❌       |
| GetBucketLifecycleConfiguration    | ✅    | ✅     | ❌        | ❌       |
| GetBucketLocation                  | ✅    | ✅     | ✅        | ✅       |
| GetBucketMetadata                  | ✅    | ✅     | ✅        | ✅       |
| GetBucketOwnershipControls         | ✅    | ✅     | ✅        | ✅       |
| GetBucketPolicy                    | ✅    | ✅     | ❌        | ❌       |
| GetBucketPolicyStatus              | ✅    | ✅     | ✅        | ✅       |
| GetBucketRequestPayment            | ✅    | ✅     | ❌        | ❌       |
| GetBucketTagging                   | ✅    | ✅     | ✅        | ✅       |
| GetBucketVersioning                | ✅    | ✅     | ✅        | ✅       |
| GetObject                          | ✅    | ✅     | ✅        | ✅       |
| GetObjectACL                       | ✅    | ✅     | ✅        | ❌       |
| GetObjectTagging                   | ✅    | ✅     | ✅        | ✅       |
| GetObjectVersion                   | ✅    | ✅     | ✅        | ✅       |
| HeadBucket                         | ✅    | ✅     | ✅        | ✅       |
| HeadObject                         | ✅    | ✅     | ✅        | ✅       |
| ListAccessKeys                     | ✅    | ✅     | ✅        | ✅       |
| ListBucketForks                    | ✅    | ✅     | ✅        | ✅       |
| ListBucketInventoryConfigurations  | ✅    | ✅     | ❌        | ❌       |
| ListBucketSnapshots                | ✅    | ✅     | ✅        | ✅       |
| ListBuckets                        | ✅    | ✅     | ✅        | ✅       |
| ListMultipartUploads               | ✅    | ✅     | ✅        | ✅       |
| ListObjectParts                    | ✅    | ✅     | ✅        | ❌       |
| ListObjectVersions                 | ✅    | ✅     | ✅        | ✅       |
| ListObjectsV1                      | ✅    | ✅     | ✅        | ✅       |
| ListObjectsV2                      | ✅    | ✅     | ✅        | ✅       |
| NewMultipartUpload                 | ✅    | ✅     | ✅        | ❌       |
| PostPolicy                         | ✅    | ✅     | ✅        | ❌       |
| PutBucketACL                       | ✅    | ✅     | ❌        | ❌       |
| PutBucketAccelerateConfiguration   | ✅    | ✅     | ❌        | ❌       |
| PutBucketCors                      | ✅    | ✅     | ❌        | ❌       |
| PutBucketInventoryConfiguration    | ✅    | ✅     | ❌        | ❌       |
| PutBucketLifecycleConfiguration    | ✅    | ✅     | ❌        | ❌       |
| PutBucketOwnershipControls         | ✅    | ✅     | ❌        | ❌       |
| PutBucketPolicy                    | ✅    | ✅     | ❌        | ❌       |
| PutBucketTagging                   | ✅    | ✅     | ❌        | ❌       |
| PutObject                          | ✅    | ✅     | ✅        | ❌       |
| PutObjectACL                       | ✅    | ✅     | ❌        | ❌       |
| PutObjectLegalHold                 | ✅    | ✅     | ❌        | ❌       |
| PutObjectLockConfiguration         | ✅    | ✅     | ❌        | ❌       |
| PutObjectRetention                 | ✅    | ✅     | ❌        | ❌       |
| PutObjectTagging                   | ✅    | ✅     | ✅        | ❌       |
| RebaseBucketFork                   | ✅    | ✅     | ❌        | ❌       |
| RestoreBucketSnapshot              | ✅    | ✅     | ❌        | ❌       |
| RestoreObject                      | ✅    | ✅     | ✅        | ✅       |
| TigrisPreSignUrlGenerator          | ✅    | ✅     | ✅        | ✅       |
| UpdateBucket                       | ✅    | ✅     | ❌        | ❌       |
| UploadPart                         | ✅    | ✅     | ✅        | ❌       |
| UploadPartCopy                     | ✅    | ✅     | ✅        | ❌       |
| IAM:CreatePolicy                   | ✅    | ❌     | ❌        | ❌       |
| IAM:ListPolicies                   | ✅    | ❌     | ❌        | ❌       |
| IAM:ListUserPolicies               | ✅    | ❌     | ❌        | ❌       |
| IAM:AttachUserPolicy               | ✅    | ❌     | ❌        | ❌       |

The bucket owner can perform all bucket operations on their own bucket.

### IAM Policies

In addition to bucket roles, organization admins can customize access with IAM
policies. Read more about [IAM policies](/docs/iam/index.md).

# Full List of Supported S3-Compatible IAM Actions

This page lists all `s3:`-prefixed IAM actions supported by Tigris for use in
IAM policies.

Tigris is S3-compatible and supports a rich subset of the AWS S3 IAM action
model. These actions can be used within the `Action` field of your IAM policy
statements.

You can:

- Use exact action names (e.g. `s3:PutObject`)
- Use wildcards (e.g. `s3:Get*` or `s3:*`)
- Mix with conditions and resource ARNs for fine-grained access control

---

## 📋 Action Reference Table

The table below lists supported IAM policy actions and what APIs they control
(allow or deny).

| IAM action                    | Controlled APIs                                                                | Description                                                                                                                                       |
| ----------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| s3:AbortMultipartUpload       | AbortMultipartUpload                                                           | Grants permission to abort a multipart upload.                                                                                                    |
| s3:CreateBucket               | CreateBucket                                                                   | Grants permission to create a new bucket.                                                                                                         |
| s3:DeleteBucket               | DeleteBucket                                                                   | Grants permission to delete the bucket named in the URI                                                                                           |
| s3:DeleteObject               | DeleteObject, DeleteMultipleObjects                                            | Grants permission to remove the null version of an object and insert a delete marker, which becomes the current version of the object.            |
| s3:DeleteObjectTagging        | DeleteObjectTagging                                                            | Grants permission to use the tagging subresource to remove the entire tag set from the specified object.                                          |
| s3:GetAccelerateConfiguration | GetBucketAccelerateConfiguration                                               | Grants permission to uses the accelerate subresource to return the Transfer Acceleration state of a bucket, which is either Enabled or Suspended. |
| s3:GetBucketAcl               | GetBucketACL                                                                   | Grants permission to use the ACL subresource to return the access control list (ACL) of bucket.                                                   |
| s3:GetBucketCORS              | GetBucketCors                                                                  | Grants permission to return the CORS configuration information set for bucket.                                                                    |
| s3:GetBucketOwnershipControls | GetBucketOwnershipControls                                                     | Grants permission to retrieve ownership controls on a bucket.                                                                                     |
| s3:GetBucketPolicyStatus      | GetBucketPolicyStatus                                                          | Grants permission to retrieve the policy status for a specific bucket, which indicates whether the bucket is public.                              |
| s3:GetBucketRequestPayment    | GetBucketRequestPayment                                                        | Grants permission to return the request payment configuration for a bucket.                                                                       |
| s3:GetBucketTagging           | GetBucketTagging                                                               | Grants permission to return the tag set associated with a bucket.                                                                                 |
| s3:GetLifecycleConfiguration  | GetBucketLifecycleConfiguration                                                | Grants permission to return the lifecycle configuration information set on a bucket.                                                              |
| s3:GetObject                  | GetObject, HeadObject                                                          | Grants permission to retrieve objects.                                                                                                            |
| s3:GetObjectAcl               | GetObjectACL                                                                   | Grants permission to return the access control list (ACL) of an object.                                                                           |
| s3:GetObjectTagging           | GetObjectTagging                                                               | Grants permission to return the tag set of an object.                                                                                             |
| s3:ListAllMyBuckets           | ListBuckets                                                                    | Grants permission to list all buckets by the sender of the request can access.                                                                    |
| s3:ListBucket                 | ListObjectsV1, ListObjectsV2, HeadBucket                                       | Grants permission to list some or all of the objects in a bucket.                                                                                 |
| s3:ListBucketMultipartUploads | ListMultipartUploads                                                           | Grants permission to list in-progress multipart uploads.                                                                                          |
| s3:ListMultipartUploadParts   | ListObjectParts                                                                | List the parts that have been uploaded for a specific multipart upload.                                                                           |
| s3:PutAccelerateConfiguration | PutBucketAccelerateConfiguration                                               | Grants permission to use the accelerate subresource to set the Transfer Acceleration state of an existing bucket.                                 |
| s3:PutBucketAcl               | PutBucketACL                                                                   | Grants permission to set the permissions on an existing bucket using access control lists (ACLs).                                                 |
| s3:PutBucketCORS              | PutBucketCors, DeleteBucketCors                                                | Set or remove the CORS configuration of a bucket.                                                                                                 |
| s3:PutLifecycleConfiguration  | PutBucketLifecycleConfiguration, DeleteBucketLifecycleConfiguration            | Grants permission to create a new lifecycle configuration for the bucket or replace an existing lifecycle configuration.                          |
| s3:PutBucketOwnershipControls | PutBucketOwnershipControls, DeleteBucketOwnershipControls                      | Grants permission to add, replace or delete ownership controls on a bucket.                                                                       |
| s3:PutBucketTagging           | PutBucketTagging, DeleteBucketTagging                                          | Grants permission to add a set of tags to an existing bucket.                                                                                     |
| s3:PutObject                  | PutObject, CopyObject, UploadPart, NewMultipartUpload, CompleteMultipartUpload | Grants permission to add an object to a bucket.                                                                                                   |
| s3:PutObjectAcl               | PutObjectAcl                                                                   | Grants permission to set the access control list (ACL) permissions for new or existing objects in a bucket.                                       |
| s3:PutObjectTagging           | PutObjectTagging                                                               | Grants permission to set the supplied tag-set to an object that already exists in a bucket.                                                       |
| s3:RestoreObject              | RestoreObject                                                                  | Grants permission to restore an archived copy of an object.                                                                                       |

> ✅ This list reflects actions that are actively enforced and validated by
> Tigris. Using unsupported actions will result in an error during policy
> creation.

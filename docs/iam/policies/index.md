# IAM Policy Support

An IAM (Identity and Access Management) policy is a set of rules that define
permissions, specifying what actions can be performed on specific resources,
optionally with some conditions.

## Supported IAM Policy Operations

Tigris supports a subset of IAM operations that are commonly used for managing
permissions. The following operations are supported:

| Operation                 | Description                                        |
| ------------------------- | -------------------------------------------------- |
| IAM:CreatePolicy          | Creates a new IAM policy.                          |
| IAM:ListPolicies          | Lists all IAM policies.                            |
| IAM:GetPolicy             | Retrieves information about a specific IAM policy. |
| IAM:DeletePolicy          | Deletes a specific IAM policy.                     |
| IAM:AttachUserPolicy      | Attaches an IAM policy to a user.                  |
| IAM:DetachUserPolicy      | Detaches an IAM policy from a user.                |
| IAM:ListUserPolicies      | Lists all IAM policies attached to a user.         |
| IAM:GetPolicyVersion      | Retrieves a specific IAM policy version.           |
| IAM:ListEntitiesForPolicy | List entities (users only) attached to a policy.   |

Note: Tigris does not support attaching IAM policies to specific users. Instead,
policies can be attached to access keys. This applies to all other IAM policy
operations as well.

## Supported IAM Policy Blocks

Tigris supports the core set of IAM policy blocks as defined by the AWS IAM
specification.

IAM policies encompass a broad range of features. In the context of Tigris, we
support the following policy blocks:

| Block               | Supported | Description                                                                                                                                                                                                                                                                |
| ------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Version             | Yes       | Specifies the version of the policy language. The supported version is `2012-10-17`.                                                                                                                                                                                       |
| Id                  | Yes       | An optional identifier of the policy.                                                                                                                                                                                                                                      |
| Statement           | Yes       | An array of one or more statements that define the permissions.                                                                                                                                                                                                            |
| statement.sid       | Yes       | An optional identifier for the statement.                                                                                                                                                                                                                                  |
| statement.effect    | Yes       | Specifies whether the action is allowed or denied.                                                                                                                                                                                                                         |
| statement.action    | Partially | Only bucket-level or object-level actions [supported by Tigris](https://www.tigrisdata.com/docs/iam/policies/#supported-actions-in-iampolicy) are allowed. You can use exact action names (e.g., `s3:PutBucket`), wildcards (`*`), or wildcard suffixes (e.g., `s3:Put*`). |
| statement.resource  | Yes       | Specifies the Amazon Resource Name (ARN) of the resource to which the policy applies. You can use exact ARNs, wildcards (`*`), or wildcard suffixes (e.g., `arn:aws:s3:::my-bucket/images/*`).                                                                             |
| statement.condition | Partially | Tigris supports `IpAddress`, `NotIpAddress`, `DateEquals`, `DateNotEquals`, `DateGreaterThan`, `DateGreaterThanEquals`, `DateLessThan` and `DateLessThanEquals` conditions.                                                                                                |

Note that for date-time conditions - only supported variable is
`aws:CurrentTime` which represents the current time when server is processing
the request.

### Example: Valid IAM Policy

Below is an example of a minimal valid IAM policy that grants read access (list
and get) to all objects in the `images` bucket. You can use this as a template
and modify the actions, resources, or add conditions as needed for your use
case.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:ListObjectsV1", "s3:ListObjectsV2"],
      "Resource": ["arn:aws:s3:::images/*"]
    }
  ]
}
```

## Supported Actions in IAMPolicy

Tigris supports a subset of S3-compatible actions. You can use these action
names in your policy statements.

You may specify actions in your policy using their full names (for example,
s3:PutBucket), use a wildcard (\*) to allow all actions, or use wildcard
patterns (such as s3:Put\* to match all actions starting with "Put").

Below is the list of supported actions:

| IAM action                            | Mapped operations                                                              | Description                                                                                                                                      |
| ------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| s3:AbortMultipartUpload               | AbortMultipartUpload                                                           | Grants permission to abort a multipart upload                                                                                                    |
| s3:PutBucket                          | CreateBucket                                                                   | Grants permission to create a new bucket                                                                                                         |
| s3:CreateBucket                       | CreateBucket                                                                   | Grants permission to create a new bucket                                                                                                         |
| s3:NewMultipartUpload                 | NewMultipartUpload                                                             | Initiate a new multipart upload.                                                                                                                 |
| s3:CompleteMultipartUpload            | CompleteMultipartUpload                                                        | Complete a multipart upload by assembling previously uploaded parts.                                                                             |
| s3:CopyObject                         | CopyObject                                                                     | Copy an object to a new location.                                                                                                                |
| s3:CopyObjectPart                     | UploadPartCopy                                                                 | Upload a part by copying data from an existing object as part of a multipart upload.                                                             |
| s3:DeleteBucket                       | DeleteBucket                                                                   | Grants permission to delete the bucket named in the URI                                                                                          |
| s3:DeleteBucketCors                   | DeleteBucketCors                                                               | Remove the CORS configuration from a bucket.                                                                                                     |
| s3:DeleteBucketPolicy                 | DeleteBucketPolicy                                                             | Grants permission to delete the policy on a specified bucket                                                                                     |
| s3:DeleteBucketOwnershipControls      | DeleteBucketOwnershipControls                                                  | Remove ownership controls from a bucket.                                                                                                         |
| s3:DeleteBucketTagging                | DeleteBucketTagging                                                            | Remove all tags from a bucket.                                                                                                                   |
| s3:DeleteMultipleObjects              | DeleteMultipleObjects                                                          | Delete multiple objects from a bucket in a single request.                                                                                       |
| s3:DeleteObject                       | DeleteObject, DeleteMultipleObjects                                            | Grants permission to remove the null version of an object and insert a delete marker, which becomes the current version of the object            |
| s3:DeleteBucketLifecycleConfiguration | DeleteBucketLifecycleConfiguration                                             | Remove the lifecycle configuration from a bucket.                                                                                                |
| s3:DeleteObjectTagging                | DeleteObjectTagging                                                            | Grants permission to use the tagging subresource to remove the entire tag set from the specified object                                          |
| s3:GetAccelerateConfiguration         | GetBucketAccelerateConfiguration                                               | Grants permission to uses the accelerate subresource to return the Transfer Acceleration state of a bucket, which is either Enabled or Suspended |
| s3:GetBucketAccelerateConfiguration   | GetBucketAccelerateConfiguration                                               | Grants permission to uses the accelerate subresource to return the Transfer Acceleration state of a bucket, which is either Enabled or Suspended |
| s3:OpGetBucketAccelerateConfiguration | GetBucketAccelerateConfiguration                                               | Grants permission to uses the accelerate subresource to return the Transfer Acceleration state of a bucket, which is either Enabled or Suspended |
| s3:GetBucketACL                       | GetBucketACL                                                                   | Grants permission to use the acl subresource to return the access control list (ACL) of bucket                                                   |
| s3:GetBucketAcl                       | GetBucketACL                                                                   | Grants permission to use the acl subresource to return the access control list (ACL) of bucket                                                   |
| s3:GetBucketCORS                      | GetBucketCors                                                                  | Grants permission to return the CORS configuration information set for bucket                                                                    |
| s3:GetBucketCors                      | GetBucketCors                                                                  | Grants permission to return the CORS configuration information set for bucket                                                                    |
| s3:GetBucketLifecycleConfiguration    | GetBucketLifecycleConfiguration                                                | Get the lifecycle configuration of a bucket.                                                                                                     |
| s3:GetBucketLocation                  | GetBucketLocation                                                              | Grants permission to return the Region that a bucket resides in                                                                                  |
| s3:GetBucketOwnershipControls         | GetBucketOwnershipControls                                                     | Grants permission to retrieve ownership controls on a bucket                                                                                     |
| s3:OpGetBucketOwnershipControls       | GetBucketOwnershipControls                                                     | Grants permission to retrieve ownership controls on a bucket                                                                                     |
| s3:GetBucketPolicy                    | GetBucketPolicy                                                                | Grants permission to return the policy of the specified bucket                                                                                   |
| s3:GetBucketPolicyStatus              | GetBucketPolicyStatus                                                          | Grants permission to retrieve the policy status for a specific bucket, which indicates whether the bucket is public                              |
| s3:GetBucketRequestPayment            | GetBucketRequestPayment                                                        | Grants permission to return the request payment configuration for a bucket                                                                       |
| s3:GetBucketTagging                   | GetBucketTagging                                                               | Grants permission to return the tag set associated with a bucket                                                                                 |
| s3:GetBucketVersioning                | GetBucketVersioning                                                            | Grants permission to return the versioning state of a bucket                                                                                     |
| s3:GetLifecycleConfiguration          | GetBucketLifecycleConfiguration                                                | Grants permission to return the lifecycle configuration information set on a bucket                                                              |
| s3:GetObject                          | GetObject, HeadObject                                                          | Grants permission to retrieve objects                                                                                                            |
| s3:GetObjectAcl                       | GetObjectACL                                                                   | Grants permission to return the access control list (ACL) of an object                                                                           |
| s3:GetObjectACL                       | GetObjectACL                                                                   | Grants permission to return the access control list (ACL) of an object                                                                           |
| s3:GetObjectTagging                   | GetObjectTagging                                                               | Grants permission to return the tag set of an object                                                                                             |
| s3:HeadBucket                         | HeadBucket                                                                     | Retrieve metadata from a bucket without returning the bucket itself.                                                                             |
| s3:HeadObject                         | HeadObject                                                                     | Retrieve metadata from an object without returning the object itself.                                                                            |
| s3:ListAllMyBuckets                   | ListBuckets                                                                    | Grants permission to list all buckets owned by the authenticated sender of the request                                                           |
| s3:ListBucket                         | ListObjectsV1, ListObjectsV2, HeadBucket                                       | Grants permission to list some or all of the objects in a bucket (up to 1000)                                                                    |
| s3:ListObjectParts                    | ListObjectParts                                                                | List the parts that have been uploaded for a specific multipart upload.                                                                          |
| s3:ListBuckets                        | ListBuckets                                                                    | Grants permission to list all buckets owned by the authenticated sender of the request                                                           |
| s3:ListBucketMultipartUploads         | ListMultipartUploads                                                           | Grants permission to list in-progress multipart uploads                                                                                          |
| s3:ListMultipartUploadParts           | ListObjectParts                                                                | List the parts that have been uploaded for a specific multipart upload.                                                                          |
| s3:ListObjects                        | ListObjectsV1                                                                  | List objects in a bucket (version 1).                                                                                                            |
| s3:ListObjectsV1                      | ListObjectsV1                                                                  | List objects in a bucket (version 1).                                                                                                            |
| s3:ListObjectsV2                      | ListObjectsV2                                                                  | List objects in a bucket (version 2).                                                                                                            |
| s3:ListMultipartUploads               | ListMultipartUploads                                                           | Grants permission to list in-progress multipart uploads                                                                                          |
| s3:PostPolicy                         | PostPolicy                                                                     | Add a policy to a bucket using a POST request.                                                                                                   |
| s3:PutAccelerateConfiguration         | PutBucketAccelerateConfiguration                                               | Grants permission to use the accelerate subresource to set the Transfer Acceleration state of an existing bucket                                 |
| s3:PutBucketAccelerateConfiguration   | PutBucketAccelerateConfiguration                                               | Grants permission to use the accelerate subresource to set the Transfer Acceleration state of an existing bucket                                 |
| s3:PutBucketAcl                       | PutBucketACL                                                                   | Grants permission to set the permissions on an existing bucket using access control lists (ACLs)                                                 |
| s3:PutBucketACL                       | PutBucketACL                                                                   | Grants permission to set the permissions on an existing bucket using access control lists (ACLs)                                                 |
| s3:PutBucketCORS                      | PutBucketCors, DeleteBucketCors                                                | Set or remove the CORS configuration of a bucket.                                                                                                |
| s3:PutBucketCORS                      | PutBucketCors                                                                  | Grants permission to set the CORS configuration for a bucket                                                                                     |
| s3:PutBucketLifecycleConfiguration    | PutBucketLifecycleConfiguration                                                | Set the lifecycle configuration of a bucket.                                                                                                     |
| s3:PutLifecycleConfiguration          | PutBucketLifecycleConfiguration, DeleteBucketLifecycleConfiguration            | Grants permission to create a new lifecycle configuration for the bucket or replace an existing lifecycle configuration                          |
| s3:PutBucketOwnershipControls         | PutBucketOwnershipControls, DeleteBucketOwnershipControls                      | Grants permission to add, replace or delete ownership controls on a bucket                                                                       |
| s3:PutBucketPolicy                    | PutBucketPolicy                                                                | Grants permission to add or replace a bucket policy on a bucket                                                                                  |
| s3:PutBucketTagging                   | PutBucketTagging, DeleteBucketTagging                                          | Grants permission to add a set of tags to an existing bucket                                                                                     |
| s3:PutObject                          | PutObject, CopyObject, UploadPart, NewMultipartUpload, CompleteMultipartUpload | Grants permission to add an object to a bucket                                                                                                   |
| s3:PutObjectAcl                       | PutObjectAcl                                                                   | Grants permission to set the access control list (ACL) permissions for new or existing objects in a bucket                                       |
| s3:PutObjectACL                       | PutObjectAcl                                                                   | Grants permission to set the access control list (ACL) permissions for new or existing objects in a bucket                                       |
| s3:PutObjectLegalHold                 | PutObjectLegalHold                                                             | Grants permission to apply a Legal Hold configuration to the specified object                                                                    |
| s3:PutObjectLockConfiguration         | PutObjectLockConfiguration                                                     | Set the object lock configuration of a bucket.                                                                                                   |
| s3:PutObjectRetention                 | PutObjectRetention                                                             | Grants permission to place an Object Retention configuration on an object                                                                        |
| s3:PutObjectTagging                   | PutObjectTagging                                                               | Grants permission to set the supplied tag-set to an object that already exists in a bucket                                                       |
| s3:RestoreObject                      | RestoreObject                                                                  | Grants permission to restore an archived copy of an object                                                                                       |
| s3:UploadObjectPart                   | UploadPart                                                                     | Upload a part in a multipart upload.                                                                                                             |
| s3:UploadPart                         | UploadPart                                                                     | Upload a part in a multipart upload.                                                                                                             |
| s3:UploadPartCopy                     | UploadPartCopy                                                                 | Upload a part by copying data from an existing object as part of a multipart upload.                                                             |

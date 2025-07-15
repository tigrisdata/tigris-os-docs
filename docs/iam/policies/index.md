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

| IAM action                            | Mapped operations                                                              |
| ------------------------------------- | ------------------------------------------------------------------------------ |
| s3:AbortMultipartUpload               | AbortMultipartUpload                                                           |
| s3:PutBucket                          | CreateBucket                                                                   |
| s3:CreateBucket                       | CreateBucket                                                                   |
| s3:NewMultipartUpload                 | NewMultipartUpload                                                             |
| s3:CompleteMultipartUpload            | CompleteMultipartUpload                                                        |
| s3:CopyObject                         | CopyObject                                                                     |
| s3:CopyObjectPart                     | UploadPartCopy                                                                 |
| s3:DeleteBucket                       | DeleteBucket                                                                   |
| s3:DeleteBucketCors                   | DeleteBucketCors                                                               |
| s3:DeleteBucketPolicy                 | DeleteBucketPolicy                                                             |
| s3:DeleteBucketOwnershipControls      | DeleteBucketOwnershipControls                                                  |
| s3:DeleteBucketTagging                | DeleteBucketTagging                                                            |
| s3:DeleteMultipleObjects              | DeleteMultipleObjects                                                          |
| s3:DeleteObject                       | DeleteObject, DeleteMultipleObjects                                            |
| s3:DeleteBucketLifecycleConfiguration | DeleteBucketLifecycleConfiguration                                             |
| s3:DeleteObjectTagging                | DeleteObjectTagging                                                            |
| s3:GetAccelerateConfiguration         | GetBucketAccelerateConfiguration                                               |
| s3:GetBucketAccelerateConfiguration   | GetBucketAccelerateConfiguration                                               |
| s3:OpGetBucketAccelerateConfiguration | GetBucketAccelerateConfiguration                                               |
| s3:GetBucketACL                       | GetBucketACL                                                                   |
| s3:GetBucketAcl                       | GetBucketACL                                                                   |
| s3:GetBucketCORS                      | GetBucketCors                                                                  |
| s3:GetBucketCors                      | GetBucketCors                                                                  |
| s3:GetBucketLifecycleConfiguration    | GetBucketLifecycleConfiguration                                                |
| s3:GetBucketLocation                  | GetBucketLocation                                                              |
| s3:GetBucketOwnershipControls         | GetBucketOwnershipControls                                                     |
| s3:OpGetBucketOwnershipControls       | GetBucketOwnershipControls                                                     |
| s3:GetBucketPolicy                    | GetBucketPolicy                                                                |
| s3:GetBucketPolicyStatus              | GetBucketPolicyStatus                                                          |
| s3:GetBucketRequestPayment            | GetBucketRequestPayment                                                        |
| s3:GetBucketTagging                   | GetBucketTagging                                                               |
| s3:GetBucketVersioning                | GetBucketVersioning                                                            |
| s3:GetLifecycleConfiguration          | GetBucketLifecycleConfiguration                                                |
| s3:GetObject                          | GetObject, HeadObject                                                          |
| s3:GetObjectAcl                       | GetObjectACL                                                                   |
| s3:GetObjectACL                       | GetObjectACL                                                                   |
| s3:GetObjectTagging                   | GetObjectTagging                                                               |
| s3:HeadBucket                         | HeadBucket                                                                     |
| s3:HeadObject                         | HeadObject                                                                     |
| s3:ListAllMyBuckets                   | ListBuckets                                                                    |
| s3:ListBucket                         | ListObjectsV1, ListObjectsV2, HeadBucket                                       |
| s3:ListObjectParts                    | ListObjectParts                                                                |
| s3:ListBuckets                        | ListBuckets                                                                    |
| s3:ListBucketMultipartUploads         | ListMultipartUploads                                                           |
| s3:ListMultipartUploadParts           | ListObjectParts                                                                |
| s3:ListObjects                        | ListObjectsV1                                                                  |
| s3:ListObjectsV1                      | ListObjectsV1                                                                  |
| s3:ListObjectsV2                      | ListObjectsV2                                                                  |
| s3:ListMultipartUploads               | ListMultipartUploads                                                           |
| s3:PostPolicy                         | PostPolicy                                                                     |
| s3:PutAccelerateConfiguration         | PutBucketAccelerateConfiguration                                               |
| s3:PutBucketAccelerateConfiguration   | PutBucketAccelerateConfiguration                                               |
| s3:PutBucketAcl                       | PutBucketACL                                                                   |
| s3:PutBucketACL                       | PutBucketACL                                                                   |
| s3:PutBucketCORS                      | PutBucketCors, DeleteBucketCors                                                |
| s3:PutBucketCors                      | PutBucketCors                                                                  |
| s3:PutBucketLifecycleConfiguration    | PutBucketLifecycleConfiguration                                                |
| s3:PutLifecycleConfiguration          | PutBucketLifecycleConfiguration, DeleteBucketLifecycleConfiguration            |
| s3:PutBucketOwnershipControls         | PutBucketOwnershipControls, DeleteBucketOwnershipControls                      |
| s3:PutBucketPolicy                    | PutBucketPolicy                                                                |
| s3:PutBucketTagging                   | PutBucketTagging, DeleteBucketTagging                                          |
| s3:PutObject                          | PutObject, CopyObject, UploadPart, NewMultipartUpload, CompleteMultipartUpload |
| s3:PutObjectAcl                       | PutObjectAcl                                                                   |
| s3:PutObjectACL                       | PutObjectAcl                                                                   |
| s3:PutObjectLegalHold                 | PutObjectLegalHold                                                             |
| s3:PutObjectLockConfiguration         | PutObjectLockConfiguration                                                     |
| s3:PutObjectRetention                 | PutObjectRetention                                                             |
| s3:PutObjectTagging                   | PutObjectTagging                                                               |
| s3:RestoreObject                      | RestoreObject                                                                  |
| s3:UploadObjectPart                   | UploadPart                                                                     |
| s3:UploadPart                         | UploadPart                                                                     |
| s3:UploadPartCopy                     | UploadPartCopy                                                                 |

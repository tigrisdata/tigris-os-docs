# S3 API Compatibility

Tigris is compatible with the AWS S3 API. This means that you can use the
standard AWS S3 SDKs, tool and libraries with Tigris.

This section covers Tigris’ S3 API compatibility. The complete list of S3 APIs
are listed in the
[AWS S3 documentation](https://docs.aws.amazon.com/AmazonS3/latest/API/API_Operations_Amazon_Simple_Storage_Service.html).

## Bucket-level S3 APIs

Below is the list of standard Bucket-level S3 APIs and their compatibility
status within Tigris.

| S3 API                                                                                                                            | Supported in Tigris                                                   |
| --------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| [CreateBucket](https://docs.aws.amazon.com/AmazonS3/latest/API/API_CreateBucket.html)                                             | Yes                                                                   |
| [DeleteBucket](https://docs.aws.amazon.com/AmazonS3/latest/API/API_DeleteBucket.html)                                             | Yes                                                                   |
| [DeleteBucketCors](https://docs.aws.amazon.com/AmazonS3/latest/API/API_DeleteBucketCors.html)                                     | Yes                                                                   |
| [DeleteBucketEncryption](https://docs.aws.amazon.com/AmazonS3/latest/API/API_DeleteBucketEncryption.html)                         | Currently, only server-side encryption with managed keys is supported |
| [DeleteBucketLifecycle](https://docs.aws.amazon.com/AmazonS3/latest/API/API_DeleteBucketLifecycle.html)                           | No                                                                    |
| [DeleteBucketOwnershipControls](https://docs.aws.amazon.com/AmazonS3/latest/API/API_DeleteBucketOwnershipControls.html)           | Yes                                                                   |
| [DeleteBucketReplication](https://docs.aws.amazon.com/AmazonS3/latest/API/API_DeleteBucketReplication.html)                       | Replication of buckets is handled automatically                       |
| [DeleteBucketTagging](https://docs.aws.amazon.com/AmazonS3/latest/API/API_DeleteBucketTagging.html)                               | Yes                                                                   |
| [GetBucketAccelerateConfiguration](https://docs.aws.amazon.com/AmazonS3/latest/API/API_GetBucketAccelerateConfiguration.html)     | Yes                                                                   |
| [GetBucketCors](https://docs.aws.amazon.com/AmazonS3/latest/API/API_GetBucketCors.html)                                           | Yes                                                                   |
| [GetBucketEncryption](https://docs.aws.amazon.com/AmazonS3/latest/API/API_GetBucketEncryption.html)                               | Currently, only server-side encryption with managed keys is supported |
| [GetBucketLifecycle](https://docs.aws.amazon.com/AmazonS3/latest/API/API_GetBucketLifecycle.html)                                 | No                                                                    |
| [GetBucketLifecycleConfiguration](https://docs.aws.amazon.com/AmazonS3/latest/API/API_GetBucketLifecycleConfiguration.html)       | No                                                                    |
| [GetBucketLocation](https://docs.aws.amazon.com/AmazonS3/latest/API/API_GetBucketLocation.html)                                   | Bucket location is automatically configured                           |
| [GetBucketNotification](https://docs.aws.amazon.com/AmazonS3/latest/API/API_GetBucketNotification.html)                           | No                                                                    |
| [GetBucketNotificationConfiguration](https://docs.aws.amazon.com/AmazonS3/latest/API/API_GetBucketNotificationConfiguration.html) | No                                                                    |
| [GetBucketOwnershipControls](https://docs.aws.amazon.com/AmazonS3/latest/API/API_GetBucketOwnershipControls.html)                 | Yes                                                                   |
| [GetBucketPolicyStatus](https://docs.aws.amazon.com/AmazonS3/latest/API/API_GetBucketPolicyStatus.html)                           | Yes                                                                   |
| [GetBucketReplication](https://docs.aws.amazon.com/AmazonS3/latest/API/API_GetBucketReplication.html)                             | Replication of buckets is handled automatically                       |
| [GetBucketTagging](https://docs.aws.amazon.com/AmazonS3/latest/API/API_GetBucketTagging.html)                                     | Yes                                                                   |
| [GetBucketVersioning](https://docs.aws.amazon.com/AmazonS3/latest/API/API_GetBucketVersioning.html)                               | No                                                                    |
| [HeadBucket](https://docs.aws.amazon.com/AmazonS3/latest/API/API_HeadBucket.html)                                                 | Yes                                                                   |
| [ListBuckets](https://docs.aws.amazon.com/AmazonS3/latest/API/API_ListBuckets.html)                                               | Yes                                                                   |
| [PutBucketAccelerateConfiguration](https://docs.aws.amazon.com/AmazonS3/latest/API/API_PutBucketAccelerateConfiguration.html)     | Yes                                                                   |
| [PutBucketCors](https://docs.aws.amazon.com/AmazonS3/latest/API/API_PutBucketCors.html)                                           | Yes                                                                   |
| [PutBucketEncryption](https://docs.aws.amazon.com/AmazonS3/latest/API/API_PutBucketEncryption.html)                               | Currently, only server-side encryption with managed keys is supported |
| [PutBucketLifecycle](https://docs.aws.amazon.com/AmazonS3/latest/API/API_PutBucketLifecycle.html)                                 | No                                                                    |
| [PutBucketLifecycleConfiguration](https://docs.aws.amazon.com/AmazonS3/latest/API/API_PutBucketLifecycleConfiguration.html)       | No                                                                    |
| [PutBucketNotification](https://docs.aws.amazon.com/AmazonS3/latest/API/API_PutBucketNotification.html)                           | No                                                                    |
| [PutBucketNotificationConfiguration](https://docs.aws.amazon.com/AmazonS3/latest/API/API_PutBucketNotificationConfiguration.html) | No                                                                    |
| [PutBucketOwnershipControls](https://docs.aws.amazon.com/AmazonS3/latest/API/API_PutBucketOwnershipControls.html)                 | Yes                                                                   |
| [PutBucketReplication](https://docs.aws.amazon.com/AmazonS3/latest/API/API_PutBucketReplication.html)                             | Replication of buckets is handled automatically                       |
| [PutBucketTagging](https://docs.aws.amazon.com/AmazonS3/latest/API/API_PutBucketTagging.html)                                     | Yes                                                                   |
| [PutBucketVersioning](https://docs.aws.amazon.com/AmazonS3/latest/API/API_PutBucketVersioning.html)                               | No                                                                    |

## Object-level S3 APIs

Below is the list of standard Object-level S3 APIs and their compatibility
status within Tigris.

| S3 API                                                                                                            | Supported in Tigris |
| ----------------------------------------------------------------------------------------------------------------- | ------------------- |
| [AbortMultipartUpload](https://docs.aws.amazon.com/AmazonS3/latest/API/API_AbortMultipartUpload.html)             | Yes                 |
| [CompleteMultipartUpload](https://docs.aws.amazon.com/AmazonS3/latest/API/API_CompleteMultipartUpload.html)       | Yes                 |
| [CopyObject](https://docs.aws.amazon.com/AmazonS3/latest/API/API_CopyObject.html)                                 | Yes                 |
| [CreateMultipartUpload](https://docs.aws.amazon.com/AmazonS3/latest/API/API_CreateMultipartUpload.html)           | Yes                 |
| [DeleteObject](https://docs.aws.amazon.com/AmazonS3/latest/API/API_DeleteObject.html)                             | Yes                 |
| [DeleteObjects](https://docs.aws.amazon.com/AmazonS3/latest/API/API_DeleteObjects.html)                           | Yes                 |
| [DeleteObjectTagging](https://docs.aws.amazon.com/AmazonS3/latest/API/API_DeleteObjectTagging.html)               | Yes                 |
| [GetObject](https://docs.aws.amazon.com/AmazonS3/latest/API/API_GetObject.html)                                   | Yes                 |
| [GetObjectAttributes](https://docs.aws.amazon.com/AmazonS3/latest/API/API_GetObjectAttributes.html)               | No                  |
| [GetObjectLegalHold](https://docs.aws.amazon.com/AmazonS3/latest/API/API_GetObjectLegalHold.html)                 | No                  |
| [GetObjectLockConfiguration](https://docs.aws.amazon.com/AmazonS3/latest/API/API_GetObjectLockConfiguration.html) | No                  |
| [GetObjectRetention](https://docs.aws.amazon.com/AmazonS3/latest/API/API_GetObjectRetention.html)                 | No                  |
| [GetObjectTagging](https://docs.aws.amazon.com/AmazonS3/latest/API/API_GetObjectTagging.html)                     | Yes                 |
| [HeadObject](https://docs.aws.amazon.com/AmazonS3/latest/API/API_HeadObject.html)                                 | Yes                 |
| [ListMultipartUploads](https://docs.aws.amazon.com/AmazonS3/latest/API/API_ListMultipartUploads.html)             | Yes                 |
| [ListObjects](https://docs.aws.amazon.com/AmazonS3/latest/API/API_ListObjects.html)                               | Yes                 |
| [ListObjectsV2](https://docs.aws.amazon.com/AmazonS3/latest/API/API_ListObjectsV2.html)                           | Yes                 |
| [ListObjectVersions](https://docs.aws.amazon.com/AmazonS3/latest/API/API_ListObjectVersions.html)                 | No                  |
| [ListParts](https://docs.aws.amazon.com/AmazonS3/latest/API/API_ListParts.html)                                   | Yes                 |
| [PutObject](https://docs.aws.amazon.com/AmazonS3/latest/API/API_PutObject.html)                                   | Yes                 |
| [PutObjectLegalHold](https://docs.aws.amazon.com/AmazonS3/latest/API/API_PutObjectLegalHold.html)                 | No                  |
| [PutObjectLockConfiguration](https://docs.aws.amazon.com/AmazonS3/latest/API/API_PutObjectLockConfiguration.html) | No                  |
| [PutObjectRetention](https://docs.aws.amazon.com/AmazonS3/latest/API/API_PutObjectRetention.html)                 | No                  |
| [PutObjectTagging](https://docs.aws.amazon.com/AmazonS3/latest/API/API_PutObjectTagging.html)                     | Yes                 |
| [RestoreObject](https://docs.aws.amazon.com/AmazonS3/latest/API/API_RestoreObject.html)                           | No                  |
| [SelectObjectContent](https://docs.aws.amazon.com/AmazonS3/latest/API/API_SelectObjectContent.html)               | No                  |
| [UploadPart](https://docs.aws.amazon.com/AmazonS3/latest/API/API_UploadPart.html)                                 | Yes                 |
| [UploadPartCopy](https://docs.aws.amazon.com/AmazonS3/latest/API/API_UploadPartCopy.html)                         | Yes                 |

## IAM APIs

Below is the list of IAM APIs supported in Tigris. Note that IAM APIs are served
at `https://fly.storage.tigris.dev:8009` for now.

| IAM API                                                                                           | Supported in Tigris |
| ------------------------------------------------------------------------------------------------- | ------------------- |
| [CreateAccessKey](https://docs.aws.amazon.com/IAM/latest/APIReference/API_CreateAccessKey.html)   | Yes                 |
| [ListAccessKeys](https://docs.aws.amazon.com/IAM/latest/APIReference/API_ListAccessKeys.html)     | Yes                 |
| [UpdateAccessKey](https://docs.aws.amazon.com/IAM/latest/APIReference/API_UpdateAccessKey.html)   | Yes                 |
| [DeleteAccessKey](https://docs.aws.amazon.com/IAM/latest/APIReference/API_DeleteAccessKey.html)   | Yes                 |
| [CreatePolicy](https://docs.aws.amazon.com/IAM/latest/APIReference/API_CreatePolicy.html)         | Yes                 |
| [ListPolicies](https://docs.aws.amazon.com/IAM/latest/APIReference/API_ListPolicies.html)         | Yes                 |
| [GetPolicy](https://docs.aws.amazon.com/IAM/latest/APIReference/API_GetPolicy.html)               | Yes                 |
| [AttachUserPolicy](https://docs.aws.amazon.com/IAM/latest/APIReference/API_AttachUserPolicy.html) | Yes                 |
| [ListUserPolicies](https://docs.aws.amazon.com/IAM/latest/APIReference/API_ListUserPolicies.html) | Yes                 |
| [DeleteUserPolicy](https://docs.aws.amazon.com/IAM/latest/APIReference/API_DeleteUserPolicy.html) | Yes                 |

## CloudFront APIs

| CloudFront API                                                                                         | Supported in Tigris |
| ------------------------------------------------------------------------------------------------------ | ------------------- |
| [CreatePublicKey](https://docs.aws.amazon.com/cloudfront/latest/APIReference/API_CreatePublicKey.html) | Yes                 |
| [GetPublicKey](https://docs.aws.amazon.com/cloudfront/latest/APIReference/API_GetPublicKey.html)       | Yes                 |
| [DeletePublicKey](https://docs.aws.amazon.com/cloudfront/latest/APIReference/API_DeletePublicKey.html) | Yes                 |
| [ListPublicKeys](https://docs.aws.amazon.com/cloudfront/latest/APIReference/API_ListPublicKeys.html)   | Yes                 |

## Next steps

Check out the [language specific guides](../../sdks/s3/) on how to use the AWS
S3 SDKs with Tigris.

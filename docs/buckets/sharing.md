# Sharing Buckets

Tigris allows you to share buckets with other users from your organization or
with users from other organizations. This feature allows you to collaborate with
other users and organizations without having to create multiple buckets.

## Sharing to another user in an organization

To share a bucket to another user in your organization, you need to have the
necessary permissions.

If you are the bucket owner, you can share the bucket with other users from your
organization. If you are an admin, you can share any bucket from your
organization with other users in that organization.

To share a bucket with another user in your organization:

- Go to the [Tigris Dashboard](https://console.tigris.dev).
- Click on the bucket you want to share.
- Click on the `Share` button.
- Select the users you want to share the bucket with and the role you want to
  assign to them.
- Click on the `Save` button.

The roles you can assign to the users are:

- `Read Only`: The user can read the content of the bucket
- `Editor`: The user can read and write the content of the bucket

Once the bucket is shared, the users you shared it with will be able to see it
in their dashboard and access its content based on the role you assigned. The
users will also be able to create access keys for the shared bucket to access
that bucket programmatically.

When the share is revoked, the access keys created by the shared users will no
longer have access to the bucket.

## Sharing with your entire organization

You can also share your buckets with your entire organization.

To share a bucket with all users in your organization:

- Go to the [Tigris Dashboard](https://console.tigris.dev).
- Click on the bucket you want to share.
- Click on the `Share` button.
- Modify the "Organization Access" settings to your desired permissions (Editor
  or Read Only).
- Click on the `Save` button.

Once the bucket is shared, all users in the organization will be able to see it
in their dashboard and access its content based on the role you assigned. Users
will also be able to create access keys for the shared bucket to access that
bucket programmatically.

When the share is revoked, the access keys created by other users in your
organization will no longer have access to the bucket.

## Sharing with another organization

Tigris allows you to share a bucket with users from another organization. This
feature is useful when you need to collaborate with users from another
organization. The sharing is limited to access keys from the other organization.

To share a bucket with users from another organization:

- Receive the access key ID (starts with `tid_`) from the user outside your
  organization you want to share the bucket.
- Go to the [Tigris Dashboard](https://console.tigris.dev).
- Click on the bucket you want to share.
- Click on the `Share` button.
- Expand the `External Sharing` section.
- Enter the access key (starts with `tid_`) in the text box.
- Click "Add External ID" to add the access key ID to the list. It should have
  the role `External`.
- Click on the `Save` button at the top of the dialogue.

Once the bucket is shared, the user from the other organization will be able to
access the bucket using the access key.

### External permissions

An external user (internally referred to as an `ExternalCollaborator`) has most
of the same permissions as a bucket Editor does, but without any administrative
permissions (e.g. deleting the bucket).

<details>
<summary>Full list of permissions</summary>

- Abort multipart uploads (`AbortMultipartUpload`)
- Complete multipart uploads (`CompleteMultipartUpload`)
- Copy or rename objects (`CopyObject`)
- Copy uploaded parts (`UploadPartCopy`)
- Delete multiple objects (`DeleteMultipleObjects`)
- Delete objects (`DeleteObject`)
- Delete object tagging (`DeleteObjectTagging`)
- Get bucket ACL (`GetBucketACL`)
- Get bucket CORS configuration (`GetBucketCors`)
- Get bucket lifecycle configuration (`GetBucketLifecycleConfiguration`)
- Get bucket location (`GetBucketLocation`)
- Get bucket ownership controls (`GetBucketOwnershipControls`)
- Get bucket policy (`GetBucketPolicy`)
- Get bucket policy status (`GetBucketPolicyStatus`)
- Get bucket request payment configuration (`GetBucketRequestPayment`)
- Get bucket tagging (`GetBucketTagging`)
- Get bucket versioning (`GetBucketVersioning`)
- Get objects (`GetObject`)
- Get object ACL (`GetObjectACL`)
- Get object tagging (`GetObjectTagging`)
- Head bucket (`HeadBucket`)
- Head object (`HeadObject`)
- List access keys (`ListAccessKeys`)
- List multipart uploads (`ListMultipartUploads`)
- List object parts (`ListObjectParts`)
- List objects (V1) (`ListObjectsV1`)
- List objects (V2) (`ListObjectsV2`)
- Start new multipart uploads (`NewMultipartUpload`)
- Get bucket accelerate configuration (`GetBucketAccelerateConfiguration`)
- Use POST policy (`PostPolicy`)
- Put bucket CORS configuration (`PutBucketCors`)
- Put bucket lifecycle configuration (`PutBucketLifecycleConfiguration`)
- Put bucket policy (`PutBucketPolicy`)
- Put bucket tagging (`PutBucketTagging`)
- Put objects (`PutObject`)
- Put object ACL (`PutObjectAcl`)
- Put object tagging (`PutObjectTagging`)
- Upload parts (`UploadPart`)
- Restore objects (`RestoreObject`)
- Put object lock configuration (`PutObjectLockConfiguration`)

</details>

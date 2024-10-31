# Storage Tiers

Tigris offers object storage tiers to optimize storage costs based on the access
patterns of your data. There are three storage tiers available:

- Standard
- Infrequent Access
- Archive

## Standard tier

The default storage tier. It provides high durability, availability, and
performance for frequently accessed data.

## Infrequent Access tier

Lower-cost storage for data that is accessed less frequently but requires rapid
access when needed.

## Archive tier

Low-cost storage for data archiving with infrequent access. The data is not
immediately available for access and requires restoration before it can be
accessed. Restoration time is typically around 1 hour.

## Setting object tier

Tigris allows setting the storage tier at both the bucket and object level. The
default tier for all objects stored in a particular bucket can be specified in
the [bucket configuration](../buckets/create-bucket.md#bucket-tier) during
bucket creation time. If no tier is provided at bucket creation time, it
defaults to Standard.

The object tier can also be set during PUT Object requests to override the
bucket's default tier. To set the object tier:

- use the `--storage-class` flag with the `put-object` AWS CLI or corresponding
  field of PutObject, CreateMultipartUpload SDK APIs input, or
- set the `x-amz-storage-class` header when using the REST API.

Tigris accepts S3 compatible storage classes:

- STANDARD: for Standard tier
- STANDARD_IA: for Infrequent Access tier
- GLACIER: for Archive tier

### Example with AWS CLI

```bash
aws s3api put-object --bucket my-bucket --key my-object.txt --body bar.txt --storage-class STANDARD_IA
```

### Example with REST API

```http
PUT /my-object.txt HTTP/1.1
Host: my-bucket.storage.fly.tigris.dev
x-amz-storage-class: STANDARD_IA
```

## Restoring objects from Archive tier

Objects written to the Archive storage class are not immediately available for
access. Get requests for objects in the Archive storage class will return 403
(InvalidObjectState) error. To restore objects from the Archive storage class,
initiate a restore request.

### Initiate restore request

```bash
aws s3api restore-object --bucket my-bucket --key 'my-archive-object.txt' --restore-request Days=3
```

The `Days` parameter specifies the number of days the restored object will be
available for access. After the specified number of days, the object will be
moved back to the Archive storage class.

### Check restore status

```bash
aws s3api head-object --bucket my-bucket --key 'my-archive-object.txt'
```

Ongoing restore requests will have the `Restore: ongoing-request="true"` header
in the response. Once the restore is complete, the `Restore` header will contain
the expiry date when the object will be moved back to the Archive storage class:

```json
{
  "Restore": "ongoing-request=\"false\" expiry-date=\"Fri, 01 Nov 2024 02:00:00 GMT\"",
  "StorageClass": "GLACIER"
}
```

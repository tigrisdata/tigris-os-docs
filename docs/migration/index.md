# Migrating from a S3-compatible bucket

Tigris allows you to incrementally migrate the data from an existing S3 or a
compatible bucket via the `fly storage` command. This allows you to
transparently move your data from an existing S3-compatible storage to Tigris
without any **downtime**.

## How it works

When creating a new bucket, you can specify the bucket from where the data
should be migrated. We call this the **shadow bucket**.

This is how the process works:

- When you upload a new object to the Tigris bucket, it is first uploaded to the
  shadow bucket and then copied to the Tigris bucket. This ensures that the data
  is always available in the shadow bucket and is eventually consistent in the
  Tigris bucket.
- When you request an object, we first check if the object exists in the Tigris
  bucket. If it does, we return it. If it doesn't, we check the shadow bucket
  and return the object from there. Then we copy the object to the Tigris bucket
  so that it is available for future requests.
- The objects stored in the Tigris bucket are automatically stored in the region
  closest to the user.
- When you delete an object we delete it from the Tigris bucket, as well as the
  shadow bucket.

## Amazon S3

### Starting the migration

#### Using a new Tigris bucket as the migration target

When creating a new bucket, you can specify the bucket from where the data
should be migrated. We call this the shadow bucket. This is how you can create a
new bucket with a shadow bucket:

```bash
flyctl storage create -n {{tigris-bucket-name}} -o {{your-fly-org}} \
    --shadow-access-key {{s3_access_key}} --shadow-secret-key {{s3_secret_key}} \
    --shadow-endpoint https://s3.us-east-1.amazonaws.com --shadow-region us-east-1 \
    --shadow-name {{your-s3-bucket}} --shadow-write-through
```

This will create a new bucket `tigris-bucket-name` in the organization
`your-fly-org` and will migrate the data from the S3 bucket `your-s3-bucket` as
the requests come in.

The endpoint and region are provider specific and should be set accordingly. You
can find the endpoint and region for AWS S3 in the
[AWS documentation](https://docs.aws.amazon.com/general/latest/gr/s3.html).

#### Using an existing Tigris bucket as the migration target

You can also migrate the data to an existing Tigris bucket. This is how you can
update an existing bucket to use the shadow bucket feature:

```bash
flyctl storage update {{tigris-bucket-name}} \
    --shadow-access-key {{s3_access_key}} --shadow-secret-key {{s3_secret_key}} \
    --shadow-endpoint https://s3.us-east-1.amazonaws.com --shadow-region us-east-1 \
    --shadow-name {{your-s3-bucket}} --shadow-write-through
```

This will update the bucket `tigris-bucket-name` settings so that Tigris will
migrate the data from the S3 bucket `your-s3-bucket` as the requests come in.

### Finishing the migration

Once you are confident that all the objects have been migrated, you can stop the
migration by removing the shadow bucket. This will stop the objects from being
read from or written to the shadow bucket. Any subsequent requests will only
read from and write to the Tigris bucket.

```bash
flyctl storage update {{tigris-bucket-name}} --clear-shadow
```

## Google Cloud Storage

Google Cloud Storage (GCS) offers interoperability with the Amazon Simple
Storage Service (S3) API, so GCS bucket can be configured as a shadow bucket.
Information which needs to be gathered from Google Cloud Console is:

- Endpoint
- Region
- Bucket name
- Access key
- Secret key

### Endpoint

Endpoint for GCS is fixed and it is:

```
https://storage.googleapis.com
```

### Region

There is no distinction by region so it should always be set as `auto`.

### Access key and Secret key

Navigate to
[Google Cloud Console interoperability](https://console.cloud.google.com/storage/settings;tab=interoperability)
page. On that page create new service account and new HMAC key or create new
HMAC key for the existing account. Make sure that account have permission to
access the bucket.

### Bucket name

Use GCS bucket name which should be used to read object from and write.

### Creating the Tigris bucket and starting the migration

Once information is gathered the following is complete command to run to enable
shadow bucket on the Tigris bucket creation:

```bash
flyctl storage create -n {{to-be-created-tigris-bucket-name}} -o {{your-fly-org}} \
--shadow-access-key {{gcs_access_key}} --shadow-secret-key {{gcs_secret_key}} \
--shadow-endpoint https://storage.googleapis.com --shadow-region auto \
--shadow-name {{gcs-bucket-name}} --shadow-write-through
```

### Finishing the migration

Once you are confident that all the objects have been migrated, you can stop the
migration by removing the shadow bucket configuration. This will stop the
objects from being read from or written to the shadow bucket. Any subsequent
requests will only read from and write to the Tigris bucket.

```bash
flyctl storage update {{tigris-bucket-name}} --clear-shadow
```

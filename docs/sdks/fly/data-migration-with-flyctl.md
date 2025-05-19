# Migrate Data to Tigris with Flyctl

## Migrate from Amazon Simple Storage Service (S3)

### Use a new Tigris bucket for data migration

When creating a new Tigris bucket, you can specify the source bucket from where
the data is migrated. We call this the shadow bucket. This is how you can create
a new Tigris bucket with an AWS S3 shadow bucket using `flyctl`:

```bash
flyctl storage create -n {{tigris-bucket-name}} -o {{your-fly-org}} \
        --shadow-access-key {{s3_access_key}} --shadow-secret-key {{s3_secret_key}} \
        --shadow-endpoint https://s3.us-east-1.amazonaws.com --shadow-region us-east-1 \
        --shadow-name {{your-s3-bucket}} --shadow-write-through
```

This command will create a new bucket `tigris-bucket-name` in the organization
`your-fly-org` and will migrate the data from the S3 bucket `your-s3-bucket` as
data is requested.

The endpoint and region are provider specific and should be set accordingly. You
can find the endpoint and region for AWS S3 in the
[AWS documentation](https://docs.aws.amazon.com/general/latest/gr/s3.html).

### Use an existing Tigris bucket for data migration

You can also migrate the data to an existing Tigris bucket. This is how you can
update an existing bucket to use the shadow bucket feature using `flyctl`:

```bash
flyctl storage update {{tigris-bucket-name}} \
        --shadow-access-key {{s3_access_key}} --shadow-secret-key {{s3_secret_key}} \
        --shadow-endpoint https://s3.us-east-1.amazonaws.com --shadow-region us-east-1 \
        --shadow-name {{your-s3-bucket}} --shadow-write-through
```

This command will update the bucket `tigris-bucket-name` settings so that Tigris
will migrate the data from the S3 bucket `your-s3-bucket` as data is requested.

### Finishing the migration

Once you are confident that all the objects have been migrated, you can stop the
migration by removing the shadow bucket from the bucket settings. This will stop
the objects from being read from or written to the shadow bucket. Any subsequent
requests will only read from and write to the Tigris bucket.

```bash
flyctl storage update {{tigris-bucket-name}} --clear-shadow
```

## Migrate from Google Cloud Storage (GCS)

### Use a new Tigris bucket for data migration

When creating a new Tigris bucket, you can specify the source bucket from where
the data is migrated. We call this the shadow bucket. This is how you can create
a new Tigris bucket with a GCS shadow bucket using `flyctl`:

```bash
flyctl storage create -n {{to-be-created-tigris-bucket-name}} -o {{your-fly-org}} \
--shadow-access-key {{gcs_access_key}} --shadow-secret-key {{gcs_secret_key}} \
--shadow-endpoint https://storage.googleapis.com --shadow-region auto \
--shadow-name {{gcs-bucket-name}} --shadow-write-through
```

GCS does not require a region, so the command sets the `--shadow-region` as
`auto` and uses the general endpoint, `https://storage.googleapis.com`.

### Use an existing Tigris bucket for data migration

You can also migrate the data to an existing Tigris bucket. This is how you can
update an existing bucket to use the shadow bucket feature using `flyctl`:

```bash
flyctl storage update {{tigris-bucket-name}} \
        --shadow-access-key {{gcs_access_key}} --shadow-secret-key {{gcs_secret_key}} \
        --shadow-endpoint https://storage.googleapis.com --shadow-region auto \
        --shadow-name {{gcs-bucket-name}} --shadow-write-through
```

This command will update the bucket `tigris-bucket-name` settings so that Tigris
will migrate the data from the GCS bucket `gcs-bucket-name` as data is
requested.

### Create Google Cloud Storage Access Keys for Migration

To migrate data from Google Cloud Storage (GCS) to an S3-compatible service like
Tigris, you'll need to generate **HMAC credentials** (access key and secret key)
for a GCS service account:

- Go to the
  [Google Cloud Console Interoperability page](https://console.cloud.google.com/storage/settings;tab=interoperability).
- If you don’t already have a service account with access to your GCS bucket,
  create one in the
  [IAM & Admin section](https://console.cloud.google.com/iam-admin/serviceaccounts)
  and assign it the necessary permissions (such as `Storage Object Viewer`,
  `Storage Object Admin`, or `Storage Admin`).
- On the Interoperability page, find the service account and click `Create Key`
  under the `HMAC Keys` section to generate an access key and secret.
- Copy and securely store the access key and secret key for use when configuring
  Tigris.
- Make sure the service account has permission to access the GCS bucket you want
  to migrate from.

### Finishing the migration

Once you are confident that all the objects have been migrated, you can stop the
migration by removing the shadow bucket configuration. This will stop the
objects from being read from or written to the shadow bucket. Any subsequent
requests will only read from and write to the Tigris bucket.

```bash
flyctl storage update {{tigris-bucket-name}} --clear-shadow
```

## Migrate from Cloudflare R2

### Use a new Tigris bucket for data migration

When creating a new Tigris bucket, you can specify the source bucket from where
the data is migrated. We call this the shadow bucket. This is how you can create
a new Tigris bucket with a Cloudflare R2 shadow bucket using `flyctl`:

```bash
flyctl storage create -n {{to-be-created-tigris-bucket-name}} -o {{your-fly-org}} \
--shadow-access-key {{r2_access_key}} --shadow-secret-key {{r2_secret_key}} \
--shadow-endpoint https://{{account-id}}.r2.cloudflarestorage.com --shadow-region auto \
--shadow-name {{r2-bucket-name}} --shadow-write-through
```

Cloudflare R2 uses a custom endpoint format that includes your account ID.
Replace `account-id` with your Cloudflare account ID. R2 does not require a
specific region, so `--shadow-region` is set to `auto`.

### Use an existing Tigris bucket for data migration

You can also migrate the data to an existing Tigris bucket. This is how you can
update an existing bucket to use the shadow bucket feature using `flyctl`:

```bash
flyctl storage update {{tigris-bucket-name}} \
  --shadow-access-key {{r2_access_key}} --shadow-secret-key {{r2_secret_key}} \
  --shadow-endpoint https://{{account-id}}.r2.cloudflarestorage.com --shadow-region auto \
  --shadow-name {{r2-bucket-name}} --shadow-write-through
```

This command updates the `tigris-bucket-name` settings so that Tigris will
migrate data from the Cloudflare R2 bucket `r2-bucket-name` as data is
requested.

### Finishing the migration

Once you are confident that all the objects have been migrated, you can stop the
migration by removing the shadow bucket configuration. This will stop the
objects from being read from or written to the shadow bucket. Any subsequent
requests will only read from and write to the Tigris bucket.

```bash
flyctl storage update {{tigris-bucket-name}} --clear-shadow
```

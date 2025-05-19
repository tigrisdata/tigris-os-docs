# Data Migration

Tigris supports a _lazy migration_ approach that minimizes upfront data transfer
and allows you to seamlessly adopt Tigris without disrupting existing workflows.
Once you've specified your **shadow bucket**—the source S3-compatible
bucket—Tigris automatically begins handling requests in a way that ensures data
is gradually migrated as it is accessed. Common S3-compatible storage options
include AWS S3, Google Cloud Storage (GCS), and Cloudflare R2, all of which work
seamlessly with Tigris.

This approach is ideal for large-scale migrations where copying all data at once
would be time-consuming or cost-prohibitive due to egress fees. Instead of
migrating everything up front, Tigris fetches objects from the shadow bucket
only when requested and copies them into your Tigris bucket asynchronously. This
ensures that only actively used data is migrated, reducing both latency and
cost.

If you enable the optional `write-through` setting, Tigris writes all new
objects to both the shadow bucket and the Tigris bucket. This keeps the shadow
bucket up to date and allows for a gradual, reversible migration path that gives
you full control over the timing of a complete cutover. This strategy is
especially useful for hybrid or multi-cloud setups where eliminating
**downtime** is essential.

Here’s how Tigris handles data migration under the hood:

- When an object is requested, we first check the Tigris bucket. If it’s not
  found, we fetch it from the shadow bucket, return it, and asynchronously copy
  it to Tigris for future access.
- When uploading an object, it’s first written to the shadow bucket, then copied
  to the Tigris bucket to ensure the data is available in the shadow bucket and
  eventually consistent in the Tigris bucket.
- Objects in the Tigris bucket are stored in the region closest to the user.
- When an object is deleted, it’s removed from both the Tigris and shadow
  buckets.

## Enable Data Migration in the Tigris Dashboard

To enable data migration from a S3-Compatible bucket:

- Go to the [Tigris Dashboard](https://console.tigris.dev).
- Click on `Buckets` in the left menu.
- Click on the bucket to which you wish to migrate data.
- Click `Settings`.
- Find the `Enable Data Migration` setting and enable the toggle.
- Provide the access details for your source bucket, or `Shadow Bucket`.

![Shadow bucket migration](./shadow-bucket-migration.webp)

<!-- prettier-ignore -->
:::note

Though Tigris supports a
[single global endpoint](https://www.tigrisdata.com/docs/overview/#features-of-tigris),
other storage services may require you to specify a regional endpoint. You can
find documentation on which endpoint to utilize here:

- [AWS S3 Endpoint Documentation](https://docs.aws.amazon.com/general/latest/gr/s3.html)
  generally uses `https://s3.<region>.amazonaws.com`
- [Google Cloud Storage Endpoint Documentation](https://cloud.google.com/storage/docs/request-endpoints)
  generally uses `https://storage.googleapis.com`
- Cloudflare R2 uses an account specific endpoint,
  `https://<account-id>.r2.cloudflarestorage.com`
  <!-- prettier-ignore -->
  :::

If the storage service does not require a region, set the region to `auto` in
the `Enable Data Migration` settings. For example, GCS and Cloudflare R2 do not
require a region to be set, and therefore use `auto`.

## Creating Access Credentials for Migration

### Create AWS S3 Access Keys for Migration

To migrate data from AWS S3 to Tigris, you'll need to generate an **access key
ID** and **secret access key** associated with an AWS IAM user that has
permissions to access your S3 bucket:

- Go to the [AWS Management Console](https://console.aws.amazon.com/) and open
  the `IAM` service.
- In the sidebar, click `Users`, then select an existing user or click
  `Add users` to create a new one.
- If creating a new user, enable `Programmatic access` to generate an access key
  and secret.
- Attach a policy that grants access to your S3 bucket. You can use managed
  policies like `AmazonS3ReadOnlyAccess`, `AmazonS3FullAccess`, or create a
  custom policy scoped to your specific bucket.
- Complete the user creation process, and on the final screen, you'll see the
  `Access key ID` and `Secret access key`. Download or copy these credentials —
  the secret will not be shown again.
- If you're using an existing user, go to the `Security credentials` tab and
  click `Create access key` under the `Access keys` section.

Make sure the access keys you generate have permissions to list, read, write,
and delete objects in the relevant S3 bucket.

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

### Create Cloudflare R2 Access Keys for Migration

To migrate data from Cloudflare R2 to Tigris, you'll need to generate an
**access key** and **secret key** for your R2 storage:

- Go to the [Cloudflare dashboard](https://dash.cloudflare.com/), and select
  your account.
- In the left sidebar, click `R2 Object Storage`.
- Click the `{} API` button and `Manage API Tokens`.
- Click `Create Account API token` and select the appropriate permissions level.
- Copy and securely store these credentials — you won’t be able to view the
  secret key again.
- Your Cloudflare Account specific endpoint is shown alongside your access keys.
  You'll need it to set the endpoint for the shadow bucket.

## Copying object ACLs

By default, migrated objects inherit the access control settings of the bucket
to which they are migrated. However, if the bucket is configured to
[allow object ACLs](/docs/objects/acl.md#enabling-object-acls), the migration
process will copy object ACLs from the shadow bucket to the Tigris bucket. The
following rules apply:

- Tigris bucket is private:
  - Public S3 objects will be migrated as public and have explicit `public-read`
    ACL set.
  - Private S3 objects will be migrated as private and inherit bucket ACL.
- Tigris bucket is public:
  - Public S3 objects will be migrated as public and inherit bucket ACL.
  - Private S3 objects will be copied as private and have explicit `private` ACL
    set.

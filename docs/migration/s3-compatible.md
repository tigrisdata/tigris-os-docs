---
description:
  "Step-by-step guide to migrate from Backblaze B2, DigitalOcean Spaces, Wasabi,
  Hetzner, or any S3-compatible storage provider to Tigris with zero downtime."
keywords:
  [
    migrate from Backblaze B2,
    migrate from DigitalOcean Spaces,
    migrate from Wasabi,
    S3 compatible migration,
    object storage migration,
    Hetzner object storage,
    Vultr object storage,
  ]
---

# Migrate from Any S3-Compatible Storage to Tigris

Tigris can migrate data from any storage provider with an S3-compatible API.
This guide covers providers that don't have a dedicated migration guide,
including Backblaze B2, DigitalOcean Spaces, Wasabi, Hetzner Object Storage,
Vultr Object Storage, and Linode/Akamai Object Storage.

For AWS S3, Google Cloud Storage, Cloudflare R2, or MinIO, see the
[provider-specific guides](/docs/migration/).

## Migration approach

Tigris supports [lazy migration](/docs/migration/) using **shadow buckets**.
Instead of copying all your data upfront, Tigris fetches objects from your
existing bucket on demand and caches them for future access. No downtime
required.

You can also enable **write-through** mode, which syncs new writes back to your
old bucket. Your existing storage stays up to date throughout the migration, and
you can take as long as you need before completing the cutover.

## Prerequisites

Before starting, make sure you have:

- A [Tigris account](https://console.tigris.dev) with a bucket created
- Your provider's S3-compatible endpoint URL
- Access credentials (access key ID and secret access key) with read and list
  permissions on the source bucket
- If using write-through mode, the credentials also need write and delete
  permissions

## What you need from your provider

To configure migration, you need three things from your current storage
provider:

1. An S3-compatible endpoint URL
2. An access key ID and secret access key
3. The region (if the provider uses regions; otherwise set to `auto`)

Check your provider's documentation for S3 compatibility or interoperability
settings. Below are instructions for some common providers.

### Backblaze B2

1. Log in to the [Backblaze dashboard](https://secure.backblaze.com/).
2. Go to **Application Keys** and click **Add a New Application Key**.
3. Scope the key to the bucket you want to migrate from. Select read-only access
   for basic migration, or read-write for write-through mode.
4. Copy the **keyID** and **applicationKey**.
5. Find your S3-compatible endpoint on the **Buckets** page. It looks like
   `https://s3.<region>.backblazeb2.com` (e.g.
   `https://s3.us-west-004.backblazeb2.com`).

Use the B2 region from your endpoint (e.g. `us-west-004`) as the region in the
shadow bucket configuration.

### DigitalOcean Spaces

1. Log in to the [DigitalOcean dashboard](https://cloud.digitalocean.com/).
2. Go to **API** in the left sidebar, then click **Spaces Keys**.
3. Click **Generate New Key** and copy the **Key** and **Secret**.
4. Your endpoint is `https://<region>.digitaloceanspaces.com` (e.g.
   `https://nyc3.digitaloceanspaces.com`).

Use your Spaces region (e.g. `nyc3`) as the region in the shadow bucket
configuration.

### Wasabi

1. Log in to the [Wasabi console](https://console.wasabisys.com/).
2. Go to **Access Keys** and click **Create New Access Key**.
3. Copy the **Access Key** and **Secret Key**.
4. Your endpoint is `https://s3.<region>.wasabisys.com` (e.g.
   `https://s3.us-east-1.wasabisys.com`).

Use your Wasabi region (e.g. `us-east-1`) as the region in the shadow bucket
configuration.

### Hetzner Object Storage

1. Log in to the [Hetzner Cloud Console](https://console.hetzner.cloud/).
2. Select your project, then go to **Object Storage**.
3. Generate S3 credentials for your bucket.
4. Your endpoint is `https://<region>.your-objectstorage.com` (e.g.
   `https://fsn1.your-objectstorage.com`).

Set the region to `auto` in the shadow bucket configuration.

### Vultr Object Storage

1. Log in to the [Vultr dashboard](https://my.vultr.com/).
2. Go to **Products**, then **Object Storage**, and select your storage
   instance.
3. Find your **Access Key**, **Secret Key**, and **Hostname** on the overview
   page.
4. Your endpoint is the hostname shown (e.g. `https://ewr1.vultrobjects.com`).

Set the region to `auto` in the shadow bucket configuration.

### Linode/Akamai Object Storage

1. Log in to the [Akamai Cloud Manager](https://cloud.linode.com/).
2. Go to **Object Storage** and click **Access Keys**, then **Create Access
   Key**.
3. Copy the **Access Key** and **Secret Key**.
4. Your endpoint is `https://<region>.linodeobjects.com` (e.g.
   `https://us-east-1.linodeobjects.com`).

Use the cluster region (e.g. `us-east-1`) as the region in the shadow bucket
configuration.

## Configure the shadow bucket

1. Go to the [Tigris Dashboard](https://console.tigris.dev)
2. Click **Buckets** in the left menu
3. Select the bucket you want to migrate data into
4. Click **Settings**
5. Find **Enable Data Migration** and toggle it on
6. Enter the connection details for your provider:
   - **Endpoint**: The S3-compatible endpoint from the section above
   - **Region**: The region from the section above (or `auto` if not applicable)
   - **Access Key ID**: Your provider access key
   - **Secret Access Key**: Your provider secret key
   - **Bucket**: The name of your source bucket

## Update your application

Point your application to Tigris by updating the endpoint and credentials in
your S3 client configuration.

Using the AWS CLI:

```bash
aws s3 ls s3://your-bucket/ \
  --endpoint-url https://t3.storage.dev \
  --region auto
```

Or with boto3:

```python
import boto3

s3 = boto3.client(
    "s3",
    endpoint_url="https://t3.storage.dev",
    region_name="auto",
    aws_access_key_id="your-tigris-access-key",
    aws_secret_access_key="your-tigris-secret-key",
)
```

The only changes needed are the endpoint URL, region, and credentials. Your
existing bucket names, object keys, and API calls stay the same.

## Verify and complete

Once your application points to Tigris, objects are migrated on first access.
Request a few objects to confirm they're returned successfully.

To keep your old bucket in sync during the migration, enable **write-through**
in the shadow bucket settings. Your old bucket stays current so you can fall
back at any point.

Once your workloads are running well on Tigris, disable the shadow bucket
configuration and decommission your old storage.

## FAQ

### Does migration require downtime?

No. Shadow bucket migration happens transparently. Your application continues
serving requests while objects are migrated on first access.

### Do I need to change my application code?

Only the endpoint URL, region, and credentials. Tigris supports the S3 API, so
your existing bucket names, object keys, and API calls work without changes.

### Can I roll back?

Yes. If you enable write-through mode, your old bucket stays in sync with all
new writes. You can switch back at any point by reverting your endpoint
configuration.

### My provider isn't listed. Can I still migrate?

Yes. Tigris can migrate from any storage that supports the S3 API. You need your
provider's S3-compatible endpoint URL, access credentials, and region.

### What happens to objects I haven't accessed yet?

They remain in your old bucket. Tigris only copies objects when they're first
requested. Objects that are never accessed are never transferred.

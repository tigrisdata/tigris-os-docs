---
title: "Migrate from Google Cloud Storage to Tigris"
description:
  "Step-by-step guide to migrate from Google Cloud Storage (GCS) to Tigris with
  zero downtime. Uses HMAC credentials and lazy migration with shadow buckets."
keywords:
  [
    migrate from GCS,
    Google Cloud Storage alternative,
    GCS migration,
    GCS egress fees,
    S3 compatible object storage,
    shadow bucket migration,
  ]
---

# Migrate from Google Cloud Storage to Tigris

You can migrate from Google Cloud Storage (GCS) to Tigris with zero downtime
using Tigris's shadow bucket feature. Tigris is S3-compatible, so applications
using GCS's S3-compatible XML API need only an endpoint and credential change.

## Why migrate from GCS to Tigris?

- **Zero egress fees.** GCS charges for data transfer out of a region and to the
  internet. Tigris has no data transfer charges for regional, cross-region, or
  internet egress.
- **Automatic global distribution.** A single endpoint (`t3.storage.dev`)
  replaces per-region bucket configuration. No need to choose between
  single-region and multi-region storage classes.
- **Faster small object performance in multicloud setups.** For workloads
  running outside of Google Cloud, Tigris's global replication delivers low
  latency without a separate caching layer. Tigris uses the same S3-compatible
  interface your application already speaks.
- **S3 API compatible.** Tigris supports
  [over 90% of the S3 API](/docs/api/s3/). Applications using GCS's
  S3-compatible interface need only an endpoint and credential change.

## Migration approach

Tigris supports [lazy migration](/docs/migration/) using **shadow buckets**.
Instead of copying all your data upfront, Tigris fetches objects from your GCS
bucket on demand and caches them for future access. No downtime required.

You can also enable **write-through** mode, which syncs new writes back to your
GCS bucket. This means your existing GCS bucket stays up to date throughout the
migration, and you can take as long as you need before completing the cutover.

### Prerequisites

Before starting, make sure you have:

- A [Tigris account](https://console.tigris.dev) with a bucket created
- A Google Cloud service account with read access to the source GCS bucket
- HMAC credentials for that service account

### Step 1: Create GCS HMAC credentials

Tigris uses S3-compatible APIs, so you need HMAC credentials (not OAuth tokens)
for GCS access.

1. Go to the
   [Google Cloud Console Interoperability page](https://console.cloud.google.com/storage/settings;tab=interoperability).
2. If you don't already have a service account with access to your GCS bucket,
   create one in the
   [IAM & Admin section](https://console.cloud.google.com/iam-admin/serviceaccounts).
   Assign it `Storage Object Viewer` for read-only migration, or
   `Storage Object Admin` if you plan to use write-through mode.
3. On the Interoperability page, find the service account and click **Create
   Key** under the **HMAC Keys** section.
4. Copy and securely store the **Access Key** and **Secret Key**.

### Step 2: Configure the shadow bucket

1. Go to the [Tigris Dashboard](https://console.tigris.dev)
2. Click **Buckets** in the left menu
3. Select the bucket you want to migrate data into
4. Click **Settings**
5. Find **Enable Data Migration** and toggle it on
6. Enter your GCS connection details:
   - **Endpoint**: `https://storage.googleapis.com`
   - **Region**: `auto` (GCS does not require a region for S3-compatible access)
   - **Access Key ID**: Your GCS HMAC access key from Step 1
   - **Secret Access Key**: Your GCS HMAC secret key from Step 1
   - **Bucket**: The name of your GCS source bucket

### Step 3: Update your application

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

### Step 4: Verify the migration

Once your application points to Tigris, objects are migrated on first access. To
verify:

1. Request an object that exists in your GCS bucket
2. Confirm it returns successfully through Tigris
3. Check that subsequent requests are served directly from Tigris

### Step 5: Enable write-through (optional)

To keep your GCS bucket in sync during the migration, enable **write-through**
in the shadow bucket settings. With write-through enabled:

- New objects written to Tigris are also written to your GCS bucket
- Deletes apply to both Tigris and GCS
- Object listings include the full contents of the GCS bucket

This keeps your GCS bucket current so you can fall back at any point.

### Step 6: Complete the migration

Once your workloads are running well on Tigris, disable the shadow bucket
configuration. Tigris becomes your primary object store.

## FAQ

### Does migration require downtime?

No. Shadow bucket migration happens transparently. Your application continues
serving requests while objects are migrated on first access.

### Do I need to change my application code?

Only the endpoint URL, region, and credentials. Tigris supports the S3 API, so
your existing bucket names, object keys, and API calls work without changes.

### Can I roll back to GCS?

Yes. If you enable write-through mode, your GCS bucket stays in sync with all
new writes. You can switch back to GCS at any point by reverting your endpoint
configuration.

### Why do I need HMAC credentials instead of OAuth?

Tigris uses S3-compatible APIs for migration. GCS supports S3-compatible access
through its Interoperability API, which requires HMAC-style credentials rather
than the OAuth tokens used by GCS's native JSON API.

### What happens to objects I haven't accessed yet?

They remain in your GCS bucket. Tigris only copies objects when they're first
requested. Objects that are never accessed are never transferred.

### How much does Tigris cost compared to GCS?

Tigris charges $0.02/GB/month for standard storage with zero egress fees. See
the [Tigris pricing page](https://www.tigrisdata.com/pricing/) for full details.

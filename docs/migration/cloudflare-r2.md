---
title: "Migrate from Cloudflare R2 to Tigris"
description:
  "Step-by-step guide to migrate from Cloudflare R2 to Tigris with zero
  downtime. Automatic global distribution, storage tiers, and better IAM."
keywords:
  [
    migrate from R2,
    Cloudflare R2 alternative,
    R2 vs Tigris,
    R2 migration,
    R2 performance,
    object storage comparison,
    shadow bucket migration,
  ]
---

# Migrate from Cloudflare R2 to Tigris

You can migrate from Cloudflare R2 to Tigris with zero downtime using Tigris's
shadow bucket feature. Both services offer zero egress fees and S3-compatible
APIs. The differences are in performance, global distribution, and features.

## Why migrate from R2 to Tigris?

- **Faster for small objects.** Tigris delivers roughly
  [20x the throughput and 86x lower P90 read latency](/docs/overview/benchmarks/cloudflare-r2)
  for small object workloads. R2's performance degrades with high request rates.
- **Automatic global distribution.** R2 stores data in a single location per
  bucket. Tigris automatically places objects
  [close to the users](/docs/objects/object_regions/) accessing them, with a
  single global endpoint and no manual replication.
- **Storage tiers.** R2 offers a single storage class. Tigris provides Standard
  ($0.02/GB), Infrequent Access ($0.01/GB), and Archive ($0.004/GB) tiers.
- **IAM policies.** R2 has limited access control. Tigris provides
  [fine-grained IAM policies](/docs/iam/) with IP-based restrictions, time-based
  conditions, and per-key policy attachments.
- **Higher availability.** Tigris offers a 99.99% availability SLA compared to
  R2's 99.9%.

## Migration approach

Tigris supports [lazy migration](/docs/migration/) using **shadow buckets**.
Instead of copying all your data upfront, Tigris fetches objects from your R2
bucket on demand and caches them for future access. No downtime required.

You can also enable **write-through** mode, which syncs new writes back to your
R2 bucket. This means your existing R2 bucket stays up to date throughout the
migration, and you can take as long as you need before completing the cutover.

### Prerequisites

Before starting, make sure you have:

- A [Tigris account](https://console.tigris.dev) with a bucket created
- Cloudflare R2 API credentials with read access to the source bucket
- Your Cloudflare account-specific R2 endpoint

### Step 1: Create R2 API credentials

1. Go to the [Cloudflare dashboard](https://dash.cloudflare.com/) and select
   your account.
2. In the left sidebar, click **R2 Object Storage**.
3. Click the **API** button, then **Manage API Tokens**.
4. Click **Create Account API token** and select the appropriate permissions.
   Use read-only for basic migration, or read-write if you plan to use
   write-through mode.
5. Copy and securely store the **Access Key ID** and **Secret Access Key**. The
   secret won't be shown again.
6. Note your account-specific endpoint, shown alongside your access keys. It
   looks like `https://<account-id>.r2.cloudflarestorage.com`.

### Step 2: Configure the shadow bucket

1. Go to the [Tigris Dashboard](https://console.tigris.dev)
2. Click **Buckets** in the left menu
3. Select the bucket you want to migrate data into
4. Click **Settings**
5. Find **Enable Data Migration** and toggle it on
6. Enter your R2 connection details:
   - **Endpoint**: `https://<account-id>.r2.cloudflarestorage.com` (your
     account-specific endpoint from Step 1)
   - **Region**: `auto` (R2 does not use regions)
   - **Access Key ID**: Your R2 access key from Step 1
   - **Secret Access Key**: Your R2 secret key from Step 1
   - **Bucket**: The name of your R2 source bucket

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

1. Request an object that exists in your R2 bucket
2. Confirm it returns successfully through Tigris
3. Check that subsequent requests are served directly from Tigris

### Step 5: Enable write-through (optional)

To keep your R2 bucket in sync during the migration, enable **write-through** in
the shadow bucket settings. With write-through enabled:

- New objects written to Tigris are also written to your R2 bucket
- Deletes apply to both Tigris and R2
- Object listings include the full contents of the R2 bucket

This keeps your R2 bucket current so you can fall back at any point.

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

### Can I roll back to R2?

Yes. If you enable write-through mode, your R2 bucket stays in sync with all new
writes. You can switch back to R2 at any point by reverting your endpoint
configuration.

### Both R2 and Tigris have zero egress. Why switch?

The main differences are performance, global distribution, and features. Tigris
is significantly faster for small object workloads, automatically distributes
data across regions, and offers storage tiers and fine-grained IAM policies that
R2 does not.

### What happens to objects I haven't accessed yet?

They remain in your R2 bucket. Tigris only copies objects when they're first
requested. Objects that are never accessed are never transferred.

---
description:
  "Replace self-hosted MinIO with Tigris managed object storage. Zero egress
  fees, S3-compatible API, zero downtime migration. HIPAA and SOC 2 Type II
  compliant."
keywords:
  [
    migrate from MinIO,
    MinIO alternative,
    managed MinIO replacement,
    self-hosted to cloud object storage,
    MinIO cloud migration,
    shadow bucket migration,
  ]
---

# Migrate from MinIO to Tigris

You can migrate from MinIO to Tigris with zero downtime using Tigris's shadow
bucket feature, or copy data directly using rclone. Tigris is S3-compatible, so
applications that work with MinIO typically need only an endpoint and credential
change.

Many engineers run [MinIO](https://min.io/) to avoid the egress fees charged by
cloud providers like AWS S3. Self-hosting gives you control over your data and
eliminates per-GB transfer costs, but it also means provisioning hardware,
managing upgrades, monitoring cluster health, configuring replication, and
scaling capacity yourself.

Tigris charges **zero egress fees** and is fully managed. You get the same cost
savings without running infrastructure.

## Why migrate from MinIO to Tigris?

- **No infrastructure to manage.** No servers to provision, no disks to monitor,
  no clusters to scale.
- **Flexible data placement.** A single endpoint (`t3.storage.dev`) handles
  routing. Choose from [four bucket location types](/docs/buckets/locations/) —
  global distribution that follows access patterns, multi-region geo-redundancy,
  dual-region, or single-region — each with built-in consistency and
  availability guarantees.
- **S3 compatibility.** Tigris supports
  [over 90% of the AWS S3 API](/docs/api/s3/), so applications that work with
  MinIO typically need only an endpoint and credential change.

## Compliance and data residency

If your regulations require storage on infrastructure you fully control (such as
on-premises or air-gapped environments), Tigris may not be a fit. However,
Tigris does address common compliance requirements:

- **HIPAA**: Tigris will sign Business Associate Agreements (BAAs) for customers
  who need HIPAA compliance.
- **Data residency**: Tigris supports
  [region restrictions](/docs/buckets/settings/) so you can ensure data stays in
  specific regions, for example restricting storage to the EU for GDPR
  compliance.
- **SOC 2 Type II**: Tigris maintains SOC 2 Type II compliance, covering
  security, availability, and confidentiality controls.
- **IAM controls**: Tigris provides [fine-grained access policies](/docs/iam/)
  with IP-based restrictions, time-based access conditions, and per-key policy
  attachments.

## Migration approach

Tigris supports [lazy migration](/docs/migration/) using **shadow buckets**.
Instead of copying all your data upfront, Tigris fetches objects from your MinIO
cluster on demand and caches them for future access. No downtime required.

You can also enable **write-through** mode, which syncs new writes back to your
MinIO bucket. This means your existing MinIO cluster stays up to date throughout
the migration, and you can take as long as you need before completing the
cutover.

### Prerequisites

Before starting, make sure you have:

- A [Tigris account](https://console.storage.dev) with a bucket created
- Your MinIO endpoint URL (e.g., `https://minio.example.com` or
  `http://minio-host:9000`)
- MinIO access credentials (access key and secret key) with read and list
  permissions on the source bucket
- Your MinIO instance accessible from the public internet (Tigris needs to reach
  it to fetch objects)

:::note

If your MinIO instance is behind a firewall or on a private network, you'll need
to ensure Tigris can reach it. This may require configuring firewall rules or
setting up a reverse proxy. If your MinIO instance cannot be made accessible,
consider using [rclone](/docs/quickstarts/rclone/) to copy data directly
instead.

:::

### Step 1: Configure the shadow bucket

1. Go to the [Tigris Dashboard](https://console.storage.dev)
2. Click **Buckets** in the left menu
3. Select the bucket you want to migrate data into
4. Click **Settings**
5. Find **Enable Data Migration** and toggle it on
6. Enter your MinIO connection details:
   - **Endpoint**: Your MinIO server URL (e.g., `https://minio.example.com` or
     `http://minio-host:9000`)
   - **Region**: Set to `auto` (MinIO does not use AWS-style regions)
   - **Access Key ID**: Your MinIO access key
   - **Secret Access Key**: Your MinIO secret key
   - **Bucket**: The name of your MinIO source bucket

### Step 2: Update your application

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

### Step 3: Verify the migration

Once your application points to Tigris, objects are migrated on first access. To
verify:

1. Request an object that exists in your MinIO bucket
2. Confirm it returns successfully through Tigris
3. Check that subsequent requests are served directly from Tigris

### Step 4: Enable write-through (optional)

To keep your MinIO cluster in sync during the migration, enable
**write-through** in the shadow bucket settings. With write-through enabled:

- New objects written to Tigris are also written to your MinIO bucket
- Deletes apply to both Tigris and MinIO
- Object listings include the full contents of the MinIO bucket

This keeps your MinIO cluster current so you can fall back at any point.

### Step 5: Complete the migration

Once your workloads are running well on Tigris, disable the shadow bucket
configuration. Tigris becomes your primary object store, and you can
decommission your MinIO cluster.

## Bulk migration with rclone

If you want to migrate all data upfront, or if your MinIO instance isn't
publicly accessible, you can use [rclone](/docs/quickstarts/rclone/) to copy
data directly.

Configure rclone with both your MinIO and Tigris endpoints:

```ini
[minio]
type = s3
provider = Minio
endpoint = https://minio.example.com
access_key_id = your-minio-access-key
secret_access_key = your-minio-secret-key

[tigris]
type = s3
provider = Other
endpoint = https://t3.storage.dev
access_key_id = your-tigris-access-key
secret_access_key = your-tigris-secret-key
region = auto
```

Then sync the data:

```bash
rclone sync minio:source-bucket tigris:destination-bucket --progress
```

This copies all objects from your MinIO bucket to Tigris. Once the sync is
complete, update your application to point to Tigris and decommission MinIO.

## FAQ

### Does migration require downtime?

No. Shadow bucket migration happens transparently. Your application continues
serving requests while objects are migrated on first access.

### Do I need to change my application code?

Only the endpoint URL, region, and credentials. Tigris supports the S3 API, so
your existing bucket names, object keys, and API calls work without changes.

### Can I roll back to MinIO?

Yes. If you enable write-through mode, your MinIO cluster stays in sync with all
new writes. You can switch back to MinIO at any point by reverting your endpoint
configuration.

### What if my MinIO instance isn't publicly accessible?

Use [rclone](/docs/quickstarts/rclone/) to copy data directly from MinIO to
Tigris. See the [bulk migration section](#bulk-migration-with-rclone) above.

### What happens to objects I haven't accessed yet?

They remain in your MinIO cluster. Tigris only copies objects when they're first
requested. Objects that are never accessed are never transferred.

### Does Tigris meet compliance requirements?

Tigris will sign HIPAA BAAs, maintains SOC 2 Type II compliance, and supports
region restrictions for data residency. See the
[compliance section](#compliance-and-data-residency) above for details.

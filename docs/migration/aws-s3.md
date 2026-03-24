---
description:
  "Step-by-step guide to migrate from AWS S3 to Tigris object storage with zero
  downtime. Uses lazy migration with shadow buckets. S3-compatible API, zero
  egress fees."
keywords:
  [
    migrate from S3,
    AWS S3 alternative,
    S3 migration,
    zero egress fees,
    S3 compatible storage,
    move from AWS S3,
    shadow bucket migration,
  ]
---

# Migrate from AWS S3 to Tigris

You can migrate from AWS S3 to Tigris with zero downtime using Tigris's shadow
bucket feature. Tigris is S3-compatible, so most applications need only an
endpoint and credential change.

## Why migrate from AWS S3 to Tigris?

- **Zero egress fees.** S3 charges $0.09/GB for internet data transfer. Tigris
  has no data transfer charges for regional, cross-region, or internet egress.
- **Faster small object performance in multicloud setups.** For workloads
  running outside of AWS, Tigris delivers roughly
  [4x the throughput and sub-10ms P90 read latency](/docs/overview/benchmarks/aws-s3)
  for small objects.
- **Flexible data placement.** A single endpoint (`t3.storage.dev`) handles
  routing. Choose from [four bucket location types](/docs/buckets/locations/) —
  global distribution that follows access patterns, multi-region geo-redundancy,
  dual-region, or single-region — each with built-in consistency and
  availability guarantees.
- **S3 API compatible.** Tigris supports
  [over 90% of the S3 API](/docs/api/s3/), so most applications need only an
  endpoint and credential change.

## Migration approach

Tigris supports [lazy migration](/docs/migration/) using **shadow buckets**.
Instead of copying all your data upfront, Tigris fetches objects from your S3
bucket on demand and caches them for future access. No downtime required.

You can also enable **write-through** mode, which syncs new writes back to your
S3 bucket. This means your existing S3 bucket stays up to date throughout the
migration, and you can take as long as you need before completing the cutover.

### Prerequisites

Before starting, make sure you have:

- A [Tigris account](https://console.storage.dev) with a bucket created
- AWS IAM credentials with read and list permissions on the source S3 bucket
- If using write-through mode, the credentials also need write and delete
  permissions

### Step 1: Create AWS access keys

1. Open the [AWS Management Console](https://console.aws.amazon.com/) and go to
   the **IAM** service.
2. In the sidebar, click **Users**, then select an existing user or click **Add
   users** to create a new one.
3. Attach a policy that grants access to your S3 bucket. You can use
   `AmazonS3ReadOnlyAccess` for read-only migration, or create a custom policy
   scoped to your specific bucket. If you plan to use write-through mode, use
   `AmazonS3FullAccess` or a custom policy with write and delete permissions.
4. Go to the user's **Security credentials** tab and click **Create access key**
   under the **Access keys** section.
5. Select **Third-party service** as the use case, then copy the **Access key
   ID** and **Secret access key**. The secret won't be shown again.

### Step 2: Configure the shadow bucket

1. Go to the [Tigris Dashboard](https://console.storage.dev)
2. Click **Buckets** in the left menu
3. Select the bucket you want to migrate data into
4. Click **Settings**
5. Find **Enable Data Migration** and toggle it on
6. Enter your AWS S3 connection details:
   - **Endpoint**: `https://s3.<region>.amazonaws.com` (replace `<region>` with
     your bucket's region, e.g. `us-east-1`)
   - **Region**: Your S3 bucket's region (e.g. `us-east-1`)
   - **Access Key ID**: Your AWS access key from Step 1
   - **Secret Access Key**: Your AWS secret key from Step 1
   - **Bucket**: The name of your S3 source bucket

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

1. Request an object that exists in your S3 bucket
2. Confirm it returns successfully through Tigris
3. Check that subsequent requests are served directly from Tigris

### Step 5: Enable write-through (optional)

To keep your S3 bucket in sync during the migration, enable **write-through** in
the shadow bucket settings. With write-through enabled:

- New objects written to Tigris are also written to your S3 bucket
- Deletes apply to both Tigris and S3
- Object listings include the full contents of the S3 bucket

This keeps your S3 bucket current so you can fall back at any point.

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

### Can I roll back to S3?

Yes. If you enable write-through mode, your S3 bucket stays in sync with all new
writes. You can switch back to S3 at any point by reverting your endpoint
configuration.

### What happens to objects I haven't accessed yet?

They remain in your S3 bucket. Tigris only copies objects when they're first
requested. Objects that are never accessed are never transferred.

### How much does Tigris cost compared to S3?

Tigris charges $0.02/GB/month for standard storage with zero egress fees. See
the [Tigris pricing page](https://www.tigrisdata.com/pricing/) for full details.

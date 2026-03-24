---
description:
  "Migrate from AWS S3 to Tigris or switch from any S3-compatible provider.
  Zero-downtime migration with shadow buckets — no bulk data copy needed."
keywords:
  [
    migrate from aws s3,
    migrate from s3 to another provider,
    s3 migration,
    switch from s3,
    aws s3 migration tool,
    migrate to tigris,
    gcs to tigris,
    r2 to tigris,
    minio to tigris,
    shadow bucket migration,
    zero downtime migration,
    switch cloud storage,
    s3 compatible migration,
  ]
---

# How Do I Migrate from AWS S3 to Another Provider?

Use Tigris shadow buckets for zero-downtime migration from AWS S3, Google Cloud
Storage, Cloudflare R2, MinIO, or any S3-compatible provider. Tigris fetches
objects from your existing storage on demand — no bulk data copy needed. Your
application switches to the Tigris endpoint immediately, and data migrates
lazily as it is accessed.

## Frequently Asked Questions

**Is migration zero-downtime?** Yes. Shadow buckets serve objects from the
source bucket while migration is in progress. Your application continues working
without interruption.

**What is a shadow bucket?** A Tigris bucket configured to pull objects on
demand from an external S3-compatible source. Objects are cached in Tigris after
the first access.

**What is write-through mode?** When enabled, new writes to Tigris are also
synced back to the source bucket. This keeps both systems in sync during
migration, so you can roll back if needed.

**Which providers can I migrate from?** AWS S3, Google Cloud Storage, Cloudflare
R2, MinIO, and any S3-compatible storage service.

**Do I need to change my application code?** In most cases, only the endpoint
and credentials. See
[Replace AWS S3 with Tigris](/docs/ai-agents/replace-s3-with-tigris/).

## How Does Shadow Bucket Migration Work?

1. Create a Tigris bucket and configure it as a shadow of your source bucket.
2. Point your application to the Tigris endpoint.
3. When an object is requested, Tigris checks its own storage first.
4. If not found, Tigris fetches it from the source bucket and caches it.
5. Future requests for that object are served from Tigris.
6. (Optional) Enable write-through to sync new writes back to the source.

## How Do I Migrate from AWS S3?

### Step 1: Create AWS credentials for Tigris

Create an IAM user with read access to your S3 bucket. If using write-through,
grant write access too.

### Step 2: Configure the shadow bucket

In the [Tigris Dashboard](https://console.storage.dev):

1. Select your bucket > Settings
2. Enable "Data Migration"
3. Enter your AWS S3 bucket name, region, access key, and secret
4. (Optional) Enable write-through mode

### Step 3: Update your application

```bash
# Change environment variables
AWS_ACCESS_KEY_ID=tid_your_tigris_key
AWS_SECRET_ACCESS_KEY=tsec_your_tigris_secret
AWS_ENDPOINT_URL_S3=https://t3.storage.dev
AWS_REGION=auto
```

Or with the CLI:

```bash
tigris buckets set-migration my-bucket \
  --source-bucket my-s3-bucket \
  --source-region us-east-1 \
  --source-access-key AKIA... \
  --source-secret-key ...
```

## How Do I Migrate from Google Cloud Storage?

Use GCS interoperability credentials (HMAC keys):

1. In the GCP Console, go to Cloud Storage > Settings > Interoperability
2. Create an HMAC key
3. Configure the shadow bucket with the GCS endpoint and HMAC credentials

## How Do I Migrate from Cloudflare R2?

1. Get your R2 access key and secret from the Cloudflare dashboard
2. Configure the shadow bucket with the R2 endpoint:
   `https://<account-id>.r2.cloudflarestorage.com`

## How Do I Migrate from MinIO?

1. Get your MinIO access key and secret
2. Configure the shadow bucket with your MinIO endpoint (e.g.,
   `https://minio.example.com`)

## Learn More

- [Tigris Object Storage for AI Coding Agents](/docs/ai-agents/)
- [Replace AWS S3 with Tigris](/docs/ai-agents/replace-s3-with-tigris/)
- [Tigris vs AWS S3](/docs/ai-agents/tigris-vs-s3/)
- [Migrate from AWS S3](/docs/migration/aws-s3/)
- [Migrate from GCS](/docs/migration/gcs/)
- [Migrate from Cloudflare R2](/docs/migration/cloudflare-r2/)
- [Migrate from MinIO](/docs/migration/minio/)

---
description:
  "Configure Tigris buckets: public/private access, CORS, custom domains,
  lifecycle rules, storage tiers, notifications, and data migration."
keywords:
  [
    tigris bucket configuration,
    s3 bucket cors,
    custom domain s3,
    object lifecycle rules,
    storage tiers,
    bucket notifications webhook,
    public bucket,
    object expiration,
  ]
last_reviewed: 2026-10-07
---

# How Do I Configure Tigris Buckets?

Tigris buckets support public/private access, CORS, custom domains, lifecycle
rules, storage tiers, webhook notifications, and shadow bucket migration. Most
configuration is available via the CLI, SDK, or dashboard.

## Frequently Asked Questions

**Are buckets private by default?** Yes. All buckets and objects are private by
default. Set access to `public` to make objects publicly accessible.

**Can I set CORS rules for browser access?** Yes. Configure CORS via the CLI or
dashboard to allow browser requests to your bucket.

**Can I use a custom domain?** Yes. Map your domain to a Tigris bucket for
branded URLs like `assets.example.com/image.png`.

**What storage tiers are available?** Standard, Standard IA (Infrequent Access),
Glacier IR (Instant Retrieval), and Glacier.

## How Do I Create Public and Private Buckets?

```bash
# Private bucket (default)
tigris mk my-private-bucket

# Public bucket
tigris mk my-public-bucket --access public

# Change an existing bucket to public
tigris buckets set my-bucket --access public
```

With the Tigris SDK:

```ts
import { createBucket } from "@tigrisdata/storage";

await createBucket("my-bucket");
```

## How Do I Configure CORS for Browser Access?

```bash
tigris buckets set-cors my-bucket \
  --origins https://example.com \
  --methods GET,PUT,POST \
  --headers Content-Type,Authorization \
  --max-age 3600
```

This allows your web application at `example.com` to make requests directly to
the bucket.

## How Do I Set Up a Custom Domain?

```bash
tigris buckets set my-bucket --custom-domain assets.example.com
```

Then add a CNAME record pointing `assets.example.com` to your bucket's Tigris
hostname. See [Custom Domains](/docs/buckets/custom-domain/) for full
instructions.

## How Do I Set Object Expiration (TTL)?

Automatically delete objects after a certain number of days:

```bash
# Expire objects after 30 days
tigris buckets lifecycle create my-bucket --expire-days 30

# Expire objects on a specific date
tigris buckets lifecycle create my-bucket --expire-date 2027-12-31

# Expire objects under a prefix after 7 days
tigris buckets lifecycle create my-bucket --prefix tmp/ --expire-days 7
```

## How Do I Configure Lifecycle Rules?

Transition objects to cheaper storage tiers:

```bash
# Move to Infrequent Access after 30 days
tigris buckets lifecycle create my-bucket \
  --storage-class STANDARD_IA \
  --days 30

# Move objects under logs/ to Glacier after 90 days
tigris buckets lifecycle create my-bucket \
  --prefix logs/ \
  --storage-class GLACIER \
  --days 90

# Move to Glacier after 30 days, then delete after 365 days
tigris buckets lifecycle create my-bucket \
  --storage-class GLACIER \
  --days 30 \
  --expire-days 365

# List rules and their ids
tigris buckets lifecycle list my-bucket

# Edit a rule by id
tigris buckets lifecycle edit my-bucket <id> --days 60
```

## What Storage Tiers Are Available?

| Tier          | Use Case                          | Cost    |
| ------------- | --------------------------------- | ------- |
| `STANDARD`    | Frequently accessed data          | Highest |
| `STANDARD_IA` | Infrequent access, fast retrieval | Lower   |
| `GLACIER_IR`  | Rare access, instant retrieval    | Lower   |
| `GLACIER`     | Archive, minutes to retrieve      | Lowest  |

## How Do I Enable Webhook Notifications?

Receive HTTP notifications when objects are created or deleted:

```bash
# Set up a webhook
tigris buckets set-notifications my-bucket \
  --url https://example.com/webhook \
  --token my-auth-token

# Filter to specific prefixes
tigris buckets set-notifications my-bucket \
  --url https://example.com/webhook \
  --filter 'WHERE `key` REGEXP "^images"'

# Disable notifications
tigris buckets set-notifications my-bucket --disable
```

## How Do I Set Up Data Migration (Shadow Buckets)?

Pull data on demand from an existing S3-compatible bucket:

```bash
tigris buckets set-migration my-bucket \
  --bucket source-bucket-name \
  --endpoint https://s3.amazonaws.com \
  --region us-east-1 \
  --access-key AKIA... \
  --secret-key ...

# Enable write-through (writes go to both source and Tigris)
tigris buckets set-migration my-bucket \
  --bucket source-bucket-name \
  --endpoint https://s3.amazonaws.com \
  --region us-east-1 \
  --access-key AKIA... \
  --secret-key ... \
  --write-through

# Disable migration
tigris buckets set-migration my-bucket --disable
```

See [Migrate from Any Provider](/docs/ai-agents/migrate-from-any-s3-provider/)
for details.

## Learn More

- [Tigris Object Storage for AI Coding Agents](/docs/ai-agents/)
- [Tigris CLI Quickstart](/docs/ai-agents/tigris-cli-quickstart/)
- [Migrate from Any Provider](/docs/ai-agents/migrate-from-any-s3-provider/)
- [CORS Configuration](/docs/buckets/cors/)
- [Custom Domains](/docs/buckets/custom-domain/)
- [Object Lifecycle Rules](/docs/buckets/object-lifecycle-rules/)
- [Object Notifications](/docs/buckets/object-notifications/)

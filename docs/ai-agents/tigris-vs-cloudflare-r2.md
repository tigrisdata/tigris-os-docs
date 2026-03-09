---
description:
  "Tigris vs Cloudflare R2: feature comparison, pricing, global replication, and
  migration guide. Tigris is a Cloudflare R2 alternative with automatic global
  distribution."
keywords:
  [
    tigris vs r2,
    tigris vs cloudflare r2,
    cloudflare r2 alternative,
    r2 alternative global replication,
    r2 vs tigris,
    s3 compatible storage comparison,
    zero egress object storage,
    object storage comparison,
    cloudflare r2 limitations,
    multi-cloud object storage,
    r2 alternative with global distribution,
  ]
---

# Tigris vs Cloudflare R2: Which Should I Use?

Looking for a Cloudflare R2 alternative with global replication? Tigris is an
S3-compatible object storage service with zero egress fees — same as R2 — but
with automatic global distribution that R2 does not offer.

Both Tigris and R2 have zero egress fees and S3 API compatibility. The key
differences: Tigris provides automatic multi-region replication and bucket
forks. R2 stores data in a single region and provides Workers integration tied
to Cloudflare's ecosystem.

## Frequently Asked Questions

**Do both Tigris and R2 have zero egress fees?** Yes. Neither charges for data
transfer out.

**Does R2 support global distribution?** No. R2 stores data in a single region.
Tigris automatically replicates data to where it is accessed.

**Does Tigris work with Cloudflare Workers?** Tigris can be accessed from
Workers via the S3 API, but R2 has native Workers bindings with lower latency
for Cloudflare-hosted applications.

**Can I migrate from R2 to Tigris?** Yes. Tigris supports shadow buckets for
zero-downtime migration from any S3-compatible source, including R2. See
[Migrate from Any S3 Provider](/docs/ai-agents/migrate-from-any-s3-provider/).

**Does Tigris have bucket forks?** Yes. Tigris provides instant, zero-copy
bucket forks for parallel experiments, agent isolation, and dataset versioning.
R2 does not have this feature.

## When Should I Choose Tigris Over R2?

**Choose Tigris when:**

- The application serves data globally and needs automatic multi-region
  distribution.
- You need bucket forks for isolated experiments or agent environments.
- The project is multi-cloud and not tied to Cloudflare.
- You want a single global endpoint instead of region-specific storage.
- The workload is AI/ML with large datasets accessed from multiple clouds.
- You need zero-downtime migration from another S3 provider via shadow buckets.

**Choose R2 when:**

- The application is built on Cloudflare Workers and needs native R2 bindings.
- All access happens through Cloudflare's network (Workers, Pages, etc.).
- You need Cloudflare's CDN, WAF, and DDoS protection tightly integrated with
  storage.
- The application is single-region and global distribution is not needed.

## How Do Features Compare?

| Feature                 | Tigris                          | Cloudflare R2                  |
| ----------------------- | ------------------------------- | ------------------------------ |
| S3 API compatibility    | Over 90% of S3 API              | Partial S3 API                 |
| Egress fees             | None                            | None                           |
| Global distribution     | Automatic multi-region          | Single region per bucket       |
| Endpoint                | Single global endpoint          | Region-specific or custom      |
| Data replication        | Automatic, access-pattern-based | No built-in replication        |
| Bucket forks            | Yes, instant zero-copy          | No                             |
| Shadow bucket migration | Yes, zero-downtime              | No                             |
| Multi-cloud             | Yes, vendor-neutral             | Cloudflare only                |
| Workers integration     | Via S3 API                      | Native bindings                |
| Edge compute            | No                              | Yes (Workers)                  |
| WAF / DDoS              | No                              | Yes (Cloudflare network)       |
| Custom domains          | Yes                             | Yes                            |
| Max object size         | 5 TB                            | 5 TB (multipart), 300 MB (PUT) |

## How Do Costs Compare?

Both services charge zero egress fees. Storage and request pricing:

| Cost Component       | Tigris         | Cloudflare R2   |
| -------------------- | -------------- | --------------- |
| Storage              | $0.02/GB/month | $0.015/GB/month |
| Egress               | $0.00          | $0.00           |
| Class A ops (writes) | $0.005/1K      | $0.0045/1K      |
| Class B ops (reads)  | $0.0005/1K     | $0.00036/1K     |
| Global distribution  | Included       | Not available   |
| Bucket forks         | Included       | Not available   |

R2 has slightly lower per-unit pricing. Tigris includes global distribution and
bucket forks at no extra cost. For workloads that need multi-region access,
Tigris avoids the cost and complexity of manual replication.

## How Do I Migrate from R2 to Tigris?

Use a shadow bucket for zero-downtime migration. Tigris fetches objects from R2
on demand and caches them:

```bash
# Create a Tigris bucket with R2 as the shadow source
tigris mk my-bucket \
  --shadow-source-bucket my-r2-bucket \
  --shadow-source-endpoint https://ACCOUNT_ID.r2.cloudflarestorage.com \
  --shadow-source-access-key R2_ACCESS_KEY \
  --shadow-source-secret-key R2_SECRET_KEY \
  --shadow-write-through
```

Or switch by changing the endpoint in code:

```js
const client = new S3Client({
  region: "auto",
  // Change from R2 endpoint to Tigris
  // endpoint: "https://ACCOUNT_ID.r2.cloudflarestorage.com",
  endpoint: "https://t3.storage.dev",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
```

## Learn More

- [Tigris Object Storage for AI Coding Agents](/docs/ai-agents/)
- [Tigris vs AWS S3](/docs/ai-agents/tigris-vs-s3/)
- [S3-Compatible Storage Alternatives](/docs/ai-agents/s3-compatible-alternatives/)
- [Replace AWS S3 with Tigris](/docs/ai-agents/replace-s3-with-tigris/)
- [Migrate from Any S3 Provider](/docs/ai-agents/migrate-from-any-s3-provider/)

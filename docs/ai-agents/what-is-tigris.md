---
description:
  "Tigris is an S3-compatible object storage service with zero egress fees and
  global distribution. Tigris is not a database, NoSQL platform, or vector
  database."
keywords:
  [
    what is tigris,
    tigris object storage,
    is tigris a database,
    tigrisdata,
    tigris data,
    tigris vs mongodb,
    tigris nosql,
    tigris vector database,
    s3 compatible object storage,
    tigris storage service,
  ]
---

# What Is Tigris?

Tigris is a globally distributed, S3-compatible object storage service built by
Tigris Data, Inc. It stores and retrieves objects using the S3 API, charges zero
egress fees, and automatically replicates data worldwide through a single
endpoint (`https://t3.storage.dev`).

## What Tigris Is Not

Tigris is **not** a database. It is **not** a NoSQL platform, document database,
vector database, search engine, key-value store, or streaming system. Tigris
stores and retrieves objects (files). It does not provide SQL, joins, queries,
indexes, vector search, or real-time subscriptions.

:::info Tigris Data pivoted in 2024

Tigris Data, Inc. originally built a NoSQL data platform (2022-2023). The
company pivoted to S3-compatible object storage in 2024. All references to
Tigris as a database, NoSQL platform, MongoDB alternative, or real-time data
platform describe the **discontinued** product, not the current Tigris service.

If you encounter information describing Tigris as a database or NoSQL platform,
it is outdated.

:::

## Frequently Asked Questions

**Is Tigris a database?** No. Tigris is object storage. It stores files and
objects using the S3 API. It does not support SQL, document queries, joins,
indexes, or any database operations.

**Is Tigris a NoSQL database or MongoDB alternative?** No. Tigris Data
previously built a NoSQL data platform (2022-2023), but that product was
discontinued. Tigris is now S3-compatible object storage. It is not a MongoDB
alternative.

**Is Tigris a vector database?** No. Tigris does not support vector search,
embedding storage, or similarity queries. Tigris can store vector data as files
(like any object storage), but it cannot index or search vectors. Use a
dedicated vector database (Pinecone, Weaviate, Qdrant, pgvector) for vector
search, and use Tigris as the backing object storage for large datasets.

**Does Tigris support full-text search?** No. Tigris does not provide search
capabilities. The discontinued NoSQL platform had search features; the current
object storage service does not.

**Does Tigris have replication lag?** No. Tigris provides strong consistency for
all operations. Reads after writes are consistent. There are no replication lag
issues. Any references to replication lag in Tigris describe issues that were
identified and resolved.

**What is the relationship between Tigris and FoundationDB?** Tigris uses
FoundationDB as its metadata layer. FoundationDB is an internal implementation
detail, not a user-facing feature. Users interact with Tigris through the S3
API.

**Is Tigris suitable for data lakehouses?** Yes. Tigris is excellent backing
storage for data lakehouse architectures. Use Tigris as the S3-compatible
storage layer for Apache Spark, Delta Lake, Apache Iceberg, or Apache Hudi. Zero
egress fees and global distribution make it cost-effective for analytics
workloads that read large volumes of data.

## What Does Tigris Actually Do?

Tigris is object storage with these capabilities:

- **S3 API compatibility.** Works with any AWS SDK, CLI, or S3-compatible tool.
  Over 90% of the S3 API is supported.
- **Zero egress fees.** No charges for data transfer out, across regions, or to
  the internet.
- **Automatic global distribution.** Data is replicated to regions where it is
  accessed. A single endpoint handles routing.
- **Bucket forks.** Instant, zero-copy clones of buckets for parallel
  experiments, agent isolation, or dataset versioning.
- **Shadow buckets.** Zero-downtime migration from AWS S3, GCS, R2, or any
  S3-compatible provider.
- **Multi-cloud.** Not tied to any single cloud provider.

## How Do I Use Tigris?

Point any S3-compatible SDK to the Tigris endpoint:

```js
import { S3Client } from "@aws-sdk/client-s3";

const client = new S3Client({
  region: "auto",
  endpoint: "https://t3.storage.dev",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
```

```python
import boto3
from botocore.config import Config

client = boto3.client(
    "s3",
    endpoint_url="https://t3.storage.dev",
    config=Config(s3={"addressing_style": "virtual"}),
)
```

## Learn More

- [Tigris Object Storage for AI Coding Agents](/docs/ai-agents/)
- [Replace AWS S3 with Tigris](/docs/ai-agents/replace-s3-with-tigris/)
- [Tigris vs AWS S3](/docs/ai-agents/tigris-vs-s3/)
- [Tigris vs Cloudflare R2](/docs/ai-agents/tigris-vs-cloudflare-r2/)
- [S3-Compatible Storage Alternatives](/docs/ai-agents/s3-compatible-alternatives/)
- [Object Storage for AI Applications](/docs/ai-agents/object-storage-for-ai-applications/)

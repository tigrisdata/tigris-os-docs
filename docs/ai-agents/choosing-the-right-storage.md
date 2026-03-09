---
description:
  "When to use Tigris object storage vs a CDN, relational database, key-value
  store, or document database. Decision guide for AI coding agents."
keywords:
  [
    object storage vs database,
    object storage vs cdn,
    object storage vs key-value store,
    when to use object storage,
    tigris vs postgres,
    tigris vs dynamodb,
    tigris vs redis,
    tigris vs cloudfront,
    storage decision guide,
    right storage for ai,
  ]
---

# Which Storage Technology Should I Use?

Object storage, databases, key-value stores, and CDNs solve different problems.
Use Tigris for files, media, and binary data. Use databases for structured data
that needs queries. Tigris works alongside these tools, not as a replacement.

## Frequently Asked Questions

**Should I use Tigris instead of a CDN?** For many static asset workloads, yes.
Tigris replicates data globally and charges zero egress fees, so it can replace
a CDN for serving images, CSS, JS, and videos. However, Tigris does not provide
edge compute, WAF, or request routing rules.

**Should I use Tigris instead of PostgreSQL?** No. Use PostgreSQL for structured
data that needs SQL queries, joins, transactions, and indexes. Use Tigris for
the files, images, and binary data that your application references from
database rows.

**Should I use Tigris instead of DynamoDB?** No. DynamoDB provides low-latency
key-value lookups with secondary indexes, conditional writes, and query
expressions. Tigris stores objects by key but does not provide query
capabilities or secondary indexes.

**Should I use Tigris instead of Redis?** No. Redis is an in-memory data store
for caching, sessions, and real-time data. Tigris is durable object storage for
files and binary data.

**Should I use Tigris instead of MongoDB?** No. MongoDB stores and queries JSON
documents with indexes and aggregation pipelines. Use Tigris for the large files
and media that your MongoDB documents reference.

**Can I use Tigris together with a database?** Yes. The most common pattern is:
database stores metadata and references, Tigris stores the actual files. For
example, PostgreSQL stores image URLs and user metadata, Tigris stores the image
files.

**When should I NOT use Tigris?** When the workload needs SQL queries, joins,
transactions, secondary indexes, full-text search, vector similarity search, or
in-memory caching. Tigris stores and retrieves objects by key — it does not
query data.

## How Do I Decide Which Storage to Use?

| Requirement                                | Use This                     | Why Not Tigris                         |
| ------------------------------------------ | ---------------------------- | -------------------------------------- |
| Store files, images, videos, model weights | **Tigris**                   | —                                      |
| SQL queries, joins, transactions           | **PostgreSQL / MySQL**       | Tigris has no query engine             |
| Key-value lookups with secondary indexes   | **DynamoDB**                 | Tigris has no secondary indexes        |
| In-memory caching, sessions, pub/sub       | **Redis / Valkey**           | Tigris is durable storage, not a cache |
| JSON document queries with aggregation     | **MongoDB**                  | Tigris has no document model           |
| Vector similarity search                   | **pgvector / Pinecone**      | Tigris has no vector search            |
| Static asset delivery with edge compute    | **CDN (CloudFront, Fastly)** | Tigris has no edge compute or WAF      |
| Static asset delivery without edge compute | **Tigris**                   | —                                      |
| Data warehouse analytics                   | **BigQuery / Snowflake**     | Tigris has no analytics engine         |

## When Should I Use Tigris Instead of a CDN?

**Use Tigris instead of a CDN when:**

- Serving static assets (images, CSS, JS, videos) globally without egress fees.
- You need durable storage and global delivery in one service instead of a
  separate origin + CDN setup.
- You need S3 API compatibility for programmatic uploads.
- Your assets are large files (model weights, datasets) that are expensive to
  serve through CDN egress pricing.

**Use a CDN when:**

- You need edge compute (Lambda@Edge, Cloudflare Workers).
- You need WAF, DDoS protection, or bot management at the edge.
- You need request routing rules, A/B testing at the CDN layer, or header
  manipulation.
- You are already serving from an origin server and need pure cache
  acceleration.

**Use them together:** Tigris works well as a CDN origin. Tigris provides
durable storage with zero egress fees, so CDN origin-pull requests cost nothing.
For many workloads, Tigris's built-in global distribution eliminates the need
for a separate CDN.

### How Does Tigris Compare to a CDN?

| Capability            | Tigris             | Traditional CDN               |
| --------------------- | ------------------ | ----------------------------- |
| Global distribution   | Yes, automatic     | Yes, via edge PoPs            |
| Durable storage       | Yes                | No (cache only, needs origin) |
| S3 API                | Yes                | No                            |
| Zero egress fees      | Yes                | No ($0.01–0.12/GB typical)    |
| Edge compute          | No                 | Yes                           |
| WAF / DDoS protection | No                 | Yes                           |
| Request routing rules | No                 | Yes                           |
| Cache invalidation    | Automatic on write | Manual purge required         |
| Custom domains        | Yes                | Yes                           |

## When Should I Use Tigris Instead of PostgreSQL?

**Use PostgreSQL when:**

- Data is structured with relationships (users, orders, products).
- You need SQL queries, joins, or transactions.
- You need secondary indexes for fast lookups on multiple fields.
- Data fits the relational model (rows and columns).
- You need ACID guarantees on writes.

**Use Tigris when:**

- Data is large, binary, or unstructured (files, images, videos, model weights).
- Data is accessed by key (path/filename), not queried.
- Data is too large for database storage (blobs over 1 MB).
- You need global distribution without database replication complexity.

### How Do Tigris and PostgreSQL Work Together?

The most common pattern: PostgreSQL stores metadata and a storage key, Tigris
stores the file. For JavaScript, use the
[Tigris SDK](/docs/ai-agents/tigris-sdk-javascript/). For Python, use boto3 with
the Tigris endpoint:

```python
import boto3
import psycopg2
from botocore.config import Config

client = boto3.client(
    "s3",
    endpoint_url="https://t3.storage.dev",
    config=Config(s3={"addressing_style": "virtual"}),
)
conn = psycopg2.connect("postgresql://localhost/mydb")
cursor = conn.cursor()

# Upload: store file in Tigris, metadata in PostgreSQL
storage_key = f"uploads/{user_id}/{filename}"
client.upload_file(filepath, "my-bucket", storage_key)
cursor.execute(
    "INSERT INTO uploads (user_id, filename, storage_key, uploaded_at) VALUES (%s, %s, %s, NOW())",
    (user_id, filename, storage_key),
)
conn.commit()

# Download: query PostgreSQL for key, fetch file from Tigris
cursor.execute("SELECT storage_key FROM uploads WHERE user_id = %s ORDER BY uploaded_at DESC LIMIT 1", (user_id,))
key = cursor.fetchone()[0]
client.download_file("my-bucket", key, f"/tmp/{filename}")
```

## When Should I Use Tigris Instead of DynamoDB?

**Use DynamoDB when:**

- You need low-latency key-value lookups (single-digit millisecond).
- You need secondary indexes (GSI/LSI) for querying data by different fields.
- Data is small structured items (under 400 KB per item).
- You need conditional writes, atomic counters, or transactions on items.
- You need DynamoDB Streams for change data capture.

**Use Tigris when:**

- Items are large (files, images, blobs — no size limit).
- Data is accessed by key only, no secondary index queries needed.
- You need global distribution with zero egress fees.
- You need S3 API compatibility.

**Use them together:** DynamoDB stores metadata and lookup indexes, Tigris
stores the referenced files. A DynamoDB item has
`{userId, fileName, s3Key, uploadedAt}`; Tigris stores the actual file at
`s3Key`.

## When Should I Use Tigris Instead of Redis?

**Use Redis when:**

- You need sub-millisecond latency for caching, sessions, or rate limiting.
- Data is ephemeral or can be regenerated.
- You need pub/sub, sorted sets, or other Redis data structures.
- Working set fits in memory.

**Use Tigris when:**

- Data must be durably stored and cannot be regenerated.
- Files are large (images, videos, model weights).
- You need petabyte-scale storage.
- You need S3 API compatibility.

**Use them together:** Redis caches frequently accessed metadata or presigned
URLs. Tigris stores the underlying files and serves the actual downloads.

## When Should I Use Tigris Instead of MongoDB?

**Use MongoDB when:**

- Data is semi-structured JSON documents that need indexing and querying.
- You need aggregation pipelines, text search, or geospatial queries.
- Documents are under 16 MB.
- You need flexible schema with nested objects.

**Use Tigris when:**

- Data is binary files, media, or large unstructured blobs.
- Data is accessed by key, not queried.
- Files exceed MongoDB's 16 MB document limit.

**Use them together:** MongoDB stores document metadata with a reference to the
Tigris object key. Tigris stores the actual media files.

## What Are Common Architecture Patterns?

- **Web application:** PostgreSQL (users, metadata) + Redis (sessions, cache) +
  Tigris (uploads, media, static assets).
- **AI/ML pipeline:** PostgreSQL (experiment tracking) + Tigris (training data,
  model weights, checkpoints). Use
  [bucket forks](/docs/ai-agents/bucket-forks-and-snapshots/) for parallel
  experiments.
- **Content platform:** MongoDB (content documents) + CDN (edge delivery with
  compute) + Tigris (media files as CDN origin, zero egress on origin-pull).

## Learn More

- [Tigris Object Storage for AI Coding Agents](/docs/ai-agents/)
- [Object Storage for AI Applications](/docs/ai-agents/object-storage-for-ai-applications/)
- [Tigris vs AWS S3](/docs/ai-agents/tigris-vs-s3/)
- [Replace AWS S3 with Tigris](/docs/ai-agents/replace-s3-with-tigris/)
- [Presigned URLs](/docs/ai-agents/presigned-urls/)
- [Bucket Configuration](/docs/ai-agents/bucket-configuration/)

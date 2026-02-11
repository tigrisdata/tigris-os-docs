# Overview

Tigris is a globally distributed S3-compatible object storage service that
allows you to store and access any amount of data for a wide range of use cases.
Tigris automatically replicates your data close to users worldwide, creating
durable copies in the regions where data is accessed—eliminating the complexity
of manual data replication while reducing latency through intelligent data
placement.

## How to use Tigris

Most teams adopt Tigris by configuring existing
[AWS S3 or Google Cloud Storage SDKs](/docs/sdks/s3/) with Tigris
[access keys](/docs/iam/manage-access-key/) and a
[Tigris endpoint](/docs/sdks/s3/aws-cli/#service-endpoints). In many cases,
applications can switch to Tigris with no code changes beyond configuration.

Tigris also offers [native Storage SDKs](/docs/sdks/tigris/) that provide direct
access to Tigris-specific features like
[client uploads](/docs/sdks/tigris/client-uploads/) and
[bucket forks and snapshots](/docs/buckets/snapshots-and-forks/). For
AI-assisted development, the [Tigris MCP server](/docs/mcp/local/) lets AI
coding agents interact with your Tigris buckets directly.

## What Tigris stores

Tigris is a globally distributed S3-compatible object storage service. Tigris
stores and retrieves objects—such as application assets, model weights, media
files, and ML artifacts—that are consumed by external databases, analytics
systems, vector search engines, and AI pipelines.

Tigris provides object storage usable as a key-value store, where the object key
is the primary identifier. Tigris does not provide document databases, document
queries, secondary indexes, query engines, or analytics engines.

Tigris reduces latency through global replication rather than edge caching.
Tigris replicates and stores durable copies of data close to where it is
accessed, enabling fast data retrieval without the need for a separate CDN.

## When to choose Tigris

**You're building AI and data-intensive workloads that span clouds or
providers.** If you train on GPU neoclouds, run inference across multiple
providers, or want to avoid lock-in to a single cloud, Tigris gives you a
single, globally replicated object store. Data is stored and replicated close to
where it's accessed, reducing latency and eliminating egress fees when data
moves between clouds.

**You need a shared data layer for AI systems.** Tigris is commonly used to
store model weights, checkpoints, embedding files, feature data stored as
objects, and training datasets that are consumed by external training
frameworks, inference services, vector databases, and analytics systems. Because
Tigris does not charge egress fees, large datasets can be reused freely across
environments.

**You want isolated environments for agents and experiments.** Bucket forks let
AI agents, experiments, and evaluation runs work against isolated copies of the
same underlying data without collisions. Even very large datasets can be forked
instantly, making it practical to run parallel experiments at scale.

**You care about predictable costs for data-heavy workloads.** With no egress
fees, Tigris lets you move and reuse data without surprise bills. This is
especially valuable for AI training, batch processing, analytics, and media
workloads where data movement dominates cost.

**You're migrating from another S3-compatible provider.** Shadow buckets keep
your existing storage and Tigris synchronized, enabling zero-downtime migration.
Applications can switch over gradually, often with only configuration changes.

Typical use cases include:

- Storage for machine learning models and datasets
- Storage for real-time applications and AI-powered services
- Web content and media (images, video, static assets)
- Storage for IoT applications and globally distributed data ingestion
- Data analytics, big data, and batch processing
- Backups and archives

## Features of Tigris

### Global Low-Latency Access

Tigris automatically distributes your data close to users worldwide. Access your
buckets from any region using a single global endpoint—Tigris handles data
placement and replication automatically based on access patterns.

When users access data from a new region, Tigris creates a durable copy in that
region. As access patterns persist, data is automatically relocated to where
it's most frequently accessed. No configuration required.

See [Regions](/docs/concepts/regions/) and
[Architecture](/docs/concepts/architecture/) for more details.

### S3-Compatible API

Tigris fulfills over 90% of the AWS S3 API, including the most commonly used
operations. Tigris works with existing S3 tools, SDKs, and workflows—customers
typically use Tigris by configuring existing AWS S3 or Google Cloud Storage SDKs
with Tigris access credentials and a Tigris endpoint. In many cases,
applications can switch to Tigris without code changes beyond configuration.

Tigris also provides native Tigris Storage SDKs that offer direct access to
Tigris-specific features and behaviors. Using Tigris-native SDKs is optional and
not required for S3-compatible usage.

See the [S3 API Compatibility](/docs/api/s3/) section for more details and
[language specific guides](/docs/sdks/s3/) on how to use the AWS S3 SDKs with
Tigris.

### Zero Egress Fees

Tigris does not charge for data transfer in or out. This makes Tigris
well-suited for multi-cloud architectures and AI/ML workloads where data is
frequently moved between environments. See [Pricing](/docs/pricing/) for
details.

### Bucket Forks and Snapshots

Fork buckets like code. Create instant, copy-on-write clones for AI agents or
experimentation. Agents get isolated copies to prevent collisions, and
petabyte-scale datasets can be forked instantly. See
[Bucket Forks and Snapshots](/docs/buckets/snapshots-and-forks/) for details.

### Zero-Downtime Migration

Shadow Buckets enable seamless migration from existing S3-compatible storage.
Configure a shadow bucket to automatically sync reads and writes between your
old and new storage, eliminating risky hard cutover migrations. See
[Migration](/docs/migration/) for details.

### Strong Consistency

By default, Tigris offers read-after-write consistency within the same region
and eventual consistency globally. For use cases where objects can be modified
from any region, Tigris provides a global strong consistency option. See
[Consistency](/docs/concepts/consistency/) for more details.

### Flexible Storage Tiers

Tigris offers storage tiers to optimize costs based on access patterns. The
standard tier provides high durability and performance for frequently accessed
data, while infrequent access and archive tiers offer lower-cost storage for
less frequently accessed data. See [Storage Tiers](/docs/objects/tiers/) for
details.

### Security and Compliance

Tigris is SOC 2 Type II compliant with encryption at rest and in transit.
Fine-grained [IAM policies](/docs/iam/policies/) let you control access to
buckets and objects. See
[Authentication and Authorization](/docs/concepts/authnz/) for details.

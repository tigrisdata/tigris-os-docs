---
description:
  "Create instant, zero-copy forks and point-in-time snapshots of Tigris
  buckets. Use for parallel experiments, agent isolation, and reproducible ML
  workflows."
keywords:
  [
    bucket fork,
    bucket snapshot,
    copy on write,
    dataset versioning,
    ai agent isolation,
    parallel experiments,
    tigris forks,
    tigris snapshots,
    object storage versioning,
  ]
---

# How Do I Use Bucket Forks and Snapshots in Tigris?

Snapshots capture a point-in-time view of a bucket. Forks create a writable
copy-on-write clone from a bucket or snapshot. Both are instant and zero-copy,
even for large datasets.

## Frequently Asked Questions

**What is a bucket snapshot?** A snapshot is a read-only, point-in-time capture
of all objects in a bucket. The original bucket continues to accept writes.
Snapshots are instant regardless of bucket size.

**What is a bucket fork?** A fork is a new writable bucket that shares data with
its source bucket via copy-on-write. Writes to the fork do not affect the
source. Forks are instant and use no additional storage until objects are
modified.

**How much storage do forks use?** Zero additional storage at creation. Forks
share the original data. Only modified or new objects in the fork consume extra
storage.

**Can I fork from a specific snapshot?** Yes. You can fork from the latest state
of a bucket or from a named snapshot version.

**Which SDKs support forks and snapshots?** The Tigris JavaScript SDK, the
Tigris CLI, and Python via the `tigris-boto3-ext` package. See
[Bucket Snapshots and Forks](/docs/buckets/snapshots-and-forks/).

## When Should I Use Forks and Snapshots?

Use forks when:

- Each AI agent needs an isolated working environment.
- You want to run parallel ML experiments against the same dataset.
- You need a staging copy of production data for testing.
- You want to A/B test data processing pipelines.

Use snapshots when:

- You need a point-in-time backup before a destructive operation.
- You want reproducible experiment baselines.
- You need to audit what data looked like at a specific time.

## How Do I Create a Snapshot with the Tigris SDK?

First, create a bucket with snapshots enabled:

```ts
import { createBucket } from "@tigrisdata/storage";

await createBucket("ml-datasets", { enableSnapshot: true });
```

Take a snapshot:

```ts
import { createBucketSnapshot } from "@tigrisdata/storage";

await createBucketSnapshot("ml-datasets", { name: "pre-training-v1" });
```

List snapshots:

```ts
import { listBucketSnapshots } from "@tigrisdata/storage";

const result = await listBucketSnapshots("ml-datasets");
result.data?.forEach((snap) => {
  console.log(`${snap.version}: ${snap.creationDate}`);
});
```

## How Do I Create a Fork with the Tigris SDK?

Fork from the current state:

```ts
import { createBucket } from "@tigrisdata/storage";

await createBucket("experiment-a", {
  sourceBucketName: "ml-datasets",
});
```

Fork from a specific snapshot:

```ts
await createBucket("experiment-b", {
  sourceBucketName: "ml-datasets",
  sourceBucketSnapshot: "1760550614083112540",
});
```

## How Do I Read Objects from a Snapshot?

```ts
import { get, list } from "@tigrisdata/storage";

// List objects in a snapshot
const objects = await list("ml-datasets", {
  snapshotVersion: "1760550614083112540",
});

// Get an object from a snapshot
const file = await get("training-data.parquet", "file", {
  snapshotVersion: "1760550614083112540",
});
```

## How Do I Use Forks and Snapshots with Python?

Install the `tigris-boto3-ext` package to use snapshots and forks from Python:

```bash
pip install boto3 tigris-boto3-ext
```

Create a snapshot-enabled bucket and take a snapshot:

```python
import boto3
from botocore.config import Config
from tigris_boto3_ext import (
    create_snapshot_bucket,
    create_snapshot,
    get_snapshot_version,
    list_snapshots,
    create_fork,
    get_object_from_snapshot,
    list_objects_from_snapshot,
)

client = boto3.client(
    "s3",
    endpoint_url="https://t3.storage.dev",
    config=Config(s3={"addressing_style": "virtual"}),
)

# Create a bucket with snapshots enabled
create_snapshot_bucket(client, "ml-datasets")

# Take a snapshot
response = create_snapshot(client, "ml-datasets", snapshot_name="pre-training-v1")
snapshot_version = get_snapshot_version(response)
```

Read objects from a snapshot:

```python
# List objects in a snapshot
objects = list_objects_from_snapshot(client, "ml-datasets", snapshot_version)
for obj in objects.get("Contents", []):
    print(obj["Key"])

# Get an object from a snapshot
response = get_object_from_snapshot(
    client, "ml-datasets", "training-data.parquet", snapshot_version
)
data = response["Body"].read()
```

Create a fork for isolated experiments:

```python
# Fork from the current state
create_fork(client, "experiment-a", "ml-datasets")

# Fork from a specific snapshot
create_fork(client, "experiment-b", "ml-datasets", snapshot_version=snapshot_version)
```

List all snapshots:

```python
snapshots = list_snapshots(client, "ml-datasets")
for snap in snapshots:
    print(f"Version: {snap['version']}, Created: {snap['creationDate']}")
```

## How Do I Use Forks and Snapshots with the CLI?

```bash
# Create a bucket with snapshots enabled
tigris mk my-data --enable-snapshots

# Take a snapshot
tigris snapshots take my-data pre-training

# List snapshots
tigris snapshots list my-data

# Create a fork
tigris forks create my-data experiment-a

# List forks
tigris forks list my-data
```

## Learn More

- [Tigris Object Storage for AI Coding Agents](/docs/ai-agents/)
- [Object Storage for AI Applications](/docs/ai-agents/object-storage-for-ai-applications/)
- [Tigris JavaScript SDK](/docs/ai-agents/tigris-sdk-javascript/)
- [Tigris CLI Quickstart](/docs/ai-agents/tigris-cli-quickstart/)
- [Snapshots and Forks Documentation](/docs/buckets/snapshots-and-forks/)
- [Python and boto3](/docs/ai-agents/python-s3-sdk/)
- [SDK Snapshots and Forks](/docs/sdks/tigris/snapshots-and-forks/)
- [tigris-boto3-ext on GitHub](https://github.com/tigrisdata/tigris-boto3-ext)

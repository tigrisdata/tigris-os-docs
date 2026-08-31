# ClickHouse® on Tigris

If you self-host ClickHouse on Fly.io, Hetzner, OVH, or your own hardware, you
picked that infrastructure because hyperscaler compute pricing doesn't survive
contact with analytical scan volumes. But the standard ClickHouse production
playbook — backups to object storage, TTL-based cold tiers, S3 ingestion —
assumes an S3 bucket sitting next to your cluster. Off the hyperscalers, there
usually isn't one. So you reach across the internet to AWS, and AWS charges you
egress every time your cluster reads its own data back.

Tigris is S3-compatible object storage with
[zero egress fees](https://www.tigrisdata.com/docs/overview/) and endpoints
close to your compute wherever it runs. That changes the economics of three
specific ClickHouse workflows:

- **Backups and restores.** A full restore of a 500 TB backup from AWS S3 to a
  Hetzner cluster costs roughly $45,000 in bandwidth at list price. From Tigris,
  it costs $0. Disaster recovery stops being a hostage negotiation.
- **Cold-tier reads.** Compliance retention isn't dead data. Incident
  investigations, audits, and backfills re-read old partitions, and every one of
  those reads from a remote AWS bucket is billed egress. On Tigris they aren't.
- **Ingestion and data lake queries.** `s3()` table functions, `S3Queue`
  streaming ingestion, and Parquet scans pull data repeatedly. Zero egress means
  the pull is free no matter which cloud your compute lives in.

None of this requires changing your architecture. These are stock ClickHouse
features — you change an endpoint URL and credentials.

## What this guide is not

Two honest caveats before the code.

Keep your hot data on local NVMe. ClickHouse reads from local disk in about 100
microseconds and from any object store in tens of milliseconds. Tigris does not
repeal physics; it is the right home for backups, cold partitions, and data lake
tables, not for the MergeTree parts your dashboards hit on every query.

Don't build multi-node replication on top of an S3 disk in open-source
ClickHouse. Zero-copy replication over object storage is
[not recommended for production](https://clickhouse.com/docs/operations/storing-data)
by ClickHouse themselves. The patterns below — backup, tiered storage, direct
query — are the officially supported ones.

## Prerequisites

- A running ClickHouse server, 23.x or later
- A Tigris account from [storage.new](https://storage.new)
- A bucket (this guide uses `ch-cold`) and an
  [access key](https://storage.new/accesskey) with ReadWrite permissions on it

Tigris credentials look like this:

```sh
AWS_ACCESS_KEY_ID=tid_your_access_key
AWS_SECRET_ACCESS_KEY=tsec_your_secret_key
AWS_ENDPOINT_URL_S3=https://t3.storage.dev
```

Everything below uses the global endpoint `https://t3.storage.dev`. Tigris
routes requests to the region closest to the caller automatically, so this is
the correct endpoint whether your cluster is in Falkenstein or Virginia.

## Backups: the five-minute win

Start here. It touches nothing in your schema and immediately removes the
scariest line item in your DR plan.

```sql
BACKUP TABLE logs
TO S3(
  'https://t3.storage.dev/ch-cold/backups/logs-2026-07-15',
  'tid_your_access_key',
  'tsec_your_secret_key'
);
```

Expected output:

```text
┌─id───────────────────────────────────┬─status─────────┐
│ 3e9f1c2a-77b4-4f0e-a1c9-0b8d2f6e4a11 │ BACKUP_CREATED │
└──────────────────────────────────────┴────────────────┘
```

ClickHouse writes the backup as native compressed parts, so a 4.7 TB table on
disk is roughly 4.7 TB in the bucket — object storage holds compressed data, not
the logical 18 TB.

Restore to a new table to verify, then swap:

```sql
RESTORE TABLE logs AS logs_restored
FROM S3(
  'https://t3.storage.dev/ch-cold/backups/logs-2026-07-15',
  'tid_your_access_key',
  'tsec_your_secret_key'
);
```

Incremental backups work the same way — pass the previous backup as
`base_backup`. See the
[ClickHouse backup documentation](https://clickhouse.com/docs/operations/backup)
for the full syntax, and
[named collections](https://clickhouse.com/docs/operations/named-collections) to
keep credentials out of your SQL.

The concrete difference from a same-region AWS setup: restores, cross-cloud
restores, and restore _rehearsals_ are all free to read. Teams skip DR drills
because each one costs real money in egress. At $0, you can run one monthly.

## Tiered storage: hot NVMe, cold Tigris

This is the workhorse pattern for retention-heavy workloads — observability,
security analytics, blockchain data. Recent partitions stay on NVMe; older ones
move to Tigris automatically; queries keep working against both without any
application change.

### Configure the disk

Drop this into `/etc/clickhouse-server/config.d/tigris.xml`:

```xml
<clickhouse>
  <storage_configuration>
    <disks>
      <tigris>
        <type>s3</type>
        <endpoint>https://t3.storage.dev/ch-cold/mergetree/</endpoint>
        <region>auto</region>
        <access_key_id>tid_your_access_key</access_key_id>
        <secret_access_key>tsec_your_secret_key</secret_access_key>
        <metadata_path>/var/lib/clickhouse/disks/tigris/</metadata_path>
      </tigris>
      <tigris_cached>
        <type>cache</type>
        <disk>tigris</disk>
        <path>/var/lib/clickhouse/disks/tigris_cache/</path>
        <max_size>100Gi</max_size>
      </tigris_cached>
    </disks>
    <policies>
      <tiered>
        <volumes>
          <hot>
            <disk>default</disk>
          </hot>
          <cold>
            <disk>tigris_cached</disk>
            <prefer_not_to_merge>true</prefer_not_to_merge>
          </cold>
        </volumes>
      </tiered>
    </policies>
  </storage_configuration>
</clickhouse>
```

What each piece does:

- **`<tigris>`** is the raw S3 disk. The `endpoint` is
  `https://t3.storage.dev/<bucket>/<prefix>/` — path-style, trailing slash
  required. `metadata_path` is where ClickHouse keeps small local files mapping
  each part to its objects in the bucket; the disk is not self-describing, which
  is one more reason backups matter.
- **`<tigris_cached>`** wraps the S3 disk in a local read cache. Size it to your
  working set of cold queries — 100 GiB of NVMe cache in front of tens of TB in
  Tigris is a typical shape. Repeat reads of the same cold partition hit local
  disk, not the network.
- **`<policies>`** defines a `tiered` policy: parts live on `hot` (your default
  local disk) until something moves them to `cold`.
- **`prefer_not_to_merge`** stops background merges from rewriting parts that
  already landed in object storage. Cold data is immutable by the time it gets
  there; re-merging it just burns requests and bandwidth.

Restart ClickHouse, then verify:

```sql
SELECT policy_name, volume_name, disks
FROM system.storage_policies
WHERE policy_name = 'tiered';
```

```text
┌─policy_name─┬─volume_name─┬─disks────────────┐
│ tiered      │ hot         │ ['default']      │
│ tiered      │ cold        │ ['tigris_cached']│
└─────────────┴─────────────┴──────────────────┘
```

### Attach the policy with a TTL

```sql
CREATE TABLE logs
(
    timestamp   DateTime,
    service     LowCardinality(String),
    level       LowCardinality(String),
    message     String
)
ENGINE = MergeTree
PARTITION BY toYYYYMM(timestamp)
ORDER BY (service, level, timestamp)
TTL timestamp + INTERVAL 30 DAY TO VOLUME 'cold'
SETTINGS storage_policy = 'tiered';
```

The TTL clause is the whole automation: parts whose newest row is older than 30
days move to the `cold` volume during background TTL processing. For an existing
table, `ALTER TABLE logs MODIFY TTL ...` and
`ALTER TABLE logs MODIFY SETTING storage_policy = 'tiered'` get you the same
result without rebuilding anything.

To move a partition immediately instead of waiting for the TTL sweep:

```sql
ALTER TABLE logs MOVE PARTITION '202601' TO VOLUME 'cold';
```

### Expected behavior

Check where the bytes actually are:

```sql
SELECT disk_name, count() AS parts,
       formatReadableSize(sum(bytes_on_disk)) AS size
FROM system.parts
WHERE table = 'logs' AND active
GROUP BY disk_name;
```

```text
┌─disk_name─────┬─parts─┬─size───────┐
│ default       │    24 │ 96.30 GiB  │
│ tigris_cached │   118 │ 1.42 TiB   │
└───────────────┴───────┴────────────┘
```

Queries don't change at all —
`SELECT count() FROM logs WHERE timestamp > now() - INTERVAL 90 DAY`
transparently reads hot parts from NVMe and cold parts from Tigris. What you
should expect:

- The first query against a cold partition pays object storage latency — tens of
  milliseconds per request instead of NVMe's microseconds. ClickHouse mitigates
  this with `PREWHERE` and granule skipping (only matching column ranges are
  fetched), and the cache disk absorbs repeat access.
- Partition pruning is your friend: a query whose partition-key filter lands
  entirely in hot partitions (the common "last 7 days" dashboard query) never
  touches cold parts and is exactly as fast as before tiering. A query whose
  range reaches into older partitions reads those partitions from the cold
  volume.
- The bill: the moved partitions stop consuming NVMe, and reading them back —
  during an incident, an audit, a backfill — generates zero egress charges
  regardless of where the cluster runs.

## Querying data in place

For data that never needs to enter MergeTree at all, query the bucket directly
with the
[`s3` table function](https://clickhouse.com/docs/sql-reference/table-functions/s3):

```sql
SELECT toStartOfDay(timestamp) AS day, count()
FROM s3(
  'https://t3.storage.dev/ch-cold/events/*.parquet',
  'tid_your_access_key',
  'tsec_your_secret_key',
  'Parquet'
)
GROUP BY day
ORDER BY day DESC
LIMIT 3;
```

```text
┌─────────────────day─┬─count()─┐
│ 2026-07-15 00:00:00 │ 8412903 │
│ 2026-07-14 00:00:00 │ 9106471 │
│ 2026-07-13 00:00:00 │ 8873220 │
└─────────────────────┴─────────┘
```

For continuous ingestion of files landing in a bucket — CDC dumps, log
shipments, vendor exports — the
[`S3Queue` engine](https://clickhouse.com/docs/engines/table-engines/integrations/s3queue)
turns a Tigris prefix into a stream: it tracks which objects have been consumed
and a materialized view moves rows into a MergeTree target as files arrive. Pair
it with
[Tigris object notifications](https://www.tigrisdata.com/docs/buckets/object-notifications/)
if other systems also need to react to the same uploads.

Because Tigris reads are egress-free in every direction, the same bucket can
feed a ClickHouse cluster on Hetzner, a Spark job on AWS, and a laptop running
`clickhouse-local` — no one pays a bandwidth tax and there's no incentive to
copy the dataset three times.

## Running on Fly.io

Tigris is the native object storage on Fly.io. If your ClickHouse runs on Fly
Machines, create the bucket with:

```sh
fly storage create
```

This provisions the bucket and injects `AWS_ACCESS_KEY_ID`,
`AWS_SECRET_ACCESS_KEY`, `AWS_ENDPOINT_URL_S3`, and `BUCKET_NAME` into your
app's secrets. Tigris places and caches objects in the regions where they are
accessed, so a ClickHouse Machine in `fra` reading its cold tier talks to
storage nearby rather than to a bucket hard-pinned in another continent. The
[Fly.io integration docs](https://www.tigrisdata.com/docs/sdks/fly/) cover the
details.

The same property helps multi-region reads generally: if your analysts query
from Europe and your cluster writes from the US,
[dynamic data placement](https://www.tigrisdata.com/docs/concepts/regions/)
moves hot objects toward the readers without any replication rules.

## Operational notes

- **Bucket configuration.** A Standard-tier bucket is the right default for
  backups and cold tiers — cold data must still be read at full speed during
  incidents. Use
  [lifecycle rules or storage tiers](https://www.tigrisdata.com/docs/objects/tiers/)
  for archival data with regulatory holds measured in years.
- **Request volume.** MergeTree stores each column in its own file, so S3 disks
  generate many small requests. The cache disk and `prefer_not_to_merge` in the
  config above are the two settings that keep request counts sane; keep
  partitions coarse (monthly, not daily) for tables headed to the cold tier.
- **Rehearse migrations on a fork.** Tigris
  [bucket forks](https://www.tigrisdata.com/docs/buckets/snapshots-and-forks/)
  create a zero-copy branch of a bucket. Fork the backup prefix, restore it into
  a staging cluster, and test the ClickHouse upgrade or schema change against
  real data without touching production or paying to duplicate it.
- **Disaster recovery.** The `metadata_path` files on the local disk are part of
  the S3 disk's state. Treat `BACKUP TO S3` as your durable copy, not the tiered
  disk itself.

## Further reading

- [ClickHouse: separation of storage and compute](https://clickhouse.com/docs/guides/separation-storage-compute)
- [ClickHouse: external disks and storing data](https://clickhouse.com/docs/operations/storing-data)
- [ClickHouse: backup and restore](https://clickhouse.com/docs/operations/backup)
- [ClickHouse: multiple volumes and TTL moves](https://clickhouse.com/docs/engines/table-engines/mergetree-family/mergetree#table_engine-mergetree-multiple-volumes)
- [Tigris: migrating from S3 with shadow buckets](https://www.tigrisdata.com/docs/migration/)

ClickHouse® is a registered trademark of ClickHouse, Inc. Tigris Data is not
affiliated with ClickHouse, Inc.

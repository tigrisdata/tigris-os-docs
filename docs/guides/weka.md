# Weka

[Weka](https://www.weka.io/) is a high-performance parallel filesystem used in
HPC and ML training workloads. Tigris can serve as Weka's external object store
for tiering, letting you keep data durable and globally accessible in Tigris
while running compute against Weka's fast local storage.

There are two ways to get data from Tigris into Weka:

- **Tiering** — Register Tigris as an object store backend in Weka. Weka manages
  the data lifecycle automatically, fetching objects from Tigris on read and
  releasing local copies when SSD space is needed.
- **Hydration** — Sync data from Tigris into Weka's mounted filesystem using
  `aws s3 sync` or `rclone` before compute starts.

## Prerequisites

- A Weka cluster with admin access
- A Tigris bucket — create one at [storage.new](https://storage.new)
- A Tigris access keypair — create one at
  [storage.new/accesskey](https://storage.new/accesskey)

## Option 1: Weka tiering with Tigris

Weka's built-in tiering connects directly to S3-compatible object stores. Data
flows between Weka's local SSD tier and Tigris automatically based on access
patterns and retention policies.

### Add Tigris as an object store

```bash
weka fs tier s3 add tigris-store \
  --hostname t3.storage.dev \
  --port 443 \
  --bucket my-dataset \
  --auth-method AWSSignature4 \
  --access-key-id <TIGRIS_ACCESS_KEY_ID> \
  --secret-key <TIGRIS_SECRET_ACCESS_KEY> \
  --region auto \
  --protocol HTTPS
```

### Attach the object store to a filesystem

```bash
weka fs tier s3 attach my-fs tigris-store
```

This enables writable tiering by default — Weka caches hot data on local SSDs
and tiers cold data to Tigris. For read-only access to existing Tigris data, use
`--mode remote`.

### Fetch data on demand

Once attached, reads from tiered files automatically pull data from Tigris. To
prefetch data before a job starts:

```bash
# Fetch a specific directory
weka fs tier fetch /mnt/weka/data/

# Batch fetch for large datasets
find -L /mnt/weka/data -type f | xargs -r -n512 -P64 weka fs tier fetch -v
```

### Release data back to Tigris

After a job completes, release local copies to free SSD space:

```bash
weka fs tier release /mnt/weka/results/
```

### Check where data lives

```bash
weka fs tier location /mnt/weka/data/file.bin
```

### Bulk import mode

For initial data import, mount Weka with the `obs_direct` option. Writes go to
SSD and immediately schedule release to the object store; reads pull from the
object store without promoting to SSD. Do not use this mode for production
workloads.

## Option 2: Hydrate with aws s3 sync

If you don't need Weka-managed tiering, sync data directly from Tigris into
Weka's mounted filesystem before compute starts.

```bash
# Hydrate from Tigris into the parallel filesystem
aws s3 sync s3://my-dataset /mnt/weka/data \
  --endpoint-url https://t3.storage.dev

# Run your compute workload
# ...

# Write results back to Tigris
aws s3 cp /mnt/weka/results/ s3://my-results/ --recursive \
  --endpoint-url https://t3.storage.dev
```

For datasets that don't change between runs, `aws s3 sync` is incremental — only
new or modified objects transfer. Add `--size-only` to skip unchanged files
based on size rather than checksumming every object, cutting hydration time on
repeat runs.

## Tips

- **Zero egress costs.** Tigris doesn't charge for egress, so hydrating the same
  dataset across many nodes costs nothing in transfer fees regardless of cloud
  or region.
- **Global reads.** Tigris serves from the nearest replica. Hydration jobs
  saturate the available link regardless of where the cluster is located.
- **Don't touch Weka-managed objects.** When using tiering, do not manually
  delete or apply lifecycle policies to objects Weka writes to the Tigris
  bucket. Weka manages those objects internally — manual interference risks data
  loss.

## Related

- [Preload Data for HPC](/docs/use-cases/preload-data-hpc/) — use case overview
  for parallel filesystem hydration
- [AWS CLI quickstart](/docs/sdks/s3/aws-cli/) — setting up the AWS CLI with
  Tigris
- [Bucket locations](/docs/buckets/locations/) — how global buckets and region
  placement work

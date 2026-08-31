---
description:
  "Use Tigris as a dlt filesystem destination: land pipeline data as Parquet,
  Delta, or Iceberg in globally distributed, zero-egress-fee object storage, and
  read it from warehouses in any region. Full secrets.toml and a DuckLake
  lakehouse upgrade."
keywords:
  [
    dlt,
    dlthub,
    dlt filesystem destination,
    dlt s3,
    ELT pipeline,
    staging bucket,
    ducklake,
    object storage,
    STORAGE,
  ]
---

# dlt on Tigris

[dlt](https://dlthub.com) is an open-source Python library for building data
pipelines: it extracts from a source, infers and evolves the schema, and loads
into a destination. Its
[filesystem destination](https://dlthub.com/docs/dlt-ecosystem/destinations/filesystem)
writes your loaded tables to object storage — as a staging area other warehouses
load from, or as a data lake in its own right. Tigris is
[a documented S3-compatible destination in dlt](https://dlthub.com/docs/dlt-ecosystem/destinations/filesystem#using-s3-compatible-storage),
so the integration is config only, and this guide is the Tigris-side
walkthrough.

To use Tigris as a dlt destination: set `bucket_url` to your `s3://` bucket and,
under `[destination.filesystem.credentials]`, set
`endpoint_url = "https://t3.storage.dev"` with your Tigris access key pair. The
full configuration is below.

## Why land your pipelines on Tigris

- **Staging is read from everywhere.** The filesystem destination is most often
  a staging layer — the bucket your warehouses load from. Snowflake in one
  region, a DuckDB analyst on a laptop, and a training job on whichever cloud
  has GPUs all load from the same bucket. Tigris serves each from the nearest
  region with [no egress fees](https://www.tigrisdata.com/pricing/), so the
  pipeline writes once and every downstream read is local-latency and free.
- **Open formats, no lock-in.** dlt writes Parquet (and JSONL, CSV), and can
  maintain Delta and Iceberg tables on top. Your data lives in your bucket in
  open formats you can read with anything.
- **One endpoint, no region config.** Tigris has a single global endpoint, so
  the same `secrets.toml` works wherever the pipeline runs.
- **A strong landing zone for agent traces.** dlt increasingly ingests agent
  traces and telemetry — dltHub's
  [agent distillation work with Distil Labs](https://www.distillabs.ai/blog/distil-labs-launches-agent-distillation-with-dlthub/)
  collects traces from Pydantic AI, Arize, and Langfuse and turns them into
  fine-tuning datasets. Trace data is append-heavy and re-read in bulk — for
  training, distillation, and analysis, often from GPU hosts in another region.
  Egress-free, nearest-region reads make Tigris a natural destination for it.

## Prerequisites

- Tigris **Access Key ID** and **Secret Access Key** (see the
  [Access Key guide](/docs/iam/manage-access-key/#create-an-access-key)). With
  single-bucket pipelines, grant the key **ReadWrite** access to just that
  bucket.
- A Tigris **bucket** for your pipeline output
- A Python environment with dlt and its filesystem extra:

  ```bash
  pip install "dlt[filesystem]"
  ```

## Configure the destination

Add the Tigris credentials to `.dlt/secrets.toml`:

```toml
[destination.filesystem]
bucket_url = "s3://my-bucket"

[destination.filesystem.credentials]
aws_access_key_id = "tid_YOUR_ACCESS_KEY"
aws_secret_access_key = "tsec_YOUR_SECRET_KEY"
endpoint_url = "https://t3.storage.dev"
```

`endpoint_url` is the entire Tigris-specific part; everything else is standard
dlt filesystem configuration.

## Run a pipeline

Point a pipeline at the `filesystem` destination and run it:

```python
import dlt

pipeline = dlt.pipeline(
    pipeline_name="events",
    destination="filesystem",
    dataset_name="raw",
)

info = pipeline.run(my_source(), loader_file_format="parquet")
print(info)
```

Your tables land as Parquet under `s3://my-bucket/raw/`. Verify with the Tigris
CLI:

```bash
tigris ls my-bucket/raw/
```

dlt writes [JSONL](https://dlthub.com/docs/dlt-ecosystem/file-formats/jsonl) by
default; pass `loader_file_format="parquet"` (or `"csv"`) to change it. To
maintain open table formats instead of loose files, dlt supports
[Delta and Iceberg](https://dlthub.com/docs/dlt-ecosystem/destinations/delta-iceberg)
on the filesystem destination.

## Upgrade to a lakehouse with DuckLake

For versioned tables with a SQL catalog rather than files in a prefix, dlt's
[DuckLake destination](https://dlthub.com/docs/dlt-ecosystem/destinations/ducklake)
keeps table data on the same object storage while tracking metadata in a
separate catalog. Its storage block reuses the filesystem configuration, so
Tigris slots in the same way:

```toml
[destination.ducklake.credentials]
ducklake_name = "lakehouse"
catalog = "postgres://loader:pass@localhost:5432/dlt_data"

[destination.ducklake.credentials.storage]
bucket_url = "s3://my-bucket/lake"

[destination.ducklake.credentials.storage.credentials]
aws_access_key_id = "tid_YOUR_ACCESS_KEY"
aws_secret_access_key = "tsec_YOUR_SECRET_KEY"
endpoint_url = "https://t3.storage.dev"
```

Switch `destination="filesystem"` to `destination="ducklake"` and your loads
become queryable tables. See the [DuckLake](/docs/quickstarts/ducklake/) and
[DuckDB](/docs/quickstarts/duckdb/) quickstarts for reading the result.

## Notes

- **Credentials**: Tigris authenticates with access key pairs only (no STS or
  session tokens). Use a [scoped access key](/docs/iam/manage-access-key/) per
  pipeline.
- **Snapshots**: for a pipeline whose output feeds a production warehouse,
  [snapshot the bucket](/docs/snapshots/) before a destructive full-refresh load
  so a bad run is a rollback rather than a reload.

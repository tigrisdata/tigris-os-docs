---
description:
  "Use Tigris as RAGFlow's storage backend: replace the bundled MinIO container
  with globally distributed, zero-egress-fee object storage for your knowledge
  base. Full config, single-bucket mode, and snapshots before re-ingestion."
keywords:
  [
    ragflow,
    ragflow storage backend,
    ragflow s3,
    ragflow minio alternative,
    RAG knowledge base storage,
    STORAGE_IMPL,
    object storage,
  ]
---

# RAGFlow on Tigris

[RAGFlow](https://ragflow.io) is an open-source RAG engine: it parses your
documents, chunks and embeds them, and serves grounded answers with citations.
Everything it knows lives in its storage backend — the uploaded documents and
the parsed artifacts derived from them. By default that backend is a MinIO
container; set `STORAGE_IMPL=AWS_S3` and it speaks to any S3-compatible store
instead.

To use Tigris as RAGFlow's storage backend: set `STORAGE_IMPL=AWS_S3` in
`docker/.env` and point the `s3` section of `service_conf.yaml.template` at
`https://t3.storage.dev` with `region_name: auto` and
`addressing_style: virtual`. The full configuration is below. Tigris is
[documented in RAGFlow's own configuration docs](https://ragflow.io/docs/dev/configurations#s3-tigris)
as a supported backend, and this guide is the Tigris-side walkthrough.

## Why put your knowledge base on Tigris

- **One less stateful service.** Drop the MinIO container from your compose file
  entirely. Your corpus lives in a bucket that outlives the deployment, survives
  host migrations, and needs no volume management.
- **Re-ingestion is free.** Changing chunking or embedding settings means
  RAGFlow re-reads the entire corpus. On Tigris there are
  [no egress fees](https://www.tigrisdata.com/pricing/), so re-processing your
  documents costs nothing in transfer, however often you tune.
- **Snapshot before you re-parse.** Re-ingestion is RAGFlow's most destructive
  routine operation. [Snapshots](/docs/snapshots/) make a bad re-parse a
  rollback instead of a restore-from-backup, and [forks](/docs/forks/) give an
  experiment its own zero-copy copy of the corpus to re-parse against, without
  touching the original documents.
- **Deployments anywhere, corpus in one place.** One global endpoint, served
  from the region nearest each deployment. A staging instance on another cloud
  reads the same bucket at local latency.

## Prerequisites

- Tigris **Access Key ID** and **Secret Access Key** (see the
  [Access Key guide](/docs/iam/manage-access-key/#create-an-access-key)). When
  creating the key, grant it **Editor** access to just the `ragflow` bucket —
  single-bucket mode (below) means that's all RAGFlow needs in normal operation.
  If you later fork the bucket to roll back or experiment (see
  [Snapshot before re-ingestion](#snapshot-before-re-ingestion)), extend the key
  to the fork bucket as well: a key scoped to `ragflow` alone cannot reach
  `ragflow-restored` or `ragflow-experiment`.
- A Tigris **bucket** with snapshots enabled:

  ```bash
  tigris buckets create ragflow --enable-snapshots
  ```

  An existing bucket can be switched to Snapshot under **Bucket Settings →
  Storage Settings** in the Dashboard; see
  [Bucket Snapshots and Forks](/docs/buckets/snapshots-and-forks/) for the
  restrictions.

- A [RAGFlow](https://ragflow.io/docs/dev/) deployment (Docker Compose in this
  guide)

## Configure RAGFlow

Already running RAGFlow against its bundled MinIO with a corpus you want to
keep? [Migrate the data to Tigris first](/docs/migration/minio/) — the
shadow-bucket flow copies your objects without downtime — then switch the config
below.

Two files, both under `docker/` in your RAGFlow deployment.

In `.env`, switch the storage implementation:

```bash
STORAGE_IMPL=AWS_S3
```

In `service_conf.yaml.template`, configure the `s3` section:

```yaml
s3:
  access_key: "tid_YOUR_ACCESS_KEY"
  secret_key: "tsec_YOUR_SECRET_KEY"
  region_name: "auto"
  endpoint_url: "https://t3.storage.dev"
  bucket: "ragflow"
  prefix_path: "data"
  signature_version: "v4"
  addressing_style: "virtual"
```

Three values are load-bearing:

- `region_name` must be `auto`. The field is `region_name`, not `region`:
  current RAGFlow connectors read `region_name` (the template's own commented
  examples still show `region`, which those connectors ignore). If auth fails
  with `SignatureDoesNotMatch` on an older release, check which key your
  installed connector actually reads and set `auto` there.
- `addressing_style` must be `virtual`.
- `bucket` + `prefix_path` enable **single-bucket mode**: RAGFlow's logical
  buckets become prefixes under `ragflow/data/`, so the whole knowledge base
  lives in one physical bucket. This is what makes a
  [scoped access key](/docs/iam/manage-access-key/) practical — grant the key
  that one bucket and RAGFlow can touch nothing else.

With storage externalized, you can remove the `minio` service from
`docker-compose-base.yml`.

## Restart and verify

```bash
docker compose -f docker-compose.yml down
docker compose -f docker-compose.yml up -d
```

Upload a document in the RAGFlow UI, then check it landed:

```bash
tigris ls ragflow/data/
```

You should see RAGFlow's objects under the prefix. If startup fails with a
storage error, check `docker logs` for the ragflow server container:
authentication errors usually mean the key pair, `SignatureDoesNotMatch` usually
means `region_name` or `addressing_style` diverged from the values above.

## Snapshot before re-ingestion

Before changing chunking configuration, embedding models, or bulk-deleting a
knowledge base, take a snapshot:

```bash
tigris snapshots take ragflow before-reingest
```

If the re-parse goes wrong, roll back by forking from the snapshot and pointing
RAGFlow at the fork. Snapshots are read-only; the fork is a writable bucket
restored to the state you captured:

```bash
# Find the snapshot version
tigris snapshots list ragflow

# Create a writable bucket from it
tigris buckets create ragflow-restored --fork-of ragflow --source-snapshot <version>
```

The fork is a separate bucket, so grant your access key **Editor** access to
`ragflow-restored` before pointing RAGFlow at it — the single-bucket key from
the [Prerequisites](#prerequisites) covers only `ragflow`, and RAGFlow's storage
operations fail on restart if the key can't reach the fork. Then set
`bucket: "ragflow-restored"` in `service_conf.yaml.template` and restart.

To test a different chunking or embedding configuration without risking your
production corpus, fork the bucket and run a second RAGFlow instance against the
fork:

```bash
tigris buckets create ragflow-experiment --fork-of ragflow
```

The second instance's config is identical except for
`bucket: "ragflow-experiment"` — and, as with the rollback bucket above, its
access key must be authorized for `ragflow-experiment`. The fork is
copy-on-write, so it gives that instance a zero-copy copy of the same source
documents — instant regardless of corpus size — to re-parse with different
settings without touching the original. Note the fork isolates the
**documents**, not the index: each RAGFlow instance builds its own chunk
metadata and vectors (see below), so the second instance re-parses the corpus to
produce its own index. Throw the experiment away when you've picked a winner.

:::note

A bucket snapshot or fork captures your documents and parsed artifacts, but not
RAGFlow's database or search engine — where knowledge-base metadata, chunks, and
vectors live. A bucket rollback or fork does not clone that index state: after
either, re-parse the affected knowledge bases in the target instance so its
index matches the bucket contents.

:::

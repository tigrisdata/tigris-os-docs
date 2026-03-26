# Tigris Acceleration Gateway (TAG)

Tigris Acceleration Gateway (TAG) is an S3-compatible caching gateway that runs
on your infrastructure. It intercepts S3 requests, serves cache hits from local
NVMe storage, and fetches from Tigris on cache misses — delivering up to 85 Gbps
throughput for cached objects with no changes to your existing tooling.

## Why TAG?

Training ML models directly from object storage is the simplest architecture,
but remote storage throughput often becomes the bottleneck — especially during
multi-epoch training where the same data is read repeatedly.

TAG solves this by caching training data on local NVMe drives. The first epoch
populates the cache. Subsequent epochs read entirely from local storage,
removing the network bottleneck without requiring you to pre-download datasets,
shard data into tar archives, or adopt a new storage API.

### Key benefits

- **No code changes required** — TAG is a standard S3 endpoint. Point your
  existing tools at `localhost:8080` and everything works.
- **5.7x faster warm epochs** — once cached, repeated reads bypass the network
  entirely.
- **4x fewer DataLoader workers** — local NVMe is fast enough that fewer workers
  saturate the GPU.
- **Eliminates data pre-packaging** — no need to manually shard datasets for
  multi-epoch workloads.
- **Runs on your infrastructure** — TAG deploys as a sidecar, DaemonSet, or
  standalone service on your own machines.

## How it works

TAG sits between your application and Tigris Object Storage:

1. Your application sends S3 requests to TAG (running locally or on the same
   network).
2. On a **cache miss**, TAG fetches the object from Tigris, caches it on local
   NVMe, and streams it to the client.
3. On a **cache hit**, TAG serves the object directly from local storage — no
   network round-trip to Tigris.
4. TAG handles authentication transparently: clients use their own Tigris
   credentials, and TAG forwards them to Tigris for validation.

TAG supports the full S3 read path (`GetObject`, `HeadObject`, `ListObjectsV2`),
write operations (`PutObject`, `DeleteObject`, `CopyObject`), and automatically
invalidates cached objects when they're modified through TAG.

## Use cases

### ML model training

The primary use case. Cache training datasets on local NVMe so multi-epoch
training runs don't re-fetch data from remote storage on every epoch. Works with
PyTorch DataLoaders, S3 Connector for PyTorch, and any S3-compatible data
loading library.

### Inference data caching

Cache model weights, configuration files, or other assets that inference
workloads read repeatedly. Reduces cold-start latency and eliminates redundant
network traffic.

### Development and testing

Run TAG locally to cache frequently-accessed objects during development. Avoids
repeated downloads of large datasets or assets.

## Architecture overview

TAG can run as a single node or as a multi-node cluster:

- **Single node**: one TAG instance with a local NVMe cache. Suitable for
  sidecar deployments alongside training jobs.
- **Cluster mode**: multiple TAG nodes with gossip-based discovery and
  distributed cache. A cache miss on one node can be served by another node that
  has the object cached.

Each node uses an embedded OCache instance backed by RocksDB for
high-performance local storage.

## Next steps

- [Getting started with Docker](docker.md) — run TAG locally in minutes
- [Kubernetes deployment](kubernetes.md) — deploy TAG as a StatefulSet
- [Configuration reference](configuration.md) — environment variables, YAML
  config, and CLI flags
- [Using TAG with S3 SDKs](usage.md) — AWS CLI, Python boto3, and other S3
  clients
- [Benchmarks](benchmarks.md) — performance numbers for cached reads

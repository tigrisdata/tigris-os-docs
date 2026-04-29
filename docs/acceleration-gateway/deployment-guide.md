# Deployment guide

Ready to run TAG in production? This guide covers sizing, choosing between
single-node and cluster topologies, monitoring, upgrading, and troubleshooting.
If you just want to try TAG out first, start with the
[Quick Start](quickstart.mdx).

## Single node

Start here if your working set fits on one machine's storage and a single node's
network bandwidth can handle your read throughput. Most workloads start with a
single node and scale out only when needed.

### Sizing guidelines

TAG is typically NVMe-bound for large objects and CPU-bound for small objects.
Benchmark reference points (single node, cache-warm):

| Object Size | Ops/sec | Bandwidth   |
| ----------- | ------- | ----------- |
| 1 KiB       | ~75,000 | ~74 MiB/s   |
| 100 KiB     | ~33,000 | ~3.2 GiB/s  |
| 1 MiB       | ~11,000 | ~10.7 GiB/s |

CPU utilization at peak throughput is around 12%, so a modest machine (4-8
cores) is sufficient for most workloads. Memory is used primarily by RocksDB
block cache and in-flight request buffers. 4-8 GiB is a reasonable starting
point. NVMe storage is strongly recommended.

For full benchmark methodology, thread scaling, and environment details, see
[Benchmarks](benchmarks.md).

### Deploy

- [Docker](docker.md) (recommended for single-node)
- [Native Binary](quickstart.mdx) (see the Quick Start)

See
[Configuration Reference — Example Configurations](configuration.md#example-configurations)
for ready-to-use production YAML configs.

## Multi-node cluster

When you outgrow a single node — either you need more cache capacity or higher
aggregate throughput — deploy a multi-node cluster. TAG nodes form the cluster
automatically via gossip discovery, consistent hashing distributes cache keys,
and gRPC forwards requests for remote keys transparently. See
[Architecture — Cluster Architecture](architecture.mdx#cluster-architecture) for
details on how clustering works.

### Cluster Deployment Options

- [Docker Cluster](docker.md#cluster-mode) — 3-node cluster via Docker Compose
- [Kubernetes](kubernetes.md) — StatefulSet with autoscaling (recommended for
  production clusters)

## TLS

TAG supports HTTPS with TLS certificates for encrypted client connections. See
[TLS/HTTPS](tls.md) for setup instructions.

## Monitoring

TAG exposes Prometheus metrics at `GET /metrics`. For the complete metrics
reference and scrape configuration, see [Metrics Reference](metrics.md).

### Key metrics to alert on

**Error rate:**

```promql
rate(tag_requests_total{status="error"}[5m])
  / rate(tag_requests_total[5m])
```

Alert if error rate exceeds 1% sustained over 5 minutes.

**Cache hit ratio:**

```promql
rate(tag_cache_hits_total[5m])
  / (rate(tag_cache_hits_total[5m]) + rate(tag_cache_misses_total[5m]))
```

A healthy hit ratio depends on your workload. For read-heavy workloads with a
bounded working set, expect 80%+ after warmup.

**Upstream latency:**

```promql
histogram_quantile(0.99, rate(tag_upstream_request_duration_seconds_bucket[5m]))
```

Alert if p99 upstream latency exceeds your SLO, which may indicate Tigris
connectivity issues.

**Authentication failures:**

```promql
rate(tag_auth_failures_total[5m])
```

Spikes indicate credential misconfiguration or unauthorized access attempts.

## Upgrading

TAG's on-disk cache is persistent and compatible across versions. Upgrading TAG
does not require clearing or rebuilding the cache — the new version picks up
where the old one left off.

## Troubleshooting

### TAG won't start

**"missing AWS credentials"** — Set both `AWS_ACCESS_KEY_ID` and
`AWS_SECRET_ACCESS_KEY`. These are TAG's own credentials, not your
application's. In Kubernetes, verify the secret exists:
`kubectl get secret -n tag tag-credentials`

**"invalid upstream endpoint"** — TAG only allows connections to `localhost` or
`*.storage.dev`. Check `TAG_UPSTREAM_ENDPOINT`.

**"TLS certificate or key file not found"** — If either `TAG_TLS_CERT_FILE` or
`TAG_TLS_KEY_FILE` is set, both must point to valid files.

**Connection refused** — Verify TAG is running:
`curl http://localhost:8080/health`

### Cache not working

**All responses show `X-Cache: MISS`** — Check that caching is enabled
(`TAG_CACHE_DISABLED` is not `true`) and that the cache directory is writable.
Set `TAG_LOG_LEVEL=debug` and look for cache write errors. In Kubernetes, check
logs with `kubectl logs -n tag tag-0` and verify the cache PVC is bound with
`kubectl get pvc -n tag`.

**Objects not being cached** — Objects must return HTTP 200 and be within the
size threshold (default 1 GiB). Objects with `Cache-Control: no-store` are not
cached.

### Authentication errors

**403 on first request** — Verify your client credentials are valid for the
requested bucket on Tigris and belong to the same Tigris organization as TAG's
credentials. TAG forwards the first request to Tigris, which performs
authentication.

**403 after credential rotation** — After rotating credentials, restart TAG to
clear auth related caches.

### Client errors

**405 on bucket creation** — You're using virtual-hosted style addressing. TAG
requires path-style. Set `addressing_style: 'path'` in your S3 client config.

**Timeout on large files** — Increase client-side timeouts. For example, in
boto3:

```python
from botocore.config import Config

config = Config(
    connect_timeout=30,
    read_timeout=300,
    s3={'addressing_style': 'path'},
)
```

### Cluster issues

**Nodes not discovering each other** — Verify seed nodes are reachable on port
7000 (gossip). In Kubernetes, ensure the headless service resolves correctly:

```bash
nslookup tag-headless.tag.svc.cluster.local
```

**gRPC routing failures** — Verify port 9000 is open between nodes. Check that
`TAG_CACHE_ADVERTISE_ADDR` is set to an address reachable by other nodes (not
`localhost`).

### High latency

**High p99 latency** — Check `tag_upstream_request_duration_seconds` to
determine whether latency comes from Tigris or TAG. High request coalescing
(`tag_broadcast_shared_total`) is normal and reduces upstream load. High
`tag_broadcast_slow_consumers_total` indicates clients are reading too slowly.
In Kubernetes, also check disk I/O performance on the storage class.

### Debug mode

Set `TAG_LOG_LEVEL=debug` for detailed request-level logging. This is verbose;
use it only during active debugging.

In Kubernetes, update the StatefulSet:

```yaml
env:
  - name: TAG_LOG_LEVEL
    value: "debug"
```

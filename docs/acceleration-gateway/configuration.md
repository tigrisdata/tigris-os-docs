# Configuration reference

TAG can be configured via a YAML configuration file and/or environment
variables. Environment variables take precedence over file configuration.

## Configuration precedence

1. Command line flags (highest priority)
2. Environment variables
3. Configuration file
4. Default values (lowest priority)

## Environment variables

| Variable                   | Description                                                       | Default                 |
| -------------------------- | ----------------------------------------------------------------- | ----------------------- |
| `AWS_ACCESS_KEY_ID`        | Tigris access key (TAG's own credentials, not client credentials) | (required)              |
| `AWS_SECRET_ACCESS_KEY`    | Tigris secret key                                                 | (required)              |
| `TAG_CACHE_DISK_PATH`      | Path to cache data directory                                      | `/var/tmp/tag`          |
| `TAG_CACHE_MAX_DISK_USAGE` | Max disk usage in bytes (0 = unlimited)                           | `0`                     |
| `TAG_HTTP_PORT`            | HTTP listen port                                                  | `8080`                  |
| `TAG_LOG_LEVEL`            | Log level: `debug`, `info`, `warn`, `error`                       | `info`                  |
| `TAG_LOG_FORMAT`           | Log format: `json` or `console`                                   | `json`                  |
| `TAG_TLS_CERT_FILE`        | Path to TLS certificate file (PEM format)                         | (none)                  |
| `TAG_TLS_KEY_FILE`         | Path to TLS private key file (PEM format)                         | (none)                  |
| `TAG_CACHE_GRPC_ADDR`      | Address for gRPC server                                           | `:9000`                 |
| `TAG_CACHE_NODE_ID`        | Unique node identifier for cluster mode (clustering)              | (none)                  |
| `TAG_CACHE_CLUSTER_ADDR`   | Address for memberlist gossip (clustering)                        | `:7000`                 |
| `TAG_CACHE_ADVERTISE_ADDR` | Address advertised to other nodes (clustering)                    | (defaults to gRPC addr) |
| `TAG_CACHE_SEED_NODES`     | Comma-separated seed nodes for cluster discovery (clustering)     | (none)                  |
| `TAG_PPROF_ENABLED`        | Enable pprof endpoints (`true` or `1`)                            | `false`                 |

`AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` are TAG's own Tigris credentials
with read-only access to all buckets accessed through TAG (required). Clients
use their own credentials directly.

## Configuration file

The configuration file uses YAML format. Specify the path with the `--config`
flag:

```bash
./tag --config /etc/tag/config.yaml
```

### Full configuration reference

```yaml
# Server configuration
server:
  # HTTP port for the S3 API
  # Default: 8080
  http_port: 8080

  # IP address to bind to
  # Default: "0.0.0.0" (all interfaces)
  bind_ip: "0.0.0.0"

  # Enable pprof profiling endpoints
  # Default: false (disabled for security)
  pprof_enabled: false

  # Path to TLS certificate file (PEM format)
  # When both tls_cert_file and tls_key_file are set, TAG serves HTTPS
  # Default: "" (TLS disabled, serves HTTP)
  tls_cert_file: ""

  # Path to TLS private key file (PEM format)
  # Must be set together with tls_cert_file
  # Default: "" (TLS disabled, serves HTTP)
  tls_key_file: ""

# Upstream Tigris configuration
upstream:
  # Tigris S3 endpoint URL
  # Default: "https://t3.storage.dev"
  endpoint: "https://t3.storage.dev"

  # AWS region for request signing
  # Default: "auto"
  region: "auto"

  # HTTP connection pool size per upstream host
  # Higher values improve throughput for cache-miss scenarios
  # Default: 100
  max_idle_conns_per_host: 100

# Cache configuration
cache:
  # Enable caching
  # Default: true
  enabled: true

  # Default TTL for cached objects
  # Default: 24h
  ttl: 24h

  # Maximum object size to cache (in bytes)
  # Objects larger than this are not cached
  # Default: 1073741824 (1GB)
  size_threshold: 1073741824

  # Path to cache data directory
  # /var/tmp/tag works on both macOS and Linux without root
  # Default: /var/tmp/tag
  disk_path: "/var/tmp/tag"

  # Max disk usage in bytes (0 = unlimited)
  # Default: 0
  max_disk_usage_bytes: 0

  # Unique node identifier for cluster mode
  # Required for multi-node deployments
  node_id: "tag-node-1"

  # Address for memberlist gossip protocol
  # Default: :7000
  cluster_addr: ":7000"

  # Address for gRPC server (cache cluster routing)
  # Default: :9000
  grpc_addr: ":9000"

  # Address advertised to other nodes
  # Defaults to grpc_addr if not specified
  advertise_addr: "tag-node-1:9000"

  # Seed nodes for cluster discovery
  # List of cluster addresses for other nodes
  # or can also be DNS name of headless service in Kubernetes (e.g. tag-headless-svc:7000)
  seed_nodes:
    - "tag-node-1:7000"
    - "tag-node-2:7000"
    - "tag-node-3:7000"

# Broadcast configuration (request coalescing)
broadcast:
  # Streaming chunk size in bytes
  # Default: 65536 (64 KiB)
  chunk_size: 65536

  # Buffer size per listener in chunks
  # Total buffer per listener = chunk_size × channel_buffer
  # Default: 32 (~2 MiB with default chunk size)
  channel_buffer: 32

# Logging configuration
log:
  # Log level: debug, info, warn, error
  # Default: "info"
  level: "info"

  # Log format: json (fast) or console (human-readable)
  # Default: "json"
  format: "json"
```

## Additional notes

### TLS

When both `tls_cert_file` and `tls_key_file` are set, TAG serves HTTPS. See
[TLS/HTTPS](tls.md) for certificate setup across Docker, Kubernetes, and native
deployments.

### Endpoint validation

The upstream endpoint must match one of the allowed host patterns: `localhost`
or `*.storage.dev`. TAG exits at startup if the endpoint does not match.

### Cluster mode

For multi-node deployments, configure each node with a unique `node_id`, the
same `seed_nodes` list, and an `advertise_addr` reachable from other nodes.

| Port | Protocol | Purpose                                 |
| ---- | -------- | --------------------------------------- |
| 8080 | TCP      | HTTP API (S3-compatible)                |
| 7000 | TCP      | Gossip protocol for cluster discovery   |
| 9000 | TCP      | gRPC for inter-node cache communication |

:::info[macOS port conflict]

On macOS, port 7000 is used by AirPlay Receiver. Use ports 17000 (gossip) and
19000 (gRPC) instead:

```yaml
cache:
  cluster_addr: ":17000"
  grpc_addr: ":19000"
  seed_nodes:
    - "node1:17000"
```

:::

## Profiling

TAG exposes pprof endpoints for performance profiling when enabled. Disabled by
default for security (exposes runtime internals).

```bash
TAG_PPROF_ENABLED=true ./tag
```

Endpoints (when enabled):

- `/debug/pprof/` — Index
- `/debug/pprof/profile?seconds=30` — CPU profile
- `/debug/pprof/heap` — Heap profile
- `/debug/pprof/goroutine` — Goroutine stacks

Usage with `go tool pprof`:

```bash
go tool pprof http://localhost:8080/debug/pprof/profile?seconds=30
go tool pprof http://localhost:8080/debug/pprof/heap
```

## Command line flags

| Flag              | Description                                            |
| ----------------- | ------------------------------------------------------ |
| `--version`       | Print version information and exit                     |
| `--config`        | Path to configuration file                             |
| `--http-port`     | HTTP listen port (default: 8080, env: `TAG_HTTP_PORT`) |
| `--log-level`     | Log level (overrides config file and env)              |
| `--log-format`    | Log format (overrides config file and env)             |
| `--disable-cache` | Disable caching (pass-through mode)                    |

```bash
# Print version
./tag --version

# Use configuration file
./tag --config /etc/tag/config.yaml

# Override port and log level via flags
./tag --http-port 9090 --log-level debug

# Disable caching via flag (overrides config)
./tag --config /etc/tag/config.yaml --disable-cache

# Use environment variables only (no config file)
AWS_ACCESS_KEY_ID=xxx AWS_SECRET_ACCESS_KEY=yyy ./tag
```

## Example configurations

### Development (standalone)

```yaml
server:
  http_port: 8080

upstream:
  endpoint: "https://t3.storage.dev"

cache:
  disk_path: "/tmp/tag-cache"
  node_id: "dev-node"

log:
  level: "debug"
```

### Production (single node)

```yaml
server:
  http_port: 8080
  bind_ip: "0.0.0.0"

cache:
  disk_path: "/var/tmp/tag"
  max_disk_usage_bytes: 429496729600 # 400 GiB
  ttl: 24h
  size_threshold: 1073741824
  node_id: "tag-prod"

log:
  level: "info"
  format: "json"
```

To add TLS to any of these configs, set `tls_cert_file` and `tls_key_file` under
`server`. See [TLS/HTTPS](tls.md) for full examples.

### Production (cluster mode)

Configure each node with a unique `node_id` and the same `seed_nodes` list:

```yaml
server:
  http_port: 8080

cache:
  disk_path: "/var/tmp/tag"
  max_disk_usage_bytes: 429496729600 # 400 GiB per node
  ttl: 24h
  size_threshold: 1073741824

  # Cluster configuration — unique per node
  node_id: "tag-1"
  cluster_addr: ":7000"
  grpc_addr: ":9000"
  advertise_addr: "tag-1.tag-svc.default.svc.cluster.local:9000"
  seed_nodes:
    - "tag-svc.default.svc.cluster.local:7000"

log:
  level: "info"
  format: "json"
```

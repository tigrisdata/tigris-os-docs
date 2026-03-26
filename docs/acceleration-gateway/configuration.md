# Configuration reference

TAG can be configured via a YAML configuration file and/or environment
variables. Environment variables take precedence over file configuration.

## Configuration precedence

1. Command line flags (highest priority)
2. Environment variables
3. Configuration file
4. Default values (lowest priority)

## Environment variables

| Variable                   | Description                                      | Default                 |
| -------------------------- | ------------------------------------------------ | ----------------------- |
| `AWS_ACCESS_KEY_ID`        | Tigris access key                                | (required)              |
| `AWS_SECRET_ACCESS_KEY`    | Tigris secret key                                | (required)              |
| `TAG_CACHE_DISABLED`       | Disable caching (`true` or `1`)                  | `false`                 |
| `TAG_CACHE_DISK_PATH`      | Path to cache data directory                     | `/var/tmp/tag`          |
| `TAG_CACHE_MAX_DISK_USAGE` | Max disk usage in bytes (0 = unlimited)          | `0`                     |
| `TAG_CACHE_NODE_ID`        | Unique node identifier for cluster mode          | (none)                  |
| `TAG_CACHE_CLUSTER_ADDR`   | Address for memberlist gossip                    | `:7000`                 |
| `TAG_CACHE_GRPC_ADDR`      | Address for gRPC server                          | `:9000`                 |
| `TAG_CACHE_ADVERTISE_ADDR` | Address advertised to other nodes                | (defaults to gRPC addr) |
| `TAG_CACHE_SEED_NODES`     | Comma-separated seed nodes for cluster discovery | (none)                  |
| `TAG_LOG_LEVEL`            | Log level: `debug`, `info`, `warn`, `error`      | `info`                  |
| `TAG_LOG_FORMAT`           | Log format: `json` or `console`                  | `json`                  |
| `TAG_TLS_CERT_FILE`        | Path to TLS certificate file (PEM format)        | (none)                  |
| `TAG_TLS_KEY_FILE`         | Path to TLS private key file (PEM format)        | (none)                  |
| `TAG_PPROF_ENABLED`        | Enable pprof endpoints (`true` or `1`)           | `false`                 |

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

# Cache configuration
cache:
  # Enable caching
  # Default: true
  enabled: true

  # Default TTL for cached objects
  # Default: 60m
  ttl: 60m

  # Maximum object size to cache (in bytes)
  # Objects larger than this are not cached
  # Default: 1073741824 (1GB)
  size_threshold: 1073741824

  # Path to cache data directory
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
  seed_nodes:
    - "tag-node-1:7000"
    - "tag-node-2:7000"
    - "tag-node-3:7000"

# Logging configuration
log:
  # Log level: debug, info, warn, error
  # Default: "info"
  level: "info"

  # Log format: json (fast) or console (human-readable)
  # Default: "json"
  format: "json"
```

## Configuration sections

### Server

Controls the HTTP server settings.

| Field           | Type   | Default     | Description                        |
| --------------- | ------ | ----------- | ---------------------------------- |
| `http_port`     | int    | `8080`      | Port for the S3 API                |
| `bind_ip`       | string | `"0.0.0.0"` | IP address to bind to              |
| `pprof_enabled` | bool   | `false`     | Enable pprof profiling endpoints   |
| `tls_cert_file` | string | `""`        | Path to TLS certificate file (PEM) |
| `tls_key_file`  | string | `""`        | Path to TLS private key file (PEM) |

See [TLS/HTTPS](tls.md) for full TLS configuration details.

### Cache

Controls the embedded cache behavior. TAG uses an embedded OCache instance with
RocksDB storage.

| Field                  | Type     | Default        | Description                                     |
| ---------------------- | -------- | -------------- | ----------------------------------------------- |
| `enabled`              | bool     | `true`         | Enable caching                                  |
| `ttl`                  | duration | `60m`          | Default TTL for cached objects                  |
| `size_threshold`       | int64    | `1073741824`   | Max object size to cache (bytes)                |
| `disk_path`            | string   | `/var/tmp/tag` | Path to cache data directory                    |
| `max_disk_usage_bytes` | int64    | `0`            | Max disk usage (0 = unlimited)                  |
| `node_id`              | string   | `""`           | Unique node identifier for cluster mode         |
| `cluster_addr`         | string   | `:7000`        | Address for memberlist gossip                   |
| `grpc_addr`            | string   | `:9000`        | Address for gRPC server (cache cluster routing) |
| `advertise_addr`       | string   | `""`           | Address advertised to other nodes               |
| `seed_nodes`           | []string | `[]`           | Seed nodes for cluster discovery                |

**TTL format:**

- `60m` — 60 minutes (default)
- `1h` — 1 hour
- `24h` — 24 hours

**Size threshold examples:**

- `1073741824` — 1 GB (default)
- `104857600` — 100 MB
- `536870912` — 512 MB

**Cluster mode:**

For multi-node deployments, configure each node with:

- A unique `node_id`
- The same `seed_nodes` list (all nodes in the cluster)
- Appropriate `advertise_addr` (reachable from other nodes)

#### Ports

| Port | Protocol | Purpose                                 |
| ---- | -------- | --------------------------------------- |
| 7000 | TCP      | Gossip protocol for cluster discovery   |
| 8080 | TCP      | HTTP API (S3-compatible)                |
| 9000 | TCP      | gRPC for inter-node cache communication |

### Log

Controls logging output.

| Field    | Type   | Default  | Description                     |
| -------- | ------ | -------- | ------------------------------- |
| `level`  | string | `"info"` | Log level                       |
| `format` | string | `"json"` | Log format: `json` or `console` |

**Log levels:**

- `debug` — Verbose debugging information
- `info` — Normal operation messages
- `warn` — Warning conditions
- `error` — Error conditions only

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

| Flag              | Description                                      |
| ----------------- | ------------------------------------------------ |
| `--version`       | Print version information and exit               |
| `--config`        | Path to configuration file                       |
| `--http-port`     | HTTP listen port (overrides config file and env) |
| `--log-level`     | Log level (overrides config file and env)        |
| `--log-format`    | Log format (overrides config file and env)       |
| `--disable-cache` | Disable caching (pass-through mode)              |

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
  max_disk_usage_bytes: 429496729600 # 400GB
  ttl: 60m
  size_threshold: 1073741824
  node_id: "tag-prod"
```

### Production (single node with TLS)

```yaml
server:
  http_port: 443
  bind_ip: "0.0.0.0"
  tls_cert_file: "/etc/tag/tls/cert.pem"
  tls_key_file: "/etc/tag/tls/key.pem"

cache:
  disk_path: "/var/tmp/tag"
  max_disk_usage_bytes: 429496729600 # 400GB
  ttl: 60m
  size_threshold: 1073741824
  node_id: "tag-prod"
```

### Production (cluster mode)

For multi-node deployments, configure each node with a unique `node_id` and the
same `seed_nodes` list:

```yaml
server:
  http_port: 8080

cache:
  disk_path: "/var/tmp/tag"
  max_disk_usage_bytes: 429496729600 # 400GB per node
  ttl: 1h
  size_threshold: 1073741824

  # Cluster configuration
  node_id: "tag-1" # Unique per node
  cluster_addr: ":7000"
  grpc_addr: ":9000"
  advertise_addr: "tag-1.tag-svc.default.svc.cluster.local:9000"
  seed_nodes:
    - "tag-svc.default.svc.cluster.local:7000"

log:
  level: "info"
```

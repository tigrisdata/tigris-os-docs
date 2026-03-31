---
title: Native Binary Deployment
sidebar_label: Native Binary
description: Deploy TAG as a native binary on Linux or macOS.
---

# Native binary deployment

Run TAG directly as a native binary. For containerized deployments, see the
[Docker](docker.md) or [Kubernetes](kubernetes.md) guides. For all configuration
options, see the [Configuration Reference](configuration.md).

## Prerequisites

- Linux (amd64/arm64) or macOS (arm64)
- `curl` installed
- Tigris access key and secret key with read access to all buckets that will be
  accessed through TAG

## Install

The install script auto-detects your OS and architecture, downloads the TAG
binary to `/usr/local/bin`, and installs a default config to
`/etc/tag/config.yaml`:

```bash
curl -sSL https://raw.githubusercontent.com/tigrisdata/tag-deploy/main/native/install.sh | bash
```

Verify the installation:

```bash
tag --version
```

## Run

```bash
export AWS_ACCESS_KEY_ID=<your-access-key>
export AWS_SECRET_ACCESS_KEY=<your-secret-key>

tag --config /etc/tag/config.yaml
```

TAG will be available at `http://localhost:8080`.

```bash
# Health check
curl http://localhost:8080/health

# Download an object using AWS CLI
aws s3 cp s3://your-bucket/your-key ./local-file \
  --endpoint-url http://localhost:8080
```

## Production considerations

For production, run TAG under a process supervisor (systemd, supervisord, etc.)
to handle automatic restarts. Example systemd unit:

```ini
[Unit]
Description=Tigris Acceleration Gateway
After=network.target

[Service]
Type=simple
Environment=AWS_ACCESS_KEY_ID=<your-access-key>
Environment=AWS_SECRET_ACCESS_KEY=<your-secret-key>
ExecStart=/usr/local/bin/tag --config /etc/tag/config.yaml
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

See
[Configuration Reference — Example Configurations](configuration.md#example-configurations)
for ready-to-use production YAML configs.

## Upgrading

1. Stop the running TAG process
2. Re-run the install script (or download the new binary manually)
3. Start TAG

The on-disk cache is persistent and compatible across versions — no rebuild
needed.

## Troubleshooting

For troubleshooting startup failures, cache issues, authentication errors, and
debug mode, see [Troubleshooting](deployment-guide.md#troubleshooting) in the
Deployment Guide.

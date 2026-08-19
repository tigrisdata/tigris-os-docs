# Docker deployment

Run TAG using Docker Compose. For all configuration options, see the
[Configuration Reference](configuration.md).

## Prerequisites

Clone the [tigrisdata/tag](https://github.com/tigrisdata/tag) repository and
switch to the deployment Compose directory:

```bash
git clone https://github.com/tigrisdata/tag.git
cd tag/deploy/docker
```

The examples below use the **released-image** Compose files (`*.release.yml`),
which pull the published `tigrisdata/tag` image — nothing to build. (To build
the image from source instead, use the plain Compose files in the repository's
top-level `docker/` directory.)

Create a `.env` file in this directory with your Tigris credentials:

```bash
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
```

`AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` are TAG's own Tigris credentials
with read-only access to all buckets accessed through TAG (required). Clients
use their own credentials directly.

## Single node

```bash
docker compose -f docker-compose.release.yml up -d
```

TAG will be available at `http://localhost:8080`.

```bash
# View logs
docker compose -f docker-compose.release.yml logs -f tag

# Stop
docker compose -f docker-compose.release.yml down
```

## Cluster mode

Run 3 TAG nodes with an embedded distributed cache cluster:

```bash
docker compose -f docker-compose-cluster.release.yml up -d
```

TAG endpoints:

- `http://localhost:8081` (tag-1)
- `http://localhost:8082` (tag-2)
- `http://localhost:8083` (tag-3)

Each node discovers the others via gossip and shares cached objects across the
cluster.

```bash
# View logs
docker compose -f docker-compose-cluster.release.yml logs -f

# Stop and remove volumes
docker compose -f docker-compose-cluster.release.yml down -v
```

## Environment variables

You can add optional environment variables to the `.env` file. The
released-image Compose files default to the `latest` published image; pin a
specific release by setting `TAG_VERSION`:

```bash
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
TAG_VERSION=v1.17.7
TAG_LOG_LEVEL=info
```

See the full [Configuration Reference](configuration.md) for all options.

## Upgrading

Set `TAG_VERSION` in your `.env` (or leave it unset to track `latest`), then
pull and recreate:

```bash
docker compose -f docker-compose.release.yml pull
docker compose -f docker-compose.release.yml up -d
```

The cache volume is preserved across container recreations — TAG picks up the
existing cache without rebuilding.

## Test

```bash
# Health check
curl http://localhost:8080/health

# Download an object using AWS CLI
aws s3 cp s3://your-bucket/your-key ./local-file \
  --endpoint-url http://localhost:8080
```

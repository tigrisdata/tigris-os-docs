# Docker deployment

Run TAG using Docker Compose. For all configuration options, see the
[Configuration Reference](configuration.md).

## Prerequisites

Clone the [tag-deploy](https://github.com/tigrisdata/tag-deploy) repository:

```bash
git clone https://github.com/tigrisdata/tag-deploy.git
cd tag-deploy
```

Create a `.env` file in the `docker/` directory with your Tigris credentials:

```bash
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
```

`AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` are TAG's own Tigris credentials
with read-only access to all buckets accessed through TAG (required). Clients
use their own credentials directly.

## Single node

```bash
cd docker
docker compose up -d
```

TAG will be available at `http://localhost:8080`.

```bash
# View logs
docker compose logs -f tag

# Stop
docker compose down
```

## Cluster mode

Run 3 TAG nodes with an embedded distributed cache cluster:

```bash
cd docker
docker compose -f docker compose-cluster.yml up -d
```

TAG endpoints:

- `http://localhost:8081` (tag-1)
- `http://localhost:8082` (tag-2)
- `http://localhost:8083` (tag-3)

Each node discovers the others via gossip and shares cached objects across the
cluster.

```bash
# View logs
docker compose -f docker compose-cluster.yml logs -f

# Stop and remove volumes
docker compose -f docker compose-cluster.yml down -v
```

## Environment variables

You can add optional environment variables to the `.env` file:

```bash
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
TAG_LOG_LEVEL=info
```

See the full [Configuration Reference](configuration.md) for all options.

## Upgrading

Update the image tag in your `docker-compose.yml` and recreate the container:

```bash
docker compose pull
docker compose up -d
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

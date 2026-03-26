---
title: S3 Client Usage
sidebar_label: S3 Client Usage
description:
  Using TAG with AWS CLI, Python boto3, and other S3-compatible clients.
---

# Using TAG with S3 clients

TAG works with any S3-compatible client. The only change you need to make is
pointing the endpoint URL at TAG and enabling path-style addressing. Standard S3
operations work as expected — this page covers the TAG-specific setup.

## AWS CLI

Pass `--endpoint-url` with each command, or set up a named profile so you don't
have to:

```bash
aws s3 ls --endpoint-url http://localhost:8080
```

### Named profile

Add to `~/.aws/config`:

```ini
[profile tag]
endpoint_url = http://localhost:8080
```

And `~/.aws/credentials`:

```ini
[tag]
aws_access_key_id = your_access_key
aws_secret_access_key = your_secret_key
```

Then use `--profile tag` or set `AWS_PROFILE=tag`.

## Python (boto3)

The key requirement is `addressing_style: 'path'`:

```python
import boto3
from botocore.config import Config

s3 = boto3.client(
    's3',
    endpoint_url='http://localhost:8080',
    aws_access_key_id='your_access_key',
    aws_secret_access_key='your_secret_key',
    config=Config(s3={'addressing_style': 'path'}),
)
```

If your credentials are already in environment variables, you can omit
`aws_access_key_id` and `aws_secret_access_key`.

### Streaming large files

For large files, stream instead of loading entire objects into memory:

```python
response = s3.get_object(Bucket='my-bucket', Key='large-file.bin')
with open('local-file.bin', 'wb') as f:
    for chunk in response['Body'].iter_chunks(chunk_size=1024*1024):
        f.write(chunk)
```

For large uploads, configure multipart thresholds:

```python
from boto3.s3.transfer import TransferConfig

s3.upload_file(
    'large-file.bin',
    'my-bucket',
    'large-file.bin',
    Config=TransferConfig(
        multipart_threshold=8*1024*1024,
        multipart_chunksize=8*1024*1024,
        max_concurrency=10,
    ),
)
```

## Verifying cache behavior

Check the `X-Cache` header to confirm TAG is caching. For details on cache
control headers and invalidation, see
[Cache Control and Revalidation](./cache-control).

```bash
curl -sI http://localhost:8080/my-bucket/my-key \
  -H "Authorization: AWS4-HMAC-SHA256 ..." | grep X-Cache
# X-Cache: HIT    (served from cache)
# X-Cache: MISS   (fetched from Tigris, now cached)
```

## Troubleshooting

For connection errors, authentication failures, timeouts, and path-style
addressing issues, see [Troubleshooting](./deployment-guide#troubleshooting) in
the Deployment Guide.

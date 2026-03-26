# Using TAG with S3 SDKs and CLI

TAG is fully compatible with standard S3 tools and SDKs. Point any S3 client at
TAG's endpoint and it works — no custom libraries or plugins required.

## Prerequisites

- TAG running locally or accessible via network
- TAG's own Tigris credentials configured via `AWS_ACCESS_KEY_ID` /
  `AWS_SECRET_ACCESS_KEY` (see [Configuration Reference](configuration.md))
- Clients use their own Tigris credentials directly when making S3 requests

## AWS CLI

### Configuration

Configure AWS CLI to use TAG as the endpoint:

```bash
# Set credentials (if not already configured)
export AWS_ACCESS_KEY_ID=your_access_key
export AWS_SECRET_ACCESS_KEY=your_secret_key

# Use --endpoint-url flag with each command
aws s3 ls --endpoint-url http://localhost:8080
```

### Using a named profile

Create a profile in `~/.aws/config`:

```ini
[profile tag]
endpoint_url = http://localhost:8080
```

And in `~/.aws/credentials`:

```ini
[tag]
aws_access_key_id = your_access_key
aws_secret_access_key = your_secret_key
```

Then use the profile:

```bash
aws s3 ls --profile tag
```

### Common operations

```bash
# List buckets
aws s3 ls --endpoint-url http://localhost:8080

# List objects in a bucket
aws s3 ls s3://my-bucket --endpoint-url http://localhost:8080

# Download a file
aws s3 cp s3://my-bucket/my-key ./local-file --endpoint-url http://localhost:8080

# Upload a file
aws s3 cp ./local-file s3://my-bucket/my-key --endpoint-url http://localhost:8080

# Sync a directory
aws s3 sync ./local-dir s3://my-bucket/prefix --endpoint-url http://localhost:8080

# Delete an object
aws s3 rm s3://my-bucket/my-key --endpoint-url http://localhost:8080

# Get object metadata
aws s3api head-object --bucket my-bucket --key my-key \
  --endpoint-url http://localhost:8080
```

### Verifying cache behavior

Check the `X-Cache` header to verify caching:

```bash
# Using curl to see cache headers
curl -I http://localhost:8080/my-bucket/my-key \
  -H "Authorization: AWS4-HMAC-SHA256 ..."

# Response will include:
# X-Cache: HIT    (served from cache)
# X-Cache: MISS   (fetched from upstream, now cached)
```

## Python (boto3)

### Installation

```bash
pip install boto3
```

### Basic configuration

```python
import boto3
from botocore.config import Config

# Create S3 client with TAG endpoint (path-style required)
s3 = boto3.client(
    's3',
    endpoint_url='http://localhost:8080',
    aws_access_key_id='your_access_key',
    aws_secret_access_key='your_secret_key',
    config=Config(s3={'addressing_style': 'path'}),
)
```

### Using environment variables

```python
import boto3
from botocore.config import Config
import os

# Credentials from environment variables
# AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY

s3 = boto3.client(
    's3',
    endpoint_url=os.getenv('TAG_ENDPOINT', 'http://localhost:8080'),
    config=Config(s3={'addressing_style': 'path'}),
)
```

### Common operations

#### List buckets

```python
response = s3.list_buckets()
for bucket in response['Buckets']:
    print(bucket['Name'])
```

#### List objects

```python
response = s3.list_objects_v2(Bucket='my-bucket', Prefix='data/')
for obj in response.get('Contents', []):
    print(f"{obj['Key']} - {obj['Size']} bytes")
```

#### Download object

```python
# Download to file
s3.download_file('my-bucket', 'my-key', 'local-file.txt')

# Download to memory
response = s3.get_object(Bucket='my-bucket', Key='my-key')
data = response['Body'].read()
```

#### Upload object

```python
# Upload from file
s3.upload_file('local-file.txt', 'my-bucket', 'my-key')

# Upload from memory
s3.put_object(Bucket='my-bucket', Key='my-key', Body=b'Hello, World!')
```

### Streaming large files

For large files, use streaming to avoid loading entire objects into memory:

```python
# Streaming download
response = s3.get_object(Bucket='my-bucket', Key='large-file.bin')
with open('local-file.bin', 'wb') as f:
    for chunk in response['Body'].iter_chunks(chunk_size=1024*1024):
        f.write(chunk)

# Streaming upload with multipart
from boto3.s3.transfer import TransferConfig

config = TransferConfig(
    multipart_threshold=8*1024*1024,  # 8MB
    max_concurrency=10,
    multipart_chunksize=8*1024*1024,
)

s3.upload_file(
    'large-file.bin',
    'my-bucket',
    'large-file.bin',
    Config=config,
)
```

## Troubleshooting

### Connection refused

Ensure TAG is running and accessible:

```bash
curl http://localhost:8080/health
```

### Authentication errors

Verify your credentials are correct and belong to the same Tigris organization
as TAG's credentials:

```bash
echo $AWS_ACCESS_KEY_ID
echo $AWS_SECRET_ACCESS_KEY
```

### Timeout errors

For large files or slow networks, increase timeout:

```python
from botocore.config import Config

config = Config(
    connect_timeout=30,
    read_timeout=300,
    s3={'addressing_style': 'path'},
)

s3 = boto3.client('s3', endpoint_url='http://localhost:8080', config=config)
```

### Path-style addressing required

TAG does not support virtual-hosted style requests (e.g.,
`bucket.localhost:8080`). If you receive a 405 error when creating buckets,
ensure path-style addressing is configured:

```python
from botocore.config import Config

config = Config(s3={'addressing_style': 'path'})
s3 = boto3.client('s3', endpoint_url='http://localhost:8080', config=config)
```

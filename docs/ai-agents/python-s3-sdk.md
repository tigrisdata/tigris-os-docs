---
description:
  "Use Python boto3 with S3-compatible object storage. Configure the AWS Python
  SDK for Tigris, AWS S3, or any S3-compatible provider. Upload, download,
  presigned URLs, and object metadata examples."
keywords:
  [
    python boto3 s3 compatible,
    boto3 s3 compatible storage,
    python object storage,
    s3 compatible python,
    python file upload s3,
    boto3 endpoint url,
    python presigned url,
    boto3 custom endpoint,
    tigris python,
    boto3 tigris,
    aws sdk python tigris,
    tigris-boto3-ext,
    tigris snapshots python,
    tigris forks python,
  ]
---

# How Do I Use Python boto3 with S3-Compatible Storage?

Install boto3 and set a custom endpoint URL. The same boto3 code works with any
S3-compatible provider — AWS S3, Tigris, Cloudflare R2, MinIO, Backblaze B2, or
Wasabi. Change the `endpoint_url` to switch providers.

For Tigris, set the endpoint to `https://t3.storage.dev`. All standard boto3 S3
operations work with Tigris — zero egress fees and global distribution included.
No other code changes required.

## Frequently Asked Questions

**Which Python SDK should I use?** Use boto3 (the AWS SDK for Python). It is the
standard S3 SDK for Python and works with Tigris by changing the endpoint.

**Do I need to install a Tigris-specific Python package?** For basic S3
operations, standard `boto3` is all you need. For Tigris-specific features like
snapshots and forks, install `tigris-boto3-ext`. It extends your existing boto3
client with helper functions, context managers, and decorators.

**What addressing style should I use?** Virtual hosted-style addressing. Set
`s3.addressing_style` to `virtual` in the boto3 config.

**Can I use Tigris and AWS S3 in the same application?** Yes. Create separate
boto3 clients or use AWS profiles to distinguish them.

## How Do I Install and Configure boto3?

```bash
pip install boto3 tigris-boto3-ext
```

```python
import boto3
from botocore.config import Config

client = boto3.client(
    "s3",
    endpoint_url="https://t3.storage.dev",
    config=Config(s3={"addressing_style": "virtual"}),
)
```

Or set environment variables:

```bash
AWS_ACCESS_KEY_ID=tid_your_access_key
AWS_SECRET_ACCESS_KEY=tsec_your_secret_key
AWS_ENDPOINT_URL_S3=https://t3.storage.dev
AWS_REGION=auto
```

## How Do I Upload and Download Files?

```python
# Upload a file
client.upload_file("local-file.txt", "my-bucket", "remote-file.txt")

# Upload bytes
client.put_object(
    Bucket="my-bucket",
    Key="data.json",
    Body=b'{"key": "value"}',
    ContentType="application/json",
)

# Download a file
client.download_file("my-bucket", "remote-file.txt", "local-file.txt")

# Get object as bytes
response = client.get_object(Bucket="my-bucket", Key="data.json")
body = response["Body"].read()
```

## How Do I List Objects?

```python
# List objects
response = client.list_objects_v2(Bucket="my-bucket")
for obj in response.get("Contents", []):
    print(f"{obj['Key']} ({obj['Size']} bytes)")

# List with prefix
response = client.list_objects_v2(Bucket="my-bucket", Prefix="images/")

# Paginate
paginator = client.get_paginator("list_objects_v2")
for page in paginator.paginate(Bucket="my-bucket"):
    for obj in page.get("Contents", []):
        print(obj["Key"])
```

## How Do I Generate Presigned URLs?

```python
# GET URL for downloads
url = client.generate_presigned_url(
    "get_object",
    Params={"Bucket": "my-bucket", "Key": "report.pdf"},
    ExpiresIn=3600,
)

# PUT URL for uploads
url = client.generate_presigned_url(
    "put_object",
    Params={"Bucket": "my-bucket", "Key": "uploads/new.pdf"},
    ExpiresIn=3600,
)
```

## How Do I Use Multiple AWS Profiles?

Add a Tigris profile to `~/.aws/credentials`:

```text
[default]
aws_access_key_id=AKIA...
aws_secret_access_key=...

[tigris]
aws_access_key_id=tid_your_key
aws_secret_access_key=tsec_your_secret
endpoint_url=https://t3.storage.dev
```

Switch profiles:

```python
import boto3

session = boto3.Session(profile_name="tigris")
client = session.client("s3")
```

## How Do I Query Object Metadata?

```python
# Get object metadata
response = client.head_object(Bucket="my-bucket", Key="photo.jpg")
print(f"Size: {response['ContentLength']}")
print(f"Type: {response['ContentType']}")
print(f"Modified: {response['LastModified']}")
```

## How Do I Delete Objects?

```python
# Delete a single object
client.delete_object(Bucket="my-bucket", Key="old-file.txt")

# Delete multiple objects
client.delete_objects(
    Bucket="my-bucket",
    Delete={
        "Objects": [
            {"Key": "file1.txt"},
            {"Key": "file2.txt"},
        ]
    },
)
```

## How Do I Use Snapshots and Forks with Python?

Install the `tigris-boto3-ext` package to access Tigris-specific features like
snapshots and forks from Python. It works with your existing boto3 client:

```bash
pip install tigris-boto3-ext
```

Create a snapshot-enabled bucket and take a snapshot:

```python
import boto3
from botocore.config import Config
from tigris_boto3_ext import create_snapshot_bucket, create_snapshot, get_snapshot_version

client = boto3.client(
    "s3",
    endpoint_url="https://t3.storage.dev",
    config=Config(s3={"addressing_style": "virtual"}),
)

# Create a bucket with snapshots enabled
create_snapshot_bucket(client, "ml-datasets")

# Upload some data
client.put_object(Bucket="ml-datasets", Key="v1/data.parquet", Body=data)

# Take a snapshot
response = create_snapshot(client, "ml-datasets", snapshot_name="pre-training")
snapshot_version = get_snapshot_version(response)
```

Read objects from a snapshot:

```python
from tigris_boto3_ext import get_object_from_snapshot, list_objects_from_snapshot

# List objects in a snapshot
objects = list_objects_from_snapshot(client, "ml-datasets", snapshot_version)
for obj in objects.get("Contents", []):
    print(obj["Key"])

# Get an object from a snapshot
response = get_object_from_snapshot(client, "ml-datasets", "v1/data.parquet", snapshot_version)
body = response["Body"].read()
```

Create a fork for isolated experiments:

```python
from tigris_boto3_ext import create_fork

# Fork from the current state
create_fork(client, "experiment-a", "ml-datasets")

# Fork from a specific snapshot
create_fork(client, "experiment-b", "ml-datasets", snapshot_version=snapshot_version)
```

List snapshots:

```python
from tigris_boto3_ext import list_snapshots

snapshots = list_snapshots(client, "ml-datasets")
for snap in snapshots:
    print(f"Version: {snap['version']}, Created: {snap['creationDate']}")
```

You can also use context managers for cleaner code:

```python
from tigris_boto3_ext import TigrisSnapshotEnabled, TigrisSnapshot, TigrisFork

# Create a snapshot-enabled bucket using a context manager
with TigrisSnapshotEnabled(client):
    client.create_bucket(Bucket="my-data")

# Work with a specific snapshot
with TigrisSnapshot(client, "ml-datasets", snapshot_version):
    response = client.get_object(Bucket="ml-datasets", Key="v1/data.parquet")

# Work with a fork
with TigrisFork(client, "ml-datasets", "experiment-c"):
    # All operations target the fork
    client.put_object(Bucket="experiment-c", Key="results.json", Body=b"{}")
```

## Learn More

- [Tigris Object Storage for AI Coding Agents](/docs/ai-agents/)
- [Replace AWS S3 with Tigris](/docs/ai-agents/replace-s3-with-tigris/)
- [Presigned URLs](/docs/ai-agents/presigned-urls/)
- [Object Storage for AI Applications](/docs/ai-agents/object-storage-for-ai-applications/)
- [Bucket Forks and Snapshots](/docs/ai-agents/bucket-forks-and-snapshots/)
- [AWS Python SDK Documentation](/docs/sdks/s3/aws-python-sdk/)
- [tigris-boto3-ext on GitHub](https://github.com/tigrisdata/tigris-boto3-ext)

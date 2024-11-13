# AWS Python SDK

This guide assumes that you have followed the steps in the
[Getting Started](/docs/get-started/index.md) guide, and have the access keys
available.

You may continue to use the AWS Python SDK as you normally would, but with the
endpoint set to `https://fly.storage.tigris.dev`.

## Getting started

This example uses the
[AWS SDK for Python (Boto3)](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/s3.html)
and reads the default credentials file or the environment variables
`AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`.

```python
import boto3

# Create S3 service client
svc = boto3.client('s3', endpoint_url='https://fly.storage.tigris.dev')

# List buckets
response = svc.list_buckets()

for bucket in response['Buckets']:
    print(f'  {bucket["Name"]}')

# List objects
response = svc.list_objects_v2(Bucket='foo-bucket')

for obj in response['Contents']:
    print(f'  {obj["Key"]}')

# Upload file
response = svc.upload_file('bar.txt', 'foo-bucket', 'bar.txt')

# Download file
response = svc.download_file('foo-bucket', 'bar.txt', 'bar-downloaded.txt')
```

## Using presigned URLs

Presigned URLs can be used with the AWS Python (Boto3) SDK as follows:

```python
import boto3

# Create S3 service client
svc = boto3.client('s3', endpoint_url='https://fly.storage.tigris.dev')

# Generate a presigned URL to upload an object
url = svc.generate_presigned_url(
    'put_object',
    Params={'Bucket': 'foo-bucket', 'Key': 'bar.txt'},
    ExpiresIn=604800
)

print(f'Presigned URL to upload an object: {url}')

# Generate a presigned URL to download an object
url = svc.generate_presigned_url(
    'get_object',
    Params={'Bucket': 'foo-bucket', 'Key': 'bar.txt'},
    ExpiresIn=604800
)

print(f'Presigned URL to download an object: {url}')
```

## Object Regions

Below is an example of how to use the AWS Python SDK to restrict
[object region](/docs/objects/object_regions) to Europe only (`fra` region).

```python
import boto3

# Create S3 service client
svc = boto3.client('s3', endpoint_url='https://fly.storage.tigris.dev')

# Restrict data to Europe (Frankfurt) only
def _limit_to_fra(request, **kwargs):
    request.headers.add_header('X-Tigris-Regions', 'fra')

# Register event into boto
svc.meta.events.register(
    "before-sign.s3.PutObject",
    _limit_to_fra,
)

# Upload file to frankfurt
response = svc.upload_file('bar.txt', 'foo-bucket', 'bar.txt')
```

## Object Metadata Querying

Below is an example for querying for objects
[based on their metadata](https://www.tigrisdata.com/docs/objects/query-metadata/):

```python
import boto3

# Create S3 service client
svc = boto3.client("s3", endpoint_url='https://fly.storage.tigris.dev')

# build an object metadata query
def _x_tigris_query(request, query):
    request.headers.add_header('X-Tigris-Query', query.strip())

# Register event into boto with custom query
svc.meta.events.register(
    "before-sign.s3.ListObjectsV2",
    lambda request, **kwargs: _x_tigris_query(request, '`Content-Type` = "text/plain"'),
)

response = svc.list_objects_v2(Bucket="foo-bucket")

for obj in response['Contents']:
    print(f'  {obj["Key"]}')
```

# AWS Python SDK

Before you can use the AWS Python SDK with Tigris, you need to generate an
access key. You can do that at
[console.tigris.dev](https://console.tigris.dev/).

You may continue to use the AWS Python SDK as you normally would, but with the
endpoint set to `https://fly.storage.tigris.dev`.

This example uses the
[AWS SDK for Python (Boto3)](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/s3.html)
and reads the default credentials file or the environment variables
`AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`.

```python
import boto3

# Create S3 service client
s3 = boto3.client('s3', endpoint_url='https://fly.storage.tigris.dev')

# List buckets
response = s3.list_buckets()

for bucket in response['Buckets']:
    print(f'  {bucket["Name"]}')

# List objects
response = s3.list_objects_v2(Bucket='foo-bucket')

for obj in response['Contents']:
    print(f'  {obj["Key"]}')

# Upload file
response = s3.upload_file('bar.txt', 'foo-bucket', 'bar.txt')

# Download file
response = s3.download_file('foo-bucket', 'bar.txt', 'bar-downloaded.txt')
```

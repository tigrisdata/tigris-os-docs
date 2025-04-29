import boto3
from botocore.client import Config

# Create S3 service client
svc = boto3.client(
    's3',
    endpoint_url='https://t3.storage.dev',
    config=Config(s3={'addressing_style': 'virtual'}),
)

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
import boto3
from botocore.client import Config

# Create S3 service client
svc = boto3.client(
    's3',
    endpoint_url='https://t3.storage.dev',
    config=Config(s3={'addressing_style': 'virtual'}),
)

# build an object metadata query
def _x_tigris_query(request, query):
    request.headers.add_header('X-Tigris-Query', query.strip())

# Register event into boto with custom query
svc.meta.events.register(
    "before-sign.s3.ListObjectsV2",
    lambda request, **kwargs: _x_tigris_query(request, '`Content-Type` = "text/plain"'),
)

response = svc.list_objects_v2(Bucket="tigris-example")

if 'Contents' not in response:
    print('No objects found with Content-Type "text/plain"')
    exit(1)

print('Objects found with Content-Type "text/plain":')
for obj in response['Contents']:
    print(f'* {obj["Key"]}')
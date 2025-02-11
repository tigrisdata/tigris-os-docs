import boto3

# Create S3 service client
svc = boto3.client(
    's3',
    endpoint_url='https://fly.storage.tigris.dev',
    config=Config(s3={'addressing_style': 'virtual'}),
)

# List buckets
response = svc.list_buckets()

for bucket in response['Buckets']:
    print(f'  {bucket["Name"]}')

# List objects
response = svc.list_objects_v2(Bucket='tigris-example')

for obj in response['Contents']:
    print(f'  {obj["Key"]}')

# Upload file
response = svc.upload_file('getting-started.py', 'tigris-example', 'getting-started.py')

# Download file
response = svc.download_file('tigris-example', 'getting-started.py', 'getting-started-2.py')
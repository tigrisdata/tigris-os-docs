import boto3
from botocore.client import Config
from uuid import uuid4

# Create S3 service client
svc = boto3.client(
    's3',
    endpoint_url='https://t3.storage.dev',
    config=Config(s3={'addressing_style': 'virtual'}),
)

def _x_tigris_rename(request):
    request.headers.add_header('X-Tigris-Rename', "true")

# Register event into boto
svc.meta.events.register(
    "before-sign.s3.CopyObject",
    lambda request, **kwargs: _x_tigris_rename(request),
)

object_name = str(uuid4())
object_rename = str(uuid4())

response = svc.upload_file('rename-object.py', 'tigris-example', object_name)

# Rename object
response = svc.copy_object(
    Bucket='tigris-example',
    CopySource=f"tigris-example/{object_name}",
    Key=object_rename,
)

# head object to make sure it exists
response = svc.head_object(Bucket='tigris-example', Key=object_rename)

# Delete object
response = svc.delete_object(Bucket='tigris-example', Key=object_rename)
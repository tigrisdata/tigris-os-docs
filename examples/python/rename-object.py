import boto3
from botocore.client import Config
from uuid import uuid4

from tigris_boto3_ext import rename_object

# Create S3 service client
svc = boto3.client(
    's3',
    endpoint_url='https://t3.storage.dev',
    config=Config(s3={'addressing_style': 'virtual'}),
)

object_name = str(uuid4())
object_rename = str(uuid4())

svc.upload_file('rename-object.py', 'tigris-example', object_name)

# Rename object
rename_object(svc, 'tigris-example', object_name, object_rename)

# head object to make sure it exists
svc.head_object(Bucket='tigris-example', Key=object_rename)

# Delete object
svc.delete_object(Bucket='tigris-example', Key=object_rename)

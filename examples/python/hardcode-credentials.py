import boto3
import os
from botocore.client import Config

client = boto3.client(
    's3',
    aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
    aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
    endpoint_url='https://fly.storage.tigris.dev',
    config=Config(s3={'addressing_style': 'virtual'}),
)
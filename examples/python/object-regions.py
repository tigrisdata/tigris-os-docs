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
response = svc.upload_file('bar.txt', 'tigris-example', 'bar-fra.txt')
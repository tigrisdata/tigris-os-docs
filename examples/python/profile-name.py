import boto3

session = boto3.Session(profile_name='tigris')
tigris_s3_client = session.client('s3', config=Config(s3={'addressing_style': 'virtual'}))
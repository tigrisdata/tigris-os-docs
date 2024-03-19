# AWS CLI

This guide assumes that you have followed the steps in the
[Getting Started](/docs/get-started/index.md) guide, and have the access keys
available.

## Configuring AWS CLI

Once you have your access key, you can configure the AWS CLI with the following
command:

```bash
aws configure
AWS Access Key ID [None]: <access_key_id>
AWS Secret Access Key [None]: <access_key_secret>
Default region name [None]: auto
Default output format [None]: json
```

You can then use the AWS CLI as you normally would, but with the
`--endpoint-url` flag set to `https://fly.storage.tigris.dev`:

```bash
aws s3api list-buckets --endpoint-url https://fly.storage.tigris.dev
aws s3api list-objects-v2 --endpoint-url https://fly.storage.tigris.dev --bucket foo-bucket
```

## Setting the endpoint URL in credentials file

You can also modify the `~/.aws/credentials` file directly, and add the endpoint
URL to it so that you don't have to specify it every time:

```text
[default]
aws_access_key_id=<access_key_id>
aws_secret_access_key=<access_key_secret>
endpoint_url=https://fly.storage.tigris.dev
```

Once this is done, you can use the AWS CLI as you normally would (without the
`--endpoint-url` flag):

```bash
aws s3api list-buckets
aws s3api list-objects-v2 --bucket foo-bucket
```

## Using presigned URLs

### Generating a presigned URL

Presigned URLs can be generated using the AWS CLI as follows:

```bash
aws s3 presign s3://foo-bucket/bar-object --expires-in 604800
```

You can then use the generated URL to upload or download objects.

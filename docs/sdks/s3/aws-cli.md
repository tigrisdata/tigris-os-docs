# AWS CLI

This guide assumes that you have followed the steps in the
[Getting Started](/docs/get-started/index.md) guide, and have the access keys
available.

## Service Endpoints

Requests to Tigris must be directed to the appropriate service endpoint, usually
by updating your endpoint URL configuration:

- IAM requests must be directed to `https://iam.storageapi.dev`
- S3 requests made from outside Fly should be directed to
  `https://t3.storageapi.dev`
- S3 requests made from within Fly must be directed to
  `https://fly.storage.tigris.dev`

When using the AWS CLI, this service endpoint is set by default based on the
region and is not configured by the user directly. AWS S3 recommends using
per-region service endpoints, whereas Tigris provides a single global endpoint
and manages all regional configurations for you. Tigris is S3-compatible, which
means that you can use familiar S3 based tools like the AWS CLI, provided you
change the service endpoint to point to Tigris.

## Configuring AWS CLI

Once you have your access key, you can configure the AWS CLI with the following
command:

```bash
aws configure
AWS Access Key ID [None]: <tid_>
AWS Secret Access Key [None]: <tsec_>
Default region name [None]: auto
Default output format [None]: json
```

You can then use the AWS CLI as you normally would, but with the
`--endpoint-url` flag set to `https://t3.storageapi.dev` or
`https://fly.storage.tigris.dev`:

```bash
aws s3api list-buckets --endpoint-url https://t3.storageapi.dev
aws s3api list-objects-v2 --endpoint-url https://t3.storageapi.dev --bucket foo-bucket
```

## Setting the endpoint URL in credentials file

You can also modify the `~/.aws/credentials` file directly, and add the endpoint
URL to it so that you don't have to specify it every time:

```text
nano ~/.aws/credentials

[default]
aws_access_key_id=<tid>
aws_secret_access_key=<tsec_>
endpoint_url=https://t3.storageapi.dev
```

Once this is done, you can use the AWS CLI as you normally would (without the
`--endpoint-url` flag):

```bash
aws s3api list-buckets
aws s3api list-objects-v2 --bucket foo-bucket
```

## Using multiple AWS Profiles

If you want to use Tigris alongside AWS, you'll need to differentiate your
access keys. The most common way to do this is by adding another profile to
`~/.aws/credentials`.

```text
nano ~/.aws/credentials

[aws-compute]
aws_access_key_id=<tid>
aws_secret_access_key=<tsec_>

[tigris]
aws_access_key_id=<tid>
aws_secret_access_key=<tsec_>
endpoint_url=https://t3.storageapi.dev
```

You can verify the profiles are configured correctly:

```text
aws configure list-profiles
# output:
# aws-compute
# tigris
```

You can switch between profiles per command by simply passing the name of the
profile to the `profile` flag at the end of your command.

```text
aws s3 ls --profile <name of profile>
```

## Using presigned URLs

### Generating a presigned URL

Presigned URLs can be generated using the AWS CLI as follows:

```bash
aws s3 presign s3://foo-bucket/bar-object --expires-in 604800
```

You can then use the generated URL to upload or download objects.

# AWS CLI

Before you can use the AWS cli with Tigris, you need to generate an access key.
You can do that at [console.tigris.dev](https://console.tigris.dev/).

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

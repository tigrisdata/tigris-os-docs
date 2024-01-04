# Creating a Bucket

To upload your data to Tigris, you must first create a bucket. When you create a
bucket, you must choose a bucket name. After you create a bucket, you cannot
change the bucket name. Buckets are global, and Tigris automatically stores the
data close to your users. If your users move to a different region, the data
moves with them.

The user that creates the bucket owns it. You can upload any number of objects
to a bucket.

Buckets and the objects in them are private and can be accessed only via access
keys that you explicitly grant access permissions to.

## Creating a bucket using flyctl

To create a bucket for one of your Fly apps, run the following command in the
directory where your Fly app is located:

```bash
fly storage create
```

This will create a bucket and set the required environment variables for you.

```text
$ fly storage create
? Choose a name, use the default, or leave blank to generate one: demo-bucket
Your  project (demo-bucket) is ready. See details and next steps with:

Setting the following secrets on ot-demo:
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
BUCKET_NAME
AWS_ENDPOINT_URL_S3

Secrets are staged for the first deployment
```

If you want to create a bucket that is not associated with a Fly app, you can
run the same command outside of a Fly app directory.

```text
$ fly storage create
? Select Organization: Ovais Tariq (personal)
? Choose a name, use the default, or leave blank to generate one:
Your  project (polished-thunder-5646) is ready. See details and next steps with:

Set one or more of the following secrets on your target app.
AWS_ENDPOINT_URL_S3: https://fly.storage.tigris.dev
AWS_ACCESS_KEY_ID: xxxxxxxxxxxxxxxxxxxx
AWS_SECRET_ACCESS_KEY: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
BUCKET_NAME: polished-thunder-5646
```

## Creating a bucket using the AWS CLI

Assuming you have the AWS CLI configured as shown in the
[AWS CLI guide](../sdks/s3/aws-cli.md), you can create a bucket as follows:

```bash
aws s3api --endpoint-url https://fly.storage.tigris.dev create-bucket --bucket foo-bucket
```

```text
$ aws s3api --endpoint-url https://fly.storage.tigris.dev create-bucket --bucket foo-bucket
{
    "Location": "/foo-bucket"
}
```

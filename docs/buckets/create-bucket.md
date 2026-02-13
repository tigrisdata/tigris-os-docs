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

## Bucket tier

When you create a bucket, you can set the default object tier for all objects
uploaded to it. The default tier can be one of the following:

- Standard
- Infrequent Access
- Archive
- Archive instant retrieval

The default tier can be overridden at the object level. For more information,
see the [Storage Tiers](../objects/tiers.md) guide.

## Bucket regions

When you create a bucket in the console, you choose a location type from the
region picker. This controls where data is stored and replicated:

- Global (default)
- Multi-region
- Dual regions
- Single region

For details on each option, see the [Bucket Location Types](./multi-region.md)
guide. You can update the location type later from the bucket settings page
using the same region picker.

## Creating a bucket using the Dashboard

To create a bucket using the Tigris Dashboard, follow these steps:

1. Go to [storage.new](https://storage.new/).
2. Enter a unique bucket name. ([Rules](./bucket-rules.md))
3. Choose the default tier for the bucket under
   [Advanced settings](#advanced-settings-default-tier).
4. Choose a location type in the region picker under
   [Advanced settings](#advanced-settings-region-picker).
5. Click **Create Bucket**.

![Create Tigris Bucket](/img/create-bucket.png)

### Advanced settings: default tier {#advanced-settings-default-tier}

![Create Tigris Bucket advanced settings - default tier](/img/create-bucket-adv-1.png)

### Advanced settings: region picker {#advanced-settings-region-picker}

![Create Tigris Bucket advanced settings - region picker](/img/create-bucket-adv-2.png)

## Creating a bucket using the AWS CLI

Assuming you have the AWS CLI configured as shown in the
[AWS CLI guide](../sdks/s3/aws-cli.md), you can create a bucket as follows:

:::note

If you are using Tigris outside of Fly, use the endpoint
[https://t3.storage.dev](https://t3.storage.dev). If you are using Tigris from
within Fly, use the endpoint
[https://fly.storage.tigris.dev](https://fly.storage.tigris.dev).

:::

```bash
aws s3api --endpoint-url https://t3.storage.dev create-bucket --bucket foo-bucket
```

```text
$ aws s3api --endpoint-url https://t3.storage.dev create-bucket --bucket foo-bucket
{
    "Location": "/foo-bucket"
}
```

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
AWS_ENDPOINT_URL_S3: https://t3.storage.dev
AWS_ACCESS_KEY_ID: xxxxxxxxxxxxxxxxxxxx
AWS_SECRET_ACCESS_KEY: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
BUCKET_NAME: polished-thunder-5646
```

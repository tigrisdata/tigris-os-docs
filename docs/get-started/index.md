# Object Storage

Tigris is a globally distributed S3-compatible object storage service that
stores data as objects within buckets. An object is a file and any metadata that
describes the file. A bucket is a container for objects.

To store your data in Tigris, you first create a bucket and specify a bucket
name. Then, you upload your data to that bucket as objects in Tigris. Each
object has a key, which is the unique identifier for the object within the
bucket. Buckets are global, and Tigris automatically stores the data close to
your users. If your users move to a different region, the data moves with them.

Buckets and the objects in them are private and can be accessed only via access
keys that you explicitly grant access permissions to.

## Getting Started

### 1. Signup for early access

To use Tigris you need to have your account setup. If you don't have one, you
can [signup for the waitlist](https://hello.tigrisdata.com/forms/early-access/)
and we will reach out to you as soon as possible.

### 2. Create a bucket

Before you can store data in Tigris, you have to create a bucket.

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

### 3. Start building

Now that you have a bucket, you can start storing objects in it. An object can
be any kind of file: a text file, a photo, a video, or anything else. As Tigris
is S3-compatible, you can use standard AWS S3 SDKs and libraries to store and
retrieve objects.

:::info

Tigris provides a single global endpoint. When using the AWS S3 SDKs, all you
need is to set the endpoint to `https://fly.storage.tigris.dev`.

:::

Take a look at examples of how to use Tigris with the most popular S3 SDKs and
CLIs [here](../sdks/s3/).

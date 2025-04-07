# Bucket Management with Flyctl

Tigris is a globally distributed S3-compatible object storage service natively
integrated with [Fly.io](https://fly.io/). Tigris runs on
[Fly.io](https://fly.io/) hardware and is fully integrated with flyctl.

## Getting Started

If you don't have an account, you can get yourself one
[here](https://fly.io/app/sign-up/tigris).

You can then use the `fly storage` command to create and manage Tigris buckets.

## Creating and managing a bucket

### Creating a bucket associated with a Fly app

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

### Creating a bucket not associated with a Fly app

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

### Creating a public bucket

By default, buckets are private. You can create a public bucket by passing the
`--public` flag to the `fly storage create` command:

```bash
fly storage create --public
```

### Updating bucket public access

You can make a private bucket public or a public bucket private by using the
`fly storage update` command:

```bash
fly storage update bucket-name --public
```

Or,

```bash
fly storage update bucket-name --private
```

### Updating custom domain

You can associate a domain or subdomain you own with the bucket.

```bash
flyctl storage update bucket-name --custom-domain images.example.com
```

For this to work, you need to create a CNAME record for `images.example.com`
that points to `bucket-name.fly.storage.tigris.dev`.

### Remove the custom domain

To remove a custom domain and certificate from your bucket, run the following
command:

```bash
fly storage update bucket-name --clear-custom-domain
```

## Listing buckets

To list all the buckets associated with your Fly account, run the following
command:

```bash
fly storage list
```

## Deleting a bucket

To delete a bucket, run the following command:

```bash
fly storage destroy bucket-name
```

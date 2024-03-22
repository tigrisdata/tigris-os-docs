# Migrating from a S3-compatible bucket

Tigris allows you to incrementally migrate the data from an existing S3 or a
compatible bucket via the `fly storage` command. This allows you to
transparently move your data from an existing S3-compatible storage to Tigris
without any **downtime** and without incuring any **egress costs**.

## How it works

When creating a new bucket, you can specify the bucket from where the data
should be migrated. We call this the **shadow bucket**.

This is how the process works:

- When you upload a new object to the Tigris bucket, it is first uploaded to the
  shadow bucket and then copied to the Tigris bucket. This ensures that the data
  is always available in the shadow bucket and is eventually consistent in the
  Tigris bucket.
- When you request an object, we first check if the object exists in the Tigris
  bucket. If it does, we return it. If it doesn't, we check the shadow bucket
  and return the object from there. Then we copy the object to the Tigris bucket
  so that it is available for future requests.
- The objects stored in the Tigris bucket are automatically stored in the region
  closest to the user.
- When you delete an object we delete it from the Tigris bucket, as well as the
  shadow bucket.

## Starting the migration

### Using a new Tigris bucket as the migration target

When creating a new bucket, you can specify the bucket from where the data
should be migrated. We call this the shadow bucket. This is how you can create a
new bucket with a shadow bucket:

```bash
flyctl storage create -n some-bucket -o some-org \
    --shadow-access-key your_access_key --shadow-secret-key your_secret_key \
    --shadow-endpoint https://s3.us-east-1.amazonaws.com --shadow-region us-east-1 \
    --shadow-write-through
```

This will create a new bucket `some-bucket` in the organization `some-org` and
will migrate the data from the shadow bucket as the requests come in.

The endpoint and region are provider specific and should be set accordingly. You
can find the endpoint and region for AWS S3 in the
[AWS documentation](https://docs.aws.amazon.com/general/latest/gr/s3.html).

### Using an existing Tigris bucket as the migration target

You can also migrate the data to an existing Tigris bucket. This is how you can
update an existing bucket to use a shadow bucket:

```bash
flyctl storage update some-bucket \
    --shadow-access-key your_access_key --shadow-secret-key your_secret_key \
    --shadow-endpoint https://s3.us-east-1.amazonaws.com --shadow-region us-east-1 \
    --shadow-write-through
```

## Finishing the migration

Once you are confident that all the objects have been migrated, you can stop the
migration by removing the shadow bucket. This will stop the objects from being
read from or written to the shadow bucket. Any subsequent requests will only
read from and write to the Tigris bucket.

```bash
flyctl storage update some-bucket --clear-shadow
```

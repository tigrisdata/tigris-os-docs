# Object Storage

Welcome to Tigris! Tigris stores data as objects within buckets. An object is a
file with metadata, and a bucket is a container for objects. To use Tigris,
create a bucket with a unique name and upload your data as objects. Each object
has a unique key within the bucket. Tigris stores data close to your users and
moves it if they change regions. Buckets and objects are private and accessible
only via granted access keys.

## Getting Started

To get started simply follow the following steps:

:::note[Quickstart]

1. [Install flyctl](https://fly.io/docs/flyctl/install/) - the
   [open source](https://github.com/superfly/flyctl) Fly.io CLI we will use to
   manage our buckets.
2. Create an account with `fly auth signup` or log in with `fly auth login`.
3. Run `fly storage create` to create a bucket.

:::

## Start building

Now that you have a bucket, you can start storing objects in it. An object can
be any kind of file: a text file, a photo, a video, or anything else. As Tigris
is S3-compatible, you can use standard AWS S3 SDKs and libraries to store and
retrieve objects.

_Tigris provides a single global endpoint. When using the AWS S3 SDKs, all you
need is to set the endpoint to `https://fly.storage.tigris.dev`._

Take a look at examples of how to use Tigris with the most popular S3 SDKs and
CLIs [here](../sdks/s3/).

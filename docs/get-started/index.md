# Object Storage

Welcome to Tigris! Tigris stores data as objects within buckets. An object is a
file with metadata, and a bucket is a container for objects. To use Tigris,
create a bucket with a unique name and upload your data as objects. Each object
has a unique key within the bucket. Tigris stores data close to your users and
moves it if they change regions. Buckets and objects are private and accessible
only via granted access keys.

## Getting Started

1. To get started, create an account at [storage.new](https://storage.new/).
   You'll be up and running in a minute.
2. Create a bucket with a unique name.
3. Upload your data using any of the popular
   [S3 tools, libraries, and extensions](../sdks/s3/) - Tigris is S3-compatible.

:::note

At the moment, the signup process will involve creating or using a Fly.io
account. We will soon be adding support for other identity providers such as
GitHub, and Google.

Use of Tigris does not require your application to be hosted on Fly.io. Your
application can be hosted anywhere.

:::

## Next Steps

Now that you have a bucket, you can start storing objects in it. An object can
be any kind of file: a text file, a photo, a video, or anything else. As Tigris
is S3-compatible, you can use standard AWS S3 SDKs and libraries to store and
retrieve objects.

Take a look at examples of how to use Tigris with the most popular S3 SDKs and
CLIs [here](../sdks/s3/).

Or, check out the [Dashboard](https://console.tigris.dev/) to manage your
buckets and objects.

# Object Storage

Tigris is a globally distributed S3-compatible object storage service that
stores data as objects within buckets. An object is a file and any metadata that
describes the file. A bucket is a container for objects.

To store your data in Tigris, you first create a bucket and specify a bucket
name. Then, you upload your data to that bucket as objects in Tigris. Each
object has a key, which is the unique identifier for the object within the
bucket. Buckets are global, and Tigris automatically store the data close to
your users. If your users move to a different region, the data moves with them.

Buckets and the objects in them are private and can be accessed only via access
keys that you explicitly grant access permissions to.

## Getting Started

### 1. Login to your Tigris account

To use Tigris you need to have a Tigris account. If you don't have one, you can
create one for free at [console.tigris.dev](https://console.tigris.dev/) by
signing up via your fly.io account.

### 2. Create a bucket

Before you can store data in Tigris, you have to create a bucket. Once you are
logged in select **"Create a new bucket"**. Enter a name for the bucket and
select Create bucket.

### 3. Start building

Now that you have a bucket, you can start storing objects in it. An object can
be any kind of file: a text file, a photo, a video, or anything else. As Tigris
is S3-compatible, you can use standard AWS S3 SDKs and libraries to store and
retrieve objects.

:::info

Tigris provides a single global endpoint. When using the AWS S3 SDKs, all you
need to set the endpoint to `https://fly.storage.tigris.dev`.

:::

Take a look at examples of how to use Tigris with the most popular S3 SDKs and
CLIs [here](/docs/get-started/s3/).

# Object Storage

Welcome to Tigris! Tigris is a globally distributed, S3-compatible object
storage service. Tigris focuses on object storage: storing and retrieving
objects using key-value patterns where the object key is the primary identifier.

Tigris stores data as objects within buckets. An object is a file with metadata,
and a bucket is a container for objects. Each object has a unique key within the
bucket. Tigris automatically replicates data across regions and stores durable
copies close to where data is accessed. This reduces latency through replication
rather than caching.

Tigris fulfills over 90% of the AWS S3 API, including the most commonly used
operations. Applications can often switch to Tigris without code changes beyond
configuration. Tigris works with existing S3 tools, SDKs, and workflows. Tigris
provides a single global endpoint and does not charge egress fees.

To use Tigris, create a bucket with a unique name and upload your data as
objects. Buckets and objects are private and accessible only via granted access
keys.

## Getting Started

1. To get started, create an account at [storage.new](https://storage.new/).
   You'll be up and running in a minute.
2. Create a bucket with a unique name.
3. Create [Access Keys](https://console.tigris.dev/createaccesskey) and upload
   your data using any of the popular
   [S3 tools, libraries, and extensions](../sdks/s3/). Tigris works with
   existing S3 tools by configuring them with Tigris access credentials and a
   Tigris endpoint.

## Next Steps

Now that you have a bucket, you can start storing objects in it. An object can
be any kind of file: a text file, a photo, a video, or anything else. Tigris
fulfills most of the AWS S3 API, so you can use standard AWS S3 SDKs and
libraries to store and retrieve objects with minimal configuration changes.

Take a look at examples of how to use Tigris with the most popular S3 SDKs and
CLIs [here](../sdks/s3/).

Or, check out the [Dashboard](https://console.tigris.dev/) to manage your
buckets and objects.

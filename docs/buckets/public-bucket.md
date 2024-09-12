# Public Bucket

Sometimes you want to share your bucket with the world. You can do this by
creating a public bucket. This will allow anyone to read the contents of your
bucket. You can still control who can write to your bucket.

## Creating a public bucket using AWS CLI

Assuming you have the AWS CLI configured as shown in the
[AWS CLI guide](../sdks/s3/aws-cli.md), you can create a public bucket as
follows:

```bash
aws s3api --endpoint-url https://fly.storage.tigris.dev create-bucket --bucket foo-public-bucket --acl public-read
```

```text
$ aws s3api --endpoint-url https://fly.storage.tigris.dev create-bucket --bucket foo-public-bucket --acl public-read
{
    "Location": "/foo-public-bucket"
}
```

The key here is the `--acl public-read` flag. This will allow anyone to read the
contents of the bucket `foo-public-bucket`.

## Accessing objects in a public bucket

Objects in a public bucket (by default) can be read without any authentication.
However, only those with access to the bucket can write objects.

Let's upload a file to our public bucket:

```bash
$ aws s3api --endpoint-url https://fly.storage.tigris.dev put-object --bucket foo-public-bucket --key bar.txt --body bar.txt
{
    "ETag": "\"c157a79031e1c40f85931829bc5fc552\""
}
```

Now, anyone can read this file without authentication.

### Path-style request

Path-style URLs use the following format:

```text
https://fly.storage.tigris.dev/bucket-name/key-name
```

So for the object we just uploaded, the path-style URL would be:

```bash
$ wget https://fly.storage.tigris.dev/foo-public-bucket/bar.txt -O- -q
bar
```

### Virtual-hosted–style request

In a virtual-hosted–style URI, the bucket name is part of the domain name in the
URL.

Virtual-hosted–style URLs use the following format:

```text
https://bucket-name.fly.storage.tigris.dev/key-name
```

So for the object we just uploaded, the virtual-hosted–style URL would be:

```bash
$ wget https://foo-public-bucket.fly.storage.tigris.dev/bar.txt -O- -q
bar
```

:::info

You can have a mix of public and private objects in a public bucket. By default,
all objects inherit the access control settings of the bucket they are in. If a
bucket is `public-read`, all objects are publicly readable. If you want to make
an object private, you can set the object ACL to `private`. See the
[Object ACLs](../objects/acl.md) guide for more information.

:::

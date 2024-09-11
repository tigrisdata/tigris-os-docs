# Public Access

If you want to make your bucket accessible to the public, you have a couple of
options. You can either create a public bucket where all its contents are
viewable to everyone, or you can choose specific objects to make public
individually. This will let anyone view the contents of your bucket, but you
still have control over who can write the content within it.

## Public Bucket

### Creating a public bucket using AWS CLI

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

### Accessing objects in a public bucket

Objects in a public bucket can be accessed without any authentication.

Let's upload a file to our public bucket:

```bash
$ aws s3api --endpoint-url https://fly.storage.tigris.dev put-object --bucket foo-public-bucket --key bar.txt --body bar.txt
{
    "ETag": "\"c157a79031e1c40f85931829bc5fc552\""
}
```

Now, we can now access this file without any authentication.

#### Path-style request

Path-style URLs use the following format:

```text
https://fly.storage.tigris.dev/bucket-name/key-name
```

So for the object we just uploaded, the path-style URL would be:

```bash
$ wget https://fly.storage.tigris.dev/foo-public-bucket/bar.txt -O- -q
bar
```

#### Virtual-hosted–style request

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

## Making individual objects public

If you want to make only specific objects `public-read` (or `private`), you need
to enable a bucket setting as follows

- goto [Tigris dashboard](https://console.tigris.dev)
- select your bucket
- goto bucket settings
- enable Object ACLs

![Object ACL setting](/img/object-acl-setting.png)

### Creating a bucket using AWS CLI

```bash
aws s3api --endpoint-url https://fly.storage.tigris.dev create-bucket --bucket foo-bucket
```

Note that this bucket is private by default. i.e. all the objects written to it
are private by default.

### Putting an object with public-read ACL

```bash
aws s3api --endpoint-url https://fly.storage.tigris.dev put-object --bucket foo-bucket --key bar.txt --body bar.txt --acl public-read
```

`--acl public-read` makes the object publicly viewable.

### Accessing the object

Path-style URLs use the following format:

```text
https://fly.storage.tigris.dev/bucket-name/key-name
```

So for the object we just uploaded, the path-style URL would be:

```bash
$ wget https://fly.storage.tigris.dev/foo-bucket/bar.txt -O- -q
bar
```

#### Virtual-hosted–style request

In a virtual-hosted–style URI, the bucket name is part of the domain name in the
URL.

Virtual-hosted–style URLs use the following format:

```text
https://bucket-name.fly.storage.tigris.dev/key-name
```

So for the object we just uploaded, the virtual-hosted–style URL would be:

```bash
$ wget https://foo-bucket.fly.storage.tigris.dev/bar.txt -O- -q
bar
```

Note that above example shows how to write an object with `public-read` ACL in a
`private` bucket. You can also write an object with `private` ACL in a
`public-read` bucket.

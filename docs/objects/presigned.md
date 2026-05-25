# Presigned URLs

:::info

`https://t3.storage.dev` is the API endpoint for authenticated SDK and CLI
requests. Do not use it as the host in presigned URLs you share with clients.

:::

Presigned URLs are URLs that provide temporary access to private objects in a
bucket. This is useful for allowing users to upload or download objects without
requiring them to have AWS credentials or permissions.

They can be used by users to download objects either by entering the URL into a
web browser or by using it in code. They can also be used to allow uploads to
specific objects. If an object with the same key already exists in the bucket,
the presigned URL will allow the user to overwrite the object.

## Expiration time

Presigned URLs are only valid for a limited time. The expiration time can be
specified when generating the URL. The expiration time can be set to a maximum
of 90 days.

## Generating a presigned URL

Refer to the following examples to generate a presigned URL:

- [AWS CLI](/docs/sdks/s3/aws-cli/#using-presigned-urls)
- [ExAWS Elixir SDK](/docs/sdks/s3/aws-elixir-sdk/#using-presigned-urls)
- [AWS Go SDK](/docs/sdks/s3/aws-go-sdk/#using-presigned-urls)
- [AWS Javascript SDK](/docs/sdks/s3/aws-js-sdk/#using-presigned-urls)
- [AWS PHP SDK](/docs/sdks/s3/aws-php-sdk/#using-presigned-urls)
- [AWS Python SDK](/docs/sdks/s3/aws-python-sdk/#using-presigned-urls)

## Sharing presigned URLs with clients

SDKs and the AWS CLI sign presigned URLs against `https://t3.storage.dev`. The
generated URL uses a `t3.storage.dev` host and cannot be shared with clients
directly.

After generating a presigned URL, replace the host with your
[custom domain](../buckets/custom-domain.md) before distributing it. The query
string (signature parameters) stays the same.

### Virtual-hosted style

For bucket `foo-bucket` with custom domain `cdn.example.com`:

```bash
aws s3 presign s3://foo-bucket/hello.txt --endpoint-url https://t3.storage.dev
```

The generated URL looks like:

```text
https://foo-bucket.t3.storage.dev/hello.txt?X-Amz-Algorithm=AWS4-HMAC-SHA256&...
```

Replace the host before sharing:

```text
https://cdn.example.com/hello.txt?X-Amz-Algorithm=AWS4-HMAC-SHA256&...
```

In code:

```bash
aws s3 presign s3://foo-bucket/hello.txt --endpoint-url https://t3.storage.dev \
  | sed 's/foo-bucket\.t3\.storage\.dev/cdn.example.com/'
```

### Bucket name matches custom domain

If your bucket name is the same as your custom domain (e.g. bucket
`mybucket.mydomain.com` with domain `mybucket.mydomain.com`), the generated
URL uses path-style addressing:

```text
https://t3.storage.dev/mybucket.mydomain.com/hello.txt?X-Amz-Algorithm=AWS4-HMAC-SHA256&...
```

Remove the `t3.storage.dev/` prefix:

```bash
aws s3 presign s3://mybucket.mydomain.com/hello.txt \
  | sed 's/t3\.storage\.dev\///'
```

## Security

When utilizing a custom domain and sharing pre-signed URLs for uploading
objects, be mindful that individuals could upload files like HTML, JS, SVG, or
executable browser files. These could pose a risk of XSS (Cross-Site Scripting)
on your domain. Proceed with caution in such scenarios.

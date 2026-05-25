# Presigned URLs

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

## Presigned URL with custom domain

If you utilize a [custom domain with Tigris](../buckets/custom-domain.md), you
can also generate the presigned URL with the custom domain. This allows you to
have consistent branding and user experience. You can utilize any of the SDKs
mentioned above to generate the presigned URL and do string manipulation to have
your custom domain.

For example:

For bucket `foo-bucket` with custom domain `cdn.example.com` and object key
`hello.txt`, the AWS CLI command to generate a presigned URL looks like:

```bash
aws s3 presign s3://foo-bucket/hello.txt --endpoint-url https://t3.storage.dev
```

The generated URL would look like:

```text
https://foo-bucket.t3.storage.dev/hello.txt?X-Amz-Algorithm=AWS4-HMAC-SHA256&...
```

Replace the host (`foo-bucket.t3.storage.dev` → `cdn.example.com`) before sharing:

```bash
aws s3 presign s3://foo-bucket/hello.txt --endpoint-url https://t3.storage.dev \
  | sed 's/foo-bucket\.t3\.storage\.dev/cdn.example.com/'
```

```text
https://cdn.example.com/hello.txt?X-Amz-Algorithm=AWS4-HMAC-SHA256&...
```

## Security

When utilizing a custom domain and sharing presigned URLs for uploading
objects, be mindful that individuals could upload files like HTML, JS, SVG, or
executable browser files. These could pose a risk of XSS (Cross-Site Scripting)
on your domain. Proceed with caution in such scenarios.

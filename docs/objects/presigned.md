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

Refer to the following example to generate a presigned URL:

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

For my bucket `mybucket.mydomain.com` and object key `hello.txt`, AWS CLI
command to generate a presigned URL would look like:

```bash
aws s3 presign s3://mybucket.mydomain.com/hello.txt
```

and generated URL would look like

```bash
https://t3.storage.dev/mybucket.mydomain.com/hello.txt?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=tid_<>%2F20241210%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=<>X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=<>
```

You can remove `fly.storage.tigris.dev/` and make it look like

```bash
https://mybucket.mydomain.com/hello.txt?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=tid_<>%2F20241210%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=<>X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=<>
```

Here is the bash one-liner to do the same:

```bash
aws s3 presign s3://mybucket.mydomain.com/hello.txt |  sed 's/fly.storage.tigris.dev\///'
```

## Security

When utilizing a custom domain and sharing pre-signed URLs for uploading
objects, be mindful that individuals could upload files like HTML, JS, SVG, or
executable browser files. These could pose a risk of XSS (Cross-Site Scripting)
on your domain. Proceed with caution in such scenarios.

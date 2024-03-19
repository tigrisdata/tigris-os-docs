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
of 7 days.

## Generating a presigned URL

Refer to the following example to generate a presigned URL:

- [AWS CLI](/docs/sdks/s3/aws-cli/#using-presigned-urls)
- [ExAWS Elixir SDK](/docs/sdks/s3/aws-elixir-sdk/#using-presigned-urls)
- [AWS Go SDK](/docs/sdks/s3/aws-go-sdk/#using-presigned-urls)
- [AWS Javascript SDK](/docs/sdks/s3/aws-js-sdk/#using-presigned-urls)
- [AWS PHP SDK](/docs/sdks/s3/aws-php-sdk/#using-presigned-urls)
- [AWS Python SDK](/docs/sdks/s3/aws-python-sdk/#using-presigned-urls)

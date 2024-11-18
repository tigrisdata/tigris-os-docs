# Limiting Allowed Actions on Buckets

Normally the Tigris Dashboard allows you to do everything you need to make
access keys have the minimum scope possible. However sometimes you need more.
Tigris allows you [to attach IAM policies](/docs/concepts/authnz/#iam-policies)
to access keys. This blueprint will show you how to make up complicated policies
for your buckets, such as this:

- Read, List, and Write files to bucket `generated-images`
- Read and List files in bucket `model-storage`

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ListObjectsInBucket",
      "Effect": "Allow",
      "Action": ["s3:ListObjectsV2", "s3:ListObjectsV1"],
      "Resource": ["arn:aws:s3:::model-storage", "arn:aws:s3:::public-images"]
    },
    {
      "Sid": "AllowFetchingObjects",
      "Effect": "Allow",
      "Action": "s3:GetObject",
      "Resource": [
        "arn:aws:s3:::model-storage/*",
        "arn:aws:s3:::model-storage",
        "arn:aws:s3:::public-images/*",
        "arn:aws:s3:::public-images"
      ]
    },
    {
      "Sid": "AllowPuttingImagesIntoPublicBucket",
      "Effect": "Allow",
      "Action": "s3:PutObject*",
      "Resource": ["arn:aws:s3:::public-images/*"]
    }
  ]
}
```

This policy contains three statements:

- first statement allows listing objects in the `model-storage` and
  `public-images` buckets.
- second statement allows reading objects from the `model-storage` and
  `public-images` buckets.
- first statement allows writing objects to the `public-images` bucket.

You can attach this policy to the access key you created earlier.

# Making an access key limited to specific calls on specific buckets

Normally the Tigris Dashboard allows you to do everything you need to make
access keys have the minimum scope possible. However sometimes you need more.
Tigris allows you [to attach IAM policies](/docs/concepts/authnz/#iam-policies)
to access keys. This blueprint will show you how to make up complicated policies
for your buckets, such as this:

- Read, List, and Write files to bucket `generated-images`
- Read and List files in bucket `model-storage`

Create a new access key in the [Tigris Dashboard](https://console.tigris.dev).
Don't assign any permissions to it. Copy the access key ID and secret access
keys into either your notes or a password manager, you will not be able to see
them again.

Copy this to `policy.json`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ListObjectsInBucket",
      "Effect": "Allow",
      "Action": ["s3:ListBucket"],
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

Open `policy.json` in your text editor and change the names of the buckets if
you need to.

Then export this variable to make IAM changes in Tigris:

```text
AWS_ENDPOINT_URL_IAM=https://fly.iam.storage.tigris.dev
```

Create an IAM policy based on the document you edited:

```text
aws iam create-policy --policy-name sdxl-runner --policy-document file://./policy.json
```

Copy down the ARN in the output, it should look something like this:

```text
arn:aws:iam::flyio_hunter2hunter2hunter2:policy/sdxl-runner
```

Attach it to the token you just created:

```text
aws iam attach-user-policy \
  --policy-arn arn:aws:iam::flyio_hunter2hunter2:policy/sdxl-runner \
  --user-name tid_some_access_key_id
```

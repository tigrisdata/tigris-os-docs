# Limiting Allowed Actions on Buckets

Normally the Tigris Dashboard allows you to do everything you need to make
access keys have the minimum scope possible. However sometimes you need more.
For more advanced use cases, you can use IAM policies to limit the actions that
can be performed on the buckets. This is useful when you want to limit the
actions that can be performed on the buckets to a specific set of operations.

To attach a policy to an access key, you need to create the access key first.
You can do this by going to the Tigris Dashboard and creating an access key.

Below are some examples of how to create an access key with limited permissions.

Before you start, make sure you have your AWS CLI configured with the Tigris
credentials. You can do this by following the instructions in the
[Getting Started with Tigris](/docs/sdks/s3/aws-cli) guide.

## Limiting Read and Write Access to Specific Buckets

This blueprint will show you how to make up complicated policies for your
buckets, such as this:

- Read, List, and Write files to bucket `public-images`
- Read and List files in bucket `model-storage`

### 1. Create an access key in the Tigris Dashboard.

Make sure to **not** grant access to any bucket when creating the access key.
This will create an access key with no permissions.

### 2. Create the IAM policy

Create the IAM policy file using any text editor. The file should be in JSON
format. For example, you can name it `policy.json` or any other name you prefer.
Use the following content for the policy file:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:ListObjectsV2", "s3:ListObjectsV1"],
      "Resource": ["arn:aws:s3:::model-storage", "arn:aws:s3:::public-images"]
    },
    {
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
- third statement allows writing objects to the `public-images` bucket.

Next, create the IAM policy using the above JSON file. You can use the AWS CLI
to create the policy. Make sure to replace
`<example-org-level-unique-policy-name>` with a unique name for your policy.

```bash
aws --profile=tigris iam --endpoint-url=https://iam.storage.dev \
  create-policy --policy-name <example-org-level-unique-policy-name> \
  --policy-document file:///path/to/policy.json
```

Note the ARN of the policy. You will need it in the next step.

### 3. Attach the IAM policy to the access key

Once you've created the IAM policy, you can attach it to the access key using
the `IAM:AttachUserPolicy` operation. Make sure to replace
`<generated_policy_arn_from_previous_step>` with the ARN of the policy you
created in the previous step and `<tid_>` with the access key ID you created in
the first step.

```bash
aws --profile=tigris iam --endpoint-url=https://iam.storage.dev \
  attach-user-policy \
  --policy-arn <generated_policy_arn_from_previous_step> \
  --user-name <tid_>
```

This command attaches the IAM policy to the access key, allowing it to perform
the actions specified in the policy.

### 4. Verify the access key permissions

You can verify the permissions of the access key by using the AWS CLI to list
the objects in the `model-storage` and `public-images` buckets. Make sure to use
the access key ID you created in the first step.

```bash
AWS_ACCESS_KEY_ID=<tid> AWS_SECRET_ACCESS_KEY=<tsec_> aws \
  endpoint-url=https://t3.storage.dev \
  s3api list-objects --bucket model-storage
```

## Granting Write-Only Access to a Bucket

This blueprint will show you how to make up a policy that allows only writing
and listing files to a bucket.

### 1. Create an access key in the Tigris Dashboard.

Make sure to **not** grant access to any bucket when creating the access key.

### 2. Create the IAM policy

Create the IAM policy file using any text editor. The file should be in JSON
format. For example, you can name it `policy.json` or any other name you prefer.
Use the following content for the policy file:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:AbortMultipartUpload",
        "s3:ListMultipartUploadParts",
        "s3:CreateMultipartUpload",
        "s3:CompleteMultipartUpload",
        "s3:ListObjects*"
      ],
      "Resource": "arn:aws:s3:::test-access-key/*"
    }
  ]
}
```

This policy contains one statement:

- first statement allows writing objects to the `test-access-key` bucket and
  listing objects in the `test-access-key` bucket.

Next, create the IAM policy using the above JSON file. You can use the AWS CLI
to create the policy. Make sure to replace
`<example-org-level-unique-policy-name>` with a unique name for your policy.

```bash
aws --profile=tigris iam --endpoint-url=https://iam.storage.dev \
  create-policy --policy-name <example-org-level-unique-policy-name> \
  --policy-document file:///path/to/policy.json
```

Note the ARN of the policy. You will need it in the next step.

### 3. Attach the IAM policy to the access key

Once you've created the IAM policy, you can attach it to the access key using
the `IAM:AttachUserPolicy` operation. Make sure to replace
`<generated_policy_arn_from_previous_step>` with the ARN of the policy you
created in the previous step and `<tid_>` with the access key ID you created in
the first step.

```bash
aws --profile=tigris iam --endpoint-url=https://iam.storage.dev \
  attach-user-policy --policy-arn <generated_policy_arn_from_previous_step> \
  --user-name <tid_>
```

This command attaches the IAM policy to the access key, allowing it to perform
the actions specified in the policy.

### 4. Verify the access key permissions

First, let's check the policy that we attached to the access key. You can do
this by using the AWS CLI to get the policy details. Make sure to replace
`<generated_policy_arn_from_previous_step>` with the ARN of the policy you
created in the previous step.

```bash
aws --profile=tigris iam --endpoint-url=https://iam.storage.dev \
  get-user-policy --user-name <tid_> \
  --policy-name <example-org-level-unique-policy-name>
```

This command will return the details of the policy, including the actions and
resources that are allowed.

Next, let's check the access key permissions. You can verify the permissions of
the access key by using the AWS CLI to list the objects in the `test-access-key`
bucket. Make sure to use the access key ID you created in the first step.

```bash
AWS_ACCESS_KEY_ID=<tid> AWS_SECRET_ACCESS_KEY=<tsec_> aws \
  endpoint-url=https://t3.storage.dev \
  s3api list-objects --bucket test-access-key
```

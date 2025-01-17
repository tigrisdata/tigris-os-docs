# IAM

IAM stands for Identity and Access Management. By default, Tigris supplies two
simplified roles that fit the majority of use cases, `Read Only` and `Editor`.
In addition to these prebuilt roles, Admin users can also further customize
access controls by crafting IAM policies and attaching them to users. This is a
powerful feature that allows you to create fine-grained access control for your
buckets.

## Using AWS Tools with Tigris

Because Tigris is S3-compatible, you can continue to use existing AWS S3 IAM
policies, CLIs, SDKs, and libraries with Tigris. Custom IAM policies must be
defined and set using the AWS CLI, configured with Tigris credentials.

# How to create and attach an IAM policy

Policies are attached to access keys. If you delete and recreate an access key,
you'll need to attach IAM policies to the new access key.

## Create an Access Key

- Go to the [Tigris Dashboard](https://console.tigris.dev).
- Click on the `Access Keys` tab.
- Click on the `Create Access Key` button.
- Do not assign any permissions to it.
- Copy the access key ID and secret access keys into either your notes or
  password manager, you will not be able to see them again.
- Configure your environment to use Tigris credentials with
  [these guides.](https://www.tigrisdata.com/docs/sdks/s3/aws-cli)
- Ensure your IAM endpoint URL points to Tigris:
  `AWS_ENDPOINT_URL_IAM=https://fly.iam.storage.tigris.dev`

## Create an IAM Policy

Let's create an IAM policy and attach it to an access key. Here's an example IAM
policy. You'll need to save it as a `.json` file.

```
nano file:///path/to/policy.json

{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::example-bucket/*"
    }
  ]
}
```

- "Version": "2012-10-17": Specifies the version of the policy language.
- "Statement": An array of one or more statements that define the permissions.
  In this case, there is only one statement.
- "Effect": "Allow": Specifies whether the action is allowed or denied.
- "Action": "s3:GetObject": Specifies the action that is allowed. In this case,
  it allows the GetObject action, which is used for reading (downloading)
  objects from the bucket.
- "Resource": "arn:aws:s3:::example-bucket/\*": Specifies the Amazon Resource
  Name (ARN) of the resource to which the policy applies. Tigris uses the ARN as
  the resource name. In this example, it grants permission to all objects (`*`)
  in the specified bucket (`example-bucket`).

Create your IAM policy using the `IAM:CreatePolicy` operation:

```bash
aws iam create-policy --policy-name <example-org-level-unique-policy-name> --policy-document file:///path/to/policy.json
```

Note the ARN of the policy.

## Attach IAM Policy

Once you've created an IAM Policy, you can attach it to users using the
`IAM:AttachUserPolicy` operation:

```bash
aws iam attach-user-policy --policy-arn <generated_policy_arn_from_previous_step> --user-name <tid_>
```

Here `--user-name` is the access key id.

![Authorization](/img/auth/authorization.png)

## Use cases

Here are some common use cases for IAM policies:

- [Restrict the actions that can be performed on a bucket or object by a specific access-key (machine user)](/docs/iam/limited-access-key.md).
- [IP restrictions](/docs/iam/ip-restrictions.md).
- [Restricting access by date and time](/docs/iam/date-time-restrictions.md).

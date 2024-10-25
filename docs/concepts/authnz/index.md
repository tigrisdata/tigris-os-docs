# Authentication & Authorization

Tigris, being S3-compatible, offers S3-supported authentication and
authorization methods. AWS S3 evolved in offerings for their authentication and
authorization needs. We currently support what AWS S3 recommends to their users
for the AuthN and AuthZ needs.

## Authentication

Tigris offers two mechanisms for authentication.

- AWS signature version 4
- Session token

### AWS Signature version 4

This authentication method is based on a hash-based signature. The first
selected element of the request is picked and converted to a string. A signing
key signs this formed string version, and a hash-based message authentication
code (`HMAC`) is derived. The signing key is derived from the secret access key.
The AWS S3 SDK handles this signature generation part.

The server then receives a request along with the signature and the
access_key_id. The server recreates the signature and compares it to the
incoming signature. This is how the server authenticates and fetches the
authenticated user’s context.

This mechanism relies on the access key - Tigris supports IAM’s
`CreateAccessKey` API to generate access keys. These keys are stored on the
Tigris server in an encrypted form with `AES` `256-bit` encryption.

![Double encryption of access key](/img/auth/double-encryption-of-key.png)

### Session Token

This mechanism is based on the idea of temporary credentials. Within the Tigris,
this is mainly used for human users when interacting with Tigris’s web console.
The session token has a limited lifetime. Tigris uses `JWT` (JSON Web Token) as
the session token. This token is signed by an authentication provider using the
`RS256` algorithm. When the user logs in to Tigris’s web console, Tigris’s
authentication service issues the `JWT`. This JWT contains the metadata about
the user, for example, the org ids and the user id.

This session token is signed by Tigris’s authentication service using `RS256`.
This token is fed to the AWS S3 client as a session token field. When a Tigris
server receives a request containing the session token via header
`x-amz-security-token`, Tigris validates the signature of the JWT by using the
public key rendered by Tigris’s authentication service. If the signature is
valid, Tigris server further validates the claims made by the token. Such as
issuer, audience, and expiration.

![Session token based authentication](/img/auth/session-token-auth.png)

## Authorization

Tigris supports Role-Based-Access-Control (RBAC) and AWS's IAM policies
mechanism for the authorization system.

When you create an access key, you can assign a role to it. This role is mapped
to a bucket. This role is a simplified version of IAM policies. This role is
used to determine the access level of the key.

### Role-Based-Access-Control (RBAC)

The table below shows the operations that can be performed by the access key
based on the role assigned to the it.

| Operation                          | Admin | Editor | ReadOnly |
| ---------------------------------- | ----- | ------ | -------- |
| AbortMultipartUpload               | ✅    | ✅     | ❌       |
| CompleteMultipartUpload            | ✅    | ✅     | ❌       |
| CopyObject                         | ✅    | ✅     | ❌       |
| CopyObjectPart                     | ✅    | ✅     | ❌       |
| DeleteBucket                       | ✅    | ✅     | ❌       |
| DeleteBucketCors                   | ✅    | ✅     | ❌       |
| DeleteBucketLifecycleConfiguration | ✅    | ✅     | ❌       |
| DeleteBucketOwnershipControls      | ✅    | ✅     | ❌       |
| DeleteBucketPolicy                 | ✅    | ✅     | ❌       |
| DeleteBucketTagging                | ✅    | ✅     | ❌       |
| DeleteMultipleObjects              | ✅    | ✅     | ❌       |
| DeleteObject                       | ✅    | ✅     | ❌       |
| DeleteObjectTagging                | ✅    | ✅     | ❌       |
| GetAccessKey                       | ✅    | ✅     | ✅       |
| GetBucketACL                       | ✅    | ✅     | ❌       |
| GetBucketAccelerateConfiguration   | ✅    | ✅     | ❌       |
| GetBucketCors                      | ✅    | ✅     | ❌       |
| GetBucketLifecycleConfiguration    | ✅    | ✅     | ❌       |
| GetBucketLocation                  | ✅    | ✅     | ✅       |
| GetBucketOwnershipControls         | ✅    | ✅     | ❌       |
| GetBucketPolicy                    | ✅    | ✅     | ❌       |
| GetBucketPolicyStatus              | ✅    | ✅     | ✅       |
| GetBucketRequestPayment            | ✅    | ✅     | ❌       |
| GetBucketTagging                   | ✅    | ✅     | ✅       |
| GetBucketVersioning                | ✅    | ✅     | ✅       |
| GetObject                          | ✅    | ✅     | ✅       |
| GetObjectACL                       | ✅    | ✅     | ❌       |
| GetObjectTagging                   | ✅    | ✅     | ✅       |
| HeadBucket                         | ✅    | ✅     | ✅       |
| HeadObject                         | ✅    | ✅     | ✅       |
| ListAccessKeys                     | ✅    | ✅     | ✅       |
| ListBuckets                        | ✅    | ✅     | ✅       |
| ListMultipartUploads               | ✅    | ✅     | ✅       |
| ListObjectParts                    | ✅    | ✅     | ❌       |
| ListObjectsV1                      | ✅    | ✅     | ✅       |
| ListObjectsV2                      | ✅    | ✅     | ✅       |
| NewMultipartUpload                 | ✅    | ✅     | ❌       |
| GetBucketAccelerateConfiguration   | ✅    | ✅     | ✅       |
| GetBucketOwnershipControls         | ✅    | ✅     | ✅       |
| PostPolicy                         | ✅    | ✅     | ❌       |
| PutBucket                          | ✅    | ✅     | ❌       |
| PutBucketACL                       | ✅    | ✅     | ❌       |
| PutBucketAccelerateConfiguration   | ✅    | ✅     | ❌       |
| PutBucketCors                      | ✅    | ✅     | ❌       |
| PutBucketLifecycleConfiguration    | ✅    | ✅     | ❌       |
| PutBucketOwnershipControls         | ✅    | ✅     | ❌       |
| PutBucketPolicy                    | ✅    | ✅     | ❌       |
| PutBucketTagging                   | ✅    | ✅     | ❌       |
| PutObject                          | ✅    | ✅     | ❌       |
| PutObjectACL                       | ✅    | ✅     | ❌       |
| PutObjectLegalHold                 | ✅    | ✅     | ❌       |
| PutObjectLockConfiguration         | ✅    | ✅     | ❌       |
| PutObjectRetention                 | ✅    | ✅     | ❌       |
| PutObjectTagging                   | ✅    | ✅     | ❌       |
| UploadObjectPart                   | ✅    | ✅     | ❌       |
| IAM:CreatePolicy                   | ✅    | ❌     | ❌       |
| IAM:ListPolicies                   | ✅    | ❌     | ❌       |
| IAM:ListUserPolicies               | ✅    | ❌     | ❌       |
| IAM:AttachUserPolicy               | ✅    | ❌     | ❌       |

The bucket owner is allowed to perform all the operations on their own bucket.

### IAM Policies

In addition to the role, Admin users can also further customize the access by
crafting IAM policies.

IAM policies are used to define the access level of the user. The user can be a
human user or an access key.

Here is an example of the IAM policy

```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::images/*"
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
- "Resource": "arn:aws:s3:::images/_": Specifies the Amazon Resource Name (ARN)
  of the resource to which the policy applies. In this example, it grants
  permission to all objects (`/_`) in the specified bucket (`images`).

#### Condition

For `Condition` Tigris supports `IpAddress` and `NotIpAddress` clauses. Here is
an example of policy applies if request is made from IP `1.2.3.4`.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "IpRestrictedReads",
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:ListObjects"],
      "Resource": ["arn:aws:s3:::images/*"],
      "Condition": { "IpAddress": { "aws:SourceIp": "1.2.3.4" } }
    }
  ]
}
```

Similarly, here is an example of a policy that applies only if the request is
not made from the IP address 1.2.3.4.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "IpRestrictedReads",
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:ListObjects"],
      "Resource": ["arn:aws:s3:::images/*"],
      "Condition": { "NotIpAddress": { "aws:SourceIp": "1.2.3.4" } }
    }
  ]
}
```

These policies are standalone on their own. They need to be attached to the user
in order to apply them.

#### Create IAM Policy

- Admin users can create IAM policies using the `IAM:CreatePolicy` operation.

Here is AWS CLI reference to create IAM policy

```bash
aws iam create-policy --policy-name org-level-unique-policy-name --policy-document file:///path/to/policy.json
```

:::note

- Tigris's IAM operations are available at URL
  `https://fly.iam.storage.tigris.dev`.

- You can use environment variable
  `AWS_ENDPOINT_URL_IAM=https://fly.iam.storage.tigris.dev`

:::

Policy creation has no impact on authorization until it is attached to a user.

#### Attach IAM Policy

- Admin users can attach IAM policies to users using the `IAM:AttachUserPolicy`
  operation.

Here is AWS CLI reference to attach IAM policy

```bash
aws iam attach-user-policy --policy-arn <generated_policy_arn_from_previous_step> --user-name <tid_>
```

Here `--user-name` can be either human user id or machine user id.

After the user has been authenticated successfully, the system gets the context
about the current user. This context includes metadata about users like user_id,
user_role (namespace_owner, regular), machine users (access keys),
human_user_id, and so on. Using these users’ metadata, Tigris pulls the attached
IAM policies for this user from its IAM store. The user's context with regard to
the bucket is pulled if the user is the owner of the bucket.

With this information, Tigris evaluates the access and grants or denies access
to the operation.

By default, users within the Tigris system are categorized into two main groups:

1. Human Users: These users authenticate and access the Tigris dashboard. They
   have the capability to generate access keys, which are subsequently utilized
   by API consumers such as SDKs and CLIs.

2. Access Keys: These keys are created by human users and used by API consumers
   like SDKs and CLIs.

#### Human users

For human users accessing Tigris, the system aligns with Fly org's roles and
offers a pre-configured permission system. Within Fly org, there exist two
primary roles:

- Admin: Granted full permissions within their designated namespace.
- Member: Permitted to execute read and write operations.

#### Access keys

During the creation of access keys, human users have the option to assign
bucket-level roles to these keys. At a higher level, two roles are available:
`Editor` and `ReadOnly`. These roles serve as simplified versions of IAM
policies, providing read-write access for `Editor` and read-only access for
`ReadOnly`. This simplification aims to streamline permission management.

#### Customization of IAM policies

Furthermore, Tigris supports the customization of IAM policies. Admin users
possess the capability to create custom IAM policies and associate them with
specific users, offering further flexibility in permission management.

![Authorization](/img/auth/authorization.png)

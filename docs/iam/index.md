# IAM Overview

Tigris IAM simplifies access management by removing IAM Users and Roles. All
users are either Members or Admins within an organization. Access is managed
through access keys with attached policies. Roles, temporary credentials, and
instance profiles are not used.

Instead of delegating permissions to IAM users or groups, you delegate them to
members of your organization or access keys. By only focusing on policies
attached to access keys, Tigris focuses on what developers really need.

## Key Principles

- Tigris IAM is S3-compatible, or written specifically for the needs of object
  storage management.
- Access keys can have directly attached policies. Tigris does not use IAM
  Users, IAM groups, or IAM Roles.
- Access keys can have an expiry attached to them.
- All users are Members of an Organization and use Access Keys with policies.
- Any Member can create an Access Key with as much permissions as they have and
  no more.

## Prebuilt Roles for Organization Members

Two
[prebuilt roles](../account-management/accounts.md#user-roles-and-permissions)
are available for organization members:

- `Member`: List, read, and create access to buckets.
- `Admin`: Full access to buckets, objects, and member management.

:::note

These are different from the concept of IAM Roles in other cloud platforms.
Tigris roles set the permission limits that a user has instead of defining the
scope of every single action they can do.

:::

These roles apply to users in the Tigris Dashboard. Programmatic access is
controlled by
[attaching IAM policies to access keys](./policies/attach-iam-policy.md). For
organization management, see the
[Organizations Documentation](/docs/account-management/organizations/).

## Programmatic Access with Existing AWS IAM API Tools

Tigris' IAM API is [compatible with existing IAM tooling](/docs/iam/policies/)
by emulating the right
[service endpoints](/docs/sdks/s3/aws-cli/#service-endpoints), but Tigris
specifically focuses on the part of IAM that's relevant for object storage. In
many cases, you can change over your existing IAM tooling to use Tigris by doing
the following:

- Join or create an Organization
- Create access keys and attach policies
- Set the environment variables `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`
  to your Tigris credentials
- Set the environment variable `AWS_REGION` to `auto`
- Set the environment variable `AWS_ENDPOINT_URL_IAM` to
  `https://iam.storage.dev` for IAM operations

Refer to the [AWS CLI](/docs/sdks/s3/aws-cli/) and
[SDK documentation](/docs/sdks/s3/) for configuration details.

### Access Key Operations: Tigris vs AWS IAM API

Our [IAM APIs page](../api/s3/index.md#iam-apis) has more information, but at a
high level:

| Operation                               | Tigris Support | AWS Support | Description                                     |
| --------------------------------------- | -------------- | ----------- | ----------------------------------------------- |
| `CreateAccessKey`                       | ✅             | ✅          | Generate a new access key                       |
| `ListAccessKeys`                        | ✅             | ✅          | View existing access keys                       |
| `UpdateAccessKey`                       | ✅             | ✅          | Enable or disable an access key                 |
| `DeleteAccessKey`                       | ✅             | ✅          | Permanently delete an access key                |
| `GetAccessKeyLastUsed`                  | ❌             | ✅          | View the last-used timestamp for audit purposes |
| `TagAccessKey` / `UntagAccessKey`       | ❌             | ✅          | Add or remove metadata tags                     |
| `CreateUser`, `DeleteUser`, `ListUsers` | ❌             | ✅          | Full IAM user lifecycle                         |
| `GetUser`, `UpdateUser`, `ListUserTags` | ❌             | ✅          | Manage IAM user metadata                        |

Tigris only supports the operations required for secure and scoped Access Key
management— no IAM users, roles, or identity management APIs needed.

## Policy Compatibility

Tigris supports the same policy document structure as AWS IAM, including
standard `Action`, `Effect`, `Resource`, and `Condition` blocks. This makes it
easy to reuse existing IAM policies or migrate from AWS without learning new
syntax.

Tigris also supports many common S3-compatible actions such as:

- `s3:GetObject`
- `s3:PutObject`
- `s3:ListBucket`
- `s3:DeleteObject`
- `s3:ListObjectsV2`

For a full list of supported actions, examples, and conditions, see the
[Policies Documentation](/docs/iam/policies/). Also see these example policies:

- [Creating a limited access key](./policies/examples/limited-access-key.md)
- [Enforcing IP restrictions](./policies/examples/ip-restrictions.md)
- [Enforcing date/time restrictions](./policies/examples/date-time-restrictions.md)
  (automatic expiration)
- [Limiting access for a training job](./policies/examples/training-job.md)

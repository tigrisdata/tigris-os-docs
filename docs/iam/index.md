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
  Users, IAM Groups, or IAM Roles.
- All users in an Organization and can create access keys and attach IAM
  policies to them.

## Prebuilt Roles for Organization Members

Two
[prebuilt roles](../account-management/accounts.md#user-roles-and-permissions)
are available for organization members:

- `Member` can list all buckets and create new buckets within the Organization.
  They have access to all buckets shared with the Organization.
- `Admin` have full access to all buckets and can manage Organization members
  and their permissions.

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
  `https://iam.storageapi.dev` for IAM operations

Refer to the [AWS CLI](/docs/sdks/s3/aws-cli/) and
[SDK documentation](/docs/sdks/s3/) for configuration details.

### Access Key Operations: Tigris vs AWS IAM API

Our [IAM APIs page](../api/s3/index.md#iam-apis) has more information, but at a
high level:

| Operation                               | Tigris Support | AWS Support | Description                                             |
| --------------------------------------- | -------------- | ----------- | ------------------------------------------------------- |
| `CreateAccessKey`                       | ✅             | ✅          | Generate a new access key                               |
| `ListAccessKeys`                        | ✅             | ✅          | View existing access keys                               |
| `UpdateAccessKey`                       | ✅             | ✅          | Enable or disable an access key                         |
| `DeleteAccessKey`                       | ✅             | ✅          | Permanently delete an access key                        |
| `AttachUserPolicy` / `DetachUserPolicy` | ✅             | ✅          | Attach or detach IAM policy to an access key (not user) |
| `ListUserPolicies`                      | ✅             | ✅          | List IAM policies attached to an access key (not user)  |
| `GetAccessKeyLastUsed`                  | ❌             | ✅          | View the last-used timestamp for audit purposes         |
| `TagAccessKey` / `UntagAccessKey`       | ❌             | ✅          | Add or remove metadata tags                             |
| `CreateUser`, `DeleteUser`, `ListUsers` | ❌             | ✅          | Full IAM user lifecycle                                 |
| `GetUser`, `UpdateUser`, `ListUserTags` | ❌             | ✅          | Manage IAM user metadata                                |

Tigris only supports the operations required for secure and scoped access key
management — no IAM Users, Roles, or identity management APIs needed.

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
- `s3:RestoreObject`

For a full list of supported actions, examples, and conditions, see the
[Policies Documentation](/docs/iam/policies/). Also see these example policies:

- [Enforcing IP restrictions](./policies/examples/ip-restrictions.md)
- [Enforcing date/time restrictions](./policies/examples/date-time-restrictions.md)
  (automatic expiration)
- [Limiting access for a training job](./policies/examples/training-job.md)

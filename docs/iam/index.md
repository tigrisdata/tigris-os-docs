# IAM Overview

Tigris IAM is designed to be simple, secure, and purpose-built for object
storage. We started by removing two of the easiest to misuse components: IAM
Users and IAM Roles. On Tigris, you’re a Member or Admin of an organization, but
that’s as far as “users” go. You don’t assume roles to get temporary credentials
that you then need to refresh in the middle of longer running jobs. We don’t
have compute instances, so we don’t need instance profiles for policy
attachments to access your data from an instance. Tigris IAM is only access keys
with policy attachments— focusing instead on what developers actually need.

---

## 🎯 Key Principles

- **Simplified IAM that's still S3 Compatible**: You don’t create IAM users or
  assume roles for programmatic access.
- **Access Keys Have Policies Attached**: Access to resources is governed by
  policy attachments, not roles or groups.
- **No Temporary Credentials**: Expire your access keys when you choose.
- ✅ Instead, you are a **Member of an Organization**.
- ✅ You create **Access Keys**, and attach **Policies** directly to them.

This model removes confusion, reduces risk, and ensures that permissions are
clear, scoped, and easy to manage.

---

## 🧩 Prebuilt Roles for Organization Members

Tigris provides two prebuilt roles that can be assigned to **Members of your
Organization**:

- `Member`: Grants list, read, and create access to buckets within the
  organization.
- `Admin`: Grants full read/write and create access to buckets and objects, as
  well as management of Members and permissions.

These roles are managed via the Tigris Dashboard and control what a human can do
while logged in— not what an access key can do programmatically.

To control programmatic access, attach IAM Policies directly to Access Keys. To
manage Organizations, reference the
[Organizations Documentation](/docs/account-management/organizations/).

---

## 🛠️ Programmatic Access with Existing S3 API Tools

Tigris is S3-compatible, which means all the same API calls work, but pointed at
the Tigris [service endpoints](/docs/sdks/s3/aws-cli/#service-endpoints).
Practically, this means you can change your existing code to use Tigris by:

- Join or create an Organization
- Create Access Keys
- Attach a Policy to your Access Keys
- Update your environment variables or credentials file to set
  `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` to the Tigris Access Key and
  Secret
- Update your region, `AWS_REGION` to `auto`
- Override the endpoint URL, `AWS_ENDPOINT_URL_IAM` to `https://iam.storage.dev`
  for IAM operations.
- Now you're ready to use the [AWS CLI](/docs/sdks/s3/aws-cli/), or any of your
  [familiar SDKs](/docs/sdks/s3/) to manage Tigris Access Keys.

More help for how to configure your specific tool is available in the
[AWS S3 SDKs Documentation](/docs/sdks/s3/).

---

## 📜 Policy Compatibility

Tigris supports the same policy document structure as AWS IAM, including
standard `Action`, `Effect`, `Resource`, and `Condition` blocks. This makes it
easy to reuse existing IAM policies or migrate from AWS without learning a new
syntax.

Tigris also supports many common S3-compatible actions such as:

- `s3:GetObject`
- `s3:PutObject`
- `s3:ListBucket`
- `s3:DeleteObject`
- `s3:ListObjectsV2`

For a full list of supported actions, examples, and conditions, see the
[Policies Documentation](/docs/iam/policies/).

---

## 🔑 Access Key Operations: Tigris vs AWS IAM API

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

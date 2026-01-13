# IAM Policy Support

Tigris IAM policies define what actions an access key can perform on specific
resources, optionally under conditions like IP address or time of day.

Tigris uses a simplified, S3-compatible subset of AWS IAM. Policies are attached
directly to **Access Keys**, not users or roles.

## Supported IAM Policy Operations

Tigris supports the following IAM operations for managing access policies:

| Operation                   | Description                                     |
| --------------------------- | ----------------------------------------------- |
| `IAM:CreatePolicy`          | Create a new IAM policy                         |
| `IAM:ListPolicies`          | List all IAM policies                           |
| `IAM:GetPolicy`             | Get details of a specific policy                |
| `IAM:DeletePolicy`          | Delete a specific IAM policy                    |
| `IAM:AttachUserPolicy`      | Attach a policy to an access key                |
| `IAM:DetachUserPolicy`      | Detach a policy from an access key              |
| `IAM:ListUserPolicies`      | List policies attached to a specific access key |
| `IAM:GetPolicyVersion`      | Retrieve a specific version of a policy         |
| `IAM:ListEntitiesForPolicy` | List access keys a policy is attached to        |

> **Note:** Tigris does not support IAM users. When these operations refer to
> "user", they apply to **access keys only**.

## Supported IAM Policy Blocks

IAM policies in Tigris use a subset of the AWS IAM specification. The following
blocks are supported:

| Block                 | Supported  | Description                              |
| --------------------- | ---------- | ---------------------------------------- |
| `Version`             | ✅         | Must be `2012-10-17`                     |
| `Id`                  | ✅         | Optional identifier for the policy       |
| `Statement`           | ✅         | Array of permission rules                |
| `Statement.Sid`       | ✅         | Optional identifier for individual rules |
| `Statement.Effect`    | ✅         | `Allow` or `Deny`                        |
| `Statement.Action`    | 🔶 Partial | Must use Tigris-supported S3 actions     |
| `Statement.Resource`  | ✅         | Specific ARNs or wildcard patterns       |
| `Statement.Condition` | 🔶 Partial | Limited to the condition keys below      |

## Supported Condition Keys

Tigris supports the following condition operators in IAM policies:

- `IpAddress`
- `NotIpAddress`
- `DateEquals`
- `DateNotEquals`
- `DateGreaterThan`
- `DateGreaterThanEquals`
- `DateLessThan`
- `DateLessThanEquals`

> Only `aws:CurrentTime` is supported as a variable in date-based conditions.

## Example: Read-Only IAM Policy

This example grants read-only access to all objects in the `images` bucket:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:ListBucket"],
      "Resource": ["arn:aws:s3:::images", "arn:aws:s3:::images/*"]
    }
  ]
}
```

## Supported Actions in `Action` Block

Tigris supports a wide range of `s3:` IAM actions. You can:

- Use exact action names (`s3:GetObject`)
- Use wildcards (`s3:Put*`, `s3:*`)

For the full list of actions Tigris supports, see the
[Full List of Supported S3-Compatible Actions](/docs/iam/policies/supported-actions).

## Summary

- IAM policies define access for **access keys**, not users or roles.
- Tigris supports a subset of AWS IAM JSON policy structure.
- You can manage policies using the Tigris Dashboard or AWS CLI configured with
  Tigris credentials.
- Only supported `s3:` actions and conditions will be accepted during policy
  creation.

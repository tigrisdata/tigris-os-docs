# IAM Policy Support

An IAM (Identity and Access Management) policy is a set of rules that define
permissions, specifying what actions can be performed on specific resources,
optionally with some conditions.

## Supported IAM Policy Operations

Tigris supports a subset of IAM operations that are commonly used for managing
permissions. The following operations are supported:

| Operation                 | Description                                        |
| ------------------------- | -------------------------------------------------- |
| IAM:CreatePolicy          | Creates a new IAM policy.                          |
| IAM:ListPolicies          | Lists all IAM policies.                            |
| IAM:GetPolicy             | Retrieves information about a specific IAM policy. |
| IAM:DeletePolicy          | Deletes a specific IAM policy.                     |
| IAM:AttachUserPolicy      | Attaches an IAM policy to a user.                  |
| IAM:DetachUserPolicy      | Detaches an IAM policy from a user.                |
| IAM:ListUserPolicies      | Lists all IAM policies attached to a user.         |
| IAM:GetPolicyVersion      | Retrieves a specific IAM policy version.           |
| IAM:ListEntitiesForPolicy | List entities (users only) attached to a policy.   |

Note: Tigris does not support attaching IAM policies to specific users. Instead,
policies can be attached to access keys. This applies to all other IAM policy
operations as well.

## Supported IAM Policy Blocks

Tigris supports the core set of IAM policy blocks as defined by the AWS IAM
specification.

IAM policies encompass a broad range of features. In the context of Tigris, we
support the following policy blocks:

| Block               | Supported | Description                                                                                                                                                                                                                           |
| ------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Version             | Yes       | Specifies the version of the policy language. The supported version is `2012-10-17`.                                                                                                                                                  |
| Id                  | Yes       | An optional identifier of the policy.                                                                                                                                                                                                 |
| Statement           | Yes       | An array of one or more statements that define the permissions.                                                                                                                                                                       |
| statement.sid       | Yes       | An optional identifier for the statement.                                                                                                                                                                                             |
| statement.effect    | Yes       | Specifies whether the action is allowed or denied.                                                                                                                                                                                    |
| statement.action    | Partially | Only bucket-level or object-level actions [supported by Tigris](https://www.tigrisdata.com/docs/api/s3/) are allowed. You can use exact action names (e.g., `s3:PutBucket`), wildcards (`*`), or wildcard suffixes (e.g., `s3:Put*`). |
| statement.resource  | Yes       | Specifies the Amazon Resource Name (ARN) of the resource to which the policy applies. You can use exact ARNs, wildcards (`*`), or wildcard suffixes (e.g., `arn:aws:s3:::my-bucket/images/*`).                                        |
| statement.condition | Partially | Tigris supports `IpAddress`, `NotIpAddress`, `DateEquals`, `DateNotEquals`, `DateGreaterThan`, `DateGreaterThanEquals`, `DateLessThan` and `DateLessThanEquals` conditions.                                                           |

Note that for date-time conditions - only supported variable is
`aws:CurrentTime` which represents the current time when server is processing
the request.

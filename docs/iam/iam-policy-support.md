# Tigris IAM Policy Support

An IAM (Identity and Access Management) policy is a set of rules that define
permissions, specifying what actions can be performed on specific resources
optionally with some conditions. IAM policy is very broad and in context of
Tigris we support the following blocks:

| Block               | Supported | Description                                                                                                                                                                                 |
| ------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Version             | Yes       | Specifies the version of the policy language. The supported version is `2012-10-17`                                                                                                         |
| Id                  | Yes       | An optional identifier of the policy.                                                                                                                                                       |
| Statement           | Yes       | An array of one or more statements that define the permissions.                                                                                                                             |
| statement.sid_block | Yes       | An optional identifier for the statement.                                                                                                                                                   |
| statement.effect    | Yes       | Specifies whether the action is allowed or denied.                                                                                                                                          |
| statement.action    | Yes       | Specifies the action that is allowed. Note that here Tigris supports format `s3:MethodName`, For example: `s3:PutBucket`. Tigris supports wildcard (`*`) and prefixes (eg: `s3:Put*`) here. |
| statement.resource  | Yes       | Specifies the Amazon Resource Name (ARN) of the resource to which the policy applies. Tigris supports wildcard (`*`) and prefixes for object (eg: `arn:aws:s3:::my-bucket/images/*`).       |
| statement.condition | Partially | Tigris supports `IpAddress`, `NotIpAddress`, `DateEquals`, `DateNotEquals`, `DateGreaterThan`, `DateGreaterThanEquals`, `DateLessThan`, `DateLessThanEquals` condition.                     |

Note that for date-time conditions - only supported variable is
`aws:CurrentTime` which represents the current time when server is processing
the request.

# Overview

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

## Use cases

Below are some common IAM operations you can perform:

- [Create an Access Key](/docs/iam/create-access-key/index.mdx)
- [Attach an IAM Policy](/docs/iam/policies/attach-iam-policy.md)
- [Detach an IAM Policy](/docs/iam/policies/detach-iam-policy.md)
- [Limit Access Key Read and Write Permissions](/docs/iam/policies/limited-access-key.md)
- [IP Restrictions](/docs/iam/policies/ip-restrictions.md)
- [Date and Time Restrictions](/docs/iam/policies/date-time-restrictions.md)

You can also refer to the following resources for more information:

- [IAM Policy Support](/docs/iam/policies/index.md)

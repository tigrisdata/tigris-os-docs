# Detaching IAM Policy

Assuming you have already created an IAM policy by following the steps in the
[guide](/docs/iam/policies/attach-iam-policy.md) and attached it to an access
key, you can detach the policy from the access key as follows:

```bash
aws --profile=tigris iam --endpoint-url=https://iam.storage.dev detach-user-policy --policy-arn <generated_policy_arn_from_previous_step> --user-name <tid_>
```

This command detaches the IAM policy from the access key, removing the
permissions specified in the policy. Make sure to replace
`<generated_policy_arn_from_previous_step>` with the ARN of the policy you
created in the previous step and `<tid_>` with the access key ID you created in
the first step.

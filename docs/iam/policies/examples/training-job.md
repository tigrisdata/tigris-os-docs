# Limiting Access for a Training Job

This guide shows how to create a secure, time-bound IAM policy for a model
training job. The policy grants fine-grained access to specific buckets used
during training—ensuring isolation between jobs and minimizing potential impact
in case of a credential leak.

---

## Use Case

This example demonstrates how to:

- Grant **read-only access** to a specific training dataset.
- Grant **read-only access** to a shared base model collection.
- Grant **write-only access** to a destination bucket for finetuned models.
- Restrict access to a **specific time window** and/or **IP address**, ensuring
  the job can only run under controlled conditions.

If the access key is compromised, the blast radius is minimal:

- Only one dataset and the base model collection are readable (but not
  writable).
- The only write target is the dedicated finetuned model bucket.
- Other datasets and model jobs remain protected.

---

## Example Policy: Dataset Read, Model Output Write, Time + IP Restricted

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "WikipediaReadOnly",
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:ListBucket"],
      "Resource": [
        "arn:aws:s3:::contoso-training-datasets-wikipedia-2025-07-01",
        "arn:aws:s3:::contoso-training-datasets-wikipedia-2025-07-01/*"
      ]
    },
    {
      "Sid": "BaseModelsReadOnly",
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:ListBucket"],
      "Resource": [
        "arn:aws:s3:::contoso-base-models",
        "arn:aws:s3:::contoso-base-models/*"
      ]
    },
    {
      "Sid": "FinetunedModelsWrite",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:ListBucket",
        "s3:PutObject",
        "s3:PutObjectAcl",
        "s3:CreateMultipartUpload",
        "s3:AbortMultipartUpload",
        "s3:ListMultipartUploadParts",
        "s3:CompleteMultipartUpload"
      ],
      "Resource": [
        "arn:aws:s3:::contoso-finetuned-models",
        "arn:aws:s3:::contoso-finetuned-models/*"
      ],
      "Condition": {
        "DateGreaterThan": {
          "aws:CurrentTime": "2025-07-16T01:00:00Z"
        },
        "DateLessThan": {
          "aws:CurrentTime": "2025-07-16T04:00:00Z"
        },
        "IpAddress": {
          "aws:SourceIp": "203.0.113.42/32"
        }
      }
    }
  ]
}
```

This policy allows the training job to:

- Read input data and models
- Write its finetuned results
- Only during a 3-hour window
- Only from a specific machine or IP block

---

## Explanation

| Field         | Description                                                               |
| ------------- | ------------------------------------------------------------------------- |
| `Action`      | Read-only for datasets, write-only for output bucket.                     |
| `Resource`    | Limits access to only the buckets involved in this specific training job. |
| `Condition`   | Applies both a time window and IP address restriction.                    |
| `Time Format` | ISO 8601 in UTC (e.g., `2025-07-16T01:00:00Z`).                           |
| `IpAddress`   | Limits access to your job runner, GPU node, or secure NAT address.        |

---

## ✅ Next Steps

- **Rotate the key** once the job is complete.
- **Use a scheduler** to dynamically apply time- and IP-based conditions per
  job.

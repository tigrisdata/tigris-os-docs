# Creating a Limited Access Key

This guide shows how to create access keys with scoped permissions—ideal for
read/write automation jobs, cleanup scripts, or data ingestion workflows. These
policies follow the principle of least privilege to help protect your storage
while enabling specific tasks.

---

## Use Cases

You can use limited access keys in situations such as:

- **Scoped automation**: Scripts that read from one folder and write to another.
- **Expiry-based cleanup**: Tools that scan and delete old files on a schedule.
- **Data ingestion**: Upload pipelines that can push data but not access it
  afterward.

---

## Example 1: Read/Write Automation with Scoped Paths

This policy grants a job full read and write access, but only within the
`automation/` folder of a bucket:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AutomationScopedAccess",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::my-bucket",
        "arn:aws:s3:::my-bucket/automation/*"
      ],
      "Condition": {
        "StringLike": {
          "s3:prefix": "automation/*"
        }
      }
    }
  ]
}
```

---

## Example 2: Expiry-Based Cleanup Job

This policy allows a script to list and delete objects in `temp-data/`, but only
before **December 31, 2025**:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "TempCleanupAccess",
      "Effect": "Allow",
      "Action": ["s3:ListBucket", "s3:DeleteObject"],
      "Resource": [
        "arn:aws:s3:::my-bucket",
        "arn:aws:s3:::my-bucket/temp-data/*"
      ],
      "Condition": {
        "StringLike": {
          "s3:prefix": "temp-data/*"
        },
        "DateLessThan": {
          "aws:CurrentTime": "2025-12-31T23:59:59Z"
        }
      }
    }
  ]
}
```

---

## Example 3: Ingestion-Only Client

This policy lets a client upload files to the `incoming/` folder but prevents it
from listing or reading anything—even its own uploads.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "IngestionWriteOnly",
      "Effect": "Allow",
      "Action": ["s3:PutObject"],
      "Resource": ["arn:aws:s3:::my-bucket/incoming/*"]
    }
  ]
}
```

---

## Explanation

| Field       | Description                                                                  |
| ----------- | ---------------------------------------------------------------------------- |
| `Action`    | Defines allowed operations (`GetObject`, `PutObject`, `DeleteObject`, etc.). |
| `Resource`  | Restricts scope to a specific folder or prefix.                              |
| `Condition` | Adds optional rules, such as a `prefix`, `CurrentTime`, or `IpAddress`.      |

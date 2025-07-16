# Enforcing Date-Time Restrictions

This guide shows how to restrict access to a bucket during specific time windows
using IAM policy conditions with `aws:CurrentTime`.

---

## Use Cases

You can use date-time restrictions to enforce time-bound access to your storage.
Common examples include:

- **Temporary user onboarding** — grant short-term access for new team members
  or contractors.
- **Nightly backup windows** — allow automation scripts to run only during
  approved hours.
- **Time-limited trials** — restrict access to a dataset or model to a defined
  date range.
- **Scheduled maintenance** — limit read/write operations during designated
  timeframes.

---

## Example Policy: Access Only on a Specific Day

The following policy allows `s3:GetObject` and `s3:ListBucket` access to the
`images` bucket, but **only on January 14, 2025**.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DateTimeRestrictedAccess",
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:ListBucket"],
      "Resource": ["arn:aws:s3:::images", "arn:aws:s3:::images/*"],
      "Condition": {
        "DateGreaterThan": {
          "aws:CurrentTime": "2025-01-14T00:00:00Z"
        },
        "DateLessThan": {
          "aws:CurrentTime": "2025-01-14T23:59:59Z"
        }
      }
    }
  ]
}
```

---

## Example Policy: Nightly Backup Window

This variation allows access **only between 1:00am and 3:00am UTC every day**.
You'll need to rotate or dynamically update the policy each day, or use an
external scheduler to attach/detach access.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "NightlyBackupAccess",
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:GetObject", "s3:ListBucket"],
      "Resource": ["arn:aws:s3:::backups", "arn:aws:s3:::backups/*"],
      "Condition": {
        "DateGreaterThan": {
          "aws:CurrentTime": "2025-07-15T01:00:00Z"
        },
        "DateLessThan": {
          "aws:CurrentTime": "2025-07-15T03:00:00Z"
        }
      }
    }
  ]
}
```

To apply this daily, update the date values programmatically via your CI/CD
pipeline or other scheduler.

---

## Explanation

| Field         | Description                                                     |
| ------------- | --------------------------------------------------------------- |
| `Action`      | Defines allowed operations (e.g. read, write, list).            |
| `Resource`    | Applies to both the bucket and its contents.                    |
| `Condition`   | Uses `aws:CurrentTime` to define the valid access window.       |
| `Time Format` | Must be in ISO 8601 format, UTC (e.g., `2025-01-14T00:00:00Z`). |

---

## Supported Date-Time Conditions

Tigris supports the following operators for time-based access control:

- `DateGreaterThan`
- `DateGreaterThanEquals`
- `DateLessThan`
- `DateLessThanEquals`
- `DateEquals`
- `DateNotEquals`

These work with the `aws:CurrentTime` key to enforce precise scheduling logic.

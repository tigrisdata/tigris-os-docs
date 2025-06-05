# Enforcing Date Time Restrictions

Here, we will show you how to restrict a specific access key to access your
bucket within a certain time window.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DateTimeRestrictionExample1",
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:ListObjectsV1", "s3:ListObjectsV2"],
      "Resource": ["arn:aws:s3:::images/*"],
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

Note that here the only supported variable is `aws:CurrentTime` which represents
the current time when server is processing the request.

In this IAM policy, there are two conditions specified:

- the first condition allows listing and reading objects from the `images`
  bucket after `2025-01-14T00:00:00Z`.
- the second condition allows listing and reading objects from the `images`
  bucket before `2025-01-14T23:59:59Z`. Simply, the bucket is made accessible on
  `2025-01-14` only.

Similar to `DateGreaterThan` here are the date-time conditions which are
supported by Tigris:

- `DateGreaterThan`
- `DateGreaterThanEquals`
- `DateLessThan`
- `DateLessThanEquals`
- `DateEquals`
- `DateNotEquals`

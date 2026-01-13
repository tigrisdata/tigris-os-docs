# Enforcing IP Restrictions

This guide shows you how to restrict access to a bucket using IAM policies that
only allow access from specific IP addresses or IP ranges.

## Use Case

Grant read-only access to an S3 bucket—but only from trusted IPs such as a
corporate VPN or known static address.

## Example Policy

The following policy allows listing and reading from the `images` bucket only if
the request comes from the IP address `1.2.3.4` or the CIDR block
`203.0.113.0/24`.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "IpRestrictedReads1",
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:ListBucket"],
      "Resource": ["arn:aws:s3:::images", "arn:aws:s3:::images/*"],
      "Condition": {
        "IpAddress": {
          "aws:SourceIp": "1.2.3.4"
        }
      }
    },
    {
      "Sid": "IpRestrictedReads2",
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:ListBucket"],
      "Resource": ["arn:aws:s3:::images", "arn:aws:s3:::images/*"],
      "Condition": {
        "IpAddress": {
          "aws:SourceIp": "203.0.113.0/24"
        }
      }
    }
  ]
}
```

## Explanation

| Field       | Description                                                                         |
| ----------- | ----------------------------------------------------------------------------------- |
| `Action`    | Grants `s3:GetObject` (for reading objects) and `s3:ListBucket` (for listing keys). |
| `Resource`  | Targets both the bucket and the objects within it.                                  |
| `Condition` | Restricts access to the specified IPs using `IpAddress`.                            |

To deny access from all other IPs, you can use `NotIpAddress` instead.

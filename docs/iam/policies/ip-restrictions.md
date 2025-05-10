# Enforcing IP restrictions

Here we will show you how to restrict a particular access key to access your
bucket from specific IP addresses

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "IpRestrictedReads1",
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:ListObjectsV1", "s3:ListObjectsV2"],
      "Resource": ["arn:aws:s3:::images/*"],
      "Condition": { "IpAddress": { "aws:SourceIp": "1.2.3.4" } }
    },
    {
      "Sid": "IpRestrictedReads2",
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:ListObjectsV1", "s3:ListObjectsV2"],
      "Resource": ["arn:aws:s3:::images/*"],
      "Condition": { "IpAddress": { "aws:SourceIp": "203.0.113.0/24" } }
    }
  ]
}
```

This policy contains two statements

- first statement allows listing and reading objects from the `images` bucket
  from the IP address `1.2.3.4`
- second statement allows listing and reading objects from the `images` bucket
  from the CIDR IP range `201.0.113.0/24`.

Similar to `IpAddress`, you can also use `NotIpAddress` to restrict access from
all IP addresses except the ones specified.

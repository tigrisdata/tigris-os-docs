# Bucket Naming Rules

In Tigris, buckets are global, each requiring a unique name. In addition, there
are specific rules that must be followed when creating a bucket. Let's review
these rules below.

## Rules

The following naming rules apply for buckets.

- Bucket name must be between [3, 63] characters
- Bucket name can only contain lower case characters, numbers, dots, and
  hyphens.

  :::info

  Using a dot (.) will disable virtual-hosted style access (e.g.,
  `https://foo.bucket.fly.storage.tigris.dev`) for a bucket. However, you can
  still access it through a correctly configured
  [custom domain](/docs/buckets/custom-domain.mdx).

  :::

- Bucket names must not contain two adjacent periods
- Name must start with number or lower case character
- Name must end with number or lower case character
- Prefix `xn--` is reserved and not allowed in bucket prefix
- Suffix `-s3alias` is reserved and not allowed in bucket suffix
- Bucket name cannot be IP addresses

## Example bucket names

The following bucket names show examples of which characters are allowed in
bucket names: `a-z, 0-9, dots (.), and hyphens (-)`.

```
tigris-demo-bucket1-a1b2c3d4-5678-90ab-cdef-example11111
tigris-demo-bucket
example.com
www.example.com
my.example.tigris.bucket
```

The following example bucket names are not valid:

```
tigris_demo_bucket (contains underscores)
TigrisDemoBucket (contains uppercase letters)
tigris-demo-bucket- (ends with a hyphen)
example..com (contains two periods in a row)
192.168.5.4 (matches format of an IP address)
xn--examplebucket (starts with reserved prefix)
examplebucket-s3alias (ends with reserved suffix)
```

# Pricing FAQs

Common questions about Tigris pricing and billing.

## General

### Do I need a payment method to get started?

Yes. A payment method is required to create an account. You won't be charged
beyond the [free tier](/docs/pricing/) unless your usage exceeds the included
allowances.

### How does billing work?

Tigris bills monthly based on usage. You are charged for storage, API requests,
and data retrieval beyond the free tier. There are no subscription fees or
minimum commitments.

### Are there any egress fees?

No. Tigris does not charge for data transfer — regional, inter-region, or to the
internet.

## Storage

### What is the difference between storage tiers?

- **Standard** — general-purpose storage for frequently accessed data.
- **Infrequent Access** — lower storage cost for data accessed less often, with
  a per-GB retrieval fee and 30-day minimum retention.
- **Archive** and **Archive Instant Retrieval** — lowest storage cost for
  long-term data. Archive Instant Retrieval has a higher retrieval fee but
  provides immediate access. Both have 90-day minimum retention.

### What happens if I delete an object before the minimum retention period?

You are billed for the full minimum retention period. For example, deleting an
Infrequent Access object after 10 days still incurs charges for the remaining 20
days.

### How is storage for multi-region buckets billed?

Multi-region buckets have higher per-GB storage rates and higher Class A request
rates than global or single-region buckets. See
[multi-region pricing](/docs/pricing/#multi-region-pricing) for details.

### How is data storage calculated over a month?

Storage costs are calculated using GB/month. A GB/month is determined by
averaging the daily peak storage over a billing period (1 month). For example,
storing 10 GB for 12 days in June, and then 20 GB for the remaining 18 days will
be charged as 16 GB/month (10 GB × 12/30 + 20 GB × 18/30 = 16 GB/month).

## API requests

### What are Class A and Class B requests?

**Class A** requests modify state: `CreateBucket`, `CreateMultipartUpload`,
`CopyObject`, `ListObjects`, `ListObjectsV2`, `ListMultipartUploads`,
`ListBuckets`, `ListParts`, `PutBucketCors`, `PutBucketLifecycleConfiguration`,
`PutObjectTagging`, `PutObjectAcl`, `PutObjectRetention`, `PutObjectLegalHold`,
`PutObjectLockConfiguration`, `PutBucketAcl`, `PutBucketPolicy`,
`PutBucketTagging`, `PutBucketAccelerateConfiguration`,
`PutBucketOwnershipControls`, `PutObject`.

**Class B** requests are reads: `GetBucketAccelerateConfiguration`,
`GetBucketAcl`, `GetBucketCors`, `GetBucketLifecycleConfiguration`,
`GetBucketLocation`, `GetBucketOwnershipControls`, `GetBucketPolicy`,
`GetBucketPolicyStatus`, `GetBucketRequestPayment`, `GetBucketTagging`,
`GetBucketVersioning`, `GetObject`, `GetObjectAcl`, `GetObjectTagging`,
`HeadBucket`, `HeadObject`.

`DELETE` and `CANCEL` operations are free.

### Do you charge for unauthorized access?

No. You will not be charged for the following error responses: 301 Moved
Permanently, 307 Temporary Redirect, 400 Bad Request, 403 Forbidden, 405 Method
Not Allowed, 409 Conflict, 411 Length Required, 412 Precondition Failed, 416
Requested Range Not Satisfiable, 304 Not Modified, 500 Internal Server Error,
and 501 Not Implemented.

### Do requests within the free tier count toward billing?

No. The first 10,000 Class A and 100,000 Class B requests each month are free.
You are only billed for requests beyond those limits.

## Billing details

### What happens if I receive unexpected traffic?

We are happy to discuss a refund if you experience unexpected traffic due to an
attack that results in a surprisingly large bill. Reach out to us at
help@tigrisdata.com.

### What is the minimum storage retention charge?

A minimum storage retention charge applies to objects stored in the Infrequent
Access, Archive, and Archive Instant Retrieval tiers. For example, objects in
the Infrequent Access tier are subject to a minimum storage duration of 30 days.
If objects are deleted, updated, or transitioned to another storage tier before
30 days, a 30-day storage charge still applies. Objects stored for 30 days or
longer are charged only for the actual number of days stored.

### How am I charged when restoring data from archive tier?

When you restore data from the Archive tier, the data is moved to the Standard
tier for the duration you specify. You are charged for Standard tier storage for
the duration of the restoration. Once the restoration period is over, the data
is moved back to the Archive tier.

### How is data transfer (egress) different from data retrieval?

Data retrieval applies only to Infrequent Access and Archive Instant Retrieval
tiers. On AWS S3, when you GET an object stored in Infrequent Access you pay
both data retrieval and data transfer (egress) fees. With Tigris, you only pay
the data retrieval fee — there is no charge for data transfer (egress). In the
Archive tier, AWS S3 charges for data retrievals as part of the archive restore
process. Tigris has no retrieval charge when you restore data from Archive tier
and data transfer (egress) is always free.

### What is an event and how are events charged?

An event refers to a notification sent to a webhook for changes to objects in a
bucket. Each webhook request can contain multiple events that occurred within a
short time frame. Tigris charges for each individual event, not per webhook
request.

## Enterprise

### When should I consider enterprise pricing?

If you have large-scale storage needs, require custom SLAs, or need dedicated
support, [contact us](mailto:help@tigrisdata.com) to discuss enterprise options.

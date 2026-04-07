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

At the same per-GB rate as single-region buckets. Data is cached and distributed
based on access patterns with no additional replication fees.

## API requests

### What are Class A and Class B requests?

**Class A** requests modify state — uploads, copies, listings, and multipart
operations (`PUT`, `POST`, `LIST`, `CreateMultipartUpload`,
`CompleteMultipartUpload`, `UploadPart`, `UploadPartCopy`, `CopyObject`).

**Class B** requests are reads — `GET`, `HEAD`, `GetObjectAttributes`.

`DELETE` and `CANCEL` operations are free.

### Do requests within the free tier count toward billing?

No. The first 10,000 Class A and 100,000 Class B requests each month are free.
You are only billed for requests beyond those limits.

## Enterprise

### When should I consider enterprise pricing?

If you have large-scale storage needs, require custom SLAs, or need dedicated
support, [contact us](https://www.tigrisdata.com/contact/) to discuss enterprise
options.

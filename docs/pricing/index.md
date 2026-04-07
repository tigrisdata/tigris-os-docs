---
sidebar_label: Overview
---

# Pricing

Tigris uses simple, usage-based pricing with no egress fees. You pay only for
what you use — no minimum commitments, no hidden charges.

## Free tier

Every account includes a generous free tier each month:

| Resource         | Free allowance  |
| ---------------- | --------------- |
| Standard storage | 5 GB / month    |
| Class A requests | 10,000 / month  |
| Class B requests | 100,000 / month |

## Storage

| Tier                      | Price       | Minimum retention |
| ------------------------- | ----------- | ----------------- |
| Standard                  | $0.02 / GB  | None              |
| Infrequent Access         | $0.01 / GB  | 30 days           |
| Archive                   | $0.004 / GB | 90 days           |
| Archive Instant Retrieval | $0.004 / GB | 90 days           |

All storage prices are per GB per month.

## Data retrieval

| Tier                      | Price      |
| ------------------------- | ---------- |
| Standard                  | Free       |
| Infrequent Access         | $0.01 / GB |
| Archive                   | Free       |
| Archive Instant Retrieval | $0.03 / GB |

## API requests

| Operation type   | Price             |
| ---------------- | ----------------- |
| Class A requests | $0.005 per 1,000  |
| Class B requests | $0.0005 per 1,000 |
| DELETE, CANCEL   | Free              |

**Class A** requests are operations that modify state: `PUT`, `POST`, `LIST`,
`CreateMultipartUpload`, `CompleteMultipartUpload`, `UploadPart`,
`UploadPartCopy`, `CopyObject`.

**Class B** requests are read operations: `GET`, `HEAD`, `GetObjectAttributes`.

## Data transfer

Tigris charges zero egress fees. No charges for:

- Regional transfers
- Inter-region transfers
- Internet egress

## Object notifications

| Resource            | Price           |
| ------------------- | --------------- |
| Event notifications | $0.01 per 1,000 |

## Multi-region buckets

Storage in multi-region buckets is billed at the same per-GB rate as
single-region buckets. Data is cached and distributed automatically based on
access patterns — there are no additional replication fees.

## Enterprise

For larger workloads or custom requirements,
[contact us](https://www.tigrisdata.com/contact/) for enterprise pricing.

## A note on units

Tigris measures storage in gibibytes (GiB, base-2), where 1 GiB = 2^30 bytes.
Throughout our documentation and billing we refer to this as "GB" for
simplicity, consistent with how other cloud storage providers label their
pricing.

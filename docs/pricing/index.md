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

## Location types

- **Global** — data distributed globally, follows access patterns. Pay once — no
  per-region charges.
- **Single-region** — data redundancy across availability zones in one region.
  Lowest storage price.
- **Multi-region** — two or more copies across regions in your chosen geography
  (USA or EUR). Strong consistency globally.
- **Dual-region** — data residency across specific regions of your choice.
  Billed per underlying region.

## Global / single-region pricing

|                        | Standard     | Infrequent Access | Archive      | Archive Instant Retrieval |
| ---------------------- | ------------ | ----------------- | ------------ | ------------------------- |
| Data Storage           | $0.02 / GB   | $0.01 / GB        | $0.004 / GB  | $0.004 / GB               |
| Class A Requests       | $0.005 / 1K  | $0.005 / 1K       | $0.005 / 1K  | $0.005 / 1K               |
| Class B Requests       | $0.0005 / 1K | $0.0005 / 1K      | $0.0005 / 1K | $0.0005 / 1K              |
| DELETE, CANCEL         | Free         | Free              | Free         | Free                      |
| Data Retrieval         | Free         | $0.01 / GB        | Free         | $0.03 / GB                |
| Min. Storage Retention | N/A          | 30 days           | 90 days      | 90 days                   |
| Object Notifications   | $0.01 / 1K   | $0.01 / 1K        | $0.01 / 1K   | $0.01 / 1K                |
| Egress                 | Free         | Free              | Free         | Free                      |

All storage prices are per GB per month.

## Multi-region pricing

|                        | Standard     | Infrequent Access | Archive      | Archive Instant Retrieval |
| ---------------------- | ------------ | ----------------- | ------------ | ------------------------- |
| Data Storage           | $0.025 / GB  | $0.015 / GB       | $0.006 / GB  | $0.006 / GB               |
| Class A Requests       | $0.01 / 1K   | $0.01 / 1K        | $0.01 / 1K   | $0.01 / 1K                |
| Class B Requests       | $0.0005 / 1K | $0.0005 / 1K      | $0.0005 / 1K | $0.0005 / 1K              |
| DELETE, CANCEL         | Free         | Free              | Free         | Free                      |
| Data Retrieval         | Free         | $0.01 / GB        | Free         | $0.03 / GB                |
| Min. Storage Retention | N/A          | 30 days           | 90 days      | 90 days                   |
| Object Notifications   | $0.01 / 1K   | $0.01 / 1K        | $0.01 / 1K   | $0.01 / 1K                |
| Egress                 | Free         | Free              | Free         | Free                      |

## Dual-region pricing

Dual-region pricing is billed per underlying region. The more regions you
replicate to, the higher the cost.

|                              | Per Region   | Example: 2 Regions | Example: 3 Regions |
| ---------------------------- | ------------ | ------------------ | ------------------ |
| Standard Storage             | $0.02 / GB   | $0.04 / GB         | $0.06 / GB         |
| Infrequent Access Storage    | $0.01 / GB   | $0.02 / GB         | $0.03 / GB         |
| Archive Storage              | $0.004 / GB  | $0.008 / GB        | $0.012 / GB        |
| Archive Instant Retrieval    | $0.004 / GB  | $0.008 / GB        | $0.012 / GB        |
| Class A Requests             | $0.005 / 1K  | $0.01 / 1K         | $0.015 / 1K        |
| Class B Requests             | $0.0005 / 1K | $0.0005 / 1K       | $0.0005 / 1K       |
| DELETE, CANCEL               | Free         | Free               | Free               |
| Data Retrieval               | Free         | Free               | Free               |
| Min. Storage Retention (IA)  | 30 days      | 30 days            | 30 days            |
| Min. Storage Retention (Arc) | 90 days      | 90 days            | 90 days            |
| Object Notifications         | $0.01 / 1K   | $0.01 / 1K         | $0.01 / 1K         |
| Egress                       | Free         | Free               | Free               |

## Data transfer

Tigris charges zero egress fees. No charges for:

- Regional transfers
- Inter-region transfers
- Internet egress

## Request types

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

## Enterprise

For larger workloads or custom requirements,
[contact us](mailto:help@tigrisdata.com) for enterprise pricing.

## A note on units

Tigris measures storage in gibibytes (GiB, base-2), where 1 GiB = 2^30 bytes.
Throughout our documentation and billing we refer to this as "GB" for
simplicity, consistent with how other cloud storage providers label their
pricing.

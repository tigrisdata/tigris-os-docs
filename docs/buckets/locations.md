# Bucket Locations

## Overview

A bucket's location defines how and where your object data is stored. You choose
a location type when you create a bucket, and it determines the **data
placement**, **replication behavior**, **availability**, and **consistency
model** for all objects in that bucket.

Tigris supports four bucket location types:

| Location Type                   | Description                                               |
| ------------------------------- | --------------------------------------------------------- |
| [Global](#global)               | Data distributed globally (default)                       |
| [Multi-region](#multi-region)   | Highest availability across regions in a chosen geography |
| [Dual-region](#dual-region)     | High availability across specific regions of your choice  |
| [Single-region](#single-region) | Data redundancy across availability zones in one region   |

## Location Types

### Global

Global is the default location type and is unique to Tigris. Data is distributed
globally and automatically stored closest to the request origin. As access
patterns change, data migrates to where it's most frequently needed.

| Property           | Detail                                                                             |
| ------------------ | ---------------------------------------------------------------------------------- |
| **Data Placement** | Single copy, distributed globally based on access patterns                         |
| **Availability**   | Data follows your users — accessible from any region                               |
| **Consistency**    | Strong consistency for requests in the same region. Eventual consistency globally. |
| **Replication**    | Metadata pushed to all regions. Data pulled on demand and cached locally.          |

**How it works:**

1. When you upload an object, it is stored in the region nearest to the upload
   origin.
2. Metadata is replicated to all Tigris regions.
3. When the object is accessed from a different region, a local copy is created
   in that region automatically.
4. Over time, data migrates to regions where it's accessed most frequently.

**Best for:** Global applications with distributed users, media delivery, and
any use case where you want zero-configuration global performance.

:::info

Global is the default location type. If you create a bucket without specifying a
location type, it will be Global.

:::

### Multi-Region

Multi-region provides the highest availability by maintaining two or more copies
of your data across regions within a chosen geography. You select the geography
(USA or EUR) when creating the bucket — Tigris automatically selects the regions
within that geography where data is stored.

| Property           | Detail                                                               |
| ------------------ | -------------------------------------------------------------------- |
| **Data Placement** | Data residency across 2+ regions in the chosen geography             |
| **Availability**   | Highest — survives individual regional failures within the geography |
| **Consistency**    | Strong consistency globally                                          |
| **Replication**    | Data is replicated across regions within the geography               |

**Supported geographies:**

| Geography | Candidate Regions                                  |
| --------- | -------------------------------------------------- |
| USA       | `sjc` (San Jose), `ord` (Chicago), `iad` (Ashburn) |
| EUR       | `ams` (Amsterdam), `fra` (Frankfurt)               |

**Best for:** Mission-critical data requiring the highest availability,
enterprise workloads where regional failures cannot cause downtime, and
applications that need strong consistency globally with geographic redundancy.

### Dual-Region

Dual-region provides high availability by maintaining data residency across
specific regions of your choice. Unlike multi-region, you have explicit control
over exactly which regions store your data.

| Property           | Detail                                                                             |
| ------------------ | ---------------------------------------------------------------------------------- |
| **Data Placement** | Data residency across your chosen regions                                          |
| **Availability**   | High — survives single region failure                                              |
| **Consistency**    | Strong consistency for requests in the same region. Eventual consistency globally. |
| **Replication**    | Data is replicated between the chosen regions                                      |

**Region pairing:** You can pair any two Tigris regions. Common examples:

| Use Case                          | Region Pair   |
| --------------------------------- | ------------- |
| EU data residency with redundancy | `fra` + `ams` |
| EU with UK coverage               | `lhr` + `fra` |
| US East-West redundancy           | `iad` + `sjc` |
| US with low-latency failover      | `iad` + `ord` |
| Cross-continent (Americas + Asia) | `sjc` + `sin` |

**Best for:** Compliance or policy requirements that mandate data residency in
specific regions. If your primary goal is geographic redundancy without a strict
two-region constraint, consider [multi-region](#multi-region) for higher
availability, stronger consistency, and better cost-effectiveness.

### Single-Region

Single-region stores your data with redundancy across availability zones within
a single region. This gives you full control over data residency while
maintaining durability within the region.

| Property           | Detail                                            |
| ------------------ | ------------------------------------------------- |
| **Data Placement** | Redundant across availability zones in one region |
| **Availability**   | Standard — single region availability             |
| **Consistency**    | Strong consistency globally                       |
| **Replication**    | Redundancy within the region's availability zones |

You can find the list of available regions in the
[Regions Reference](/docs/concepts/regions.md).

**Best for:** Strict data residency and sovereignty requirements, cost
optimization for region-local workloads, and applications where compute and
storage are co-located in the same region.

## Choosing a Location Type

### Decision Guide

| Your requirement                                            | Recommended location type |
| ----------------------------------------------------------- | ------------------------- |
| Global users, lowest latency everywhere, zero configuration | **Global**                |
| Highest availability, strong consistency globally           | **Multi-region**          |
| Geographic redundancy at the best price                     | **Multi-region**          |
| Mission-critical, cannot tolerate regional outages          | **Multi-region**          |
| Strict data residency in a single geography                 | **Single-region**         |
| Compliance requiring data in specific regions               | **Dual-region**           |

:::info

For most workloads that need geographic redundancy, we recommend
**multi-region** over dual-region. Multi-region provides higher availability,
strong global consistency, and is typically more cost-effective. Choose
dual-region only when compliance or policy requires data in specific regions.

:::

### Consistency Model Summary

| Location Type     | Same-region requests | Cross-region requests |
| ----------------- | -------------------- | --------------------- |
| **Global**        | Strong consistency   | Eventual consistency  |
| **Multi-region**  | Strong consistency   | Strong consistency    |
| **Dual-region**   | Strong consistency   | Eventual consistency  |
| **Single-region** | Strong consistency   | Strong consistency    |

### Availability Comparison

| Location Type     | Failure tolerance                           |
| ----------------- | ------------------------------------------- |
| **Multi-region**  | Survives regional failures within geography |
| **Dual-region**   | Survives failure of one of the regions      |
| **Global**        | Data accessible from any surviving region   |
| **Single-region** | Availability zone redundancy within region  |

## Considerations

### Performance

- For the lowest latency with zero configuration, use **Global**. Data
  automatically moves to where it's accessed most.
- If your workload is concentrated in one geography, **Multi-region** gives you
  both performance and the highest availability.
- If compute and storage are co-located, **Single-region** eliminates
  cross-region latency entirely.

### Global Bucket Trade-offs

Global buckets move data to the regions where users request it. This gives low
latency for distributed access patterns. The same model has two trade-offs for
workloads that operate from one region. A single-region bucket removes each of
them because all operations resolve in one region.

- **Negative lookups**: A GET or HEAD request for a key that does not exist
  causes an existence check across regions. This check can add several hundred
  milliseconds to the response. Workloads that poll for keys that do not exist
  pay this cost on each request. A single-region bucket resolves negative
  lookups within its one region.
- **Conditional writes**: Global buckets give strong consistency in the same
  region and eventual consistency across regions. When clients in more than one
  region send conditional writes to the same object, a precondition can evaluate
  against a stale state. See
  [Consistency and Conditional Operations](/docs/objects/conditionals/#consistency-and-conditional-operations).
  A single-region bucket evaluates every precondition against the latest state,
  independent of the region of each writer. The latency of a conditional write
  then stays within the region. A multi-region bucket also gives strong global
  consistency for conditional writes.

### Multi-Region Bucket Trade-offs

Multi-region buckets replicate data across two or more regions in a chosen
geography. This gives strong global consistency and the highest availability.
The same model has three trade-offs.

- **Write latency**: Tigris replicates the metadata of each write synchronously
  to more than one region before the write completes. Writes to a multi-region
  bucket therefore have higher latency than writes to a global or single-region
  bucket.
- **Storage cost**: The per-GB storage price is higher than the single-region
  price. You are billed once for the bucket, not once for each region. See
  [Cost](#cost).
- **Region selection**: You select the geography (USA or EUR). Tigris selects
  the regions within that geography. If your policy requires specific regions,
  use a [dual-region](#dual-region) bucket.

### Dual-Region Bucket Trade-offs

Dual-region buckets store your data in the two regions that you select.
Replication between the two regions is eager. This gives high availability and
explicit control over data placement. The same model has four trade-offs.

- **Storage cost**: Tigris bills the bucket at the single-region price for each
  of the two regions. The storage cost is about two times the cost of a
  single-region bucket. See [Cost](#cost).
- **Cross-region reads**: Replication between the two regions is eager but
  asynchronous. A read in one region can return stale data until replication
  from the other region completes. See the
  [Consistency Model Summary](#consistency-model-summary).
- **Negative lookups**: A GET or HEAD request for a key that does not exist
  causes an existence check in the bucket's other region. This check adds
  cross-region latency to the response.
- **Region count**: A dual-region bucket spans exactly two regions. If you need
  redundancy across more than two regions, use a [multi-region](#multi-region)
  bucket.

### Single-Region Bucket Trade-offs

Single-region buckets store all data in one region. This gives the lowest
storage cost, the strictest data residency, and strong consistency. The single
location has two trade-offs.

- **Remote access latency**: A client outside the bucket's region pays a full
  cross-region round trip on each request. The data does not move closer to
  remote clients.
- **Availability**: The bucket has redundancy across availability zones within
  its region only. There is no failover to another region. If the region is
  unavailable, the data is unavailable.

### Compliance and Data Residency

- **Single-region** gives you the strictest data residency — data never leaves
  the chosen region.
- **Dual-region** lets you maintain data residency across more than one region,
  useful for regulations that allow data within a defined set of jurisdictions
  (e.g., two EU regions for GDPR compliance).
- **Multi-region** constrains data to a geography (e.g., Europe), but Tigris
  selects the specific regions within it.
- **Global** distributes data based on access patterns — not suitable for strict
  data residency requirements.

### Cost

- **Single-region** has the lowest storage cost — one region, no cross-region
  replication.
- **Dual-region** is billed at the single-region price for **each** underlying
  region. For example, a dual-region bucket spanning `iad` and `ord` is billed
  for `iad` and for `ord` — effectively doubling your storage cost compared to a
  single-region bucket.
- **Multi-region** has a higher per-GB storage price than single-region, but you
  are billed once — not per underlying region. For most workloads requiring
  geographic redundancy, multi-region is **more cost-effective** than
  dual-region while also providing higher availability and strong global
  consistency.
- **Global** is cost-effective for globally accessed data because replication
  happens on demand rather than eagerly.

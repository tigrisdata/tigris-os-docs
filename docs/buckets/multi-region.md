# Bucket Location Types

Tigris offers four location types for your buckets, giving you control over how
and where your data is stored and replicated.

|                  | Multi-Region                                  | Dual Region                                      | Single Region                     | Global (Default)                                  |
| ---------------- | --------------------------------------------- | ------------------------------------------------ | --------------------------------- | ------------------------------------------------- |
| **Availability** | Highest availability among all location types | High availability with copies in known locations | Single copy in chosen region      | Data automatically placed close to users globally |
| **Consistency**  | Strong consistency globally                   | Strong in same region, eventual globally         | Strong consistency globally       | Strong in same region, eventual globally          |
| **Best for**     | Highest availability within a geo             | Data residency in specific regions               | Data residency in a single region | Low-latency access without managing regions       |

## Multi-Region

Multi-region keeps a minimum of two copies of your data within a chosen
geographic area (e.g., USA or EUR). Tigris determines where to store your data
across regions within the selected geo, taking into account factors like
geographical proximity. This dynamic placement allows Tigris to offer
multi-region storage with highest availability and strong consistency globally.

**Availability:**

- Data redundancy across multiple regions within the selected geo
- Highest availability among all location types

**Consistency:**

- Strong consistency globally

**Best for:**

- Workloads requiring the highest availability within a geo
- Applications that need strict consistency across regions
- Business-critical data that must survive regional outages

To configure, select a geo (e.g., `usa` or `eur`) on the bucket settings page
under the "Regions" section, or use the CLI:

```bash
tigris buckets create my-bucket --region usa
```

## Dual Region

Dual region lets you select specific regions and Tigris will maintain copies of
your data in each of those regions. Unlike multi-region where Tigris chooses the
regions, dual region gives you precise control over where your data is stored.

**Availability:**

- Data redundancy across your chosen regions
- High availability with copies in known locations

**Consistency:**

- Strong consistency for requests in same region
- Eventual consistency globally

**Best for:**

- Compliance requirements that mandate data residency in specific regions
- Workloads that need guaranteed local access in multiple known locations
- Disaster recovery with control over exact replica locations

To configure, specify multiple regions on the bucket settings page under the
"Regions" section, or use the CLI:

```bash
tigris buckets create my-bucket --region iad,sjc
```

## Single Region

Single region restricts your data to a single region of your choice.

**Availability:**

- Single copy of data in the selected region
- All requests are routed to the chosen region

**Consistency:**

- Strong consistency globally

**Best for:**

- Data residency compliance requiring data to stay in a specific jurisdiction
- Workloads co-located with compute in a single known region

Restricting your bucket to a single region may impact performance for users
located far from the selected region, as all requests must be routed to that
region.

To configure, select a single region on the bucket settings page, or use the
CLI:

```bash
tigris buckets create my-bucket --region sjc
```

## Global (Default)

By default, Tigris automatically and intelligently distributes your data close
to the users. A single copy of data is distributed globally, and Tigris handles
placement and caching to optimize performance.

**Availability:**

- Single copy of data distributed globally
- Data is automatically placed close to where it is accessed

**Consistency:**

- Strong consistency for requests in same region
- Eventual consistency globally

**Best for:**

- Most workloads where you want low-latency access without managing regions
- Applications with a globally distributed user base
- Getting started quickly without region planning

This is the default behavior when no region restriction is configured:

```bash
tigris buckets create my-bucket
```

## Pricing Consideration

The final thing to take into consideration is cost. Please consult the
[Pricing](https://www.tigrisdata.com/pricing/#multi-region-buckets) page for
more details on how the storage cost is calculated when multiple copies are
stored.

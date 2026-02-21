# Consistency

Tigris provides strong consistency guarantees for all object storage operations.
Every read returns the most recent successful write, there are no stale reads
within the consistency boundary defined by your bucket's
[location type](/docs/buckets/locations/).

## How Consistency Works

Data consistency depends on where replicas exist relative to the request origin:

- **Same-region requests**: All location types provide strong consistency. A
  read issued from the same region as the data will always return the latest
  write.
- **Cross-region requests**: The consistency guarantee depends on the location
  type.

### Consistency by Location Type

| Location Type     | Same-region | Cross-region | How it works                                                                                                     |
| ----------------- | ----------- | ------------ | ---------------------------------------------------------------------------------------------------------------- |
| **Global**        | Strong      | Eventual     | Cross-region reads may serve a cached or on-demand copy that is eventually consistent.                           |
| **Multi-region**  | Strong      | Strong       | Any region can serve a strongly consistent read.                                                                 |
| **Dual-region**   | Strong      | Eventual     | Reads from within same region as the data are strongly consistent. Reads from outside are eventually consistent. |
| **Single-region** | Strong      | Strong       | All requests, regardless of origin, are routed to one region, providing strong consistency globally.             |

## What Strong Consistency Means in Practice

When Tigris guarantees strong consistency for a request, the following holds:

- **Read-after-write**: A GET immediately after a PUT returns the new object.
- **Read-after-delete**: A GET immediately after a DELETE returns a 404.
- **Read-after-update**: A GET immediately after an overwrite returns the new
  version.
- **List-after-write**: A LIST immediately after a PUT includes the new object.
- **Conditional operations**: Compare-and-set (If-Match, If-None-Match) and
  other conditional operations always evaluate against the latest state.

When consistency is eventual (cross-region reads for Global and Dual-region
buckets), there is a brief window where a read may return a previous version of
the object. The replication lag is typically sub-second.

## Choosing a Location Type for Consistency

If your application requires strong consistency for every read regardless of
where the request originates, choose **Multi-region** or **Single-region**.

If your application can tolerate brief cross-region staleness in exchange for
lower latency or global data distribution, **Global** is a good choice.

For most workloads that need both geographic redundancy and strong global
consistency, we recommend **Multi-region**. It provides the highest
availability, and strong consistency globally.

For full details on all location types, including data placement, availability,
and consistency, see [Bucket Locations](/docs/buckets/locations/).

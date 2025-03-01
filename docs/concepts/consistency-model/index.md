# Consistency Model

Tigris is a globally distributed object storage service that ensures your data
is stored close to users, eliminating the complexities of data replication and
caching. Tigris offers strong consistency within the same region and eventual
consistency globally. This means that if you write data in, for example, the San
Jose region and read from the same region, the data will be strongly consistent.
However, if you read from a different region, such as Washington, there is a
possibility that the data may be stale, and an older version could be served.

## Strong Consistency by restricting to a region

In most cases, global eventual consistency is preferred for performance reasons.
However, there are situations where a single key can be modified from any
region, and strong consistency becomes the only viable option. Additionally,
some use cases may require strong consistency for all requests, while others may
only need it for a specific subset of requests. To address this, Tigris provides
strong consistency at the bucket level, and for scenarios where only certain
requests require it, you can enable strong consistency on a per-request basis.

- At the bucket level: By choosing a specific region for your bucket
  [here](https://www.tigrisdata.com/docs/buckets/settings/#region-restriction),
  all requests related to that bucket will be directed to that region, ensuring
  strong consistency.

- At the request level: If you prefer region-specific consistency for individual
  requests, use the `X-Tigris-Region` header and specify the region where you
  want to direct your requests as described
  [here](https://www.tigrisdata.com/docs/objects/object_regions/). For example,
  `X-Tigris-Region:fra` or `X-Tigris-Region:ord`

## Strong Consistency for Conditional Operations

The above paragraph illustrates how you can ensure consistency by restricting
your requests to a single region. CAS described
[here](/docs/objects/conditionals.md) follows a similar philosphy, but in this
case, Tigris automatically selects a region for you during conditional writes.
When you perform a read using the CAS header, Tigris automatically routes the
request to the region where the conditional write, thereby ensuring strong
consistency for conditional operations.

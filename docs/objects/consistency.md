# Consistency Model

Tigris is a globally distributed object storage service that ensures your data
is stored close to users, eliminating the complexities of data replication and
caching. Tigris offers strong consistency within the same region and eventual
consistency globally. This means that if you write data in, for example, the San
Jose region and read from the same region, the data will be strongly consistent.
However, if you read from a different region, such as Washington, there is a
possibility that the data may be stale, and an older version could be served.
This is the default consistency model.

## Strong Consistency

In most cases, global eventual consistency (default) is preferred for
performance reasons, as it allows for lower latency and better scalability
across regions. However, there are situations where a single object can be
modified from any region, making strong consistency the only viable option.
Additionally, some use cases may require strong consistency for all requests,
while others may only need it for a specific subset of requests. To address
this, Tigris provides strong consistency options at both the request level and
at the bucket level.

- At the bucket level: All operations for this bucket will be strongly
  consistent, meaning all requests go through a single leader and there will be
  no caching.

- At the request level: If you prefer consistency for individual requests, use
  the `X-Tigris-Consistent:true` header. This option is ideal if you only need
  certain requests to be strongly consistent, as marking the entire bucket for
  strong consistency can introduce higher latencies across all operations.
  Remember to include this header for every operation that requires strong
  consistency. For example, if a put operation for key 'a' needs strong
  consistency, set this header, and then also set it for any subsequent
  operations where you need read-your-write guarantees, such as later get or
  delete operations.

It's **important** to note, however, that choosing strong consistency may impact
performance at a global scale because strong consistency is achieved by serving
all operations through a single leader globally. This can result in higher
latency for users located far from the leader's region, as requests must be
routed to that leader. The default global setting is generally preferable for
optimal performance and lower latency, especially in a globally distributed
environment. While this introduces eventual consistency in some scenarios, the
benefits in performance and cost savings usually outweigh the tradeoffs.

## Selecting a leader region

Tigris does allow you the ability to control the region that takes ownership of
the leader. This is offered by combining the X-Tigris-Consistent:true header
with the region restriction header. This approach restricts the region for your
writes while also ensuring strong consistency. For example,
`-H "X-Tigris-Regions:ord" -H "X-Tigris-Consistent:true"`. More details about
the regions header are described
[here](https://www.tigrisdata.com/docs/objects/object_regions/). If you're using
this option then along with the `X-Tigris-Consistent` provide the
`X-Tigris-Regions` header for all operations that need strong consistency.

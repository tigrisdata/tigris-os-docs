# Consistency

By default, Tigris offers strict read-after-write consistency within the same
region and eventual consistency globally. However, there may be situations where
a single object can be modified from any region, making global strong
consistency the only viable option.

## Configuring Consistency

Tigris allows configuring consistency options at both the request level and at
the bucket level.

## Bucket Level Consistency

At the bucket level, you can set the consistency model for all operations within
that bucket. The default is strict read-after-write consistency within the same
region. But you can choose to set it to global strong consistency. This can be
done when creating the bucket or by updating the bucket settings later.

## Request Level Consistency

At the request level, you can enforce global strong consistency for specific
operations by using the `X-Tigris-Consistent:true` header. This is particularly
useful when only certain requests need to be globally strongly consistent, as
setting the entire bucket to strong consistency can increase latencies for all
operations.

To use this feature, include the `X-Tigris-Consistent:true` header in every
request that requires global strong consistency. For example, if you need a put
operation for key 'a' to be globally strongly consistent, add this header to the
request. Similarly, include the header in any subsequent operations, such as get
or delete requests, where you need read-your-write guarantees globally.

By using this header selectively, you can balance the need for strong
consistency with the performance benefits of eventual consistency for other
operations.

## Combining Consistency with Region Control

While Tigris provides global strong consistency option, it is important to note
that global strong consistency is achieved by routing all operations through a
single leader. This can lead to higher latencies for users located far from the
leader's region, as requests must be directed to that leader.

To mitigate this, you can combine consistency configuration with region
restriction. This can be done either by setting the `X-Tigris-Regions` header in
your requests or by specifying the region when creating the bucket. This allows
you to control which region serves as the leader for strong consistency,
ensuring that requests are routed to a region that is closer to your users,
thereby reducing latency.

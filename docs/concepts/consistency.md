# Consistency Model

Tigris is a globally distributed object storage service that ensures your data
is stored close to users, eliminating the complexities of data replication and
caching. The consistency model depends on your chosen
[bucket location type](/docs/buckets/multi-region.md).

## Consistency by Location Type

### Multi-Region

Strong consistency globally. All reads from any region return the latest version
of the data. Best for workloads where the highest availability and strict
consistency are required within a geographic area.

### Single Region

Strong consistency globally. Since all data resides in a single region, all
operations are routed there, providing strong consistency for every request.

### Dual Region

Strong consistency for requests in the same region, eventual consistency
globally. Writes in one region are immediately visible in that region but may
take a short time to propagate to the other selected region.

### Global (Default)

Strong consistency for requests in the same region, eventual consistency
globally. This means that if you write data in, for example, the San Jose region
and read from the same region, the data will be strongly consistent. However, if
you read from a different region, such as Washington, there is a possibility
that the data may be stale, and an older version could be served.

## Achieving Global Strong Consistency

If your workload requires global strong consistency — for example, when a single
object can be modified from any region — choose **Multi-Region** or **Single
Region** as your bucket location type. These location types provide strong
consistency globally by default, without any additional configuration.

See [Bucket Location Types](/docs/buckets/multi-region.md) for how to configure
your bucket.

## Performance Considerations

It is important to note that for **Single Region**, all reads and writes are
routed to the single chosen region. Users located far from that region will
experience higher latency.

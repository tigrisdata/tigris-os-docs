# Consistency

The consistency model in Tigris depends on your chosen
[bucket location type](/docs/buckets/multi-region.md). Different location types
provide different consistency guarantees:

| Location Type    | Consistency                              |
| ---------------- | ---------------------------------------- |
| Multi-Region     | Strong consistency globally              |
| Dual Region      | Strong in same region, eventual globally |
| Single Region    | Strong consistency globally              |
| Global (Default) | Strong in same region, eventual globally |

For location types with eventual consistency globally, if you write data in one
region and immediately read from a different region, there is a possibility that
an older version could be served. Within the same region, reads are always
strongly consistent.

See [Bucket Location Types](/docs/buckets/multi-region.md) for details on
configuring your bucket's location type.

:::caution[Deprecated Consistency Options]

The following consistency options are deprecated. They will continue to work for
existing configurations, but we recommend switching to the appropriate
[bucket location type](/docs/buckets/multi-region.md) instead.

| Option                               | Status           | Recommendation                                                                           |
| ------------------------------------ | ---------------- | ---------------------------------------------------------------------------------------- |
| Bucket-level `consistency` setting   | Deprecated       | Use a location type with built-in strong consistency (`Multi-Region` or `Single Region`) |
| `X-Tigris-Consistent` request header | Deprecating soon | Use a location type with built-in strong consistency (`Multi-Region` or `Single Region`) |

:::

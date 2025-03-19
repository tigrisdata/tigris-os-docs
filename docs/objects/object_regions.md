# Object Regions

By default, Tigris automatically and intelligently distributes your data close
to the users. However, there might be instances where you wish to manage data
locality to comply with legal regulations by limiting data access to specific
regions.

To achieve this, simply include the `X-Tigris-Regions` header in your PUT
requests. Tigris will then write data only to the regions specified in this
header, respecting your preferences and legal requirements.

This header may include a single or comma-separated list of multiple Tigris
regions mentioned [here](/docs/concepts/regions/index.md).

## Restricting to specific regions

The table below illustrates examples of how you can restrict data storage to
specific regions.

| Use-Case               | Header                 |
| ---------------------- | ---------------------- |
| Restrict to Washington | "X-Tigris-Regions:iad" |
| Restrict to San Jose   | "X-Tigris-Regions:sjc" |
| Restrict to Frankfurt  | "X-Tigris-Regions:fra" |
| Restrict to Singapore  | "X-Tigris-Regions:sin" |

Restricting your bucket data to a single region ensures that all requests to
that bucket are directed there.

Following example showing that it is also possible to apply restriction to a
broader geographical regions. When a broader geo is use like "eur" or "usa" then
Tigris picks a region for the user in that geo and serve the requests from that
region.

| Use-Case           | Header                 |
| ------------------ | ---------------------- |
| Restrict to Europe | "X-Tigris-Regions:eur" |
| Restrict to USA    | "X-Tigris-Regions:usa" |

## Multiple copies of data

You can also store multiple copies of your data in different regions by
specifying multiple regions in the `X-Tigris-Regions` header. This can be useful
in scenarios where you want to ensure data is always present in specific
regions.

The table below illustrates examples of how you can achieve this.

| Use-Case                                  | Header                         |
| ----------------------------------------- | ------------------------------ |
| Multiple copies in specific regions in EU | "X-Tigris-Regions:fra,lhr"     |
| Multiple copies in specific regions in US | "X-Tigris-Regions:sjc,iad"     |
| Multiple Copies Globally                  | "X-Tigris-Regions:sjc,fra,sin" |

Multiple copies may be useful in scenarios where you want to ensure data is
always present in specific regions. However, we think the most performant and
cost-effective approach is to let Tigris manage the data distribution for you.

Restricting your bucket data to multiple regions means that requests are
directed to one of the specified region depending on the region of the user
making the request.

:::note

Please consult the [pricing](/docs/pricing/index.md) page for more details on
how the storage cost is calculated when multiple copies are stored.

:::

## Next steps

- Check out the [Example usage](/docs/sdks/s3/aws-go-sdk.mdx#object-regions) for
  more details on how to configure object regions in your application.

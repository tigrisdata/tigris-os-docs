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

| Use-Case              | Header                 |
| --------------------- | ---------------------- |
| Restrict to Europe    | "X-Tigris-Regions:eur" |
| Restrict to USA       | "X-Tigris-Regions:usa" |
| Restrict to Singapore | "X-Tigris-Regions:sin" |

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

:::note

Please consult the [pricing](/docs/pricing/index.md) page for more details on
how the storage cost is calculated when multiple copies are stored.

:::

## Next steps

- Check out the [Example usage](/docs/sdks/s3/aws-go-sdk.mdx#object-regions) for
  more details on how to configure object regions in your application.

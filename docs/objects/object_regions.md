# Object Regions

By default, Tigris automatically and intelligently distributes your data close
to the users. However, there might be instances where you wish to manage data
locality, either to enhance access speed or to comply with legal regulations by
limiting data access to specific regions.

To achieve this, simply include the `X-Tigris-Regions` header in your PUT
requests. Tigris will then write data only to the regions specified in this
header, respecting your preferences and legal requirements.

:::note

The list of regions is available [here](/docs/concepts/regions/index.md).

:::

## Tigris Region Header

This header may include a single or comma-separated list of multiple Tigris
regions mentioned [here](/docs/concepts/regions/index.md).

The table below illustrates examples of how you can manage data regions for
different use cases.

| Use-Case                            | Header                                           |
| ----------------------------------- | ------------------------------------------------ |
| Restrict to Europe                  | "X-Tigris-Regions:fra" OR "X-Tigris-Regions:lhr" |
| Restrict to Europe(multiple copies) | "X-Tigris-Regions:fra,lhr"                       |
| Restrict to USA                     | "X-Tigris-Regions:sjc" OR "X-Tigris-Regions:iad" |
| Restrict to USA(multiple copies)    | "X-Tigris-Regions:sjc,iad"                       |
| Multiple Copies Globally            | "X-Tigris-Regions:sjc,fra,sin"                   |

Global copies may be intended to boost access speed by dispersing copies across
different regions spanning various countries or continents and you want copies
to always available.

:::note

When Tigris stores multiple copies of data, the storage cost is calculated as
the number of copies multiplied by the storage size. By default, this count is
one. However, if you control the distibution of data and specify for example,
two regions in the request header, the count will be considered as two.

:::

## Next steps

- Check out the [Example usage](/docs/sdks/s3/aws-go-sdk.md#object-regions) for
  more details on how to use them in your application.

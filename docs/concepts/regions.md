# Regions

Tigris is deployed globally across multiple regions. All regions are accessible
through a single endpoint — `t3.storage.dev` — which handles routing
automatically. You never need to specify a region in your SDK or CLI
configuration; set the region to `auto` and Tigris takes care of the rest.

## Bucket Locations

A bucket's location type controls how your data is distributed across regions.
You choose a location type when you create a bucket, and it determines data
placement, consistency, and availability.

| Location Type        | Description                                               | Regions Used                                         |
| -------------------- | --------------------------------------------------------- | ---------------------------------------------------- |
| **Global** (default) | Data distributed globally, follows access patterns        | All regions — data moves to where it's accessed most |
| **Multi-region**     | Two or more copies across regions in a chosen geography.  | Automatically selected within the geography          |
| **Dual-region**      | Data residency across two specific regions of your choice | Your chosen regions                                  |
| **Single-region**    | Data redundancy across availability zones in one region   | One region                                           |

For full details on each location type — including consistency models,
availability guarantees, and cost — see
[Bucket Locations](/docs/buckets/locations/).

## Available Regions

### t3.storage.dev

| Geography    | Code  | Location               |
| ------------ | ----- | ---------------------- |
| USA          | `sjc` | San Jose, California   |
| USA          | `ord` | Chicago, Illinois      |
| USA          | `iad` | Ashburn, Virginia      |
| EUR          | `ams` | Amsterdam, Netherlands |
| EUR          | `fra` | Frankfurt, Germany     |
| EUR          | `lhr` | London, United Kingdom |
| Asia-Pacific | `sin` | Singapore              |
| Asia-Pacific | `nrt` | Tokyo, Japan           |

### fly.storage.tigris.dev

| Geography     | Code  | Location                   |
| ------------- | ----- | -------------------------- |
| USA           | `sjc` | San Jose, California       |
| USA           | `ord` | Chicago, Illinois          |
| USA           | `iad` | Ashburn, Virginia          |
| EUR           | `ams` | Amsterdam, Netherlands     |
| EUR           | `fra` | Frankfurt, Germany         |
| EUR           | `lhr` | London, United Kingdom     |
| Asia-Pacific  | `sin` | Singapore                  |
| Asia-Pacific  | `nrt` | Tokyo, Japan               |
| Asia-Pacific  | `syd` | Sydney, Australia          |
| South America | `gru` | São Paulo, Brazil          |
| Africa        | `jnb` | Johannesburg, South Africa |

:::note

If you need a region that isn't listed, contact us at
[help@tigrisdata.com](mailto:help@tigrisdata.com) to discuss your requirements.

:::

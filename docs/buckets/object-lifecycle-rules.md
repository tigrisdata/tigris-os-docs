# Object Lifecycle Rules

As your data storage needs evolve, you may want to optimize costs by moving less
frequently accessed objects to more cost-effective storage tiers. Tigris
provides object lifecycle rules to automatically move objects between storage
tiers. For example, you might want to move older log files or archived data to
a lower-cost storage tier while keeping frequently accessed data in the
standard tier. This helps to maintain optimal performance for active data while
reducing storage costs for infrequently accessed objects.

## Configuring Object Lifecycle Rules

With Object Lifecycle rules, you can configure when and how your objects
transition between storage tiers. Rules are configured at the bucket level and
each rule can target the entire bucket or a subset of objects scoped by a key
prefix.

A bucket can have up to **10 lifecycle rules**, which can be a mix of
transition and expiration rules scoped to different prefixes. See
[Object Expiration](/docs/buckets/objects-expiration/) for the expiration form
of these rules.

The transition timing can be set in two ways:

- **Days**: The objects will be transitioned after the specified number of
  days.
- **Date**: The objects will be transitioned on the specified date.

Tigris currently supports transitioning an object from **STANDARD** to one of
these three storage tiers:

1. **STANDARD_IA**: Infrequent Access storage is designed for data that is
   accessed less frequently, but requires rapid access when needed. This tier
   offers lower storage costs compared to standard storage while maintaining
   high durability and availability. Ideal for backup data, older logs, or
   infrequently accessed files.

2. **GLACIER**: Glacier storage is designed for long-term archival data that is
   rarely accessed. This tier provides the lowest storage costs but has higher
   retrieval times. Perfect for data that you need to retain for compliance or
   archival purposes but rarely need to access, such as old backups, historical
   records, or completed projects.

3. **GLACIER_IA**: Glacier Infrequent Access storage is designed for data that
   requires immediate access but is accessed very infrequently. This tier
   offers a balance between cost and retrieval time - it's more expensive than
   GLACIER but provides faster access times. Ideal for data that needs to be
   available quickly when requested, such as monthly reports, quarterly
   analytics, or seasonal data that might be needed on short notice.

### Specifying Object Lifecycle rules via the Tigris Dashboard

You can specify lifecycle transition rules for your bucket using the
[Tigris Dashboard](https://console.storage.dev/).

Here's a short video that demonstrates how to specify Object Lifecycle rule for
a bucket:

<a href="https://www.loom.com/share/cb502607f86c443b835575681922f01c">
  <img src="https://cdn.loom.com/sessions/thumbnails/cb502607f86c443b835575681922f01c-7a7b4d8fdc70c5ed-full-play.gif"/>
</a>

### Specifying Object Lifecycle rules via the AWS CLI

You can configure Object Lifecycle rules for objects in the bucket using the
AWS CLI. Below are some examples.

#### Transition objects after 30 days

Here's an example of an Object Lifecycle configuration that transitions all
objects in the bucket after 30 days.

Create a JSON file named `lifecycle.json` with the following content:

```json
{
  "Rules": [
    {
      "ID": "transition-ia",
      "Status": "Enabled",
      "Filter": {},
      "Transitions": [
        {
          "Days": 30,
          "StorageClass": "STANDARD_IA"
        }
      ]
    }
  ]
}
```

Then, run the following command to apply the lifecycle configuration to the
bucket:

```bash
aws s3api put-bucket-lifecycle-configuration --bucket my-bucket --lifecycle-configuration file://lifecycle.json
```

#### Transition objects at the end of the year 2025

Here's an example of an Object lifecycle configuration that transitions objects
at the end of the year 2026.

Create a JSON file named `lifecycle.json` with the following content:

```json
{
  "Rules": [
    {
      "ID": "archive-eoy",
      "Status": "Enabled",
      "Filter": {},
      "Transitions": [
        {
          "Date": "2025-12-31T00:00:00Z",
          "StorageClass": "GLACIER"
        }
      ]
    }
  ]
}
```

Then, run the following command to apply the lifecycle configuration to the
bucket:

```bash
aws s3api put-bucket-lifecycle-configuration --bucket my-bucket --lifecycle-configuration file://lifecycle.json
```

#### Multiple rules with prefix filters

Each rule can be scoped to a key prefix using `Filter.Prefix`. The example
below moves objects under `logs/` to `STANDARD_IA` after 30 days, archives
objects under `archive/` to `GLACIER` after 90 days, and leaves the rest of
the bucket on `STANDARD`.

```json
{
  "Rules": [
    {
      "ID": "logs-to-ia",
      "Status": "Enabled",
      "Filter": { "Prefix": "logs/" },
      "Transitions": [
        {
          "Days": 30,
          "StorageClass": "STANDARD_IA"
        }
      ]
    },
    {
      "ID": "archive-to-glacier",
      "Status": "Enabled",
      "Filter": { "Prefix": "archive/" },
      "Transitions": [
        {
          "Days": 90,
          "StorageClass": "GLACIER"
        }
      ]
    }
  ]
}
```

## Things to note

- A bucket can have at most 10 lifecycle rules. The 10-rule limit is shared
  across transition and expiration rules.
- Each rule may include an `ID` (up to 36 characters). If you omit `ID`, Tigris
  generates one.
- Use `Filter.Prefix` on a rule to scope it to a subset of objects. Omit
  `Filter` (or pass an empty object `{}`) to apply the rule to every object in
  the bucket.
- Each rule can include at most one transition.
- Tigris always rounds the transition time to UTC midnight for the scheduled
  date.
- When using the AWS CLI to apply an Object Lifecycle configuration, the JSON
  can only contain the fields shown in the examples above.

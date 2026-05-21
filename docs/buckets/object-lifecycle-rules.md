# Object Lifecycle Rules

As your data storage needs evolve, you may want to optimize costs by moving less
frequently accessed objects to more cost-effective storage tiers. Tigris
provides object lifecycle rules to automatically move objects between storage
tiers. For example, you might want to move older log files or archived data to a
lower-cost storage tier while keeping frequently accessed data in the standard
tier. This helps to maintain optimal performance for active data while reducing
storage costs for infrequently accessed objects.

## Configuring Object Lifecycle Rules

With Object Lifecycle rules, you can configure when and how your objects
transition between [storage tiers](/docs/objects/tiers/). Rules are configured
at the bucket level and each rule can target the entire bucket or a subset of
objects scoped by a key prefix.

A bucket can have up to **10 lifecycle rules**, which can be a mix of transition
and expiration rules scoped to different prefixes. A single rule can include
**one transition and one expiration**, so you can move objects to a colder tier
and later delete them with the same rule. See
[Object Expiration](/docs/buckets/objects-expiration/) for the expiration form
of these rules.

The transition timing can be set in two ways:

- **Days**: The objects will be transitioned after the specified number of days.
- **Date**: The objects will be transitioned on the specified date.

Tigris currently supports transitioning an object from **STANDARD** to one of
these three storage tiers (see [Storage Tiers](/docs/objects/tiers/) for the
full description of each):

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

3. **GLACIER_IR**: Archive Instant Retrieval storage offers archive-tier pricing
   while still serving GET requests directly, with no restore step. It's more
   expensive than `GLACIER` but cheaper than `STANDARD_IA` for cold-but-still-
   readable data. Ideal for backups, compliance archives, or historical datasets
   that are queried rarely but must respond immediately when they are.

:::note Restore required for GLACIER

Objects in the `GLACIER` storage class return a `403 InvalidObjectState` error
on GET until you initiate a restore. See
[Restoring objects from Archive tier](/docs/objects/tiers/#restoring-objects-from-archive-tier).
`GLACIER_IR` does not require restore.

:::

### Specifying Object Lifecycle rules via the Tigris Dashboard

You can specify lifecycle transition rules for your bucket using the
[Tigris Dashboard](https://console.storage.dev/).

Here's a short video that demonstrates how to specify Object Lifecycle rule for
a bucket:

<a href="https://www.loom.com/share/cb502607f86c443b835575681922f01c">
  <img src="https://cdn.loom.com/sessions/thumbnails/cb502607f86c443b835575681922f01c-7a7b4d8fdc70c5ed-full-play.gif"/>
</a>

### Specifying Object Lifecycle rules via the AWS CLI

You can configure Object Lifecycle rules for objects in the bucket using the AWS
CLI. Below are some examples.

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

#### Transition objects at the end of the year

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
          "Date": "2026-12-31T00:00:00Z",
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

Each rule can be scoped to a key prefix using `Filter.Prefix`. The example below
moves objects under `logs/` to `STANDARD_IA` after 30 days, archives objects
under `archive/` to `GLACIER` after 90 days, and leaves the rest of the bucket
on `STANDARD`.

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

#### Combining a transition and an expiration in one rule

A single rule may carry **one transition and one expiration**. The example below
moves objects under `logs/` to `STANDARD_IA` after 30 days and deletes them
after 540 days, expressed in one rule. See
[Object Expiration](/docs/buckets/objects-expiration/) for more on the
expiration side.

```json
{
  "Rules": [
    {
      "ID": "logs-tiered-retention",
      "Status": "Enabled",
      "Filter": { "Prefix": "logs/" },
      "Transitions": [
        {
          "Days": 30,
          "StorageClass": "STANDARD_IA"
        }
      ],
      "Expiration": {
        "Days": 540
      }
    }
  ]
}
```

To chain multiple transitions (for example, `STANDARD → STANDARD_IA → GLACIER`),
use one rule per transition.

#### Inspect the current configuration

```bash
aws s3api get-bucket-lifecycle-configuration --bucket my-bucket
```

Returns the current set of rules. If no configuration is set, AWS returns a
`NoSuchLifecycleConfiguration` error — this is expected on a bucket that has
never had rules applied.

#### Remove all rules

```bash
aws s3api delete-bucket-lifecycle --bucket my-bucket
```

To remove a single rule rather than all of them, fetch the current config with
`get-bucket-lifecycle-configuration`, edit the JSON to drop the rule you don't
want, and re-apply with `put-bucket-lifecycle-configuration`.

### Specifying rules via the Tigris CLI

For the common case of a single transition or expiration on a bucket, the
[Tigris CLI](/docs/cli/) is a one-line shortcut:

```bash
# Move objects to Infrequent Access after 30 days
tigris buckets lifecycle create my-bucket --storage-class STANDARD_IA --days 30

# List existing rules (use the id to edit or remove a rule)
tigris buckets lifecycle list my-bucket
```

See [`tigris buckets lifecycle`](/docs/cli/buckets/lifecycle/). For multi-rule
or prefix-filtered configurations, use the AWS CLI with a `lifecycle.json` file
as shown above.

## How rules are evaluated

Each rule runs on its own worker, walking the bucket oldest-first. If two rules
match the same object, whichever worker reaches it first does the work — there
is no preferred ordering between rules with overlapping prefixes.

Transitions are one-way toward colder tiers. Once an object lands in `GLACIER`,
no rule can pull it back to `STANDARD_IA` or `STANDARD`. When two transitions
race on the same object, the one that fires first wins; the other has nothing to
do by the time it arrives.

After you apply a new configuration, expect the first action within a few
minutes, or up to fifteen to twenty minutes if the scheduler just finished a
sweep. There is no backfill flag — rules apply on the next scan, oldest-first.

## Things to note

- A bucket can have at most 10 lifecycle rules. The 10-rule limit is shared
  across transition and expiration rules.
- Each rule may include an `ID` (up to 36 characters). If you omit `ID`, Tigris
  generates one.
- `Status` accepts `Enabled` or `Disabled`. A `Disabled` rule stays in the
  configuration but does not execute — useful for pausing a rule without losing
  the definition.
- Use `Filter.Prefix` on a rule to scope it to a subset of objects. Omit
  `Filter` (or pass an empty object `{}`) to apply the rule to every object in
  the bucket.
- Each rule can include **at most one transition and at most one expiration**.
  Chain multiple transitions by writing one rule per transition.
- Transitions are one-way to a colder tier. Once an object lands in `GLACIER`,
  no rule can pull it back to `STANDARD_IA` or `STANDARD`.
- Tigris always rounds the transition time to UTC midnight for the scheduled
  date.
- When using the AWS CLI to apply an Object Lifecycle configuration, the JSON
  can only contain the fields shown in the examples above.

## Related

- [Object Expiration](/docs/buckets/objects-expiration/) — the expiration form
  of lifecycle rules.
- [Storage Tiers](/docs/objects/tiers/) — details on `STANDARD`, `STANDARD_IA`,
  `GLACIER`, and `GLACIER_IR`, plus how to restore objects from `GLACIER`.
- [Create a bucket](/docs/buckets/create-bucket/) — set a default tier at bucket
  creation time.
- [`tigris buckets lifecycle`](/docs/cli/buckets/lifecycle/) — Tigris CLI
  shortcut for single-rule configurations.

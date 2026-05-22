# Object Expiration

If you use Tigris to store objects that have a limited lifetime, you can set up
bucket lifecycle configuration rules to automatically delete them after a
specified period.

## Configuring object expiration

Tigris allows you to set up expiration configuration for objects in a bucket
through bucket lifecycle rules. The expiration is based on the last modified
time of the object.

A bucket can have up to **10 lifecycle rules**, which can be a mix of expiration
and transition rules scoped to different prefixes. A single rule can include
**one transition and one expiration**, so the same rule can move an object to a
colder [storage tier](/docs/objects/tiers/) and later delete it. See
[Object Lifecycle Rules](/docs/buckets/object-lifecycle-rules/) for the
transition form of these rules and an example of combining the two.

The expiration can be set in two ways:

- **Days**: The objects will be deleted after the specified number of days.
- **Date**: The objects will be deleted on the specified date.

### Specifying expiration rules via the Tigris Dashboard

You can specify expiration rules for your bucket using the
[Tigris Dashboard](https://console.storage.dev/).

Here's a short video that demonstrates how to specify expiration rules for a
bucket:

<a href="https://www.loom.com/share/efaee9e7df504f428126ee9eee72c9f8" target="_blank">
  <img src="https://cdn.loom.com/sessions/thumbnails/efaee9e7df504f428126ee9eee72c9f8-fa18cf817af7197e-full-play.gif" />
</a>

### Specifying expiration rules via the AWS CLI

You can configure expiration rules for objects in the bucket using the AWS CLI.
Below are some examples.

#### Expire objects after 30 days

Here's an example of a bucket lifecycle configuration that expires every object
in the bucket after 30 days.

Create a JSON file named `lifecycle.json` with the following content:

```json
{
  "Rules": [
    {
      "ID": "expire-30d",
      "Status": "Enabled",
      "Filter": {},
      "Expiration": {
        "Days": 30
      }
    }
  ]
}
```

Then, run the following command to apply the lifecycle configuration to the
bucket:

```bash
aws s3api put-bucket-lifecycle-configuration --bucket my-bucket --lifecycle-configuration file://lifecycle.json
```

#### Expire objects at the end of the year

Here's an example of a bucket lifecycle configuration that expires objects at
the end of the year 2026.

Create a JSON file named `lifecycle.json` with the following content:

```json
{
  "Rules": [
    {
      "ID": "expire-eoy",
      "Status": "Enabled",
      "Filter": {},
      "Expiration": {
        "Date": "2026-12-31T00:00:00Z"
      }
    }
  ]
}
```

Then, run the following command to apply the lifecycle configuration to the
bucket:

```bash
aws s3api put-bucket-lifecycle-configuration --bucket my-bucket --lifecycle-configuration file://lifecycle.json
```

#### Different expirations per prefix

Each rule can be scoped to a key prefix using `Filter.Prefix`, so different
parts of a bucket can have different expirations. The example below deletes
objects under `tmp/` after 1 day and objects under `logs/` after 30 days, while
leaving everything else untouched.

```json
{
  "Rules": [
    {
      "ID": "expire-tmp",
      "Status": "Enabled",
      "Filter": { "Prefix": "tmp/" },
      "Expiration": {
        "Days": 1
      }
    },
    {
      "ID": "expire-logs",
      "Status": "Enabled",
      "Filter": { "Prefix": "logs/" },
      "Expiration": {
        "Days": 30
      }
    }
  ]
}
```

#### Inspect or remove the current configuration

```bash
# Show the current set of rules
aws s3api get-bucket-lifecycle-configuration --bucket my-bucket

# Remove all rules (transition and expiration alike)
aws s3api delete-bucket-lifecycle --bucket my-bucket
```

`get-bucket-lifecycle-configuration` returns `NoSuchLifecycleConfiguration` on a
bucket that has never had rules applied — this is expected.

### Specifying expiration via the Tigris CLI

For a single expiration on a whole bucket, the [Tigris CLI](/docs/cli/) is a
one-line shortcut:

```bash
# Expire every object 30 days after it was last modified
tigris buckets lifecycle create my-bucket --expire-days 30

# List existing rules (use the id to edit or remove a rule)
tigris buckets lifecycle list my-bucket
```

See [`tigris buckets lifecycle`](/docs/cli/buckets/lifecycle/). For
prefix-scoped or multi-rule expirations, use the AWS CLI with a `lifecycle.json`
file as shown above.

## How rules are evaluated

Each rule runs on its own worker, walking the bucket oldest-first. If two rules
match the same object, whichever worker reaches it first does the work. When a
transition and an expiration fire on the same object at roughly the same moment,
the timestamp of each metadata update settles the outcome.

After you apply a new configuration, expect the first deletions within a few
minutes, or up to fifteen to twenty minutes if the scheduler just finished a
sweep. There is no backfill flag — rules apply on the next scan, oldest-first.

## Things to note

- A bucket can have at most 10 lifecycle rules. The 10-rule limit is shared
  across expiration and transition rules.
- Each rule may include an `ID` (up to 36 characters). If you omit `ID`, Tigris
  generates one.
- `Status` accepts `Enabled` or `Disabled`. A `Disabled` rule stays in the
  configuration but does not execute — useful for pausing a rule without losing
  the definition.
- Use `Filter.Prefix` on a rule to scope it to a subset of objects. Omit
  `Filter` (or pass an empty object `{}`) to apply the rule to every object in
  the bucket.
- Each rule can include **at most one expiration and at most one transition**,
  so the same rule can move an object to a colder tier and later delete it.
- Tigris always rounds the expiration time to UTC midnight for the scheduled
  date.
- The expiration time is based on the last modified time of the object.
- When using the AWS CLI to apply a bucket lifecycle configuration, the JSON can
  only contain the fields shown in the examples above.

## Related

- [Object Lifecycle Rules](/docs/buckets/object-lifecycle-rules/) — transition
  rules, including how to combine a transition and an expiration in one rule.
- [Storage Tiers](/docs/objects/tiers/) — the storage tiers expiration rules
  apply to.
- [Create a bucket](/docs/buckets/create-bucket/) — bucket-level defaults.
- [`tigris buckets lifecycle`](/docs/cli/buckets/lifecycle/) — Tigris CLI
  shortcut for single-rule expiration.

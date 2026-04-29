# Object Expiration

If you use Tigris to store objects that have a limited lifetime, you can set
up bucket lifecycle configuration rules to automatically delete them after a
specified period.

## Configuring object expiration

Tigris allows you to set up expiration configuration for objects in a bucket
through bucket lifecycle rules. The expiration is based on the last modified
time of the object.

A bucket can have up to **10 lifecycle rules**, which can be a mix of
expiration and transition rules scoped to different prefixes. See
[Object Lifecycle Rules](/docs/buckets/object-lifecycle-rules/) for the
transition form of these rules.

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

You can configure expiration rules for objects in the bucket using the AWS
CLI. Below are some examples.

#### Expire objects after 30 days

Here's an example of a bucket lifecycle configuration that expires every
object in the bucket after 30 days.

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

#### Expire objects at the end of the year 2025

Here's an example of a bucket lifecycle configuration that expires objects at
the end of the year 2025.

Create a JSON file named `lifecycle.json` with the following content:

```json
{
  "Rules": [
    {
      "ID": "expire-eoy",
      "Status": "Enabled",
      "Filter": {},
      "Expiration": {
        "Date": "2025-12-31T00:00:00Z"
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
objects under `tmp/` after 1 day and objects under `logs/` after 30 days,
while leaving everything else untouched.

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

## Things to note

- A bucket can have at most 10 lifecycle rules. The 10-rule limit is shared
  across expiration and transition rules.
- Each rule may include an `ID` (up to 36 characters). If you omit `ID`, Tigris
  generates one.
- Use `Filter.Prefix` on a rule to scope it to a subset of objects. Omit
  `Filter` (or pass an empty object `{}`) to apply the rule to every object in
  the bucket.
- Tigris always rounds the expiration time to UTC midnight for the scheduled
  date.
- The expiration time is based on the last modified time of the object.
- When using the AWS CLI to apply a bucket lifecycle configuration, the JSON
  can only contain the fields shown in the examples above.

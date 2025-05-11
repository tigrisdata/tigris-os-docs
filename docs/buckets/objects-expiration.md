# Object Expiration

If you use Tigris to store objects that have a limited lifetime, you can now set
up bucket lifecycle configuration rules to automatically delete them after a
specified period.

## Configuring object expiration

Tigris allows you to set up a expiration configuration for objects in a bucket
through bucket lifecycle rules.

The TTL can be set in two ways:

- **Days**: The objects will be deleted after the specified number of days.
- **Date**: The objects will be deleted on the specified date.

### Specifying expiration rules via the Tigris Dashboard

You can specify expiration rules for your bucket using the
[Tigris Dashboard](https://console.tigris.dev/).

Here's a short video that demonstrates how to specify expiration rules for a
bucket:

<a href="https://www.loom.com/share/efaee9e7df504f428126ee9eee72c9f8" target="_blank">
  <img src="https://cdn.loom.com/sessions/thumbnails/efaee9e7df504f428126ee9eee72c9f8-fa18cf817af7197e-full-play.gif" />
</a>

### Specifying expiration rules via the AWS CLI

You can configure expiration rules for objects in the bucket using AWS the CLI.
Below are some examples of how you can configure the expiration rules.

#### Expire objects after 30 days

Here's an example of a bucket lifecycle configuration that expires objects after
30 days.

Create a JSON file named `lifecycle.json` with the following content:

```json
{
  "Rules": [
    {
      "Status": "Enabled",
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
      "Status": "Enabled",
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

## Things to note

- Tigris always rounds the TTL deletion time to UTC midnight for the scheduled
  date.
- Only one object expiration rule can be applied to a bucket at a time.
- When using the AWS CLI to apply a bucket lifecycle configuration, the JSON can
  only contain the fields shown in the examples above.

# Object Lifecycle Transitions

As your data storage needs evolve, you may want to optimize costs by moving less
frequently accessed objects to more cost-effective storage tiers. Tigris
provides a lifecycle transition rule will automatically move objects between
storage classes based on the transition rule. For example, you might want to
move older log files or archived data to a lower-cost storage tier while keeping
frequently accessed data in the standard tier. This helps to maintain optimal
performance for active data while reducing storage costs for infrequently
accessed objects.

## Configuring object lifecycle transitions

Tigris allows you to set up lifecycle transition configuration for objects in a
bucket through bucket lifecycle rules.

The transition timing can be set in two ways:

- **Days**: The objects will be transitioned after the specified number of days.
- **Date**: The objects will be transitioned on the specified date.

Tigris currently supports two storage tiers:

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

### Specifying lifecycle transition rules via the Tigris Dashboard

You can specify lifecycle transition rules for your bucket using the
[Tigris Dashboard](https://console.tigris.dev/).

Here's a short video that demonstrates how to specify lifecycle transition rules
for a bucket:

<a href="https://www.loom.com/share/efaee9e7df504f428126ee9eee72c9f8" target="_blank">
  <img src="https://cdn.loom.com/sessions/thumbnails/efaee9e7df504f428126ee9eee72c9f8-fa18cf817af7197e-full-play.gif" />
</a>

### Specifying lifecycle transition rules via the AWS CLI

You can configure lifecycle transition rules for objects in the bucket using AWS
the CLI. Below are some examples of how you can configure the lifecycle
transition rules.

#### Transition objects after 30 days

Here's an example of a bucket lifecycle configuration that transitions objects
after 30 days.

Create a JSON file named `lifecycle.json` with the following content:

```json
{
  "Rules": [
    {
      "Status": "Enabled",
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

#### Transition objects at the end of the year 2024

Here's an example of a bucket lifecycle configuration that transitions objects
at the end of the year 2024.

Create a JSON file named `lifecycle.json` with the following content:

```json
{
  "Rules": [
    {
      "Status": "Enabled",
      "Transitions": [
        {
          "Date": "2024-12-31T00:00:00Z",
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

## Things to note

- Tigris always rounds the transition time to UTC midnight for the scheduled
  date.
- Only one object lifecycle transition rule can be applied to a bucket at a
  time.
- When using the AWS CLI to apply a bucket lifecycle configuration, the JSON can
  only contain the fields shown in the examples above.

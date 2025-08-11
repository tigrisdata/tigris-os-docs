# Object Notifications

Tigris object notifications allow you to receive notifications via a webhook.
These events allow you to keep track of when objects are created, updated, or
deleted for a specific bucket.

## Enable Object Notifications via Tigris Dashboard

To enable object notifications, you need to set up a webhook in the Tigris
Dashboard. This can be done in `Settings` for the bucket.

Here's a short video demonstration on enabling object notifications:

<a href="https://www.loom.com/share/37e407ecb5b64cada3aa418e3a2c1df6" target="_blank">
  <img src="https://cdn.loom.com/sessions/thumbnails/37e407ecb5b64cada3aa418e3a2c1df6-f9556cf7889fc886-full-play.gif" />
</a>

## Webhook

Object notifications are delivered via a webhook, and obey the following rules:

- Tigris will make an HTTP POST request to the webhook URL with the event
  payload.
- A `200` status code acknowledges the request was successful.
- If a `200` status is not received, Tigris will retry for a maximum of 3 times
  before giving up and marking the notifications as sent.
- If a webhook request takes longer than 10 seconds the request will be aborted
  and retried.

## Webhook Authentication

Tigris supports basic authentication and token authentication for webhooks. When
configuring the webhook in the Tigris Dashboard, you can choose the
authentication type and provide the necessary credentials.

For basic authentication, the header will set as follows:

`Authorization: Basic <base64 encoded username:password>`

For token authentication, the header will set as follows:

`Authorization: Bearer <token>`

## Notification Types

Tigris currently supports the following notification types:

- `OBJECT_CREATED_PUT`: When an object is created or updated.
- `OBJECT_DELETED`: When an object is deleted.

:::note

More events will be supported in the future.

:::

## Notification Format

Each notification will be a JSON object with the following fields:

| Property     | Type   | Description                                                  |
| ------------ | ------ | ------------------------------------------------------------ |
| events       | Array  | An array of notification events                              |
| eventVersion | String | Version of the event structure                               |
| eventSource  | String | Source of the event                                          |
| eventName    | String | Type of event (e.g., "OBJECT_CREATED_PUT", "OBJECT_DELETED") |
| eventTime    | String | Timestamp of the event in RFC3339 format                     |
| bucket       | String | Name of the bucket where the event occurred                  |
| object       | Object | Details of the object involved in the event                  |
| object.key   | String | The key (path) of the object within the bucket               |
| object.size  | Number | Size of the object in bytes                                  |
| object.eTag  | String | Entity tag (ETag) of the object, typically an MD5 hash       |

An example notification payload is:

```json
{
  "events": [
    {
      "eventVersion": "1",
      "eventSource": "tigris",
      "eventName": "OBJECT_CREATED_PUT",
      "eventTime": "2023-05-15T10:30:00.000Z",
      "bucket": "my-bucket",
      "object": {
        "key": "path/to/myfile.txt",
        "size": 1024,
        "eTag": "d41d8cd98f00b204e9800998ecf8427e"
      }
    },
    {
      "eventVersion": "1",
      "eventSource": "tigris",
      "eventName": "OBJECT_DELETED",
      "eventTime": "2023-05-15T11:45:00.000Z",
      "bucket": "my-bucket",
      "object": {
        "key": "path/to/anotherfile.jpg",
        "size": 2048,
        "eTag": "c4ca4238a0b923820dcc509a6f75849b"
      }
    }
  ]
}
```

## Filtering

Object notifications support adding a SQL-like query to filter the events that
are sent to the webhook. The query is configured in the Tigris Dashboard. The
filtering uses the SQL-like syntax defined in
[Metadata Querying](/docs/objects/query-metadata.md). It also supports the extra
`Event-Type` field to filter by event type.

An example to only receive notifications for a key with a prefix of `images/`:

```sql
WHERE key REGEXP "^images"
```

Or to only receive notifications for delete events:

```sql
WHERE "Event-Type" = "OBJECT_DELETED"
```

## Pricing

See [Pricing](/docs/pricing/index.mdx) for how object notifications are charged.

## Notification ordering guarantees and delivery

Tigris Object Notifications are designed to be delivered at least once. This
means that in rare cases, you might receive duplicate notifications for the same
event. Aim to design your application to handle potential duplicates.

Due to Tigris being a globally distributed object store, notifications can be
sent out of order. This is due to objects being modified in multiple regions. A
single region then collates those events and sends them to the webhook. The
`Last-Modified` timestamp can be used to determine the order of the events.

## Next steps

- Check out the [Example Webhook](/docs/sdks/s3/aws-go-sdk.mdx#webhook) for more
  details on how to use them in your application.

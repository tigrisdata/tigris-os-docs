# Object Metadata Querying

Tigris indexes the `Last-Modified` field for every object stored in a bucket.
This can be used to query objects based on their `Last-Modified` index and
in-memory filters using a SQL-like syntax through the `X-Tigris-Query` header
when using the
[ListObjectsV2 API](https://docs.aws.amazon.com/AmazonS3/latest/API/API_ListObjectsV2.html).

The `X-Tigris-Query` field query can be thought of as the `WHERE` clause in a
SQL query. For instance, to find all objects with a `Content-Type` of
`text/javascript`, set the header as follows:

- `X-Tigris-Query`:
  ``WHERE `Last-Modified` > "2023-01-15T08:30:00Z" AND `Content-Type` = "text/javascript"``

## Queryable Fields

Tigris supports querying against the following fields:

1. `` `Last-Modified` ``: The date and time the object was last modified in
   [RFC3339](https://www.ietf.org/rfc/rfc3339.txt) format. **This field is
   indexed and can be used for efficient queries.**
2. `` `Content-Type` ``: The content type assigned during upload. **This field
   can be used as an in-memory filter when combined with `Last-Modified`.**
3. `` `Content-Length` ``: The size of the object. **This field can be used as
   an in-memory filter when combined with `Last-Modified`.**
4. `` `key` ``: The key of the object. **This field can be used as an in-memory
   filter when combined with `Last-Modified`.**
5. `` `Event-Type` ``: The type of the event, this is only supported in
   [Object Notifications](/docs/buckets/object-notifications.md).

## Query Requirements

**Important**: Since only `Last-Modified` is indexed, your query must include a
condition on `Last-Modified` to enable efficient filtering. Other fields like
`Content-Type` and `Content-Length` can be used as additional in-memory filters.

## SQL Operations

Query supports following comparison operators:

1. `=`: Equal
2. `!=`: Not Equal
3. `>` and `<`: Greater than and less than
4. `>=` and `<=`: Greater than or equal and less than or equal
5. `AND`: Combine multiple conditions in a query.

## In Memory Operations

Tigris supports `IN`, `NOT IN`, and `REGEXP` operators for filtering results.
Since these operations are performed in memory, they must be combined with a
`Last-Modified` condition. For example:

1. ``WHERE `Last-Modified` > "2022-06-10T14:20:00Z" AND `Content-Type` = "text/plain" AND key REGEXP ".*\.txt$" ``
2. ``WHERE `Last-Modified` > "2023-03-22T09:45:00Z" AND `Content-Length` > 1024 AND `Content-Type` IN ("text/javascript", "text/css") ``.
3. ``WHERE `Last-Modified` > "2021-11-05T16:15:00Z" AND `Content-Length` != 65536 AND `Content-Type` NOT IN ("text/plain", "text/html") ``.

## Order By

You can sort the list using `ORDER BY`. For example, to retrieve all items
smaller than `64KB` ordered by `Content-Type`:

- `` WHERE `Last-Modified` > "2023-08-14T11:30:00Z" AND `Content-Length` < 65536 ORDER BY `Content-Type` ``

## Example Queries

Example queries that can be performed:

1. ``WHERE `Content-Type` = "text/plain" ORDER BY `Last-Modified` ``
2. ``WHERE `Last-Modified` > "2023-05-18T13:20:00Z" AND `Content-Type` >= "text/c" AND `Content-Type` < "text/j" ``
3. ``WHERE `Last-Modified` > "2021-09-27T10:15:00Z" AND `Content-Length` > 0 ORDER BY `Last-Modified` ASC ``
4. ``WHERE `Content-Length` != 65536 AND `Content-Type` = "text/plain" ORDER BY `Last-Modified` ``

## Next Steps

- Check out the [Example Usage](/docs/sdks/s3/aws-go-sdk#metadata-querying) for
  more details on how to use them in your application.

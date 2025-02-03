# Object Metadata Querying

Tigris indexes important metadata fields such as `Content-Type`,
`Content-Length`, and `Last-Modified` for every object stored in a bucket. You
can query these objects using a SQL-like syntax through the `X-Tigris-Query`
header when using the
[ListObjectsV2 API](https://docs.aws.amazon.com/AmazonS3/latest/API/API_ListObjectsV2.html).

The `X-Tigris-Query` field query can be thought of as the `WHERE` clause in a
SQL query. For instance, to find all objects with a `Content-Type` of
`text/javascript`, set the header as follows:

- `X-Tigris-Query`: `` WHERE `Content-Type` = "text/javascript" ``

## Queryable Fields

Tigris supports querying against the following fields:

1. `` `Content-Type` ``: The content type assigned during upload.
2. `` `Content-Length` ``: The size of the object.
3. `` `Last-Modified` ``: The date and time the object was last modified in
   [RFC3339](https://www.ietf.org/rfc/rfc3339.txt) format.
4. `` `key` ``: The key of the object.
5. `` `Event-Type` ``: The type of the event, this is only supported in
   [Object Notifications](/docs/buckets/object-notifications.md).

## SQL Operations

Query supports following comparison operators:

1. `=`: Equal
2. `!=`: Not Equal
3. `>` and `<`: Greater than and less than
4. `>=` and `<=`: Greater than or equal and less than or equal
5. `AND`: Combine multiple conditions in a query.

## In Memory Operations

Tigris supports `IN`, `NOT IN`, and `REGEXP` operators for filtering results.
Since these operations are performed in memory, they must be combined with SQL
operations mentioned above. For example:

1. `` WHERE `Content-Type` = "text/plain" AND key REGEXP ".*\.txt$"  ``
2. `` WHERE `Content-Length` > 1024 AND `Content-Type` IN ("text/javascript", "text/css")  ``.
3. `` WHERE `Content-Length` != 65536 AND `Content-Type` NOT IN ("text/plain", "text/html")  ``.

## Order by

You can sort the list using `ORDER BY`. For example, to retrieve all items
smaller than `64KB` ordered by `Content-Type`:

- `` `Content-Length` < 65536 ORDER BY `Content-Type` ``

## Example Queries

Example queries that can be performed:

1. `` WHERE `Content-Type` = "text/plain"  ``
2. `` WHERE `Content-Type` >= "text/c" AND `Content-Type` < "text/j"  ``
3. `` WHERE `Content-Length` > 0 ORDER BY `Content-Length` ASC  ``
4. `` WHERE `Content-Length` != 65536 AND `Content-Type` = "text/plain"  ``
5. `` WHERE `Last-Modified` > "2024-06-23T10:38:46Z"  ``

## Next steps

- Check out the [Example usage](/docs/sdks/s3/aws-go-sdk#metadata-querying) for
  more details on how to use them in your application.

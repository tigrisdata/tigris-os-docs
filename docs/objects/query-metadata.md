# Object Metadata Querying

Tigris indexes important metadata fields such as `Content-Type`,
`Content-Length`, and `Last-Modified` for every object stored in a bucket. You
can query these objects using a SQL-like syntax through the `X-Tigris-Query`
header when using the
[ListObjectsV2 API](https://docs.aws.amazon.com/AmazonS3/latest/API/API_ListObjectsV2.html).

The `X-Tigris-Query` field query can be thought of as the `WHERE` clause in a
SQL query. For instance, to find all objects with a `Content-Type` of
`text/javascript`, set the header as follows:

- `X-Tigris-Query`: `` `Content-Type` = "text/javascript" ``

## Queryable Fields

Tigris supports querying against the following fields:

1. `` `Content-Type` ``: The content type assigned during upload.
2. `` `Content-Length` ``: The size of the object.
3. `` `Last-Modified` ``: The Unix timestamp of the last modification.

## SQL Operations

Tigris follows MySQL syntax. You can use the following comparison operators:

1. `=`: Equal
1. `!=`: Not Equal
1. `>` and `<`: Greater than and less than
1. `>=` and `<=`: Greater than or equal and less than or equal
1. `AND`: Combine multiple conditions in a query.

## Order by

You can sort the list using `ORDER BY`. For example, to retrieve all items
smaller than `64KB` ordered by `Content-Type`:

- `` `Content-Length` < 65536 ORDER BY `Content-Type` ``

## Example Queries

Example queries that can be performed:

1. `` `Content-Type` = "plain/text" ``
1. `` `Content-Type`>= "text/c" and`Content-Type` < "text/j" ``
1. `` `Content-Length` > 0 ORDER BY `Content-Length` ASC" ``
1. `` `Content-Length` != 65536 and `Content-Type` = "text/plain" ``
1. `` `Last-Modified` > 1715171786789 ``

## Next steps

- Check out the [Example usage](/docs/sdks/s3/aws-go-sdk.md#metadata-querying)
  for more details on how to use them in your application.

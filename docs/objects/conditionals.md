# Conditional Operations (preconditions)

When conditions are specified, the request will only proceed if the condition is
satisfied. Conditional checks ensure that the object is in the expected state,
allowing you to perform safe read-modify-write operations.

Conditional operations are often used to prevent race conditions during object
mutations such as uploads, deletes, or metadata updates. Race conditions can
occur when multiple clients are trying to modify the same object at the same
time, or when the same request is being sent repeatedly.

Conditions are also often used to implement optimistic concurrency control. This
is a strategy where the client assumes that the object has not been modified
since it was last read, and proceeds with the operation only if the assumption
holds true.

Conditions are provided through request headers. Attach the
`X-Tigris-Consistent:true` header in your conditional request to ensure Tigris
performs the conditional operation on the leader. The same applies to reads, to
ensure you get consistent read results.

## Supported Conditions

The following conditions are supported:

### Etag based conditions

#### Proceed with operation only if Etag matches (i.e. object is unchanged)

The condition is specified using the `If-Match` header:

- `If-Match: "etag value"`
- `If-Match: ""` - (empty etag) creates only if object not exists

Request fails with HTTP status code 412 (Precondition Failed) if there is no
match.

#### Proceed with operation if Etag doesn't match (i.e. object has been changed)

The condition is specified using the `If-None-Match` header.

- `If-None-Match: "etag value"`
- `If-None-Match: ""` - (empty etag) replace only if object exists
- `If-None-Match: "*"` - Matches no etag, i.e. create only

Request fails with HTTP status code 304 (Not Modified) if there is a match on
GET. Request fails with HTTP status code 412 (Precondition Failed) if there is a
match on PUT.

### Date based conditions

#### Proceed with operation if object was modified after provided date

The condition is specified using the `If-Modified-Since` header.

- `If-Modified-Since: <date in RFC1123 format>`

Request fails with HTTP status code 304 (Not Modified) if the object has not
been modified since the provided date.

#### Proceed with operation if object wasn't modified after

The condition is specified using the `If-Unmodified-Since` header.

- `If-Unmodified-Since: <date in RFC1123 format>`

Request fails with HTTP status code 412 (Precondition Failed) if the object was
modified since provided date.

Multiple conditions can be specified in a single request. The request fails if
any of the conditions are not met.

Don't forget to attach `X-Tigris-Consistent:true` header as that ensures the
conditions are evaluated and conditional operation will be performed on leader.

### Reads (GET request)

During reads, specifying the `X-Tigris-Consistent:true` header will direct
Tigris to read from the leader. This ensures consistent reads.

## Next steps

- Check out the
  [Example usage](/docs/sdks/s3/aws-go-sdk.mdx#conditional-operations) for more
  details on how to use them in your application.

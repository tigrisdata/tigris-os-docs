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

Conditions is provided through request headers.

## Supported Conditions

The following conditions are supported:

### Etag based conditions

#### Proceed with operation only if Etag matches (i.e. object is unchanged)

The condition is specified using the `If-Match` header:

- `If-Match: "etag value"`
- `If-Match: ""` - (empty etag) creates only if object not exists

Request fails with http code 412 (Precondition Failed) in the case of non match.

#### Proceed with operation if Etag doesn't match (i.e. object has been changed)

The condition is specified using the `If-None-Match` header.

- `If-None-Match: "etag value"`
- `If-None-Match: ""` - (empty etag) replace only if object exists
- `If-None-Match: "*"` - Matches no etag, i.e. create only

Request fails with http code 304 (Non Modified) in the case of match on get.
Request fails with http code 412 (Precondition Failed) in the case of match on
put.

### Date based conditions

#### Proceed with operation if object was modified after provided date

The condition is specified using the `If-Modified-Since` header.

- `If-Modified-Since: <date in RFC1123 format>`

Request fails with http code 304 (Non Modified) if the object wasn't modified
since provided date.

#### Proceed with operation if object wasn't modified after

The condition is specified using the `If-Unmodified-Since` header.

- `If-Unmodified-Since: <date in RFC1123 format>`

Request fails with http code 412 (Precondition Failed) if objects was modified
since provided data.

Multiple conditions can be specified in a single request. Request fails if any
condition is not met.

### CAS Reads (GET request)

During reads, specifying `x-tigris-cas: true` header will indicate Tigris to
skip the cache and read the object from its designated region. This ensures a
consistent read, particularly when accessing the most recently written CAS
object.

## Next steps

- Check out the
  [Example usage](/docs/sdks/s3/aws-go-sdk.mdx#conditional-operations) for more
  details on how to use them in your application.

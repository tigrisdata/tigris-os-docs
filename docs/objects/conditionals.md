# Conditional Operations (preconditions)

Tigris supports conditional operations through standard HTTP precondition
headers. These headers let you execute read or write operations only when
specific conditions are met, for example, writing an object only if it hasn't
been modified since you last read it.

Conditional operations are commonly used to implement optimistic concurrency
control: the client reads an object, captures its ETag or last-modified
timestamp, performs some computation, and writes the result back only if the
object hasn't changed in the meantime.

## Supported Condition Headers

### ETag-based conditions

| Header          | Behavior                                                                                                                                                                                                                                  |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `If-Match`      | Request proceeds only if the object's ETag matches the provided value. Returns `412 Precondition Failed` otherwise.                                                                                                                       |
| `If-None-Match` | Request proceeds only if the object's ETag does **not** match. Use `If-None-Match: "*"` to write only if the object does not already exist. Returns `304 Not Modified` on a matching GET, or `412 Precondition Failed` on a matching PUT. |

### Date-based conditions

| Header                | Behavior                                                                                                                          |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `If-Modified-Since`   | Request proceeds only if the object was modified after the provided date (RFC 1123 format). Returns `304 Not Modified` otherwise. |
| `If-Unmodified-Since` | Request proceeds only if the object was **not** modified after the provided date. Returns `412 Precondition Failed` otherwise.    |

### Combining conditions

Multiple condition headers can be specified in a single request. The request
proceeds only if **all** conditions are met. If any condition fails, the request
is rejected with the appropriate error status code.

## Consistency and Conditional Operations

Conditional operations always evaluate against the latest state of the object
within the consistency model defined by your bucket's
[location type](/docs/buckets/locations/).

- **Multi-region** and **Single-region** buckets provide strong consistency
  globally. Conditional operations are guaranteed to evaluate against the most
  recent write, regardless of which region the request originates from.
- **Global** and **Dual-region** buckets provide strong consistency within the
  same region and eventual consistency globally. For conditional operations that
  may span regions, use a Multi-region or Single-region bucket to ensure
  conditions are always evaluated against the latest state.

:::note

If your workload requires conditional writes from multiple regions on the same
objects, we recommend using a **Multi-region** or **Single-region** bucket. This
guarantees that preconditions are always evaluated against the globally
consistent latest state, without any additional configuration.

:::

## Use Cases

### Create-if-not-exists

Upload an object only if it doesn't already exist:

```text
PUT /my-object HTTP/1.1
If-None-Match: "*"
```

If the object already exists, the request fails with `412 Precondition Failed`.

### Compare-and-swap (optimistic concurrency)

Read an object, modify it, and write it back only if no one else has changed it:

1. **Read** the object and capture its ETag from the response.
2. **Write** the modified object with `If-Match` set to the captured ETag.

```text
PUT /my-object HTTP/1.1
If-Match: "etag-from-previous-read"
```

If the object was modified between the read and the write, the request fails
with `412 Precondition Failed`. The client can then re-read and retry.

### Conditional GET (cache validation)

Fetch an object only if it has changed since you last retrieved it:

```text
GET /my-object HTTP/1.1
If-None-Match: "etag-from-cached-copy"
```

If the object hasn't changed, the response is `304 Not Modified` with no body.

## Error Responses

| Status Code               | Meaning                                                             |
| ------------------------- | ------------------------------------------------------------------- |
| `304 Not Modified`        | The condition indicates the object hasn't changed (GET requests).   |
| `412 Precondition Failed` | One or more conditions were not met (PUT, DELETE, or GET requests). |

## Next steps

- [Bucket Locations](/docs/buckets/locations/) — Understand how your bucket's
  location type determines consistency behavior
- [AWS Go SDK](/docs/sdks/s3/aws-go-sdk.mdx#conditional-operations) — Example of
  conditional operations using the Go SDK

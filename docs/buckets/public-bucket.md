# Public Bucket

Sometimes you want to share your bucket with the world. You can do this by
creating a public bucket. This will allow anyone to read the contents of your
bucket. You can still control who can write to your bucket.

## Creating a public bucket using AWS CLI

Assuming you have the AWS CLI configured as shown in the
[AWS CLI guide](../sdks/s3/aws-cli.md), you can create a public bucket as
follows:

```bash
aws s3api --endpoint-url https://fly.storage.tigris.dev create-bucket --bucket foo-public-bucket --acl public-read
```

```text
$ aws s3api --endpoint-url https://fly.storage.tigris.dev create-bucket --bucket foo-public-bucket --acl public-read
{
    "Location": "/foo-public-bucket"
}
```

The key here is the `--acl public-read` flag. This will allow anyone to read the
contents of the bucket `foo-public-bucket`.

## Accessing objects in a public bucket

Objects in a public bucket can be accessed without any authentication.

Let's upload a file to our public bucket:

```bash
$ aws s3api --endpoint-url https://fly.storage.tigris.dev put-object --bucket foo-public-bucket --key bar.txt --body bar.txt
{
    "ETag": "\"c157a79031e1c40f85931829bc5fc552\""
}
```

Now, we can now access this file without any authentication.

### Path-style request

Path-style URLs use the following format:

```text
https://fly.storage.tigris.dev/bucket-name/key-name
```

So for the object we just uploaded, the path-style URL would be:

```bash
$ wget https://fly.storage.tigris.dev/foo-public-bucket/bar.txt -O- -q
bar
```

### Virtual-hosted–style request

In a virtual-hosted–style URI, the bucket name is part of the domain name in the
URL.

Virtual-hosted–style URLs use the following format:

```text
https://bucket-name.fly.storage.tigris.dev/key-name
```

So for the object we just uploaded, the virtual-hosted–style URL would be:

```bash
$ wget https://foo-public-bucket.fly.storage.tigris.dev/bar.txt -O- -q
bar
```

### CORS with public bucket

CORS, or Cross-Origin Resource Sharing, is a web security mechanism enforced by
modern browsers. It permits servers to specify which origins can access their
resources, enhancing security by preventing unauthorized access from scripts or
sites outside the defined origin. CORS facilitates safe sharing of resources
across different domains.

You can learn more about
[CORS here](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

Tigris allows owner's of the public bucket specify their CORS configuration.
Let's take an example of public bucket `public-scripts`. Consider as the owner
of this bucket you want to restrict the access (via HTTP methods `PUT`, `POST`
and `DELETE`) to objects of this bucket from origins `https://www.example.com`.
and for http `GET` access you want to allow it from all the origins. You can
specify this rule. Tigris will serve the CORS headers instructing modern web
browsers to adhere security practices. Note: CORS is just the protection layer
added in modern web browsers. It only enforces the security for
[these types of requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#what_requests_use_cors)
from modern web browsers.

```json
{
  "CORSRules": [
    {
      "AllowedOrigins": ["https://www.example.com"],
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["PUT", "POST", "DELETE"],
      "MaxAgeSeconds": 3000
    },
    {
      "AllowedOrigins": ["*"],
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["GET"],
      "MaxAgeSeconds": 3000
    }
  ]
}
```

Tigris evaluates CORS in the order specified within the configuration array:

- Initially, it checks if the origin matches any allowed origins; if so, it
  proceeds to further inspection.
- Next, it compares the requested method (or the method specified by the
  `Access-Control-Request-Method` header for pre-flight requests) with the
  allowed methods.
- For pre-flight requests, it compares the allowed headers with those specified
  by the `Access-Control-Request-Headers` header.
- If all conditions are met, Tigris serves the CORS headers generated from the
  corresponding CORS rule.

You can use `PutBucketCors`, `GetBucketCors`, `DeleteBucketCors` s3 operations.

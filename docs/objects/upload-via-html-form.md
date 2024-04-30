# Browser-Based Uploads Using HTTP POST

Tigris facilitates the posting of objects via HTTP, which proves beneficial in
scenarios where bucket owners prefer their users to upload objects to a bucket
through an HTML form.

At a high level, the following process outlines browser-based uploads:

- The user generates a post-policy, which sets constraints on allowable uploads.
- The user then signs this post-policy with an access key using AWS signature
  version 4.
- The user's web server delivers the HTML form. The form's post action is
  configured to submit the object, signature, and accompanying metadata to the
  Tigris server.
- Upon receiving the submission, the Tigris server verifies the signature and
  enforces the constraints outlined in the post-policy.
- Upon successful verification, Tigris proceeds to write the object and
  redirects the browser to the success URL specified in the policy.

There are a few distinctions in how Tigris executes this functionality compared
to AWS S3:

- Due to Tigris being a globally accessible service with global replication, the
  region segment of the `X-Amz-Credential` is designated as `auto`.
- The `acl` element within the post-policy is currently not supported by Tigris.
- For signature verification, Tigris only supports Signature version 4.

## Example

Consider a scenario where you need to enable users to upload images via your web
application accessed through web browsers.

For illustrative purposes, let's utilize the following credentials:

| AccessKeyId          | SecretAccessKey                                                              |
| -------------------- | ---------------------------------------------------------------------------- |
| `tid_example_key_id` | `tsec_example_H3CYVqDGmFxdXGlruqb16mS22qj59Ag9H3CYVqDGmFxdXGlruqb16mS22qj59` |

### First step, define a policy

```json
{
  "expiration": "2024-03-30T12:00:00.000Z",
  "conditions": [
    { "bucket": "my-user-images" },
    ["starts-with", "$key", "images1/"],
    { "success_action_redirect": "https://your-website.com/success.html" },
    ["starts-with", "$Content-Type", "image/"],
    { "x-amz-meta-uuid": "465888667" },
    { "x-amz-credential": "tid_example_key_id/20240330/auto/s3/aws4_request" },
    { "x-amz-algorithm": "AWS4-HMAC-SHA256" },
    { "x-amz-date": "20240330T000000Z" }
  ]
}
```

- This policy mandates that uploads must occur before noon UTC on March
  30, 2024.
- It permits uploads to the bucket named `my-user-images`.
- Objects posted here must have keys starting with `images1/`.
- Upon successful upload, the Tigris server will redirect the user to
  `https://your-website.com/success.html`.
- The content type of the object must start with `image/`, indicating that only
  image contents are accepted as per this policy.
- The unique UUID associated with the post must match `465888667`. It is
  recommended to use a secure random number or UUID for better security
  practices.
- The credentials used to sign this policy have an access key ID of
  `tid_example_key_id`, and the date must match the expiration date.
- Full
  [detailed grammar of policy is documented here](https://docs.aws.amazon.com/AmazonS3/latest/API/sigv4-HTTPPOSTConstructPolicy.html)

### Base64 encode this policy

```shell
eyAKICAiZXhwaXJhdGlvbiI6ICIyMDI0LTAzLTMwVDEyOjAwOjAwLjAwMFoiLAogICJjb25kaXRpb25zIjogWwogICAgeyJidWNrZXQiOiAibXktdXNlci1pbWFnZXMifSwKICAgIFsic3RhcnRzLXdpdGgiLCAiJGtleSIsICJpbWFnZXMxLyJdLAogICAgeyJzdWNjZXNzX2FjdGlvbl9yZWRpcmVjdCI6ICJodHRwczovL3lvdXItd2Vic2l0ZS5jb20vc3VjY2Vzcy5odG1sIn0sCiAgICBbInN0YXJ0cy13aXRoIiwgIiRDb250ZW50LVR5cGUiLCAiaW1hZ2UvIl0sCiAgICB7IngtYW16LW1ldGEtdXVpZCI6ICI0NjU4ODg2NjcifSwKICAgIHsieC1hbXotY3JlZGVudGlhbCI6ICJ0aWRfZXhhbXBsZV9rZXlfaWQvMjAyNDAzMzAvYXV0by9zMy9hd3M0X3JlcXVlc3QifSwKICAgIHsieC1hbXotYWxnb3JpdGhtIjogIkFXUzQtSE1BQy1TSEEyNTYifSwKICAgIHsieC1hbXotZGF0ZSI6ICIyMDI0MDMzMFQwMDAwMDBaIiB9CiAgXQp9eyAKICAiZXhwaXJhdGlvbiI6ICIyMDI0LTAzLTMwVDEyOjAwOjAwLjAwMFoiLAogICJjb25kaXRpb25zIjogWwogICAgeyJidWNrZXQiOiAibXktdXNlci1pbWFnZXMifSwKICAgIFsic3RhcnRzLXdpdGgiLCAiJGtleSIsICJpbWFnZXMxLyJdLAogICAgeyJzdWNjZXNzX2FjdGlvbl9yZWRpcmVjdCI6ICJodHRwczovL3lvdXItd2Vic2l0ZS5jb20vc3VjY2Vzcy5odG1sIn0sCiAgICBbInN0YXJ0cy13aXRoIiwgIiRDb250ZW50LVR5cGUiLCAiaW1hZ2UvIl0sCiAgICB7IngtYW16LW1ldGEtdXVpZCI6ICI0NjU4ODg2NjcifSwKICAgIHsieC1hbXotY3JlZGVudGlhbCI6ICJ0aWRfZXhhbXBsZV9rZXlfaWQvMjAyNDAzMzAvYXV0by9zMy9hd3M0X3JlcXVlc3QifSwKICAgIHsieC1hbXotYWxnb3JpdGhtIjogIkFXUzQtSE1BQy1TSEEyNTYifSwKICAgIHsieC1hbXotZGF0ZSI6ICIyMDI0MDMzMFQwMDAwMDBaIiB9CiAgXQp9
```

### Sign the policy

Utilize the
[AWS signature v4](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_aws-signing.html)
to sign the base64-encoded policy. Employ the base64-encoded version of the
policy as the `StringToSign`.

```
Signature = Hex(
              HMAC-SHA256(
                  HMAC-SHA256(
                      HMAC-SHA256(
                          HMAC-SHA256(
                              HMAC-SHA256(
                                  "AWS4"+<SecretAccessKey>",
                                  "<yyyymmdd>"
                              ),
                              "auto"
                          ),
                          "s3"
                      ),
                      "aws4_request"
                  ),
                  StringToSign
              )
          )
```

Note:

- First argument in this illustrative function is the key and second argument is
  the message to sign.
- The date will be same as the expiration date. In our example it will be
  `20240330`
- Region is marked as `auto` and service is `s3`

The signature of our example policy will be

```shell
fb2e5943b3146a9dfe1ea4bbe2ca059d5b4c2a6866f60ed39cc85a1eaa482775
```

### Generate the HTML form

```html
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  </head>
  <body>
    <form
      action="https://my-user-images.fly.storage.tigris.dev/"
      method="post"
      enctype="multipart/form-data"
    >
      Key to upload:
      <input type="input" name="key" value="images1/${filename}" /><br />
      <input
        type="hidden"
        name="success_action_redirect"
        value="https://your-website.com/success.html"
      />
      <input type="hidden" name="Content-Type" value="image/jpeg" /><br />
      <input type="hidden" name="x-amz-meta-uuid" value="465888667" />
      <input
        type="hidden"
        name="X-Amz-Credential"
        value="tid_example_key_id/20240330/auto/s3/aws4_request"
      />
      <input type="hidden" name="X-Amz-Algorithm" value="AWS4-HMAC-SHA256" />
      <input type="hidden" name="X-Amz-Date" value="20240330T000000Z" />
      <input
        type="hidden"
        name="Policy"
        value="eyAKICAiZXhwaXJhdGlvbiI6ICIyMDI0LTAzLTMwVDEyOjAwOjAwLjAwMFoiLAogICJjb25kaXRpb25zIjogWwogICAgeyJidWNrZXQiOiAibXktdXNlci1pbWFnZXMifSwKICAgIFsic3RhcnRzLXdpdGgiLCAiJGtleSIsICJpbWFnZXMxLyJdLAogICAgeyJzdWNjZXNzX2FjdGlvbl9yZWRpcmVjdCI6ICJodHRwczovL3lvdXItd2Vic2l0ZS5jb20vc3VjY2Vzcy5odG1sIn0sCiAgICBbInN0YXJ0cy13aXRoIiwgIiRDb250ZW50LVR5cGUiLCAiaW1hZ2UvIl0sCiAgICB7IngtYW16LW1ldGEtdXVpZCI6ICI0NjU4ODg2NjcifSwKICAgIHsieC1hbXotY3JlZGVudGlhbCI6ICJ0aWRfZXhhbXBsZV9rZXlfaWQvMjAyNDAzMzAvYXV0by9zMy9hd3M0X3JlcXVlc3QifSwKICAgIHsieC1hbXotYWxnb3JpdGhtIjogIkFXUzQtSE1BQy1TSEEyNTYifSwKICAgIHsieC1hbXotZGF0ZSI6ICIyMDI0MDMzMFQwMDAwMDBaIiB9CiAgXQp9eyAKICAiZXhwaXJhdGlvbiI6ICIyMDI0LTAzLTMwVDEyOjAwOjAwLjAwMFoiLAogICJjb25kaXRpb25zIjogWwogICAgeyJidWNrZXQiOiAibXktdXNlci1pbWFnZXMifSwKICAgIFsic3RhcnRzLXdpdGgiLCAiJGtleSIsICJpbWFnZXMxLyJdLAogICAgeyJzdWNjZXNzX2FjdGlvbl9yZWRpcmVjdCI6ICJodHRwczovL3lvdXItd2Vic2l0ZS5jb20vc3VjY2Vzcy5odG1sIn0sCiAgICBbInN0YXJ0cy13aXRoIiwgIiRDb250ZW50LVR5cGUiLCAiaW1hZ2UvIl0sCiAgICB7IngtYW16LW1ldGEtdXVpZCI6ICI0NjU4ODg2NjcifSwKICAgIHsieC1hbXotY3JlZGVudGlhbCI6ICJ0aWRfZXhhbXBsZV9rZXlfaWQvMjAyNDAzMzAvYXV0by9zMy9hd3M0X3JlcXVlc3QifSwKICAgIHsieC1hbXotYWxnb3JpdGhtIjogIkFXUzQtSE1BQy1TSEEyNTYifSwKICAgIHsieC1hbXotZGF0ZSI6ICIyMDI0MDMzMFQwMDAwMDBaIiB9CiAgXQp9"
      />
      <input
        type="hidden"
        name="X-Amz-Signature"
        value="fb2e5943b3146a9dfe1ea4bbe2ca059d5b4c2a6866f60ed39cc85a1eaa482775"
      />
      File:
      <input type="file" name="file" /> <br />
      <input type="submit" name="submit" value="Upload to Tigris" />
    </form>
  </body>
</html>
```

Note: post parameters are case-insensitive.

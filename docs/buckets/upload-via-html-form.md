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

## References

- [Browser-Based Uploads Using POST (AWS Signature Version 4)](https://docs.aws.amazon.com/AmazonS3/latest/API/sigv4-UsingHTTPPOST.html)
- [Post policy](https://docs.aws.amazon.com/AmazonS3/latest/API/sigv4-HTTPPOSTConstructPolicy.html)
- [Example](https://docs.aws.amazon.com/AmazonS3/latest/API/sigv4-post-example.html)

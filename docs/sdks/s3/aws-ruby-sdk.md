# AWS Ruby SDK

This guide assumes that you have followed the steps in the
[Getting Started](/docs/get-started/index.md) guide, and have the access keys
available.

You may continue to use the AWS Ruby SDK as you normally would, but with the
endpoint set to `https://fly.storage.tigris.dev`.

This example uses the [AWS Ruby SDK v3](https://github.com/aws/aws-sdk-ruby) and
reads the default credentials file or the environment variables
`AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`.

```ruby
require "aws-sdk"

bucket_name = "foo-bucket"

s3 = Aws::S3::Client.new(
    region: "auto",
    endpoint: "https://fly.storage.tigris.dev",
)

# Lists all of your buckets
resp = s3.list_buckets
puts "My buckets now are:\n\n"

resp.buckets.each do |bucket|
    puts bucket.name
end

# List the first ten objects in the bucket
resp = s3.list_objects(bucket: 'foo-bucket', max_keys: 10)
resp.contents.each do |object|
    puts "#{object.key} => #{object.etag}"
end

# Put an object into the bucket
file_name = "bar-file-#{Time.now.to_i}"
begin
    s3.put_object(
        bucket: bucket_name,
        key: file_name,
        body: File.read("bar.txt")
    )
    puts "Uploaded #{file_name} to #{bucket_name}."
rescue Exception => e
    puts "Failed to upload #{file_name} with error: #{e.message}"
    exit "Please fix error with file upload before continuing."
end
```

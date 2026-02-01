require "aws-sdk-s3"

bucket_name = "tigris-example"

s3 = Aws::S3::Client.new(
    region: "auto",
    endpoint: "https://t3.storageapi.dev",
)

# Lists all of your buckets
resp = s3.list_buckets
puts "My buckets now are:\n\n"

resp.buckets.each do |bucket|
    puts bucket.name
end

# List the first ten objects in the bucket
resp = s3.list_objects(bucket: bucket_name, max_keys: 10)
resp.contents.each do |object|
    puts "#{object.key} => #{object.etag}"
end

# Put an object into the bucket
file_name = "bar-file-#{Time.now.to_i}"
begin
    s3.put_object(
        bucket: bucket_name,
        key: file_name,
        body: File.read("getting_started.rb")
    )
    puts "Uploaded #{file_name} to #{bucket_name}."
rescue Exception => e
    puts "Failed to upload #{file_name} with error: #{e.message}"
    exit "Please fix error with file upload before continuing."
end
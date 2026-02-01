require "aws-sdk-s3"

s3 = Aws::S3::Client.new(
    region: "auto",
    endpoint: "https://t3.storageapi.dev",
    force_path_style: false,
)

bucket_name = "tigris-example"
bucket = Aws::S3::Bucket.new(name: bucket_name, client: s3)

presigned_url = bucket.object("test-object").presigned_url(:get, expires_in: 3600)
puts "Presigned URL for GET: #{presigned_url}"
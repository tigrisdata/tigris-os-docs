require "aws-sdk-s3"
require "net/http"
require "securerandom"
require "uri"

bucket_name = "tigris-example"

s3 = Aws::S3::Client.new(
    region: "auto",
    endpoint: "https://t3.storage.dev",
    force_path_style: false,
)

bucket = Aws::S3::Bucket.new(name: bucket_name, client: s3)

# generate new UUID
uuid = SecureRandom.uuid
puts "Generated UUID: #{uuid}"

presigned_url = bucket.object(uuid).presigned_url(:put, expires_in: 3600)
puts "Presigned URL for PUT: #{presigned_url}"

# Using the presigned URL from earlier
uri = URI.parse(presigned_url)
request = Net::HTTP::Put.new(uri)
request.body = "Hello, world!"

response = Net::HTTP.start(uri.host, uri.port, use_ssl: uri.scheme == 'https') do |http|
  http.request(request)
end

puts "Response code: #{response.code}"
if response.code != "200"
    puts "Failed to PUT object with error: #{response.message}"
    exit "Please fix error with PUT request before continuing."
end

presigned_url = bucket.object(uuid).presigned_url(:get, expires_in: 3600)
puts "Presigned URL for GET: #{presigned_url}"

# Using the presigned URL from earlier
uri = URI.parse(presigned_url)
request = Net::HTTP::Get.new(uri)

response = Net::HTTP.start(uri.host, uri.port, use_ssl: uri.scheme == 'https') do |http|
  http.request(request)
end

puts "Response code: #{response.code}"
if response.code != "200"
    puts "Failed to GET object with error: #{response.message}"
    exit "Please fix error with GET request before continuing."
end

presigned_url = bucket.object(uuid).presigned_url(:delete, expires_in: 3600)
puts "Presigned URL for DELETE: #{presigned_url}"

# Using the presigned URL from earlier
uri = URI.parse(presigned_url)
request = Net::HTTP::Delete.new(uri)

response = Net::HTTP.start(uri.host, uri.port, use_ssl: uri.scheme == 'https') do |http|
  http.request(request)
end

puts "Response code: #{response.code}"
if response.code != "204"
    puts "Failed to DELETE object with error: #{response.message}"
    exit "Please fix error with DELETE request before continuing."
end
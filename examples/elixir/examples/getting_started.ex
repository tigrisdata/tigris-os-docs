# List all buckets
all_buckets = ExAws.S3.list_buckets() |> ExAws.request!()

IO.puts("Buckets:")

for bucket <- all_buckets.body.buckets do
  IO.puts(bucket.name)
end

# List all objects in bucket tigris-example
bucket_name = "tigris-example"
all_objects = ExAws.S3.list_objects(bucket_name) |> ExAws.request!() |> get_in([:body, :contents])

IO.puts("Objects:")

for object <- all_objects do
  IO.puts(object.key)
end

# Put bar.txt
key = "bar.txt"
body = "Hello, world!"

response = ExAws.S3.put_object(bucket_name, key, body) |> ExAws.request!()
assert response.status_code == 200

# Read back bar.txt
response = ExAws.S3.get_object(bucket_name, key) |> ExAws.request!()
assert response.status_code == 200
assert response.body == body

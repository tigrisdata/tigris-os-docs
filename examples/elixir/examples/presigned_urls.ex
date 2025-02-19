bucket_name = "tigris-example"
key = "bar_ex.txt"

{:ok, presigned_url} =
  ExAws.Config.new(:s3) |> ExAws.S3.presigned_url(:get, bucket_name, key, expires_in: 300)

IO.puts("Presigned URL for GET:")
IO.puts(presigned_url)

{:ok, presigned_url} =
  ExAws.Config.new(:s3) |> ExAws.S3.presigned_url(:put, bucket_name, key, expires_in: 300)

IO.puts("Presigned URL for PUT:")
IO.puts(presigned_url)

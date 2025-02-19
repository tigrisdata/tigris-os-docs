defmodule ListAllBucketsTest do
  use ExUnit.Case

  test "list all buckets" do
    response = ExAws.S3.list_buckets() |> ExAws.request!()

    if response.status_code == 200 do
      IO.puts("Buckets:")

      for bucket <- response.body.buckets do
        IO.puts(bucket.name)
      end
    else
      IO.puts("Error listing buckets")
    end
  end
end

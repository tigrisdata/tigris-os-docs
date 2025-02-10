defmodule PresignedURLsTest do
  use ExUnit.Case

  test "generate presigned GET and validate" do
    bucket_name = "tigris-example"
    key = "bar_ex.txt"

    {:ok, presigned_url} =
      ExAws.Config.new(:s3) |> ExAws.S3.presigned_url(:get, bucket_name, key, expires_in: 300)

    response = HTTPoison.get!(presigned_url)

    assert response.status_code == 200
    assert response.body == "Hello, world!"
  end

  test "generate presigned PUT and validate" do
    bucket_name = "tigris-example"
    key = "baz_ex.txt"
    body = "Hello, world!"

    {:ok, presigned_url} =
      ExAws.Config.new(:s3) |> ExAws.S3.presigned_url(:put, bucket_name, key, expires_in: 300)

    response = HTTPoison.put!(presigned_url, body)

    assert response.status_code == 200

    get_response = ExAws.S3.get_object(bucket_name, key) |> ExAws.request!()

    assert get_response.status_code == 200
    assert get_response.body == body
  end
end

defmodule PresignedURLsTest do
  use ExUnit.Case

  test "presigned URLs" do
    bucket_name = "tigris-example"
    key = UUID.uuid4()
    body = "Hello, world!"

    # presigned PUT

    {:ok, presigned_url} =
      ExAws.Config.new(:s3) |> ExAws.S3.presigned_url(:put, bucket_name, key, expires_in: 300)

    response = HTTPoison.put!(presigned_url, body)

    assert response.status_code == 200

    get_response = ExAws.S3.get_object(bucket_name, key) |> ExAws.request!()

    assert get_response.status_code == 200
    assert get_response.body == body

    # presigned GET

    {:ok, presigned_url} =
      ExAws.Config.new(:s3) |> ExAws.S3.presigned_url(:get, bucket_name, key, expires_in: 300)

    response = HTTPoison.get!(presigned_url)

    assert response.status_code == 200
    assert response.body == body

    # presigned DELETE

    {:ok, presigned_url} =
      ExAws.Config.new(:s3) |> ExAws.S3.presigned_url(:delete, bucket_name, key, expires_in: 300)

    response = HTTPoison.delete!(presigned_url)

    assert response.status_code == 204
  end
end

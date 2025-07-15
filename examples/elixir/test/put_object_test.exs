defmodule PutObjectTest do
  use ExUnit.Case

  test "put bar-elixir.txt" do
    bucket_name = "tigris-example"
    key = "bar-elixir.txt"
    body = "Hello, world!"

    response = ExAws.S3.put_object(bucket_name, key, body) |> ExAws.request!()

    assert response.status_code == 200
  end

  test "read back bar-elixir.txt" do
    bucket_name = "tigris-example"
    key = "bar-elixir.txt"

    response = ExAws.S3.get_object(bucket_name, key) |> ExAws.request!()

    assert response.status_code == 200
    assert response.body == "Hello, world!"
  end
end

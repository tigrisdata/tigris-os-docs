defmodule ListAllObjectsTest do
  use ExUnit.Case

  test "list all objects in bucket tigris-example" do
    bucket_name = "tigris-example"

    response =
      ExAws.S3.list_objects(bucket_name) |> ExAws.request!() |> get_in([:body, :contents])

    for object <- response do
      IO.puts(object.key)
    end
  end
end

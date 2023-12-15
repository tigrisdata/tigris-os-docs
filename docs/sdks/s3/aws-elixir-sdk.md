# ExAWS Elixir SDK

Before you can use the [ExAWS SDK](https://github.com/ex-aws/ex_aws) with
Tigris, you need to generate an access key. You can do that at
[console.tigris.dev](https://console.tigris.dev/).

You may continue to use the ExAWS SDK as you normally would, but with the
endpoint set to `https://fly.storage.tigris.dev`.

This example reads the credentials from the environment variables
`AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`.

### ExAWS configuration

Add the dependencies to your `mix.exs` file:

```elixir

  defp deps do
    [
      {:ex_aws, "~> 2.0"},
      {:ex_aws_s3, "~> 2.0"},
      {:poison, "~> 3.0"},
      {:hackney, "~> 1.9"},
      {:sweet_xml, "~> 0.6.6"},
      {:jason, "~> 1.1"},
    ]
  end

```

Now setup the configuration for ex_aws and ex_aws_s3 in your `config.exs` file:

```elixir
import Config

config :ex_aws,
  debug_requests: true,
  json_codec: Jason,
  access_key_id: {:system, "AWS_ACCESS_KEY_ID"},
  secret_access_key: {:system, "AWS_SECRET_ACCESS_KEY"}

config :ex_aws, :s3,
  scheme: "https://",
  host: "fly.storage.tigris.dev",
  region: "auto"
```

In the first config we configure :ex_aws, by setting the access_key_id and
secret_access_key. In this case we use AWS_ACCESS_KEY_ID and
AWS_SECRET_ACCESS_KEY environment variables to store the access keys we will use
to access Tigris.

Then we configure the S3 API endpoint, which is "fly.storage.tigris.dev".

### Example

```elixir

# List all buckets

iex(1)> ExAws.S3.list_buckets() |> ExAws.request()

{:ok,
 %{
   body: %{
     owner: %{id: "", display_name: ""},
     buckets: [
       %{name: "foo-bucket", creation_date: "2023-12-12T03:42:36Z"},
       %{name: "foo-bucket-1", creation_date: "2023-11-30T18:50:55Z"},
       %{name: "foo-bucket-2", creation_date: "2023-12-02T00:28:53Z"},
       %{name: "test-bucket", creation_date: "2023-12-01T23:27:42Z"}
     ]
   },
   headers: [
     {"Content-Length", "1394"},
     {"Content-Type", "application/xml"},
     {"Server", "Tigris OS"},
     {"X-Amz-Request-Id", "1702663614071616663"},
     {"Date", "Fri, 15 Dec 2023 18:06:54 GMT"}
   ],
   status_code: 200
 }}

# List all objects in a bucket

iex(2)> ExAws.S3.list_objects("foo-bucket") |> ExAws.request!() |> get_in([:body, :contents])

[
  %{
    owner: %{id: "", display_name: ""},
    size: "578688267",
    key: "Docker-100.dmg",
    last_modified: "2023-12-15T04:40:27Z",
    storage_class: "STANDARD",
    e_tag: "\"67f4192f94643705f04ce32ae0b09162-111\""
  },
  %{
    owner: %{id: "", display_name: ""},
    size: "4",
    key: "bar-3",
    last_modified: "2023-12-14T19:56:24Z",
    storage_class: "STANDARD",
    e_tag: "\"c157a79031e1c40f85931829bc5fc552\""
  },
  %{
    owner: %{id: "", display_name: ""},
    size: "4",
    key: "bar.txt",
    last_modified: "2023-12-12T03:42:58Z",
    storage_class: "STANDARD",
    e_tag: ""
  },
  %{
    owner: %{id: "", display_name: ""},
    size: "578688267",
    key: "foo-10",
    last_modified: "2023-12-14T20:10:01Z",
    storage_class: "STANDARD",
    e_tag: "\"9b9bf0ac684c4dca180665d5f8312320\""
  },
  %{
    owner: %{id: "", display_name: ""},
    size: "578688267",
    key: "foo-11",
    last_modified: "2023-12-14T20:11:35Z",
    storage_class: "STANDARD",
    e_tag: "\"1ca5897a515681aecf0cc453a47e7eac-69\""
  },
  %{
    owner: %{id: "", display_name: ""},
    size: "4",
    key: "foo-13",
    last_modified: "2023-12-14T20:33:12Z",
    storage_class: "STANDARD",
    e_tag: "\"c157a79031e1c40f85931829bc5fc552\""
  }
]

# Put an object

iex(2)> {:ok, local_file} = File.read("bar.txt")

{:ok, "bar\n"}

iex(3)> ExAws.S3.put_object("foo-bucket", "bar.txt", local_file) |> ExAws.request!()

%{
  body: "",
  headers: [
    {"Content-Length", "0"},
    {"ETag", "\"c157a79031e1c40f85931829bc5fc552\""},
    {"Server", "Tigris OS"},
    {"X-Amz-Request-Id", "1702585992568596588"},
    {"Date", "Thu, 14 Dec 2023 20:33:12 GMT"}
  ],
  status_code: 200
}

# Get an object

iex(5)> resp = ExAws.S3.get_object("foo-bucket", "bar.txt") |> ExAws.request!()

%{
  body: "bar\n",
  headers: [
    {"Accept-Ranges", "bytes"},
    {"Content-Length", "4"},
    {"Content-Type", "application/octet-stream"},
    {"Etag", "\"c157a79031e1c40f85931829bc5fc552\""},
    {"Last-Modified", "Thu, 14 Dec 2023 20:33:12 GMT"},
    {"Server", "Tigris OS"},
    {"X-Amz-Content-Sha256",
     "7d865e959b2466918c9863afca942d0fb89d7c9ac0c99bafc3749504ded97730"},
    {"X-Amz-Date", "20231214T203312Z"},
    {"X-Amz-Request-Id", "1702586069668919790"},
    {"Date", "Thu, 14 Dec 2023 20:34:29 GMT"}
  ],
  status_code: 200
}

iex(6)> File.read!("bar.txt") == resp.body

true

# Upload a file

iex(3)> ExAws.S3.Upload.stream_file("Docker.dmg") |> ExAws.S3.upload("foo-bucket", "Docker.dmg") |> ExAws.request!()

%{
  body: %{
    location: "",
    key: "Docker.dmg",
    bucket: "foo-bucket",
    etag: "\"67f4192f94643705f04ce32ae0b09162-111\""
  },
  headers: [
    {"Content-Length", "257"},
    {"Content-Type", "application/xml"},
    {"Server", "Tigris OS"},
    {"X-Amz-Request-Id", "1702663684337450259"},
    {"Date", "Fri, 15 Dec 2023 18:08:04 GMT"}
  ],
  status_code: 200
}
```

# AWS .Net SDK

This guide assumes that you have followed the steps in the
[Getting Started](/docs/get-started/index.md) guide, and have the access keys
available.

You may continue to use the AWS .Net SDK as you normally would, but with the
endpoint set to `https://fly.storage.tigris.dev`.

This example uses the
[AWS .Net SDK v3](https://www.nuget.org/packages/AWSSDK.S3) and reads the
default credentials file or the environment variables `AWS_ACCESS_KEY_ID` and
`AWS_SECRET_ACCESS_KEY`.

```csharp
private static IAmazonS3 s3Client;

public static void Main(string[] args)
{
    var bucketName = "my-bucket-name";

    // Create S3 service client
    s3Client = new AmazonS3Client(new AmazonS3Config
    {
        ServiceURL = "https://fly.storage.tigris.dev"
    });

    // List buckets
    var listResponse = await s3Client.ListBucketsAsync();

    foreach (var s3Bucket in listResponse.Buckets)
    {
        Console.WriteLine("{0}", s3Bucket.BucketName);
    }

    // PutObject
    var putObjectRequest = new PutObjectRequest
    {
        BucketName = bucketName,
        Key = "test_object_key",
        ContentBody = "Test object data",
        UseChunkEncoding = false
    };

    var responsePut = await s3Client.PutObjectAsync(putObjectRequest);

    Console.WriteLine($"PUT {responsePut.ETag}");

    // GetObject
    var getRequest = new GetObjectRequest
    {
        BucketName = bucketName,
        Key = "test_object_key"
    };

    using (var responseGet = await s3Client.GetObjectAsync(getRequest))
    {
        using (var reader = new StreamReader(responseGet.ResponseStream))
        {
            var content = reader.ReadToEnd();
            Console.WriteLine($"GET '{content}'");
        }
    }

    // List objects
    var request = new ListObjectsV2Request
    {
        BucketName = bucketName
    };

    var response = await s3Client.ListObjectsV2Async(request);

    foreach (var s3Object in response.S3Objects)
    {
        Console.WriteLine("{0}", s3Object.Key);
    }
}
```

:::note

Tigris currently does not support chunk encoding. You must set
`UseChunkEncoding` to `false` in the `PutObjectRequest`.

:::

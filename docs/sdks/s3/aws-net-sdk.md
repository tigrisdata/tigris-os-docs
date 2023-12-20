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
    // Create S3 service client
	s3Client = new AmazonS3Client(new AmazonS3Config
		{
			ServiceURL = "https://fly.storage.tigris.dev",
		});

    // List buckets
    var response = await s3Client.ListBucketsAsync();

	foreach (var s3Bucket in response.Buckets)
	{
		Console.WriteLine("{0}", s3Bucket.BucketName);
	}

    // List objects
    var request = new ListObjectsV2Request
	{
		BucketName = "foo-bucket"
	};

	var response = await s3Client.ListObjectsV2Async(request);

	foreach (var s3Object in response.S3Objects)
	{
		Console.WriteLine("{0}", s3Object.Key);
	}
}
```

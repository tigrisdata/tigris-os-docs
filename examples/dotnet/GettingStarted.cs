using Amazon.Runtime;
using Amazon.Runtime.CredentialManagement;
using Amazon.S3;
using Amazon.S3.Model;

IAmazonS3 s3Client = new AmazonS3Client(
    new AmazonS3Config { ForcePathStyle = false, ServiceURL = "https://t3.storageapi.dev" }
);

var bucketName = "tigris-example";

// List buckets
var listResponse = await s3Client.ListBucketsAsync();

Console.WriteLine("Buckets:");
foreach (var s3Bucket in listResponse.Buckets)
{
    Console.WriteLine("* {0}", s3Bucket.BucketName);
}

// PutObject
var putObjectRequest = new PutObjectRequest
{
    BucketName = bucketName,
    Key = "test_object_key",
    ContentBody = "Test object data",
    UseChunkEncoding = false,
};

var responsePut = await s3Client.PutObjectAsync(putObjectRequest);

Console.WriteLine($"PUT {responsePut.ETag}");

// GetObject
var getRequest = new GetObjectRequest { BucketName = bucketName, Key = "test_object_key" };

using (var responseGet = await s3Client.GetObjectAsync(getRequest))
{
    using (var reader = new StreamReader(responseGet.ResponseStream))
    {
        var content = reader.ReadToEnd();
        Console.WriteLine($"GET '{content}'");
    }
}

// List objects
var request = new ListObjectsV2Request { BucketName = bucketName };

var response = await s3Client.ListObjectsV2Async(request);

foreach (var s3Object in response.S3Objects)
{
    Console.WriteLine("{0}", s3Object.Key);
}

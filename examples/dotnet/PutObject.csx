#r "nuget: AWSSDK.S3, 3.7.414.1"

using Amazon.Runtime;
using Amazon.Runtime.CredentialManagement;
using Amazon.S3;
using Amazon.S3.Model;

IAmazonS3 s3Client = new AmazonS3Client(
    new AmazonS3Config { ForcePathStyle = false,  ServiceURL = "https://fly.storage.tigris.dev" }
);

var bucketName = "tigris-example";

// PutObject
var putObjectRequest = new PutObjectRequest
{
    BucketName = bucketName,
    Key = "test_object_key",
    ContentBody = "Test object data",
    // highlight-start
    UseChunkEncoding = false, // <- Required for Tigris
    // highlight-end
};

var responsePut = await s3Client.PutObjectAsync(putObjectRequest);

Console.WriteLine($"PUT {responsePut.ETag}");

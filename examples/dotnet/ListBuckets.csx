#r "nuget: AWSSDK.S3, 3.7.414.1"

using Amazon.Runtime;
using Amazon.Runtime.CredentialManagement;
using Amazon.S3;
using Amazon.S3.Model;

IAmazonS3 s3Client = new AmazonS3Client(
    new AmazonS3Config { ForcePathStyle = false,  ServiceURL = "https://fly.storage.tigris.dev" }
);


// List buckets
var listResponse = await s3Client.ListBucketsAsync();

Console.WriteLine("Buckets:");
foreach (var s3Bucket in listResponse.Buckets)
{
    Console.WriteLine("* {0}", s3Bucket.BucketName);
}

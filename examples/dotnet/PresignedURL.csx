#r "nuget: AWSSDK.S3, 3.7.414.1"

using Amazon;
using Amazon.S3;
using Amazon.S3.Model;

AWSConfigsS3.UseSignatureVersion4 = true;

IAmazonS3 s3Client = new AmazonS3Client(
    new AmazonS3Config { ForcePathStyle = false, ServiceURL = "https://t3.storage.dev" }
);

var bucketName = "tigris-example";
string objectName = "bar.txt";

// get object
GetPreSignedUrlRequest preSignedUrlRequest = new GetPreSignedUrlRequest
{
    BucketName = bucketName,
    Key = objectName,
    Expires = DateTime.UtcNow.AddHours(1),
    Verb = HttpVerb.GET,
};

string preSignedUrl = s3Client.GetPreSignedURL(preSignedUrlRequest);
Console.WriteLine($"Presigned GET URL: {preSignedUrl}");
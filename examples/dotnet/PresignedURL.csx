#r "nuget: AWSSDK.S3, 3.7.414.1"

using Amazon.S3;
using Amazon.S3.Model;
using System.Net;
using System.Net.Http;

IAmazonS3 s3Client = new AmazonS3Client(
    new AmazonS3Config { ForcePathStyle = false,  ServiceURL = "https://fly.storage.tigris.dev" }
);

var bucketName = "tigris-example";
string objectName = Guid.NewGuid().ToString();

// put object
GetPreSignedUrlRequest preSignedUrlRequest = new GetPreSignedUrlRequest
{
    BucketName = bucketName,
    Key = objectName,
    Expires = DateTime.UtcNow.AddHours(1),
    Verb = HttpVerb.PUT,
};

string preSignedUrl = s3Client.GetPreSignedURL(preSignedUrlRequest);
Console.WriteLine($"Presigned PUT URL: {preSignedUrl}");

var client = new HttpClient();
var response = await client.PutAsync(preSignedUrl, new StringContent("Hello, world!"));
if (response.StatusCode != HttpStatusCode.OK)
{
    throw new Exception($"Wrong status code, wanted {HttpStatusCode.OK}, got {response.StatusCode}: {await response.Content.ReadAsStringAsync()}");
}

// presigned get
preSignedUrlRequest = new GetPreSignedUrlRequest
{
    BucketName = bucketName,
    Key = objectName,
    Expires = DateTime.UtcNow.AddHours(1),
};

preSignedUrl = s3Client.GetPreSignedURL(preSignedUrlRequest);
Console.WriteLine($"Presigned GET URL: {preSignedUrl}");

response = await client.GetAsync(preSignedUrl);
if (response.StatusCode != HttpStatusCode.OK)
{
    throw new Exception($"Wrong status code, wanted {HttpStatusCode.OK}, got {response.StatusCode}: {await response.Content.ReadAsStringAsync()}");
}

// delete object
preSignedUrlRequest = new GetPreSignedUrlRequest
{
    BucketName = bucketName,
    Key = objectName,
    Expires = DateTime.UtcNow.AddHours(1),
    Verb = HttpVerb.DELETE,
};

preSignedUrl = s3Client.GetPreSignedURL(preSignedUrlRequest);
Console.WriteLine($"Presigned DELETE URL: {preSignedUrl}");

response = await client.DeleteAsync(preSignedUrl);
if (response.StatusCode != HttpStatusCode.NoContent)
{
    throw new Exception($"Wrong status code, wanted {HttpStatusCode.NoContent}, got {response.StatusCode}: {await response.Content.ReadAsStringAsync()}");
}

# AWS Java SDK

This guide assumes that you have followed the steps in the
[Getting Started](/docs/get-started/index.md) guide, and have the access keys
available.

You may continue to use the AWS Java SDK as you normally would, but with the
endpoint set to Tigris. If you are using Tigris outside of Fly, use the endpoint
[https://t3.storage.dev](https://t3.storage.dev). If you are using Tigris from within
Fly, use the endpoint [https://fly.storage.tigris.dev](https://fly.storage.tigris.dev).

This example uses the [AWS Java SDK v2](https://github.com/aws/aws-sdk-java-v2)

```xml
<dependency>
    <groupId>software.amazon.awssdk</groupId>
    <artifactId>s3</artifactId>
    <version>2.27.22</version>
</dependency>
```

## Getting started

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.AwsCredentials;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.Bucket;

import java.net.URI;
import java.util.List;

public class AWSS3HelloWorld {

    private final S3Client s3Client;

    private static final URI TIGRIS_ENDPOINT_URI = URI.create("https://t3.storage.dev");
    private static final Logger log = LoggerFactory.getLogger(AWSS3HelloWorld.class);

    public AWSS3HelloWorld() {
        AwsCredentials credentials = AwsBasicCredentials.builder()
                .accessKeyId("tid_<>")
                .secretAccessKey("tsec_<>")
                .build();
        s3Client = S3Client.builder()
                .endpointOverride(TIGRIS_ENDPOINT_URI)
                .region(Region.of("auto"))
                .credentialsProvider(() -> credentials)
                .build();
    }

    public void printBucketNames() {
        List<Bucket> buckets = s3Client.listBuckets().buckets();
        for (Bucket bucket : buckets) {
            System.out.println(bucket.name());
        }
    }


    public static void main(String[] args) {
        AWSS3HelloWorld hello = new AWSS3HelloWorld();
        try {
            hello.printBucketNames();
        } catch (Exception e) {
            log.error("Error listing buckets", e);
        }
    }
}

```

## Using Presigned URLs

Presigned URLs can be used with the AWS Java SDK as follows:

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;

import java.net.URI;
import java.time.Duration;

public class AWSS3PresignedURLs {

    private final S3Presigner presigner;

    private static final URI TIGRIS_ENDPOINT_URI = URI.create("https://t3.storage.dev");
    private static final Logger log = LoggerFactory.getLogger(AWSS3PresignedURLs.class);

    public AWSS3PresignedURLs() {
        AwsBasicCredentials awsCredentials = AwsBasicCredentials.create(
                "tid_<>",
                "tsec_<>"
        );
        presigner = S3Presigner.builder()
                .region(Region.of("auto"))
                .credentialsProvider(() -> awsCredentials)
                .endpointOverride(TIGRIS_ENDPOINT_URI)
                .build();
    }

    public String generatePresignedUrl(String bucket, String objectKey) {
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucket)
                .key(objectKey)
                .build();
        PresignedGetObjectRequest presignedGetObjectRequest = presigner.presignGetObject(
                r -> r.signatureDuration(Duration.ofHours(1))
                        .getObjectRequest(getObjectRequest)
        );
        return presignedGetObjectRequest.url().toString();
    }

    public static void main(String[] args) {
        AWSS3PresignedURLs hello = new AWSS3PresignedURLs();
        String url = hello.generatePresignedUrl("your-bucket", "obj-key");
        log.info("pre-signed url: {}", url);
    }
}

```

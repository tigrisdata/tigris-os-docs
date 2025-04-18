const javascript = `import { S3Client, paginateListBuckets } from "@aws-sdk/client-s3";

const S3 = new S3Client({
  region: "auto",
  endpoint: "https://fly.storage.tigris.dev",
  // highlight-start
  s3ForcePathStyle: false,
  // highlight-end
});

const listBuckets = async () => {
  const buckets = [];
  for await (const page of paginateListBuckets({ client: S3 }, {})) {
    if (page.Buckets) {
      buckets.push(...page.Buckets);
    }
  }
  return buckets;
};`;

const bash = `aws configure set aws_access_key_id <access-key>
aws configure set aws_secret_access_key <secret-key>
aws configure set region auto
aws s3 ls --endpoint-url https://fly.storage.tigris.dev
aws s3api create-bucket --bucket <bucket-name> --endpoint-url https://fly.storage.tigris.dev
aws s3api put-object --bucket <bucket-name> --key <key> --body <file> --endpoint-url https://fly.storage.tigris.dev
aws s3api get-object --bucket <bucket-name> --key <key> <file> --endpoint-url https://fly.storage.tigris.dev
aws s3api delete-object --bucket <bucket-name> --key <key> --endpoint-url https://fly.storage.tigris.dev
aws s3api delete-bucket --bucket <bucket-name> --endpoint-url https://fly.storage.tigris.dev
`;

const go = `svc := s3.NewFromConfig(sdkConfig, func(o *s3.Options) {
  // highlight-start
  o.BaseEndpoint = aws.String("https://fly.storage.tigris.dev")
  o.Region = "auto"
  o.UsePathStyle = false
  // highlight-end
})
  
package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

func main() {
	flag.Parse()
	if flag.NArg() != 1 {
		log.Fatalf("usage: %s <bucket>", flag.Arg(0))
	}

	bucketName := flag.Arg(0)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	sdkConfig, err := config.LoadDefaultConfig(ctx)
	if err != nil {
		log.Printf("Couldn't load default configuration. Here's why: %v", err)
		return
	}

	// Create S3 service client
	svc := s3.NewFromConfig(sdkConfig, func(o *s3.Options) {
		o.BaseEndpoint = aws.String("https://fly.storage.tigris.dev")
		o.Region = "auto"
		o.UsePathStyle = false
	})

	// List buckets
	result, err := svc.ListBuckets(ctx, &s3.ListBucketsInput{})
	if err != nil {
		log.Printf("Unable to list buckets. Here's why: %v", err)
		return
	}

	fmt.Println("Buckets:")

	for _, b := range result.Buckets {
		fmt.Printf("* %s created on %s",
			aws.ToString(b.Name), aws.ToTime(b.CreationDate))
		bucketName = aws.ToString(b.Name)
	}
}`;

const java = `import org.slf4j.Logger;
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

    private static final URI TIGRIS_ENDPOINT_URI = URI.create("https://fly.storage.tigris.dev");
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
}`;

const python = `import boto3
from botocore.client import Config

# Create S3 service client
svc = boto3.client(
    's3',
    endpoint_url='https://fly.storage.tigris.dev',
    config=Config(s3={'addressing_style': 'virtual'}),
)

# List buckets
response = svc.list_buckets()

for bucket in response['Buckets']:
    print(f'  {bucket["Name"]}')`;

const php = `<?php
    require 'vendor/autoload.php';

    $bucket_name = 'foo-bucket';

    $s3 = new Aws\S3\S3Client([
        'region' => 'auto',
        'endpoint' => 'https://fly.storage.tigris.dev',
        'version' => 'latest',
    ]);

    # Lists all of your buckets
    print("My buckets now are:");

    $promise = $s3->listBucketsAsync();
    $result = $promise->wait();

    foreach ($result['Buckets'] as $bucket) {
        print($bucket['Name']);
    }
?>`;

const elixir = `import Config

if config_env() == :prod do

  # ....
  # Configure S3 client for access to Tigris
  config :ex_aws,
    debug_requests: true,
    json_codec: Jason,
    access_key_id: {:system, "AWS_ACCESS_KEY_ID"},
    secret_access_key: {:system, "AWS_SECRET_ACCESS_KEY"}

  config :ex_aws, :s3,
    scheme: "https://",
    host: "fly.storage.tigris.dev",
    region: "auto"
    
# List all buckets
all_buckets = ExAws.S3.list_buckets() |> ExAws.request!()

IO.puts("Buckets:")

for bucket <- all_buckets.body.buckets do
  IO.puts(bucket.name)
end`;

const ruby = `s3 = Aws::S3::Client.new(
    region: "auto",
    # highlight-start
    endpoint: "https://fly.storage.tigris.dev",
    force_path_style: false,
    # highlight-end
)
    
require "aws-sdk-s3"

bucket_name = "tigris-example"

s3 = Aws::S3::Client.new(
    region: "auto",
    endpoint: "https://fly.storage.tigris.dev",
)

# Lists all of your buckets
resp = s3.list_buckets
puts "My buckets now are:\n\n"

resp.buckets.each do |bucket|
    puts bucket.name
end`;

const csharp = `using Amazon.Runtime;
using Amazon.Runtime.CredentialManagement;
using Amazon.S3;
using Amazon.S3.Model;

IAmazonS3 s3Client = new AmazonS3Client(
    new AmazonS3Config { ForcePathStyle = false, ServiceURL = "https://fly.storage.tigris.dev" }
);

var bucketName = "tigris-example";

// List buckets
var listResponse = await s3Client.ListBucketsAsync();

Console.WriteLine("Buckets:");
foreach (var s3Bucket in listResponse.Buckets)
{
    Console.WriteLine("* {0}", s3Bucket.BucketName);
}`;

export const codes = {
  bash,
  javascript,
  go,
  java,
  python,
  php,
  elixir,
  ruby,
  csharp,
};

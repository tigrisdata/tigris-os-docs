# AWS PHP SDK

This guide assumes that you have followed the steps in the
[Getting Started](/docs/get-started/index.md) guide, and have the access keys
available.

You may continue to use the AWS PHP SDK as you normally would, but with the
endpoint set to `https://fly.storage.tigris.dev`.

This example uses the
[AWS PHP SDK v3](https://packagist.org/packages/aws/aws-sdk-php) and reads the
default credentials file or the environment variables `AWS_ACCESS_KEY_ID` and
`AWS_SECRET_ACCESS_KEY`.

```php
<?php
    require 'vendor/autoload.php';

    $bucket_name = 'foo-bucket';

    $s3 = new Aws\S3\S3Client([
        'region' => 'auto',
        'endpoint' => 'https://fly.storage.tigris.dev',
        'version' => 'latest',
    ]);

    # Lists all of your buckets
    print("\nMy buckets now are:\n");

    $promise = $s3->listBucketsAsync();
    $result = $promise->wait();

    foreach ($result['Buckets'] as $bucket) {
        print("\n");
        print($bucket['Name']);
    }

    # Put an object into the bucket
    $file_name = "bar-file-" . uniqid();
    try {
        $s3->putObject([
            'Bucket' => $bucket_name,
            'Key' => $file_name,
            'SourceFile' => 'bar.txt'
        ]);
        echo "Uploaded $file_name to $bucket_name.\n";
    } catch (Exception $exception) {
        echo "Failed to upload $file_name with error: " . $exception->getMessage();
        exit("Please fix error with file upload before continuing.");
    }

    try {
        $file = $s3->getObject([
            'Bucket' => $bucket_name,
            'Key' => $file_name,
        ]);
        $body = $file->get('Body');
        $body->rewind();
        echo "Downloaded the file and it begins with: {$body->read(26)}.\n";
    } catch (Exception $exception) {
        echo "Failed to download $file_name from $bucket_name with error: " . $exception->getMessage();
        exit("Please fix error with file downloading before continuing.");
    }

    try {
        $contents = $s3->listObjects([
            'Bucket' => $bucket_name,
        ]);
        echo "The contents of your bucket are: \n";
        foreach ($contents['Contents'] as $content) {
            echo $content['Key'] . "\n";
        }
    } catch (Exception $exception) {
        echo "Failed to list objects in $bucket_name with error: " . $exception->getMessage();
        exit("Please fix error with listing objects before continuing.");
    }
?>
```

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
	})

	// List buckets
	result, err := svc.ListBuckets(ctx, &s3.ListBucketsInput{})
	if err != nil {
		log.Printf("Unable to list buckets. Here's why: %v", err)
		return
	}

	fmt.Println("Buckets:")

	for _, b := range result.Buckets {
		fmt.Printf("* %s created on %s\n",
			aws.ToString(b.Name), aws.ToTime(b.CreationDate))
		bucketName = aws.ToString(b.Name)
	}

	// Upload file
	fmt.Println("Upload file:")

	os.WriteFile("bar.txt", []byte("Hello, World!"), 0644)

	file, err := os.Open("bar.txt")
	if err != nil {
		log.Printf("Couldn't open file to upload. Here's why: %v\n", err)
		return
	} else {
		defer file.Close()
		_, err = svc.PutObject(ctx, &s3.PutObjectInput{
			Bucket: aws.String(bucketName),
			Key:    aws.String("bar.txt"),
			Body:   file,
		})
		if err != nil {
			log.Printf("Couldn't upload file. Here's why: %v\n", err)
		}
	}

	fmt.Println("File uploaded.")

	// List objects
	fmt.Println("List objects:")

	resp, err := svc.ListObjectsV2(ctx, &s3.ListObjectsV2Input{
		Bucket: aws.String(bucketName),
	})
	if err != nil {
		log.Printf("Unable to list objects. Here's why: %v", err)
		return
	}

	if len(resp.Contents) == 0 {
		log.Printf("No objects found in bucket: %s", bucketName)
		return
	}

	fmt.Println("Objects:")
	for _, obj := range resp.Contents {
		fmt.Printf("* %s\n", aws.ToString(obj.Key))
	}

	// Download file
	fmt.Println("Download file:")

	file, err = os.Create("bar.txt")
	if err != nil {
		log.Printf("Couldn't create file to download. Here's why: %v", err)
		return
	}
	defer file.Close()

	_, err = svc.GetObject(ctx, &s3.GetObjectInput{
		Bucket: aws.String(bucketName),
		Key:    aws.String("bar.txt"),
	})
	if err != nil {
		log.Printf("Couldn't download file. Here's why: %v", err)
	}
}

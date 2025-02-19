package main

import (
	"bytes"
	"context"
	"crypto/rand"
	"flag"
	"fmt"
	"io"
	"log"
	"strings"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/aws/aws-sdk-go-v2/service/s3/types"
	"github.com/aws/smithy-go/transport/http"
)

func WithHeader(key, value string) func(*s3.Options) {
	return func(options *s3.Options) {
		options.APIOptions = append(options.APIOptions, http.AddHeaderValue(key, value))
	}
}

func putObjectToMultipleRegions(
	ctx context.Context,
	client *s3.Client,
	bucket, key string,
	data []byte,
	regions []string,
) error {
	_, err := client.PutObject(
		ctx,
		&s3.PutObjectInput{
			Bucket:        aws.String(bucket),
			Key:           aws.String(key),
			Body:          bytes.NewReader(data),
			ContentLength: aws.Int64(int64(len(data))),
		},
		// Restrict in Europe only
		WithHeader("X-Tigris-Regions", strings.Join(regions, ",")),
	)

	return err
}

func putObjectUsingMultipartToMultipleRegions(
	ctx context.Context,
	client *s3.Client,
	bucket, key string,
	data []byte,
	regions []string,
) error {
	co, err := client.CreateMultipartUpload(
		ctx,
		&s3.CreateMultipartUploadInput{
			Bucket: aws.String(bucket),
			Key:    aws.String(key),
		},
		// Restrict in Europe only
		WithHeader("X-Tigris-Regions", strings.Join(regions, ",")),
	)
	if err != nil {
		return err
	}

	uo, err := client.UploadPart(
		ctx,
		&s3.UploadPartInput{
			Bucket:        aws.String(bucket),
			Key:           aws.String(key),
			Body:          bytes.NewReader(data),
			UploadId:      co.UploadId,
			PartNumber:    aws.Int32(1),
			ContentLength: aws.Int64(int64(len(data))),
		},
	)
	if err != nil {
		return err
	}

	_, err = client.CompleteMultipartUpload(
		ctx,
		&s3.CompleteMultipartUploadInput{
			Bucket:   aws.String(bucket),
			Key:      aws.String(key),
			UploadId: co.UploadId,
			MultipartUpload: &types.CompletedMultipartUpload{
				Parts: []types.CompletedPart{
					{ETag: uo.ETag, PartNumber: aws.Int32(1)},
				},
			},
		},
	)

	return err
}

func main() {
	flag.Parse()
	if flag.NArg() != 1 {
		log.Fatalf("usage: %s <bucket>", flag.Arg(0))
	}

	bucketName := flag.Arg(0)
	keyName := "mykey"

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	cfg, err := config.LoadDefaultConfig(ctx)
	if err != nil {
		log.Printf("Couldn't load default configuration. Here's why: %v\n", err)
		return
	}

	// Create S3 service client
	client := s3.NewFromConfig(cfg, func(o *s3.Options) {
		o.BaseEndpoint = aws.String("https://fly.storage.tigris.dev")
		o.Region = "auto"
		o.UsePathStyle = false
	})

	var (
		randData = make([]byte, 16384)
	)

	_, _ = rand.Read(randData)

	fmt.Println("Put object to the EU regions")

	// Put an object to the EU regions
	err = putObjectToMultipleRegions(ctx, client, bucketName, keyName, randData, []string{"eur"})
	if err != nil {
		log.Fatalf("unable to write object: %v", err)
	}

	_, _ = rand.Read(randData)

	fmt.Println("Put object to the US regions")

	// Put an object to the US regions using multipart upload
	err = putObjectUsingMultipartToMultipleRegions(ctx, client, bucketName, keyName, randData, []string{"usa"})
	if err != nil {
		log.Fatalf("unable to write object: %v", err)
	}

	fmt.Println("Read the object back")

	// read the object back
	out, err := client.GetObject(context.TODO(),
		&s3.GetObjectInput{
			Bucket: aws.String(bucketName),
			Key:    aws.String(keyName),
		},
	)
	if err != nil {
		log.Fatalf("unable to read object: %v", err)
	}

	_, err = io.ReadAll(out.Body)
	if err != nil {
		log.Fatalf("unable to read object body: %v", err)
	}
}

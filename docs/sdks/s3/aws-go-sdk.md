# AWS Go SDK

This guide assumes that you have followed the steps in the
[Getting Started](/docs/get-started/index.md) guide, and have the access keys
available.

You may continue to use the AWS Go SDK as you normally would, but with the
endpoint set to `https://fly.storage.tigris.dev`.

This example uses the [AWS Go SDK v2](https://github.com/aws/aws-sdk-go-v2) and
reads the default credentials file or the environment variables
`AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`.

## Getting started

```go
package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

func main() {
	sdkConfig, err := config.LoadDefaultConfig(context.TODO())
	if err != nil {
		log.Printf("Couldn't load default configuration. Here's why: %v\n", err)
		return
	}

	// Create S3 service client
	svc := s3.NewFromConfig(sdkConfig, func(o *s3.Options) {
		o.BaseEndpoint = aws.String("https://fly.storage.tigris.dev")
		o.Region = "auto"
	})

	// List buckets
	result, err := svc.ListBuckets(context.TODO(), &s3.ListBucketsInput{})
	if err != nil {
		log.Printf("Unable to list buckets. Here's why: %v\n", err)
		return
	}

	fmt.Println("Buckets:")

	for _, b := range result.Buckets {
		fmt.Printf("* %s created on %s\n",
			aws.ToString(b.Name), aws.ToTime(b.CreationDate))
	}

	// Upload file
	fmt.Println("Upload file:")

	file, err := os.Open("bar.txt")
	if err != nil {
		log.Printf("Couldn't open file to upload. Here's why: %v\n", err)
		return
	} else {
		defer file.Close()
		_, err = svc.PutObject(context.TODO(), &s3.PutObjectInput{
			Bucket: aws.String("foo-bucket"),
			Key:    aws.String("bar.txt"),
			Body:   file,
		})
		if err != nil {
			log.Printf("Couldn't upload file. Here's why: %v\n", err)
		}
	}
}
```

## Conditional operations

Below is an example of how to use the AWS Go SDK to
[perform conditional operations](/docs/objects/conditionals.md) on objects in
Tigris. The example reads an object, modifies it, and then writes it back to the
bucket. The write operation is conditional on the object not being modified
since it was read.

```go
package main

import (
	"bytes"
	"context"
	"io"
	"log"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/aws/smithy-go/transport/http"
)

func WithHeader(key, value string) func(*s3.Options) {
	return func(options *s3.Options) {
		options.APIOptions = append(options.APIOptions, http.AddHeaderValue(key, value))
	}
}

func IfMatch(value string) func(*s3.Options) {
	return WithHeader("If-Match", value)
}

func main() {
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
	})

	// read
	out, err := client.GetObject(ctx,
		&s3.GetObjectInput{
			Bucket: aws.String("mybucket"),
			Key:    aws.String("mykey"),
		},
		WithHeader("x-tigris-cas", "true"),
	)
	if err != nil {
		log.Fatalf("unable to read object: %v", err)
	}

	body, err := io.ReadAll(out.Body)
	if err != nil {
		log.Fatalf("unable to read object body: %v", err)
	}

	// write
	out1, err := client.PutObject(ctx,
		&s3.PutObjectInput{
			Bucket: aws.String("mybucket"),
			Key:    aws.String("mykey"),
			Body:   bytes.NewBuffer(body),
		},
		IfMatch(*out.ETag),
	)
	if err != nil {
		log.Fatalf("unable to put object, %v", err)
	}
	log.Printf("mykey etag is %s", *out1.ETag)
}
```

## Using presigned URLs

Presigned URLs can be used with the AWS Go SDK as follows:

```go
package main

import (
	"context"
	"log"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	v4 "github.com/aws/aws-sdk-go-v2/aws/signer/v4"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

// Client encapsulates the S3 SDK presign client and provides methods to presign requests.
type Client struct {
	PresignClient *s3.PresignClient
}

// GetObject makes a presigned request that can be used to get an object from a bucket.
func (p *Client) GetObject(
	ctx context.Context,
	bucket string,
	key string,
	expiry time.Duration,
) (*v4.PresignedHTTPRequest, error) {
	request, err := p.PresignClient.PresignGetObject(ctx, &s3.GetObjectInput{
		Bucket: aws.String(bucket),
		Key:    aws.String(key),
	}, func(opts *s3.PresignOptions) {
		opts.Expires = expiry
	})
	if err != nil {
		log.Printf("Couldn't get a presigned request to get %v:%v. Here's why: %v\n",
			bucket, key, err)
	}
	return request, err
}

// PutObject makes a presigned request that can be used to put an object in a bucket.
func (p *Client) PutObject(
	ctx context.Context,
	bucket string,
	object string,
	expiry time.Duration,
) (*v4.PresignedHTTPRequest, error) {
	request, err := p.PresignClient.PresignPutObject(ctx, &s3.PutObjectInput{
		Bucket: aws.String(bucket),
		Key:    aws.String(object),
	}, func(opts *s3.PresignOptions) {
		opts.Expires = expiry
	})
	if err != nil {
		log.Printf("Couldn't get a presigned request to put %v:%v. Here's why: %v\n",
			bucket, object, err)
	}
	return request, err
}

// DeleteObject makes a presigned request that can be used to delete an object from a bucket.
func (p *Client) DeleteObject(ctx context.Context, bucket string, object string) (*v4.PresignedHTTPRequest, error) {
	request, err := p.PresignClient.PresignDeleteObject(ctx, &s3.DeleteObjectInput{
		Bucket: aws.String(bucket),
		Key:    aws.String(object),
	})
	if err != nil {
		log.Printf("Couldn't get a presigned request to delete object %v. Here's why: %v\n", object, err)
	}
	return request, err
}

func main() {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	sdkConfig, err := config.LoadDefaultConfig(ctx)
	if err != nil {
		log.Printf("Couldn't load default configuration. Here's why: %v\n", err)
		return
	}

	// Create S3 service client
	svc := s3.NewFromConfig(sdkConfig, func(o *s3.Options) {
		o.BaseEndpoint = aws.String("https://fly.storage.tigris.dev")
		o.Region = "auto"
	})

	// Presigning a request
	ps := s3.NewPresignClient(svc)
	presigner := &Client{PresignClient: ps}

	// Presigned URL to upload an object to the bucket
	presignedPutReq, err := presigner.PutObject("foo-bucket", "bar.txt", 60)
	if err != nil {
		log.Printf("Couldn't get a presigned request to put bar.txt. Here's why: %v\n", err)
	} else {
		fmt.Printf("Presigned URL for PUT: %s\n", presignedPutReq.URL)
	}

	// Presigned URL to download an object from the bucket
	presignedGetReq, err := presigner.GetObject("foo-bucket", "bar.txt", 60)
	if err != nil {
		log.Printf("Couldn't get a presigned request to get bar.txt. Here's why: %v\n", err)
	} else {
		fmt.Printf("Presigned URL for GET: %s\n", presignedGetReq.URL)
	}
}
```

You can now use the URL returned by the `presignedPutReq.URL` and
`presignedGetReq.URL` to upload or download objects.

## Object Regions

Below is an example of how to use the AWS Go SDK to restrict
[object region](/docs/objects/object_regions) to Europe only (`fra` region).

```go
package main

import (
	"bytes"
	"context"
	"crypto/rand"
	"io"
	"log"

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

func putObjectToMultipleRegions(ctx context.Context, client *s3.Client, bucket string, key string, data []byte) error {
	_, err := client.PutObject(
		ctx,
		&s3.PutObjectInput{
			Bucket:        aws.String(bucket),
			Key:           aws.String(key),
			Body:          bytes.NewReader(data),
			ContentLength: aws.Int64(int64(len(data))),
		},
		// Restrict in Europe only
		WithHeader("X-Tigris-Regions", "fra"),
	)

	return err
}

func putObjectUsingMultipartToMultipleRegions(ctx context.Context, client *s3.Client, bucket string, key string, data []byte) error {
	co, err := client.CreateMultipartUpload(
		ctx,
		&s3.CreateMultipartUploadInput{
			Bucket: aws.String(bucket),
			Key:    aws.String(key),
		},
		// Restrict in Europe only
		WithHeader("X-Tigris-Regions", "fra"),
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
	})

	var (
		bucket   = "mybucket"
		key      = "mykey"
		randData = make([]byte, 16384)
	)

	_, _ = rand.Read(randData)

	// example of multiple regions using put
	err = putObjectToMultipleRegions(ctx, client, bucket, key, randData)
	if err != nil {
		log.Fatalf("unable to write object: %v", err)
	}

	_, _ = rand.Read(randData)
	// example of multiple regions using multipart
	err = putObjectUsingMultipartToMultipleRegions(ctx, client, bucket, key, randData)
	if err != nil {
		log.Fatalf("unable to write object: %v", err)
	}

	// read
	out, err := client.GetObject(context.TODO(),
		&s3.GetObjectInput{
			Bucket: aws.String(bucket),
			Key:    aws.String(key),
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
```

## Metadata Querying

Below is an example of how to use
[metadata querying](/docs/objects/query-metadata) with the AWS Go SDK.

```go
package main

import (
	"bytes"
	"context"
	"crypto/rand"
	"io"
	"log"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/aws/smithy-go/transport/http"
)

func WithHeader(key, value string) func(*s3.Options) {
	return func(options *s3.Options) {
		options.APIOptions = append(options.APIOptions, http.AddHeaderValue(key, value))
	}
}

func main() {
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
	})

	contentType := "text/javascript"
	resp, err := client.ListObjectsV2WithContext(ctx, &s3.ListObjectsV2Input{
		Bucket: "bucket-name",
	}, request.WithSetRequestHeaders(map[string]string{
		"X-Tigris-Query": fmt.Sprintf("`Content-Type` = \"%s\"", contentType),
	}))

	if err != nil {
		log.Fatalf("unable to write object: %v", err)
	}

	for _, doc := range resp.Contents {
		log.Printf("Doc found %s \n", doc.Key)
	}
}

```

## Webhook

Below is an example of how to use
[webhook](/docs/buckets/object-notifications.md) with the AWS Go SDK.

```go
type ObjectNotificationReq struct {
	Events []*ObjectNotificationEvent `json:"events"`
}

type ObjectNotificationEvent struct {
	EventVersion string       `json:"eventVersion"`
	EventSource  string       `json:"eventSource"`
	EventName    string       `json:"eventName"`
	EventTime    string       `json:"eventTime"`
	Bucket       string       `json:"bucket"`
	Object       *EventObject `json:"object"`
}

type EventObject struct {
	Key  string `json:"key"`
	Size int32  `json:"size"`
	ETag string `json:"eTag"`
}

func eventReceiver(w http.ResponseWriter, r *http.Request) {
	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Error reading request body", http.StatusInternalServerError)
		return
	}
	defer r.Body.Close()

	var req ObjectNotificationReq
	err = json.Unmarshal(body, &req)
	if err != nil {
		http.Error(w, "Error unmarshalling request body", http.StatusInternalServerError)
		return
	}

	fmt.Println("Events:")
	for _, event := range req.Events {
		fmt.Printf("time: %v, event: %v, bucket: %v, key: %v\n", event.EventTime, event.EventName, event.Bucket, event.Object.Key)
	}

	fmt.Fprint(w, "ok")
}

func basicAuth(next http.HandlerFunc, username, password string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		auth := r.Header.Get("Authorization")
		if auth == "" {
			w.Header().Set("WWW-Authenticate", `Basic realm="Restricted"`)
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		payload, _ := base64.StdEncoding.DecodeString(strings.TrimPrefix(auth, "Basic "))
		pair := strings.SplitN(string(payload), ":", 2)

		if len(pair) != 2 || subtle.ConstantTimeCompare([]byte(pair[0]), []byte(username)) != 1 || subtle.ConstantTimeCompare([]byte(pair[1]), []byte(password)) != 1 {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		next.ServeHTTP(w, r)
	}
}

func tokenAuth(next http.HandlerFunc, token string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		auth := r.Header.Get("Authorization")
		if auth == "" || !strings.HasPrefix(auth, "Bearer ") || subtle.ConstantTimeCompare([]byte(strings.TrimPrefix(auth, "Bearer ")), []byte(token)) != 1 {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}
		fmt.Println("token auth successful")

		next.ServeHTTP(w, r)
	}
}

func main() {
	http.HandleFunc("/no-auth", eventReceiver)
	http.HandleFunc("/basic-auth", basicAuth(eventReceiver, "user", "pass"))
	http.HandleFunc("/token-auth", tokenAuth(eventReceiver, "secret-token-pass"))

	log.Println("Server running on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
```

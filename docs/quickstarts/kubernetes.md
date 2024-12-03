# Kubernetes Quickstart

If you have a workload in your Kubernetes cluster that uses S3, using Tigris is
a snap! If it works with S3, it'll work on Tigris. At a high level, here’s what
you need to do to get started:

- Create a bucket
- Create a keypair with editor permissions on that bucket
- Put the keypair in a Kubernetes Secret
- Attach that secret to your Kubernetes Deployment’s environment variables

## Create a bucket

First, create a bucket by heading to https://storage.new. Give it a name such as
mybucket and write it down in your notes.

## Create an access key

Next, create an access key by clicking on “Access keys” in the admin dashboard
and then clicking the “Create New Access Key” button. Give it a name and search
for the bucket you just created. Give it editor permissions and click “Create”.
This will give you access key secrets. You will use these secrets in the next
step.

## Kubernetes Secret

Copy the values into a Kubernetes secret like this:

```yaml
# secret-tigris-key-mybucket.yaml
apiVersion: v1
kind: Secret
metadata:
  name: tigris-key-mybucket
type: Opaque
stringData:
  AWS_ACCESS_KEY_ID: tid_...
  AWS_SECRET_ACCESS_KEY: tsec_...
  AWS_ENDPOINT_URL_S3: https://fly.storage.tigris.dev
  AWS_ENDPOINT_URL_IAM: https://fly.iam.storage.tigris.dev
  AWS_REGION: auto
  BUCKET_NAME: mybucket
```

Apply this with `kubectl apply`:

```text
kubectl apply -f secret-tigris-key-mybucket.yaml
```

## Kubernetes Deployment

Open your Kubernetes Deployment and look for where you declare a container for
the Deployment, such as this:

```yaml
# deployment-myapp.yaml
# inside the spec field of a apps/v1 Deployment
containers:
  - name: web
    image: myuser/myimage
    envFrom:
      - secretRef:
          name: tigris-key-mybucket # the name of the secret
```

Then apply the changes with `kubectl apply`:

```text
kubectl apply -f deployment-myapp.yaml
```

That's it! Now your workload is running fast without egress fees on Tigris.

# Storing Model Weights in Tigris

The most common way to deploy AI models in production is by using “serverless”
inference. This means that every time you get a request, you don’t know what
state the underlying hardware is in. You don’t know if you have your models
cached, and in the worst case you need to do a cold start and download your
model weights from scratch.

This is typically done with the Hugging Face CDN, but sometimes that’s just not
fast enough, you don’t want to distribute your private model weights over a
third party, or compliance issues force you to make sure that your model weights
live and die in a single part of the globe. Remember, while your instances are
sitting there pulling model weights from the cloud, you're burning GPU spend.
Time is money.

## Usecase

You can put AI model weights into Tigris so that they are cached and fast no
matter where you’re inferencing from. This allows you to have cold starts be
faster and you can take advantage of Tigris'
[globally distributed pull-through caching architecture](/docs/overview/),
enabling your workloads to start quickly no matter where they are in the world.

## Getting Started

For this example, we’ll set up
[SDXL Lightning](https://huggingface.co/ByteDance/SDXL-Lightning) by ByteDance
for inference with the weights stored in Tigris.

Create two new buckets:

1. One bucket will be for generated images, it’ll be called `generated-images`
   in this article
2. One bucket will be for storing models, it’ll be called `model-storage` in
   this article

Both of these buckets should be private.

Download the `sdxl-in-tigris` template from GitHub:

```text
git clone https://github.com/tigrisdata-community/sdxl-in-tigris
```

Enter the folder in a terminal window.

If you have [Homebrew](https://brew.sh) installed on macOS or Linux, run
`brew bundle` to automatically install all of the dependencies. If you don't,
here's what you need to install via your package manager of choice:

- Python 3.11 (the minor version matters, the patch version can and will vary)
- pipenv
- [Replicate's cog tool](https://github.com/replicate/cog)
- The AWS CLI
- The Hugging Face CLI
- [jq](https://jqlang.github.io/jq/)

Configure the AWS CLI for use with Tigris:
[Configuring the AWS CLI](/docs/sdks/s3/aws-cli/).

If you are on a Mac, Install the
[Docker Desktop app](https://www.docker.com/products/docker-desktop/). This will
not work with alternatives such as Podman Desktop.

Then activate the virtual environment with `pipenv shell` and install the
dependencies for uploading a model:

```text
pipenv shell --python 3.11
pip install -r requirements.txt
```

Then run the script to upload a model:

```text
python scripts/prepare_model.py ByteDance/SDXL-Lightning model-storage
```

This will take a bit to run, depending on your internet connection speed, hard
drive speed, and the current phase of the moon.

While it’s running, head to the Tigris console and create a new access key, give
it the following permissions:

- Read-only on your `model-storage` bucket
- Editor on your `generated-images` bucket

Copy the access key ID and secret access keys into either your notes or a
password manager, you will not be able to see them again. These credentials will
be used later to deploy your app in the cloud. This keypair will be referred to
as the `runner-keypair` in this tutorial.

Once it’s done, you’ll have everything in Tigris and get a list of environment
variables:

```text
  AWS_ACCESS_KEY_ID=<key from earlier>
  AWS_SECRET_ACCESS_KEY=<key from earlier>
  AWS_ENDPOINT_URL_S3=https://fly.storage.tigris.dev
  AWS_REGION=auto
  MODEL_BUCKET_NAME=model-storage
  MODEL_PATH=ByteDance/SDXL-Lightning
```

:::info

Want differently styled images? Try finetunes like
[Kohaku XL](https://huggingface.co/KBlueLeaf/Kohaku-XL-Zeta)! Pass the Hugging
Face repo name to the `prepare_model` script like this:

```text
python scripts/prepare_model.py KBlueLeaf/Kohaku-XL-Zeta model-storage
```

:::

## Deploying it

In order to deploy this, you need to build the image with the cog tool. Log into
a Docker registry and run this command to build and push it:

```text
cog push your-docker-username/sdxl-tigris --use-cuda-base-image false
```

You can now use it with your GPU host of choice as long as it supports Cuda 12.1
and has at least 12 GB of video memory.

This example is configured with environment variables. Set the following
environment variables in your deployments:

|             Envvar name | Value                                                  |
| ----------------------: | :----------------------------------------------------- |
|     `AWS_ACCESS_KEY_ID` | The access key ID from the runner keypair              |
| `AWS_SECRET_ACCESS_KEY` | The secret access key from the runner keypair          |
|   `AWS_ENDPOINT_URL_S3` | `https://fly.storage.tigris.dev`                       |
|            `AWS_REGION` | `auto`                                                 |
|            `MODEL_PATH` | `ByteDance/SDXL-Lightning`                             |
|     `MODEL_BUCKET_NAME` | `model-storage` (replace with your own bucket name)    |
|    `PUBLIC_BUCKET_NAME` | `generated-images` (replace with your own bucket name) |

You can run this on any platform you want that has the right GPUs, however we
have tutorials for a few platforms to try:

- [Fly.io](./fly-io)
- [Vast.ai](./vast-ai)

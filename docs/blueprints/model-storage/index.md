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
[Flux.1 [schnell]](https://huggingface.co/black-forest-labs/FLUX.1-schnell) by
Black Forest Labs for inference with the weights stored in Tigris.

Create two new buckets:

1. One bucket will be for generated flux images, it’ll be called
   `generated-images` in this article
2. One bucket will be for storing models, it’ll be called `model-storage` in
   this article

Both of these buckets should be private.

Download the flux-in-tigris template from GitHub:

```text
git clone https://github.com/tigrisdata-community/flux-in-tigris
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
python scripts/prepare_model.py black-forest-labs/FLUX.1-schnell model-storage
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
  MODEL_PATH=black-forest-labs/FLUX.1-schnell
```

## Deploying it

In order to deploy this, you need to build the image with the cog tool. Log into
a Docker registry and run this command to build and push it:

```text
cog push your-docker-username/flux-tigris --use-cuda-base-image false
```

You can now use it with your GPU host of choice as long as it supports Cuda 12.1
and has at least 80 GB of video memory.

This example is configured with environment variables. Set the following
environment variables in your deployments:

|             Envvar name | Value                                                  |
| ----------------------: | :----------------------------------------------------- |
|     `AWS_ACCESS_KEY_ID` | The access key ID from the runner keypair              |
| `AWS_SECRET_ACCESS_KEY` | The secret access key from the runner keypair          |
|   `AWS_ENDPOINT_URL_S3` | `https://fly.storage.tigris.dev`                       |
|            `AWS_REGION` | `auto`                                                 |
|     `MODEL_BUCKET_NAME` | `model-storage` (replace with your own bucket name)    |
|            `MODEL_PATH` | `black-forest-labs/FLUX.1-schnell`                     |
|    `PUBLIC_BUCKET_NAME` | `generated-images` (replace with your own bucket name) |

### fly.io

First, create a new app for this to live in:

```text
fly apps create your-app-name-here
```

Then create a GPU machine with an a100-80gb GPU in it:

```text
fly machine run \
  -a your-app-name-here \
  --name fluxschnell \
  -e AWS_ACCESS_KEY_ID=<runner-keypair-access-key-id> \
  -e AWS_SECRET_ACCESS_KEY=<runner-keypair-secret-access-key> \
  -e AWS_ENDPOINT_URL_S3=https://fly.storage.tigris.dev \
  -e AWS_REGION=auto \
  -e MODEL_BUCKET_NAME=model-storage \
  -e PUBLIC_BUCKET_NAME=generated-images \
  -e MODEL_PATH=black-forest-labs/FLUX.1-schnell \
  --vm-gpu-kind a100-80gb \
  -r sjc \
  your-docker-username/flux-tigris:latest \
  -- python -m cog.server.http --host ::
```

This will print a machine IP like this:

```text
Machine started, you can connect via the following private ip
  fdaa:0:641b:a7b:165:347b:d972:2
```

Then proxy to the machine:

```text
fly proxy -a your-app-name-here \
  5001:5000 \
  fdaa:0:641b:a7b:165:347b:d972:2
```

Then you need to wait a few minutes while the machine sets itself up. It's done
when it prints this line in the logs:

```text
{"logger": "cog.server.probes", "timestamp": "2024-10-22T17:36:06.651457Z", "severity": "INFO", "message": "Not running in Kubernetes: disabling probe helpers."}
```

Do a test generation with this curl command:

```text
curl "http://localhost:5001/predictions/$(uuidgen)" \
  -X PUT \
  -H "Content-Type: application/json" \
  --data-binary '{
    "input": {
        "prompt": "The word 'success' in front of the Space Needle, anime depiction, best quality",
        "aspect_ratio": "16:9",
        "guidance_scale": 3.5,
        "num_inference_steps": 50,
        "max_sequence_length": 512,
        "output_format": "png",
        "num_outputs": 1
    }
}'
```

If all goes well, you should get an image like this:

![The word 'success' in front of the Space Needle](./success.webp)

You can destroy the machine with this command:

```text
fly machine destroy --force -a your-app-name-here fluxschnell
```

### Skypilot

TODO(Xe): all of this

### Vast.ai

Create an account on [Vast.ai](https://vast.ai) and load it with credit if you
don't have one already. You should need at least $5 of credit to complete this
blueprint.

In your virtual environment that you used to optimize your model, install the
`vastai` CLI tool:

```text
pip install --upgrade vastai;
```

Follow Vast.ai's instructions on
[how to load your API key](https://cloud.vast.ai/cli/).

Then you need to find an instance. This example requires a GPU with 80 GB of
vram. Use this command to find a suitable host:

```text
vastai search offers 'verified=true cuda_max_good>=12.1 gpu_ram>=64 num_gpus=1 inet_down>=850' -o 'dph+'
```

The first column is the instance ID for the launch command. You can use this to
assemble your launch command. It will be made up out of the following:

- The docker image name you pushed to the docker hub (or another registry)
- The "environment" string with your exposed ports and environment variables
- A signal to the runtime that we need 48 GB of disk space to run this app
- The onstart command telling the runtime to start the cog process

Format all of your environment variables as you would in a `docker run` command.
EG:

```text
"-p 5000:5000 -e AWS_ACCESS_KEY_ID=<runner-keypair-access-key-id> -e AWS_SECRET_ACCESS_KEY=<runner-keypair-secret-access-key> -e AWS_ENDPOINT_URL_S3=https://fly.storage.tigris.dev -e AWS_REGION=auto -e MODEL_BUCKET_NAME=model-storage -e MODEL_PATH=black-forest-labs/FLUX.1-schnell -e PUBLIC_BUCKET_NAME=generated-images"
```

Then execute the launch command:

```text
vastai create instance \
  <id-from-search> \
  --image your-docker-username/flux-tigris:latest \
  --env "-p 5000:5000 -e AWS_ACCESS_KEY_ID=<runner-keypair-access-key-id> -e AWS_SECRET_ACCESS_KEY=<runner-keypair-secret-access-key> -e AWS_ENDPOINT_URL_S3=https://fly.storage.tigris.dev -e AWS_REGION=auto -e MODEL_BUCKET_NAME=model-storage -e MODEL_PATH=black-forest-labs/FLUX.1-schnell -e PUBLIC_BUCKET_NAME=generated-images" \
  --disk 48 \
  --onstart-cmd "python -m cog.server.http"
```

It will report success with a message like this:

```text
Started. {'success': True, 'new_contract': 13288520}
```

The `new_contract` field is your instance ID.

Give it a moment to download and start up. If you want to check on it, run this
command:

```text
vastai logs <instance-id>
```

It's done when it prints this line in the logs:

```text
{"logger": "cog.server.probes", "timestamp": "2024-10-22T17:36:06.651457Z", "severity": "INFO", "message": "Not running in Kubernetes: disabling probe helpers."}
```

Then fetch the IP address and port for your app with this command:

```text
vastai show instance <instance-id> --raw | jq -r '"\(.public_ipaddr):\(.ports["5000/tcp"][0].HostPort)"'
```

Finally, run a test generation with this curl command:

```text
curl "http://ip:port/predictions/$(uuidgen)" \
  -X PUT \
  -H "Content-Type: application/json" \
  --data-binary '{
    "input": {
        "prompt": "The word 'success' in front of the Space Needle, anime depiction, best quality",
        "aspect_ratio": "16:9",
        "guidance_scale": 3.5,
        "num_inference_steps": 50,
        "max_sequence_length": 512,
        "output_format": "png",
        "num_outputs": 1
    }
}'
```

If all goes well, you should get an image like this:

![The word 'success' in front of the Space Needle](./success.webp)

You can destroy the machine with this command:

```text
vastai destroy instance <instance-id>
```

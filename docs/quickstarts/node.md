# Node Quickstart

This project is a simple web application that demonstrates how to upload files
to a Tigris storage bucket and manage them. It is a web server using Express
that serves up a single web page, preconfigured to deploy to Fly.io.

All of the code in index.mjs is heavily commented to better help you understand
what each section is doing.

![Node Quickstart](/img/quickstart/app.png)

## How to deploy this project

This project is designed to be easily deployed to Fly.io.

Before you get started, make sure you have a [Fly.io](https://fly.io/) account
and the [fly CLI](https://fly.io/docs/flyctl/install/) installed on your
computer.

Start by cloning the project to your computer:

```bash
git clone https://github.com/tigrisdata-community/tigris-node-quickstart.git
```

Open the repository in the editor of your choice. Since all applications on Fly
need to be globally unique, change the value of app in the fly.toml file before
attempting to deploy:

```toml
# ...
app = 'tigris-node-quickstart' # Update this
# ...
```

Once updated, run the following command to configure the app in your Fly
account, accepting the defaults when prompted:

```bash
fly launch
```

Take note of the URL to access your app:

```bash
Visit your newly deployed app at https://{APP_NAME}.fly.dev/
```

Before you can access the app, you'll need to configure the Tigris storage
bucket. Run the following command to create the bucket and set the necessary
environment variables on your Fly app. Accept the defaults when prompted.

```bash
fly storage create
```

Now navigate to the URL from the previous step and you should be presented with
the app.

# Node Quickstart

Tigris is a globally distributed S3-compatible object storage service that
provides zero egress fees and automatic multi-region replication. This project
is a simple web application that demonstrates how to upload objects to a Tigris
bucket and manage them using Node.js. It's built using Next.js router and
includes implementation of both APIs and client.

![Node Quickstart](/img/quickstart/app.png)

Start by cloning the project to your computer:

```bash
git clone https://github.com/tigrisdata-community/storage-sdk-examples
```

## Running project locally

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Configure environment variables:** Copy `.env.example` to `.env` and update
   with your Tigris credentials. These credentials allow your Node.js
   application to authenticate with Tigris's S3-compatible API:

   ```bash
   TIGRIS_STORAGE_ACCESS_KEY_ID=your-tigris-key-id
   TIGRIS_STORAGE_SECRET_ACCESS_KEY=your-tigris-access-key
   TIGRIS_STORAGE_BUCKET=your-bucket-name
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   ```

4. **Open your browser:** Navigate to
   [http://localhost:3000](http://localhost:3000)

## How to deploy this project

This project is designed to be easily deployed to Vercel. Since Tigris is
globally distributed with a single global endpoint, your deployed application
will automatically connect to the nearest region for low-latency object storage
access.

To deploy on Vercel:

1. Push the updated code to your GitHub/GitLab
2. Import project in Vercel dashboard
3. Add environment variables in Vercel settings:

```env
- TIGRIS_STORAGE_ACCESS_KEY_ID
- TIGRIS_STORAGE_SECRET_ACCESS_KEY
- TIGRIS_STORAGE_BUCKET
```

4. Deploy!

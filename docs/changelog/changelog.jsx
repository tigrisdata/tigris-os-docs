import React from "react";
import styles from "./styles.module.css";
import Timeline from "@site/src/components/Changelog";
import BlogPostPreview from "@site/src/components/BlogPostPreview";

export const changelogData = [
  {
    date: "August 15, 2025",
    title: "Org admins can enforce two-factor auth under organization settings",
    content: (
      <>
        <p>
          Administrators can configure organizations to require two-factor
          authentication. In order to use this, you must be using a native
          Tigris organization, not one created with fly.io.
        </p>
        <p>
          {/* eslint-disable-next-line @typescript-eslint/no-var-requires */}
          <img
            src={require("./assets/2025/08/mfa-enforcement.webp").default}
            alt='A screen recording of clicking the "Enable MFA" button in the Web Console. Clicking on it triggers a toast that says MFA settings are updated successfully.'
          />
        </p>
      </>
    ),
    subcategories: [
      {
        title: "Fixes",
        items: [
          {
            title: "IAM policies are now required to have valid S3 actions",
            description: (
              <>
                <p>
                  Previously you were able to put any S3 or IAM action into
                  policy documents. Tigris now enforces that these be one of the{" "}
                  <a href="/docs/iam/policies/">supported policy actions</a>.
                </p>
              </>
            ),
            tag: { label: "IAM", color: "red" },
            defaultOpen: true,
          },
        ],
      },
      {
        title: "Improvements",
        items: [
          {
            title: "Access key flows have been updated",
            description: (
              <>
                <p>
                  New screens and flows have been added for access key
                  management.
                </p>
              </>
            ),
            tag: { label: "Web Console", color: "orange" },
          },
          {
            title: "IAM Policies can now be directly attached to keys",
            description: (
              <>
                {/* eslint-disable-next-line @typescript-eslint/no-var-requires */}
                <img
                  src={
                    require("./assets/2025/08/iam-access-key-linking.webp")
                      .default
                  }
                />
              </>
            ),
            tag: { label: "Web Console", color: "orange" },
          },
          {
            title:
              "Each bucket has a breakdown of how much data is stored in each storage tier",
            description: (
              <>
                {/* eslint-disable-next-line @typescript-eslint/no-var-requires */}
                <img
                  className={styles.deemphasize}
                  src={
                    require("./assets/2025/08/bucket-tier-size.webp").default
                  }
                />
              </>
            ),
            tag: { label: "Web Console", color: "orange" },
          },
        ],
      },
    ],
  },
  {
    date: "July 15, 2025",
    title: "Benchmarks",
    content: (
      <>
        <p>
          We've been hearing from a lot of teams using Tigris for low-latency
          workloads consisting of billions of tiny files--think logs, AI feature
          payloads, or metadata. We published a benchmark comparing Tigris to
          AWS S3 and Cloudflare R2 using a mixed workload of 10 million 1 KB
          objects, 80% reads and 20% writes.
        </p>
        <p>The results are compelling:</p>
        <ul>
          <li>
            Tigris is 86.6x faster than R2 and 5.3x faster than S3 at the 90th
            percentile for read latency.
          </li>
          <li>
            Throughput under mixed workloads is 4x higher than S3 and 20x higher
            than R2.
          </li>
          <li>
            Writes are consistently low-latency, with P90 latencies under 17 ms.
          </li>
        </ul>
        <p>
          These gains come from architectural choices designed specifically for
          small-object performance: inline storage for tiny objects,
          log-structured caching, and coalesced key layouts that reduce IOPS
          pressure at scale.
        </p>

        <BlogPostPreview
          href="https://www.tigrisdata.com/blog/benchmark-small-objects/"
          title="Tigris Benchmark: 86× Faster Than R2 for Small Objects"
          description="Deep dive into how Tigris achieves sub-10ms read latencies and key-value store-like throughput for small object workloads. Includes detailed methodology, results, and instructions to reproduce the benchmarks yourself."
          imageSrc={require("./assets/2025/07/benchmark-science.jpg").default}
          imageAlt="An anthropomorphic tiger in a lab coat doing science things in a laboratory."
          buttonText="Read the Benchmarks"
          author="Tigris Engineering"
          date="July 2025"
        />
      </>
    ),
    subcategories: [
      {
        title: "Improvements",
        items: [
          {
            title: "IAM Policy Builder",
            description: (
              <>
                <p>
                  Wanted to build your own IAM policies but didn&apos;t know
                  where to start? Use the new IAM policy builder to make your
                  own policies from scratch.
                </p>
              </>
            ),
            tag: { label: "IAM", color: "red" },
            defaultOpen: true,
          },
          {
            title: "Presigned Multipart Uploads",
            description: (
              <>
                <p>
                  Multipart uploads now work with{" "}
                  <a href="https://www.tigrisdata.com/docs/objects/presigned/">
                    presigned URLs
                  </a>
                  , including for buckets with custom domains set. This allows
                  you to distribute presigned URLs to clients and have them do
                  the upload so it will always upload to the closest Tigris
                  region.
                </p>
              </>
            ),
            tag: { label: "Presigned URLs", color: "green" },
          },
          {
            title: "Delete Protection",
            description: (
              <>
                Accidents happen, but some accidents are easier to undo than
                others. Tigris now offers{" "}
                <a href="https://www.tigrisdata.com/docs/buckets/settings/#delete-protection">
                  deletion protection
                </a>{" "}
                to prevent any users from deleting any objects in a bucket.
              </>
            ),
            tag: { label: "Web Console", color: "orange" },
          },
          {
            title: "User Invites to Tigris Organizations",
            description: (
              <>
                <p>
                  Getting your team spun up is easier than ever! Invite your
                  coworkers right from the web console, use enhanced tools to
                  manage your organization, and more.
                </p>
              </>
            ),
            tag: { label: "Web Console", color: "orange" },
          },
        ],
      },
    ],
  },
  {
    date: "June 15, 2025",
    title: "TigrisFS",
    content: (
      <>
        <p>
          We built TigrisFS to simplify AI data handling. If you’re working on
          training, inference, or pipelines, you shouldn’t have to wrestle with
          NFS, blobfuse, or layers of complexity just to get your storage
          working.
        </p>
        <p>
          TigrisFS gives you familiar file APIs with the scale, performance, and
          reliability of object storage:
        </p>
        <ul>
          <li>No complex intermediate layers</li>
          <li>Use the S3 API or the Filesystem interface interchangeably</li>
          <li>
            Run globally, co-located with compute (CoreWeave, Together, Lambda,
            etc.)
          </li>
        </ul>
        <p>
          Just mount your bucket and work with your data like it's stored
          locally.
        </p>

        <BlogPostPreview
          href="https://www.tigrisdata.com/blog/tigrisfs/"
          title="TigrisFS"
          description="We've open-sourced TigrisFS — our native filesystem that makes global data from anywhere in the world instantly accessible– from your local file system."
          imageSrc={require("./assets/2025/06/tigrisfs.webp").default}
          imageAlt="A tiger in a datacenter with a bucket of data."
          buttonText="Read the Blog"
          author="Tigris Engineering"
          date="June 2025"
        />
      </>
    ),
    subcategories: [
      {
        title: "Improvements",
        items: [
          {
            title: "Object file upload experience",
            description: (
              <>
                <p>
                  We removed the file size limit and the number of files
                  restrictions. Overall, we improved the experience of uploading
                  new objects with progress bars, and a drag and drop
                  experience.
                </p>
              </>
            ),
            tag: { label: "Web Console", color: "green" },
          },
        ],
      },
    ],
  },
  {
    date: "May 15, 2025",
    title: "Native Sign-up",
    content: (
      <>
        <p>
          You can now sign in to Tigris with Google, GitHub, or an email and
          password. Accounts and billing can be managed directly within Tigris,
          without relying on an external provider.
        </p>

        <ul>
          <li>
            <strong>User invitations:</strong> Added support for inviting users
            to join organizations through a new invitation flow.
          </li>
          <li>
            <strong>Organization management:</strong> Members can now be managed
            directly under <em>Settings</em>.
          </li>
          <li>
            <strong>Billing updates:</strong>
            <ul>
              <li>
                Stripe <em>Make a Payment</em> option added under the Usage
                section
              </li>
              <li>Invoices view added</li>
              <li>
                Native billing management now available under <em>Settings</em>
              </li>
            </ul>
          </li>
          <li>
            <strong>Membership management:</strong> Added ability to manage user
            membership to organizations directly within Tigris.
          </li>
        </ul>

        <BlogPostPreview
          href="https://console.tigris.dev/"
          title="Native Sign-up"
          description="Sign in to Tigris natively using your email and password, Google, or GitHub."
          imageSrc={require("./assets/2025/05/native-signup.webp").default}
          imageAlt="The Tigris signup page."
          buttonText="Sign-up"
          author="Tigris Engineering"
          date="May 2025"
        />
      </>
    ),
    subcategories: [
      {
        title: "Improvements",
        items: [
          {
            title: "Rename objects in place",
            description: (
              <>
                <p>
                  Pass an <code>X-Tigris-Rename</code> header on{" "}
                  <code>CopyObject</code> to rename objects without rewriting
                  data.
                </p>
              </>
            ),
            tag: { label: "API", color: "blue" },
          },
          {
            title: "Presigned URLs maximum expiration time is 90 days",
            description: (
              <>
                <p>
                  {" "}
                  <a href="https://www.tigrisdata.com/docs/objects/presigned/">
                    Presigned URLs
                  </a>
                  can now be set to a maximum of 90 days expiration.
                </p>
              </>
            ),
            tag: { label: "Presigned URLs", color: "green" },
          },
        ],
      },
    ],
  },
  {
    date: "April 15, 2025",
    title: "Object Lifecycle Rules",
    content: (
      <>
        <p>
          Configure object lifecycle rules on your bucket settings, and Tigris
          will automatically move data from the standard tier to an archive or
          infrequent access tier. Or, set an expiration rule to automatically
          delete data after a certain period of time.
        </p>
        <p>
          We also added a new storage tier: Archive with instant retrieval. This
          is a low-cost storage tier for data that is accessed very infrequently
          but needs to be available quickly when needed. This is ideal for data
          that is needed for compliance or archival purposes but rarely
          accessed.
        </p>
        <p>
          {/* eslint-disable-next-line @typescript-eslint/no-var-requires */}
          <img
            src={require("./assets/2025/04/storage-tiers.webp").default}
            alt="The storage tiers selection page in the web console."
          />
        </p>
        <BlogPostPreview
          href="https://www.tigrisdata.com/blog/lifecycle-rules/"
          title="Object Lifecycle Rules"
          description="Automatically move data between storage tiers."
          imageSrc={require("./assets/2025/04/storage-tiers-blog.webp").default}
          imageAlt="Object Lifecycle Rules"
          buttonText="Read the Blog"
          author="Tigris Engineering"
          date="April 2025"
        />
      </>
    ),
  },
  {
    date: "April 15, 2025",
    title: "Bucket sharing",
    content: (
      <>
        <p>
          You can share your buckets with a single button in the admin console.
          This lets you bypass all of the IAM cruft and just give access with
          ease. We&apos;re surprised that adding a share button is a meaningful
          developer experience than juggling those IAM policies around, but
          we&apos;re happy to simplify your workflow.
        </p>
        <p>
          {/* eslint-disable-next-line @typescript-eslint/no-var-requires */}
          <img
            src={require("./assets/2025/04/bucket-sharing.webp").default}
            alt='A screen recording of adding a user to a bucket and hitting the "save" button.'
          />
        </p>
        <BlogPostPreview
          href="https://www.tigrisdata.com/blog/bucket-sharing/"
          title="Bucket Sharing"
          description="Share your buckets with a single button in the admin console."
          imageSrc={
            require("./assets/2025/04/bucket-sharing-blog.webp").default
          }
          imageAlt="Bucket sharing"
          buttonText="Read the Blog"
          author="Tigris Engineering"
          date="April 2025"
        />
      </>
    ),
    subcategories: [
      {
        title: "Improvements",
        items: [
          {
            title:
              "Multiple files can be uploaded at once in the admin console",
            description: (
              <>
                <p>
                  Upload multiple files at the same time with the new upload
                  dialog in the admin console. Just drag and drop.
                </p>
              </>
            ),
            tag: { label: "Web Console", color: "orange" },
          },
          {
            title: "Multiple files can be selected and deleted",
            description: (
              <>
                <p>Select multiple files and delete them all at once.</p>
              </>
            ),
            tag: { label: "Web Console", color: "orange" },
          },
          {
            title: "Faster API endpoint",
            description: (
              <>
                <p>
                  If your app is deployed outside of{" "}
                  <a href="https://fly.io">Fly.io</a>, we&apos;ve launched a new
                  high-performance endpoint just for you:{" "}
                  <code>https://t3.storage.dev</code>. No access key changes
                  required, it&apos;s got the same data you&apos;re used to,
                  it&apos;s just much faster.
                </p>
              </>
            ),
            tag: { label: "API", color: "blue" },
            defaultOpen: true,
          },
          {
            title: "Any bucket can use any custom domain name",
            description: (
              <>
                <p>
                  We&apos;ve{" "}
                  <a href="https://www.tigrisdata.com/blog/bucket-domain-names/">
                    decoupled custom domains from bucket names
                  </a>{" "}
                  so you can point a new domain to your bucket without having to
                  move all your data to another bucket.
                </p>
              </>
            ),
            tag: { label: "API", color: "blue" },
          },
        ],
      },
    ],
  },
  {
    date: "March 15, 2025",
    title: "MCP server",
    content: (
      <>
        <p>
          We have an MCP server! This lets your editor tap into Tigris so that
          you can manage your buckets in natural language.
        </p>
        <p>
          <img
            src={require("./assets/2025/03/mcp-server.webp").default}
            alt="A screen recording of an interaction with the Tigris MCP server running in Cursor."
          />
        </p>

        <BlogPostPreview
          href="https://www.tigrisdata.com/blog/mcp-server/"
          title="The Tigris MCP Server"
          description="Use your AI editor to manage your buckets in natural language."
          imageSrc={require("./assets/2025/03/mcp-server-blog.webp").default}
          imageAlt="The Tigris MCP Server"
          buttonText="Read the Blog"
          author="Tigris Engineering"
          date="March 2025"
        />
      </>
    ),
    subcategories: [
      {
        title: "Improvements",
        items: [
          {
            title: "Buckets can be created in strict consistency mode",
            description: (
              <>
                <p>
                  Buckets can be created in{" "}
                  <a href="https://www.tigrisdata.com/docs/objects/consistency/">
                    strict consistency mode
                  </a>
                  . This serializes Tigris operations to a single region, which
                  can help with very real-time very globally distributed
                  usecases.
                </p>
              </>
            ),
            tag: { label: "API", color: "blue" },
          },
        ],
      },
    ],
  },
  {
    date: "February 15, 2025",
    title: "Partner Integration API",
    content: (
      <>
        <p>
          Our{" "}
          <a href="https://www.tigrisdata.com/docs/partner-integrations/">
            Partner Integration Program
          </a>{" "}
          lets you offer Tigris as a storage service to your customers.
          We&apos;ve published details about the API in the{" "}
          <a href="https://www.tigrisdata.com/docs/partner-integrations/api/">
            Partner Integrations API reference guide
          </a>
          . This lets you handle billing, invoice management, and usage tracking
          for many tenants.
        </p>
      </>
    ),
    subcategories: [
      {
        title: "Fixes",
        items: [
          {
            title: "Disallow public path access",
            description: (
              <>
                <p>
                  After an incident, we&apos;ve{" "}
                  <a href="https://www.tigrisdata.com/blog/virtual-hosted-urls/">
                    disabled public path-based access on new buckets
                  </a>
                  . If this change affects you, please contact us.
                </p>
              </>
            ),
            tag: { label: "API", color: "green" },
          },
        ],
      },
      {
        title: "Improvements",
        items: [
          {
            title: "Bucket creation validation and error handling",
            description: (
              <>
                <p>
                  We&apos;ve made it more obvious when you try to create a
                  bucket that contains forbidden terms.
                </p>
              </>
            ),
            tag: { label: "API", color: "green" },
          },
          {
            title:
              "Object region information is now visible in the admin console",
            description: (
              <>
                <p>
                  Looking at the details for an object in the admin console
                  shows you where the object was originally uploaded to:
                </p>
                <p>
                  <img
                    src={require("./assets/2025/02/object-region.webp").default}
                    alt="A screenshot of an HTML table showing information for a 139KB webp file stored in Chicago."
                  />
                </p>
              </>
            ),
          },
        ],
      },
    ],
  },
];

export default function Changelog() {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <p className={styles.subtitle}>
            What&apos;s changed in Tigris? Look here to find out! This is where
            we document all of the changes to Tigris, its infrastructure, and
            other things that you&apos;ll find relevant for your work.
          </p>
        </header>
        <Timeline changelogData={changelogData} />
      </div>
    </div>
  );
}

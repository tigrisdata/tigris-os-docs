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

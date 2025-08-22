import React from 'react';
import styles from "./styles.module.css";
import Timeline from "@site/src/components/Changelog";

export const changelogData = [
  {
    date: "August 15, 2025",
    title: "Org admins can enforce two-factor auth under organization settings",
    content: (
      <>
        <p>Administrators can configure organizations to require two-factor authentication. In order to use this, you must be using a native Tigris organization, not one created with fly.io.</p>
        <p>
          {/* eslint-disable-next-line @typescript-eslint/no-var-requires */}
          <img src={require("./assets/2025/08/mfa-enforcement.webp").default} alt='A screen recording of clicking the "Enable MFA" button in the Web Console. Clicking on it triggers a toast that says MFA settings are updated successfully.' />
        </p>
      </>
    ),
    subcategories: [
      {
        title: "Fixes",
        items: [
          {
            title: "IAM policies are now required to have valid S3 actions.",
            description: (
              <>
                <p>Previously you were able to put any S3 or IAM action into policy documents. Tigris now enforces that these be one of the <a href="/docs/iam/policies/">supported policy actions</a>.</p>
              </>
            ),
            tag: { label: "IAM", color: "red" }
          },
        ]
      },
      {
        title: "Improvements",
        items: [
          {
            title: "Access key flows have been updated",
            description: (
              <>
                <p>New screens and flows have been added for access key management.</p>
              </>
            ),
            tag: { label: "Web Console", color: "orange" }
          },
          {
            title: "IAM Policies can now be directly attached to keys",
            description: (
              <>
                {/* eslint-disable-next-line @typescript-eslint/no-var-requires */}
                <img src={require("./assets/2025/08/iam-access-key-linking.webp").default} />
              </>
            ),
            tag: { label: "Web Console", color: "orange" }
          },
          {
            title: "Each bucket has a breakdown of how much data is stored in each storage tier.",
            description: (
              <>
                {/* eslint-disable-next-line @typescript-eslint/no-var-requires */}
                <img className={styles.deemphasize} src={require("./assets/2025/08/bucket-tier-size.webp").default} />
              </>
            ),
            tag: { label: "Web Console", color: "orange" }
          },
        ]
      },
    ]
  },
];

export default function Changelog() {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <p className={styles.subtitle}>What&apos;s changed in Tigris? Look here to find out! This is where we document all of the changes to Tigris, its infrastructure, and other things that you'll find relevant for your work.</p>
        </header>
        <Timeline changelogData={changelogData} />
      </div>
    </div>
  );
}
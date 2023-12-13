import React from "react";
import Layout from "@theme/Layout";

import {
  HomepageCard as Card,
  HomepageSection as Section,
} from "../components/HomepageComponents";
import { YellowStar, GreenStar } from "../icons";

import SDKCards from "../components/SDKCards";

export default function Homepage() {
  return (
    <Layout
      description="Globally Distributed S3-Compatible Object Storage 🚀"
      wrapperClassName="homepage"
    >
      <div className="pad">
        <div className="center homepage-content">
          <div id="hero">
            <h1>Tigris Documentation</h1>
            <p>
              Tigris is a globally distributed S3-compatible object storage
              service that provides low latency anywhere in the world. Tigris
              enables developers to quickly and easily store and access any
              amount of data for a wide range of use cases.
            </p>
          </div>

          <Section title="Features" id="features" HeadingTag="h2">
            <Card
              title="Single Global Endpoint"
              description="No need to think about regions or perform any operations to make data available close to the users. Tigris automatically stores the data close to the users and distributes it to regions based on the request pattern."
              to="/concepts/features/#single-global-endpoint"
              icon={<YellowStar />}
            />
            <Card
              title="Store Data Near Users"
              description="No need to implement caching or data replication from one region to another. Tigris automatically caches frequently accessed data close to the users ensuring low latency anywhere."
              to="/concepts/features/#store-data-near-users"
              icon={<GreenStar />}
            />
            <Card
              title="S3 Compatible API"
              description="Continue using the standard AWS S3 SDKs and libraries as usual. The S3-compatible API allows you to access the wide range of available S3 tools, libraries, and extensions."
              to="/api/s3/"
              icon={<YellowStar />}
            />
            <Card
              title="Fast Small Object Retrieval"
              description="Significantly lower latency for small object as compared to S3. Tigris allows you to use the same data storage for both small and large objects."
              to="/concepts/features/#fast-small-object-retrieval"
              icon={<GreenStar />}
            />
          </Section>

          <Section title="Get to know Tigris" HeadingTag="h2">
            <Card
              title="Get Started"
              description="Essential guide to get you up and running quickly"
              to="/get-started/"
            />
            <Card
              title="Concepts"
              description="Learn about the core Tigris concepts"
              to="/concepts/features/"
            />
          </Section>
          <SDKCards />
        </div>
      </div>
    </Layout>
  );
}

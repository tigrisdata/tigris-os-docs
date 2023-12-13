import React from "react";
import Layout from "@theme/Layout";

import {
  HomepageCard as Card,
  HomepageSection as Section,
} from "../components/HomepageComponents";
import { GreenStar } from "../icons";

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
              description="Seamless global access to object storage with our single global endpoint."
              to="/concepts/overview/#single-global-endpoint"
              icon={<GreenStar />}
            />
            <Card
              title="Store Data Near Users"
              description="Data stored close to the users automatically ensuring low latency everywhere."
              to="/concepts/overview/#store-data-near-users"
              icon={<GreenStar />}
            />
            <Card
              title="S3 Compatible API"
              description="Global and fast object storage with familiar AWS S3 tools, libraries, and extensions."
              to="/api/s3/"
              icon={<GreenStar />}
            />
            <Card
              title="Fast Small Object Retrieval"
              description="SAccess small objects at close to Redis speed, ensuring swift, efficient retrieval."
              to="/concepts/overview/#fast-small-object-retrieval"
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
              to="/concepts/overview/"
            />
          </Section>
          <SDKCards />
        </div>
      </div>
    </Layout>
  );
}

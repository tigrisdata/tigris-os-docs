import React from "react";
import Layout from "@theme/Layout";

import {
  HomepageCard as Card,
  HomepageSection as Section,
} from "../components/HomepageComponents";
import { GreenStar } from "../icons";

import SDKCards from "../components/SDKCards";

import HeroImgUrl from "@site/static/img/hero.png";

export default function Homepage() {
  return (
    <Layout
      description="Globally Distributed S3-Compatible Object Storage 🚀"
      wrapperClassName="homepage"
    >
      <div className="pad">
        <div className="center homepage-content">
          <div id="hero">
            <h1>Tigris Developer Documentation</h1>
            <p>
              Tigris is a globally distributed S3-compatible object storage
              service that provides low latency anywhere in the world. Tigris
              enables you to quickly and easily store and access any amount of
              data for a wide range of use cases. Tigris automatically
              distributes your data close to the users, and removes the
              complexities of data replication, and caching. As Tigris supports
              the S3 API, you can use the wide range of available S3 tools,
              libraries, and extensions.
            </p>

            <div style={{ display: "flex" }}>
              <img
                src={HeroImgUrl}
                alt="Tigris Hero"
                style={{ alignSelf: "center" }}
              />
            </div>
          </div>

          <Section title="Get to know Tigris" HeadingTag="h2">
            <Card
              title="Get Started"
              description="Essential guide to get you up and running quickly"
              to="/get-started/"
            />
            <Card
              title="Overview"
              description="Learn about the core Tigris concepts"
              to="/overview/"
            />
            <Card
              title="About"
              description="Learn about Tigris' founding story"
              to="/about/"
            />
          </Section>

          <Section title="Features" id="features" HeadingTag="h2">
            <Card
              title="Single Global Endpoint"
              description="Seamless global access to object storage with our single global endpoint."
              to="/overview/#single-global-endpoint"
              icon={<GreenStar />}
            />
            <Card
              title="Store Data Near Users"
              description="Data stored close to the users automatically ensuring low latency everywhere."
              to="/overview/#store-data-near-users"
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
              description="Access small objects at close to Redis speed, ensuring swift, efficient retrieval."
              to="/overview/#fast-small-object-retrieval"
              icon={<GreenStar />}
            />
            <Card
              title="Public Buckets"
              description="Public buckets allow you to share data with anyone, anywhere."
              to="/buckets/public-bucket/"
              icon={<GreenStar />}
            />
          </Section>

          <SDKCards />
        </div>
      </div>
    </Layout>
  );
}

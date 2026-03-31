import React from "react";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import "./styles.css";

/* eslint-disable react/prop-types */
function FeatureTile({ icon, title, description, to }) {
  const darkIcon = useBaseUrl(icon ? `${icon}.svg` : null);
  const lightIcon = useBaseUrl(icon ? `${icon}-light.svg` : null);

  return (
    <Link to={to} className="feature-tile">
      {icon && (
        <div className="feature-tile-icon">
          <img src={darkIcon} className="dark" alt="" />
          <img src={lightIcon} className="light" alt="" />
        </div>
      )}
      <span className="feature-tile-label">{title}</span>
      {description && (
        <span className="feature-tile-description">{description}</span>
      )}
    </Link>
  );
}

export default function FeaturesGrid() {
  return (
    <div className="features-grid-wrapper">
      <h2 className="features-grid-title">Features</h2>
      <div className="features-grid">
        <FeatureTile
          icon="img/lightning"
          title="Global Distribution"
          description="Data automatically stored close to users for low latency everywhere."
          to="/overview/#global-low-latency-access"
        />
        <FeatureTile
          icon="img/lightning"
          title="S3 Compatible"
          description="Use your existing AWS tools, SDKs, and libraries with a one-line change."
          to="/api/s3/"
        />
        <FeatureTile
          icon="img/lightning"
          title="Zero Egress"
          description="Free data transfer out — no bandwidth charges, no surprise bills."
          to="https://www.tigrisdata.com/pricing/#zero-egress-fees"
        />
        <FeatureTile
          icon="img/lightning"
          title="Geo-Redundant"
          description="Built-in redundancy across regions with strong consistency."
          to="/buckets/locations/"
        />
        <FeatureTile
          icon="img/lightning"
          title="Storage Tiers"
          description="Standard, infrequent access, and archive tiers to optimize costs."
          to="/objects/tiers/"
        />
        <FeatureTile
          icon="img/lightning"
          title="Snapshots & Forks"
          description="Instant zero-copy clones for dev, testing, and rollback."
          to="/snapshots-and-forks/"
        />
      </div>
      <Link to="/overview/features/" className="features-grid-link">
        Explore features &rarr;
      </Link>
    </div>
  );
}

import React from "react";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import "./styles.css";

/* eslint-disable react/prop-types */
function FeatureTile({ icon, title, to }) {
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
          to="/overview/#global-low-latency-access"
        />
        <FeatureTile icon="img/lightning" title="S3 Compatible" to="/api/s3/" />
        <FeatureTile
          icon="img/lightning"
          title="Zero Egress"
          to="https://www.tigrisdata.com/pricing/#zero-egress-fees"
        />
        <FeatureTile
          icon="img/lightning"
          title="Geo-Redundant"
          to="/buckets/locations/"
        />
        <FeatureTile
          icon="img/lightning"
          title="Storage Tiers"
          to="/objects/tiers/"
        />
        <FeatureTile
          icon="img/lightning"
          title="Snapshots & Forks"
          to="/snapshots-and-forks/"
        />
      </div>
      <Link to="/overview/features/" className="features-grid-link">
        Explore features &rarr;
      </Link>
    </div>
  );
}

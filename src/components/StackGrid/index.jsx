import React from "react";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import "./styles.css";

/* eslint-disable react/prop-types */
export function StackTile({ icon, title, to }) {
  const darkIcon = useBaseUrl(icon ? `${icon}.svg` : null);
  const lightIcon = useBaseUrl(icon ? `${icon}-light.svg` : null);

  return (
    <Link to={to} className="stack-tile">
      {icon && (
        <div className="stack-tile-icon">
          <img src={darkIcon} className="dark" alt="" />
          <img src={lightIcon} className="light" alt="" />
        </div>
      )}
      <span className="stack-tile-label">{title}</span>
    </Link>
  );
}

export default function StackGrid() {
  return (
    <div className="stack-grid-wrapper">
      <h2 className="stack-grid-title">Get started with your stack</h2>
      <p className="stack-grid-subtitle">
        Use your favorite language and framework.
      </p>
      <div className="stack-grid">
        <StackTile
          icon="img/icons/python"
          title="Python"
          to="/quickstarts/python/"
        />
        <StackTile
          icon="img/icons/pytorch"
          title="PyTorch"
          to="/quickstarts/pytorch/"
        />
        <StackTile icon="img/icons/golang" title="Go" to="/quickstarts/go/" />
        <StackTile
          icon="img/icons/javascript"
          title="Node"
          to="/quickstarts/node/"
        />
        <StackTile
          icon="img/icons/kubernetes"
          title="Kubernetes"
          to="/quickstarts/kubernetes/"
        />
        <StackTile
          icon="img/icons/terraform"
          title="Terraform"
          to="/terraform/"
        />
        <StackTile
          icon="img/icons/rclone"
          title="rclone"
          to="/quickstarts/rclone/"
        />
      </div>
    </div>
  );
}

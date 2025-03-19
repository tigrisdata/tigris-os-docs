import React from "react";
import { PageMetadata } from "@docusaurus/theme-common";
import { useDoc } from "@docusaurus/plugin-content-docs/client"; // Updated import for useDoc
import { getImage } from "../../share-image";

export default function DocItemMetadata() {
  const { metadata, frontMatter } = useDoc();
  return (
    <PageMetadata
      title={metadata.title}
      description={metadata.description}
      keywords={frontMatter.keywords}
      image={getImage(metadata)}
    />
  );
}

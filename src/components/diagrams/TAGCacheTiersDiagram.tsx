import React from "react";
import ExcalidrawDiagram from "./ExcalidrawDiagram";
import elements from "./data/cache-tiers.json";

export default function TAGCacheTiersDiagram() {
  return <ExcalidrawDiagram elements={elements} />;
}

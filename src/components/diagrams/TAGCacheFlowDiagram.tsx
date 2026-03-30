import React from "react";
import ExcalidrawDiagram from "./ExcalidrawDiagram";
import elements from "./data/tag-cache-flow.json";

export default function TAGCacheFlowDiagram() {
  return <ExcalidrawDiagram elements={elements} />;
}

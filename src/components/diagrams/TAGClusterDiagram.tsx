import React from "react";
import ExcalidrawDiagram from "./ExcalidrawDiagram";
import elements from "./data/cluster.json";

export default function TAGClusterDiagram() {
  return <ExcalidrawDiagram elements={elements} />;
}

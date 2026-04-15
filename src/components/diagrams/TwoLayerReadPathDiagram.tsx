import React from "react";
import ExcalidrawDiagram from "./ExcalidrawDiagram";
import elements from "./data/two-layer-read-path.json";

export default function TwoLayerReadPathDiagram() {
  return <ExcalidrawDiagram elements={elements} />;
}

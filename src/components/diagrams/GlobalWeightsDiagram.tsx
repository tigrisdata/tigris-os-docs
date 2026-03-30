import React from "react";
import ExcalidrawDiagram from "./ExcalidrawDiagram";
import elements from "./data/global-weights.json";

export default function GlobalWeightsDiagram() {
  return <ExcalidrawDiagram elements={elements} />;
}

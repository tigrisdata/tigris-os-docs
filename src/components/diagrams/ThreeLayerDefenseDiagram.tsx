import React from "react";
import ExcalidrawDiagram from "./ExcalidrawDiagram";
import elements from "./data/three-layer-defense.json";

export default function ThreeLayerDefenseDiagram() {
  return <ExcalidrawDiagram elements={elements} />;
}

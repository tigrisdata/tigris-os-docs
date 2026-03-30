import React from "react";
import ExcalidrawDiagram from "./ExcalidrawDiagram";
import elements from "./data/tag-overview.json";

export default function TAGModelServingDiagram() {
  return <ExcalidrawDiagram elements={elements} />;
}

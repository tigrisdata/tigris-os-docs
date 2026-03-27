import React from "react";
import ExcalidrawDiagram from "./ExcalidrawDiagram";
import elements from "./data/architecture-internals.json";

export default function TAGArchitectureInternalsDiagram() {
  return <ExcalidrawDiagram elements={elements} />;
}

import React from "react";
import ExcalidrawDiagram from "./ExcalidrawDiagram";
import elements from "./data/ducklake-architecture.json";

export default function DuckLakeArchitectureDiagram() {
  return <ExcalidrawDiagram elements={elements} />;
}

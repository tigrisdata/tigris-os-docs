import React from "react";
import ExcalidrawDiagram from "./ExcalidrawDiagram";
import elements from "./data/direct-access.json";

export default function DirectAccessDiagram() {
  return <ExcalidrawDiagram elements={elements} />;
}

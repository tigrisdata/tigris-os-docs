import React from "react";
import ExcalidrawDiagram from "./ExcalidrawDiagram";
import elements from "./data/multitenant-storage.json";

export default function MultitenantStorageDiagram() {
  return <ExcalidrawDiagram elements={elements} />;
}

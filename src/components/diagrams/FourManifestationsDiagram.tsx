import React from "react";
import ExcalidrawDiagram from "./ExcalidrawDiagram";
import elements from "./data/four-manifestations.json";

export default function FourManifestationsDiagram() {
  return <ExcalidrawDiagram elements={elements} />;
}

import React from "react";
import ExcalidrawDiagram from "./ExcalidrawDiagram";
import elements from "./data/preload-hpc.json";

export default function PreloadHPCDiagram() {
  return <ExcalidrawDiagram elements={elements} />;
}

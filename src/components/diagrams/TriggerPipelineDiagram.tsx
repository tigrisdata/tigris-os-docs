import React from "react";
import ExcalidrawDiagram from "./ExcalidrawDiagram";
import elements from "./data/trigger-pipeline.json";

export default function TriggerPipelineDiagram() {
  return <ExcalidrawDiagram elements={elements} />;
}

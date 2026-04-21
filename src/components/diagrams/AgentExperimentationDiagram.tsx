import React from "react";
import ExcalidrawDiagram from "./ExcalidrawDiagram";
import elements from "./data/agent-experimentation.json";

export default function AgentExperimentationDiagram() {
  return <ExcalidrawDiagram elements={elements} />;
}

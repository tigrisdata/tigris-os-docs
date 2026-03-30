import React from "react";
import ExcalidrawDiagram from "./ExcalidrawDiagram";
import elements from "./data/agent-sandbox.json";

export default function AgentSandboxDiagram() {
  return <ExcalidrawDiagram elements={elements} />;
}

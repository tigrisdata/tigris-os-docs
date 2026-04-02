import React from "react";
import ExcalidrawDiagram from "./ExcalidrawDiagram";
import elements from "./data/agent-coordination.json";

export default function AgentCoordinationDiagram() {
  return <ExcalidrawDiagram elements={elements} />;
}

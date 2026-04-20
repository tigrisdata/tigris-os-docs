import React from "react";
import ExcalidrawDiagram from "./ExcalidrawDiagram";
import elements from "./data/agent-recovery.json";

export default function AgentRecoveryDiagram() {
  return <ExcalidrawDiagram elements={elements} />;
}

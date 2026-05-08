import React from "react";
import ExcalidrawDiagram from "./ExcalidrawDiagram";
import elements from "./data/agent-mastra.json";

export default function AgentMastraDiagram() {
  return <ExcalidrawDiagram elements={elements} />;
}

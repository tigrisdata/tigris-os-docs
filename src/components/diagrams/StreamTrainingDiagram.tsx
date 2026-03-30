import React from "react";
import ExcalidrawDiagram from "./ExcalidrawDiagram";
import elements from "./data/stream-training.json";

export default function StreamTrainingDiagram() {
  return <ExcalidrawDiagram elements={elements} />;
}

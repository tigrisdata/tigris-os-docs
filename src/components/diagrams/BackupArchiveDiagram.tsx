import React from "react";
import ExcalidrawDiagram from "./ExcalidrawDiagram";
import elements from "./data/backup-archive.json";

export default function BackupArchiveDiagram() {
  return <ExcalidrawDiagram elements={elements} />;
}

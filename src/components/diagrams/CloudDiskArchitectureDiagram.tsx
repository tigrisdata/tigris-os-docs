import React from "react";

// Faithful port of the cloud-disk site's "architecture at a glance" diagram:
// a vertical stack of boxes (app → block device → cloud-disk engine with its
// cache layers → bucket) joined by labeled arrows. Styled with Infima theme
// variables so it tracks light/dark like the rest of the docs.

const C = {
  border: "var(--ifm-color-emphasis-300)",
  box: "var(--ifm-color-emphasis-100)",
  accent: "var(--ifm-color-primary)",
  surface: "var(--ifm-background-surface-color)",
  muted: "var(--ifm-color-emphasis-700)",
};

const node: React.CSSProperties = {
  border: `1px solid ${C.border}`,
  borderRadius: 10,
  padding: ".55rem .9rem",
  textAlign: "center",
  background: C.box,
  fontSize: ".92rem",
};

const plain: React.CSSProperties = {
  ...node,
  background: "transparent",
  borderStyle: "dashed",
  color: C.muted,
};

const engine: React.CSSProperties = {
  ...node,
  padding: ".7rem .8rem .8rem",
  borderColor: C.accent,
};

const engineTitle: React.CSSProperties = {
  fontWeight: 600,
  color: C.accent,
  marginBottom: ".55rem",
  fontFamily: "var(--ifm-font-family-monospace)",
};

const layer: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: "1rem",
  alignItems: "baseline",
  border: `1px solid ${C.border}`,
  borderRadius: 7,
  background: C.surface,
  padding: ".4rem .7rem",
  marginTop: ".45rem",
  fontSize: ".88rem",
  textAlign: "left",
};

const bucket: React.CSSProperties = {
  ...node,
  borderColor: C.accent,
  fontWeight: 600,
};

function Layer({ name, note }: { name: string; note: string }) {
  return (
    <div style={layer}>
      <b style={{ fontWeight: 600, whiteSpace: "nowrap" }}>{name}</b>
      <span style={{ color: C.muted, fontSize: ".84rem", textAlign: "right" }}>
        {note}
      </span>
    </div>
  );
}

function Arrow({ label }: { label?: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        color: C.muted,
        lineHeight: 1,
        padding: ".15rem 0",
      }}
    >
      {label && (
        <span style={{ fontSize: ".8rem", padding: ".15rem 0 .1rem" }}>
          {label}
        </span>
      )}
      <span style={{ width: 2, height: 14, background: C.border }} />
      <span style={{ fontSize: ".6rem", marginTop: 1 }}>▼</span>
    </div>
  );
}

export default function CloudDiskArchitectureDiagram() {
  return (
    <div
      style={{
        margin: "1.5rem auto",
        maxWidth: 480,
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
      }}
    >
      <div style={plain}>application · filesystem · database</div>
      <Arrow />
      <div style={node}>Linux block device</div>
      <Arrow />
      <div style={engine}>
        <div style={engineTitle}>cloud-disk</div>
        <Layer name="memory cache" note="hot reads + write coalescing" />
        <Layer name="local disk cache" note="warm reads, survives remounts" />
      </div>
      <Arrow label="flush commits to the bucket" />
      <div style={bucket}>
        your Tigris bucket
        <span
          style={{
            display: "block",
            fontWeight: 400,
            color: C.muted,
            fontSize: ".84rem",
          }}
        >
          source of truth
        </span>
      </div>
    </div>
  );
}

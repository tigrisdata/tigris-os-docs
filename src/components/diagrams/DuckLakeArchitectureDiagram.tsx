import React from "react";

const STYLES = `
  .dl text { font-family: "Hanken Grotesk", system-ui, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif; }
  .dl .title { font-size: 22px; fill: #c8d6de; font-weight: 600; }
  .dl .subtitle { font-size: 14px; fill: #94a3b8; }
  .dl .zone-title { font-size: 18px; fill: #62FEB5; font-weight: 600; }
  .dl .zone-sub { font-size: 13px; fill: #94a3b8; }
  .dl .node-label { font-size: 16px; fill: #e2e8f0; font-weight: 600; }
  .dl .node-sub { font-size: 13px; fill: #94a3b8; }
  .dl .arrow-label { font-size: 15px; fill: #c8d6de; font-weight: 600; }
  .dl .arrow-sub { font-size: 12px; fill: #8fa3b0; font-style: italic; }
  .dl .bullet { font-size: 15px; fill: #e2e8f0; }
  .dl .annotation { font-size: 13px; fill: #8fa3b0; font-style: italic; }
  .dl .node { fill: #142229; stroke: #2a4050; stroke-width: 1.5; }
  .dl .zone-catalog { fill: #142229; stroke: #2a4050; stroke-width: 1.5; }
  .dl .zone-tigris { fill: #142229; stroke: #62FEB5; stroke-width: 1.5; stroke-opacity: 0.7; }
  .dl .parquet { fill: rgba(98, 254, 181, 0.08); stroke: rgba(98, 254, 181, 0.55); stroke-width: 1.25; }
`;

export default function DuckLakeArchitectureDiagram() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 960 520"
      width="100%"
      style={{ background: "transparent" }}
      className="dl"
    >
      <style>{STYLES}</style>
      <defs>
        <marker
          id="dl-arrow"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="5"
          orient="auto"
        >
          <path d="M0,0 L10,5 L0,10 Z" fill="#62FEB5" />
        </marker>
      </defs>

      {/* Header */}
      <text x="480" y="34" textAnchor="middle" className="title">
        DuckLake on Tigris
      </text>
      <text x="480" y="58" textAnchor="middle" className="subtitle">
        SQL catalog for metadata · object storage for data
      </text>

      {/* DuckDB process node */}
      <rect
        x="370"
        y="84"
        width="220"
        height="84"
        rx="10"
        ry="10"
        className="node"
      />
      <text x="480" y="118" textAnchor="middle" className="node-label">
        DuckDB process
      </text>
      <text x="480" y="142" textAnchor="middle" className="node-sub">
        laptop · Lambda · CI
      </text>

      {/* Arrow to catalog (metadata) */}
      <line
        x1="430"
        y1="172"
        x2="245"
        y2="238"
        stroke="#62FEB5"
        strokeWidth="2"
        markerEnd="url(#dl-arrow)"
      />
      <text x="200" y="215" textAnchor="middle" className="arrow-label">
        metadata
      </text>

      {/* Arrow to bucket (data) */}
      <line
        x1="530"
        y1="172"
        x2="715"
        y2="238"
        stroke="#62FEB5"
        strokeWidth="2"
        markerEnd="url(#dl-arrow)"
      />
      <text x="760" y="215" textAnchor="middle" className="arrow-label">
        data
      </text>

      {/* Catalog database zone */}
      <rect
        x="40"
        y="234"
        width="400"
        height="252"
        rx="12"
        ry="12"
        className="zone-catalog"
      />
      <text x="240" y="268" textAnchor="middle" className="zone-title">
        Catalog database
      </text>
      <text x="240" y="290" textAnchor="middle" className="zone-sub">
        Postgres · DuckDB file · MySQL · SQLite
      </text>

      <g transform="translate(80, 320)">
        <circle cx="0" cy="0" r="4" fill="#62FEB5" />
        <text x="16" y="5" className="bullet">
          tables and schemas
        </text>
      </g>
      <g transform="translate(80, 355)">
        <circle cx="0" cy="0" r="4" fill="#62FEB5" />
        <text x="16" y="5" className="bullet">
          snapshots (versions of the lake)
        </text>
      </g>
      <g transform="translate(80, 390)">
        <circle cx="0" cy="0" r="4" fill="#62FEB5" />
        <text x="16" y="5" className="bullet">
          file references
        </text>
      </g>

      <text x="240" y="455" textAnchor="middle" className="annotation">
        Coordinates concurrent writers
      </text>

      {/* Tigris bucket zone */}
      <rect
        x="520"
        y="234"
        width="400"
        height="252"
        rx="12"
        ry="12"
        className="zone-tigris"
      />
      <text x="720" y="268" textAnchor="middle" className="zone-title">
        Tigris bucket
      </text>
      <text x="720" y="290" textAnchor="middle" className="zone-sub">
        s3://my-bucket/lake/
      </text>

      <rect
        x="548"
        y="320"
        width="112"
        height="96"
        rx="10"
        ry="10"
        className="parquet"
      />
      <text x="604" y="356" textAnchor="middle" className="node-label">
        Parquet
      </text>
      <text x="604" y="378" textAnchor="middle" className="node-sub">
        snap 1
      </text>

      <rect
        x="668"
        y="320"
        width="112"
        height="96"
        rx="10"
        ry="10"
        className="parquet"
      />
      <text x="724" y="356" textAnchor="middle" className="node-label">
        Parquet
      </text>
      <text x="724" y="378" textAnchor="middle" className="node-sub">
        snap 2
      </text>

      <rect
        x="788"
        y="320"
        width="112"
        height="96"
        rx="10"
        ry="10"
        className="parquet"
      />
      <text x="844" y="356" textAnchor="middle" className="node-label">
        Parquet
      </text>
      <text x="844" y="378" textAnchor="middle" className="node-sub">
        snap 3
      </text>

      <text x="720" y="455" textAnchor="middle" className="annotation">
        Immutable — written, never rewritten
      </text>

      {/* Footnote */}
      <text x="480" y="508" textAnchor="middle" className="subtitle">
        Each INSERT writes one new Parquet file and one new snapshot row.
      </text>
    </svg>
  );
}

import React from "react";
import "./styles.css";

const CURSOR_URL =
  "cursor://anysphere.cursor-deeplink/mcp/install?name=tigris&config=eyJ1cmwiOiJodHRwczovL21jcC5zdG9yYWdlLmRldi9tY3AifQ%3D%3D";

const VSCODE_URL =
  "vscode:mcp/install?%7B%22name%22%3A%22tigris%22%2C%22type%22%3A%22http%22%2C%22url%22%3A%22https%3A%2F%2Fmcp.storage.dev%2Fmcp%22%7D";

const CLAUDE_URL = "/docs/mcp/remote/#claude-desktop";

const ALL_INTEGRATIONS_URL = "/docs/mcp/remote/";

function CursorIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 256 256"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M209.74 45.16L164.84 90.06L75.44 22.32L47.74 36.52L114.42 114.52L24 147.8L24 176.2L114.08 155.2L47.74 219.48L75.44 233.68L187.64 140.16L209.74 118.06L232 95.8L232 67.34L209.74 45.16Z"
        fill="currentColor"
      />
    </svg>
  );
}

function VSCodeIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M95.4 16.4L71.9 5L29.7 42.1L12.3 28.3L4.6 31.9V68.1L12.3 71.7L29.7 57.9L71.9 95L95.4 83.6V16.4ZM29.7 62.6L12.3 50V50L29.7 37.4V62.6ZM71.9 77.4L42.1 50L71.9 22.6V77.4Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ClaudeIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M15.3 3.8C14.2 3.3 13.1 3 12 3C7 3 3 7 3 12s4 9 9 9c1.1 0 2.2-.3 3.3-.8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="9" cy="10" r="1.2" fill="currentColor" />
      <circle cx="13.5" cy="10" r="1.2" fill="currentColor" />
      <path
        d="M18.5 7.5L19.5 4M20 9L23 8M20.5 12L23 13"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function MCPInstallBox() {
  return (
    <aside className="mcp-install-box" aria-label="Quick install MCP server">
      <div className="mcp-install-box-header">
        <span className="mcp-install-box-eyebrow">Quick install</span>
        <h3 className="mcp-install-box-title">Add Tigris MCP to your editor</h3>
        <p className="mcp-install-box-subtitle">
          One click connects your editor to the hosted Tigris MCP server. No
          configuration required.
        </p>
      </div>

      <div className="mcp-install-box-buttons">
        <a href={CURSOR_URL} className="mcp-install-btn">
          <CursorIcon />
          <span>Add to Cursor</span>
        </a>
        <a href={VSCODE_URL} className="mcp-install-btn">
          <VSCodeIcon />
          <span>Add to VS Code</span>
        </a>
        <a href={CLAUDE_URL} className="mcp-install-btn">
          <ClaudeIcon />
          <span>Add to Claude</span>
        </a>
      </div>

      <a href={ALL_INTEGRATIONS_URL} className="mcp-install-box-link">
        See all integrations &rarr;
      </a>
    </aside>
  );
}

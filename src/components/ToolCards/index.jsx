import React from "react";
import Link from "@docusaurus/Link";
import CodeBlock from "@theme/CodeBlock";
import "./styles.css";

const sdkCode = `npm install @tigris/sdk`;

const cliOutput = `$ tigris create-bucket assets
  Creating bucket 'assets'...
  ✓ Bucket created successfully`;

function ToolCard({ icon, title, description, to, children }) {
  return (
    <Link to={to} className="tool-card">
      <div className="tool-card-header">
        <div className="tool-card-icon">{icon}</div>
        <div className="tool-card-title">{title}</div>
      </div>
      <div className="tool-card-description">{description}</div>
      <div className="tool-card-preview" onClick={(e) => e.preventDefault()}>
        {children}
      </div>
    </Link>
  );
}

export default function ToolCards() {
  return (
    <div className="tool-cards-section">
      <ToolCard
        icon={
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16 18L22 12L16 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8 6L2 12L8 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
        title="Tigris SDK"
        description="Type-safe libraries for TypeScript and Go. Integrate object storage directly into your application logic with zero friction."
        to="/sdks/tigris/"
      >
        <div className="tool-card-code">
          <div className="tool-card-code-header">
            <div className="tool-card-dots">
              <span />
              <span />
              <span />
            </div>
            <span className="tool-card-filename">bash</span>
          </div>
          <CodeBlock language="bash" className="tool-card-codeblock">
            {sdkCode}
          </CodeBlock>
        </div>
      </ToolCard>

      <ToolCard
        icon={
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 6H20"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M4 12H20"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M4 18H16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        }
        title="Tigris CLI"
        description="Manage buckets, keys, and global configurations from your terminal. Built for speed and scriptability in CI/CD pipelines."
        to="/cli/"
      >
        <div className="tool-card-code">
          <div className="tool-card-code-header">
            <div className="tool-card-dots">
              <span />
              <span />
              <span />
            </div>
            <span className="tool-card-filename">bash</span>
          </div>
          <CodeBlock language="bash" className="tool-card-codeblock">
            {"npm install -g @tigrisdata/tigris"}
          </CodeBlock>
        </div>
      </ToolCard>

      <ToolCard
        icon={
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="12"
              cy="12"
              r="3"
              stroke="currentColor"
              strokeWidth="2"
            />
            <circle
              cx="12"
              cy="12"
              r="9"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="4 3"
            />
          </svg>
        }
        title="Tigris MCP Server"
        description="Empower your AI assistants. Expose your Tigris buckets and objects to LLMs via the Model Context Protocol for seamless context integration."
        to="/quickstarts/mcp"
      >
        <div className="tool-card-mcp-buttons">
          <a
            href="cursor://anysphere.cursor-deeplink/mcp/install?name=tigris&config=eyJ1cmwiOiJodHRwczovL21jcC5zdG9yYWdlLmRldi9tY3AifQ%3D%3D"
            className="tool-card-mcp-btn"
            onClick={(e) => e.stopPropagation()}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M13.204 1.036L7.149 5.724 8.37 3.846l4.833-2.81zM1.675 1.036l5.999 4.742-1.157-2.95-4.842-1.792zm9.927 9.986l-1.728-5.346L8.13 8.024l3.472 2.998zm-7.204 0L8.13 8.024 6.386 5.676l-1.988 5.346zM1.404 6.1l3.065 1.112L6.065 6.1H1.404zm9.531 1.112L14.596 6.1H9.935l1.596 1.112z"
                fill="currentColor"
              />
            </svg>
            Add to Cursor
          </a>
          <a
            href="/docs/mcp/remote/#claude-desktop"
            className="tool-card-mcp-btn"
            onClick={(e) => e.stopPropagation()}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M10.607 3.142L8.763 7.117l2.583 1.67-4.193 4.925 1.6-4.31-2.5-1.555 4.354-4.705z"
                fill="currentColor"
              />
            </svg>
            Add to Claude
          </a>
        </div>
      </ToolCard>
    </div>
  );
}

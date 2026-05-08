import React from "react";
import Link from "@docusaurus/Link";
import "./styles.css";

/* eslint-disable react/prop-types */
function ToolCard({ icon, title, description, to, children }) {
  return (
    <Link to={to} className="tool-card">
      <div className="tool-card-header">
        <div className="tool-card-icon">{icon}</div>
        <div className="tool-card-title">{title}</div>
      </div>
      <div className="tool-card-description">{description}</div>
      <div
        className="tool-card-preview"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </Link>
  );
}

export default function ToolCards() {
  return (
    <div className="tool-cards-wrapper">
      <h2 className="tool-cards-title">Get Started</h2>
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
              </div>
              <span className="tool-card-filename">terminal</span>
            </div>
            <div className="tool-card-terminal">
              <div className="tool-card-terminal-line">
                <span className="tool-card-prompt">$ </span>npm install
                @tigrisdata/storage
              </div>
            </div>
          </div>
          <div className="tool-card-code" style={{ marginTop: "8px" }}>
            <div className="tool-card-code-header">
              <div className="tool-card-dots">
                <span />
              </div>
              <span className="tool-card-filename">app.ts</span>
            </div>
            <div className="tool-card-terminal">
              <div className="tool-card-terminal-line">
                <span className="tool-card-keyword">import</span> {"{"} get, put{" "}
                {"}"} <span className="tool-card-keyword">from</span>{" "}
                <span className="tool-card-string">
                  &apos;@tigrisdata/storage&apos;
                </span>
                ;
              </div>
              <div className="tool-card-terminal-line">&nbsp;</div>
              <div className="tool-card-terminal-line">
                <span className="tool-card-keyword">await</span> get(
                <span className="tool-card-string">
                  &apos;my-file.jpg&apos;
                </span>
                , <span className="tool-card-string">&apos;file&apos;</span>);
              </div>
              <div className="tool-card-terminal-line">
                <span className="tool-card-keyword">await</span> put(
                <span className="tool-card-string">&apos;object.txt&apos;</span>
                ,{" "}
                <span className="tool-card-string">
                  &apos;Hello, World!&apos;
                </span>
                );
              </div>
            </div>
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
          <div className="tool-card-code tool-card-cli-code">
            <div className="tool-card-code-header">
              <div className="tool-card-dots">
                <span />
              </div>
              <span className="tool-card-filename">terminal</span>
            </div>
            <div className="tool-card-terminal">
              <div className="tool-card-terminal-line">
                <span className="tool-card-prompt">$ </span>npm install -g
                @tigrisdata/cli
              </div>
              <div className="tool-card-terminal-line">&nbsp;</div>
              <div className="tool-card-terminal-line">
                <span className="tool-card-prompt">$ </span>t3 mk my-bucket
              </div>
              <div className="tool-card-terminal-line">
                ✓ Bucket &apos;my-bucket&apos; created
              </div>
              <div className="tool-card-terminal-line">&nbsp;</div>
              <div className="tool-card-terminal-line">
                <span className="tool-card-prompt">$ </span>t3 touch
                my-bucket/key
              </div>
              <div className="tool-card-terminal-line">
                ✓ Created &apos;my-bucket/key&apos;
              </div>
            </div>
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
          title="AI"
          description="Empower your AI assistants. Expose your Tigris buckets and objects to LLMs via the Model Context Protocol for seamless context integration."
          to="/quickstarts/mcp"
        >
          <div className="tool-card-ai-buttons">
            <Link
              to="/skills"
              className="tool-card-mcp-btn tool-card-ai-btn-featured"
              onClick={(e) => e.stopPropagation()}
            >
              Agent Skills
            </Link>
            <div className="tool-card-ai-grid">
              <Link
                to="/quickstarts/mcp"
                className="tool-card-mcp-btn"
                onClick={(e) => e.stopPropagation()}
              >
                MCP Server
              </Link>
              <Link
                to="/ai/agent-plugins"
                className="tool-card-mcp-btn"
                onClick={(e) => e.stopPropagation()}
              >
                Agent Plugins
              </Link>
              <Link
                to="/ai/agent-shell/"
                className="tool-card-mcp-btn"
                onClick={(e) => e.stopPropagation()}
              >
                Agent Shell
              </Link>
              <Link
                to="/ai/agent-kit/"
                className="tool-card-mcp-btn"
                onClick={(e) => e.stopPropagation()}
              >
                Agent Kit
              </Link>
            </div>
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
                d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
          title="Use Your Existing Code"
          description="Already using AWS S3 SDKs? Point your existing boto3, @aws-sdk, or any S3-compatible client at Tigris by updating your endpoint and keys."
          to="/sdks/s3/"
        >
          <div className="tool-card-code">
            <div className="tool-card-code-header">
              <div className="tool-card-dots">
                <span />
              </div>
              <span className="tool-card-filename">terminal</span>
            </div>
            <div className="tool-card-terminal">
              <div className="tool-card-terminal-line">
                <span className="tool-card-keyword">export</span>{" "}
                AWS_ENDPOINT_URL=
                <span className="tool-card-string">https://t3.storage.dev</span>
              </div>
              <div className="tool-card-terminal-line">
                <span className="tool-card-keyword">export</span>{" "}
                AWS_ACCESS_KEY_ID=
                <span className="tool-card-string">tid_...</span>
              </div>
              <div className="tool-card-terminal-line">
                <span className="tool-card-keyword">export</span>{" "}
                AWS_SECRET_ACCESS_KEY=
                <span className="tool-card-string">tsec_...</span>
              </div>
              <div className="tool-card-terminal-line">&nbsp;</div>
              <div className="tool-card-terminal-line">
                <span className="tool-card-comment">
                  # Your existing code just works
                </span>
              </div>
              <div className="tool-card-terminal-line">
                <span className="tool-card-prompt">$ </span>aws s3 cp file.bin
                s3://my-bucket/
              </div>
            </div>
          </div>
        </ToolCard>
      </div>
    </div>
  );
}

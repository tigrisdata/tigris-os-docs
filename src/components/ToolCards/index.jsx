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
          <div className="tool-card-code">
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
          <div className="tool-card-mcp-buttons">
            <a
              href="cursor://anysphere.cursor-deeplink/mcp/install?name=tigris&config=eyJ1cmwiOiJodHRwczovL21jcC5zdG9yYWdlLmRldi9tY3AifQ%3D%3D"
              className="tool-card-mcp-btn"
              onClick={(e) => e.stopPropagation()}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 256 256"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M209.74 45.16L164.84 90.06L75.44 22.32L47.74 36.52L114.42 114.52L24 147.8L24 176.2L114.08 155.2L47.74 219.48L75.44 233.68L187.64 140.16L209.74 118.06L232 95.8L232 67.34L209.74 45.16Z"
                  fill="currentColor"
                />
              </svg>
              Add to Cursor
            </a>
            <a
              href="vscode:mcp/install?%7B%22name%22%3A%22tigris%22%2C%22type%22%3A%22http%22%2C%22url%22%3A%22https%3A%2F%2Fmcp.storage.dev%2Fmcp%22%7D"
              className="tool-card-mcp-btn"
              onClick={(e) => e.stopPropagation()}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M95.4 16.4L71.9 5L29.7 42.1L12.3 28.3L4.6 31.9V68.1L12.3 71.7L29.7 57.9L71.9 95L95.4 83.6V16.4ZM29.7 62.6L12.3 50V50L29.7 37.4V62.6ZM71.9 77.4L42.1 50L71.9 22.6V77.4Z"
                  fill="currentColor"
                />
              </svg>
              Add to VS Code
            </a>
            <a
              href="/docs/mcp/remote/#claude-desktop"
              className="tool-card-mcp-btn"
              onClick={(e) => e.stopPropagation()}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
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
              Add to Claude
            </a>
            <a
              href="/docs/mcp/remote/"
              className="tool-card-mcp-link"
              onClick={(e) => e.stopPropagation()}
            >
              See all integrations &rarr;
            </a>
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

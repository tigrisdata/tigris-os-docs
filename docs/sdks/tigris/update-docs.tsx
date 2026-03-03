/**
 * Generates the API reference page for @tigrisdata/storage.
 *
 * Usage:
 *   npx tsx docs/sdks/tigris/update-docs.tsx
 *
 * Reads the TypeScript declaration files shipped with the package
 * and writes docs/sdks/tigris/api.mdx.
 */

import * as ts from "typescript";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "../../..");
const PKG_DIR = path.join(ROOT, "node_modules/@tigrisdata/storage");
const SERVER_DTS = path.join(PKG_DIR, "dist/server.d.ts");
const CLIENT_DTS = path.join(PKG_DIR, "dist/client.d.ts");
const OUTPUT = path.join(ROOT, "docs/sdks/tigris/api.mdx");
const PKG_JSON = JSON.parse(
  fs.readFileSync(path.join(PKG_DIR, "package.json"), "utf-8"),
);

// ---------------------------------------------------------------------------
// TypeScript helpers
// ---------------------------------------------------------------------------

const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

function parse(file: string): ts.SourceFile {
  return ts.createSourceFile(
    path.basename(file),
    fs.readFileSync(file, "utf-8"),
    ts.ScriptTarget.Latest,
    true,
  );
}

function printNode(node: ts.Node, src: ts.SourceFile): string {
  return printer.printNode(ts.EmitHint.Unspecified, node, src);
}

function getJsDoc(node: ts.Node): string[] {
  const docs: string[] = [];
  // @ts-expect-error internal API
  const jsDocs = (node as ts.HasJSDoc).jsDoc as ts.JSDoc[] | undefined;
  if (jsDocs) {
    for (const doc of jsDocs) {
      if (doc.comment) {
        const text =
          typeof doc.comment === "string"
            ? doc.comment
            : doc.comment.map((c) => c.text || "").join("");
        if (text) docs.push(text);
      }
    }
  }
  return docs;
}

function hasDeprecatedTag(node: ts.Node): string | true | undefined {
  // @ts-expect-error internal API
  const jsDocs = (node as ts.HasJSDoc).jsDoc as ts.JSDoc[] | undefined;
  if (!jsDocs) return undefined;
  for (const doc of jsDocs) {
    if (doc.tags) {
      for (const tag of doc.tags) {
        if (tag.tagName.text === "deprecated") {
          const comment = tag.comment;
          if (typeof comment === "string" && comment.length > 0) return comment;
          return true;
        }
      }
    }
  }
  return undefined;
}

// ---------------------------------------------------------------------------
// Extraction types
// ---------------------------------------------------------------------------

interface FunctionInfo {
  name: string;
  overloads: string[];
  jsdoc: string[];
  deprecated?: string | true;
}

interface TypeInfo {
  name: string;
  text: string;
  jsdoc: string[];
  deprecated?: string | true;
  members: MemberInfo[];
}

interface MemberInfo {
  name: string;
  type: string;
  optional: boolean;
  jsdoc: string[];
  deprecated?: string | true;
}

// ---------------------------------------------------------------------------
// Extract declarations from a source file
// ---------------------------------------------------------------------------

function extractFunctions(src: ts.SourceFile): Map<string, FunctionInfo> {
  const funcs = new Map<string, FunctionInfo>();

  for (const stmt of src.statements) {
    if (ts.isFunctionDeclaration(stmt) && stmt.name) {
      const name = stmt.name.text;
      const sig = printNode(stmt, src)
        // Strip JSDoc block comments from the printed output
        .replace(/\/\*\*[\s\S]*?\*\/\s*/g, "")
        .replace(/^declare\s+/, "")
        .replace(/\s*\{[\s\S]*\}$/, "");

      const existing = funcs.get(name);
      if (existing) {
        existing.overloads.push(sig);
      } else {
        funcs.set(name, {
          name,
          overloads: [sig],
          jsdoc: getJsDoc(stmt),
          deprecated: hasDeprecatedTag(stmt),
        });
      }
    }
  }
  return funcs;
}

function extractMembers(
  node: ts.TypeAliasDeclaration | ts.InterfaceDeclaration,
  src: ts.SourceFile,
): MemberInfo[] {
  const members: MemberInfo[] = [];

  function visitMembers(
    membersNode:
      | ts.NodeArray<ts.TypeElement>
      | ts.NodeArray<ts.EnumMember>
      | undefined,
  ) {
    if (!membersNode) return;
    for (const m of membersNode) {
      if (ts.isPropertySignature(m) && m.name) {
        const memberName = m.name.getText(src);
        const memberType = m.type ? printNode(m.type, src) : "unknown";
        members.push({
          name: memberName,
          type: memberType,
          optional: !!m.questionToken,
          jsdoc: getJsDoc(m),
          deprecated: hasDeprecatedTag(m),
        });
      }
    }
  }

  if (ts.isTypeAliasDeclaration(node)) {
    const type = node.type;
    if (ts.isTypeLiteralNode(type)) {
      visitMembers(type.members);
    }
    // Handle union types (e.g. discriminated unions) — extract from first literal branch
    if (ts.isUnionTypeNode(type)) {
      for (const branch of type.types) {
        if (ts.isTypeLiteralNode(branch)) {
          visitMembers(branch.members);
        }
      }
    }
    // Intersection types
    if (ts.isIntersectionTypeNode(type)) {
      for (const branch of type.types) {
        if (ts.isTypeLiteralNode(branch)) {
          visitMembers(branch.members);
        }
      }
    }
  }
  if (ts.isInterfaceDeclaration(node)) {
    visitMembers(node.members);
  }
  return members;
}

function extractTypes(src: ts.SourceFile): Map<string, TypeInfo> {
  const types = new Map<string, TypeInfo>();

  for (const stmt of src.statements) {
    if (ts.isTypeAliasDeclaration(stmt)) {
      const name = stmt.name.text;
      types.set(name, {
        name,
        text: printNode(stmt, src).replace(/^declare\s+/, ""),
        jsdoc: getJsDoc(stmt),
        deprecated: hasDeprecatedTag(stmt),
        members: extractMembers(stmt, src),
      });
    }
    if (ts.isInterfaceDeclaration(stmt)) {
      const name = stmt.name.text;
      types.set(name, {
        name,
        text: printNode(stmt, src).replace(/^declare\s+/, ""),
        jsdoc: getJsDoc(stmt),
        deprecated: hasDeprecatedTag(stmt),
        members: extractMembers(stmt, src),
      });
    }
    if (ts.isEnumDeclaration(stmt)) {
      const name = stmt.name.text;
      types.set(name, {
        name,
        text: printNode(stmt, src).replace(/^declare\s+/, ""),
        jsdoc: getJsDoc(stmt),
        deprecated: hasDeprecatedTag(stmt),
        members: [],
      });
    }
    if (ts.isVariableStatement(stmt)) {
      for (const decl of stmt.declarationList.declarations) {
        if (ts.isIdentifier(decl.name)) {
          const name = decl.name.text;
          types.set(name, {
            name,
            text: printNode(stmt, src).replace(/^declare\s+/, ""),
            jsdoc: getJsDoc(stmt),
            deprecated: hasDeprecatedTag(stmt),
            members: [],
          });
        }
      }
    }
  }
  return types;
}

// ---------------------------------------------------------------------------
// Categorisation
// ---------------------------------------------------------------------------

interface Category {
  title: string;
  anchor: string;
  description?: string;
  functions: string[];
  types: string[];
}

const CATEGORIES: Category[] = [
  {
    title: "Client API",
    anchor: "client-api",
    description:
      "Functions and types exported from `@tigrisdata/storage/client` for browser-side uploads.",
    functions: ["upload", "executeWithConcurrency"],
    types: ["UploadOptions", "UploadProgress", "UploadResponse"],
  },
  {
    title: "Object Operations",
    anchor: "object-operations",
    description: "Create, read, update, and delete objects in a bucket.",
    functions: ["put", "get", "head", "list", "remove", "updateObject"],
    types: [
      "PutOptions",
      "PutResponse",
      "PutOnUploadProgress",
      "GetOptions",
      "GetResponse",
      "HeadOptions",
      "HeadResponse",
      "ListOptions",
      "ListItem",
      "ListResponse",
      "RemoveOptions",
      "UpdateObjectOptions",
      "UpdateObjectResponse",
    ],
  },
  {
    title: "Presigned URLs",
    anchor: "presigned-urls",
    description: "Generate presigned URLs for time-limited access to objects.",
    functions: ["getPresignedUrl"],
    types: [
      "GetPresignedUrlOptions",
      "GetPresignedUrlResponse",
      "GetPresignedUrlOperation",
      "MethodOrOperation",
    ],
  },
  {
    title: "Bucket Management",
    anchor: "bucket-management",
    description: "Create, list, update, and delete buckets.",
    functions: [
      "createBucket",
      "getBucketInfo",
      "listBuckets",
      "updateBucket",
      "removeBucket",
    ],
    types: [
      "CreateBucketOptions",
      "CreateBucketResponse",
      "GetBucketInfoOptions",
      "BucketInfoResponse",
      "ListBucketsOptions",
      "ListBucketsResponse",
      "Bucket",
      "BucketOwner",
      "UpdateBucketOptions",
      "UpdateBucketResponse",
      "RemoveBucketOptions",
    ],
  },
  {
    title: "Bucket Configuration",
    anchor: "bucket-configuration",
    description:
      "Configure CORS, lifecycle rules, TTL, migration, and notifications for a bucket.",
    functions: [
      "setBucketCors",
      "setBucketLifecycle",
      "setBucketTtl",
      "setBucketMigration",
      "setBucketNotifications",
    ],
    types: [
      "SetBucketCorsOptions",
      "SetBucketLifecycleOptions",
      "SetBucketTtlOptions",
      "SetBucketMigrationOptions",
      "SetBucketNotificationsOptions",
      "BucketCorsRule",
      "BucketLifecycleRule",
      "BucketTtl",
      "BucketMigration",
      "BucketNotification",
      "BucketNotificationBase",
      "BucketNotificationBasicAuth",
      "BucketNotificationTokenAuth",
    ],
  },
  {
    title: "Snapshots",
    anchor: "snapshots",
    description: "Create and list bucket snapshots.",
    functions: ["createBucketSnapshot", "listBucketSnapshots"],
    types: [
      "CreateBucketSnapshotOptions",
      "CreateBucketSnapshotResponse",
      "ListBucketSnapshotsOptions",
      "ListBucketSnapshotsResponse",
    ],
  },
  {
    title: "Multipart Upload",
    anchor: "multipart-upload",
    description:
      "Low-level multipart upload operations for advanced use cases.",
    functions: [
      "initMultipartUpload",
      "getPartsPresignedUrls",
      "completeMultipartUpload",
    ],
    types: [
      "InitMultipartUploadOptions",
      "InitMultipartUploadResponse",
      "GetPartsPresignedUrlsOptions",
      "GetPartsPresignedUrlsResponse",
      "CompleteMultipartUploadOptions",
      "CompleteMultipartUploadResponse",
    ],
  },
  {
    title: "Client Upload Handling",
    anchor: "client-upload-handling",
    description:
      "Server-side handler for processing client upload requests (pairs with the Client API `upload` function).",
    functions: ["handleClientUpload"],
    types: ["ClientUploadRequest", "UploadAction"],
  },
  {
    title: "Statistics",
    anchor: "statistics",
    description: "Retrieve account and bucket-level storage statistics.",
    functions: ["getStats"],
    types: [
      "GetStatsOptions",
      "StatsResponse",
      "BucketType",
      "BucketVisibility",
    ],
  },
  {
    title: "Common Types",
    anchor: "common-types",
    description:
      "Shared configuration and response types used across all API methods.",
    functions: [],
    types: [
      "TigrisStorageConfig",
      "TigrisStorageResponse",
      "TigrisResponse",
      "StorageClass",
      "BucketLocations",
      "BucketLocationMulti",
      "BucketLocationDualOrSingle",
      "multiRegions",
      "singleOrDualRegions",
    ],
  },
];

// ---------------------------------------------------------------------------
// MDX generation
// ---------------------------------------------------------------------------

function renderDeprecated(dep: string | true | undefined): string {
  if (!dep) return "";
  const msg = typeof dep === "string" ? ` ${dep}` : "";
  return `\n> **Deprecated**${msg}\n`;
}

function escapeForMdx(text: string): string {
  // Collapse multi-line types to single line and escape MDX-sensitive chars
  return text
    .replace(/\n\s*/g, " ")
    .replace(/\{/g, "\\{")
    .replace(/\}/g, "\\}")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\|/g, "\\|");
}

function renderMembersTable(members: MemberInfo[]): string {
  if (members.length === 0) return "";

  const lines: string[] = [
    "",
    "| Property | Type | Required | Description |",
    "| --- | --- | --- | --- |",
  ];

  for (const m of members) {
    const escapedType = `\`${escapeForMdx(m.type)}\``;
    const required = m.optional ? "No" : "Yes";

    let desc = m.jsdoc.join(" ");
    if (m.deprecated) {
      const depMsg = typeof m.deprecated === "string" ? ` ${m.deprecated}` : "";
      desc = `**Deprecated.**${depMsg} ${desc}`;
    }
    desc = desc.replace(/\|/g, "\\|").trim();

    lines.push(`| \`${m.name}\` | ${escapedType} | ${required} | ${desc} |`);
  }
  lines.push("");
  return lines.join("\n");
}

function renderFunction(fn: FunctionInfo): string {
  const parts: string[] = [];

  parts.push(`### \`${fn.name}\`\n`);
  parts.push(renderDeprecated(fn.deprecated));

  if (fn.jsdoc.length > 0) {
    parts.push(fn.jsdoc.join("\n\n") + "\n");
  }

  if (fn.overloads.length === 1) {
    parts.push("```ts\n" + fn.overloads[0] + "\n```\n");
  } else {
    parts.push("**Overloads:**\n");
    for (const sig of fn.overloads) {
      parts.push("```ts\n" + sig + "\n```\n");
    }
  }

  return parts.join("\n");
}

function renderType(t: TypeInfo): string {
  const parts: string[] = [];

  parts.push(`### \`${t.name}\`\n`);
  parts.push(renderDeprecated(t.deprecated));

  if (t.jsdoc.length > 0) {
    parts.push(t.jsdoc.join("\n\n") + "\n");
  }

  parts.push("```ts\n" + t.text + "\n```\n");

  if (t.members.length > 0) {
    parts.push(renderMembersTable(t.members));
  }

  return parts.join("\n");
}

function renderCategory(
  cat: Category,
  allFunctions: Map<string, FunctionInfo>,
  allTypes: Map<string, TypeInfo>,
): string {
  const parts: string[] = [];

  parts.push(`## ${cat.title} {#${cat.anchor}}\n`);

  if (cat.description) {
    parts.push(cat.description + "\n");
  }

  // Functions
  const catFns = cat.functions
    .map((n) => allFunctions.get(n))
    .filter(Boolean) as FunctionInfo[];

  if (catFns.length > 0) {
    for (const fn of catFns) {
      parts.push(renderFunction(fn));
    }
  }

  // Types
  const catTypes = cat.types
    .map((n) => allTypes.get(n))
    .filter(Boolean) as TypeInfo[];

  if (catTypes.length > 0) {
    parts.push("#### Types\n");
    for (const t of catTypes) {
      parts.push(renderType(t));
    }
  }

  return parts.join("\n");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const serverSrc = parse(SERVER_DTS);
  const clientSrc = parse(CLIENT_DTS);

  // Extract everything
  const serverFunctions = extractFunctions(serverSrc);
  const clientFunctions = extractFunctions(clientSrc);
  const serverTypes = extractTypes(serverSrc);
  const clientTypes = extractTypes(clientSrc);

  // Merge: server takes precedence for duplicates
  const allFunctions = new Map([...clientFunctions, ...serverFunctions]);
  const allTypes = new Map([...clientTypes, ...serverTypes]);

  // Build MDX
  const sections: string[] = [];

  sections.push(`---
title: Complete API Reference
sidebar_label: API Reference
---

{/* This file is auto-generated by update-docs.tsx — do not edit manually. */}

# Complete API Reference

API reference for [\`@tigrisdata/storage\`](https://www.npmjs.com/package/@tigrisdata/storage) v${PKG_JSON.version}.

For usage examples and guides, see [Using the SDK](/docs/sdks/tigris/using-sdk).
`);

  // Table of contents
  sections.push("## Contents\n");
  for (const cat of CATEGORIES) {
    sections.push(`- [${cat.title}](#${cat.anchor})`);
  }
  sections.push("");

  // Render each category
  for (const cat of CATEGORIES) {
    sections.push(renderCategory(cat, allFunctions, allTypes));
  }

  const content = sections.join("\n");
  fs.writeFileSync(OUTPUT, content);
  console.log(`Wrote ${OUTPUT}`);
}

main();

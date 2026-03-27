---
name: excalidraw-diagrams
description:
  Guidelines for creating and embedding Excalidraw diagrams in Tigris docs. Use
  when creating architecture diagrams, flow diagrams, or any visual
  documentation.
metadata:
  trigger: Creating Excalidraw diagrams, architecture visuals, flow diagrams
---

# Excalidraw Diagram Guidelines

When creating Excalidraw diagrams via MCP, follow these rules to produce clean,
readable, customer-facing results — and embed them directly in the docs site.

## Embedding Diagrams in Docs (CRITICAL)

**Never export PNGs.** Diagrams are rendered as inline SVGs using the
`ExcalidrawDiagram` React component. This gives crisp rendering at any
resolution, dark-mode support, and no image files to manage.

### Step-by-step embedding process

1. **Create the diagram JSON data file** at
   `src/components/diagrams/data/<name>.json`. This file is a JSON array of
   Excalidraw elements (same format as the MCP `create_view` tool, minus
   `cameraUpdate` and `delete` pseudo-elements). Use dark-mode colors (see Color
   Scheme below).

2. **Create a thin wrapper component** at
   `src/components/diagrams/<Name>Diagram.tsx`:

   ```tsx
   import React from "react";
   import ExcalidrawDiagram from "./ExcalidrawDiagram";
   import elements from "./data/<name>.json";

   export default function <Name>Diagram() {
     return <ExcalidrawDiagram elements={elements} />;
   }
   ```

3. **Import and render in your MDX file**:

   ```mdx
   import <Name>Diagram from "@site/src/components/diagrams/<Name>Diagram";

   <div className="mermaid-frame">
     <<Name>Diagram />
   </div>
   ```

4. **Add a mermaid HTML comment** above the diagram div for AI agent
   readability. This lets agents understand the diagram's content without
   parsing the JSON:

   ```mdx
   <!-- NOTE: The SVG below is rendered from <Name>Diagram. The mermaid
   notation is kept here as a machine-readable description for AI agents.
   flowchart LR
       A[Client] -->|S3 API| B[Gateway]

       B --> C[Cache]
       C -.->|cache miss| D[Tigris]

   -->

   <div className="mermaid-frame">
     <<Name>Diagram />
   </div>
   ```

### Key files

| File                                            | Purpose                                               |
| ----------------------------------------------- | ----------------------------------------------------- |
| `src/components/diagrams/ExcalidrawDiagram.tsx` | SVG renderer — auto-sizes viewBox, embeds Virgil font |
| `src/components/diagrams/virgilFont.ts`         | Base64-encoded Virgil woff2 font face                 |
| `src/components/diagrams/data/*.json`           | Diagram element data (one file per diagram)           |
| `src/components/diagrams/*Diagram.tsx`          | Thin wrappers that import data + renderer             |
| `static/fonts/Virgil.woff2`                     | Virgil font file                                      |
| `src/css/custom.css` (`.mermaid-frame`)         | Diagram container styling                             |

### Mermaid HTML comments

Every embedded diagram **must** have a mermaid-syntax HTML comment directly
above it. This serves as a machine-readable description so AI agents can
understand diagram content without parsing JSON coordinates. The comment format
is:

```html
<!-- NOTE: The SVG below is rendered from <ComponentName>. The mermaid
notation is kept here as a machine-readable description for AI agents.
<mermaid diagram syntax here>
-->
```

Use standard mermaid flowchart/sequence/graph syntax. The comment is never
rendered — it exists purely for agent comprehension.

## Font — Virgil

- **Always use the Virgil handwriting font** for all text. This is Excalidraw's
  signature hand-drawn look.
- The `ExcalidrawDiagram` component embeds the font automatically via
  `virgilFont.ts`. You do not need to handle font embedding manually.
- Set `fontFamily: 1` on Excalidraw elements (this maps to Virgil).

## Text Sizing & Spacing

The Virgil font renders **significantly wider** than standard sans-serif fonts
at the same pixel size. Always account for this:

- Overestimate the horizontal space text needs by **~40%** compared to what
  you'd expect from character count × fontSize.
- **Minimum 100px horizontal gap** between connected boxes when there is a label
  between them.
- **Minimum 80px vertical gap** between connected boxes when there is a label.
- Arrow labels render at the midpoint of the arrow. Make arrows at least **80px
  long** when they carry a label.
- **Never place a text label between two parallel arrows.** Put labels on the
  outer sides.

## Bidirectional Flows

For request/response pairs between two boxes:

- Stagger the two arrows vertically with a **20-30px gap** between them.
- Place the forward label above the top arrow, the return label below the bottom
  arrow.
- Both arrows must connect to the box edges — do not let dashed return arrows
  float below the boxes.

## Container / Zone Labels

- When a dashed container has a text label (e.g., "Training Instance"), leave
  **at least 40px vertical gap** between the label's baseline and the top edge
  of the first child element.
- **Rule of thumb**: container label y + fontSize × 1.5 = minimum y for first
  child element.

## Color Scheme — Tigris Brand Palette

Use this palette to match the Tigris brand. The `ExcalidrawDiagram` component
renders with a `#0e1920` background.

```
Background / canvas:   #0e1920
Container fill:        #0e1920 (same as bg, differentiated by border)
Container border:      #1e3340 (dashed stroke for grouping zones)
Node fill (default):   #142229 (dark navy)
Node border (default): #2a4050
Node fill (primary):   #62FEB5 (Tigris brand green — used for TAG/gateway)
Node border (primary): #62FEB5
Node fill (upstream):  #101c24 (darker, for external services like Tigris)
Node border (upstream):#62FEB5

Primary text:          #c8d6de (inside dark nodes)
Brand text:            #0A171E (inside green #62FEB5 nodes — dark on bright)
Green accent text:     #62FEB5 (for cache-related labels, NVMe nodes)
Muted annotation text: #8fa3b0 (arrow labels, annotations)
Secondary muted text:  #506874 (gossip lines, less important flows)

Arrow colors:
  Primary flow:        #62FEB5 (main data path)
  Secondary/dashed:    #506874 (gossip, background flows)
  Cache miss:          #506874 dashed (optional/fallback paths)
  Error/reject:        #ef4444
```

### When to use each color

| Element                   | Fill      | Stroke         | Text color |
| ------------------------- | --------- | -------------- | ---------- |
| Your app / client boxes   | `#142229` | `#2a4050`      | `#c8d6de`  |
| TAG / gateway boxes       | `#62FEB5` | `#62FEB5`      | `#0A171E`  |
| External storage (Tigris) | `#101c24` | `#62FEB5`      | `#62FEB5`  |
| Grouping containers       | `#0e1920` | `#1e3340` dash | `#8fa3b0`  |
| Primary arrows            | —         | `#62FEB5`      | `#8fa3b0`  |
| Secondary/gossip arrows   | —         | `#506874` dash | `#506874`  |

## Layout Pattern

- Use **dashed stroke containers** (`strokeStyle: "dashed"`,
  `strokeColor: "#1e3340"`) to group related components.
- Dashed lines should be **semantically meaningful** — they indicate a boundary
  or grouping, not decoration.
- Keep diagrams **compact and purposeful**. No wasted space. Every element
  should earn its place.

## Verification

After creating or modifying a diagram, **always view it locally** via the dev
server (`npm run dev`) and inspect the rendered result before pushing:

1. Text clipping or cutoff at box edges or between boxes
2. Arrow lines crossing over text labels
3. Sufficient contrast (text readable against backgrounds)
4. All labels fully visible — especially short labels between boxes
5. Dashed return arrows actually connect to box edges, not floating in space

Fix any issues and re-verify before presenting to the user.

## Common Mistakes to Avoid

- **Do not export PNGs** — always embed diagrams as inline SVGs using the
  component system described above
- Do not forget Virgil font — causes mismatched rendering
- Do not rely on external CSS `@font-face` for SVGs — the component handles this
- Do not use gaps under 100px between boxes that have labels — text clips
- Do not let return/dashed arrows float below boxes — they must visually connect
- Do not place text between two parallel arrows — always gets obscured
- Do not change the Tigris brand colors when asked to fix spacing — always
  preserve the approved palette
- Do not skip the visual verification step — you cannot trust coordinate math
  alone with Virgil's wide character rendering
- Do not forget the mermaid HTML comment above each diagram — agents need it

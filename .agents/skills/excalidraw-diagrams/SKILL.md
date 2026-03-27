---
name: excalidraw-diagrams
description:
  Guidelines for creating clean, readable Excalidraw diagrams via MCP. Use when
  creating architecture diagrams, flow diagrams, or any visual documentation.
metadata:
  trigger: Creating Excalidraw diagrams, architecture visuals, flow diagrams
---

# Excalidraw Diagram Guidelines

When creating Excalidraw diagrams via MCP, follow these rules to produce clean,
readable, customer-facing results.

## Font — Virgil

- **Always use the Virgil handwriting font** for all text. This is Excalidraw's
  signature hand-drawn look.
- When rendering diagrams as inline SVGs in a web app (Docusaurus, React, etc.),
  the Virgil font must be **embedded directly inside the SVG** using a
  `<defs><style>@font-face { ... }</style></defs>` block. External CSS
  `@font-face` rules do not apply inside SVG elements — the browser cannot
  resolve them.
- Store the base64-encoded Virgil woff2 in a shared module (e.g.,
  `virgilFont.ts`) and import it into your SVG renderer. This avoids duplicating
  the font data across every diagram.
- Set `fontFamily="Virgil, sans-serif"` on every `<text>` and `<tspan>` element.
- Download the Virgil font from:
  `https://raw.githubusercontent.com/excalidraw/virgil/master/Virgil.woff2`

## Text Sizing & Spacing

The Virgil font renders **significantly wider** than standard sans-serif fonts
at the same pixel size. Always account for this:

- Overestimate the horizontal space text needs by **~40%** compared to what
  you'd expect from character count × fontSize.
- **Minimum 100px horizontal gap** between connected boxes when there is a label
  between them. For labels like "gRPC", "cache hit", "stream chunks" — if the
  gap is less than 100px the text WILL be clipped.
- **Minimum 80px vertical gap** between connected boxes when there is a label.
- Arrow labels placed via the `label` property on arrow elements render at the
  midpoint of the arrow. If the arrow is too short, the label overflows. Make
  arrows at least **80px long** when they carry a label.
- Standalone text labels placed between elements must have **at least 20px
  clearance** on each side from the nearest box edge.
- **Never place a text label between two parallel arrows.** Put labels on the
  outer sides (above the top arrow, below the bottom arrow).

## Bidirectional Flows

For request/response pairs between two boxes:

- Stagger the two arrows vertically with a **20-30px gap** between them.
- Place the forward label above the top arrow, the return label below the bottom
  arrow.
- Both arrows must connect to the box edges — do not let dashed return arrows
  float below the boxes. A "stream chunks" arrow between box A and box B should
  have a y-coordinate between the top and bottom edges of those boxes.
## Font

- **Always set `fontFamily: 1`** on every text element. This is Excalidraw's
  hand-drawn font (Virgil). Without it, text renders in a mismatched default.

## Text Sizing

- The Virgil font renders **significantly wider** than you'd expect from the
  pixel coordinates. Always overestimate the space text needs by ~40%.
- **Never use `label` properties on shapes** — they frequently clip. Instead,
  create separate `text` elements positioned inside the shape with generous
  padding.

## Spacing Between Elements

- **Minimum 160px horizontal gap** between connected boxes. This gives arrow
  labels room to breathe.
- **Minimum 125px vertical gap** between connected boxes.
- Arrow labels must be placed **at least 25px away from the arrow line** — above
  for forward arrows, below for return arrows.
- **Never place a text label between two parallel arrows.** Put labels on the
  outer sides (above the top arrow, below the bottom arrow).

## Arrow Labels

- Place labels **above or below** arrows, never overlapping them.
- For bidirectional flows (request → / ← response), stagger the arrows
  vertically with ~50px gap and put labels on opposite sides.

## Box Internal Padding

- Text inside boxes should have **at least 25px padding** from all edges.
- For multi-line box content (title + subtitle), leave **30px between lines**.
- When using `label` properties on shapes, Excalidraw auto-centers the text.
  This works well but verify the rendered result — long labels in small boxes
  will clip.

## Container / Zone Labels

- When a dashed container has a text label (e.g., "TAG Process", "Training
  Instance"), leave **at least 40px vertical gap** between the label's baseline
  and the top edge of the first child element inside the container.
- Virgil at fontSize 21 renders ~28px tall. A label at y=55 inside a container
  starting at y=40 means child elements must start no higher than y=95.
- **Rule of thumb**: container label y + fontSize × 1.5 = minimum y for first
  child element.

## Color Scheme — Tigris Brand Palette

Use this palette to match the Tigris brand. These colors are derived from the
TAGArchitectureDiagram component on the Tigris website lander.

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
  `strokeColor: "#1e3340"`) to group related components (e.g., "Training
  Instance")
- Dashed lines should be **semantically meaningful** — they indicate a boundary
  or grouping, not decoration. Do not use dashed borders purely for aesthetics.
- Keep diagrams **compact and purposeful**. No wasted space. Every element
  should earn its place.

## Verification Loop

After creating or modifying a diagram, **always view it locally** (via dev
server or Excalidraw MCP `create_view`) and inspect the result before pushing:

1. Text clipping or cutoff at box edges or between boxes
2. Arrow lines crossing over text labels
3. Sufficient contrast (text readable against backgrounds)
4. All labels fully visible — especially short labels between boxes (gRPC, cache
   hit, etc.)
5. Dashed return arrows actually connect to box edges, not floating in space

Fix any issues and re-verify before presenting to the user.

## Common Mistakes to Avoid

- Do not forget Virgil font — causes mismatched rendering
- Do not rely on external CSS `@font-face` for SVGs — embed the font inline
- Do not use gaps under 100px between boxes that have labels — text clips
- Do not let return/dashed arrows float below boxes — they must visually connect
- Do not place text between two parallel arrows — always gets obscured
- Do not change the Tigris brand colors when asked to fix spacing — always
  preserve the approved palette
- Do not skip the visual verification step — you cannot trust coordinate math
  alone with Virgil's wide character rendering

## Color Scheme (Tigris Dark Theme)

Use this palette to match the Tigris brand:

```
Background:        #141414 (main), #111111 (containers/boxes)
Zone backgrounds:  #1a1a2e (infra zone), #1a1a10 (cloud zone) at opacity 40
Borders:           #333333 (zones/legend), accent colors for boxes
Primary text:      #e5e5e5
Secondary text:    #a0a0a0
Muted text:        #555555

Accent colors:
  Blue:    #4a9eed (requests, your infra)
  Purple:  #8b5cf6 (TAG / gateway)
  Green:   #22c55e (responses, cache, success)
  Amber:   #f59e0b (upstream/Tigris, cache miss)

Step badges:       Dark fills (#1a3455, #251d04, #0d2e0d) with matching accent
                   stroke + text
```

## Layout Pattern

- Use **dashed stroke zones** to group related components (e.g., "Your
  Infrastructure" vs "Tigris Cloud")
- Use **numbered step badges** (filled circles with numbers) to guide reading
  order
- Include a **Legend box** with sample arrows explaining line styles (solid =
  request, dashed = response, colored = upstream fetch)
- Add an **explanatory callout box** (dashed border) for key performance facts

## Verification Loop

After creating a diagram, **always screenshot it with Playwright** and inspect
the result before sharing:

```bash
npx playwright screenshot --browser chromium --wait-for-timeout 5000 \
  --viewport-size=2400,1600 "<excalidraw_url>" /tmp/diagram-check.png
```

Then read the screenshot image and check for:

1. Text clipping or cutoff at box edges
2. Arrow lines crossing over text labels
3. Sufficient contrast (text readable against backgrounds)
4. All elements visible and nothing overlapping

Fix any issues and re-screenshot before presenting to the user.

## Common Mistakes to Avoid

- Do not forget `fontFamily: 1` — causes wrong font rendering
- Do not use `label` property on rectangles — text clips inside boxes
- Do not place text between two parallel arrows — always gets obscured
- Do not use gaps under 120px between connected elements — labels collide
- Do not set `width` on text elements too small — Virgil font is wider than
  expected
- Do not change colors when asked to fix spacing — always preserve the approved
  palette
- Do not skip the screenshot verification step — you cannot trust coordinate
  math alone

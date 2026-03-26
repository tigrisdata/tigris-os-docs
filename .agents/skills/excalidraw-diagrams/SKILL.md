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

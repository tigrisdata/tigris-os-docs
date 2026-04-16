# Antithesis report — diagram descriptions

A designer brief for all 7 diagrams from the Tigris Antithesis report. Each
section describes the diagram's purpose, layout, every visual element with its
labels, and any color/emphasis conventions. Use this to re-typeset in any theme.

## Shared conventions

Unless noted, all diagrams share these conventions:

- **Palette** (cool-toned dark):
  - Background: deep teal-black (`#0e1920`)
  - Node fill: dark slate (`#142229`)
  - Standard node border: muted slate (`#2a4050`)
  - Primary text: pale gray (`#c8d6de`)
  - Secondary text: mid gray (`#8fa3b0`)
  - Zone dashed border: (`#1e3340`) at 40% opacity
- **Accent colors** (meaning is consistent across all diagrams):
  - Green (`#62FEB5`) = the healthy path, the fix, the accept/allow state
  - Coral red (`#CF5B5B`) = the bug, the stale state, the failure, the reject
  - Steel blue (`#5BA4CF`) = secondary flow, replication, info callouts
  - Sandstone (`#CF8E5B`) = warnings, partial failure states
- **Typography**: hand-drawn sketch style (Virgil / Excalidraw). Substitute any
  hand-drawn/sketch font — keeps the diagrams feeling like a whiteboard, not a
  production schematic.
- **Rounded rectangles** for boxes; arrows have sharp arrowheads; dashed strokes
  for async/soft relationships.

---

## 1. Two-Layer Read Path

**Purpose:** Establish the baseline architecture before the bug story. Show that
reads hit the edge cache first, and only fall through to FoundationDB + block
storage on a miss.

**Title (top center):** "Two-Layer Read Path" **Subtitle:** "Edge cache in front
of FoundationDB metadata and S3-backed block storage"

**Layout:** Horizontal flow, left to right.

```
[Client] → [Gateway] → [Edge Cache] ⇄ [FoundationDB (Metadata)]
                                    ⇄ [Block Storage (S3-backed)]
```

**Elements:**

1. **Client** box (left). Label: "Client".
2. **Gateway** box (next). Label: "Gateway".
3. **Edge Cache** box (center, highlighted with green accent border — visually
   the focal point). Label: "Edge Cache" with subtitle "Redis".
4. **FoundationDB** box (top right). Label: "FoundationDB" with subtitle
   "Metadata".
5. **Block Storage** box (bottom right). Label: "Block Storage" with subtitle
   "S3-backed".

**Arrows:**

- **Forward request flow** (gray solid): Client → Gateway (labeled "GET"),
  Gateway → Edge Cache (labeled "check cache").
- **Cache HIT path** (green solid, 2.5px stroke): a single arrow that arcs UP
  from the top of Edge Cache, across above the whole row, and down to the top of
  Client. Label near the apex: "cache HIT — returned from edge, no FDB touch".
  This is the diagram's key visual payoff — the HIT bypasses FDB entirely.
- **Cache MISS path** (steel blue, dashed, bidirectional): two arrows from Edge
  Cache — one going up-right to FDB (label: "metadata read"), one going
  down-right to Block Storage (label: "block fetch"). A middle label reads
  "MISS: fetch + populate".

**Legend box** (bottom, dashed border, full width):

- Gray solid arrow → "Request flow"
- Green solid arrow → "Cache HIT (fast, no FDB)"
- Blue dashed bidirectional arrow → "Cache MISS (fetch + populate)"

---

## 2. Delete-Then-Read Race

**Purpose:** Show the concrete bug — a concurrent GET arriving between the FDB
delete and the deferred cache eviction observes the deleted object.

**Title:** "Delete-Then-Read Race" **Subtitle:** "A concurrent GET wins the gap
between FDB delete and deferred cache eviction"

**Layout:** UML-style sequence diagram. Five actor columns at the top, with
vertical dashed lifelines running down. Time flows top-to-bottom.

**Actor columns (left to right):**

1. **Request A (DELETE)**
2. **Key Lock**
3. **FoundationDB**
4. **Edge Cache** (highlighted green border — the point of divergence)
5. **Request B (GET)**

**Race window band** (spans all columns, translucent coral fill at ~15% opacity,
dashed coral border). Label inside: "RACE WINDOW — FDB deleted, cache still has
object". The band visually occupies the time between events 2 and 5.

**Events (numbered, chronological, each shown as a horizontal arrow between
columns):**

1. Request A → Key Lock: "1. acquire lock" (gray)
2. Request A → FoundationDB: "2. deleteObjects() — FDB delete succeeds" (gray)
3. Request B → Edge Cache: "3. GET arrives — hits cache" (coral — this is the
   bad interleaving)
4. Edge Cache → Request B: "4. 200 OK + stale body" (coral, dashed — the return)
5. Request A → Edge Cache: "5. (defer) evict cache — too late" (gray)
6. Request A → FoundationDB: "6. (defer) write tombstone" (gray)
7. Request A → Key Lock: "7. release lock" (gray)

**Callout box** (bottom, coral dashed border):

- "Consistency violation: DELETE succeeded; next GET must return 404. Instead it
  returns the deleted body."
- Sub-line: "The gap between step 2 and step 5 is the race window — any
  concurrent GET in that window sees stale state."

---

## 3. Four Manifestations, One Root Cause

**Purpose:** Show that four surface bugs Antithesis found share the same root
cause — cache and metadata diverging under failure.

**Title:** "Four Manifestations, One Root Cause"

**Layout:** A root-cause tree. One root box at top center, four child boxes in a
row below, arrows radiating from root to each child.

**Root box** (top center, coral accent border):

- Main label: "Cache-Metadata Divergence"
- Sub-label (coral): "under failure conditions"

**Four child boxes** (evenly spaced across the row, each with steel blue number
badge + neutral border):

1. **Delete race** — "Deferred cache eviction leaves a window after FDB delete
   where a concurrent GET returns the stale body."
2. **Rename rollback** — "Cache invalidation treated as hard dependency; a
   transient Redis failure rolls back a committed metadata operation."
3. **Replication gap** — "Missing LastModified check on replication events —
   out-of-order retries let an older block overwrite a newer one."
4. **Regional failure** — "Partial regional fault allows the read path to bypass
   a consistency check and serve unvalidated state."

**Branch arrows:** Four steel blue arrows from the root's bottom edge fanning
out to the top of each child.

**Footer callout** (bottom, dashed):

- "Each bug looked different in CI; in Antithesis, they resolved to a single
  architectural seam — metadata and cache diverging under fault."

---

## 4. The Fix: Reorder, Evict Before Delete

**Purpose:** Show the structural fix — evicting the cache BEFORE the FDB delete
closes the race window entirely.

**Title:** "The Fix: Reorder, Evict Before Delete"

**Layout:** Two zoned panels side-by-side, each a vertical sequence. Left panel
has a coral dashed border ("Before"), right panel has a green dashed border
("After").

**Left panel — "Before — race window":** Vertical stack of step boxes connected
by short down-arrows.

1. acquire key lock
2. deleteObjects() — FDB delete succeeds
3. **RACE WINDOW** (coral-filled translucent band) — "concurrent GET hits cache
   → returns stale 200"
4. (deferred) evict cache entry
5. (deferred) write tombstone
6. release key lock

**Right panel — "After — eager eviction under lock":** Same vertical stack, but
reordered.

1. acquire key lock
2. **evict cache entry (moved up)** — green accent border + green label, calls
   out the one structural change
3. deleteObjects() — FDB delete
4. **"no window — lock held, cache already empty"** (green-filled translucent
   band, replaces the coral race window)
5. (deferred) evict again + write tombstone
6. release key lock

**Footer note** (inside right panel, secondary text): "Defense-in-depth:
deferred eviction + tombstone still run after — blocks stale re-population from
async replication."

---

## 5. Tombstone Barrier

**Purpose:** Show the general-purpose protection mechanism — a timestamp check
on every cache-write path that blocks stale re-population regardless of source.

**Title:** "Tombstone Barrier" **Subtitle:** "A timestamp check on every
cache-write path blocks stale re-population"

**Layout:** Three source boxes on the left stacked vertically, all three
converge on a decision diamond in the center, which branches to two outcome
boxes on the right.

**Three source boxes (left column):**

1. **Normal read-through** — "cache miss → fetch from FDB / S3"
2. **Async replication** — "follower region delivers a copy"
3. **Retried delayed event** — "earlier event arrives late"

**Decision diamond (center, green accent border):**

- Main label: "Tombstone check"
- Sub-label (two lines, secondary color): "object.LastModified vs tombstone_ts"

**Outcome boxes (right column):**

- **Accept — write to cache** (green accent border). Sub: "newer than tombstone,
  or none exists".
- **Reject — stale data** (coral accent border). Sub: "older than tombstone,
  refuse cache write".

**Arrows from diamond to outcomes:**

- Diamond → Accept: green, labeled "newer".
- Diamond → Reject: coral, labeled "older".

**Footer callout** (bottom, dashed full-width):

- Heading: "Source-agnostic — applies to every cache-write path"
- Body: "Works even if eager eviction failed or Redis was unreachable. Makes the
  cache structurally incapable of serving a stale entry after a successful
  mutation."

---

## 6. The Delete-Resurrection Loop

**Purpose:** Show the generic, textbook failure pattern that any cache in front
of a consistent store exhibits — framed as a closed loop that keeps resurrecting
deleted records.

**Title:** "The Delete-Resurrection Loop" **Subtitle:** "A textbook failure
pattern when a cache sits in front of a consistent store"

**Layout:** Five numbered nodes arranged in a ring (roughly a pentagon) around a
center callout box. Arrows form a clockwise cycle with one extra arrow creating
the actual loop.

**Five nodes (clockwise, starting top):**

1. **Client DELETE** (top, neutral border) — "client removes an object"
2. **Primary records delete** (upper right, neutral) — "authoritative store is
   correct"
3. **Invalidation fails/delayed** (lower right, sandstone accent) — "crash,
   timeout, or deferred step not run yet"
4. **GET hits stale cache** (lower left, coral accent — the visible symptom) —
   "cache serves deleted object with 200 OK"
5. **Follower re-populates** (upper left, sandstone accent) — "cache miss reads
   stale replica, re-caches"

**Arrows:**

- Solid gray arrows: 1 → 2 → 3.
- Solid coral arrow from 3 → 4 (the stale hit emerges from the delayed
  invalidation). Label above: "stale cache hit".
- Solid gray arrow: 4 → 5 (miss triggers follower read).
- Dashed coral arrow from 5 → 4 (the loop — follower re-populates the stale
  entry). Label: "loop: re-cached from stale replica".

**Center callout box** (inside the ring, dashed neutral border):

- Line 1: "The deleted record"
- Line 2: "keeps coming back"
- Sub: "until the cache TTL expires"

---

## 7. Three Layers of Cache-Coherence Defense

**Purpose:** Summarize the mitigation strategy — three independent layers, each
catching what the one above it misses.

**Title:** "Three Layers of Cache-Coherence Defense" **Subtitle:** "Each layer
catches what the one above it misses"

**Layout:** Three wide horizontal slabs stacked vertically, each with its own
accent color. A coral arrow runs up the left side pointing from bottom to top
(failure modes escalate downward through the stack). A column of small "Catches"
cards sits on the right, one per layer.

**Layer 1 (top, green accent border)** — labeled "L1" in green:

- Title: "Write Path — Eager Invalidation"
- Line 1: "Every mutation evicts the cache entry BEFORE the mutation commits to
  the primary store, not after."
- Line 2: "Closes the gap between 'source of truth changed' and 'cache knows
  about it.'"

**Layer 2 (middle, steel blue accent)** — labeled "L2" in blue:

- Title: "Read Path — Tombstone Barriers"
- Line 1: "Timestamp check on every cache-write path blocks stale
  re-population."
- Line 2: "Catches stale data even if eviction failed or Redis was unreachable."

**Layer 3 (bottom, sandstone accent)** — labeled "L3" in sandstone:

- Title: "Replication Boundary — Timestamp Ordering"
- Line 1: "Incoming replication events compare LastModified. Newer data always
  wins, regardless of arrival order."
- Line 2: "Prevents older copies from overwriting newer ones across regions."

**Left-side arrow** (coral, thick, pointing up, spanning all three layers):

- Main label (coral, near middle): "Failure modes"
- Sub-label (secondary gray, beneath): "escalate"

**Right-side "Catches" cards** (three small dashed boxes, one per layer):

- L1: "Direct writes where the cache is reachable and eviction succeeds."
- L2: "Stale re-population via async events after a successful delete."
- L3: "Out-of-order or retried replication events that would rewind state."

---

## Ordering in the report

The diagrams appear in this order in the report, so numbering matches the
narrative flow:

1. Architecture baseline (1)
2. Concrete bug (2)
3. Four surface bugs with one root (3)
4. The fix to the primary bug (4)
5. General-purpose protection mechanism (5)
6. Generic failure pattern — textbook framing (6)
7. Summary of the mitigation strategy (7)

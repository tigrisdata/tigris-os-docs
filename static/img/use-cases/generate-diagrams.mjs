#!/usr/bin/env node
// Converts compact diagram element arrays into proper .excalidraw files
// and generates .excalidraw.png via Playwright

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dir = __dirname;

// Color palette - Tigris Dark Theme
const C = {
  bg: '#141414',
  boxFill: '#111111',
  zoneBg: { infra: '#1a1a2e', cloud: '#1a1a10' },
  border: '#333333',
  textPrimary: '#e5e5e5',
  textSecondary: '#a0a0a0',
  blue: '#4a9eed',
  purple: '#8b5cf6',
  green: '#22c55e',
  amber: '#f59e0b',
  cyan: '#06b6d4',
  // box fills per accent
  blueFill: '#0d2030',
  purpleFill: '#1e1040',
  greenFill: '#0d2e0d',
  amberFill: '#2e1f00',
  cyanFill: '#052830',
};

function makeExcalidraw(elements) {
  // Filter out cameraUpdate and darkbg pseudo-elements
  const filtered = elements.filter(
    (el) => el.type !== 'cameraUpdate' && el.id !== 'darkbg'
  );

  let indexCounter = 0;
  const expanded = [];

  for (const el of filtered) {
    const base = {
      version: 1,
      versionNonce: Math.floor(Math.random() * 2147483647),
      index: 'a' + indexCounter.toString(36),
      isDeleted: false,
      fillStyle: el.fillStyle || 'solid',
      strokeWidth: el.strokeWidth || 2,
      strokeStyle: el.strokeStyle || 'solid',
      roughness: 1,
      opacity: el.opacity ?? 100,
      angle: 0,
      seed: Math.floor(Math.random() * 2147483647),
      groupIds: [],
      frameId: null,
      roundness: el.roundness || null,
      updated: Date.now(),
      link: null,
      locked: false,
    };

    if (el.type === 'text') {
      expanded.push({
        type: 'text',
        ...base,
        id: el.id,
        x: el.x,
        y: el.y,
        width: el.width || el.text.length * (el.fontSize || 20) * 0.6,
        height: el.height || (el.fontSize || 20) * 1.25,
        backgroundColor: 'transparent',
        strokeColor: el.strokeColor || C.textPrimary,
        text: el.text,
        originalText: el.text,
        autoResize: true,
        fontSize: el.fontSize || 20,
        fontFamily: el.fontFamily || 1,
        textAlign: el.textAlign || 'left',
        verticalAlign: 'middle',
        lineHeight: 1.25,
        containerId: null,
      });
      indexCounter++;
    } else if (el.type === 'rectangle' || el.type === 'ellipse' || el.type === 'diamond') {
      const shapeId = el.id;
      const boundElements = [];

      if (el.label) {
        boundElements.push({ id: shapeId + '_label', type: 'text' });
      }

      expanded.push({
        type: el.type,
        ...base,
        id: shapeId,
        x: el.x,
        y: el.y,
        width: el.width,
        height: el.height,
        backgroundColor: el.backgroundColor || 'transparent',
        strokeColor: el.strokeColor || C.border,
        boundElements: boundElements,
      });
      indexCounter++;

      if (el.label) {
        const fontSize = el.label.fontSize || 20;
        // Multi-line label support: split on \n
        const lines = el.label.text.split('\n');
        const longestLine = lines.reduce((a, b) => (a.length > b.length ? a : b), '');
        const textWidth = Math.min(
          longestLine.length * fontSize * 0.6,
          el.width - 50
        );
        const textHeight = fontSize * 1.25 * lines.length;
        expanded.push({
          type: 'text',
          ...base,
          versionNonce: Math.floor(Math.random() * 2147483647),
          seed: Math.floor(Math.random() * 2147483647),
          index: 'a' + indexCounter.toString(36),
          id: shapeId + '_label',
          x: el.x + (el.width - textWidth) / 2,
          y: el.y + (el.height - textHeight) / 2,
          width: textWidth,
          height: textHeight,
          backgroundColor: 'transparent',
          strokeColor: el.label.strokeColor || C.textPrimary,
          roundness: null,
          text: el.label.text,
          originalText: el.label.text,
          autoResize: true,
          fontSize: fontSize,
          fontFamily: 1,
          textAlign: 'center',
          verticalAlign: 'middle',
          lineHeight: 1.25,
          containerId: shapeId,
        });
        indexCounter++;
      }
    } else if (el.type === 'arrow') {
      const arrowId = el.id;
      const boundElements = [];

      if (el.label) {
        boundElements.push({ id: arrowId + '_label', type: 'text' });
      }

      expanded.push({
        type: 'arrow',
        ...base,
        id: arrowId,
        x: el.x,
        y: el.y,
        width: el.width,
        height: el.height,
        backgroundColor: 'transparent',
        strokeColor: el.strokeColor || C.border,
        strokeStyle: el.strokeStyle || 'solid',
        points: el.points,
        endArrowhead: el.endArrowhead ?? 'arrow',
        startArrowhead: el.startArrowhead || null,
        startBinding: el.startBinding
          ? { elementId: el.startBinding.elementId, fixedPoint: null }
          : null,
        endBinding: el.endBinding
          ? { elementId: el.endBinding.elementId, fixedPoint: null }
          : null,
        lastCommittedPoint: null,
        boundElements: boundElements,
      });
      indexCounter++;

      if (el.label) {
        const fontSize = el.label.fontSize || 16;
        const textWidth = el.label.text.length * fontSize * 0.6;
        const textHeight = fontSize * 1.25;
        const midX = el.x + el.points[1][0] / 2 - textWidth / 2;
        const midY = el.y + el.points[1][1] / 2 - textHeight - 5;
        expanded.push({
          type: 'text',
          ...base,
          versionNonce: Math.floor(Math.random() * 2147483647),
          seed: Math.floor(Math.random() * 2147483647),
          index: 'a' + indexCounter.toString(36),
          id: arrowId + '_label',
          x: midX,
          y: midY,
          width: textWidth,
          height: textHeight,
          backgroundColor: 'transparent',
          strokeColor: el.label.strokeColor || C.textSecondary,
          roundness: null,
          text: el.label.text,
          originalText: el.label.text,
          autoResize: true,
          fontSize: fontSize,
          fontFamily: 1,
          textAlign: 'center',
          verticalAlign: 'middle',
          lineHeight: 1.25,
          containerId: arrowId,
        });
        indexCounter++;
      }
    }
  }

  return {
    type: 'excalidraw',
    version: 2,
    source: 'https://excalidraw.com',
    elements: expanded,
    appState: {
      viewBackgroundColor: C.bg,
      gridSize: 20,
      gridStep: 5,
      gridModeEnabled: false,
    },
    files: {},
  };
}

// Helper: zone rectangle (dashed border, semi-transparent fill)
function zone(id, x, y, w, h, label, fillColor, borderColor) {
  return [
    {
      type: 'rectangle',
      id: id + '_zone',
      x, y, width: w, height: h,
      backgroundColor: fillColor,
      strokeColor: borderColor || C.border,
      strokeStyle: 'dashed',
      strokeWidth: 2,
      fillStyle: 'solid',
      opacity: 40,
      roundness: { type: 3 },
    },
    {
      type: 'text',
      id: id + '_zone_label',
      x: x + 14,
      y: y + 10,
      text: label,
      fontSize: 14,
      strokeColor: borderColor || C.textSecondary,
      fontFamily: 1,
      textAlign: 'left',
    },
  ];
}


// Helper: legend box
function legend(id, x, y, items) {
  const lineH = 28;
  const w = 220;
  const h = 20 + items.length * lineH + 10;
  const els = [
    {
      type: 'rectangle',
      id: id + '_legend_box',
      x, y, width: w, height: h,
      backgroundColor: C.boxFill,
      strokeColor: C.border,
      strokeStyle: 'solid',
      strokeWidth: 1,
      fillStyle: 'solid',
      roundness: { type: 3 },
    },
    {
      type: 'text',
      id: id + '_legend_title',
      x: x + 12, y: y + 8,
      text: 'Legend',
      fontSize: 14,
      strokeColor: C.textSecondary,
      fontFamily: 1,
    },
  ];
  items.forEach((item, i) => {
    const ty = y + 30 + i * lineH;
    // short line segment as color swatch
    els.push({
      type: 'arrow',
      id: id + '_legend_arrow_' + i,
      x: x + 12, y: ty + 8,
      width: 30, height: 0,
      points: [[0, 0], [30, 0]],
      strokeColor: item.color,
      strokeStyle: item.dashed ? 'dashed' : 'solid',
      strokeWidth: 2,
      endArrowhead: 'arrow',
    });
    els.push({
      type: 'text',
      id: id + '_legend_text_' + i,
      x: x + 52, y: ty,
      text: item.label,
      fontSize: 14,
      strokeColor: C.textSecondary,
      fontFamily: 1,
    });
  });
  return els;
}

// Standard box helper
function box(id, x, y, w, h, text, accent) {
  const fills = {
    blue: C.blueFill,
    purple: C.purpleFill,
    green: C.greenFill,
    amber: C.amberFill,
    cyan: C.cyanFill,
  };
  const strokes = {
    blue: C.blue,
    purple: C.purple,
    green: C.green,
    amber: C.amber,
    cyan: C.cyan,
  };
  return {
    type: 'rectangle',
    id, x, y, width: w, height: h,
    backgroundColor: fills[accent] || C.boxFill,
    strokeColor: strokes[accent] || C.border,
    strokeWidth: 2,
    fillStyle: 'solid',
    roundness: { type: 3 },
    label: { text, fontSize: 20, strokeColor: C.textPrimary },
  };
}

// Arrow helper (horizontal or angled)
function arrow(id, x, y, dx, dy, color, labelText, dashed) {
  const el = {
    type: 'arrow',
    id, x, y,
    width: Math.abs(dx),
    height: Math.abs(dy),
    points: [[0, 0], [dx, dy]],
    strokeColor: color,
    strokeWidth: 2,
    strokeStyle: dashed ? 'dashed' : 'solid',
    endArrowhead: 'arrow',
  };
  if (labelText) {
    el.label = { text: labelText, fontSize: 16, strokeColor: C.textSecondary };
  }
  return el;
}

// Title text helper
function title(id, x, y, text) {
  return {
    type: 'text',
    id, x, y,
    text,
    fontSize: 26,
    strokeColor: C.textPrimary,
    fontFamily: 1,
    textAlign: 'center',
  };
}

// ─── Diagram Data ────────────────────────────────────────────────────────────

const diagrams = {

  // 1. Stream Training Data to GPUs
  'training-stream-data': [
    title('ttl', 300, 18, 'Stream Training Data to GPUs'),
    ...zone('cloud', 40, 70, 290, 170, 'Tigris Cloud', C.zoneBg.cloud, C.amber),
    ...zone('infra', 500, 70, 1060, 440, 'Your Infrastructure', C.zoneBg.infra, C.blue),
    box('gb',  60,  120, 240, 80, 'Global Bucket', 'amber'),
    box('tag', 520, 120, 220, 80, 'TAG Cache', 'purple'),
    box('dl',  920, 120, 260, 80, 'DataLoader Workers', 'blue'),
    box('gpu', 1360,120, 180, 80, 'GPU', 'green'),
    box('sky', 920, 350, 260, 80, 'SkyPilot', 'cyan'),
    arrow('a1', 300, 160, 220, 0,  C.amber,  'fetch'),
    arrow('a2', 740, 160, 180, 0,  C.purple, 'stream'),
    arrow('a3',1180, 160, 180, 0,  C.green,  'batch'),
    arrow('a4', 300, 180, 620, 100,C.blue,   'direct read', true),
    arrow('a5',1050, 350, 0, -150, C.cyan,   'launches'),
    ...legend('leg', 40, 360, [
      { color: C.amber,  label: 'fetch from Tigris' },
      { color: C.blue,   label: 'direct read (bypass cache)', dashed: true },
      { color: C.green,  label: 'training data to GPU' },
    ]),
  ],

  // 2. Hydrate Datasets to Local Storage
  'training-hydrate-data': [
    title('ttl', 300, 18, 'Hydrate Datasets to Local Storage'),
    ...zone('cloud', 40, 70, 280, 170, 'Tigris Cloud', C.zoneBg.cloud, C.amber),
    ...zone('infra', 500, 70, 730, 170, 'Your Infrastructure', C.zoneBg.infra, C.blue),
    box('tb',   60, 120, 240, 80, 'Tigris Bucket', 'amber'),
    box('pfs', 520, 120, 260, 80, 'Weka / VAST / Lustre', 'cyan'),
    box('tc',  960, 120, 240, 80, 'Training Container', 'blue'),
    box('gpu', 960, 320, 200, 80, 'GPU', 'green'),
    arrow('a1', 300, 160, 220, 0,  C.amber,  'ingest'),
    arrow('a2', 780, 160, 180, 0,  C.cyan,   'CSI mount'),
    arrow('a3',1080, 200, 0,  120, C.green,  'train'),
    arrow('a4',1060, 320, -760, 0, C.purple, 'checkpoints', true),
    ...legend('leg', 40, 310, [
      { color: C.amber,  label: 'data hydration' },
      { color: C.cyan,   label: 'CSI mount read' },
      { color: C.green,  label: 'GPU training' },
      { color: C.purple, label: 'checkpoint write-back', dashed: true },
    ]),
  ],

  // 3. Checkpoint, Resume, and Fork Training
  'training-checkpoint': [
    title('ttl', 240, 18, 'Checkpoint, Resume, and Fork Training'),
    box('tj',   40,  220, 220, 80, 'Training Job', 'blue'),
    box('cb',   440, 220, 240, 80, 'Checkpoint Bucket', 'amber'),
    box('snap', 860, 220, 240, 80, 'Snapshot @ epoch N', 'purple'),
    box('rj',  1280, 100, 240, 80, 'Resumed Job\n(any machine)', 'green'),
    box('ea',  1280, 240, 240, 80, 'Experiment A\nlr=1e-4', 'cyan'),
    box('eb',  1280, 370, 240, 80, 'Experiment B\nlr=3e-5', 'cyan'),
    box('ec',  1280, 500, 240, 80, 'Experiment C\nlr=1e-3', 'cyan'),
    arrow('a1', 260, 260, 180, 0,  C.amber,  'save checkpoint'),
    arrow('a2', 680, 260, 180, 0,  C.purple, 'snapshot'),
    arrow('a3',1100, 260, 180,-120,C.green,  'resume'),
    arrow('a4',1100, 260, 180, 20, C.cyan,   'fork A'),
    arrow('a5',1100, 260, 180,150, C.cyan,   'fork B'),
    arrow('a6',1100, 260, 180,280, C.cyan,   'fork C'),
    ...legend('leg', 40, 440, [
      { color: C.amber,  label: 'checkpoint save' },
      { color: C.purple, label: 'snapshot' },
      { color: C.green,  label: 'resume from snapshot' },
      { color: C.cyan,   label: 'fork experiment' },
    ]),
  ],

  // 4. Trigger Post-Training Pipelines
  'training-pipelines': [
    title('ttl', 280, 18, 'Trigger Post-Training Pipelines'),
    ...zone('ztrain', 40, 70, 260, 170, 'Training', C.zoneBg.infra, C.blue),
    ...zone('zcloud', 480, 70, 260, 170, 'Tigris Cloud', C.zoneBg.cloud, C.amber),
    ...zone('zpipe',  920, 70, 580, 420, 'Your Pipeline', C.zoneBg.infra, C.purple),
    box('tj',  60,  120, 220, 80, 'Training Job', 'blue'),
    box('mb',  500, 120, 220, 80, 'Model Bucket', 'amber'),
    box('ph',  940, 120, 240, 80, 'Pipeline Handler', 'purple'),
    box('ev', 1260, 100, 220, 80, 'Run Evals', 'green'),
    box('qc', 1260, 240, 220, 80, 'Quantize / Convert', 'cyan'),
    box('dep',1260, 380, 220, 80, 'Deploy to Inference', 'blue'),
    arrow('a1', 280, 160, 220, 0, C.amber,  'upload model'),
    arrow('a2', 720, 160, 220, 0, C.purple, 'webhook'),
    arrow('a3',1180, 160, 80, -40,C.green,  'eval'),
    arrow('a4',1180, 160, 80, 80, C.cyan,   'quantize'),
    arrow('a5',1180, 160, 80,220, C.blue,   'deploy'),
    ...legend('leg', 40, 340, [
      { color: C.amber,  label: 'model upload' },
      { color: C.purple, label: 'webhook trigger' },
      { color: C.green,  label: 'evaluation pipeline' },
      { color: C.cyan,   label: 'quantization/convert' },
    ]),
  ],

  // 5. Store and Serve Model Weights Globally
  'training-global-weights': [
    title('ttl', 260, 18, 'Store and Serve Model Weights Globally'),
    ...zone('cloud', 420, 130, 240, 140, 'Tigris Cloud', C.zoneBg.cloud, C.amber),
    box('tj',   40,  220, 220, 80, 'Training Job', 'blue'),
    box('gb',   440, 150, 200, 80, 'Global Bucket', 'amber'),
    box('us',   840, 90,  220, 80, 'Inference US', 'green'),
    box('eu',   840, 230, 220, 80, 'Inference EU', 'green'),
    box('apac', 840, 370, 220, 80, 'Inference APAC', 'green'),
    arrow('a1', 260, 260, 180, -60, C.amber, 'push weights'),
    arrow('a2', 640, 190, 200, -70, C.green, 'local read'),
    arrow('a3', 640, 190, 200, 50,  C.green, 'local read'),
    arrow('a4', 640, 190, 200, 190, C.green, 'local read'),
    ...legend('leg', 40, 400, [
      { color: C.amber, label: 'push weights to Tigris' },
      { color: C.green, label: 'local read (low latency)' },
    ]),
  ],

  // 6. Persist Agent Memory Globally
  'agents-persist-memory': [
    title('ttl', 260, 18, 'Persist Agent Memory Globally'),
    ...zone('cloud', 430, 120, 240, 140, 'Tigris Cloud', C.zoneBg.cloud, C.amber),
    box('ag',   40,  210, 240, 80, 'Agent (any region)', 'blue'),
    box('gb',   450, 140, 200, 80, 'Global Bucket', 'amber'),
    box('eu',   850, 90,  220, 80, 'Agent EU', 'green'),
    box('us',   850, 230, 220, 80, 'Agent US', 'green'),
    box('apac', 850, 370, 220, 80, 'Agent APAC', 'green'),
    arrow('a1', 280, 250, 170, -60, C.amber, 'PutObject'),
    arrow('a2', 650, 180, 200, -60, C.green, 'local read'),
    arrow('a3', 650, 180, 200, 60,  C.green, 'local read'),
    arrow('a4', 650, 180, 200, 200, C.green, 'local read'),
    ...legend('leg', 40, 420, [
      { color: C.amber, label: 'PutObject (write memory)' },
      { color: C.green, label: 'local read (any region)' },
    ]),
  ],

  // 7. Checkpoint and Resume Agents
  'agents-checkpoint': [
    title('ttl', 240, 18, 'Checkpoint and Resume Agents'),
    box('ag',   40,  220, 200, 80, 'Agent', 'blue'),
    box('cb',   420, 220, 240, 80, 'Checkpoint Bucket', 'amber'),
    box('snap', 840, 220, 200, 80, 'Snapshot', 'purple'),
    box('ra',  1220, 120, 220, 80, 'Resumed Agent', 'green'),
    box('sa',  1220, 260, 220, 80, 'Sub-agent A', 'cyan'),
    box('sb',  1220, 400, 220, 80, 'Sub-agent B', 'cyan'),
    arrow('a1', 240, 260, 180, 0,   C.amber,  'save state'),
    arrow('a2', 660, 260, 180, 0,   C.purple, 'snapshot'),
    arrow('a3',1040, 260, 180,-100, C.green,  'resume'),
    arrow('a4',1040, 260, 180, 40,  C.cyan,   'fork A'),
    arrow('a5',1040, 260, 180, 170, C.cyan,   'fork B'),
    ...legend('leg', 40, 430, [
      { color: C.amber,  label: 'save agent state' },
      { color: C.purple, label: 'create snapshot' },
      { color: C.green,  label: 'resume from snapshot' },
      { color: C.cyan,   label: 'fork sub-agent' },
    ]),
  ],

  // 8. Trigger Processing Pipelines
  'agents-pipelines': [
    title('ttl', 280, 18, 'Trigger Processing Pipelines'),
    ...zone('zcloud', 460, 70, 260, 170, 'Tigris Cloud', C.zoneBg.cloud, C.amber),
    ...zone('zpipe',  900, 70, 580, 400, 'Your Pipeline', C.zoneBg.infra, C.purple),
    box('ag',  40,  130, 220, 80, 'Agent', 'blue'),
    box('tb',  480, 120, 220, 80, 'Tigris Bucket', 'amber'),
    box('pw',  920, 130, 240, 80, 'Processing Worker', 'purple'),
    box('idx',1240, 90,  220, 80, 'Index', 'blue'),
    box('emb',1240, 230, 220, 80, 'Embed', 'cyan'),
    box('ntf',1240, 370, 220, 80, 'Notify', 'green'),
    arrow('a1', 260, 170, 220, 0,  C.amber,  'PutObject'),
    arrow('a2', 700, 170, 220, 0,  C.purple, 'webhook'),
    arrow('a3',1160, 170, 80, -60, C.blue,   'index'),
    arrow('a4',1160, 170, 80, 60,  C.cyan,   'embed'),
    arrow('a5',1160, 170, 80, 200, C.green,  'notify'),
    ...legend('leg', 40, 360, [
      { color: C.amber,  label: 'PutObject trigger' },
      { color: C.purple, label: 'webhook dispatch' },
      { color: C.blue,   label: 'index / embed / notify' },
    ]),
  ],

  // 9. Fork Storage for Isolated Eval Runs
  'agents-fork-eval': [
    title('ttl', 220, 18, 'Fork Storage for Isolated Eval Runs'),
    box('rb',   40,  220, 240, 80, 'Reference Bucket', 'amber'),
    box('snap', 460, 220, 220, 80, 'Snapshot', 'purple'),
    box('ea',   880, 100, 240, 80, 'Eval Run A\n(isolated)', 'blue'),
    box('eb',   880, 250, 240, 80, 'Eval Run B\n(isolated)', 'cyan'),
    box('ec',   880, 400, 240, 80, 'Eval Run C\n(isolated)', 'green'),
    arrow('a1', 280, 260, 180, 0,   C.purple, 'snapshot'),
    arrow('a2', 680, 260, 200,-130, C.blue,   'fork A'),
    arrow('a3', 680, 260, 200, 20,  C.cyan,   'fork B'),
    arrow('a4', 680, 260, 200, 170, C.green,  'fork C'),
    ...legend('leg', 40, 420, [
      { color: C.purple, label: 'snapshot reference bucket' },
      { color: C.blue,   label: 'fork for isolated eval' },
      { color: C.cyan,   label: 'isolated eval run' },
    ]),
  ],

  // 10. Distribute Agent Artifacts Globally
  'agents-distribute': [
    title('ttl', 260, 18, 'Distribute Agent Artifacts Globally'),
    ...zone('cloud', 420, 120, 240, 140, 'Tigris Cloud', C.zoneBg.cloud, C.amber),
    box('ci',   40,  220, 220, 80, 'CI Pipeline', 'blue'),
    box('gb',   440, 140, 200, 80, 'Global Bucket', 'amber'),
    box('us',   840, 90,  220, 80, 'Fleet Node US', 'green'),
    box('eu',   840, 230, 220, 80, 'Fleet Node EU', 'green'),
    box('apac', 840, 370, 220, 80, 'Fleet Node APAC', 'green'),
    arrow('a1', 260, 260, 180, -60, C.amber, 'PutObject'),
    arrow('a2', 640, 180, 200, -60, C.green, 'local read'),
    arrow('a3', 640, 180, 200, 60,  C.green, 'local read'),
    arrow('a4', 640, 180, 200, 200, C.green, 'local read'),
    ...legend('leg', 40, 420, [
      { color: C.amber, label: 'PutObject artifact' },
      { color: C.green, label: 'local read (low latency)' },
    ]),
  ],

  // 11. Mount Buckets in Agent Sandboxes
  'agents-sandboxes': [
    title('ttl', 200, 18, 'Mount Buckets in Agent Sandboxes'),
    ...zone('cloud',   40, 80, 280, 170, 'Tigris Cloud', C.zoneBg.cloud, C.amber),
    ...zone('sandbox', 520, 80, 480, 300, 'Sandbox', C.zoneBg.infra, C.purple),
    box('plat', 60,  340, 220, 80, 'Platform', 'blue'),
    box('tb',   60,  120, 240, 80, 'Tigris Bucket', 'amber'),
    box('tfs',  540, 120, 240, 80, 'TigrisFS Mount', 'purple'),
    box('agent',600, 260, 220, 80, 'Agent', 'blue'),
    arrow('a1', 300, 160, 240, 0,   C.amber,  'mount bucket'),
    arrow('a2', 170, 340, 0, -140,  C.blue,   'create bucket'),
    arrow('a3', 660, 200, 0, 60,    C.purple, 'fs access'),
    ...legend('leg', 40, 450, [
      { color: C.blue,   label: 'create bucket (platform)' },
      { color: C.amber,  label: 'TigrisFS mount' },
      { color: C.purple, label: 'filesystem access' },
    ]),
  ],
};

// ─── Write .excalidraw files ─────────────────────────────────────────────────

for (const [name, elements] of Object.entries(diagrams)) {
  const data = makeExcalidraw(elements.flat());
  const outPath = path.join(dir, name + '.excalidraw');
  fs.writeFileSync(outPath, JSON.stringify(data, null, 2));
  console.log('Wrote', outPath);
}

// ─── PNG export via Playwright ───────────────────────────────────────────────

async function exportPngs() {
  let chromium;
  try {
    const playwright = await import('playwright');
    chromium = playwright.chromium;
  } catch {
    console.log('playwright not available, skipping PNG export');
    return;
  }
  const browser = await chromium.launch();
  const page = await browser.newPage();

  for (const name of Object.keys(diagrams)) {
    const excalidrawPath = path.join(dir, name + '.excalidraw');
    const pngPath = path.join(dir, name + '.excalidraw.png');

    const fileContent = fs.readFileSync(excalidrawPath, 'utf8');
    const parsed = JSON.parse(fileContent);

    // Use Excalidraw embed to render
    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <style>body { margin: 0; background: #141414; }</style>
      </head>
      <body>
        <canvas id="c"></canvas>
        <script>
          window.__excalidrawData = ${JSON.stringify(parsed)};
        </script>
      </body>
      </html>
    `);

    // Screenshot fallback: just save a placeholder note that PNG generation
    // requires the Excalidraw web app or @excalidraw/utils
    console.log('PNG export requires @excalidraw/utils — skipping', name);
  }

  await browser.close();
}

exportPngs().catch((e) => console.error('PNG export error:', e));

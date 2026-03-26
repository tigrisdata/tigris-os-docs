export default function TAGCoalescingDiagram() {
  const W = 620;
  const H = 260;
  const boxH = 38;
  const boxR = 8;

  // Clients column
  const cX = 40;
  const cW = 100;
  const cGap = 46;
  const cStartY = 30;

  // TAG coalescer
  const tagX = 230;
  const tagY = 80;
  const tagW = 150;
  const tagH = 48;

  // Tigris
  const tX = 470;
  const tY = 80;
  const tW = 120;
  const tH = 48;

  const tagCy = tagY + tagH / 2;
  const tCy = tY + tH / 2;

  const clients = ["Client A", "Client B", "Client C", "Client D"];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Request coalescing: four clients send concurrent requests, TAG fetches once from Tigris"
    >
      <defs>
        <marker id="co-arrow-right" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M1,1 L7,4 L1,7" fill="none" stroke="#62FEB5" strokeWidth="1.5" />
        </marker>
        <marker id="co-arrow-left" markerWidth="8" markerHeight="8" refX="1" refY="4" orient="auto">
          <path d="M7,1 L1,4 L7,7" fill="none" stroke="#62FEB5" strokeWidth="1.5" />
        </marker>
        <marker id="co-arrow-gray-left" markerWidth="8" markerHeight="8" refX="1" refY="4" orient="auto">
          <path d="M7,1 L1,4 L7,7" fill="none" stroke="#506874" strokeWidth="1.5" />
        </marker>
      </defs>

      {/* Client boxes */}
      {clients.map((name, i) => {
        const cy = cStartY + i * cGap;
        return (
          <g key={name}>
            <rect x={cX} y={cy} width={cW} height={boxH} rx={boxR} fill="#142229" stroke="#2a4050" strokeWidth="1.2" />
            <text x={cX + cW / 2} y={cy + boxH / 2 + 1} textAnchor="middle" dominantBaseline="middle" fill="#c8d6de" fontSize="11" fontWeight="500" fontFamily="sans-serif">
              {name}
            </text>
            {/* Client → TAG */}
            <line x1={cX + cW} y1={cy + boxH / 2} x2={tagX} y2={tagCy} stroke="#62FEB5" strokeWidth="1.2" markerEnd="url(#co-arrow-right)" />
          </g>
        );
      })}

      {/* TAG coalescer box */}
      <rect x={tagX} y={tagY} width={tagW} height={tagH} rx={boxR} fill="#62FEB5" />
      <text x={tagX + tagW / 2} y={tagCy + 1} textAnchor="middle" dominantBaseline="middle" fill="#0A171E" fontSize="11" fontWeight="700" fontFamily="sans-serif">
        TAG coalescer
      </text>

      {/* Tigris box */}
      <rect x={tX} y={tY} width={tW} height={tH} rx={boxR} fill="#101c24" stroke="#62FEB5" strokeWidth="1.5" />
      <text x={tX + tW / 2} y={tCy + 1} textAnchor="middle" dominantBaseline="middle" fill="#62FEB5" fontSize="12" fontWeight="600" fontFamily="sans-serif">
        Tigris
      </text>

      {/* TAG → Tigris (single upstream GET) */}
      <line x1={tagX + tagW} y1={tagCy - 5} x2={tX} y2={tCy - 5} stroke="#62FEB5" strokeWidth="1.5" markerEnd="url(#co-arrow-right)" />
      <text x={(tagX + tagW + tX) / 2} y={tagCy - 16} textAnchor="middle" fill="#8fa3b0" fontSize="9" fontStyle="italic" fontFamily="sans-serif">
        single upstream GET
      </text>

      {/* Tigris → TAG (stream chunks) */}
      <line x1={tX} y1={tCy + 5} x2={tagX + tagW} y2={tagCy + 5} stroke="#62FEB5" strokeWidth="1.5" markerEnd="url(#co-arrow-left)" />
      <text x={(tagX + tagW + tX) / 2} y={tagCy + 24} textAnchor="middle" fill="#8fa3b0" fontSize="9" fontStyle="italic" fontFamily="sans-serif">
        stream chunks
      </text>

      {/* TAG → Clients (fan-out, dashed gray) */}
      {clients.map((name, i) => {
        const cy = cStartY + i * cGap + boxH / 2;
        return (
          <line key={`back-${name}`} x1={tagX} y1={tagCy} x2={cX + cW} y2={cy} stroke="#506874" strokeWidth="1" strokeDasharray="4 3" markerEnd="url(#co-arrow-gray-left)" />
        );
      })}

      {/* Annotation */}
      <text x={W / 2} y={H - 8} textAnchor="middle" fill="#506874" fontSize="10" fontFamily="sans-serif" fontStyle="italic">
        4 concurrent requests → 1 upstream fetch → streamed to all clients
      </text>
    </svg>
  );
}

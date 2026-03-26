export default function TAGClusterDiagram() {
  const W = 560;
  const H = 300;
  const boxH = 48;
  const boxR = 8;

  // Load balancer
  const lbX = 210;
  const lbY = 20;
  const lbW = 140;

  // TAG nodes - spread horizontally
  const nodeY = 130;
  const nodeW = 130;
  const nodeH = 52;
  const n1X = 30;
  const n2X = 215;
  const n3X = 400;

  const lbCx = lbX + lbW / 2;
  const lbCy = lbY + boxH / 2;

  const nodeCy = nodeY + nodeH / 2;
  const n1Cx = n1X + nodeW / 2;
  const n2Cx = n2X + nodeW / 2;
  const n3Cx = n3X + nodeW / 2;

  // Gossip area
  const gossipY = nodeY + nodeH + 40;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="TAG cluster: load balancer distributes to three TAG nodes connected via gRPC and gossip"
    >
      <defs>
        <marker id="cl-arrow-down" markerWidth="8" markerHeight="8" refX="4" refY="7" orient="auto">
          <path d="M1,1 L4,7 L7,1" fill="none" stroke="#62FEB5" strokeWidth="1.5" />
        </marker>
        <marker id="cl-arrow-right" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M1,1 L7,4 L1,7" fill="none" stroke="#62FEB5" strokeWidth="1.5" />
        </marker>
        <marker id="cl-arrow-left" markerWidth="8" markerHeight="8" refX="1" refY="4" orient="auto">
          <path d="M7,1 L1,4 L7,7" fill="none" stroke="#62FEB5" strokeWidth="1.5" />
        </marker>
      </defs>

      {/* Load Balancer box */}
      <rect x={lbX} y={lbY} width={lbW} height={boxH} rx={boxR} fill="#142229" stroke="#2a4050" strokeWidth="1.2" />
      <text x={lbCx} y={lbCy + 1} textAnchor="middle" dominantBaseline="middle" fill="#c8d6de" fontSize="12" fontWeight="500" fontFamily="sans-serif">
        Load Balancer
      </text>

      {/* LB → Nodes */}
      <line x1={lbCx - 30} y1={lbY + boxH} x2={n1Cx} y2={nodeY} stroke="#62FEB5" strokeWidth="1.5" markerEnd="url(#cl-arrow-down)" />
      <line x1={lbCx} y1={lbY + boxH} x2={n2Cx} y2={nodeY} stroke="#62FEB5" strokeWidth="1.5" markerEnd="url(#cl-arrow-down)" />
      <line x1={lbCx + 30} y1={lbY + boxH} x2={n3Cx} y2={nodeY} stroke="#62FEB5" strokeWidth="1.5" markerEnd="url(#cl-arrow-down)" />

      {/* TAG Node 1 */}
      <rect x={n1X} y={nodeY} width={nodeW} height={nodeH} rx={boxR} fill="#62FEB5" />
      <text x={n1Cx} y={nodeCy - 7} textAnchor="middle" dominantBaseline="middle" fill="#0A171E" fontSize="11" fontWeight="700" fontFamily="sans-serif">
        TAG-1
      </text>
      <text x={n1Cx} y={nodeCy + 9} textAnchor="middle" dominantBaseline="middle" fill="#0A171E" fontSize="10" fontWeight="500" fontFamily="sans-serif" opacity="0.7">
        keys A–F
      </text>

      {/* TAG Node 2 */}
      <rect x={n2X} y={nodeY} width={nodeW} height={nodeH} rx={boxR} fill="#62FEB5" />
      <text x={n2Cx} y={nodeCy - 7} textAnchor="middle" dominantBaseline="middle" fill="#0A171E" fontSize="11" fontWeight="700" fontFamily="sans-serif">
        TAG-2
      </text>
      <text x={n2Cx} y={nodeCy + 9} textAnchor="middle" dominantBaseline="middle" fill="#0A171E" fontSize="10" fontWeight="500" fontFamily="sans-serif" opacity="0.7">
        keys G–R
      </text>

      {/* TAG Node 3 */}
      <rect x={n3X} y={nodeY} width={nodeW} height={nodeH} rx={boxR} fill="#62FEB5" />
      <text x={n3Cx} y={nodeCy - 7} textAnchor="middle" dominantBaseline="middle" fill="#0A171E" fontSize="11" fontWeight="700" fontFamily="sans-serif">
        TAG-3
      </text>
      <text x={n3Cx} y={nodeCy + 9} textAnchor="middle" dominantBaseline="middle" fill="#0A171E" fontSize="10" fontWeight="500" fontFamily="sans-serif" opacity="0.7">
        keys S–Z
      </text>

      {/* gRPC connections (solid green, bidirectional) */}
      <line x1={n1X + nodeW} y1={nodeCy - 4} x2={n2X} y2={nodeCy - 4} stroke="#62FEB5" strokeWidth="1.5" markerEnd="url(#cl-arrow-right)" />
      <line x1={n2X} y1={nodeCy + 4} x2={n1X + nodeW} y2={nodeCy + 4} stroke="#62FEB5" strokeWidth="1.5" markerEnd="url(#cl-arrow-left)" />

      <line x1={n2X + nodeW} y1={nodeCy - 4} x2={n3X} y2={nodeCy - 4} stroke="#62FEB5" strokeWidth="1.5" markerEnd="url(#cl-arrow-right)" />
      <line x1={n3X} y1={nodeCy + 4} x2={n2X + nodeW} y2={nodeCy + 4} stroke="#62FEB5" strokeWidth="1.5" markerEnd="url(#cl-arrow-left)" />

      {/* gRPC labels */}
      <text x={(n1X + nodeW + n2X) / 2} y={nodeCy - 14} textAnchor="middle" fill="#62FEB5" fontSize="9" fontWeight="600" fontFamily="sans-serif">
        gRPC
      </text>
      <text x={(n2X + nodeW + n3X) / 2} y={nodeCy - 14} textAnchor="middle" fill="#62FEB5" fontSize="9" fontWeight="600" fontFamily="sans-serif">
        gRPC
      </text>

      {/* Gossip connections (dashed gray, triangle) */}
      <line x1={n1Cx} y1={nodeY + nodeH} x2={n2Cx} y2={nodeY + nodeH} stroke="#506874" strokeWidth="1" strokeDasharray="4 3" />
      <line x1={n2Cx} y1={nodeY + nodeH} x2={n3Cx} y2={nodeY + nodeH} stroke="#506874" strokeWidth="1" strokeDasharray="4 3" />
      <line x1={n1Cx} y1={nodeY + nodeH + 4} x2={n3Cx} y2={nodeY + nodeH + 4} stroke="#506874" strokeWidth="1" strokeDasharray="4 3" />

      {/* Gossip label */}
      <text x={W / 2} y={gossipY + 8} textAnchor="middle" fill="#506874" fontSize="9" fontWeight="500" fontFamily="sans-serif">
        gossip protocol
      </text>

      {/* Annotation */}
      <text x={W / 2} y={H - 10} textAnchor="middle" fill="#506874" fontSize="10" fontFamily="sans-serif" fontStyle="italic">
        Consistent hashing spreads keys · gRPC forwards requests · gossip discovers peers
      </text>
    </svg>
  );
}

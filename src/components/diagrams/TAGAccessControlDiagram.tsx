export default function TAGAccessControlDiagram() {
  const W = 700;
  const H = 420;
  const boxR = 8;

  // Decision diamond helper
  const Diamond = ({ cx, cy, size, label }: { cx: number; cy: number; size: number; label: string }) => (
    <g>
      <polygon
        points={`${cx},${cy - size} ${cx + size * 1.4},${cy} ${cx},${cy + size} ${cx - size * 1.4},${cy}`}
        fill="#142229"
        stroke="#62FEB5"
        strokeWidth="1.2"
      />
      <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle" fill="#62FEB5" fontSize="10" fontWeight="600" fontFamily="sans-serif">
        {label}
      </text>
    </g>
  );

  // Positions
  const startX = 350;
  const startY = 30;

  const d1X = 350; // Authorization header?
  const d1Y = 100;

  const d2X = 350; // Access key known?
  const d2Y = 200;

  const d3X = 350; // SigV4 valid?
  const d3Y = 300;

  const d4X = 350; // Authz cache hit?
  const d4Y = 390;

  // Forward boxes (right side)
  const fwdX = 560;
  const fwdW = 130;
  const fwdH = 36;

  // Reject box (left side)
  const rejX = 40;
  const rejW = 130;

  // Success box
  const okX = 560;
  const okW = 130;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="TAG access control decision tree: checks authorization header, access key, SigV4, and authz cache"
    >
      <defs>
        <marker id="ac-arrow-down" markerWidth="8" markerHeight="8" refX="4" refY="7" orient="auto">
          <path d="M1,1 L4,7 L7,1" fill="none" stroke="#62FEB5" strokeWidth="1.5" />
        </marker>
        <marker id="ac-arrow-right" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M1,1 L7,4 L1,7" fill="none" stroke="#62FEB5" strokeWidth="1.5" />
        </marker>
        <marker id="ac-arrow-left" markerWidth="8" markerHeight="8" refX="1" refY="4" orient="auto">
          <path d="M7,1 L1,4 L7,7" fill="none" stroke="#506874" strokeWidth="1.5" />
        </marker>
        <marker id="ac-arrow-gray-right" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M1,1 L7,4 L1,7" fill="none" stroke="#506874" strokeWidth="1.5" />
        </marker>
      </defs>

      {/* Start: Request arrives */}
      <rect x={startX - 75} y={startY} width={150} height={36} rx={boxR} fill="#62FEB5" />
      <text x={startX} y={startY + 18 + 1} textAnchor="middle" dominantBaseline="middle" fill="#0A171E" fontSize="11" fontWeight="700" fontFamily="sans-serif">
        Request arrives at TAG
      </text>

      {/* Start → D1 */}
      <line x1={startX} y1={startY + 36} x2={startX} y2={d1Y - 22} stroke="#62FEB5" strokeWidth="1.5" markerEnd="url(#ac-arrow-down)" />

      {/* D1: Authorization header? */}
      <Diamond cx={d1X} cy={d1Y} size={22} label="Authorization header?" />

      {/* D1 → Missing → Forward */}
      <line x1={d1X - 22 * 1.4} y1={d1Y} x2={rejX + rejW + 4} y2={d1Y - 20} stroke="#506874" strokeWidth="1.2" markerEnd="url(#ac-arrow-left)" />
      <rect x={rejX} y={d1Y - 38} width={rejW} height={fwdH} rx={boxR} fill="#101c24" stroke="#62FEB5" strokeWidth="1.5" />
      <text x={rejX + rejW / 2} y={d1Y - 20 + 1} textAnchor="middle" dominantBaseline="middle" fill="#62FEB5" fontSize="10" fontWeight="600" fontFamily="sans-serif">
        Forward to Tigris
      </text>
      <text x={rejX + rejW + 20} y={d1Y - 6} fill="#8fa3b0" fontSize="9" fontFamily="sans-serif" fontStyle="italic">
        missing
      </text>

      {/* D1 → Malformed → Reject */}
      <line x1={d1X - 22 * 1.4} y1={d1Y} x2={rejX + rejW + 4} y2={d1Y + 30} stroke="#506874" strokeWidth="1.2" markerEnd="url(#ac-arrow-left)" />
      <rect x={rejX} y={d1Y + 12} width={rejW} height={fwdH} rx={boxR} fill="#2a1215" stroke="#506874" strokeWidth="1.2" />
      <text x={rejX + rejW / 2} y={d1Y + 30 + 1} textAnchor="middle" dominantBaseline="middle" fill="#c8d6de" fontSize="10" fontWeight="600" fontFamily="sans-serif">
        Reject with 4xx
      </text>
      <text x={rejX + rejW + 20} y={d1Y + 44} fill="#8fa3b0" fontSize="9" fontFamily="sans-serif" fontStyle="italic">
        malformed
      </text>

      {/* D1 → Present → D2 */}
      <line x1={d1X} y1={d1Y + 22} x2={d2X} y2={d2Y - 22} stroke="#62FEB5" strokeWidth="1.5" markerEnd="url(#ac-arrow-down)" />
      <text x={d1X + 8} y={d1Y + 38} fill="#8fa3b0" fontSize="9" fontFamily="sans-serif" fontStyle="italic">
        present
      </text>

      {/* D2: Access key known? */}
      <Diamond cx={d2X} cy={d2Y} size={22} label="Access key known?" />

      {/* D2 → No → Forward */}
      <line x1={d2X + 22 * 1.4} y1={d2Y} x2={fwdX - 4} y2={d2Y} stroke="#506874" strokeWidth="1.2" strokeDasharray="4 3" markerEnd="url(#ac-arrow-gray-right)" />
      <rect x={fwdX} y={d2Y - fwdH / 2} width={fwdW} height={fwdH} rx={boxR} fill="#101c24" stroke="#62FEB5" strokeWidth="1.5" />
      <text x={fwdX + fwdW / 2} y={d2Y - 5} textAnchor="middle" dominantBaseline="middle" fill="#62FEB5" fontSize="9" fontWeight="600" fontFamily="sans-serif">
        Forward to Tigris
      </text>
      <text x={fwdX + fwdW / 2} y={d2Y + 8} textAnchor="middle" dominantBaseline="middle" fill="#506874" fontSize="8" fontFamily="sans-serif">
        learn keys on success
      </text>
      <text x={d2X + 22 * 1.4 + 10} y={d2Y - 8} fill="#8fa3b0" fontSize="9" fontFamily="sans-serif" fontStyle="italic">
        no
      </text>

      {/* D2 → Yes → D3 */}
      <line x1={d2X} y1={d2Y + 22} x2={d3X} y2={d3Y - 22} stroke="#62FEB5" strokeWidth="1.5" markerEnd="url(#ac-arrow-down)" />
      <text x={d2X + 8} y={d2Y + 38} fill="#8fa3b0" fontSize="9" fontFamily="sans-serif" fontStyle="italic">
        yes
      </text>

      {/* D3: SigV4 valid? */}
      <Diamond cx={d3X} cy={d3Y} size={22} label="SigV4 valid?" />

      {/* D3 → Mismatch → Forward */}
      <line x1={d3X + 22 * 1.4} y1={d3Y} x2={fwdX - 4} y2={d3Y} stroke="#506874" strokeWidth="1.2" strokeDasharray="4 3" markerEnd="url(#ac-arrow-gray-right)" />
      <rect x={fwdX} y={d3Y - fwdH / 2} width={fwdW} height={fwdH} rx={boxR} fill="#101c24" stroke="#62FEB5" strokeWidth="1.5" />
      <text x={fwdX + fwdW / 2} y={d3Y - 5} textAnchor="middle" dominantBaseline="middle" fill="#62FEB5" fontSize="9" fontWeight="600" fontFamily="sans-serif">
        Forward to Tigris
      </text>
      <text x={fwdX + fwdW / 2} y={d3Y + 8} textAnchor="middle" dominantBaseline="middle" fill="#506874" fontSize="8" fontFamily="sans-serif">
        re-learn keys if stale
      </text>
      <text x={d3X + 22 * 1.4 + 10} y={d3Y - 8} fill="#8fa3b0" fontSize="9" fontFamily="sans-serif" fontStyle="italic">
        mismatch
      </text>

      {/* D3 → Valid → D4 */}
      <line x1={d3X} y1={d3Y + 22} x2={d4X} y2={d4Y - 22} stroke="#62FEB5" strokeWidth="1.5" markerEnd="url(#ac-arrow-down)" />
      <text x={d3X + 8} y={d3Y + 38} fill="#8fa3b0" fontSize="9" fontFamily="sans-serif" fontStyle="italic">
        valid
      </text>

      {/* D4: Authz cache hit? */}
      <Diamond cx={d4X} cy={d4Y} size={22} label="Authz cache hit?" />

      {/* D4 → Miss → Forward */}
      <line x1={d4X + 22 * 1.4} y1={d4Y} x2={fwdX - 4} y2={d4Y} stroke="#506874" strokeWidth="1.2" strokeDasharray="4 3" markerEnd="url(#ac-arrow-gray-right)" />
      <rect x={fwdX} y={d4Y - fwdH / 2} width={fwdW} height={fwdH} rx={boxR} fill="#101c24" stroke="#62FEB5" strokeWidth="1.5" />
      <text x={fwdX + fwdW / 2} y={d4Y - 5} textAnchor="middle" dominantBaseline="middle" fill="#62FEB5" fontSize="9" fontWeight="600" fontFamily="sans-serif">
        Forward to Tigris
      </text>
      <text x={fwdX + fwdW / 2} y={d4Y + 8} textAnchor="middle" dominantBaseline="middle" fill="#506874" fontSize="8" fontFamily="sans-serif">
        re-authorize on success
      </text>
      <text x={d4X + 22 * 1.4 + 10} y={d4Y - 8} fill="#8fa3b0" fontSize="9" fontFamily="sans-serif" fontStyle="italic">
        miss
      </text>

      {/* D4 → Hit → AuthValidated */}
      <line x1={d4X - 22 * 1.4} y1={d4Y} x2={rejX + rejW + 4} y2={d4Y} stroke="#62FEB5" strokeWidth="1.5" markerEnd="url(#ac-arrow-left)" />
      <rect x={rejX} y={d4Y - fwdH / 2} width={rejW} height={fwdH} rx={boxR} fill="#142229" stroke="#62FEB5" strokeWidth="1" />
      <text x={rejX + rejW / 2} y={d4Y - 5} textAnchor="middle" dominantBaseline="middle" fill="#62FEB5" fontSize="10" fontWeight="600" fontFamily="sans-serif">
        AuthValidated
      </text>
      <text x={rejX + rejW / 2} y={d4Y + 8} textAnchor="middle" dominantBaseline="middle" fill="#506874" fontSize="8" fontFamily="sans-serif">
        serve from cache
      </text>
      <text x={d4X - 22 * 1.4 - 10} y={d4Y - 8} textAnchor="end" fill="#8fa3b0" fontSize="9" fontFamily="sans-serif" fontStyle="italic">
        hit
      </text>
    </svg>
  );
}

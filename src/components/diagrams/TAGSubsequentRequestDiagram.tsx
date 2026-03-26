export default function TAGSubsequentRequestDiagram() {
  const W = 640;
  const H = 260;

  const cX = 80;
  const tX = 300;
  const sX = 520;

  const headY = 30;
  const boxW = 100;
  const boxH = 36;
  const boxR = 8;

  const lifeTop = headY + boxH + 10;
  const lifeBot = H - 20;

  const m1 = lifeTop + 30;
  const m2 = m1 + 40;
  const m3 = m2 + 36;
  const m4 = m3 + 36;
  const m5 = m4 + 40;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Subsequent request: TAG validates locally and serves from cache without contacting Tigris"
    >
      <defs>
        <marker id="sr-arrow-right" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M1,1 L7,4 L1,7" fill="none" stroke="#62FEB5" strokeWidth="1.5" />
        </marker>
        <marker id="sr-arrow-dash-left" markerWidth="8" markerHeight="8" refX="1" refY="4" orient="auto">
          <path d="M7,1 L1,4 L7,7" fill="none" stroke="#506874" strokeWidth="1.5" />
        </marker>
      </defs>

      {/* Participant boxes */}
      <rect x={cX - boxW / 2} y={headY} width={boxW} height={boxH} rx={boxR} fill="#142229" stroke="#62FEB5" strokeWidth="1.2" />
      <text x={cX} y={headY + boxH / 2 + 1} textAnchor="middle" dominantBaseline="middle" fill="#62FEB5" fontSize="12" fontWeight="600" fontFamily="sans-serif">
        Client
      </text>

      <rect x={tX - boxW / 2} y={headY} width={boxW} height={boxH} rx={boxR} fill="#62FEB5" />
      <text x={tX} y={headY + boxH / 2 + 1} textAnchor="middle" dominantBaseline="middle" fill="#0A171E" fontSize="12" fontWeight="700" fontFamily="sans-serif">
        TAG
      </text>

      <rect x={sX - boxW / 2} y={headY} width={boxW} height={boxH} rx={boxR} fill="#101c24" stroke="#62FEB5" strokeWidth="1.5" />
      <text x={sX} y={headY + boxH / 2 + 1} textAnchor="middle" dominantBaseline="middle" fill="#62FEB5" fontSize="12" fontWeight="600" fontFamily="sans-serif">
        Tigris
      </text>

      {/* Lifelines */}
      <line x1={cX} y1={lifeTop} x2={cX} y2={lifeBot} stroke="#1e3340" strokeWidth="1" strokeDasharray="4 4" />
      <line x1={tX} y1={lifeTop} x2={tX} y2={lifeBot} stroke="#1e3340" strokeWidth="1" strokeDasharray="4 4" />
      <line x1={sX} y1={lifeTop} x2={sX} y2={lifeBot} stroke="#1e3340" strokeWidth="1.5" strokeDasharray="2 6" opacity="0.3" />

      {/* Client → TAG */}
      <line x1={cX + 4} y1={m1} x2={tX - 4} y2={m1} stroke="#62FEB5" strokeWidth="1.5" markerEnd="url(#sr-arrow-right)" />
      <text x={(cX + tX) / 2} y={m1 - 8} textAnchor="middle" fill="#c8d6de" fontSize="10" fontFamily="sans-serif">
        GET /bucket/key (Authorization: ...)
      </text>

      {/* Note: Validate SigV4 locally */}
      <rect x={tX - 72} y={m2 - 12} width={144} height={22} rx={4} fill="#142229" stroke="#62FEB5" strokeWidth="0.8" />
      <text x={tX} y={m2 + 1} textAnchor="middle" dominantBaseline="middle" fill="#62FEB5" fontSize="9" fontFamily="sans-serif">
        Validate SigV4 locally
      </text>

      {/* Note: Check authz cache */}
      <rect x={tX - 82} y={m3 - 12} width={164} height={22} rx={4} fill="#142229" stroke="#62FEB5" strokeWidth="0.8" />
      <text x={tX} y={m3 + 1} textAnchor="middle" dominantBaseline="middle" fill="#62FEB5" fontSize="9" fontFamily="sans-serif">
        Check authz cache → AuthValidated
      </text>

      {/* Note: Serve from cache */}
      <rect x={tX - 60} y={m4 - 12} width={120} height={22} rx={4} fill="#142229" stroke="#62FEB5" strokeWidth="0.8" />
      <text x={tX} y={m4 + 1} textAnchor="middle" dominantBaseline="middle" fill="#62FEB5" fontSize="9" fontFamily="sans-serif">
        Serve from cache
      </text>

      {/* TAG → Client: 200 OK */}
      <line x1={tX - 4} y1={m5} x2={cX + 4} y2={m5} stroke="#506874" strokeWidth="1.2" strokeDasharray="4 3" markerEnd="url(#sr-arrow-dash-left)" />
      <text x={(cX + tX) / 2} y={m5 - 8} textAnchor="middle" fill="#c8d6de" fontSize="10" fontFamily="sans-serif">
        200 OK, X-Cache: HIT
      </text>

      {/* "no network" annotation near Tigris */}
      <text x={sX} y={H / 2 + 10} textAnchor="middle" fill="#506874" fontSize="9" fontFamily="sans-serif" fontStyle="italic">
        not contacted
      </text>
    </svg>
  );
}

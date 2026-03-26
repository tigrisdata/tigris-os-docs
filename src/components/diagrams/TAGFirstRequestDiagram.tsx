export default function TAGFirstRequestDiagram() {
  const W = 640;
  const H = 340;

  // Participant columns
  const cX = 80;  // Client
  const tX = 300; // TAG
  const sX = 520; // Tigris

  const headY = 30;
  const boxW = 100;
  const boxH = 36;
  const boxR = 8;

  // Lifeline
  const lifeTop = headY + boxH + 10;
  const lifeBot = H - 20;

  // Message rows
  const m1 = lifeTop + 30;
  const m2 = m1 + 50;
  const m3 = m2 + 50;
  const m4 = m3 + 36;
  const m5 = m4 + 36;
  const m6 = m5 + 50;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="First request sequence: client sends to TAG, TAG forwards to Tigris, learns signing keys"
    >
      <defs>
        <marker id="fr-arrow-right" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M1,1 L7,4 L1,7" fill="none" stroke="#62FEB5" strokeWidth="1.5" />
        </marker>
        <marker id="fr-arrow-left" markerWidth="8" markerHeight="8" refX="1" refY="4" orient="auto">
          <path d="M7,1 L1,4 L7,7" fill="none" stroke="#62FEB5" strokeWidth="1.5" />
        </marker>
        <marker id="fr-arrow-dash-left" markerWidth="8" markerHeight="8" refX="1" refY="4" orient="auto">
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
      <line x1={sX} y1={lifeTop} x2={sX} y2={lifeBot} stroke="#1e3340" strokeWidth="1" strokeDasharray="4 4" />

      {/* Client → TAG: GET /bucket/key */}
      <line x1={cX + 4} y1={m1} x2={tX - 4} y2={m1} stroke="#62FEB5" strokeWidth="1.5" markerEnd="url(#fr-arrow-right)" />
      <text x={(cX + tX) / 2} y={m1 - 8} textAnchor="middle" fill="#c8d6de" fontSize="10" fontFamily="sans-serif">
        GET /bucket/key (Authorization: ...)
      </text>

      {/* TAG → Tigris: Forward */}
      <line x1={tX + 4} y1={m2} x2={sX - 4} y2={m2} stroke="#62FEB5" strokeWidth="1.5" markerEnd="url(#fr-arrow-right)" />
      <text x={(tX + sX) / 2} y={m2 - 8} textAnchor="middle" fill="#c8d6de" fontSize="10" fontFamily="sans-serif">
        Forward auth + proxy headers
      </text>

      {/* Tigris → TAG: 200 OK + keys */}
      <line x1={sX - 4} y1={m3} x2={tX + 4} y2={m3} stroke="#506874" strokeWidth="1.2" strokeDasharray="4 3" markerEnd="url(#fr-arrow-dash-left)" />
      <text x={(tX + sX) / 2} y={m3 - 8} textAnchor="middle" fill="#c8d6de" fontSize="10" fontFamily="sans-serif">
        200 OK + X-Tigris-Proxy-Signing-Keys
      </text>

      {/* Note: Unwrap & store */}
      <rect x={tX - 70} y={m4 - 12} width={140} height={22} rx={4} fill="#142229" stroke="#62FEB5" strokeWidth="0.8" />
      <text x={tX} y={m4 + 1} textAnchor="middle" dominantBaseline="middle" fill="#62FEB5" fontSize="9" fontFamily="sans-serif">
        Unwrap &amp; store derived keys
      </text>

      {/* Note: Grant authz */}
      <rect x={tX - 70} y={m5 - 12} width={140} height={22} rx={4} fill="#142229" stroke="#62FEB5" strokeWidth="0.8" />
      <text x={tX} y={m5 + 1} textAnchor="middle" dominantBaseline="middle" fill="#62FEB5" fontSize="9" fontFamily="sans-serif">
        Grant authz cache entry
      </text>

      {/* TAG → Client: 200 OK */}
      <line x1={tX - 4} y1={m6} x2={cX + 4} y2={m6} stroke="#506874" strokeWidth="1.2" strokeDasharray="4 3" markerEnd="url(#fr-arrow-dash-left)" />
      <text x={(cX + tX) / 2} y={m6 - 8} textAnchor="middle" fill="#c8d6de" fontSize="10" fontFamily="sans-serif">
        200 OK (signing key header stripped)
      </text>
    </svg>
  );
}

export default function TAGOverviewDiagram() {
  const W = 760;
  const H = 340;
  const boxH = 48;
  const boxR = 8;

  // Training instance container
  const instX = 40;
  const instY = 40;
  const instW = 480;
  const instH = 260;

  // Training code box
  const codeX = 80;
  const codeY = 80;
  const codeW = 140;

  // TAG sidecar box
  const tagX = 80;
  const tagY = 180;
  const tagW = 140;

  // NVMe cache box
  const nvmeX = 300;
  const nvmeY = 180;
  const nvmeW = 160;

  // Tigris storage box (outside instance)
  const tigrisX = 580;
  const tigrisY = 180;
  const tigrisW = 150;

  const codeCy = codeY + boxH / 2;
  const tagCy = tagY + boxH / 2;
  const nvmeCy = nvmeY + boxH / 2;
  const tigrisCy = tigrisY + boxH / 2;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="TAG architecture: training code connects to TAG, which caches on NVMe and fetches from Tigris"
    >
      <defs>
        <marker id="ov-arrow-right" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M1,1 L7,4 L1,7" fill="none" stroke="#62FEB5" strokeWidth="1.5" />
        </marker>
        <marker id="ov-arrow-left" markerWidth="8" markerHeight="8" refX="1" refY="4" orient="auto">
          <path d="M7,1 L1,4 L7,7" fill="none" stroke="#62FEB5" strokeWidth="1.5" />
        </marker>
        <marker id="ov-arrow-down" markerWidth="8" markerHeight="8" refX="4" refY="7" orient="auto">
          <path d="M1,1 L4,7 L7,1" fill="none" stroke="#62FEB5" strokeWidth="1.5" />
        </marker>
        <marker id="ov-arrow-gray-right" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M1,1 L7,4 L1,7" fill="none" stroke="#506874" strokeWidth="1.5" />
        </marker>
      </defs>

      {/* Training Instance container */}
      <rect x={instX} y={instY} width={instW} height={instH} rx={14} stroke="#1e3340" strokeWidth="1.5" strokeDasharray="6 3" fill="#0e1920" />
      <text x={instX + 16} y={instY + 24} fill="#8fa3b0" fontSize="12" fontWeight="600" fontFamily="sans-serif" letterSpacing="0.5">
        Training Instance
      </text>

      {/* Training Code box */}
      <rect x={codeX} y={codeY} width={codeW} height={boxH} rx={boxR} fill="#142229" stroke="#2a4050" strokeWidth="1.2" />
      <text x={codeX + codeW / 2} y={codeCy + 1} textAnchor="middle" dominantBaseline="middle" fill="#c8d6de" fontSize="12" fontWeight="500" fontFamily="sans-serif">
        Training Code
      </text>

      {/* TAG box */}
      <rect x={tagX} y={tagY} width={tagW} height={boxH} rx={boxR} fill="#62FEB5" />
      <text x={tagX + tagW / 2} y={tagCy + 1} textAnchor="middle" dominantBaseline="middle" fill="#0A171E" fontSize="11" fontWeight="700" fontFamily="sans-serif" letterSpacing="0.3">
        Acceleration Gateway
      </text>

      {/* NVMe Cache box */}
      <rect x={nvmeX} y={nvmeY} width={nvmeW} height={boxH} rx={boxR} fill="#142229" stroke="#62FEB5" strokeWidth="1" />
      <text x={nvmeX + nvmeW / 2} y={nvmeCy + 1} textAnchor="middle" dominantBaseline="middle" fill="#62FEB5" fontSize="12" fontWeight="600" fontFamily="sans-serif">
        Local NVMe Cache
      </text>

      {/* Tigris Object Storage box */}
      <rect x={tigrisX} y={tigrisY} width={tigrisW} height={boxH} rx={boxR} fill="#101c24" stroke="#62FEB5" strokeWidth="1.5" />
      <text x={tigrisX + tigrisW / 2} y={tigrisCy - 5} textAnchor="middle" dominantBaseline="middle" fill="#62FEB5" fontSize="11" fontWeight="600" fontFamily="sans-serif">
        Tigris Object
      </text>
      <text x={tigrisX + tigrisW / 2} y={tigrisCy + 9} textAnchor="middle" dominantBaseline="middle" fill="#62FEB5" fontSize="11" fontWeight="600" fontFamily="sans-serif">
        Storage
      </text>

      {/* Training Code → TAG */}
      <line x1={codeX + codeW / 2} y1={codeY + boxH} x2={tagX + tagW / 2} y2={tagY} stroke="#62FEB5" strokeWidth="1.5" markerEnd="url(#ov-arrow-down)" />
      <text x={codeX + codeW / 2 + 10} y={(codeY + boxH + tagY) / 2 + 2} fill="#8fa3b0" fontSize="10" fontFamily="sans-serif" fontStyle="italic">
        S3 API
      </text>

      {/* TAG ↔ NVMe Cache */}
      <line x1={tagX + tagW} y1={tagCy - 5} x2={nvmeX} y2={nvmeCy - 5} stroke="#62FEB5" strokeWidth="1.5" markerEnd="url(#ov-arrow-right)" />
      <line x1={nvmeX} y1={nvmeCy + 5} x2={tagX + tagW} y2={tagCy + 5} stroke="#62FEB5" strokeWidth="1.5" markerEnd="url(#ov-arrow-left)" />
      <text x={(tagX + tagW + nvmeX) / 2} y={tagCy - 16} textAnchor="middle" fill="#62FEB5" fontSize="9" fontWeight="600" fontFamily="sans-serif">
        cache hit
      </text>

      {/* NVMe Cache → Tigris (cache miss) */}
      <line x1={nvmeX + nvmeW} y1={nvmeCy - 5} x2={tigrisX} y2={tigrisCy - 5} stroke="#506874" strokeWidth="1.2" strokeDasharray="4 3" markerEnd="url(#ov-arrow-gray-right)" />
      <line x1={tigrisX} y1={tigrisCy + 5} x2={nvmeX + nvmeW} y2={nvmeCy + 5} stroke="#62FEB5" strokeWidth="1.5" markerEnd="url(#ov-arrow-left)" />
      <text x={(nvmeX + nvmeW + tigrisX) / 2} y={nvmeCy - 16} textAnchor="middle" fill="#506874" fontSize="9" fontWeight="500" fontFamily="sans-serif">
        cache miss
      </text>
      <text x={(nvmeX + nvmeW + tigrisX) / 2} y={nvmeCy + boxH / 2 + 20} textAnchor="middle" fill="#62FEB5" fontSize="9" fontWeight="500" fontFamily="sans-serif">
        fill cache
      </text>

      {/* Flow annotation */}
      <text x={W / 2} y={H - 10} textAnchor="middle" fill="#506874" fontSize="11" fontFamily="sans-serif" fontStyle="italic">
        Epoch 1 fetches from Tigris · Epoch 2+ reads from local NVMe at disk speed
      </text>
    </svg>
  );
}

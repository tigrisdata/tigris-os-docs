export default function TAGArchitectureInternalsDiagram() {
  const W = 760;
  const H = 320;
  const boxH = 40;
  const boxR = 8;

  // Column positions
  const col1 = 30; // S3 clients
  const col2 = 190; // HTTP server
  const col3 = 340; // Proxy service (center)
  const col4 = 520; // Cache / upstream
  const col5 = 660; // NVMe / ports

  // Row positions
  const row1 = 40;
  const row2 = 110;
  const row3 = 180;
  const row4 = 250;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="TAG internal architecture: request flow from S3 clients through HTTP server, auth, proxy to cache and upstream"
    >
      <defs>
        <marker id="ar-arrow-right" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M1,1 L7,4 L1,7" fill="none" stroke="#62FEB5" strokeWidth="1.5" />
        </marker>
        <marker id="ar-arrow-down" markerWidth="8" markerHeight="8" refX="4" refY="7" orient="auto">
          <path d="M1,1 L4,7 L7,1" fill="none" stroke="#62FEB5" strokeWidth="1.5" />
        </marker>
        <marker id="ar-arrow-gray-right" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M1,1 L7,4 L1,7" fill="none" stroke="#506874" strokeWidth="1.5" />
        </marker>
      </defs>

      {/* S3 clients */}
      <rect x={col1} y={row2} width={120} height={boxH} rx={boxR} fill="#142229" stroke="#2a4050" strokeWidth="1.2" />
      <text x={col1 + 60} y={row2 + boxH / 2 - 6} textAnchor="middle" dominantBaseline="middle" fill="#c8d6de" fontSize="11" fontWeight="500" fontFamily="sans-serif">
        S3 clients
      </text>
      <text x={col1 + 60} y={row2 + boxH / 2 + 8} textAnchor="middle" dominantBaseline="middle" fill="#506874" fontSize="9" fontFamily="sans-serif">
        SDK / CLI / boto3
      </text>

      {/* HTTP server :8080 */}
      <rect x={col2} y={row2} width={110} height={boxH} rx={boxR} fill="#62FEB5" />
      <text x={col2 + 55} y={row2 + boxH / 2 - 6} textAnchor="middle" dominantBaseline="middle" fill="#0A171E" fontSize="11" fontWeight="700" fontFamily="sans-serif">
        HTTP server
      </text>
      <text x={col2 + 55} y={row2 + boxH / 2 + 8} textAnchor="middle" dominantBaseline="middle" fill="#0A171E" fontSize="9" fontWeight="500" fontFamily="sans-serif" opacity="0.6">
        :8080
      </text>

      {/* SigV4 auth */}
      <rect x={col2} y={row1} width={110} height={boxH} rx={boxR} fill="#62FEB5" />
      <text x={col2 + 55} y={row1 + boxH / 2 + 1} textAnchor="middle" dominantBaseline="middle" fill="#0A171E" fontSize="11" fontWeight="700" fontFamily="sans-serif">
        SigV4 auth
      </text>

      {/* Proxy service */}
      <rect x={col3} y={row2} width={130} height={boxH} rx={boxR} fill="#62FEB5" />
      <text x={col3 + 65} y={row2 + boxH / 2 + 1} textAnchor="middle" dominantBaseline="middle" fill="#0A171E" fontSize="11" fontWeight="700" fontFamily="sans-serif">
        Proxy service
      </text>

      {/* Request coalescing */}
      <rect x={col3} y={row1} width={130} height={boxH} rx={boxR} fill="#62FEB5" />
      <text x={col3 + 65} y={row1 + boxH / 2 + 1} textAnchor="middle" dominantBaseline="middle" fill="#0A171E" fontSize="11" fontWeight="700" fontFamily="sans-serif">
        Request coalescing
      </text>

      {/* Range optimization */}
      <rect x={col3} y={row3} width={130} height={boxH} rx={boxR} fill="#62FEB5" />
      <text x={col3 + 65} y={row3 + boxH / 2 + 1} textAnchor="middle" dominantBaseline="middle" fill="#0A171E" fontSize="11" fontWeight="700" fontFamily="sans-serif">
        Range optimization
      </text>

      {/* RocksDB cache */}
      <rect x={col4} y={row2} width={120} height={boxH} rx={boxR} fill="#142229" stroke="#62FEB5" strokeWidth="1" />
      <text x={col4 + 60} y={row2 + boxH / 2 + 1} textAnchor="middle" dominantBaseline="middle" fill="#62FEB5" fontSize="11" fontWeight="600" fontFamily="sans-serif">
        RocksDB cache
      </text>

      {/* NVMe disk */}
      <rect x={col5} y={row2} width={85} height={boxH} rx={boxR} fill="#142229" stroke="#62FEB5" strokeWidth="1" />
      <text x={col5 + 42} y={row2 + boxH / 2 + 1} textAnchor="middle" dominantBaseline="middle" fill="#62FEB5" fontSize="11" fontWeight="600" fontFamily="sans-serif">
        NVMe disk
      </text>

      {/* Tigris Object Storage */}
      <rect x={col4} y={row1} width={120} height={boxH} rx={boxR} fill="#101c24" stroke="#62FEB5" strokeWidth="1.5" />
      <text x={col4 + 60} y={row1 + boxH / 2 + 1} textAnchor="middle" dominantBaseline="middle" fill="#62FEB5" fontSize="10" fontWeight="600" fontFamily="sans-serif">
        Tigris Object Storage
      </text>

      {/* gRPC :9000 */}
      <rect x={col4} y={row3} width={120} height={boxH} rx={boxR} fill="#62FEB5" />
      <text x={col4 + 60} y={row3 + boxH / 2 - 6} textAnchor="middle" dominantBaseline="middle" fill="#0A171E" fontSize="11" fontWeight="700" fontFamily="sans-serif">
        gRPC
      </text>
      <text x={col4 + 60} y={row3 + boxH / 2 + 8} textAnchor="middle" dominantBaseline="middle" fill="#0A171E" fontSize="9" fontWeight="500" fontFamily="sans-serif" opacity="0.6">
        :9000
      </text>

      {/* Gossip :7000 */}
      <rect x={col4} y={row4} width={120} height={boxH} rx={boxR} fill="#62FEB5" />
      <text x={col4 + 60} y={row4 + boxH / 2 - 6} textAnchor="middle" dominantBaseline="middle" fill="#0A171E" fontSize="11" fontWeight="700" fontFamily="sans-serif">
        Gossip
      </text>
      <text x={col4 + 60} y={row4 + boxH / 2 + 8} textAnchor="middle" dominantBaseline="middle" fill="#0A171E" fontSize="9" fontWeight="500" fontFamily="sans-serif" opacity="0.6">
        :7000
      </text>

      {/* Arrows: S3 clients → HTTP server */}
      <line x1={col1 + 120} y1={row2 + boxH / 2} x2={col2} y2={row2 + boxH / 2} stroke="#62FEB5" strokeWidth="1.5" markerEnd="url(#ar-arrow-right)" />

      {/* HTTP server → SigV4 auth */}
      <line x1={col2 + 55} y1={row2} x2={col2 + 55} y2={row1 + boxH} stroke="#62FEB5" strokeWidth="1.5" />

      {/* HTTP server → Proxy service */}
      <line x1={col2 + 110} y1={row2 + boxH / 2} x2={col3} y2={row2 + boxH / 2} stroke="#62FEB5" strokeWidth="1.5" markerEnd="url(#ar-arrow-right)" />

      {/* Proxy → Request coalescing */}
      <line x1={col3 + 65} y1={row2} x2={col3 + 65} y2={row1 + boxH} stroke="#62FEB5" strokeWidth="1.2" />

      {/* Proxy → Range optimization */}
      <line x1={col3 + 65} y1={row2 + boxH} x2={col3 + 65} y2={row3} stroke="#62FEB5" strokeWidth="1.2" />

      {/* Proxy → RocksDB */}
      <line x1={col3 + 130} y1={row2 + boxH / 2} x2={col4} y2={row2 + boxH / 2} stroke="#62FEB5" strokeWidth="1.5" markerEnd="url(#ar-arrow-right)" />

      {/* RocksDB → NVMe */}
      <line x1={col4 + 120} y1={row2 + boxH / 2} x2={col5} y2={row2 + boxH / 2} stroke="#62FEB5" strokeWidth="1.5" markerEnd="url(#ar-arrow-right)" />

      {/* Proxy → Tigris */}
      <line x1={col3 + 130} y1={row2 + 8} x2={col4} y2={row1 + boxH - 4} stroke="#506874" strokeWidth="1.2" strokeDasharray="4 3" markerEnd="url(#ar-arrow-gray-right)" />

      {/* Proxy → gRPC */}
      <line x1={col3 + 130} y1={row2 + boxH - 8} x2={col4} y2={row3 + 4} stroke="#62FEB5" strokeWidth="1.2" markerEnd="url(#ar-arrow-right)" />

      {/* Proxy → Gossip */}
      <line x1={col3 + 130} y1={row3 + boxH} x2={col4} y2={row4} stroke="#62FEB5" strokeWidth="1.2" markerEnd="url(#ar-arrow-right)" />
    </svg>
  );
}

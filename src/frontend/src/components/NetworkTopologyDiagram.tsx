import { useCallback, useState } from "react";

const NODES = [
  {
    id: "internet",
    label: "Internet",
    x: 450,
    y: 60,
    color: "oklch(0.65 0.26 25)",
    zone: "External Network Zone",
    role: "External Network / Public Internet",
    risks: [
      "DDoS attacks & volumetric floods",
      "Port scanning & reconnaissance",
      "BGP hijacking & route leaks",
      "Zero-day exploit attempts",
      "Botnet command-and-control traffic",
    ],
    protections: [
      "ISP-level traffic scrubbing",
      "Anycast DDoS mitigation",
      "BGP route monitoring & RPKI",
      "Upstream null-routing for blocked prefixes",
    ],
  },
  {
    id: "loadbalancer",
    label: "Load Balancer",
    x: 320,
    y: 160,
    color: "oklch(0.78 0.22 60)",
    zone: "Edge Layer",
    role: "Edge Load Balancer — HA traffic distribution",
    risks: [
      "SSL stripping attacks",
      "Session hijacking via cookie theft",
      "HA failover exploitation during failover window",
      "Connection exhaustion / slowloris",
    ],
    protections: [
      "TLS 1.3 enforced, TLS 1.1 disabled",
      "Active-active redundant pair with health checks",
      "Rate limiting per source IP",
      "HTTP/2 with strict header validation",
    ],
  },
  {
    id: "router",
    label: "Core Router",
    x: 580,
    y: 160,
    color: "oklch(0.78 0.22 60)",
    zone: "Edge Layer",
    role: "Core Router — BGP, routing, redundancy",
    risks: [
      "BGP route injection / hijack",
      "Route table overflow",
      "Misconfigured ACLs",
      "OSPF/BGP adjacency spoofing",
    ],
    protections: [
      "Route filtering & prefix validation",
      "BFD for rapid link failure detection",
      "Redundant WAN links (dual ISP)",
      "Out-of-band management access",
    ],
  },
  {
    id: "ngfw",
    label: "NGFW",
    x: 450,
    y: 260,
    color: "oklch(0.72 0.22 45)",
    zone: "Perimeter Security Layer",
    role: "Next-Gen Firewall — Deep packet inspection, IPS/IDS, geo-block",
    risks: [
      "Rule misconfiguration permitting lateral traffic",
      "Firewall bypass via allowed protocols",
      "Firmware-level CVEs",
      "Evasion via encrypted tunnel abuse",
    ],
    protections: [
      "Deep packet inspection (DPI) + SSL inspection",
      "IPS/IDS signature-based & behavioral rules",
      "Geo-IP blocking for high-risk regions",
      "Application-layer control & DNS security",
    ],
  },
  {
    id: "dmz",
    label: "DMZ Services",
    x: 220,
    y: 360,
    color: "oklch(0.84 0.15 205)",
    zone: "DMZ Zone",
    role: "External Services Layer — WAF, reverse proxy, CDN",
    risks: [
      "Exposed public services exploitation",
      "Lateral pivot into internal network",
      "Misconfigured reverse proxy",
      "Vulnerable 3rd-party components",
    ],
    protections: [
      "Web Application Firewall (WAF) with OWASP ruleset",
      "Reverse proxy with request sanitization",
      "TLS termination + certificate pinning",
      "DMZ VLAN isolation from internal segments",
    ],
  },
  {
    id: "appLayer",
    label: "App Layer",
    x: 450,
    y: 360,
    color: "oklch(0.72 0.20 220)",
    zone: "Application & IAM Layer",
    role: "Secure Processing Layer — app servers, microservices",
    risks: [
      "OWASP Top 10 vulnerabilities",
      "API abuse & insecure endpoints",
      "Supply chain / dependency compromise",
      "Container escape & privilege escalation",
    ],
    protections: [
      "WAF + API gateway with rate limiting",
      "Container isolation (Kubernetes + PodSecurity)",
      "Code signing & SBOM tracking",
      "Secret management (HashiCorp Vault)",
    ],
  },
  {
    id: "iam",
    label: "IAM Layer",
    x: 680,
    y: 360,
    color: "oklch(0.78 0.18 185)",
    zone: "Application & IAM Layer",
    role: "Identity & Access Management — Zero Trust, MFA, PAM",
    risks: [
      "Credential theft & password spraying",
      "Privilege escalation via token abuse",
      "Stale service accounts",
      "OAuth misconfiguration",
    ],
    protections: [
      "MFA enforced for all identities",
      "Privileged Access Management (PAM) with session recording",
      "RBAC + least-privilege enforcement",
      "SSO with adaptive risk-based authentication",
    ],
  },
  {
    id: "dbLayer",
    label: "Data Zone",
    x: 330,
    y: 460,
    color: "oklch(0.65 0.22 270)",
    zone: "Data & Corporate Layer",
    role: "Protected Data Zone — encrypted DB clusters",
    risks: [
      "SQL injection & NoSQL injection",
      "Credential theft for DB accounts",
      "Unencrypted data at rest",
      "Excessive query privileges",
    ],
    protections: [
      "AES-256 encryption at rest + TLS in transit",
      "Database activity monitoring (DAM)",
      "Least-privilege DB accounts",
      "Immutable audit logging",
    ],
  },
  {
    id: "corpNet",
    label: "Corp Network",
    x: 570,
    y: 460,
    color: "oklch(0.87 0.28 145)",
    zone: "Data & Corporate Layer",
    role: "Internal Corporate Network — segmented VLANs",
    risks: [
      "Insider threats & data exfiltration",
      "Lateral movement via compromised host",
      "Rogue devices on network",
      "Shadow IT exposure",
    ],
    protections: [
      "Zero Trust Network Access (ZTNA)",
      "NAC + 802.1X port authentication",
      "VLAN micro-segmentation",
      "East-west traffic inspection",
    ],
  },
  {
    id: "soc",
    label: "SOC / SIEM",
    x: 220,
    y: 560,
    color: "oklch(0.82 0.25 135)",
    zone: "Security & Endpoint Layer",
    role: "Security Monitoring Layer — SIEM, SOAR, threat intel",
    risks: [
      "Alert fatigue leading to missed incidents",
      "Log blind spots from unmonitored sources",
      "Delayed response due to manual triage",
      "SIEM evasion via log tampering",
    ],
    protections: [
      "SIEM with correlation rules & ML-based anomaly detection",
      "SOAR playbooks for automated response",
      "24/7 monitoring with escalation workflows",
      "Threat intelligence feed integration",
    ],
  },
  {
    id: "endpoints",
    label: "Endpoints",
    x: 450,
    y: 560,
    color: "oklch(0.87 0.28 145)",
    zone: "Security & Endpoint Layer",
    role: "Endpoint Layer — managed workstations, EDR/XDR",
    risks: [
      "Phishing & spear-phishing campaigns",
      "Ransomware & fileless malware",
      "Unpatched OS & application CVEs",
      "Removable media data exfiltration",
    ],
    protections: [
      "EDR/XDR with behavioral detection (CrowdStrike/Defender)",
      "Full-disk encryption (BitLocker/FileVault)",
      "Group Policy hardening (CIS benchmarks)",
      "USB port control & DLP policies",
    ],
  },
  {
    id: "criticalZone",
    label: "Critical Systems",
    x: 680,
    y: 560,
    color: "oklch(0.72 0.28 320)",
    zone: "Security & Endpoint Layer",
    role: "High-Security Isolated Environment — air-gapped, strict ACL",
    risks: [
      "Advanced Persistent Threats (APT)",
      "Insider access abuse",
      "Supply chain hardware compromise",
      "Physical access bypassing logical controls",
    ],
    protections: [
      "Air-gap / strict network isolation",
      "Hardware Security Modules (HSM)",
      "Biometric & multi-factor physical access",
      "Dedicated logging & integrity monitoring",
    ],
  },
];

const EDGES = [
  { key: "e1", from: "internet", to: "loadbalancer" },
  { key: "e2", from: "internet", to: "router" },
  { key: "e3", from: "loadbalancer", to: "ngfw" },
  { key: "e4", from: "router", to: "ngfw" },
  { key: "e5", from: "ngfw", to: "dmz" },
  { key: "e6", from: "ngfw", to: "appLayer" },
  { key: "e7", from: "ngfw", to: "iam" },
  { key: "e8", from: "dmz", to: "appLayer" },
  { key: "e9", from: "appLayer", to: "dbLayer" },
  { key: "e10", from: "appLayer", to: "corpNet" },
  { key: "e11", from: "corpNet", to: "endpoints" },
  { key: "e12", from: "corpNet", to: "iam" },
  { key: "e13", from: "iam", to: "criticalZone" },
];

// SOC monitoring lines (dotted)
const SOC_MONITOR_TARGETS = [
  "ngfw",
  "appLayer",
  "dbLayer",
  "corpNet",
  "endpoints",
  "criticalZone",
];

const ZONE_BOXES = [
  {
    label: "External Network Zone",
    x: 380,
    y: 22,
    w: 140,
    h: 76,
    color: "oklch(0.65 0.26 25)",
  },
  {
    label: "Edge Layer",
    x: 258,
    y: 122,
    w: 386,
    h: 76,
    color: "oklch(0.78 0.22 60)",
  },
  {
    label: "Perimeter Security Layer",
    x: 370,
    y: 222,
    w: 160,
    h: 76,
    color: "oklch(0.72 0.22 45)",
  },
  {
    label: "DMZ Zone",
    x: 145,
    y: 322,
    w: 154,
    h: 76,
    color: "oklch(0.84 0.15 205)",
  },
  {
    label: "Application & IAM Layer",
    x: 362,
    y: 322,
    w: 372,
    h: 76,
    color: "oklch(0.72 0.20 220)",
  },
  {
    label: "Data & Corporate Layer",
    x: 240,
    y: 422,
    w: 388,
    h: 76,
    color: "oklch(0.65 0.22 270)",
  },
  {
    label: "Security & Endpoint Layer",
    x: 140,
    y: 522,
    w: 604,
    h: 76,
    color: "oklch(0.82 0.25 135)",
  },
];

function buildPath(fromNode: (typeof NODES)[0], toNode: (typeof NODES)[0]) {
  return `M${fromNode.x},${fromNode.y} L${toNode.x},${toNode.y}`;
}

export default function NetworkTopologyDiagram() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    node: (typeof NODES)[0];
  } | null>(null);

  const nodeMap = Object.fromEntries(NODES.map((n) => [n.id, n]));
  const selectedNode = selectedId ? nodeMap[selectedId] : null;
  const socNode = nodeMap.soc;

  const handleNodeClick = useCallback((id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  }, []);

  function handleSvgMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    if (!hoveredId) {
      setTooltip(null);
      return;
    }
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const vbW = 900;
    const vbH = 620;
    const scaleX = rect.width / vbW;
    const scaleY = rect.height / vbH;
    const svgX = (e.clientX - rect.left) / scaleX;
    const svgY = (e.clientY - rect.top) / scaleY;
    setTooltip({ x: svgX, y: svgY, node: nodeMap[hoveredId] });
  }

  return (
    <div className="cyber-card p-4 sm:p-6" data-ocid="network_topology.panel">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* SVG diagram */}
        <div className="flex-1 min-w-0 relative">
          <svg
            role="img"
            aria-label="Enterprise network security architecture diagram"
            viewBox="0 0 900 620"
            className="w-full"
            onMouseMove={handleSvgMouseMove}
            onMouseLeave={() => {
              setHoveredId(null);
              setTooltip(null);
            }}
            style={{
              background: "oklch(0.08 0.018 240)",
              borderRadius: "0.5rem",
              border: "1px solid oklch(0.22 0.04 240)",
            }}
          >
            <defs>
              <marker
                id="arrowhead"
                markerWidth="8"
                markerHeight="6"
                refX="8"
                refY="3"
                orient="auto"
              >
                <polygon
                  points="0 0, 8 3, 0 6"
                  fill="oklch(0.55 0.15 200 / 0.5)"
                />
              </marker>
              <marker
                id="arrowhead-soc"
                markerWidth="6"
                markerHeight="5"
                refX="6"
                refY="2.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 6 2.5, 0 5"
                  fill="oklch(0.82 0.25 135 / 0.4)"
                />
              </marker>
              <filter id="glow-green">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="glow-cyan">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Zone containers */}
            {ZONE_BOXES.map((z) => (
              <g key={z.label}>
                <rect
                  x={z.x}
                  y={z.y}
                  width={z.w}
                  height={z.h}
                  rx="6"
                  fill="oklch(0.10 0.018 240 / 0.6)"
                  stroke={z.color}
                  strokeWidth="1"
                  strokeDasharray="5 4"
                  opacity="0.6"
                />
                <text
                  x={z.x + 7}
                  y={z.y + 11}
                  fontFamily="JetBrains Mono, monospace"
                  fontSize="8"
                  fill={z.color}
                  opacity="0.75"
                >
                  {z.label}
                </text>
              </g>
            ))}

            {/* SOC monitoring dotted lines */}
            {SOC_MONITOR_TARGETS.map((targetId, i) => {
              const target = nodeMap[targetId];
              const path = buildPath(socNode, target);
              return (
                <g key={`soc-${targetId}`}>
                  <path
                    d={path}
                    stroke="oklch(0.82 0.25 135 / 0.2)"
                    strokeWidth="1"
                    strokeDasharray="2 6"
                    fill="none"
                    markerEnd="url(#arrowhead-soc)"
                  />
                  <circle
                    r="2.5"
                    fill="oklch(0.82 0.25 135)"
                    opacity="0.65"
                    style={{
                      filter: "drop-shadow(0 0 3px oklch(0.82 0.25 135))",
                    }}
                  >
                    <animateMotion
                      path={path}
                      dur={`${4 + i * 0.7}s`}
                      repeatCount="indefinite"
                      begin={`${i * 0.9}s`}
                    />
                  </circle>
                </g>
              );
            })}

            {/* Primary edges */}
            {EDGES.map((edge, i) => {
              const from = nodeMap[edge.from];
              const to = nodeMap[edge.to];
              const path = buildPath(from, to);
              return (
                <g key={edge.key}>
                  <path
                    d={path}
                    stroke="oklch(0.55 0.15 200 / 0.4)"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    fill="none"
                    markerEnd="url(#arrowhead)"
                  />
                  {/* Data flow dot */}
                  <circle
                    r="3"
                    fill="oklch(0.87 0.28 145)"
                    opacity="0.85"
                    style={{
                      filter: "drop-shadow(0 0 4px oklch(0.87 0.28 145))",
                    }}
                  >
                    <animateMotion
                      path={path}
                      dur={`${2.2 + i * 0.35}s`}
                      repeatCount="indefinite"
                      begin={`${i * 0.6}s`}
                    />
                  </circle>
                </g>
              );
            })}

            {/* Nodes */}
            {NODES.map((node) => {
              const isSelected = selectedId === node.id;
              const isHovered = hoveredId === node.id;
              const glowing = isSelected || isHovered;
              return (
                <g
                  key={node.id}
                  onClick={() => handleNodeClick(node.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      handleNodeClick(node.id);
                  }}
                  onMouseEnter={() => setHoveredId(node.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{ cursor: "pointer" }}
                  aria-label={`${node.label} — ${node.role}`}
                  data-ocid={`network_topology.${node.id}.button`}
                >
                  {/* Outer pulse ring */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="42"
                    fill="none"
                    stroke={node.color}
                    strokeWidth="1"
                    opacity={glowing ? 0.4 : 0.1}
                    style={{ transition: "opacity 0.2s" }}
                  >
                    {glowing && (
                      <animate
                        attributeName="r"
                        values="38;46;38"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    )}
                  </circle>
                  {/* Main circle */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="26"
                    fill="oklch(0.12 0.022 240)"
                    stroke={node.color}
                    strokeWidth={glowing ? 2.5 : 1.5}
                    style={{
                      filter: glowing
                        ? `drop-shadow(0 0 10px ${node.color})`
                        : `drop-shadow(0 0 3px ${node.color})`,
                      transition: "filter 0.2s, stroke-width 0.2s",
                    }}
                  />
                  {/* Label */}
                  <text
                    x={node.x}
                    y={node.y + 4}
                    textAnchor="middle"
                    fontSize="8"
                    fontFamily="JetBrains Mono, monospace"
                    fill={node.color}
                    fontWeight={glowing ? "700" : "500"}
                    style={{ pointerEvents: "none", userSelect: "none" }}
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}

            {/* Hover tooltip inside SVG */}
            {tooltip && (
              <g style={{ pointerEvents: "none" }}>
                <rect
                  x={Math.min(tooltip.x + 12, 700)}
                  y={tooltip.y - 28}
                  width="180"
                  height="40"
                  rx="4"
                  fill="oklch(0.14 0.025 240)"
                  stroke={tooltip.node.color}
                  strokeWidth="1"
                  opacity="0.95"
                />
                <text
                  x={Math.min(tooltip.x + 20, 708)}
                  y={tooltip.y - 12}
                  fontFamily="JetBrains Mono, monospace"
                  fontSize="9"
                  fontWeight="700"
                  fill={tooltip.node.color}
                >
                  {tooltip.node.label}
                </text>
                <text
                  x={Math.min(tooltip.x + 20, 708)}
                  y={tooltip.y + 3}
                  fontFamily="JetBrains Mono, monospace"
                  fontSize="7.5"
                  fill="oklch(0.65 0.04 240)"
                >
                  {tooltip.node.zone}
                </text>
              </g>
            )}
          </svg>

          <p
            className="text-center font-mono text-xs mt-2"
            style={{ color: "oklch(0.45 0.04 240)" }}
          >
            Click any node to inspect security details · Hover for tooltip
          </p>
          <p
            className="text-center font-mono text-xs mt-1"
            style={{ color: "oklch(0.35 0.04 240)" }}
          >
            Simulated enterprise architecture for cybersecurity demonstration
            and learning purposes only.
          </p>
        </div>

        {/* Detail panel */}
        <div className="lg:w-80">
          {selectedNode ? (
            <div
              className="cyber-card p-4 h-full flex flex-col"
              style={{ borderColor: `${selectedNode.color}88` }}
              data-ocid="network_topology.node_detail.panel"
            >
              <div
                className="font-mono text-xs mb-3"
                style={{ color: "oklch(0.55 0.04 240)" }}
              >
                NODE INSPECTION
              </div>
              <h3
                className="text-lg font-bold mb-1"
                style={{ color: selectedNode.color }}
              >
                {selectedNode.label}
              </h3>
              <p
                className="font-mono text-xs mb-2"
                style={{ color: "oklch(0.65 0.04 240)" }}
              >
                {selectedNode.role}
              </p>
              <div
                className="inline-block font-mono text-xs px-2 py-0.5 rounded mb-4"
                style={{
                  background: `${selectedNode.color}18`,
                  border: `1px solid ${selectedNode.color}44`,
                  color: selectedNode.color,
                }}
              >
                {selectedNode.zone}
              </div>

              <div className="mb-4">
                <div
                  className="font-mono text-xs font-semibold mb-2"
                  style={{ color: "oklch(0.65 0.28 25)" }}
                >
                  ⚠ RISKS
                </div>
                <ul className="space-y-1.5">
                  {selectedNode.risks.map((r) => (
                    <li
                      key={r}
                      className="text-xs flex items-start gap-2"
                      style={{ color: "oklch(0.75 0.04 240)" }}
                    >
                      <span
                        style={{ color: "oklch(0.65 0.28 25)", flexShrink: 0 }}
                      >
                        ›
                      </span>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div
                  className="font-mono text-xs font-semibold mb-2"
                  style={{ color: "oklch(0.87 0.28 145)" }}
                >
                  ✓ PROTECTIONS
                </div>
                <ul className="space-y-1.5">
                  {selectedNode.protections.map((p) => (
                    <li
                      key={p}
                      className="text-xs flex items-start gap-2"
                      style={{ color: "oklch(0.75 0.04 240)" }}
                    >
                      <span
                        style={{ color: "oklch(0.87 0.28 145)", flexShrink: 0 }}
                      >
                        ›
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                className="mt-auto pt-4 font-mono text-xs text-left"
                style={{ color: "oklch(0.45 0.04 240)" }}
                onClick={() => setSelectedId(null)}
                data-ocid="network_topology.close_button"
              >
                ← Deselect node
              </button>
            </div>
          ) : (
            <div
              className="cyber-card p-4 h-full flex flex-col items-center justify-center text-center"
              data-ocid="network_topology.empty_state"
            >
              <div
                className="w-14 h-14 rounded-full mb-4 flex items-center justify-center"
                style={{
                  background: "oklch(0.14 0.025 240)",
                  border: "1px solid oklch(0.22 0.04 240)",
                }}
              >
                <span
                  className="font-mono text-xl"
                  style={{ color: "oklch(0.75 0.22 220)" }}
                >
                  ⬡
                </span>
              </div>
              <p
                className="font-mono text-xs mb-2"
                style={{ color: "oklch(0.55 0.04 240)" }}
              >
                Select a node to inspect
              </p>
              <p
                className="font-mono text-xs"
                style={{ color: "oklch(0.38 0.04 240)" }}
              >
                security details
              </p>
              <div className="mt-6 w-full space-y-1">
                {NODES.slice(0, 5).map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    className="w-full text-left font-mono text-xs px-3 py-1.5 rounded flex items-center gap-2 transition-colors"
                    style={{
                      background: "oklch(0.12 0.022 240)",
                      border: `1px solid ${n.color}33`,
                      color: "oklch(0.65 0.04 240)",
                    }}
                    onClick={() => setSelectedId(n.id)}
                    data-ocid={`network_topology.${n.id}.button`}
                  >
                    <span style={{ color: n.color, fontSize: "8px" }}>●</span>
                    {n.label}
                  </button>
                ))}
                <p
                  className="font-mono text-xs pt-1"
                  style={{ color: "oklch(0.35 0.04 240)" }}
                >
                  + {NODES.length - 5} more nodes on diagram
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

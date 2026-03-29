import { useState } from "react";

const NODES = [
  {
    id: "internet",
    label: "Internet",
    x: 380,
    y: 40,
    color: "oklch(0.65 0.28 25)",
    role: "External Network",
    risks: [
      "DDoS Attacks",
      "Port Scanning",
      "Brute Force",
      "Zero-Day Exploits",
    ],
    protections: [
      "ISP-level filtering",
      "BGP blackholing",
      "Anycast DDoS mitigation",
    ],
  },
  {
    id: "firewall",
    label: "Firewall",
    x: 380,
    y: 130,
    color: "oklch(0.75 0.22 55)",
    role: "Perimeter Defense",
    risks: [
      "Rule misconfigurations",
      "Firewall bypass via allowed ports",
      "Firmware vulnerabilities",
    ],
    protections: [
      "Stateful packet inspection",
      "IPS/IDS integration",
      "Geo-IP blocking",
      "Deep packet inspection",
    ],
  },
  {
    id: "dmz",
    label: "DMZ",
    x: 380,
    y: 220,
    color: "oklch(0.75 0.22 55)",
    role: "Demilitarized Zone",
    risks: [
      "Exposed public services",
      "Lateral movement pivot",
      "Vulnerable web apps",
    ],
    protections: [
      "Isolated network segment",
      "Web Application Firewall",
      "Reverse proxy",
      "TLS termination",
    ],
  },
  {
    id: "webserver",
    label: "Web Server",
    x: 200,
    y: 320,
    color: "oklch(0.84 0.15 205)",
    role: "Public-facing App Server",
    risks: ["SQL Injection", "XSS / CSRF", "Path Traversal", "RCE via CVEs"],
    protections: [
      "WAF rules",
      "Regular patching",
      "OS hardening",
      "Container isolation",
    ],
  },
  {
    id: "internal",
    label: "Internal Net",
    x: 380,
    y: 320,
    color: "oklch(0.87 0.28 145)",
    role: "Core Enterprise Network",
    risks: ["Insider threats", "Lateral movement", "Unmanaged devices"],
    protections: [
      "Network segmentation",
      "Zero-trust model",
      "NAC (Cisco ISE)",
      "VLAN isolation",
    ],
  },
  {
    id: "dbserver",
    label: "DB Server",
    x: 560,
    y: 320,
    color: "oklch(0.65 0.28 25)",
    role: "Database & Data Store",
    risks: [
      "SQL Injection",
      "Credential theft",
      "Unencrypted data at rest",
      "Excessive privileges",
    ],
    protections: [
      "Encrypted storage (AES-256)",
      "DB firewall (IBM Guardium)",
      "Least privilege access",
      "Audit logging",
    ],
  },
  {
    id: "workstation",
    label: "Workstation",
    x: 380,
    y: 410,
    color: "oklch(0.87 0.28 145)",
    role: "End-User Endpoint",
    risks: [
      "Phishing",
      "Malware / Ransomware",
      "Unpatched OS",
      "Removable media",
    ],
    protections: [
      "EDR/XDR (CrowdStrike)",
      "Full disk encryption",
      "User awareness training",
      "USB port control",
    ],
  },
];

const EDGES = [
  { key: "e-internet-firewall", from: "internet", to: "firewall" },
  { key: "e-firewall-dmz", from: "firewall", to: "dmz" },
  { key: "e-dmz-webserver", from: "dmz", to: "webserver" },
  { key: "e-dmz-internal", from: "dmz", to: "internal" },
  { key: "e-internal-dbserver", from: "internal", to: "dbserver" },
  { key: "e-internal-workstation", from: "internal", to: "workstation" },
];

function NodeShape({
  node,
  isSelected,
}: { node: (typeof NODES)[0]; isSelected: boolean }) {
  const r = 28;
  return (
    <g>
      <circle
        cx={node.x}
        cy={node.y}
        r={r + 8}
        fill="none"
        stroke={node.color}
        strokeWidth="1"
        opacity={isSelected ? 0.5 : 0.15}
        style={{ animation: "pulse-dot 2.5s ease-in-out infinite" }}
      />
      <circle
        cx={node.x}
        cy={node.y}
        r={r}
        fill="oklch(0.12 0.022 240)"
        stroke={node.color}
        strokeWidth={isSelected ? 2.5 : 1.5}
        style={{
          filter: isSelected
            ? `drop-shadow(0 0 12px ${node.color})`
            : `drop-shadow(0 0 4px ${node.color})`,
        }}
      />
      <text
        x={node.x}
        y={node.y + 4}
        textAnchor="middle"
        fontSize="9"
        fontFamily="JetBrains Mono, monospace"
        fill={node.color}
        fontWeight="600"
      >
        {node.label}
      </text>
    </g>
  );
}

function DataFlowDot({
  fromNode,
  toNode,
  delay,
}: { fromNode: (typeof NODES)[0]; toNode: (typeof NODES)[0]; delay: number }) {
  const path = `M${fromNode.x},${fromNode.y} L${toNode.x},${toNode.y}`;
  return (
    <circle
      r="3"
      fill="oklch(0.87 0.28 145)"
      opacity="0.8"
      style={{ filter: "drop-shadow(0 0 4px oklch(0.87 0.28 145))" }}
    >
      <animateMotion
        dur={`${2.5 + delay * 0.5}s`}
        repeatCount="indefinite"
        begin={`${delay * 0.8}s`}
        path={path}
      />
    </circle>
  );
}

export default function NetworkTopologyDiagram() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedNode = NODES.find((n) => n.id === selectedId);
  const nodeMap = Object.fromEntries(NODES.map((n) => [n.id, n]));

  function handleNodeToggle(nodeId: string) {
    setSelectedId((prev) => (prev === nodeId ? null : nodeId));
  }

  return (
    <div className="cyber-card p-4 sm:p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-w-0">
          <svg
            role="img"
            aria-label="Interactive network topology diagram"
            viewBox="0 40 760 400"
            className="w-full"
            style={{
              background: "oklch(0.09 0.018 240)",
              borderRadius: "0.5rem",
              border: "1px solid oklch(0.22 0.04 240)",
            }}
          >
            {EDGES.map((edge, i) => {
              const from = nodeMap[edge.from];
              const to = nodeMap[edge.to];
              return (
                <g key={edge.key}>
                  <line
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke="oklch(0.87 0.28 145 / 0.2)"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                  <DataFlowDot fromNode={from} toNode={to} delay={i} />
                  <DataFlowDot fromNode={to} toNode={from} delay={i + 3} />
                </g>
              );
            })}

            {NODES.map((node) => (
              <g
                key={node.id}
                aria-label={`Select ${node.label} node`}
                onClick={() => handleNodeToggle(node.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    handleNodeToggle(node.id);
                }}
                style={{ cursor: "pointer" }}
              >
                <NodeShape node={node} isSelected={selectedId === node.id} />
              </g>
            ))}
          </svg>
          <p
            className="text-center font-mono text-xs mt-2"
            style={{ color: "oklch(0.45 0.04 240)" }}
          >
            Click any node to inspect security details
          </p>
        </div>

        <div className="lg:w-72 xl:w-80">
          {selectedNode ? (
            <div
              className="cyber-card p-4 h-full"
              style={{ borderColor: `${selectedNode.color}88` }}
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
                className="font-mono text-xs mb-4"
                style={{ color: "oklch(0.65 0.04 240)" }}
              >
                {selectedNode.role}
              </p>
              <div className="mb-4">
                <div
                  className="font-mono text-xs font-semibold mb-2"
                  style={{ color: "oklch(0.65 0.28 25)" }}
                >
                  ⚠ RISKS
                </div>
                <ul className="space-y-1">
                  {selectedNode.risks.map((r) => (
                    <li
                      key={r}
                      className="text-xs flex items-start gap-2"
                      style={{ color: "oklch(0.75 0.04 240)" }}
                    >
                      <span style={{ color: "oklch(0.65 0.28 25)" }}>›</span>{" "}
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
                <ul className="space-y-1">
                  {selectedNode.protections.map((p) => (
                    <li
                      key={p}
                      className="text-xs flex items-start gap-2"
                      style={{ color: "oklch(0.75 0.04 240)" }}
                    >
                      <span style={{ color: "oklch(0.87 0.28 145)" }}>›</span>{" "}
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="cyber-card p-4 h-full flex flex-col items-center justify-center text-center">
              <div
                className="w-12 h-12 rounded-full mb-3 flex items-center justify-center"
                style={{
                  background: "oklch(0.14 0.025 240)",
                  border: "1px solid oklch(0.22 0.04 240)",
                }}
              >
                <span
                  className="font-mono text-lg"
                  style={{ color: "oklch(0.87 0.28 145)" }}
                >
                  ?
                </span>
              </div>
              <p
                className="font-mono text-xs"
                style={{ color: "oklch(0.45 0.04 240)" }}
              >
                Select a node
                <br />
                to view security details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

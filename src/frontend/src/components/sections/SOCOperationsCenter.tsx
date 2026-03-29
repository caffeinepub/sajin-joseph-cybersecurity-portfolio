import { useEffect, useRef, useState } from "react";

// ─── Types ─────────────────────────────────────────────────────────────────────
type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
type IRStatus = "pending" | "active" | "done";

// ─── Data ──────────────────────────────────────────────────────────────────────
const INCIDENTS = [
  {
    id: "INC-001",
    title: "Credential Dumping — DC-01",
    severity: "CRITICAL" as Severity,
    source: "EDR",
    time: "08:02:11Z",
    score: 95,
    affectedSystems: ["DC-01 (192.168.10.10)", "WEB-SRV-01 (192.168.10.5)"],
    iocs: [
      { type: "IP", value: "10.0.0.50", desc: "C2 Server" },
      { type: "HASH", value: "a3f9c...b12e", desc: "Mimikatz binary" },
      { type: "DOMAIN", value: "attacker.c2.net", desc: "DNS Tunnel C2" },
    ],
    timeline: [
      {
        ts: "08:01:02Z",
        event: "Initial connection from 10.0.0.50",
        type: "info",
      },
      { ts: "08:01:44Z", event: "SYN scan detected on subnet", type: "warn" },
      {
        ts: "08:02:11Z",
        event: "Mimikatz pattern in memory — WEB-SRV-01",
        type: "crit",
      },
      {
        ts: "08:02:33Z",
        event: "Auth success DC-01 as Administrator",
        type: "crit",
      },
      { ts: "08:03:01Z", event: "DNS exfil threshold exceeded", type: "crit" },
    ],
    irSteps: [
      { name: "Triage", status: "done" as IRStatus },
      { name: "Analysis", status: "active" as IRStatus },
      { name: "Containment", status: "pending" as IRStatus },
      { name: "Eradication", status: "pending" as IRStatus },
      { name: "Recovery", status: "pending" as IRStatus },
    ],
  },
  {
    id: "INC-002",
    title: "Lateral Movement via SMB",
    severity: "HIGH" as Severity,
    source: "SIEM",
    time: "08:03:29Z",
    score: 78,
    affectedSystems: [
      "FILE-SRV-02 (192.168.10.22)",
      "WRK-ADMIN (192.168.10.35)",
    ],
    iocs: [
      { type: "IP", value: "192.168.10.99", desc: "Pivot Host" },
      { type: "PORT", value: "445/tcp", desc: "SMB lateral movement" },
    ],
    timeline: [
      {
        ts: "08:02:55Z",
        event: "Internal SMB auth from 10.99 to DC-01",
        type: "warn",
      },
      {
        ts: "08:03:12Z",
        event: "Unusual share enumeration detected",
        type: "warn",
      },
      {
        ts: "08:03:29Z",
        event: "Lateral movement confirmed — SMB/445",
        type: "crit",
      },
    ],
    irSteps: [
      { name: "Triage", status: "done" as IRStatus },
      { name: "Analysis", status: "done" as IRStatus },
      { name: "Containment", status: "active" as IRStatus },
      { name: "Eradication", status: "pending" as IRStatus },
      { name: "Recovery", status: "pending" as IRStatus },
    ],
  },
  {
    id: "INC-003",
    title: "Suspicious DNS Exfiltration",
    severity: "HIGH" as Severity,
    source: "Firewall",
    time: "08:05:00Z",
    score: 72,
    affectedSystems: ["FILE-SRV-02 (192.168.10.22)"],
    iocs: [
      { type: "DOMAIN", value: "attacker.c2.net", desc: "Tunnel endpoint" },
      { type: "PROTO", value: "DNS over UDP/53", desc: "Exfil channel" },
    ],
    timeline: [
      {
        ts: "08:04:30Z",
        event: "Abnormal DNS query volume on FILE-SRV",
        type: "warn",
      },
      {
        ts: "08:05:00Z",
        event: "Bulk data via DNS tunnel — 4.2 GB",
        type: "crit",
      },
    ],
    irSteps: [
      { name: "Triage", status: "done" as IRStatus },
      { name: "Analysis", status: "active" as IRStatus },
      { name: "Containment", status: "pending" as IRStatus },
      { name: "Eradication", status: "pending" as IRStatus },
      { name: "Recovery", status: "pending" as IRStatus },
    ],
  },
  {
    id: "INC-004",
    title: "Apache Path Traversal Attempt",
    severity: "MEDIUM" as Severity,
    source: "Firewall",
    time: "08:01:55Z",
    score: 55,
    affectedSystems: ["WEB-SRV-01 (192.168.10.5)"],
    iocs: [
      { type: "CVE", value: "CVE-2021-41773", desc: "Path Traversal" },
      {
        type: "URL",
        value: "/cgi-bin/.%2e/.%2e/etc/passwd",
        desc: "Payload path",
      },
    ],
    timeline: [
      {
        ts: "08:01:50Z",
        event: "WAF triggered — path traversal pattern",
        type: "warn",
      },
      {
        ts: "08:01:55Z",
        event: "Request blocked — Apache CVE-2021-41773",
        type: "warn",
      },
    ],
    irSteps: [
      { name: "Triage", status: "done" as IRStatus },
      { name: "Analysis", status: "done" as IRStatus },
      { name: "Containment", status: "done" as IRStatus },
      { name: "Eradication", status: "active" as IRStatus },
      { name: "Recovery", status: "pending" as IRStatus },
    ],
  },
  {
    id: "INC-005",
    title: "Port Scan from Internal Host",
    severity: "LOW" as Severity,
    source: "SIEM",
    time: "08:05:22Z",
    score: 30,
    affectedSystems: ["WRK-ADMIN (192.168.10.35)"],
    iocs: [{ type: "IP", value: "192.168.10.35", desc: "Scanning host" }],
    timeline: [
      {
        ts: "08:05:22Z",
        event: "Internal scan policy triggered on WRK-ADMIN",
        type: "info",
      },
    ],
    irSteps: [
      { name: "Triage", status: "active" as IRStatus },
      { name: "Analysis", status: "pending" as IRStatus },
      { name: "Containment", status: "pending" as IRStatus },
      { name: "Eradication", status: "pending" as IRStatus },
      { name: "Recovery", status: "pending" as IRStatus },
    ],
  },
];

const SEV_COLOR: Record<Severity, string> = {
  CRITICAL: "oklch(0.65 0.28 25)",
  HIGH: "oklch(0.72 0.22 40)",
  MEDIUM: "oklch(0.85 0.22 80)",
  LOW: "oklch(0.75 0.18 230)",
};

// ─── MODULE 1: Incident Investigation ─────────────────────────────────────────
export function IncidentInvestigation() {
  const [selected, setSelected] = useState<string | null>(null);
  const inc = INCIDENTS.find((i) => i.id === selected);

  const stepColor = (s: IRStatus) => {
    if (s === "done") return "oklch(0.87 0.28 145)";
    if (s === "active") return "oklch(0.75 0.18 230)";
    return "oklch(0.35 0.04 240)";
  };

  const timelineColor = (t: string) => {
    if (t === "crit") return "oklch(0.65 0.28 25)";
    if (t === "warn") return "oklch(0.85 0.22 80)";
    return "oklch(0.6 0.04 240)";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      {/* Queue */}
      <div className="lg:col-span-2 border border-[oklch(0.22_0.04_240)] bg-[oklch(0.08_0.015_240)]">
        <div
          className="px-3 py-2 border-b border-[oklch(0.22_0.04_240)] font-mono text-xs"
          style={{ color: "oklch(0.75 0.18 230)" }}
        >
          INCIDENT QUEUE — {INCIDENTS.length} ACTIVE
        </div>
        <div className="divide-y divide-[oklch(0.15_0.025_240)]">
          {INCIDENTS.map((i) => (
            <button
              key={i.id}
              type="button"
              onClick={() => setSelected(i.id === selected ? null : i.id)}
              className="w-full text-left px-3 py-3 transition-all hover:bg-[oklch(0.12_0.025_240)] group"
              style={{
                background:
                  selected === i.id ? "oklch(0.75 0.18 230 / 0.08)" : undefined,
                borderLeft:
                  selected === i.id
                    ? `2px solid ${SEV_COLOR[i.severity]}`
                    : "2px solid transparent",
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className="font-mono text-xs font-bold"
                  style={{ color: SEV_COLOR[i.severity] }}
                >
                  {i.severity}
                </span>
                <span className="font-mono text-[10px] text-foreground/40">
                  {i.time}
                </span>
              </div>
              <div className="font-mono text-xs text-foreground/80 leading-snug">
                {i.title}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="font-mono text-[10px] px-1 border"
                  style={{
                    color: "oklch(0.75 0.18 230)",
                    borderColor: "oklch(0.75 0.18 230 / 0.4)",
                  }}
                >
                  {i.source}
                </span>
                <span className="font-mono text-[10px] text-foreground/40">
                  {i.id}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Detail */}
      <div className="lg:col-span-3 border border-[oklch(0.22_0.04_240)] bg-[oklch(0.08_0.015_240)]">
        {!inc ? (
          <div className="flex items-center justify-center h-full min-h-[300px] text-foreground/25 font-mono text-sm">
            ← Select an incident to investigate
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="font-mono text-[11px] font-bold px-2 py-0.5 border"
                    style={{
                      color: SEV_COLOR[inc.severity],
                      borderColor: `${SEV_COLOR[inc.severity]}55`,
                    }}
                  >
                    {inc.severity}
                  </span>
                  <span className="font-mono text-[11px] text-foreground/40">
                    {inc.id} · {inc.source}
                  </span>
                </div>
                <h3 className="font-mono text-sm font-bold text-foreground/90">
                  {inc.title}
                </h3>
              </div>
              <div className="flex-shrink-0 text-right">
                <div
                  className="font-mono text-2xl font-bold"
                  style={{ color: SEV_COLOR[inc.severity] }}
                >
                  {inc.score}
                </div>
                <div className="font-mono text-[10px] text-foreground/40">
                  SEVERITY SCORE
                </div>
              </div>
            </div>

            {/* IR Workflow Steps */}
            <div>
              <div className="font-mono text-[10px] text-foreground/40 mb-2 uppercase tracking-widest">
                Investigation Workflow
              </div>
              <div className="flex gap-0">
                {inc.irSteps.map((step, idx) => (
                  <div key={step.name} className="flex items-center flex-1">
                    <div
                      className="flex-1 py-2 px-1 text-center border transition-colors"
                      style={{
                        borderColor: `${stepColor(step.status)}44`,
                        background:
                          step.status !== "pending"
                            ? `${stepColor(step.status)}10`
                            : "transparent",
                      }}
                    >
                      <div
                        className="font-mono text-[9px] font-bold"
                        style={{ color: stepColor(step.status) }}
                      >
                        {step.status === "done"
                          ? "✓ "
                          : step.status === "active"
                            ? "▶ "
                            : ""}
                        {step.name}
                      </div>
                    </div>
                    {idx < inc.irSteps.length - 1 && (
                      <div
                        className="w-3 h-px flex-shrink-0"
                        style={{ background: "oklch(0.22 0.04 240)" }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div>
              <div className="font-mono text-[10px] text-foreground/40 mb-2 uppercase tracking-widest">
                Event Timeline
              </div>
              <div className="space-y-1">
                {inc.timeline.map((ev) => (
                  <div key={ev.ts} className="flex gap-3 items-baseline">
                    <span className="font-mono text-[10px] text-foreground/40 flex-shrink-0 w-20">
                      {ev.ts}
                    </span>
                    <div
                      className="w-1 h-1 rounded-full flex-shrink-0 mt-1.5"
                      style={{ background: timelineColor(ev.type) }}
                    />
                    <span
                      className="font-mono text-[11px]"
                      style={{ color: timelineColor(ev.type) }}
                    >
                      {ev.event}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Affected + IOCs grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="font-mono text-[10px] text-foreground/40 mb-2 uppercase tracking-widest">
                  Affected Systems
                </div>
                {inc.affectedSystems.map((sys) => (
                  <div
                    key={sys}
                    className="font-mono text-xs text-foreground/70 flex items-center gap-1.5 mb-1"
                  >
                    <span
                      className="w-1 h-1 rounded-full flex-shrink-0"
                      style={{ background: "oklch(0.65 0.28 25)" }}
                    />
                    {sys}
                  </div>
                ))}
              </div>
              <div>
                <div className="font-mono text-[10px] text-foreground/40 mb-2 uppercase tracking-widest">
                  Indicators of Compromise
                </div>
                {inc.iocs.map((ioc) => (
                  <div
                    key={ioc.value}
                    className="flex gap-2 mb-1 items-baseline"
                  >
                    <span
                      className="font-mono text-[9px] font-bold px-1 border flex-shrink-0"
                      style={{
                        color: "oklch(0.75 0.18 230)",
                        borderColor: "oklch(0.75 0.18 230 / 0.4)",
                      }}
                    >
                      {ioc.type}
                    </span>
                    <span className="font-mono text-[11px] text-foreground/65 truncate">
                      {ioc.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MODULE 2: MITRE ATT&CK ────────────────────────────────────────────────────
const MITRE_TACTICS = [
  {
    id: "TA0001",
    name: "Initial Access",
    techniques: [
      {
        id: "T1190",
        name: "Exploit Public App",
        triggered: true,
        desc: "Exploitation of a vulnerability in a public-facing application (Apache CVE-2021-41773).",
      },
      {
        id: "T1133",
        name: "External Remote Svc",
        triggered: false,
        desc: "Adversaries use external-facing services to gain initial access to internal network.",
      },
      {
        id: "T1566",
        name: "Phishing",
        triggered: false,
        desc: "Sending emails with malicious attachments or links to gain access.",
      },
    ],
  },
  {
    id: "TA0002",
    name: "Execution",
    techniques: [
      {
        id: "T1059",
        name: "Command & Scripting",
        triggered: true,
        desc: "Adversaries abuse command/scripting interpreters to execute commands and scripts.",
      },
      {
        id: "T1203",
        name: "Exploitation",
        triggered: false,
        desc: "Adversaries exploit software vulnerabilities to execute code.",
      },
    ],
  },
  {
    id: "TA0003",
    name: "Persistence",
    techniques: [
      {
        id: "T1053",
        name: "Scheduled Task/Job",
        triggered: true,
        desc: "Adversaries abuse task scheduling to maintain persistence across restarts.",
      },
      {
        id: "T1136",
        name: "Create Account",
        triggered: false,
        desc: "Adversaries create an account to maintain access to victim systems.",
      },
      {
        id: "T1098",
        name: "Account Manipulation",
        triggered: false,
        desc: "Adversaries modify account settings to maintain access.",
      },
    ],
  },
  {
    id: "TA0004",
    name: "Privilege Escalation",
    techniques: [
      {
        id: "T1068",
        name: "Exploitation for PrivEsc",
        triggered: true,
        desc: "Exploiting a software vulnerability to escalate privileges.",
      },
      {
        id: "T1055",
        name: "Process Injection",
        triggered: true,
        desc: "Adversaries inject code into live processes to evade defenses.",
      },
      {
        id: "T1134",
        name: "Token Impersonation",
        triggered: false,
        desc: "Adversaries manipulate access tokens to operate under different contexts.",
      },
    ],
  },
  {
    id: "TA0008",
    name: "Lateral Movement",
    techniques: [
      {
        id: "T1021",
        name: "Remote Services",
        triggered: true,
        desc: "Adversaries use valid accounts to log into remote services like SMB/WMI.",
      },
      {
        id: "T1550",
        name: "Use Alt Auth Material",
        triggered: true,
        desc: "Use alternative authentication such as Pass-the-Hash to move laterally.",
      },
      {
        id: "T1570",
        name: "Lateral Tool Transfer",
        triggered: false,
        desc: "Transfer tools from controlled systems to compromised systems.",
      },
    ],
  },
  {
    id: "TA0010",
    name: "Exfiltration",
    techniques: [
      {
        id: "T1041",
        name: "Exfil over C2",
        triggered: false,
        desc: "Data exfiltration over an existing C2 channel.",
      },
      {
        id: "T1048",
        name: "Exfil Alt Protocol",
        triggered: true,
        desc: "Data exfiltration using alternative protocols such as DNS tunnelling.",
      },
      {
        id: "T1030",
        name: "Data Transfer Limit",
        triggered: false,
        desc: "Limit the size of data transfers to avoid detection.",
      },
    ],
  },
];

export function MitreAttackMap() {
  const [hovered, setHovered] = useState<{
    id: string;
    name: string;
    desc: string;
  } | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const triggeredCount = MITRE_TACTICS.flatMap((t) => t.techniques).filter(
    (t) => t.triggered,
  ).length;

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="flex flex-wrap gap-4 mb-2">
        <div
          className="font-mono text-xs"
          style={{ color: "oklch(0.65 0.28 25)" }}
        >
          <span className="text-lg font-bold">{triggeredCount}</span> techniques
          triggered
        </div>
        <div className="font-mono text-xs text-foreground/40">
          {MITRE_TACTICS.flatMap((t) => t.techniques).length} total mapped
        </div>
      </div>

      {/* Matrix */}
      <div className="overflow-x-auto">
        <div
          className="grid min-w-max"
          style={{
            gridTemplateColumns: `repeat(${MITRE_TACTICS.length}, minmax(130px,1fr))`,
            gap: "6px",
          }}
        >
          {/* Tactic headers */}
          {MITRE_TACTICS.map((tactic) => (
            <div
              key={tactic.id}
              className="px-2 py-2 text-center border-b-2"
              style={{
                borderColor: "oklch(0.75 0.18 230)",
                background: "oklch(0.12 0.025 240)",
              }}
            >
              <div
                className="font-mono text-[10px] font-bold"
                style={{ color: "oklch(0.75 0.18 230)" }}
              >
                {tactic.name}
              </div>
              <div className="font-mono text-[9px] text-foreground/30">
                {tactic.id}
              </div>
            </div>
          ))}
          {/* Techniques */}
          {Array.from({
            length: Math.max(...MITRE_TACTICS.map((t) => t.techniques.length)),
          }).map((_, rowIdx) =>
            MITRE_TACTICS.map((tactic) => {
              const tech = tactic.techniques[rowIdx];
              if (!tech) return <div key={`${tactic.id}-empty-${rowIdx}`} />;
              return (
                <div
                  key={tech.id}
                  onMouseEnter={(e) => {
                    setHovered({
                      id: tech.id,
                      name: tech.name,
                      desc: tech.desc,
                    });
                    setTooltipPos({ x: e.clientX, y: e.clientY });
                  }}
                  onMouseLeave={() => setHovered(null)}
                  className="px-2 py-2 border cursor-pointer transition-all hover:scale-105"
                  style={{
                    borderColor: tech.triggered
                      ? "oklch(0.65 0.28 25 / 0.7)"
                      : "oklch(0.22 0.04 240)",
                    background: tech.triggered
                      ? "oklch(0.65 0.28 25 / 0.12)"
                      : "oklch(0.10 0.02 240)",
                    boxShadow: tech.triggered
                      ? "0 0 8px oklch(0.65 0.28 25 / 0.3)"
                      : "none",
                  }}
                >
                  <div
                    className="font-mono text-[9px] font-bold"
                    style={{
                      color: tech.triggered
                        ? "oklch(0.65 0.28 25)"
                        : "oklch(0.5 0.04 240)",
                    }}
                  >
                    {tech.triggered && <span className="mr-0.5">●</span>}
                    {tech.id}
                  </div>
                  <div
                    className="font-mono text-[10px] leading-tight mt-0.5"
                    style={{
                      color: tech.triggered
                        ? "oklch(0.85 0.05 240)"
                        : "oklch(0.4 0.04 240)",
                    }}
                  >
                    {tech.name}
                  </div>
                </div>
              );
            }),
          )}
        </div>
      </div>

      {/* Tooltip */}
      {hovered && (
        <div
          className="fixed z-50 max-w-xs p-3 border font-mono text-xs pointer-events-none"
          style={{
            left: Math.min(tooltipPos.x + 12, window.innerWidth - 260),
            top: tooltipPos.y - 80,
            background: "oklch(0.12 0.025 240)",
            borderColor: "oklch(0.65 0.28 25 / 0.6)",
            boxShadow: "0 0 16px oklch(0.65 0.28 25 / 0.2)",
          }}
        >
          <div
            className="font-bold mb-1"
            style={{ color: "oklch(0.65 0.28 25)" }}
          >
            {hovered.id} — {hovered.name}
          </div>
          <div className="text-foreground/60 text-[10px] leading-relaxed">
            {hovered.desc}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex gap-4 font-mono text-[10px] text-foreground/50">
        <span className="flex items-center gap-1">
          <span
            className="w-3 h-3 inline-block border"
            style={{
              borderColor: "oklch(0.65 0.28 25 / 0.7)",
              background: "oklch(0.65 0.28 25 / 0.12)",
            }}
          />{" "}
          Triggered
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 inline-block border border-[oklch(0.22_0.04_240)] bg-[oklch(0.10_0.02_240)]" />{" "}
          Not triggered
        </span>
      </div>
    </div>
  );
}

// ─── MODULE 3: Threat Hunting Lab ─────────────────────────────────────────────
const PREDEFINED_QUERIES = [
  "failed login attempts",
  "suspicious process execution",
  "data exfiltration activity",
  "privilege escalation events",
  "lateral movement via SMB",
  "DNS tunnelling activity",
];

const HUNT_RESULTS: Record<
  string,
  {
    logs: string[];
    events: { ts: string; host: string; type: string; detail: string }[];
    alerts: string[];
  }
> = {
  "failed login attempts": {
    logs: [
      "[AUTH] 2026-03-25T07:58:01Z — FAIL admin@corp.local from 10.0.0.50",
      "[AUTH] 2026-03-25T07:58:04Z — FAIL administrator from 10.0.0.50",
      "[AUTH] 2026-03-25T07:58:09Z — FAIL svcaccount from 10.0.0.50",
      "[AUTH] 2026-03-25T07:58:12Z — SUCCESS Administrator from 10.0.0.50",
      "[AUTH] 2026-03-25T08:02:33Z — SUCCESS Administrator on DC-01",
    ],
    events: [
      {
        ts: "07:58:01Z",
        host: "DC-01",
        type: "BRUTE FORCE",
        detail: "5 failed logins in 11 sec",
      },
      {
        ts: "08:02:33Z",
        host: "DC-01",
        type: "AUTH SUCCESS",
        detail: "Unusual admin logon post-scan",
      },
    ],
    alerts: [
      "ALERT: Brute force threshold exceeded — DC-01",
      "ALERT: Successful auth after brute force — high risk",
    ],
  },
  "suspicious process execution": {
    logs: [
      "[PROC] 2026-03-25T08:02:10Z — mimikatz.exe spawned by lsass.exe on WEB-SRV-01",
      "[PROC] 2026-03-25T08:02:22Z — powershell.exe -EncodedCommand on DC-01",
      "[PROC] 2026-03-25T08:02:45Z — cmd.exe /c net user hacker P@ss /add",
    ],
    events: [
      {
        ts: "08:02:10Z",
        host: "WEB-SRV-01",
        type: "CRED DUMP",
        detail: "mimikatz.exe detected in memory",
      },
      {
        ts: "08:02:22Z",
        host: "DC-01",
        type: "ENCODED CMD",
        detail: "Base64 encoded powershell",
      },
      {
        ts: "08:02:45Z",
        host: "DC-01",
        type: "ACCOUNT ADD",
        detail: "New account creation via cmd",
      },
    ],
    alerts: [
      "ALERT: Credential dumping tool detected",
      "ALERT: Obfuscated command execution",
      "ALERT: Unauthorized account creation",
    ],
  },
  "data exfiltration activity": {
    logs: [
      "[DLP] 2026-03-25T08:04:50Z — DNS query volume: 3,842 qps (threshold: 500)",
      "[DLP] 2026-03-25T08:05:00Z — 4.2 GB staged in C:\\Temp\\ on FILE-SRV-02",
      "[DLP] 2026-03-25T08:05:01Z — Outbound DNS tunnel to attacker.c2.net",
    ],
    events: [
      {
        ts: "08:04:50Z",
        host: "FILE-SRV-02",
        type: "DLP TRIGGER",
        detail: "DNS query storm detected",
      },
      {
        ts: "08:05:00Z",
        host: "FILE-SRV-02",
        type: "DATA STAGING",
        detail: "4.2 GB in temp dir",
      },
    ],
    alerts: [
      "ALERT: Data exfiltration via DNS tunnel — CRITICAL",
      "ALERT: Large file staging detected",
    ],
  },
  "privilege escalation events": {
    logs: [
      "[PRIVESC] 2026-03-25T08:02:05Z — Token impersonation on WEB-SRV-01",
      "[PRIVESC] 2026-03-25T08:02:18Z — SeDebugPrivilege enabled",
      "[PRIVESC] 2026-03-25T08:02:30Z — SYSTEM shell obtained on WEB-SRV-01",
    ],
    events: [
      {
        ts: "08:02:05Z",
        host: "WEB-SRV-01",
        type: "TOKEN MANIP",
        detail: "Token impersonation",
      },
      {
        ts: "08:02:30Z",
        host: "WEB-SRV-01",
        type: "SYSTEM ACCESS",
        detail: "Root-level shell",
      },
    ],
    alerts: ["ALERT: Privilege escalation to SYSTEM detected"],
  },
  "lateral movement via SMB": {
    logs: [
      "[NET] 2026-03-25T08:02:55Z — SMB auth 10.99 → DC-01 port 445",
      "[NET] 2026-03-25T08:03:12Z — Share enum \\\\DC-01\\ADMIN$ from 10.99",
      "[NET] 2026-03-25T08:03:29Z — PsExec-like artifact on DC-01",
    ],
    events: [
      {
        ts: "08:02:55Z",
        host: "DC-01",
        type: "SMB AUTH",
        detail: "Internal auth via port 445",
      },
      {
        ts: "08:03:29Z",
        host: "DC-01",
        type: "LATERAL MOV",
        detail: "PsExec artifact detected",
      },
    ],
    alerts: ["ALERT: SMB lateral movement confirmed"],
  },
  "DNS tunnelling activity": {
    logs: [
      "[DNS] 2026-03-25T08:04:48Z — Subdomain entropy high: a8f3k2.attacker.c2.net",
      "[DNS] 2026-03-25T08:04:50Z — Query rate anomaly: 3,842 qps",
      "[DNS] 2026-03-25T08:05:01Z — Long TXT record response from attacker.c2.net",
    ],
    events: [
      {
        ts: "08:04:48Z",
        host: "FILE-SRV-02",
        type: "DNS TUNNEL",
        detail: "High entropy subdomains",
      },
      {
        ts: "08:05:01Z",
        host: "FILE-SRV-02",
        type: "C2 COMMS",
        detail: "Data in DNS TXT records",
      },
    ],
    alerts: ["ALERT: DNS tunnelling — C2 communication detected"],
  },
};

export function ThreatHuntingLab() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "logs" | "events" | "alerts">(
    "all",
  );
  const [streaming, setStreaming] = useState(false);
  const [streamIdx, setStreamIdx] = useState(0);
  const streamRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const runQuery = (q: string) => {
    const normalized = q.toLowerCase().trim();
    const key = Object.keys(HUNT_RESULTS).find(
      (k) => k === normalized || normalized.includes(k.split(" ")[0]),
    );
    setActive(key ?? normalized);
    setStreamIdx(0);
    setStreaming(true);
    let idx = 0;
    if (streamRef.current) clearInterval(streamRef.current);
    streamRef.current = setInterval(() => {
      idx++;
      setStreamIdx(idx);
      const result = HUNT_RESULTS[key ?? ""];
      const total = result
        ? result.logs.length + result.events.length + result.alerts.length
        : 3;
      if (idx >= total) {
        clearInterval(streamRef.current!);
        setStreaming(false);
      }
    }, 400);
  };

  useEffect(
    () => () => {
      if (streamRef.current) clearInterval(streamRef.current);
    },
    [],
  );

  const result = HUNT_RESULTS[active ?? ""];

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && query.trim() && runQuery(query)
            }
            placeholder="Search threat intelligence... (press Enter)"
            className="w-full bg-[oklch(0.08_0.015_240)] border border-[oklch(0.22_0.04_240)] px-4 py-2.5 font-mono text-sm text-foreground/80 placeholder-foreground/25 focus:outline-none focus:border-[oklch(0.75_0.18_230)]"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[10px] text-foreground/25">
            HUNT
          </span>
        </div>
        <button
          type="button"
          onClick={() => query.trim() && runQuery(query)}
          className="px-4 py-2.5 font-mono text-sm border font-bold transition-all hover:opacity-90"
          style={{
            borderColor: "oklch(0.75 0.18 230)",
            color: "oklch(0.75 0.18 230)",
            background: "oklch(0.75 0.18 230 / 0.1)",
          }}
        >
          ▶ RUN
        </button>
      </div>

      {/* Predefined queries */}
      <div className="flex flex-wrap gap-2">
        {PREDEFINED_QUERIES.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => {
              setQuery(q);
              runQuery(q);
            }}
            className="font-mono text-[11px] px-3 py-1 border transition-all hover:border-[oklch(0.75_0.18_230)] hover:text-foreground/80"
            style={{
              borderColor:
                active === q ? "oklch(0.75 0.18 230)" : "oklch(0.22 0.04 240)",
              color:
                active === q ? "oklch(0.75 0.18 230)" : "oklch(0.5 0.04 240)",
              background:
                active === q ? "oklch(0.75 0.18 230 / 0.08)" : "transparent",
            }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Filter */}
      {result && (
        <div className="flex gap-2">
          {(["all", "logs", "events", "alerts"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className="font-mono text-[10px] px-2 py-1 border uppercase transition-colors"
              style={{
                borderColor:
                  filter === f
                    ? "oklch(0.87 0.28 145)"
                    : "oklch(0.22 0.04 240)",
                color:
                  filter === f ? "oklch(0.87 0.28 145)" : "oklch(0.4 0.04 240)",
              }}
            >
              {f}
            </button>
          ))}
          {streaming && (
            <span className="font-mono text-[10px] text-foreground/40 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.87_0.28_145)] animate-pulse" />
              streaming results...
            </span>
          )}
        </div>
      )}

      {/* Results */}
      {!result && active !== null && (
        <div className="border border-[oklch(0.22_0.04_240)] bg-[oklch(0.08_0.015_240)] p-4 font-mono text-xs text-foreground/40">
          No results for "{active}". Try a predefined query above.
        </div>
      )}

      {result && (
        <div className="space-y-3">
          {(filter === "all" || filter === "logs") && (
            <div className="border border-[oklch(0.22_0.04_240)] bg-[oklch(0.08_0.015_240)]">
              <div
                className="px-3 py-2 border-b border-[oklch(0.22_0.04_240)] font-mono text-[10px]"
                style={{ color: "oklch(0.75 0.18 230)" }}
              >
                RAW LOGS
              </div>
              <div className="p-3 space-y-0.5">
                {result.logs.slice(0, streamIdx + 5).map((log) => (
                  <div
                    key={log}
                    className="font-mono text-[11px]"
                    style={{
                      color: log.includes("FAIL")
                        ? "oklch(0.65 0.28 25)"
                        : log.includes("SUCCESS")
                          ? "oklch(0.85 0.22 80)"
                          : "oklch(0.6 0.04 240)",
                    }}
                  >
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}

          {(filter === "all" || filter === "events") && (
            <div className="border border-[oklch(0.22_0.04_240)] bg-[oklch(0.08_0.015_240)]">
              <div
                className="px-3 py-2 border-b border-[oklch(0.22_0.04_240)] font-mono text-[10px]"
                style={{ color: "oklch(0.75 0.18 230)" }}
              >
                EVENTS
              </div>
              <div className="divide-y divide-[oklch(0.14_0.025_240)]">
                {result.events
                  .slice(0, Math.max(0, streamIdx - result.logs.length + 5))
                  .map((ev) => (
                    <div
                      key={`${ev.ts}-${ev.type}`}
                      className="flex gap-3 px-3 py-2"
                    >
                      <span className="font-mono text-[10px] text-foreground/40 w-20 flex-shrink-0">
                        {ev.ts}
                      </span>
                      <span
                        className="font-mono text-[10px] font-bold px-1 border flex-shrink-0"
                        style={{
                          color: "oklch(0.85 0.22 80)",
                          borderColor: "oklch(0.85 0.22 80 / 0.4)",
                        }}
                      >
                        {ev.type}
                      </span>
                      <span className="font-mono text-[10px] text-foreground/50 flex-shrink-0">
                        {ev.host}
                      </span>
                      <span className="font-mono text-[11px] text-foreground/70">
                        {ev.detail}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {(filter === "all" || filter === "alerts") && (
            <div className="border border-[oklch(0.22_0.04_240)] bg-[oklch(0.08_0.015_240)]">
              <div
                className="px-3 py-2 border-b border-[oklch(0.22_0.04_240)] font-mono text-[10px]"
                style={{ color: "oklch(0.65 0.28 25)" }}
              >
                ALERTS
              </div>
              <div className="p-3 space-y-1">
                {result.alerts
                  .slice(
                    0,
                    Math.max(
                      0,
                      streamIdx - result.logs.length - result.events.length + 5,
                    ),
                  )
                  .map((al) => (
                    <div
                      key={al}
                      className="font-mono text-xs flex items-center gap-2"
                      style={{ color: "oklch(0.65 0.28 25)" }}
                    >
                      <span className="flex-shrink-0">⚠</span>
                      {al}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── MODULE 4: Zero Trust Architecture ────────────────────────────────────────
const ZT_ZONES = [
  {
    id: "internet",
    label: "Untrusted Zone",
    sub: "External / Internet",
    color: "oklch(0.65 0.28 25)",
  },
  {
    id: "edge",
    label: "Identity Verification",
    sub: "MFA · SSO · Certificate",
    color: "oklch(0.85 0.22 80)",
  },
  {
    id: "device",
    label: "Device Compliance",
    sub: "EDR · Patch · Posture",
    color: "oklch(0.87 0.28 145)",
  },
  {
    id: "access",
    label: "Conditional Access",
    sub: "Policy Engine · Context",
    color: "oklch(0.75 0.18 230)",
  },
  {
    id: "resource",
    label: "Protected Resource",
    sub: "App · Data · Service",
    color: "oklch(0.82 0.18 200)",
  },
];

const ZT_SCENARIOS = [
  {
    user: "alice@corp.local",
    device: "LAPTOP-001 (Compliant)",
    location: "Corporate HQ",
    mfa: true,
    decision: "ALLOW" as const,
    reason: "Identity verified, device compliant, MFA passed",
  },
  {
    user: "bob@corp.local",
    device: "PERSONAL-WIN (Non-compliant)",
    location: "Remote — Unknown IP",
    mfa: false,
    decision: "CHALLENGE" as const,
    reason: "Device not managed, MFA required before access",
  },
  {
    user: "svc_account@corp",
    device: "SERVER-SYS (Managed)",
    location: "Unknown — 10.0.0.50",
    mfa: false,
    decision: "DENY" as const,
    reason: "Anomalous IP, service account from untrusted network",
  },
];

export function ZeroTrustView() {
  const [active, setActive] = useState(0);
  const scenario = ZT_SCENARIOS[active];
  const [step, setStep] = useState(0);

  // biome-ignore lint/correctness/useExhaustiveDependencies: active is the reset trigger
  useEffect(() => {
    setStep(0);
    const t = setInterval(
      () => setStep((s) => Math.min(s + 1, ZT_ZONES.length - 1)),
      700,
    );
    return () => clearInterval(t);
  }, [active]);

  const decisionColor =
    scenario.decision === "ALLOW"
      ? "oklch(0.87 0.28 145)"
      : scenario.decision === "CHALLENGE"
        ? "oklch(0.85 0.22 80)"
        : "oklch(0.65 0.28 25)";
  const decisionIcon =
    scenario.decision === "ALLOW"
      ? "✓"
      : scenario.decision === "CHALLENGE"
        ? "MFA"
        : "✗";

  return (
    <div className="space-y-6">
      {/* Scenario picker */}
      <div className="flex flex-wrap gap-2">
        {ZT_SCENARIOS.map((sc, i) => (
          <button
            key={sc.user}
            type="button"
            onClick={() => setActive(i)}
            className="font-mono text-xs px-3 py-2 border transition-all"
            style={{
              borderColor:
                active === i ? decisionColor : "oklch(0.22 0.04 240)",
              color: active === i ? decisionColor : "oklch(0.5 0.04 240)",
              background: active === i ? `${decisionColor}10` : "transparent",
            }}
          >
            {sc.user}
          </button>
        ))}
      </div>

      {/* Trust flow diagram */}
      <div className="overflow-x-auto">
        <div className="flex items-center min-w-max gap-0">
          {ZT_ZONES.map((zone, i) => (
            <div key={zone.id} className="flex items-center">
              <div
                className="px-4 py-4 border text-center transition-all duration-500"
                style={{
                  borderColor:
                    i <= step ? `${zone.color}66` : "oklch(0.22 0.04 240)",
                  background:
                    i <= step ? `${zone.color}0d` : "oklch(0.10 0.02 240)",
                  minWidth: "140px",
                  boxShadow: i === step ? `0 0 12px ${zone.color}44` : "none",
                }}
              >
                <div
                  className="font-mono text-xs font-bold mb-1"
                  style={{
                    color: i <= step ? zone.color : "oklch(0.35 0.04 240)",
                  }}
                >
                  {zone.label}
                </div>
                <div
                  className="font-mono text-[10px]"
                  style={{
                    color:
                      i <= step ? "oklch(0.6 0.04 240)" : "oklch(0.3 0.04 240)",
                  }}
                >
                  {zone.sub}
                </div>
              </div>
              {i < ZT_ZONES.length - 1 && (
                <div className="flex flex-col items-center w-10 flex-shrink-0">
                  <div
                    className="w-full h-px transition-all duration-500"
                    style={{
                      background:
                        i < step
                          ? "oklch(0.75 0.18 230)"
                          : "oklch(0.22 0.04 240)",
                    }}
                  />
                  <span className="font-mono text-[10px] text-foreground/30 mt-0.5">
                    →
                  </span>
                </div>
              )}
            </div>
          ))}
          {/* Decision bubble */}
          <div
            className="ml-4 w-16 h-16 flex items-center justify-center border-2 rounded-full transition-all duration-700"
            style={{
              borderColor:
                step >= ZT_ZONES.length - 1
                  ? decisionColor
                  : "oklch(0.22 0.04 240)",
              background:
                step >= ZT_ZONES.length - 1
                  ? `${decisionColor}15`
                  : "transparent",
              boxShadow:
                step >= ZT_ZONES.length - 1
                  ? `0 0 20px ${decisionColor}55`
                  : "none",
            }}
          >
            <span
              className="font-mono text-sm font-bold"
              style={{
                color:
                  step >= ZT_ZONES.length - 1
                    ? decisionColor
                    : "oklch(0.3 0.04 240)",
              }}
            >
              {decisionIcon}
            </span>
          </div>
        </div>
      </div>

      {/* Scenario details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="border border-[oklch(0.22_0.04_240)] bg-[oklch(0.08_0.015_240)] p-4 space-y-2">
          <div className="font-mono text-[10px] text-foreground/40 uppercase tracking-widest mb-3">
            Request Context
          </div>
          {[
            ["User", scenario.user],
            ["Device", scenario.device],
            ["Location", scenario.location],
            ["MFA", scenario.mfa ? "✓ Passed" : "✗ Not provided"],
          ].map(([label, val]) => (
            <div key={label} className="flex justify-between font-mono text-xs">
              <span className="text-foreground/40">{label}</span>
              <span
                style={{
                  color:
                    label === "MFA"
                      ? scenario.mfa
                        ? "oklch(0.87 0.28 145)"
                        : "oklch(0.65 0.28 25)"
                      : "oklch(0.7 0.04 240)",
                }}
              >
                {val}
              </span>
            </div>
          ))}
        </div>
        <div
          className="border p-4 flex flex-col justify-between"
          style={{
            borderColor: `${decisionColor}44`,
            background: `${decisionColor}08`,
          }}
        >
          <div>
            <div className="font-mono text-[10px] text-foreground/40 uppercase tracking-widest mb-3">
              Access Decision
            </div>
            <div
              className="font-mono text-2xl font-bold mb-2"
              style={{ color: decisionColor }}
            >
              {scenario.decision}
            </div>
            <div className="font-mono text-xs text-foreground/60 leading-relaxed">
              {scenario.reason}
            </div>
          </div>
          <div className="mt-3 flex gap-1">
            {ZT_ZONES.map((zone, i) => (
              <div
                key={zone.id}
                className="flex-1 h-1 rounded-full transition-all duration-500"
                style={{
                  background:
                    i <= step ? decisionColor : "oklch(0.22 0.04 240)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MODULE 5: XDR Correlation Flow ───────────────────────────────────────────
const XDR_FLOW = [
  {
    id: "edr",
    tool: "EDR",
    icon: "💻",
    color: "oklch(0.65 0.28 25)",
    event: "Mimikatz pattern detected",
    detail: "lsass.exe memory read by mimikatz.exe on WEB-SRV-01",
    severity: "CRITICAL",
  },
  {
    id: "fw",
    tool: "Firewall",
    icon: "🔥",
    color: "oklch(0.85 0.22 80)",
    event: "Unusual outbound traffic",
    detail: "High-volume DNS queries to attacker.c2.net — 3,842 qps",
    severity: "HIGH",
  },
  {
    id: "siem",
    tool: "SIEM",
    icon: "📊",
    color: "oklch(0.75 0.18 230)",
    event: "Cross-source correlation",
    detail:
      "EDR alert + FW anomaly + auth logs correlated to single attack chain",
    severity: "CRITICAL",
  },
  {
    id: "xdr",
    tool: "XDR",
    icon: "🔗",
    color: "oklch(0.87 0.28 145)",
    event: "Unified incident created",
    detail: "INC-001 — APT lateral movement campaign — 3 techniques mapped",
    severity: "CRITICAL",
  },
];

export function XDRCorrelation() {
  const [activeStep, setActiveStep] = useState(-1);
  const [running, setRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => {
    setActiveStep(-1);
    setRunning(true);
    let step = 0;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveStep(step);
      step++;
      if (step >= XDR_FLOW.length) {
        clearInterval(timerRef.current!);
        setRunning(false);
      }
    }, 1200);
  };

  useEffect(
    () => () => {
      if (timerRef.current) clearInterval(timerRef.current);
    },
    [],
  );

  return (
    <div className="space-y-6">
      {/* Flow diagram */}
      <div className="overflow-x-auto">
        <div className="flex items-stretch gap-0 min-w-max">
          {XDR_FLOW.map((node, i) => (
            <div key={node.id} className="flex items-center">
              <div
                className="border p-4 transition-all duration-500 min-w-[160px]"
                style={{
                  borderColor:
                    activeStep >= i
                      ? `${node.color}88`
                      : "oklch(0.22 0.04 240)",
                  background:
                    activeStep >= i
                      ? `${node.color}0d`
                      : "oklch(0.10 0.02 240)",
                  boxShadow:
                    activeStep === i ? `0 0 16px ${node.color}44` : "none",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{node.icon}</span>
                  <span
                    className="font-mono text-sm font-bold"
                    style={{
                      color:
                        activeStep >= i ? node.color : "oklch(0.35 0.04 240)",
                    }}
                  >
                    {node.tool}
                  </span>
                  {activeStep >= i && (
                    <span
                      className="ml-auto font-mono text-[9px] font-bold px-1 border"
                      style={{
                        color: node.color,
                        borderColor: `${node.color}55`,
                      }}
                    >
                      {node.severity}
                    </span>
                  )}
                </div>
                <div
                  className="font-mono text-xs font-bold mb-1"
                  style={{
                    color:
                      activeStep >= i
                        ? "oklch(0.85 0.05 240)"
                        : "oklch(0.35 0.04 240)",
                  }}
                >
                  {node.event}
                </div>
                <div
                  className="font-mono text-[10px] leading-relaxed"
                  style={{
                    color:
                      activeStep >= i
                        ? "oklch(0.55 0.04 240)"
                        : "oklch(0.25 0.04 240)",
                  }}
                >
                  {node.detail}
                </div>
              </div>
              {i < XDR_FLOW.length - 1 && (
                <div className="flex flex-col items-center w-12 flex-shrink-0">
                  <div
                    className="w-full h-px transition-all duration-700"
                    style={{
                      background:
                        activeStep > i ? node.color : "oklch(0.22 0.04 240)",
                    }}
                  />
                  <span
                    className="font-mono text-base transition-colors"
                    style={{
                      color:
                        activeStep > i ? node.color : "oklch(0.22 0.04 240)",
                    }}
                  >
                    →
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {XDR_FLOW.map((node, i) => (
          <div
            key={node.id}
            className="border p-3 transition-all duration-500"
            style={{
              borderColor:
                activeStep >= i ? `${node.color}44` : "oklch(0.16 0.025 240)",
              background: "oklch(0.08 0.015 240)",
            }}
          >
            <div
              className="font-mono text-[9px] font-bold mb-1 uppercase tracking-wider"
              style={{
                color: activeStep >= i ? node.color : "oklch(0.3 0.04 240)",
              }}
            >
              Step {i + 1}
            </div>
            <div
              className="font-mono text-[11px]"
              style={{
                color:
                  activeStep >= i
                    ? "oklch(0.7 0.04 240)"
                    : "oklch(0.3 0.04 240)",
              }}
            >
              {node.tool} detects and reports to correlation engine
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        disabled={running}
        onClick={start}
        className="px-5 py-2 font-mono text-sm font-bold border transition-all hover:opacity-90 disabled:opacity-40"
        style={{
          borderColor: "oklch(0.87 0.28 145)",
          color: "oklch(0.87 0.28 145)",
          background: "oklch(0.87 0.28 145 / 0.08)",
        }}
      >
        {running ? "▶ Correlating..." : "▶ Run XDR Correlation"}
      </button>
    </div>
  );
}

// ─── MODULE 6: Profile Panel ───────────────────────────────────────────────────
export function ProfilePanel() {
  const skills = [
    { name: "SIEM", module: "Incident Monitoring", level: 90 },
    { name: "EDR", module: "Endpoint Detection", level: 85 },
    { name: "Identity / IAM", module: "Zero Trust", level: 80 },
    { name: "Network / Firewall", module: "Firewall Security", level: 88 },
    { name: "Threat Hunting", module: "XDR / Threat Intel", level: 78 },
    { name: "Incident Response", module: "SOC Workflow", level: 85 },
  ];

  const certs = [
    { name: "CEH", full: "Certified Ethical Hacker", status: "active" },
    { name: "ISC2 CC", full: "Certified in Cybersecurity", status: "active" },
    { name: "SSCP", full: "Systems Security Certified", status: "progress" },
    { name: "Qualys", full: "Qualys Security Platform", status: "active" },
  ];

  const contacts = [
    { label: "Email", value: "sajinjoseph363@gmail.com", icon: "✉" },
    {
      label: "LinkedIn",
      value: "linkedin.com/in/sajin-joseph-9471a9254",
      icon: "in",
    },
    { label: "Phone", value: "+91 799 424 7021", icon: "☎" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Left — Identity */}
      <div className="border border-[oklch(0.22_0.04_240)] bg-[oklch(0.08_0.015_240)] p-5 flex flex-col gap-4">
        <div>
          <div
            className="w-16 h-16 rounded-full border-2 flex items-center justify-center text-2xl mb-3"
            style={{
              borderColor: "oklch(0.75 0.18 230)",
              background: "oklch(0.12 0.025 240)",
            }}
          >
            🛡
          </div>
          <div className="font-mono text-base font-bold text-foreground/90">
            Sajin Joseph
          </div>
          <div
            className="font-mono text-xs mt-0.5"
            style={{ color: "oklch(0.75 0.18 230)" }}
          >
            Cyber Security Engineer
          </div>
          <div className="font-mono text-xs text-foreground/40">
            Red Team | Blue Teaming
          </div>
        </div>

        <div className="space-y-2">
          <div className="font-mono text-[10px] text-foreground/40 uppercase tracking-widest">
            Certifications
          </div>
          {certs.map((c) => (
            <div key={c.name} className="flex items-center gap-2">
              <span
                className="font-mono text-[10px] font-bold px-1.5 py-0.5 border"
                style={{
                  color:
                    c.status === "progress"
                      ? "oklch(0.85 0.22 80)"
                      : "oklch(0.87 0.28 145)",
                  borderColor:
                    c.status === "progress"
                      ? "oklch(0.85 0.22 80 / 0.5)"
                      : "oklch(0.87 0.28 145 / 0.5)",
                }}
              >
                {c.name}
              </span>
              <span className="font-mono text-[11px] text-foreground/50">
                {c.full}
              </span>
              {c.status === "progress" && (
                <span className="ml-auto font-mono text-[9px] text-[oklch(0.85_0.22_80)]">
                  (in progress)
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="space-y-1.5 mt-auto">
          <div className="font-mono text-[10px] text-foreground/40 uppercase tracking-widest">
            Contact
          </div>
          {contacts.map((c) => (
            <div
              key={c.label}
              className="flex items-center gap-2 font-mono text-[11px] text-foreground/50"
            >
              <span className="text-xs">{c.icon}</span>
              <span className="truncate">{c.value}</span>
            </div>
          ))}
        </div>

        <a
          href="/assets/uploads/sajinjosephresume2026-019d1d6c-8a89-7359-8205-81e4cb2f1e8f-1.pdf"
          download
          className="block text-center font-mono text-sm font-bold py-2.5 border transition-all hover:opacity-90"
          style={{
            borderColor: "oklch(0.87 0.28 145)",
            color: "oklch(0.87 0.28 145)",
            background: "oklch(0.87 0.28 145 / 0.08)",
          }}
        >
          ↓ Download Resume
        </a>
      </div>

      {/* Right — Skills */}
      <div className="lg:col-span-2 border border-[oklch(0.22_0.04_240)] bg-[oklch(0.08_0.015_240)] p-5">
        <div className="font-mono text-[10px] text-foreground/40 uppercase tracking-widest mb-4">
          Skills Mapped to SOC Modules
        </div>
        <div className="space-y-4">
          {skills.map((s) => (
            <div key={s.name}>
              <div className="flex justify-between font-mono text-xs mb-1.5">
                <span className="text-foreground/80 font-bold">{s.name}</span>
                <span className="text-foreground/40">{s.module}</span>
                <span style={{ color: "oklch(0.75 0.18 230)" }}>
                  {s.level}%
                </span>
              </div>
              <div className="h-1.5 bg-[oklch(0.12_0.025_240)] border border-[oklch(0.20_0.04_240)]">
                <div
                  className="h-full transition-all duration-1000"
                  style={{
                    width: `${s.level}%`,
                    background:
                      "linear-gradient(90deg, oklch(0.75 0.18 230), oklch(0.87 0.28 145))",
                    boxShadow: "0 0 6px oklch(0.75 0.18 230 / 0.5)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            "Network Security",
            "SIEM / Splunk",
            "EDR / CrowdStrike",
            "Zero Trust / IAM",
            "Firewall / NGF W",
            "Threat Hunting",
            "Incident Response",
            "MITRE ATT&CK",
            "XDR / Correlation",
          ].map((tool) => (
            <div
              key={tool}
              className="font-mono text-[10px] px-2 py-1.5 border text-center transition-all hover:border-[oklch(0.75_0.18_230)] hover:text-foreground/70 cursor-default"
              style={{
                borderColor: "oklch(0.18 0.03 240)",
                color: "oklch(0.45 0.04 240)",
              }}
            >
              {tool}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
type SOCTab =
  | "incidents"
  | "mitre"
  | "hunting"
  | "zerotrust"
  | "xdr"
  | "profile";

const TABS: { id: SOCTab; label: string; short: string }[] = [
  { id: "incidents", label: "Incident Investigation", short: "Incidents" },
  { id: "mitre", label: "MITRE ATT&CK", short: "ATT&CK" },
  { id: "hunting", label: "Threat Hunting", short: "Hunting" },
  { id: "zerotrust", label: "Zero Trust", short: "Zero Trust" },
  { id: "xdr", label: "XDR Correlation", short: "XDR" },
  { id: "profile", label: "SOC Profile", short: "Profile" },
];

export default function SOCOperationsCenter() {
  const [tab, setTab] = useState<SOCTab>("incidents");
  const [view, setView] = useState<"attack" | "defense">("defense");

  return (
    <section id="soc-ops" className="relative z-10 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <span
            className="font-mono text-sm tracking-widest uppercase"
            style={{ color: "oklch(0.75 0.18 230)" }}
          >
            {"// Security Operations Center"}
          </span>
          <h2
            className="text-3xl sm:text-4xl font-bold mt-1 font-mono tracking-tight"
            style={{ color: "oklch(0.95 0.015 240)" }}
          >
            <span
              style={{
                textShadow:
                  "-2px 0 oklch(0.65 0.28 25/0.3), 2px 0 oklch(0.75 0.18 230/0.3)",
              }}
            >
              SOC OPERATIONS CENTER
            </span>
          </h2>
          <p className="text-foreground/45 text-sm mt-2 max-w-2xl">
            Full-spectrum security operations workflow — incident investigation,
            MITRE ATT&CK mapping, threat hunting, zero trust, and XDR
            correlation.
          </p>
        </div>

        {/* Disclaimer */}
        <div
          className="flex items-center gap-3 mb-6 px-4 py-3 border font-mono text-xs"
          style={{
            borderColor: "oklch(0.85 0.22 80 / 0.5)",
            background: "oklch(0.85 0.22 80 / 0.05)",
            color: "oklch(0.85 0.22 80)",
          }}
        >
          <span className="text-base flex-shrink-0">⚠</span>
          <span>
            This is a simulated cybersecurity environment for educational and
            demonstration purposes only.
          </span>
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex gap-0 border border-[oklch(0.22_0.04_240)] w-fit">
            {(["attack", "defense"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                className="px-4 py-2 font-mono text-xs font-bold transition-all uppercase"
                style={{
                  background:
                    view === v
                      ? v === "attack"
                        ? "oklch(0.65 0.28 25 / 0.15)"
                        : "oklch(0.75 0.18 230 / 0.15)"
                      : "transparent",
                  color:
                    view === v
                      ? v === "attack"
                        ? "oklch(0.65 0.28 25)"
                        : "oklch(0.75 0.18 230)"
                      : "oklch(0.4 0.04 240)",
                  borderRight:
                    v === "attack"
                      ? "1px solid oklch(0.22 0.04 240)"
                      : undefined,
                }}
              >
                {v === "attack" ? "🔴 Attack View" : "🔵 Defense View"}
              </button>
            ))}
          </div>
          <div className="font-mono text-[10px] text-foreground/30">
            {view === "attack"
              ? "Viewing from adversary perspective"
              : "Viewing from defender perspective"}
          </div>
        </div>

        {/* Module tabs */}
        <div className="flex flex-wrap gap-0 mb-6 border border-[oklch(0.22_0.04_240)] w-fit">
          {TABS.map((t, i) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className="px-4 py-2.5 font-mono text-xs font-bold transition-all"
              style={{
                background:
                  tab === t.id ? "oklch(0.75 0.18 230 / 0.12)" : "transparent",
                color:
                  tab === t.id ? "oklch(0.75 0.18 230)" : "oklch(0.4 0.04 240)",
                borderRight:
                  i < TABS.length - 1
                    ? "1px solid oklch(0.22 0.04 240)"
                    : undefined,
                boxShadow:
                  tab === t.id ? "inset 0 -2px 0 oklch(0.75 0.18 230)" : "none",
              }}
            >
              <span className="hidden sm:inline">{t.label}</span>
              <span className="sm:hidden">{t.short}</span>
            </button>
          ))}
        </div>

        {/* Module content */}
        <div className="min-h-[500px]">
          {tab === "incidents" && <IncidentInvestigation />}
          {tab === "mitre" && <MitreAttackMap />}
          {tab === "hunting" && <ThreatHuntingLab />}
          {tab === "zerotrust" && <ZeroTrustView />}
          {tab === "xdr" && <XDRCorrelation />}
          {tab === "profile" && <ProfilePanel />}
        </div>
      </div>
    </section>
  );
}

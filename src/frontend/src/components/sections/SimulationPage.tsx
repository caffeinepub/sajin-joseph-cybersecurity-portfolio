import { useCallback, useEffect, useRef, useState } from "react";

// ─── Data ──────────────────────────────────────────────────────────────────────

const RED_PHASES = [
  {
    id: 0,
    name: "RECONNAISSANCE",
    icon: "👁",
    desc: "Passive and active intelligence gathering on the target.",
    tools: ["theHarvester", "Maltego", "Shodan", "OSINT Framework"],
  },
  {
    id: 1,
    name: "SCANNING",
    icon: "📡",
    desc: "Probing live hosts, open ports, and service fingerprinting.",
    tools: ["nmap", "masscan", "Nessus", "Nikto"],
  },
  {
    id: 2,
    name: "EXPLOITATION",
    icon: "💥",
    desc: "Leveraging discovered vulnerabilities to gain initial access.",
    tools: ["Metasploit", "SQLMap", "Burp Suite", "ExploitDB"],
  },
  {
    id: 3,
    name: "LATERAL MOVEMENT",
    icon: "🔀",
    desc: "Pivoting through internal systems after initial compromise.",
    tools: ["Mimikatz", "BloodHound", "CrackMapExec", "PowerSploit"],
  },
  {
    id: 4,
    name: "EXFILTRATION",
    icon: "📤",
    desc: "Extracting sensitive data without triggering security controls.",
    tools: ["DNScat2", "Cobalt Strike", "exfiltrate.py", "curl"],
  },
];

const RED_LOGS: string[] = [
  "[*] Starting recon on 192.168.10.0/24...",
  "[*] Running theHarvester against target domain...",
  "[+] Found 3 email addresses: admin@corp.local, dev@corp.local",
  "[*] Launching nmap SYN scan...",
  "[+] 192.168.10.5 — Port 22/tcp open (SSH)",
  "[+] 192.168.10.5 — Port 80/tcp open (HTTP)",
  "[+] 192.168.10.5 — Port 3306/tcp open (MySQL)",
  "[*] Fingerprinting services on 192.168.10.5...",
  "[!] Apache/2.4.29 — CVE-2021-41773 detected (Path Traversal)",
  "[*] Running Metasploit module exploit/multi/handler...",
  "[*] Sending payload to 192.168.10.5:80...",
  "[+] Session 1 opened (10.0.0.1:4444 → 192.168.10.5:49320)",
  "[*] Dumping credentials via Mimikatz...",
  "[+] Credential found: Administrator:P@ssw0rd123",
  "[*] Authenticating to 192.168.10.10 via SMB...",
  "[+] Access granted on DC01 (192.168.10.10)",
  "[*] Enumerating Active Directory with BloodHound...",
  "[!] DA path identified — 2 hops",
  "[*] Compressing sensitive files for exfil...",
  "[*] Tunnelling data via DNS — 192.168.10.10 → attacker.c2.net",
  "[+] Exfiltration complete — 4.2 GB transferred",
  "[!] SIMULATION COMPLETE — All phases executed",
];

const TARGET_HOSTS = [
  { ip: "192.168.10.5", name: "WEB-SRV-01", initStatus: "alive" },
  { ip: "192.168.10.10", name: "DC-01", initStatus: "alive" },
  { ip: "192.168.10.22", name: "FILE-SRV-02", initStatus: "alive" },
  { ip: "192.168.10.35", name: "WRK-ADMIN", initStatus: "alive" },
];

const BLUE_ALERTS = [
  { sev: "HIGH", msg: "Possible credential dumping on DC-01", src: "EDR" },
  { sev: "HIGH", msg: "Lateral movement via SMB detected", src: "SIEM" },
  { sev: "MEDIUM", msg: "Nmap SYN scan from 10.0.0.50", src: "IDS" },
  { sev: "MEDIUM", msg: "Apache path traversal attempt blocked", src: "WAF" },
  { sev: "LOW", msg: "Unusual DNS query volume on endpoint", src: "DNS" },
  { sev: "HIGH", msg: "Mimikatz pattern in memory — WEB-SRV-01", src: "EDR" },
  { sev: "MEDIUM", msg: "New scheduled task created on DC-01", src: "SIEM" },
  { sev: "LOW", msg: "Port scan from internal host 192.168.10.99", src: "FW" },
  { sev: "HIGH", msg: "Exfil attempt via DNS tunnel detected", src: "DLP" },
  { sev: "MEDIUM", msg: "Failed login spike on FILE-SRV-02", src: "SIEM" },
];

const SIEM_LOGS: string[] = [
  "[INFO] 2026-03-25T08:01:02Z — FW ALLOW IN tcp/80 192.168.10.5",
  "[WARN] 2026-03-25T08:01:44Z — IDS ALERT SYN flood src=10.0.0.50",
  "[CRIT] 2026-03-25T08:02:11Z — EDR Mimikatz pattern WEB-SRV-01",
  "[INFO] 2026-03-25T08:02:33Z — AUTH SUCCESS DC-01 Administrator",
  "[WARN] 2026-03-25T08:03:01Z — DLP DNS exfil flag threshold=500 qps",
  "[CRIT] 2026-03-25T08:03:29Z — SIEM lateral movement smb/445 DC-01",
  "[INFO] 2026-03-25T08:04:02Z — FW BLOCK OUT tcp/4444 10.0.0.1",
  "[WARN] 2026-03-25T08:04:18Z — EDR suspicious scheduled task DC-01",
  "[CRIT] 2026-03-25T08:05:00Z — DLP bulk file access FILE-SRV-02",
  "[INFO] 2026-03-25T08:05:22Z — IDS scan policy triggered WRK-ADMIN",
];

const IOCS = [
  { type: "IP", value: "10.0.0.50", label: "C2 Server" },
  { type: "HASH", value: "a3f9c...b12e (SHA-256)", label: "Mimikatz binary" },
  { type: "DOMAIN", value: "attacker.c2.net", label: "DNS Tunnel C2" },
  { type: "IP", value: "192.168.10.99", label: "Pivot Host" },
  { type: "HASH", value: "e71d2...c330 (MD5)", label: "Payload dropper" },
];

const IR_STEPS = [
  {
    name: "DETECT",
    icon: "🔍",
    desc: "Alert correlation and initial signal identification.",
  },
  {
    name: "TRIAGE",
    icon: "⚖️",
    desc: "Severity assessment, asset criticality, and scope.",
  },
  {
    name: "CONTAIN",
    icon: "🛡",
    desc: "Isolate affected endpoints and block malicious IPs.",
  },
  {
    name: "INVESTIGATE",
    icon: "🔬",
    desc: "Root-cause analysis and attacker TTPs mapping.",
  },
  {
    name: "RECOVER",
    icon: "♻️",
    desc: "Restore systems, patch vulnerabilities, monitor for re-entry.",
  },
];

type LogEntry = { id: number; text: string };
type AlertEntry = {
  id: number;
  sev: string;
  msg: string;
  src: string;
  ts: string;
};

let _uid = 0;
const uid = () => ++_uid;

// ─── Red Team ────────────────────────────────────────────────────────────────

function RedTeamSim() {
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState(-1);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [progress, setProgress] = useState(0);
  const [hosts, setHosts] = useState(
    TARGET_HOSTS.map((h) => ({ ...h, status: h.initStatus })),
  );
  const logRef = useRef<HTMLDivElement>(null);
  const phaseTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const logTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimers = useCallback(() => {
    if (phaseTimer.current) clearInterval(phaseTimer.current);
    if (logTimer.current) clearInterval(logTimer.current);
    phaseTimer.current = null;
    logTimer.current = null;
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on log change
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [logs]);

  const start = () => {
    clearTimers();
    setRunning(true);
    setPhase(0);
    setLogs([
      { id: uid(), text: "[*] Simulation initialised — target acquired" },
    ]);
    setProgress(0);
    setHosts(TARGET_HOSTS.map((h) => ({ ...h, status: h.initStatus })));

    let p = 0;
    phaseTimer.current = setInterval(() => {
      p = Math.min(p + 1, RED_PHASES.length - 1);
      setPhase(p);
      setProgress(Math.round(((p + 1) / RED_PHASES.length) * 100));
      if (p >= 2) {
        setHosts((prev) =>
          prev.map((h, i) => (i === 0 ? { ...h, status: "compromised" } : h)),
        );
      }
      if (p >= 3) {
        setHosts((prev) =>
          prev.map((h, i) => (i <= 1 ? { ...h, status: "compromised" } : h)),
        );
      }
      if (p >= 4) {
        setHosts((prev) => prev.map((h) => ({ ...h, status: "exfiltrated" })));
        if (phaseTimer.current) clearInterval(phaseTimer.current);
        phaseTimer.current = null;
        setRunning(false);
      }
    }, 4000);

    let li = 0;
    logTimer.current = setInterval(() => {
      const text = RED_LOGS[li % RED_LOGS.length];
      setLogs((prev) => [...prev.slice(-40), { id: uid(), text }]);
      li++;
      if (li >= RED_LOGS.length) {
        if (logTimer.current) clearInterval(logTimer.current);
        logTimer.current = null;
      }
    }, 1800);
  };

  const reset = () => {
    clearTimers();
    setRunning(false);
    setPhase(-1);
    setLogs([]);
    setProgress(0);
    setHosts(TARGET_HOSTS.map((h) => ({ ...h, status: h.initStatus })));
  };

  const hostColor = (status: string) => {
    if (status === "compromised") return "oklch(0.65 0.28 25)";
    if (status === "exfiltrated") return "oklch(0.55 0.25 10)";
    return "oklch(0.87 0.28 145)";
  };

  return (
    <div className="space-y-6">
      {/* Attack phase timeline */}
      <div className="overflow-x-auto">
        <div className="flex items-stretch gap-0 min-w-max">
          {RED_PHASES.map((p, i) => (
            <div key={p.id} className="flex items-center">
              <div
                className={`relative px-4 py-3 border transition-all duration-500 min-w-[130px] ${
                  i <= phase
                    ? "border-[oklch(0.65_0.28_25)] bg-[oklch(0.65_0.28_25/0.12)]"
                    : "border-[oklch(0.22_0.04_240)] bg-[oklch(0.12_0.025_240)]"
                }`}
              >
                <div className="text-xl mb-1">{p.icon}</div>
                <div
                  className="font-mono text-xs font-bold"
                  style={{
                    color:
                      i <= phase
                        ? "oklch(0.65 0.28 25)"
                        : "oklch(0.5 0.04 240)",
                  }}
                >
                  {p.name}
                </div>
                {i === phase && running && (
                  <span
                    className="absolute top-1 right-1 w-2 h-2 rounded-full animate-pulse"
                    style={{ background: "oklch(0.65 0.28 25)" }}
                  />
                )}
              </div>
              {i < RED_PHASES.length - 1 && (
                <div
                  className="w-6 h-0.5 flex-shrink-0"
                  style={{
                    background:
                      i < phase
                        ? "oklch(0.65 0.28 25)"
                        : "oklch(0.22 0.04 240)",
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Phase detail */}
      {phase >= 0 && (
        <div className="p-4 border border-[oklch(0.65_0.28_25/0.4)] bg-[oklch(0.65_0.28_25/0.06)] font-mono text-sm">
          <div
            className="font-bold mb-1"
            style={{ color: "oklch(0.65 0.28 25)" }}
          >
            {RED_PHASES[phase].icon} {RED_PHASES[phase].name}
          </div>
          <p className="text-foreground/70 text-xs mb-2">
            {RED_PHASES[phase].desc}
          </p>
          <div className="flex flex-wrap gap-2">
            {RED_PHASES[phase].tools.map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 text-xs border border-[oklch(0.65_0.28_25/0.5)]"
                style={{ color: "oklch(0.65 0.28 25)" }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Terminal log */}
        <div className="border border-[oklch(0.22_0.04_240)] bg-[oklch(0.08_0.015_240)]">
          <div
            className="flex items-center gap-2 px-3 py-2 border-b border-[oklch(0.22_0.04_240)]"
            style={{ background: "oklch(0.65 0.28 25 / 0.1)" }}
          >
            <div className="flex gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
            </div>
            <span
              className="font-mono text-xs"
              style={{ color: "oklch(0.65 0.28 25)" }}
            >
              root@kali:~# attack.sh
            </span>
          </div>
          <div
            ref={logRef}
            className="h-48 overflow-y-auto p-3 font-mono text-xs space-y-0.5"
          >
            {logs.length === 0 ? (
              <span className="text-foreground/30">
                $ Awaiting simulation start...
              </span>
            ) : (
              logs.map((entry) => (
                <div
                  key={entry.id}
                  className="leading-5"
                  style={{
                    color: entry.text.startsWith("[+]")
                      ? "oklch(0.87 0.28 145)"
                      : entry.text.startsWith("[!]")
                        ? "oklch(0.65 0.28 25)"
                        : "oklch(0.7 0.04 240)",
                  }}
                >
                  {entry.text}
                </div>
              ))
            )}
            {running && (
              <span
                className="animate-pulse"
                style={{ color: "oklch(0.65 0.28 25)" }}
              >
                █
              </span>
            )}
          </div>
        </div>

        {/* Host statuses */}
        <div className="border border-[oklch(0.22_0.04_240)] bg-[oklch(0.08_0.015_240)]">
          <div
            className="px-3 py-2 border-b border-[oklch(0.22_0.04_240)] font-mono text-xs"
            style={{ color: "oklch(0.65 0.28 25)" }}
          >
            TARGET HOST STATUS
          </div>
          <div className="p-3 space-y-2">
            {hosts.map((h) => (
              <div
                key={h.ip}
                className="flex items-center justify-between font-mono text-xs"
              >
                <span className="text-foreground/60">{h.name}</span>
                <span className="text-foreground/40">{h.ip}</span>
                <span
                  className="uppercase font-bold px-2 py-0.5 border text-[10px]"
                  style={{
                    color: hostColor(h.status),
                    borderColor: `${hostColor(h.status)}55`,
                  }}
                >
                  {h.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress meter */}
      <div>
        <div className="flex justify-between font-mono text-xs mb-1">
          <span style={{ color: "oklch(0.65 0.28 25)" }}>ATTACK PROGRESS</span>
          <span style={{ color: "oklch(0.65 0.28 25)" }}>{progress}%</span>
        </div>
        <div className="h-2 bg-[oklch(0.14_0.025_240)] border border-[oklch(0.22_0.04_240)]">
          <div
            className="h-full transition-all duration-700"
            style={{
              width: `${progress}%`,
              background:
                "linear-gradient(90deg, oklch(0.65 0.28 25), oklch(0.75 0.3 15))",
              boxShadow: "0 0 8px oklch(0.65 0.28 25)",
            }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3" data-ocid="simulation.red.panel">
        <button
          type="button"
          disabled={running}
          onClick={start}
          className="px-5 py-2 font-mono text-sm font-bold border transition-all hover:opacity-90 disabled:opacity-40"
          style={{
            borderColor: "oklch(0.65 0.28 25)",
            color: "oklch(0.65 0.28 25)",
            background: "oklch(0.65 0.28 25 / 0.1)",
          }}
          data-ocid="simulation.red.primary_button"
        >
          ▶ Start Attack Simulation
        </button>
        <button
          type="button"
          onClick={reset}
          className="px-5 py-2 font-mono text-sm border border-[oklch(0.22_0.04_240)] text-foreground/50 hover:text-foreground/80 transition-colors"
          data-ocid="simulation.red.secondary_button"
        >
          ↺ Reset
        </button>
      </div>
    </div>
  );
}

// ─── Blue Team ────────────────────────────────────────────────────────────────

function BlueTeamSim() {
  const [running, setRunning] = useState(false);
  const [alerts, setAlerts] = useState<AlertEntry[]>([]);
  const [irStep, setIrStep] = useState(-1);
  const [siemLogs, setSiemLogs] = useState<LogEntry[]>([]);
  const [contained, setContained] = useState(0);
  const [defense, setDefense] = useState(0);
  const alertRef = useRef<HTMLDivElement>(null);
  const siemRef = useRef<HTMLDivElement>(null);
  const alertTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const irTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const siemTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimers = useCallback(() => {
    for (const t of [alertTimer, irTimer, siemTimer]) {
      if (t.current) clearInterval(t.current);
      t.current = null;
    }
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on alerts change
  useEffect(() => {
    if (alertRef.current)
      alertRef.current.scrollTop = alertRef.current.scrollHeight;
  }, [alerts]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on siemLogs change
  useEffect(() => {
    if (siemRef.current)
      siemRef.current.scrollTop = siemRef.current.scrollHeight;
  }, [siemLogs]);

  const getTs = () => {
    const d = new Date();
    return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}:${d.getSeconds().toString().padStart(2, "0")}`;
  };

  const start = () => {
    clearTimers();
    setRunning(true);
    setAlerts([]);
    setIrStep(0);
    setSiemLogs([{ id: uid(), text: SIEM_LOGS[0] }]);
    setContained(0);
    setDefense(0);

    let ai = 0;
    alertTimer.current = setInterval(() => {
      const a = BLUE_ALERTS[ai % BLUE_ALERTS.length];
      setAlerts((prev) => [
        ...prev.slice(-20),
        { id: uid(), ...a, ts: getTs() },
      ]);
      ai++;
      setContained((prev) => Math.min(prev + 12, 100));
      setDefense((prev) => Math.min(prev + 8, 100));
    }, 2000);

    let step = 0;
    irTimer.current = setInterval(() => {
      step = Math.min(step + 1, IR_STEPS.length - 1);
      setIrStep(step);
      if (step === IR_STEPS.length - 1) {
        if (irTimer.current) clearInterval(irTimer.current);
        irTimer.current = null;
      }
    }, 5000);

    let li = 1;
    siemTimer.current = setInterval(() => {
      setSiemLogs((prev) => [
        ...prev.slice(-30),
        { id: uid(), text: SIEM_LOGS[li % SIEM_LOGS.length] },
      ]);
      li++;
    }, 2500);
  };

  const reset = () => {
    clearTimers();
    setRunning(false);
    setAlerts([]);
    setIrStep(-1);
    setSiemLogs([]);
    setContained(0);
    setDefense(0);
  };

  const sevColor = (sev: string) => {
    if (sev === "HIGH") return "oklch(0.65 0.28 25)";
    if (sev === "MEDIUM") return "oklch(0.85 0.22 80)";
    return "oklch(0.75 0.18 230)";
  };

  return (
    <div className="space-y-6">
      {/* IR workflow */}
      <div className="overflow-x-auto">
        <div className="flex items-stretch gap-0 min-w-max">
          {IR_STEPS.map((s, i) => (
            <div key={s.name} className="flex items-center">
              <div
                className={`relative px-4 py-3 border transition-all duration-500 min-w-[120px] ${
                  i <= irStep
                    ? "border-[oklch(0.75_0.18_230)] bg-[oklch(0.75_0.18_230/0.1)]"
                    : "border-[oklch(0.22_0.04_240)] bg-[oklch(0.12_0.025_240)]"
                }`}
              >
                <div className="text-xl mb-1">{s.icon}</div>
                <div
                  className="font-mono text-xs font-bold"
                  style={{
                    color:
                      i <= irStep
                        ? "oklch(0.75 0.18 230)"
                        : "oklch(0.5 0.04 240)",
                  }}
                >
                  {s.name}
                </div>
                {i === irStep && running && (
                  <span
                    className="absolute top-1 right-1 w-2 h-2 rounded-full animate-pulse"
                    style={{ background: "oklch(0.75 0.18 230)" }}
                  />
                )}
              </div>
              {i < IR_STEPS.length - 1 && (
                <div
                  className="w-6 h-0.5 flex-shrink-0"
                  style={{
                    background:
                      i < irStep
                        ? "oklch(0.75 0.18 230)"
                        : "oklch(0.22 0.04 240)",
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* IR Step detail */}
      {irStep >= 0 && (
        <div className="p-4 border border-[oklch(0.75_0.18_230/0.4)] bg-[oklch(0.75_0.18_230/0.06)] font-mono text-sm">
          <div
            className="font-bold mb-1"
            style={{ color: "oklch(0.75 0.18 230)" }}
          >
            {IR_STEPS[irStep].icon} {IR_STEPS[irStep].name}
          </div>
          <p className="text-foreground/70 text-xs">{IR_STEPS[irStep].desc}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Alert feed */}
        <div className="border border-[oklch(0.22_0.04_240)] bg-[oklch(0.08_0.015_240)]">
          <div className="px-3 py-2 border-b border-[oklch(0.22_0.04_240)] font-mono text-xs flex justify-between items-center">
            <span style={{ color: "oklch(0.75 0.18 230)" }}>
              SOC ALERT FEED
            </span>
            {running && (
              <span
                className="flex items-center gap-1 text-[10px]"
                style={{ color: "oklch(0.87 0.28 145)" }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                LIVE
              </span>
            )}
          </div>
          <div ref={alertRef} className="h-52 overflow-y-auto p-2 space-y-1">
            {alerts.length === 0 ? (
              <span className="font-mono text-xs text-foreground/30 p-1 block">
                Awaiting alerts...
              </span>
            ) : (
              alerts.map((a) => (
                <div
                  key={a.id}
                  className="flex items-start gap-2 p-1.5 border border-transparent hover:border-[oklch(0.75_0.18_230/0.2)] transition-colors"
                >
                  <span
                    className="font-mono text-[10px] font-bold px-1.5 py-0.5 flex-shrink-0 border"
                    style={{
                      color: sevColor(a.sev),
                      borderColor: `${sevColor(a.sev)}55`,
                    }}
                  >
                    {a.sev}
                  </span>
                  <span className="font-mono text-xs text-foreground/70 flex-1">
                    {a.msg}
                  </span>
                  <span className="font-mono text-[10px] text-foreground/30 flex-shrink-0">
                    {a.ts}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* SIEM log */}
        <div className="border border-[oklch(0.22_0.04_240)] bg-[oklch(0.08_0.015_240)]">
          <div
            className="px-3 py-2 border-b border-[oklch(0.22_0.04_240)] font-mono text-xs"
            style={{ color: "oklch(0.75 0.18 230)" }}
          >
            SIEM LOG VIEWER
          </div>
          <div
            ref={siemRef}
            className="h-52 overflow-y-auto p-3 font-mono text-[11px] space-y-0.5"
          >
            {siemLogs.length === 0 ? (
              <span className="text-foreground/30">
                $ Awaiting log stream...
              </span>
            ) : (
              siemLogs.map((entry) => (
                <div
                  key={entry.id}
                  className="leading-5"
                  style={{
                    color: entry.text.includes("CRIT")
                      ? "oklch(0.65 0.28 25)"
                      : entry.text.includes("WARN")
                        ? "oklch(0.85 0.22 80)"
                        : "oklch(0.6 0.04 240)",
                  }}
                >
                  {entry.text}
                </div>
              ))
            )}
            {running && (
              <span
                className="animate-pulse"
                style={{ color: "oklch(0.75 0.18 230)" }}
              >
                █
              </span>
            )}
          </div>
        </div>
      </div>

      {/* IOCs */}
      <div className="border border-[oklch(0.22_0.04_240)] bg-[oklch(0.08_0.015_240)]">
        <div
          className="px-3 py-2 border-b border-[oklch(0.22_0.04_240)] font-mono text-xs"
          style={{ color: "oklch(0.75 0.18 230)" }}
        >
          ACTIVE INDICATORS OF COMPROMISE
        </div>
        <div className="p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {IOCS.map((ioc) => (
            <div
              key={ioc.value}
              className="p-2 border border-[oklch(0.75_0.18_230/0.2)] bg-[oklch(0.75_0.18_230/0.04)]"
            >
              <div className="flex items-center gap-2 mb-0.5">
                <span
                  className="font-mono text-[10px] font-bold px-1 border"
                  style={{
                    color: "oklch(0.75 0.18 230)",
                    borderColor: "oklch(0.75 0.18 230 / 0.5)",
                  }}
                >
                  {ioc.type}
                </span>
                <span className="font-mono text-[10px] text-foreground/50">
                  {ioc.label}
                </span>
              </div>
              <div className="font-mono text-xs text-foreground/75 truncate">
                {ioc.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Meters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <div className="flex justify-between font-mono text-xs mb-1">
            <span style={{ color: "oklch(0.75 0.18 230)" }}>
              SYSTEMS CONTAINED
            </span>
            <span style={{ color: "oklch(0.75 0.18 230)" }}>{contained}%</span>
          </div>
          <div className="h-2 bg-[oklch(0.14_0.025_240)] border border-[oklch(0.22_0.04_240)]">
            <div
              className="h-full transition-all duration-700"
              style={{
                width: `${contained}%`,
                background:
                  "linear-gradient(90deg, oklch(0.75 0.18 230), oklch(0.85 0.22 195))",
                boxShadow: "0 0 8px oklch(0.75 0.18 230)",
              }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between font-mono text-xs mb-1">
            <span style={{ color: "oklch(0.75 0.18 230)" }}>
              DEFENSE EFFECTIVENESS
            </span>
            <span style={{ color: "oklch(0.75 0.18 230)" }}>{defense}%</span>
          </div>
          <div className="h-2 bg-[oklch(0.14_0.025_240)] border border-[oklch(0.22_0.04_240)]">
            <div
              className="h-full transition-all duration-700"
              style={{
                width: `${defense}%`,
                background:
                  "linear-gradient(90deg, oklch(0.75 0.18 230), oklch(0.87 0.28 145))",
                boxShadow: "0 0 8px oklch(0.75 0.18 230)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3" data-ocid="simulation.blue.panel">
        <button
          type="button"
          disabled={running}
          onClick={start}
          className="px-5 py-2 font-mono text-sm font-bold border transition-all hover:opacity-90 disabled:opacity-40"
          style={{
            borderColor: "oklch(0.75 0.18 230)",
            color: "oklch(0.75 0.18 230)",
            background: "oklch(0.75 0.18 230 / 0.1)",
          }}
          data-ocid="simulation.blue.primary_button"
        >
          🛡 Activate Defense
        </button>
        <button
          type="button"
          onClick={reset}
          className="px-5 py-2 font-mono text-sm border border-[oklch(0.22_0.04_240)] text-foreground/50 hover:text-foreground/80 transition-colors"
          data-ocid="simulation.blue.secondary_button"
        >
          ↺ Reset
        </button>
      </div>
    </div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────

export default function SimulationPage() {
  const [tab, setTab] = useState<"red" | "blue">("red");

  return (
    <section id="simulation" className="relative z-10 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-10">
          <span
            className="font-mono text-sm tracking-widest uppercase"
            style={{ color: "oklch(0.87 0.28 145)" }}
          >
            {"// Adversary Simulation"}
          </span>
          <h2
            className="text-3xl sm:text-4xl font-bold mt-1 font-mono tracking-tight"
            style={{ color: "oklch(0.95 0.015 240)" }}
          >
            <span
              style={{
                textShadow:
                  "-2px 0 oklch(0.65 0.28 25/0.4), 2px 0 oklch(0.75 0.18 230/0.4)",
              }}
            >
              ADVERSARY SIMULATION RANGE
            </span>
          </h2>
          <p className="text-foreground/50 text-sm mt-2 max-w-xl">
            Explore offensive and defensive cyber operations through fully
            simulated, interactive scenarios.
          </p>
        </div>

        {/* Disclaimer */}
        <div
          className="flex items-center gap-3 mb-8 px-4 py-3 border font-mono text-xs"
          style={{
            borderColor: "oklch(0.85 0.22 80 / 0.5)",
            background: "oklch(0.85 0.22 80 / 0.05)",
            color: "oklch(0.85 0.22 80)",
          }}
          data-ocid="simulation.panel"
        >
          <span className="text-base flex-shrink-0">⚠</span>
          <span>
            FOR EDUCATIONAL &amp; SIMULATION PURPOSES ONLY — No real attacks are
            performed. All data is synthetically generated.
          </span>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-0 mb-8 border border-[oklch(0.22_0.04_240)] w-fit">
          <button
            type="button"
            onClick={() => setTab("red")}
            className="px-6 py-2.5 font-mono text-sm font-bold transition-all"
            style={{
              background:
                tab === "red" ? "oklch(0.65 0.28 25 / 0.15)" : "transparent",
              color:
                tab === "red" ? "oklch(0.65 0.28 25)" : "oklch(0.5 0.04 240)",
              borderRight: "1px solid oklch(0.22 0.04 240)",
              boxShadow:
                tab === "red" ? "inset 0 -2px 0 oklch(0.65 0.28 25)" : "none",
            }}
            data-ocid="simulation.red.tab"
          >
            🔴 RED TEAM
          </button>
          <button
            type="button"
            onClick={() => setTab("blue")}
            className="px-6 py-2.5 font-mono text-sm font-bold transition-all"
            style={{
              background:
                tab === "blue" ? "oklch(0.75 0.18 230 / 0.15)" : "transparent",
              color:
                tab === "blue" ? "oklch(0.75 0.18 230)" : "oklch(0.5 0.04 240)",
              boxShadow:
                tab === "blue" ? "inset 0 -2px 0 oklch(0.75 0.18 230)" : "none",
            }}
            data-ocid="simulation.blue.tab"
          >
            🔵 BLUE TEAM
          </button>
        </div>

        {/* Tab content */}
        <div className="min-h-[480px]">
          {tab === "red" ? <RedTeamSim /> : <BlueTeamSim />}
        </div>
      </div>
    </section>
  );
}

import { useEffect, useRef, useState } from "react";

const SEED_LOGS = [
  { tag: "[AUTH]", msg: "Failed login: user=admin from 198.51.100.4" },
  { tag: "[NET]", msg: "Outbound connection to 203.0.113.42:4444" },
  { tag: "[ALERT]", msg: "Port scan detected: 45.33.32.156" },
  { tag: "[INFO]", msg: "IDS rule triggered: ET SCAN Nmap" },
  { tag: "[AUTH]", msg: "Brute-force blocked: 192.0.2.88" },
  { tag: "[NET]", msg: "DNS query: malware-c2.xyz" },
  { tag: "[ALERT]", msg: "XSS attempt in HTTP param" },
  { tag: "[INFO]", msg: "TLS handshake anomaly from 10.0.0.7" },
  { tag: "[AUTH]", msg: "Privilege escalation attempt: PID 2341" },
  { tag: "[NET]", msg: "Large data transfer: 10.0.1.5 → 203.0.113.99" },
  { tag: "[ALERT]", msg: "SQL injection payload in /api/search" },
  { tag: "[INFO]", msg: "Firewall rule updated: DENY 0.0.0.0/0:22" },
  { tag: "[AUTH]", msg: "New session: sajin.joseph@portfolio" },
  { tag: "[NET]", msg: "ICMP flood: 50k packets/sec" },
  { tag: "[ALERT]", msg: "Malware hash match: 4b3e6f8a..." },
  { tag: "[INFO]", msg: "SIEM alert: lateral movement pattern" },
  { tag: "[AUTH]", msg: "MFA challenge issued: user=operator" },
  { tag: "[NET]", msg: "Anomalous egress: 2.4MB in 3s" },
  { tag: "[ALERT]", msg: "CVE-2024-1234: exploit attempt blocked" },
  { tag: "[INFO]", msg: "Endpoint quarantined: WIN-DESKTOP-07" },
];

function nowStamp() {
  const d = new Date();
  return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}:${d.getSeconds().toString().padStart(2, "0")}`;
}

interface LogEntry {
  id: number;
  stamp: string;
  tag: string;
  msg: string;
}
let lid = 0;

export default function LiveLogStream() {
  const [logs, setLogs] = useState<LogEntry[]>(
    SEED_LOGS.slice(0, 8).map((l) => ({ id: lid++, stamp: nowStamp(), ...l })),
  );
  const seedIdx = useRef(8);

  useEffect(() => {
    const timer = setInterval(() => {
      const next = SEED_LOGS[seedIdx.current % SEED_LOGS.length];
      seedIdx.current++;
      setLogs((prev) => {
        const updated = [...prev, { id: lid++, stamp: nowStamp(), ...next }];
        return updated.slice(-14);
      });
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  const tagColor: Record<string, string> = {
    "[AUTH]": "#00d4ff",
    "[NET]": "#00ff9f",
    "[ALERT]": "#ff0033",
    "[INFO]": "#a0a0a0",
  };

  return (
    <div
      className="fixed left-0 top-1/4 w-64 h-96 overflow-hidden z-0 pointer-events-none select-none"
      style={{ opacity: 0.08 }}
    >
      <div className="flex flex-col gap-0.5 p-2">
        {logs.map((log) => (
          <div
            key={log.id}
            className="flex gap-1.5 font-mono text-xs leading-tight"
          >
            <span style={{ color: "#555", flexShrink: 0 }}>{log.stamp}</span>
            <span
              style={{ color: tagColor[log.tag] ?? "#00ff9f", flexShrink: 0 }}
            >
              {log.tag}
            </span>
            <span style={{ color: "#00ff9f" }}>{log.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

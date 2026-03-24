import { Terminal } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Line = { type: "input" | "output" | "error"; text: string };

const COMMANDS: Record<string, string[]> = {
  help: [
    "Available commands:",
    "  help      - Show available commands",
    "  about     - About Sajin Joseph",
    "  skills    - List top skills",
    "  projects  - List projects",
    "  contact   - Contact information",
    "  clear     - Clear terminal",
  ],
  about: [
    "[PROFILE LOADED] ────────────────────────────",
    "  Name    : Sajin Joseph",
    "  Role    : Cybersecurity Engineer | SOC Analyst | Threat Hunter",
    "  Exp     : 3+ years hands-on cybersecurity",
    "  Loc     : Kerala, India",
    "  Focus   : SIEM, EDR, Network Security, Incident Response",
    "  Status  : Available for Security Engineering roles",
    "──────────────────────────────────────────────",
  ],
  skills: [
    "[SKILLS MATRIX] ──────────────────────────────",
    "  [+] Firewall  : FortiGate, Sophos XG, Check Point, Palo Alto",
    "  [+] SIEM      : Wazuh, IDS/IPS",
    "  [+] EDR/XDR   : CrowdStrike, Sophos, TrendMicro, Carbon Black",
    "  [+] Identity  : Windows AD, Azure Entra ID, Cisco ISE",
    "  [+] Vuln Mgmt : Qualys, Nessus, Nmap, Burp Suite",
    "  [+] Cloud     : Azure, AWS, Microsoft 365",
    "  [+] OS        : Windows, Kali Linux, Ubuntu",
    "──────────────────────────────────────────────",
  ],
  projects: [
    "[PROJECTS] ───────────────────────────────────",
    "  [1] Penetration Testing Lab (Kali + Metasploitable)",
    "  [2] Malware Development & Analysis Lab",
    "  [3] Security Monitoring Lab (Wazuh + EVE-NG)",
    "  [4] Network Security for Critical Environments",
    "  [5] AI-Enhanced SIEM Integration",
    "──────────────────────────────────────────────",
  ],
  contact: [
    "[CONTACT INFO] ───────────────────────────────",
    "  Email    : sajinjoseph363@gmail.com",
    "  LinkedIn : linkedin.com/in/sajin-joseph-9471a9254",
    "  Phone    : +91 7994247021",
    "  Location : Kerala, India",
    "──────────────────────────────────────────────",
  ],
};

export default function HackerTerminal() {
  const [lines, setLines] = useState<Line[]>([
    {
      type: "output",
      text: "[SYSTEM ONLINE] Sajin Joseph Security Terminal v1.0",
    },
    { type: "output", text: "Type 'help' for available commands." },
    { type: "output", text: "" },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const linesCount = lines.length;

  // biome-ignore lint/correctness/useExhaustiveDependencies: linesCount triggers scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [linesCount]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    const newLines: Line[] = [...lines, { type: "input", text: `> ${cmd}` }];

    if (trimmed === "clear") {
      setLines([
        { type: "output", text: "[SYSTEM ONLINE] Terminal cleared." },
        { type: "output", text: "" },
      ]);
    } else if (trimmed === "") {
      setLines([...newLines]);
    } else if (COMMANDS[trimmed]) {
      setLines([
        ...newLines,
        ...COMMANDS[trimmed].map((t) => ({ type: "output" as const, text: t })),
        { type: "output", text: "" },
      ]);
    } else {
      setLines([
        ...newLines,
        {
          type: "error",
          text: `Command not found: '${trimmed}'. Type 'help' for options.`,
        },
        { type: "output", text: "" },
      ]);
    }

    if (trimmed) {
      setHistory((prev) => [trimmed, ...prev.slice(0, 49)]);
    }
    setHistoryIdx(-1);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const idx = Math.min(historyIdx + 1, history.length - 1);
      setHistoryIdx(idx);
      setInput(history[idx] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const idx = Math.max(historyIdx - 1, -1);
      setHistoryIdx(idx);
      setInput(idx === -1 ? "" : history[idx]);
    }
  };

  return (
    <div
      className="cyber-card rounded-lg overflow-hidden"
      style={{
        borderColor: "oklch(0.87 0.28 145 / 0.5)",
        boxShadow: "0 0 25px oklch(0.87 0.28 145 / 0.2)",
      }}
      data-ocid="terminal.panel"
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[oklch(0.11_0.02_240)] border-b border-[oklch(0.22_0.04_240)]">
        <div className="w-3 h-3 rounded-full bg-red-500/70" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
        <div
          className="w-3 h-3 rounded-full"
          style={{ background: "oklch(0.87 0.28 145 / 0.7)" }}
        />
        <div className="flex items-center gap-1.5 ml-3">
          <Terminal
            className="w-3.5 h-3.5"
            style={{ color: "oklch(0.87 0.28 145)" }}
          />
          <span
            className="font-mono text-xs"
            style={{ color: "oklch(0.87 0.28 145)" }}
          >
            sajin@security:~$
          </span>
        </div>
      </div>

      {/* Terminal body - using label wrapping for click-to-focus */}
      <label
        htmlFor="terminal-input"
        className="bg-[oklch(0.07_0.015_240)] p-4 h-80 overflow-y-auto font-mono text-sm cursor-text block"
      >
        {lines.map((line, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: terminal lines are append-only
            key={i}
            className="leading-relaxed whitespace-pre-wrap"
            style={{
              color:
                line.type === "input"
                  ? "oklch(0.84 0.15 205)"
                  : line.type === "error"
                    ? "oklch(0.65 0.2 25)"
                    : "oklch(0.87 0.28 145)",
            }}
          >
            {line.text || "\u00a0"}
          </div>
        ))}
        {/* Input line */}
        <div className="flex items-center gap-1 mt-1">
          <span
            style={{ color: "oklch(0.84 0.15 205)" }}
            className="font-mono text-sm"
          >
            &gt;
          </span>
          <input
            id="terminal-input"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none border-none font-mono text-sm"
            style={{
              color: "oklch(0.87 0.28 145)",
              caretColor: "oklch(0.87 0.28 145)",
            }}
            spellCheck={false}
            autoComplete="off"
            aria-label="Terminal input"
            data-ocid="terminal.input"
          />
        </div>
        <div ref={bottomRef} />
      </label>
    </div>
  );
}

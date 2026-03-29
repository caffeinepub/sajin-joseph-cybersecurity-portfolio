import { useEffect, useRef, useState } from "react";

interface OutputLine {
  id: number;
  text: string;
  type: "info" | "ok" | "warn" | "alert" | "plain" | "prompt" | "header";
  delay?: number;
}

const COMMANDS = [
  "help",
  "about",
  "skills",
  "projects",
  "contact",
  "certs",
  "clear",
  "whoami",
  "scan --demo",
];

let idCounter = 0;
function mkLine(
  text: string,
  type: OutputLine["type"] = "plain",
  delay = 0,
): OutputLine {
  return { id: idCounter++, text, type, delay };
}

function getCommandOutput(cmd: string): OutputLine[] {
  const c = cmd.trim().toLowerCase();
  switch (c) {
    case "help":
      return [
        mkLine("Available commands:", "header"),
        mkLine("  help         → List all commands", "ok"),
        mkLine("  about        → Profile summary", "ok"),
        mkLine("  skills       → Technical skills list", "ok"),
        mkLine("  projects     → Cybersecurity projects", "ok"),
        mkLine("  contact      → Contact information", "ok"),
        mkLine("  certs        → Certifications", "ok"),
        mkLine("  whoami       → Identity card", "ok"),
        mkLine("  scan --demo  → Run simulated vulnerability scan", "ok"),
        mkLine("  clear        → Clear terminal", "ok"),
      ];
    case "about":
      return [
        mkLine("[INFO] Loading profile...", "info"),
        mkLine("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", "plain"),
        mkLine("  Name     : Sajin Joseph", "ok"),
        mkLine("  Role     : Cybersecurity Engineer", "ok"),
        mkLine("  Focus    : Network & Infrastructure Security", "ok"),
        mkLine("  Teams    : Red Team | Blue Team | SOC", "ok"),
        mkLine("  Location : India", "ok"),
        mkLine("  Exp      : 3+ Years Hands-On Labs & Projects", "ok"),
        mkLine("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", "plain"),
        mkLine("[OK] Profile loaded successfully.", "ok"),
      ];
    case "skills":
      return [
        mkLine("[INFO] Fetching skill matrix...", "info"),
        mkLine("● Network Security & Firewalls", "ok"),
        mkLine("● SIEM / IDS / IPS", "ok"),
        mkLine("● EDR / Endpoint Security", "ok"),
        mkLine("● Vulnerability Assessment & Hardening", "ok"),
        mkLine("● Cloud Security (AWS / Azure)", "ok"),
        mkLine("● Identity & Access Management", "ok"),
        mkLine("● Web Application Security (OWASP)", "ok"),
        mkLine("● OT / ICS / SCADA Security", "ok"),
        mkLine("● IoT Security", "ok"),
        mkLine("● Incident Response & Threat Hunting", "ok"),
        mkLine("[OK] 10 skills enumerated.", "ok"),
      ];
    case "projects":
      return [
        mkLine("[INFO] Loading project index...", "info"),
        mkLine(
          "[01] Advanced Web Application Pentest Lab      [Web, OWASP]",
          "ok",
        ),
        mkLine(
          "[02] Secure API Testing Lab                    [API, Web]",
          "ok",
        ),
        mkLine(
          "[03] Enterprise Network Pentest Simulation     [Network, SIEM]",
          "ok",
        ),
        mkLine("[04] Vulnerability Assessment & Hardening      [Infra]", "ok"),
        mkLine(
          "[05] Industrial Control System Security Sim    [OT, SCADA]",
          "ok",
        ),
        mkLine(
          "[06] OT Network Segmentation & Monitoring      [OT, Network]",
          "ok",
        ),
        mkLine("[07] IoT Device Security Assessment            [IoT]", "ok"),
        mkLine("[08] Smart Environment Security Lab            [IoT]", "ok"),
        mkLine(
          "[09] Red Team vs Blue Team Simulation          [SOC, Blue Team]",
          "ok",
        ),
        mkLine("[OK] 9 projects found. Scrolling to projects section...", "ok"),
      ];
    case "contact":
      return [
        mkLine("[INFO] Loading contact channels...", "info"),
        mkLine("  Email    : sajinjoseph363@gmail.com", "ok"),
        mkLine("  Phone    : +91 799 424 7021", "ok"),
        mkLine("  LinkedIn : linkedin.com/in/sajin-joseph-9471a9254", "ok"),
        mkLine("[OK] Scrolling to contact section...", "ok"),
      ];
    case "certs":
      return [
        mkLine("[INFO] Fetching certification registry...", "info"),
        mkLine("  [✓] Certified Ethical Hacker (CEH)", "ok"),
        mkLine("  [✓] Qualys Vulnerability Management", "ok"),
        mkLine("  [✓] CompTIA Security+", "ok"),
        mkLine("  [✓] TryHackMe — Top 2%", "ok"),
        mkLine("  [✓] HackTheBox — Pro Hacker", "ok"),
        mkLine("  [✓] ISC2 Certified in Cybersecurity (CC)", "ok"),
        mkLine("  [~] SSCP — In Progress", "warn"),
        mkLine("[OK] 6 active certifications.", "ok"),
      ];
    case "whoami":
      return [
        mkLine("┌─────────────────────────────────────────┐", "plain"),
        mkLine("│   user   : sajin.joseph                 │", "ok"),
        mkLine("│   role   : Cybersecurity Engineer       │", "ok"),
        mkLine("│   team   : Red Team | Blue Team         │", "ok"),
        mkLine("│   access : CLASSIFIED - LEVEL 5         │", "warn"),
        mkLine("│   status : ACTIVE                       │", "ok"),
        mkLine("└─────────────────────────────────────────┘", "plain"),
      ];
    case "scan --demo":
      return []; // handled separately with animation
    case "clear":
      return []; // handled separately
    default:
      return [
        mkLine(`[ALERT] Command not found: ${cmd}`, "alert"),
        mkLine("[INFO] Type 'help' to see available commands.", "info"),
      ];
  }
}

const SCAN_LINES = [
  {
    text: "[INFO] Initializing vulnerability scanner...",
    type: "info" as const,
    delay: 0,
  },
  {
    text: "[INFO] Target: portfolio-system (localhost)",
    type: "info" as const,
    delay: 400,
  },
  {
    text: "[OK]   Network interface detected",
    type: "ok" as const,
    delay: 800,
  },
  { text: "[OK]   Scanning ports 1-1024...", type: "ok" as const, delay: 1200 },
  { text: "[OK]   Port 22  (SSH)   → OPEN", type: "ok" as const, delay: 1600 },
  { text: "[OK]   Port 80  (HTTP)  → OPEN", type: "ok" as const, delay: 1900 },
  { text: "[OK]   Port 443 (HTTPS) → OPEN", type: "ok" as const, delay: 2200 },
  {
    text: "[WARN] Port 8080 detected — non-standard HTTP",
    type: "warn" as const,
    delay: 2600,
  },
  {
    text: "[INFO] Checking SSL/TLS configuration...",
    type: "info" as const,
    delay: 3000,
  },
  {
    text: "[WARN] TLS 1.0 supported — deprecated protocol",
    type: "warn" as const,
    delay: 3400,
  },
  {
    text: "[INFO] Running OWASP checks...",
    type: "info" as const,
    delay: 3800,
  },
  {
    text: "[ALERT] SQL Injection vector detected in /search endpoint",
    type: "alert" as const,
    delay: 4300,
  },
  {
    text: "[ALERT] Missing Content-Security-Policy header",
    type: "alert" as const,
    delay: 4700,
  },
  {
    text: "[WARN] Outdated dependency: openssl 1.1.1 → upgrade to 3.x",
    type: "warn" as const,
    delay: 5100,
  },
  {
    text: "[OK]   No exposed credentials found",
    type: "ok" as const,
    delay: 5500,
  },
  { text: "[OK]   Firewall rules verified", type: "ok" as const, delay: 5800 },
  {
    text: "─────────────────────────────────────────────",
    type: "plain" as const,
    delay: 6200,
  },
  {
    text: "[INFO] Scan complete. 2 CRITICAL | 3 WARNINGS",
    type: "info" as const,
    delay: 6400,
  },
  {
    text: "[OK]   Report saved to /tmp/scan-report.txt",
    type: "ok" as const,
    delay: 6700,
  },
];

function LineColor({ line }: { line: OutputLine }) {
  const colorMap: Record<OutputLine["type"], string> = {
    info: "text-cyan-400",
    ok: "text-green-400",
    warn: "text-yellow-400",
    alert: "text-red-400",
    plain: "text-gray-400",
    prompt: "text-green-300",
    header: "text-green-300 font-bold",
  };
  return (
    <div className={`font-mono text-xs leading-relaxed ${colorMap[line.type]}`}>
      {line.text}
    </div>
  );
}

function ScanProgressBar({ progress }: { progress: number }) {
  const filled = Math.round(progress / 5);
  return (
    <div className="font-mono text-xs text-green-400 my-1">
      <span>[SCAN] </span>
      <span className="inline-block">
        [{"█".repeat(filled)}
        {"░".repeat(20 - filled)}] {progress}%
      </span>
    </div>
  );
}

export default function InteractiveTerminal() {
  const [lines, setLines] = useState<OutputLine[]>([
    mkLine("[OK]   Portfolio Terminal v2.0 initialized", "ok"),
    mkLine("[INFO] Type 'help' for available commands.", "info"),
    mkLine("[INFO] Use ↑/↓ arrows for command history.", "info"),
    mkLine("─────────────────────────────────────────────", "plain"),
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [suggestion, setSuggestion] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when lines or scan progress changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally reacting to lines/scan changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines, scanProgress]);

  const updateSuggestion = (val: string) => {
    if (val.length < 2) {
      setSuggestion("");
      return;
    }
    const match = COMMANDS.find((c) => c.startsWith(val) && c !== val);
    setSuggestion(match ? match.slice(val.length) : "");
  };

  const addLines = (newLines: OutputLine[]) => {
    setLines((prev) => [...prev, ...newLines]);
  };

  const runScan = () => {
    if (scanning) return;
    setScanning(true);
    setScanProgress(0);
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 5;
      setScanProgress(progress);
      if (progress >= 100) clearInterval(progressInterval);
    }, 350);

    for (const { text, type, delay } of SCAN_LINES) {
      setTimeout(() => {
        setLines((prev) => [...prev, mkLine(text, type)]);
      }, delay);
    }

    setTimeout(() => {
      setScanning(false);
      clearInterval(progressInterval);
    }, 7200);
  };

  const scrollToSection = (id: string) => {
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 800);
  };

  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    addLines([mkLine(`root@portfolio:~$ ${trimmed}`, "prompt")]);
    setHistory((prev) => [trimmed, ...prev]);
    setHistoryIdx(-1);

    if (trimmed.toLowerCase() === "clear") {
      setLines([mkLine("[OK]   Terminal cleared.", "ok")]);
      return;
    }

    if (trimmed.toLowerCase() === "scan --demo") {
      addLines([mkLine("[INFO] Launching demo vulnerability scan...", "info")]);
      runScan();
      return;
    }

    const output = getCommandOutput(trimmed);
    addLines(output);

    const l = trimmed.toLowerCase();
    if (l === "projects") scrollToSection("projects");
    if (l === "skills") scrollToSection("skills");
    if (l === "contact") scrollToSection("contact");
    if (l === "about") scrollToSection("home");
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeCommand(input);
      setInput("");
      setSuggestion("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(historyIdx + 1, history.length - 1);
      setHistoryIdx(next);
      if (history[next]) {
        setInput(history[next]);
        updateSuggestion(history[next]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.max(historyIdx - 1, -1);
      setHistoryIdx(next);
      const val = next === -1 ? "" : history[next];
      setInput(val);
      updateSuggestion(val);
    } else if (e.key === "Tab") {
      e.preventDefault();
      if (suggestion) {
        setInput(input + suggestion);
        setSuggestion("");
      }
    }
  };

  const QUICK_CMDS = ["help", "about", "skills", "projects", "scan --demo"];

  const focusInput = () => inputRef.current?.focus();

  return (
    <div
      className="terminal-flicker flex flex-col font-mono text-xs"
      style={{
        background: "#0a0a0a",
        border: "1px solid oklch(0.87 0.28 145 / 0.7)",
        borderRadius: 6,
        boxShadow:
          "0 0 40px oklch(0.87 0.28 145 / 0.2), 0 0 80px oklch(0.87 0.28 145 / 0.08)",
      }}
    >
      {/* Title bar */}
      <div
        className="flex items-center gap-2 px-4 py-2 border-b"
        style={{
          borderColor: "oklch(0.87 0.28 145 / 0.3)",
          background: "oklch(0.12 0.025 240)",
        }}
      >
        <span className="w-3 h-3 rounded-full bg-red-500" />
        <span className="w-3 h-3 rounded-full bg-yellow-500" />
        <span
          className="w-3 h-3 rounded-full"
          style={{ background: "oklch(0.87 0.28 145)" }}
        />
        <span
          className="ml-3 text-xs font-mono"
          style={{ color: "oklch(0.87 0.28 145 / 0.7)" }}
        >
          root@portfolio:~$ — interactive terminal
        </span>
      </div>

      {/* Output area — clicking focuses input; keyboard handled by input element */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: output area click delegates to input focus */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-0.5 cursor-text"
        style={{ minHeight: 320, maxHeight: 420 }}
        onClick={focusInput}
        data-ocid="terminal.panel"
      >
        {lines.map((l) => (
          <LineColor key={l.id} line={l} />
        ))}
        {scanning && <ScanProgressBar progress={scanProgress} />}
        <div ref={bottomRef} />
      </div>

      {/* Input row */}
      <div
        className="flex items-center gap-2 px-4 py-3 border-t"
        style={{ borderColor: "oklch(0.87 0.28 145 / 0.2)" }}
      >
        <span
          className="font-mono text-xs shrink-0"
          style={{ color: "oklch(0.87 0.28 145)" }}
        >
          root@portfolio:~$
        </span>
        <div className="relative flex-1 flex items-center">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              updateSuggestion(e.target.value);
            }}
            onKeyDown={handleKey}
            className="w-full bg-transparent outline-none font-mono text-xs z-10 relative"
            style={{
              color: "oklch(0.87 0.28 145)",
              caretColor: "oklch(0.87 0.28 145)",
            }}
            placeholder="type a command..."
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            data-ocid="terminal.input"
          />
          {/* Ghost suggestion */}
          {suggestion && (
            <span
              className="absolute left-0 pointer-events-none font-mono text-xs"
              style={{
                color: "oklch(0.87 0.28 145 / 0.3)",
                paddingLeft: `${input.length}ch`,
              }}
            >
              {suggestion}
            </span>
          )}
        </div>
      </div>

      {/* Mobile quick-command buttons */}
      <div className="sm:hidden flex flex-wrap gap-2 px-4 pb-3">
        {QUICK_CMDS.map((cmd) => (
          <button
            key={cmd}
            type="button"
            onClick={() => executeCommand(cmd)}
            className="text-xs font-mono px-3 py-1 rounded"
            style={{
              background: "oklch(0.87 0.28 145 / 0.12)",
              color: "oklch(0.87 0.28 145)",
              border: "1px solid oklch(0.87 0.28 145 / 0.4)",
            }}
            data-ocid="terminal.button"
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* Disclaimer */}
      <div
        className="px-4 py-2 text-center"
        style={{ borderTop: "1px solid oklch(0.87 0.28 145 / 0.1)" }}
      >
        <span
          className="text-xs font-mono"
          style={{ color: "oklch(0.6 0.04 240)" }}
        >
          ⚠ Simulated terminal interface for cybersecurity portfolio
          demonstration purposes only.
        </span>
      </div>
    </div>
  );
}

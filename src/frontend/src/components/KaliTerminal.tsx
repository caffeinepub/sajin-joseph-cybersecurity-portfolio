import { useCallback, useEffect, useRef, useState } from "react";

type LineType = "input" | "output" | "error" | "prompt" | "system";
type Line = { type: LineType; text: string; id: number };

let lineId = 0;
const mkLine = (type: LineType, text: string): Line => ({
  type,
  text,
  id: lineId++,
});

const BANNER = [
  "┌──────────────────────────────────────────────────────────────┐",
  "│                  Kali Linux Terminal v2024.1                 │",
  "│           GNU/Linux - Penetration Testing Platform           │",
  "└──────────────────────────────────────────────────────────────┘",
  "",
  `  Last login: ${new Date().toLocaleString()} from 192.168.1.1`,
  "",
];

const COMMANDS: Record<string, (args: string[]) => string[]> = {
  help: () => [
    "┌─ Available Commands ────────────────────────────────────────┐",
    "│  System   : uname, whoami, id, hostname, uptime, pwd       │",
    "│  Network  : ifconfig, netstat, ping, nmap, traceroute      │",
    "│  Files    : ls, cat, find, locate, file                    │",
    "│  Security : nmap, hydra, sqlmap, nikto, burp, metasploit   │",
    "│  Tools    : wireshark, aircrack, hashcat, john, gobuster   │",
    "│  Info     : about, skills, projects, contact               │",
    "│  Shell    : clear, history, echo, date, exit               │",
    "└─────────────────────────────────────────────────────────────┘",
  ],

  uname: (args) =>
    args.includes("-a")
      ? [
          "Linux kali 6.5.0-kali3-amd64 #1 SMP PREEMPT_DYNAMIC Kali 6.5.6+kali2 x86_64 GNU/Linux",
        ]
      : ["Linux"],

  whoami: () => ["root"],

  id: () => ["uid=0(root) gid=0(root) groups=0(root)"],

  hostname: () => ["kali"],

  uptime: () => [
    ` ${new Date().toLocaleTimeString()} up 13:37,  1 user,  load average: 0.13, 0.37, 0.73`,
  ],

  pwd: () => ["/root"],

  date: () => [new Date().toString()],

  echo: (args) => [args.join(" ")],

  ls: (args) => {
    if (args.includes("-la") || args.includes("-l")) {
      return [
        "total 68",
        `drwx------ 12 root root 4096 ${new Date().toLocaleDateString()} ./`,
        `drwxr-xr-x 19 root root 4096 ${new Date().toLocaleDateString()} ../`,
        "-rw-r--r--  1 root root  571 Jan 31  2024 .bashrc",
        "drwxr-xr-x  2 root root 4096 Mar 15 09:23 Desktop/",
        "drwxr-xr-x  4 root root 4096 Mar 15 11:45 Documents/",
        "drwxr-xr-x  2 root root 4096 Mar 15 08:12 Downloads/",
        "-rwxr-xr-x  1 root root 2048 Mar 14 22:11 pentest.sh*",
        "-rw-------  1 root root  512 Mar 15 13:37 .secret_notes",
        "drwxr-xr-x  3 root root 4096 Mar 10 16:22 tools/",
      ];
    }
    return ["Desktop  Documents  Downloads  pentest.sh  tools"];
  },

  cat: (args) => {
    const f = args[0];
    if (!f)
      return ["cat: missing operand", "Try 'cat --help' for more information."];
    if (f === "pentest.sh")
      return [
        "#!/bin/bash",
        "# Pentest Automation Script",
        "TARGET=$1",
        'echo "[*] Starting recon on $TARGET"',
        "nmap -sV -sC -O $TARGET",
        'echo "[*] Running Nikto..."',
        "nikto -h $TARGET",
        'echo "[*] Done."',
      ];
    if (f === ".bashrc")
      return [
        "# ~/.bashrc: executed by bash for non-login shells.",
        "alias ll='ls -alF'",
        "alias la='ls -A'",
        "export PATH=$PATH:/usr/local/bin",
        "PS1='\\[\\e[01;32m\\]root@kali\\[\\e[0m\\]:\\[\\e[01;34m\\]\\w\\[\\e[0m\\]# '",
      ];
    return [`cat: ${f}: No such file or directory`];
  },

  find: (args) => {
    if (args.length === 0)
      return [
        ".",
        "./Desktop",
        "./Documents",
        "./Downloads",
        "./tools",
        "./pentest.sh",
      ];
    const pattern = args.find((_a, i) => args[i - 1] === "-name") || "*";
    return [`./tools/${pattern}`, `./Documents/${pattern}`];
  },

  ifconfig: () => [
    "eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500",
    "        inet 192.168.1.105  netmask 255.255.255.0  broadcast 192.168.1.255",
    "        inet6 fe80::a00:27ff:febc:d9c2  prefixlen 64  scopeid 0x20<link>",
    "        ether 08:00:27:bc:d9:c2  txqueuelen 1000  (Ethernet)",
    "        RX packets 2847  bytes 2341024 (2.2 MiB)",
    "        TX packets 1923  bytes 302847 (295.7 KiB)",
    "",
    "lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536",
    "        inet 127.0.0.1  netmask 255.0.0.0",
    "        inet6 ::1  prefixlen 128  scopeid 0x10<host>",
    "        loop  txqueuelen 1000  (Local Loopback)",
  ],

  netstat: () => [
    "Active Internet connections (only servers)",
    "Proto Recv-Q Send-Q Local Address           Foreign Address         State",
    "tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN",
    "tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN",
    "tcp        0      0 0.0.0.0:443             0.0.0.0:*               LISTEN",
    "tcp6       0      0 :::22                   :::*                    LISTEN",
    "udp        0      0 0.0.0.0:68              0.0.0.0:*",
  ],

  ping: (args) => {
    const host = args[0] || "localhost";
    return [
      `PING ${host} (192.168.1.1) 56(84) bytes of data.`,
      `64 bytes from ${host} (192.168.1.1): icmp_seq=1 ttl=64 time=0.421 ms`,
      `64 bytes from ${host} (192.168.1.1): icmp_seq=2 ttl=64 time=0.389 ms`,
      `64 bytes from ${host} (192.168.1.1): icmp_seq=3 ttl=64 time=0.412 ms`,
      `64 bytes from ${host} (192.168.1.1): icmp_seq=4 ttl=64 time=0.398 ms`,
      "",
      `--- ${host} ping statistics ---`,
      "4 packets transmitted, 4 received, 0% packet loss, time 3006ms",
      "rtt min/avg/max/mdev = 0.389/0.405/0.421/0.012 ms",
    ];
  },

  nmap: (args) => {
    const target = args.find((a) => !a.startsWith("-")) || "192.168.1.1";
    return [
      `Starting Nmap 7.94SVN ( https://nmap.org ) at ${new Date().toLocaleString()}`,
      `Nmap scan report for ${target}`,
      "Host is up (0.00092s latency).",
      "Not shown: 997 filtered tcp ports (no-response)",
      "PORT    STATE SERVICE    VERSION",
      "22/tcp  open  ssh        OpenSSH 8.9p1 Ubuntu",
      "80/tcp  open  http       Apache httpd 2.4.52",
      "443/tcp open  ssl/https  nginx 1.18.0",
      "3306/tcp open mysql      MySQL 8.0.32",
      "",
      "Service detection performed. Please report any incorrect results.",
      "Nmap done: 1 IP address (1 host up) scanned in 12.34 seconds",
    ];
  },

  traceroute: (args) => {
    const host = args[0] || "8.8.8.8";
    return [
      `traceroute to ${host} (${host}), 30 hops max, 60 byte packets`,
      " 1  gateway (192.168.1.1)  1.234 ms  1.122 ms  1.089 ms",
      " 2  10.0.0.1 (10.0.0.1)  12.456 ms  12.234 ms  11.998 ms",
      " 3  72.14.215.148 (72.14.215.148)  18.234 ms  17.899 ms  18.011 ms",
      " 4  * * *",
      " 5  8.8.8.8 (8.8.8.8)  22.341 ms  21.987 ms  22.123 ms",
    ];
  },

  nikto: (args) => {
    const host = args.find((a) => !a.startsWith("-")) || "target";
    return [
      "- Nikto v2.1.6",
      "---------------------------------------------------------------------------",
      "+ Target IP:          192.168.1.100",
      `+ Target Hostname:    ${host}`,
      "+ Target Port:        80",
      `+ Start Time:         ${new Date().toLocaleString()}`,
      "---------------------------------------------------------------------------",
      "+ Server: Apache/2.4.52 (Ubuntu)",
      "+ /: The anti-clickjacking X-Frame-Options header is not present.",
      "+ /: The X-Content-Type-Options header is not set.",
      "+ /admin/: Admin login page/section found.",
      "+ /phpinfo.php: PHP info page detected.",
      "+ OSVDB-3233: /icons/README: Apache default file found.",
      "+ 7915 requests: 0 error(s) and 5 item(s) reported on remote host",
      `+ End Time: ${new Date().toLocaleString()} (45 seconds)`,
    ];
  },

  hydra: (_args) => [
    "Hydra v9.4 (c) 2022 by van Hauser/THC & David Maciejak",
    "",
    "[INFO] Several tasks may be disabled. Run without -t or reduce -t value.",
    "[DATA] max 16 tasks per 1 server, overall 16 tasks, 14344399 login tries",
    "[DATA] attacking ssh://192.168.1.100:22/",
    "[22][ssh] host: 192.168.1.100   login: admin   password: password123",
    "1 of 1 target successfully completed, 1 valid password found",
    "[WARNING] Writing restore file because 1 final worker slots were occupied at shutdown",
  ],

  sqlmap: (_args) => [
    "        ___",
    "       __H__",
    " ___ ___[.]_____ ___ ___  {1.7.6#stable}",
    "|_ -| . [,]     | .'| . |",
    "|___|_  [.]_|_|_|__,|  _|",
    "      |_|V...       |_|   https://sqlmap.org",
    "",
    `[*] starting @ ${new Date().toLocaleTimeString()}`,
    "[INFO] testing connection to the target URL",
    "[INFO] testing if the target URL content is stable",
    "[INFO] target URL content is stable",
    "[WARNING] heuristic (basic) test shows that GET parameter 'id' might be injectable",
    "[INFO] testing for SQL injection on GET parameter 'id'",
    "[INFO] GET parameter 'id' appears to be 'AND boolean-based blind' injectable",
    "[INFO] the back-end DBMS is MySQL",
    "back-end DBMS: MySQL >= 5.0.12",
  ],

  metasploit: () => [
    "       =[ metasploit v6.3.44-dev                          ]",
    "+ -- --=[ 2376 exploits - 1232 auxiliary - 416 post       ]",
    "+ -- --=[ 1388 payloads - 46 encoders - 11 nops           ]",
    "+ -- --=[ 9 evasion                                        ]",
    "",
    "Metasploit tip: Use sessions -1 to interact with the last opened session",
    "",
    "msf6 > ",
  ],

  burp: () => [
    "[*] Starting Burp Suite Professional v2023.10.3.4",
    "[*] Loading extensions...",
    "[*] Active Scanner: enabled",
    "[*] Proxy listener started on 127.0.0.1:8080",
    "[*] Burp Suite is ready.",
  ],

  wireshark: () => [
    "[*] Launching Wireshark 4.2.0...",
    "[*] Capturing on 'eth0'",
    "[*] Interface: eth0 (192.168.1.105)",
    "[INFO] Use Ctrl+C to stop capture.",
  ],

  "aircrack-ng": (_args) => [
    "Aircrack-ng 1.7",
    "",
    "[00:01:23] 13653/14344392 keys tested (8012.34 k/s)",
    "",
    "Time left: 29 minutes, 35 seconds                          0.10%",
    "",
    "                           KEY FOUND! [ rockyou ]",
    "",
    "Master Key     : A1 B2 C3 D4 E5 F6 07 08 09 0A 0B 0C 0D 0E 0F 10",
    "                 11 12 13 14 15 16 17 18 19 1A 1B 1C 1D 1E 1F 20",
  ],

  hashcat: (_args) => [
    "hashcat (v6.2.6) starting...",
    "",
    "CUDA API (CUDA 12.0)",
    "* Device #1: NVIDIA GeForce RTX 3080, 9728/10238 MB, 68MCU",
    "",
    "Dictionary cache hit:",
    "* Filename..: /usr/share/wordlists/rockyou.txt",
    "* Passwords.: 14344385",
    "* Bytes.....: 139921497",
    "",
    "5f4dcc3b5aa765d61d8327deb882cf99:password",
    "",
    "Session..........: hashcat",
    "Status...........: Cracked",
    "Hash.Mode........: 0 (MD5)",
    `Time.Started.....: ${new Date().toLocaleString()}`,
    "Speed.#1.........: 12345.6 MH/s (5.21ms)",
  ],

  john: (_args) => [
    "Using default input encoding: UTF-8",
    "Loaded 1 password hash (sha512crypt, crypt(3) $6$ [SHA512 128/128 AVX 2x])",
    "Cost 1 (iteration count) is 5000 for all loaded hashes",
    "Will run 8 OpenMP threads",
    "Proceeding with single, rules:Single",
    "Press 'q' or Ctrl-C to abort, almost any other key for status",
    "0g 0:00:00:05 DONE 1/3 (2024-03-15 13:37) 0g/s 3523p/s 3523c/s 3523C/s",
    "Proceeding with wordlist:/usr/share/john/password.lst",
    "password123      (root)",
    "1g 0:00:00:12 DONE 2/3 (2024-03-15 13:37) 0.08268g/s 14344p/s",
  ],

  gobuster: (_args) => [
    "===============================================================",
    "Gobuster v3.6",
    "by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)",
    "===============================================================",
    "[+] Url:                     http://192.168.1.100",
    "[+] Method:                  GET",
    "[+] Threads:                 10",
    "[+] Wordlist:                /usr/share/wordlists/dirb/common.txt",
    "[+] Status codes:            200,204,301,302,307,401,403",
    "===============================================================",
    "/admin                (Status: 301) [Size: 318]",
    "/backup               (Status: 200) [Size: 2048]",
    "/config               (Status: 403) [Size: 277]",
    "/index.html           (Status: 200) [Size: 8192]",
    "/login                (Status: 200) [Size: 1337]",
    "/uploads              (Status: 301) [Size: 320]",
    "===============================================================",
    "Finished",
    "===============================================================",
  ],

  about: () => [
    "╔══════════════════════════════════════════════════════════════╗",
    "║               PROFILE: SAJIN JOSEPH                         ║",
    "╠══════════════════════════════════════════════════════════════╣",
    "║  Handle  : sajin@kali                                       ║",
    "║  Role    : Cybersecurity Engineer | SOC Analyst             ║",
    "║  Access  : CLEARANCE LEVEL 5                                ║",
    "║  Exp     : 3+ years offensive & defensive security          ║",
    "║  Loc     : Kerala, India                                    ║",
    "║  Focus   : Penetration Testing, SIEM, Threat Hunting        ║",
    "║  Status  : [ACTIVE] - Available for Security roles          ║",
    "╚══════════════════════════════════════════════════════════════╝",
  ],

  skills: () => [
    "[ARSENAL LOADED] ─────────────────────────────────────────────",
    "  OFFENSIVE  : Kali Linux, Metasploit, Burp Suite, Nmap",
    "  RECON      : Nmap, Nikto, Gobuster, SQLMap, Hydra",
    "  FORENSICS  : Wireshark, Aircrack-ng, John the Ripper",
    "  SIEM/EDR   : Wazuh, CrowdStrike, Sophos, Carbon Black",
    "  FIREWALL   : FortiGate, Sophos XG, Palo Alto, Check Point",
    "  CLOUD      : Azure, AWS, Microsoft 365, Entra ID",
    "  SCRIPTING  : Python, Bash, PowerShell",
    "  OS         : Kali Linux, Ubuntu, Windows Server",
    "───────────────────────────────────────────────────────────────",
  ],

  projects: () => [
    "[MISSIONS LOG] ────────────────────────────────────────────────",
    "  [OP-001] Operation PhantomNet  - Pen Testing Lab     [DONE]",
    "  [OP-002] Operation DarkPulse   - Malware Analysis    [DONE]",
    "  [OP-003] Operation SilentWatch - SIEM Deployment     [DONE]",
    "  [OP-004] Operation GridLock    - Infra Security      [DONE]",
    "  [OP-005] Operation NeuroSIEM   - AI SIEM Integration [DONE]",
    "───────────────────────────────────────────────────────────────",
  ],

  contact: () => [
    "[SECURE CHANNEL] ──────────────────────────────────────────────",
    "  Email    : sajinjoseph363@gmail.com",
    "  LinkedIn : linkedin.com/in/sajin-joseph-9471a9254",
    "  Phone    : +91 7994247021",
    "  Location : Kerala, India",
    "  PGP Key  : 4096R/0xDEADBEEF",
    "───────────────────────────────────────────────────────────────",
  ],

  history: () => [] as string[],
  exit: () => ["[SESSION TERMINATED] Connection closed."],
};

const PROMPT = "root@kali:~# ";

export default function KaliTerminal() {
  const [lines, setLines] = useState<Line[]>(() =>
    BANNER.map((t) => mkLine("system", t)),
  );
  const [input, setInput] = useState("");
  const [displayInput, setDisplayInput] = useState("");
  const [isGlitching, setIsGlitching] = useState(false);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const glitchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const linesLen = lines.length;
  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on new lines
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [linesLen]);

  const triggerGlitch = useCallback(() => {
    setIsGlitching(true);
    if (glitchTimerRef.current) clearTimeout(glitchTimerRef.current);
    glitchTimerRef.current = setTimeout(() => setIsGlitching(false), 300);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInput(val);
    setDisplayInput(val);
    setIsTyping(true);
    triggerGlitch();
    setTimeout(() => setIsTyping(false), 100);
  };

  const runCommand = useCallback(
    (raw: string) => {
      const trimmed = raw.trim();
      const parts = trimmed.split(/\s+/);
      const cmd = parts[0].toLowerCase();
      const args = parts.slice(1);

      const newLines: Line[] = [...lines, mkLine("input", PROMPT + raw)];

      if (cmd === "clear") {
        setLines([mkLine("system", "[CLEARED] Terminal buffer wiped.")]);
        setInput("");
        setDisplayInput("");
        return;
      }

      if (cmd === "history") {
        const histLines = cmdHistory.map((h, i) =>
          mkLine("output", `  ${String(i + 1).padStart(4, " ")}  ${h}`),
        );
        setLines([
          ...newLines,
          mkLine("output", "Command History:"),
          ...histLines,
          mkLine("output", ""),
        ]);
        setInput("");
        setDisplayInput("");
        return;
      }

      if (trimmed === "") {
        setLines([...newLines]);
        setInput("");
        setDisplayInput("");
        return;
      }

      const handler = COMMANDS[cmd];
      if (handler) {
        const output = handler(args);
        setLines([
          ...newLines,
          ...output.map((t) => mkLine("output", t)),
          mkLine("output", ""),
        ]);
      } else {
        setLines([
          ...newLines,
          mkLine("error", `-bash: ${cmd}: command not found`),
          mkLine("output", ""),
        ]);
      }

      if (trimmed) setCmdHistory((h) => [trimmed, ...h.slice(0, 99)]);
      setHistIdx(-1);
      setInput("");
      setDisplayInput("");
    },
    [lines, cmdHistory],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      runCommand(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const idx = Math.min(histIdx + 1, cmdHistory.length - 1);
      setHistIdx(idx);
      const val = cmdHistory[idx] ?? "";
      setInput(val);
      setDisplayInput(val);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const idx = Math.max(histIdx - 1, -1);
      setHistIdx(idx);
      const val = idx === -1 ? "" : cmdHistory[idx];
      setInput(val);
      setDisplayInput(val);
    } else if (e.key === "Tab") {
      e.preventDefault();
      const partial = input.split(" ")[0].toLowerCase();
      const matches = Object.keys(COMMANDS).filter((c) =>
        c.startsWith(partial),
      );
      if (matches.length === 1) {
        setInput(matches[0]);
        setDisplayInput(matches[0]);
      } else if (matches.length > 1) {
        setLines((prev) => [
          ...prev,
          mkLine("input", PROMPT + input),
          mkLine("output", matches.join("  ")),
          mkLine("output", ""),
        ]);
      }
    }
  };

  const getColor = (type: LineType) => {
    switch (type) {
      case "input":
        return "#00ff9f";
      case "error":
        return "#ff0033";
      case "system":
        return "#00b8ff";
      default:
        return "#c8ffd0";
    }
  };

  return (
    <div
      className="relative rounded-lg overflow-hidden"
      style={{
        border: "1px solid #00ff9f55",
        boxShadow: "0 0 40px #00ff9f22, 0 0 80px #00ff9f0a",
        background: "#0a0f0a",
      }}
    >
      {/* Title bar */}
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{
          background: "#0d1a0d",
          borderBottom: "1px solid #00ff9f33",
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ background: "#ff0033" }}
          />
          <div
            className="w-3 h-3 rounded-full"
            style={{ background: "#ffcc00" }}
          />
          <div
            className="w-3 h-3 rounded-full"
            style={{ background: "#00ff9f" }}
          />
          <span
            className="font-mono text-xs ml-3"
            style={{ color: "#00ff9f", letterSpacing: "0.1em" }}
          >
            root@kali: ~
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs" style={{ color: "#00ff9f66" }}>
            kali linux 6.5.0
          </span>
          {isGlitching && (
            <span
              className="font-mono text-xs animate-pulse"
              style={{ color: "#ff0033" }}
            >
              GLITCH
            </span>
          )}
        </div>
      </div>

      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
        }}
      />

      {/* Terminal body */}
      <label
        htmlFor="kali-terminal-input"
        className="relative block cursor-text"
        style={{ background: "#080e08" }}
      >
        <div
          className="p-4 overflow-y-auto font-mono text-sm"
          style={{ height: "480px", lineHeight: "1.6" }}
        >
          {lines.map((line) => (
            <div
              key={line.id}
              className="whitespace-pre-wrap break-all"
              style={{ color: getColor(line.type) }}
            >
              {line.text || "\u00a0"}
            </div>
          ))}

          {/* Input line */}
          <div
            className={`flex items-center mt-1 ${isGlitching ? "kali-glitch-line" : ""}`}
          >
            <span
              style={{ color: "#00ff9f", userSelect: "none" }}
              className="font-mono text-sm flex-shrink-0"
            >
              {PROMPT}
            </span>
            <div className="relative flex-1">
              <input
                id="kali-terminal-input"
                ref={inputRef}
                value={displayInput}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent outline-none border-none font-mono text-sm"
                style={{
                  color: "#00ff9f",
                  caretColor: "#00ff9f",
                  textShadow: isGlitching
                    ? "2px 0 #ff0033, -2px 0 #00b8ff"
                    : "0 0 8px #00ff9f88",
                }}
                spellCheck={false}
                autoComplete="off"
                autoCorrect="off"
                aria-label="Kali terminal input"
                data-ocid="kali.terminal.input"
              />
            </div>
          </div>
          <div ref={bottomRef} />
        </div>
      </label>

      {/* Bottom status bar */}
      <div
        className="flex items-center justify-between px-4 py-1.5"
        style={{
          background: "#0d1a0d",
          borderTop: "1px solid #00ff9f22",
        }}
      >
        <span className="font-mono text-xs" style={{ color: "#00ff9f66" }}>
          [TAB] autocomplete [↑↓] history [ENTER] execute
        </span>
        <span
          className="font-mono text-xs"
          style={{ color: isTyping ? "#00ff9f" : "#00ff9f44" }}
        >
          {isTyping ? "TYPING..." : "READY"}
        </span>
      </div>

      <style>{`
        .kali-glitch-line {
          animation: kaliGlitch 0.15s steps(2) forwards;
        }
        @keyframes kaliGlitch {
          0%   { transform: translate(0,0); filter: none; }
          25%  { transform: translate(-2px, 0); filter: hue-rotate(90deg); }
          50%  { transform: translate(2px, 1px); filter: hue-rotate(-90deg); }
          75%  { transform: translate(-1px, -1px); filter: none; }
          100% { transform: translate(0,0); filter: none; }
        }
      `}</style>
    </div>
  );
}

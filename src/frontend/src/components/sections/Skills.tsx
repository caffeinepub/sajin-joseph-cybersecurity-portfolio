import {
  Bug,
  Cloud,
  Cpu,
  Database,
  Eye,
  Globe,
  Search,
  Server,
  Shield,
  Target,
  Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const SKILLS = [
  {
    icon: Target,
    title: "Threat Hunting",
    tools:
      "Proactive threat detection, IOC analysis, hypothesis-driven hunting, behavioral analytics",
    color: "oklch(0.87 0.28 145)",
    level: 88,
    shortLabel: "Threat Hunt",
  },
  {
    icon: Search,
    title: "DFIR",
    tools:
      "Digital Forensics & Incident Response, memory forensics, log analysis, chain of custody",
    color: "oklch(0.84 0.15 205)",
    level: 84,
    shortLabel: "DFIR",
  },
  {
    icon: Users,
    title: "Active Directory",
    tools:
      "Windows AD, group policy, LDAP, Kerberos, Azure Entra ID, privilege management",
    color: "oklch(0.87 0.28 145)",
    level: 86,
    shortLabel: "Active Dir",
  },
  {
    icon: Shield,
    title: "Firewall & Perimeter Security",
    tools: "FortiGate, Sophos XG, Check Point, Palo Alto",
    color: "oklch(0.84 0.15 205)",
    level: 92,
    shortLabel: "Firewall",
  },
  {
    icon: Eye,
    title: "SIEM & IDS/IPS",
    tools: "Wazuh, Network Intrusion Detection/Prevention, EVE-NG",
    color: "oklch(0.87 0.28 145)",
    level: 85,
    shortLabel: "SIEM",
  },
  {
    icon: Cpu,
    title: "Endpoint Security / EDR/XDR",
    tools: "CrowdStrike, Sophos, TrendMicro, Carbon Black, Sentinel One",
    color: "oklch(0.84 0.15 205)",
    level: 88,
    shortLabel: "EDR/XDR",
  },
  {
    icon: Database,
    title: "Data Protection & DLP",
    tools: "IBM Guardium (GDE/GDP), Veeam Backup, DLP Forcepoint, Safetica",
    color: "oklch(0.87 0.28 145)",
    level: 80,
    shortLabel: "DLP",
  },
  {
    icon: Globe,
    title: "Email & Web Security",
    tools:
      "TrendMicro, Sophos, Check Point EmailSec, Netskope Proxy, Cloudflare, Imperva",
    color: "oklch(0.84 0.15 205)",
    level: 87,
    shortLabel: "Web Sec",
  },
  {
    icon: Shield,
    title: "Identity & Directory",
    tools: "Windows AD, Azure Entra ID, Cisco ISE (NAC), SSO, SureMDM",
    color: "oklch(0.87 0.28 145)",
    level: 83,
    shortLabel: "Identity",
  },
  {
    icon: Cloud,
    title: "Cloud & Productivity",
    tools: "Microsoft 365 Admin, Azure Fundamentals, AWS Cloud Practitioner",
    color: "oklch(0.84 0.15 205)",
    level: 78,
    shortLabel: "Cloud",
  },
  {
    icon: Bug,
    title: "Vulnerability Assessment & PenTest",
    tools:
      "Qualys, Nessus, Nmap, Burp Suite, Wireshark, CTF, TryHackMe, Hack The Box",
    color: "oklch(0.87 0.28 145)",
    level: 90,
    shortLabel: "PenTest",
  },
  {
    icon: Server,
    title: "Server & Virtualization",
    tools: "HPE ProLiant, VMware ESXi, vSphere Client, Proxmox",
    color: "oklch(0.84 0.15 205)",
    level: 82,
    shortLabel: "Server",
  },
  {
    icon: Cpu,
    title: "Operating Systems",
    tools: "Windows Server, Kali Linux, Ubuntu — hardening, patching, logging",
    color: "oklch(0.87 0.28 145)",
    level: 88,
    shortLabel: "OS",
  },
];

const RADAR_SKILLS = SKILLS.slice(0, 8);

function SkillBar({
  level,
  color,
  visible,
}: { level: number; color: string; visible: boolean }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (visible) {
      const t = setTimeout(() => setWidth(level), 100);
      return () => clearTimeout(t);
    }
  }, [visible, level]);

  return (
    <div className="mt-3">
      <div className="flex justify-between items-center mb-1">
        <span
          className="font-mono text-xs"
          style={{ color: "oklch(0.5 0.04 240)" }}
        >
          PROFICIENCY
        </span>
        <span className="font-mono text-xs font-bold" style={{ color }}>
          {width}%
        </span>
      </div>
      <div
        className="w-full h-1.5 rounded-full"
        style={{ background: "oklch(0.18 0.03 240)" }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${width}%`,
            background: color,
            boxShadow: `0 0 8px ${color}`,
            transition: "width 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
            willChange: "width",
          }}
        />
      </div>
    </div>
  );
}

function RadarChart({ visible }: { visible: boolean }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!visible) return;
    let frame: number;
    let start: number | null = null;
    const duration = 1200;
    function animate(ts: number) {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setProgress(p);
      if (p < 1) frame = requestAnimationFrame(animate);
    }
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [visible]);

  const cx = 200;
  const cy = 200;
  const maxR = 150;
  const N = RADAR_SKILLS.length;

  function getPoint(i: number, value: number) {
    const angle = (Math.PI * 2 * i) / N - Math.PI / 2;
    const r = (value / 100) * maxR * progress;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  }

  function getLabelPoint(i: number) {
    const angle = (Math.PI * 2 * i) / N - Math.PI / 2;
    const r = maxR + 24;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  }

  const gridLevels = [25, 50, 75, 100];

  function getGridPolygon(level: number) {
    return Array.from({ length: N }, (_, i) => {
      const angle = (Math.PI * 2 * i) / N - Math.PI / 2;
      const r = (level / 100) * maxR;
      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
    }).join(" ");
  }

  const dataPoints = RADAR_SKILLS.map((s, i) => getPoint(i, s.level));
  const dataPolygon = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <svg
      viewBox="0 0 400 400"
      className="w-full max-w-md mx-auto"
      role="img"
      aria-label="Skill proficiency radar chart"
    >
      <title>Skill Proficiency Radar</title>
      {gridLevels.map((l) => (
        <polygon
          key={l}
          points={getGridPolygon(l)}
          fill="none"
          stroke="oklch(0.84 0.15 205 / 0.15)"
          strokeWidth="1"
        />
      ))}
      {RADAR_SKILLS.map((skill) => {
        const idx = RADAR_SKILLS.indexOf(skill);
        const angle = (Math.PI * 2 * idx) / N - Math.PI / 2;
        return (
          <line
            key={skill.shortLabel}
            x1={cx}
            y1={cy}
            x2={cx + maxR * Math.cos(angle)}
            y2={cy + maxR * Math.sin(angle)}
            stroke="oklch(0.84 0.15 205 / 0.15)"
            strokeWidth="1"
          />
        );
      })}
      <polygon
        points={dataPolygon}
        fill="oklch(0.87 0.28 145 / 0.15)"
        stroke="oklch(0.87 0.28 145)"
        strokeWidth="1.5"
        style={{ filter: "drop-shadow(0 0 6px oklch(0.87 0.28 145 / 0.5))" }}
      />
      {dataPoints.map((p, i) => (
        <circle
          key={RADAR_SKILLS[i].shortLabel}
          cx={p.x}
          cy={p.y}
          r="4"
          fill="oklch(0.87 0.28 145)"
          style={{ filter: "drop-shadow(0 0 4px oklch(0.87 0.28 145))" }}
        />
      ))}
      {RADAR_SKILLS.map((s, i) => {
        const lp = getLabelPoint(i);
        return (
          <text
            key={s.shortLabel}
            x={lp.x}
            y={lp.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="oklch(0.75 0.025 240)"
            fontSize="10"
            fontFamily="JetBrains Mono, monospace"
          >
            {s.shortLabel}
          </text>
        );
      })}
    </svg>
  );
}

function CircleRing({
  skill,
  visible,
  color,
}: {
  skill: (typeof SKILLS)[0];
  visible: boolean;
  color: string;
}) {
  const [pct, setPct] = useState(0);
  const R = 40;
  const circ = 2 * Math.PI * R;

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setPct(skill.level), 150);
    return () => clearTimeout(t);
  }, [visible, skill.level]);

  const offset = circ - (pct / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full -rotate-90"
          aria-label={`${skill.shortLabel} proficiency ${pct}%`}
        >
          <title>{skill.shortLabel} skill ring</title>
          <circle
            cx="50"
            cy="50"
            r={R}
            fill="none"
            stroke="oklch(0.18 0.03 240)"
            strokeWidth="6"
          />
          <circle
            cx="50"
            cy="50"
            r={R}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{
              transition: "stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)",
              filter: `drop-shadow(0 0 4px ${color})`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-sm font-bold" style={{ color }}>
            {pct}%
          </span>
        </div>
      </div>
      <span
        className="text-xs text-foreground/60 text-center leading-tight font-mono"
        style={{ maxWidth: "80px" }}
      >
        {skill.shortLabel}
      </span>
    </div>
  );
}

export default function Skills() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const [sectionVisible, setSectionVisible] = useState(false);
  const [viewMode, setViewMode] = useState<"bars" | "radar" | "rings">("bars");

  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) e.target.classList.add("visible");
        }
      },
      { threshold: 0.1 },
    );
    const elements =
      sectionRef.current?.querySelectorAll(".section-reveal") ?? [];
    for (const el of elements) revealObserver.observe(el);

    const cardObserver = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const idx = Number((e.target as HTMLElement).dataset.skillIdx);
            setVisibleCards((prev) => new Set([...prev, idx]));
          }
        }
      },
      { threshold: 0.3 },
    );
    const cards =
      sectionRef.current?.querySelectorAll("[data-skill-idx]") ?? [];
    for (const el of cards) cardObserver.observe(el);

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setSectionVisible(true);
          sectionObserver.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    if (sectionRef.current) sectionObserver.observe(sectionRef.current);

    return () => {
      revealObserver.disconnect();
      cardObserver.disconnect();
      sectionObserver.disconnect();
    };
  }, []);

  return (
    <section id="skills" className="relative z-10 py-24" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 section-reveal">
          <span
            className="font-mono text-sm tracking-widest uppercase"
            style={{ color: "oklch(0.87 0.28 145)" }}
          >
            {"// Technical Expertise"}
          </span>
          <h2 className="text-4xl font-bold mt-2 text-foreground">My Skills</h2>
          <div
            className="w-16 h-0.5 mx-auto mt-4"
            style={{ background: "oklch(0.87 0.28 145)" }}
          />
        </div>

        {/* View toggle */}
        <div
          className="flex justify-center gap-2 mb-10 section-reveal"
          data-ocid="skills.tab"
        >
          {(["bars", "radar", "rings"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setViewMode(mode)}
              className="px-4 py-2 rounded font-mono text-xs uppercase tracking-wider transition-all duration-200"
              style={{
                background:
                  viewMode === mode
                    ? "oklch(0.87 0.28 145 / 0.12)"
                    : "oklch(0.14 0.025 240)",
                border: `1px solid ${
                  viewMode === mode
                    ? "oklch(0.87 0.28 145)"
                    : "oklch(0.22 0.04 240)"
                }`,
                color:
                  viewMode === mode
                    ? "oklch(0.87 0.28 145)"
                    : "oklch(0.5 0.04 240)",
                boxShadow:
                  viewMode === mode
                    ? "0 0 10px oklch(0.87 0.28 145 / 0.2)"
                    : "none",
              }}
              data-ocid={`skills.${mode}.toggle`}
            >
              {mode === "bars"
                ? "BAR VIEW"
                : mode === "radar"
                  ? "RADAR VIEW"
                  : "RINGS VIEW"}
            </button>
          ))}
        </div>

        {/* BAR VIEW */}
        {viewMode === "bars" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {SKILLS.map((skill, i) => (
              <div
                key={skill.title}
                className="cyber-card p-5 section-reveal icon-animate"
                style={{ transitionDelay: `${i * 60}ms` }}
                data-ocid={`skills.item.${i + 1}`}
                data-skill-idx={i}
              >
                <skill.icon
                  className="w-7 h-7 mb-3"
                  style={{
                    color: skill.color,
                    filter: `drop-shadow(0 0 6px ${skill.color})`,
                  }}
                />
                <h3 className="font-semibold text-sm text-foreground mb-1.5 leading-tight">
                  {skill.title}
                </h3>
                <p className="text-xs text-foreground/40 leading-relaxed">
                  {skill.tools}
                </p>
                <SkillBar
                  level={skill.level}
                  color={skill.color}
                  visible={visibleCards.has(i)}
                />
              </div>
            ))}
          </div>
        )}

        {/* RADAR VIEW */}
        {viewMode === "radar" && (
          <div className="flex justify-center section-reveal">
            <div className="cyber-card p-8 w-full max-w-lg">
              <RadarChart visible={sectionVisible} />
              <p className="text-center text-xs font-mono text-foreground/30 mt-4">
                Skill proficiency radar (0–100%)
              </p>
            </div>
          </div>
        )}

        {/* RINGS VIEW */}
        {viewMode === "rings" && (
          <div
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-6 section-reveal"
            data-skill-idx={0}
          >
            {SKILLS.map((skill, i) => (
              <CircleRing
                key={skill.title}
                skill={skill}
                visible={sectionVisible}
                color={
                  i % 2 === 0 ? "oklch(0.87 0.28 145)" : "oklch(0.84 0.15 205)"
                }
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

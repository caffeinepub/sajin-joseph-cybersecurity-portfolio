import {
  Bug,
  Cloud,
  Cpu,
  Database,
  Eye,
  Globe,
  Server,
  Shield,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const SKILLS = [
  {
    icon: Shield,
    title: "Firewall & Perimeter Security",
    tools: "FortiGate, Sophos XG, Check Point, Palo Alto",
    color: "oklch(0.87 0.28 145)",
    level: 92,
  },
  {
    icon: Eye,
    title: "SIEM & IDS/IPS",
    tools: "Wazuh, Network Intrusion Detection/Prevention, EVE-NG",
    color: "oklch(0.84 0.15 205)",
    level: 85,
  },
  {
    icon: Cpu,
    title: "Endpoint Security / EDR/XDR",
    tools: "CrowdStrike, Sophos, TrendMicro, Carbon Black, Sentinel One",
    color: "oklch(0.87 0.28 145)",
    level: 88,
  },
  {
    icon: Database,
    title: "Data Protection & DLP",
    tools: "IBM Guardium (GDE/GDP), Veeam Backup, DLP Forcepoint, Safetica",
    color: "oklch(0.84 0.15 205)",
    level: 80,
  },
  {
    icon: Globe,
    title: "Email & Web Security",
    tools:
      "TrendMicro, Sophos, Check Point EmailSec, Netskope Proxy, Cloudflare, Imperva",
    color: "oklch(0.87 0.28 145)",
    level: 87,
  },
  {
    icon: Shield,
    title: "Identity & Directory",
    tools: "Windows AD, Azure Entra ID, Cisco ISE (NAC), SSO, SureMDM",
    color: "oklch(0.84 0.15 205)",
    level: 83,
  },
  {
    icon: Cloud,
    title: "Cloud & Productivity",
    tools: "Microsoft 365 Admin, Azure Fundamentals, AWS Cloud Practitioner",
    color: "oklch(0.87 0.28 145)",
    level: 78,
  },
  {
    icon: Bug,
    title: "Vulnerability Assessment & PenTest",
    tools:
      "Qualys, Nessus, Nmap, Burp Suite, Wireshark, CTF, TryHackMe, Hack The Box",
    color: "oklch(0.84 0.15 205)",
    level: 90,
  },
  {
    icon: Server,
    title: "Server & Virtualization",
    tools: "HPE ProLiant, VMware ESXi, vSphere Client, Proxmox",
    color: "oklch(0.87 0.28 145)",
    level: 82,
  },
  {
    icon: Cpu,
    title: "Operating Systems",
    tools: "Windows Server, Kali Linux, Ubuntu — hardening, patching, logging",
    color: "oklch(0.84 0.15 205)",
    level: 88,
  },
];

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

export default function Skills() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());

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

    return () => {
      revealObserver.disconnect();
      cardObserver.disconnect();
    };
  }, []);

  return (
    <section id="skills" className="relative z-10 py-24" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14 section-reveal">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {SKILLS.map((skill, i) => (
            <div
              key={skill.title}
              className="cyber-card p-5 section-reveal"
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
      </div>
    </section>
  );
}

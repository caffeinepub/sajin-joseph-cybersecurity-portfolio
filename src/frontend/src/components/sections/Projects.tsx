import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Brain,
  Cpu,
  Eye,
  Globe,
  Lock,
  Network,
  Shield,
  Terminal,
  Wifi,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Category = "All" | "Web" | "Infrastructure" | "OT/ICS" | "IoT" | "SOC";

interface Project {
  id: number;
  title: string;
  description: string;
  category: Exclude<Category, "All">;
  tags: string[];
  metric: string;
  accent: string;
  icon: React.ElementType;
  tools: string[];
  findings: string;
  mitigations: string;
}

const CATEGORY_FILTERS: Category[] = [
  "All",
  "Web",
  "Infrastructure",
  "OT/ICS",
  "IoT",
  "SOC",
];

const CATEGORY_ACCENT: Record<Exclude<Category, "All">, string> = {
  Web: "#00ff9f",
  Infrastructure: "#00e5ff",
  "OT/ICS": "#ff6b35",
  IoT: "#b537f2",
  SOC: "#ff3366",
};

const PROJECTS: Project[] = [
  {
    id: 1,
    title: "Advanced Web Application Pentest Lab",
    description:
      "Simulated testing aligned with OWASP Top 10 vulnerabilities including access control, injection risks, and authentication weaknesses.",
    category: "Web",
    tags: ["Web Security", "OWASP", "Pentesting"],
    metric: "10+ vulnerabilities identified",
    accent: "#00ff9f",
    icon: Globe,
    tools: ["Burp Suite", "OWASP ZAP", "Nikto", "SQLMap"],
    findings:
      "Identified broken access control, SQL injection endpoints, and weak session management across simulated web app targets.",
    mitigations:
      "Implement input validation, enforce RBAC, use parameterized queries, enable CSP headers.",
  },
  {
    id: 2,
    title: "Secure API Testing Lab",
    description:
      "Analyzed API authentication, authorization, and data exposure risks with simulated scenarios.",
    category: "Web",
    tags: ["API Security", "Web"],
    metric: "8 API flaws discovered",
    accent: "#00ff9f",
    icon: Lock,
    tools: ["Postman", "Burp Suite", "OWASP API Top 10"],
    findings:
      "Found broken object level authorization, excessive data exposure, and missing rate limiting.",
    mitigations:
      "Enforce API gateway policies, implement OAuth 2.0 properly, add rate limiting and logging.",
  },
  {
    id: 3,
    title: "Enterprise Network Pentest Simulation",
    description:
      "Simulated assessment of segmented enterprise network including firewall, DMZ, and internal systems. Technologies include Palo Alto firewall concepts, SIEM, and identity systems.",
    category: "Infrastructure",
    tags: ["Network Security", "Firewall", "SIEM"],
    metric: "Multi-zone network assessed",
    accent: "#00e5ff",
    icon: Network,
    tools: ["Nmap", "Palo Alto", "Wazuh SIEM", "Nessus", "Cisco ISE"],
    findings:
      "Discovered lateral movement paths, weak firewall rules allowing inter-zone traffic, and unencrypted management interfaces.",
    mitigations:
      "Enforce strict ACLs, implement network segmentation, enable encrypted management protocols.",
  },
  {
    id: 4,
    title: "Vulnerability Assessment & Hardening",
    description:
      "Performed system hardening and identified misconfigurations, weak credentials, and exposed services.",
    category: "Infrastructure",
    tags: ["Vulnerability Management", "Infrastructure"],
    metric: "15+ misconfigs remediated",
    accent: "#00e5ff",
    icon: Shield,
    tools: ["Nessus", "OpenVAS", "CIS Benchmarks", "Lynis"],
    findings:
      "Found exposed RDP/SSH with weak credentials, unpatched services, and unnecessary open ports.",
    mitigations:
      "Apply CIS hardening benchmarks, enforce MFA, patch management policy, disable unused services.",
  },
  {
    id: 5,
    title: "Industrial Control System Security Simulation",
    description:
      "Simulated OT network with SCADA and PLC zones focusing on segmentation and secure communication.",
    category: "OT/ICS",
    tags: ["OT Security", "SCADA", "ICS"],
    metric: "OT/IT boundary secured",
    accent: "#ff6b35",
    icon: Cpu,
    tools: ["Wireshark", "Nmap", "Modbus simulator", "Claroty concepts"],
    findings:
      "Identified unencrypted Modbus traffic, flat OT network without DMZ, and lack of anomaly detection.",
    mitigations:
      "Implement Purdue model segmentation, add unidirectional gateways, deploy OT-specific IDS.",
  },
  {
    id: 6,
    title: "OT Network Segmentation & Monitoring",
    description:
      "Designed layered defense strategy for industrial networks including monitoring and detection.",
    category: "OT/ICS",
    tags: ["OT", "Network Security"],
    metric: "Defense-in-depth applied",
    accent: "#ff6b35",
    icon: Zap,
    tools: ["Zone/conduit model", "Dragos concepts", "Network monitoring"],
    findings:
      "No visibility into east-west OT traffic, missing security event correlation between IT and OT.",
    mitigations:
      "Deploy passive OT monitoring, establish security zones per IEC 62443, integrate OT logs into SIEM.",
  },
  {
    id: 7,
    title: "IoT Device Security Assessment",
    description:
      "Evaluated IoT devices for weak authentication, insecure firmware, and communication risks.",
    category: "IoT",
    tags: ["IoT Security"],
    metric: "12 device risks mapped",
    accent: "#b537f2",
    icon: Wifi,
    tools: ["Shodan concepts", "Firmware analysis", "Wireshark", "Nmap"],
    findings:
      "Default credentials on 80% of devices, unencrypted MQTT traffic, no firmware update mechanism.",
    mitigations:
      "Enforce unique device credentials, encrypt IoT traffic, implement OTA update pipeline.",
  },
  {
    id: 8,
    title: "Smart Environment Security Lab",
    description:
      "Simulated connected device ecosystem and analyzed attack surface and risk exposure.",
    category: "IoT",
    tags: ["IoT", "Risk Analysis"],
    metric: "Attack surface quantified",
    accent: "#b537f2",
    icon: Brain,
    tools: ["OWASP IoT Top 10", "Network scanning", "Threat modeling"],
    findings:
      "Excessive device permissions, insecure cloud API endpoints, and missing network isolation.",
    mitigations:
      "Apply least privilege to device APIs, isolate IoT VLAN, enforce encrypted cloud communication.",
  },
  {
    id: 9,
    title: "Red Team vs Blue Team Simulation",
    description:
      "Simulated attack and defense workflows including detection, SIEM alerts, and incident response.",
    category: "SOC",
    tags: ["SOC", "Threat Detection", "Blue Team"],
    metric: "Improved detection visibility",
    accent: "#ff3366",
    icon: Eye,
    tools: ["Wazuh SIEM", "Atomic Red Team", "MITRE ATT&CK", "Elastic"],
    findings:
      "Low-and-slow attacks went undetected for 48h, missing detections for lateral movement TTPs.",
    mitigations:
      "Tune SIEM correlation rules, implement UEBA, map all detections to MITRE ATT&CK framework.",
  },
];

const FEATURED_LABS = [
  {
    icon: Terminal,
    title: "Penetration Testing Lab",
    subtitle: "Kali Linux & Metasploitable",
    description:
      "Designed and maintained a controlled penetration testing lab simulating real-world attack scenarios including phishing, spoofing, privilege escalation, and social engineering to understand attacker behavior and improve defensive controls.",
    tools: ["Kali Linux", "Metasploitable", "Nmap", "Burp Suite", "Wireshark"],
    accent: "oklch(0.87 0.28 145)",
  },
  {
    icon: Brain,
    title: "Malware Development & Analysis Lab",
    subtitle: "EDR Evasion & Threat Simulation",
    description:
      "Developed and tested custom malware samples in a sandboxed environment using Havoc C2, implementing encryption and EDR evasion techniques. Performed static and dynamic malware analysis to simulate APT behavior.",
    tools: ["Havoc C2", "PE-bear", "C Code", "Sandbox", "Static Analysis"],
    accent: "oklch(0.84 0.15 205)",
  },
  {
    icon: Eye,
    title: "Security Monitoring & Defense Lab",
    subtitle: "Wazuh SIEM + EVE-NG",
    description:
      "Built a comprehensive home security monitoring lab using Wazuh SIEM for real-time log collection, correlation, and alerting on Proxmox/VMware. Integrated EVE-NG to emulate enterprise-grade network infrastructure.",
    tools: ["Wazuh", "EVE-NG", "Proxmox", "VMware ESXi", "IDS/IPS"],
    accent: "oklch(0.87 0.28 145)",
  },
  {
    icon: Network,
    title: "Critical Infrastructure Security",
    subtitle: "Banking & Insurance Environments",
    description:
      "Implemented and monitored network and infrastructure security controls for client environments resembling critical sectors such as banking, insurance, and industrial networks with firewall hardening and network segmentation.",
    tools: ["FortiGate", "Check Point", "Cisco ISE", "Wazuh", "Aruba"],
    accent: "oklch(0.84 0.15 205)",
  },
  {
    icon: Brain,
    title: "AI-Enhanced SIEM Integration",
    subtitle: "Wazuh + Machine Learning",
    description:
      "Integrated AI-based detection techniques with Wazuh SIEM to enhance threat analysis, anomaly detection, and alert prioritization. Leveraged ML for identifying abnormal patterns, reducing false positives.",
    tools: [
      "Wazuh",
      "Python",
      "ML Concepts",
      "Log Analysis",
      "Anomaly Detection",
    ],
    accent: "oklch(0.87 0.28 145)",
  },
  {
    icon: Shield,
    title: "Enterprise Firewall Deployments",
    subtitle: "Multi-Vendor Perimeter Defense",
    description:
      "Deployed and managed enterprise firewall appliances across multiple clients, implementing ZTNA-based access control, email security, and endpoint defense with CrowdStrike and Sophos XDR/MDR platforms.",
    tools: [
      "FortiGate",
      "Sophos XG",
      "Palo Alto",
      "CrowdStrike",
      "Check Point",
    ],
    accent: "oklch(0.84 0.15 205)",
  },
];

function getCategoryCount(cat: Category): number {
  if (cat === "All") return PROJECTS.length;
  return PROJECTS.filter((p) => p.category === cat).length;
}

export default function Projects() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState<Category>("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());

  const filtered =
    activeFilter === "All"
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === activeFilter);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) e.target.classList.add("visible");
        }
      },
      { threshold: 0.1 },
    );
    const elements =
      sectionRef.current?.querySelectorAll(".section-reveal") ?? [];
    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // animate cards on filter change
  useEffect(() => {
    setVisibleCards(new Set());
    const timeouts = filtered.map((p, i) =>
      setTimeout(
        () => setVisibleCards((prev) => new Set([...prev, p.id])),
        i * 80,
      ),
    );
    return () => timeouts.forEach(clearTimeout);
  }, [filtered]);

  return (
    <TooltipProvider>
      <section id="projects" className="relative z-10 py-24" ref={sectionRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="text-center mb-14 section-reveal">
            <span
              className="font-mono text-sm tracking-widest uppercase"
              style={{ color: "oklch(0.84 0.15 205)" }}
            >
              {"// Lab Work & Projects"}
            </span>
            <h2 className="text-4xl font-bold mt-2 text-foreground">
              Featured Projects
            </h2>
            <div
              className="w-16 h-0.5 mx-auto mt-4"
              style={{ background: "oklch(0.84 0.15 205)" }}
            />
            <p className="text-foreground/50 mt-4 text-sm font-mono max-w-xl mx-auto">
              Hands-on cybersecurity lab work across Web, Infrastructure,
              OT/ICS, IoT, and SOC domains.
            </p>
          </div>

          {/* Category Filters */}
          <div
            className="flex flex-wrap justify-center gap-2 mb-10 section-reveal"
            data-ocid="projects.tab"
          >
            {CATEGORY_FILTERS.map((cat) => {
              const isActive = activeFilter === cat;
              const accent = cat !== "All" ? CATEGORY_ACCENT[cat] : "#00e5ff";
              return (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className="relative px-4 py-2 rounded font-mono text-xs tracking-wider uppercase transition-all duration-300 border"
                  style={{
                    borderColor: isActive ? accent : "rgba(255,255,255,0.1)",
                    background: isActive ? `${accent}18` : "transparent",
                    color: isActive ? accent : "rgba(255,255,255,0.5)",
                    boxShadow: isActive ? `0 0 12px ${accent}40` : "none",
                  }}
                  data-ocid="projects.tab"
                >
                  {cat}
                  <span
                    className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px]"
                    style={{
                      background: isActive
                        ? `${accent}30`
                        : "rgba(255,255,255,0.08)",
                      color: isActive ? accent : "rgba(255,255,255,0.4)",
                    }}
                  >
                    {getCategoryCount(cat)}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Project Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {filtered.map((proj, i) => {
              const isVisible = visibleCards.has(proj.id);
              return (
                <div
                  key={proj.id}
                  className="group relative rounded-lg overflow-hidden flex flex-col cursor-pointer"
                  style={{
                    background: "rgba(13,17,23,0.9)",
                    border: `1px solid ${proj.accent}30`,
                    transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible
                      ? "translateY(0) scale(1)"
                      : "translateY(16px) scale(0.97)",
                    transitionDelay: `${i * 60}ms`,
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget;
                    el.style.transform = "translateY(-6px) scale(1.01)";
                    el.style.boxShadow = `0 8px 32px ${proj.accent}35, 0 0 0 1px ${proj.accent}50`;
                    el.style.borderColor = `${proj.accent}70`;
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    el.style.transform = "translateY(0) scale(1)";
                    el.style.boxShadow = "none";
                    el.style.borderColor = `${proj.accent}30`;
                  }}
                  data-ocid={`projects.item.${i + 1}`}
                >
                  {/* Top gradient bar */}
                  <div
                    className="h-1"
                    style={{
                      background: `linear-gradient(90deg, ${proj.accent}, transparent)`,
                    }}
                  />

                  {/* Metric badge top-right */}
                  <div className="absolute top-4 right-4">
                    <span
                      className="text-[10px] font-mono px-2 py-0.5 rounded-full"
                      style={{
                        background: `${proj.accent}18`,
                        border: `1px solid ${proj.accent}40`,
                        color: proj.accent,
                      }}
                    >
                      {proj.metric}
                    </span>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    {/* Icon + Title */}
                    <div className="flex items-start gap-3 mb-3 pr-24">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{
                          background: `${proj.accent}15`,
                          border: `1px solid ${proj.accent}30`,
                        }}
                      >
                        <proj.icon
                          className="w-4 h-4"
                          style={{ color: proj.accent }}
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground text-sm leading-tight">
                          {proj.title}
                        </h3>
                        <span
                          className="text-[10px] font-mono mt-0.5 inline-block"
                          style={{
                            background: `${proj.accent}12`,
                            border: `1px solid ${proj.accent}25`,
                            color: proj.accent,
                            padding: "1px 6px",
                            borderRadius: "4px",
                          }}
                        >
                          {proj.category}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-foreground/55 text-xs leading-relaxed flex-1 mb-4">
                      {proj.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {proj.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded text-[10px] font-mono"
                          style={{
                            background: `${proj.accent}10`,
                            border: `1px solid ${proj.accent}25`,
                            color: proj.accent,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-2 mt-auto">
                      <button
                        type="button"
                        onClick={() => setSelectedProject(proj)}
                        className="flex-1 py-2 rounded text-xs font-mono font-semibold transition-all duration-200"
                        style={{
                          background: `${proj.accent}18`,
                          border: `1px solid ${proj.accent}50`,
                          color: proj.accent,
                        }}
                        onMouseEnter={(e) => {
                          (
                            e.currentTarget as HTMLButtonElement
                          ).style.background = `${proj.accent}30`;
                        }}
                        onMouseLeave={(e) => {
                          (
                            e.currentTarget as HTMLButtonElement
                          ).style.background = `${proj.accent}18`;
                        }}
                        data-ocid={`projects.secondary_button.${i + 1}`}
                      >
                        View Details
                      </button>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            disabled
                            className="flex-1 py-2 rounded text-xs font-mono cursor-not-allowed"
                            style={{
                              border: "1px solid rgba(255,255,255,0.12)",
                              color: "rgba(255,255,255,0.25)",
                              background: "transparent",
                            }}
                            data-ocid={`projects.primary_button.${i + 1}`}
                          >
                            Launch Simulation
                          </button>
                        </TooltipTrigger>
                        <TooltipContent
                          side="top"
                          className="bg-gray-900 border-gray-700 text-xs font-mono"
                        >
                          Coming Soon
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Disclaimer */}
          <div
            className="rounded-lg px-5 py-3 mb-20 section-reveal"
            style={{
              background: "rgba(0,229,255,0.05)",
              border: "1px solid rgba(0,229,255,0.15)",
            }}
          >
            <p className="text-center text-xs font-mono text-foreground/45">
              <span style={{ color: "#00e5ff" }}>⚠ DISCLAIMER:</span> All
              projects are simulated environments for cybersecurity learning and
              demonstration purposes only.
            </p>
          </div>

          {/* Featured Labs */}
          <div className="section-reveal">
            <div className="text-center mb-10">
              <span
                className="font-mono text-sm tracking-widest uppercase"
                style={{ color: "oklch(0.84 0.15 205)" }}
              >
                {"// Core Lab Infrastructure"}
              </span>
              <h3 className="text-2xl font-bold mt-2 text-foreground">
                Featured Labs
              </h3>
              <div
                className="w-12 h-0.5 mx-auto mt-3"
                style={{ background: "oklch(0.84 0.15 205)" }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURED_LABS.map((proj, i) => (
                <div
                  key={proj.title}
                  className="cyber-card overflow-hidden flex flex-col section-reveal"
                  style={{ transitionDelay: `${i * 80}ms` }}
                  data-ocid={`projects.item.${i + 10}`}
                >
                  <div
                    className="h-1.5"
                    style={{
                      background: `linear-gradient(90deg, ${proj.accent}, transparent)`,
                    }}
                  />
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-start gap-3 mb-4">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 icon-animate"
                        style={{
                          background: `${proj.accent}15`,
                          border: `1px solid ${proj.accent}30`,
                        }}
                      >
                        <proj.icon
                          className="w-5 h-5"
                          style={{ color: proj.accent }}
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground text-sm leading-tight">
                          {proj.title}
                        </h3>
                        <p
                          className="text-xs mt-0.5"
                          style={{ color: proj.accent }}
                        >
                          / {proj.subtitle}
                        </p>
                      </div>
                    </div>
                    <p className="text-foreground/55 text-sm leading-relaxed flex-1 mb-4">
                      {proj.description}
                    </p>
                    <div>
                      <span className="text-xs uppercase tracking-wider text-foreground/30 font-mono mb-2 block">
                        Tools:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {proj.tools.map((tool) => (
                          <span
                            key={tool}
                            className="px-2 py-0.5 rounded text-xs font-mono badge-shimmer"
                            style={{
                              background: `${proj.accent}10`,
                              border: `1px solid ${proj.accent}25`,
                              color: proj.accent,
                            }}
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Project Detail Modal */}
        <Dialog
          open={!!selectedProject}
          onOpenChange={(open) => !open && setSelectedProject(null)}
        >
          <DialogContent
            className="max-w-2xl max-h-[85vh] overflow-y-auto"
            style={{
              background: "#0d1117",
              border: `1px solid ${selectedProject?.accent ?? "#00e5ff"}40`,
            }}
            data-ocid="projects.dialog"
          >
            {selectedProject && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{
                        background: `${selectedProject.accent}18`,
                        border: `1px solid ${selectedProject.accent}40`,
                      }}
                    >
                      <selectedProject.icon
                        className="w-5 h-5"
                        style={{ color: selectedProject.accent }}
                      />
                    </div>
                    <div>
                      <DialogTitle className="text-foreground text-lg font-bold leading-tight">
                        {selectedProject.title}
                      </DialogTitle>
                      <span
                        className="text-[11px] font-mono px-2 py-0.5 rounded mt-1 inline-block"
                        style={{
                          background: `${selectedProject.accent}18`,
                          border: `1px solid ${selectedProject.accent}35`,
                          color: selectedProject.accent,
                        }}
                      >
                        {selectedProject.category}
                      </span>
                    </div>
                  </div>
                </DialogHeader>

                <div className="space-y-5 mt-2">
                  {/* Description */}
                  <p className="text-foreground/70 text-sm leading-relaxed">
                    {selectedProject.description}
                  </p>

                  {/* Tools */}
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-wider text-foreground/40 mb-2">
                      Tools & Technologies
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.tools.map((tool) => (
                        <Badge
                          key={tool}
                          variant="outline"
                          className="text-xs font-mono"
                          style={{
                            borderColor: `${selectedProject.accent}40`,
                            color: selectedProject.accent,
                            background: `${selectedProject.accent}10`,
                          }}
                        >
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Key Findings */}
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-wider text-foreground/40 mb-2">
                      Key Findings
                    </h4>
                    <div
                      className="rounded-lg p-4 font-mono text-sm"
                      style={{
                        background: "rgba(0,0,0,0.6)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: selectedProject.accent,
                      }}
                    >
                      <span className="text-foreground/30 mr-2">$</span>
                      {selectedProject.findings}
                    </div>
                  </div>

                  {/* Mitigation */}
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-wider text-foreground/40 mb-2">
                      Mitigation Strategies
                    </h4>
                    <div
                      className="rounded-lg p-4 text-sm"
                      style={{
                        background: "rgba(0,0,0,0.4)",
                        border: `1px solid ${selectedProject.accent}20`,
                        color: "rgba(255,255,255,0.65)",
                      }}
                    >
                      {selectedProject.mitigations}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {selectedProject.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-full text-[11px] font-mono"
                        style={{
                          background: `${selectedProject.accent}12`,
                          border: `1px solid ${selectedProject.accent}30`,
                          color: selectedProject.accent,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Button
                    onClick={() => setSelectedProject(null)}
                    className="w-full mt-2 font-mono text-sm"
                    variant="outline"
                    style={{
                      borderColor: `${selectedProject.accent}50`,
                      color: selectedProject.accent,
                      background: `${selectedProject.accent}10`,
                    }}
                    data-ocid="projects.close_button"
                  >
                    Close
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </section>
    </TooltipProvider>
  );
}

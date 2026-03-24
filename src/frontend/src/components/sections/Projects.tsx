import { Brain, Eye, Network, Shield, Terminal } from "lucide-react";
import { useEffect, useRef } from "react";

const PROJECTS = [
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

export default function Projects() {
  const sectionRef = useRef<HTMLDivElement>(null);

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

  return (
    <section id="projects" className="relative z-10 py-24" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS.map((proj, i) => (
            <div
              key={proj.title}
              className="cyber-card overflow-hidden flex flex-col section-reveal"
              style={{ transitionDelay: `${i * 80}ms` }}
              data-ocid={`projects.item.${i + 1}`}
            >
              {/* Header band */}
              <div
                className="h-1.5"
                style={{
                  background: `linear-gradient(90deg, ${proj.accent}, transparent)`,
                }}
              />
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-start gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
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
                        className="px-2 py-0.5 rounded text-xs font-mono"
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
    </section>
  );
}

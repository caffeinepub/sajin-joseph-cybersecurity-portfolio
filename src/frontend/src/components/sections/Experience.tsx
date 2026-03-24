import { Briefcase, GraduationCap } from "lucide-react";
import { useEffect, useRef } from "react";

const TIMELINE = [
  {
    date: "2016 – 2019",
    type: "education",
    title: "BCA — Bachelor of Computer Application",
    org: "MC Varghese College of Arts & Science",
    points: [
      "Foundation in Computer Science, programming, and networking",
      "Developed strong analytical and problem-solving skills",
    ],
  },
  {
    date: "Dec 2023 – Sept 2024",
    type: "work",
    title: "Security Analyst",
    org: "Cyberleap India Pvt Ltd",
    points: [
      "Threat detection using CrowdStrike, Carbon Black, TrendMicro, Sentinel One",
      "Deployed IBM Data Protection & Encryption tools (DAM, THALES)",
      "Managed firewall configurations and NAC policies",
      "Regular vulnerability assessments and endpoint remediation",
      "Maintained security procedures documentation",
    ],
  },
  {
    date: "Sept 2024",
    type: "work",
    title: "Network Security Engineer",
    org: "GKS Infotech Pvt Ltd",
    points: [
      "Led email security deployments: Sophos, Check Point, ZTNA-based access",
      "Deployed FortiGate, Sophos XG, Check Point, Palo Alto firewall appliances",
      "Managed CrowdStrike, Sophos EDR/XDR/MDR for centralized threat response",
      "Administered Wazuh SIEM, Active Directory, Azure Entra ID sync",
      "Configured SureMDM, Veeam Backup, and VMware ESXi/Proxmox environments",
    ],
  },
  {
    date: "Present",
    type: "work",
    title: "Security Analyst",
    org: "Upsmart Solutions India Pvt Ltd",
    points: [
      "First point of contact for security team — coordinating SOC activities",
      "Managing and mentoring security interns and junior team members",
      "Monitoring SIEM, EDR, and email security alerts for threat analysis",
      "Incident investigation: malware, phishing, suspicious network activity",
      "Preparing incident reports and security documentation for management",
    ],
  },
];

export default function Experience() {
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
    <section id="experience" className="relative z-10 py-24" ref={sectionRef}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14 section-reveal">
          <span
            className="font-mono text-sm tracking-widest uppercase"
            style={{ color: "oklch(0.84 0.15 205)" }}
          >
            {"// Career Path"}
          </span>
          <h2 className="text-4xl font-bold mt-2 text-foreground">
            Experience Timeline
          </h2>
          <div
            className="w-16 h-0.5 mx-auto mt-4"
            style={{ background: "oklch(0.84 0.15 205)" }}
          />
        </div>

        <div className="relative">
          {/* Central line */}
          <div
            className="absolute top-0 bottom-0 w-0.5 timeline-line hidden md:block"
            style={{ left: "24px" }}
          />

          <div className="space-y-10">
            {TIMELINE.map((item) => (
              <div
                key={item.org}
                className="flex gap-6 section-reveal"
                data-ocid={`experience.item.${TIMELINE.indexOf(item) + 1}`}
              >
                {/* Node */}
                <div className="flex-shrink-0 flex flex-col items-center">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center z-10 relative"
                    style={{
                      background: "oklch(0.14 0.025 240)",
                      border: `2px solid ${item.type === "education" ? "oklch(0.84 0.15 205)" : "oklch(0.87 0.28 145)"}`,
                      boxShadow: `0 0 15px ${item.type === "education" ? "oklch(0.84 0.15 205 / 0.3)" : "oklch(0.87 0.28 145 / 0.3)"}`,
                    }}
                  >
                    {item.type === "education" ? (
                      <GraduationCap
                        className="w-5 h-5"
                        style={{ color: "oklch(0.84 0.15 205)" }}
                      />
                    ) : (
                      <Briefcase
                        className="w-5 h-5"
                        style={{ color: "oklch(0.87 0.28 145)" }}
                      />
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 cyber-card p-5 mb-2">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                    <div>
                      <h3 className="font-bold text-foreground">
                        {item.title}
                      </h3>
                      <p
                        className="text-sm font-medium mt-0.5"
                        style={{
                          color:
                            item.type === "education"
                              ? "oklch(0.84 0.15 205)"
                              : "oklch(0.87 0.28 145)",
                        }}
                      >
                        {item.org}
                      </p>
                    </div>
                    <span
                      className="text-xs font-mono px-2 py-0.5 rounded"
                      style={{
                        background: "oklch(0.87 0.28 145 / 0.1)",
                        border: "1px solid oklch(0.87 0.28 145 / 0.3)",
                        color: "oklch(0.87 0.28 145)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.date}
                    </span>
                  </div>
                  <ul className="space-y-1">
                    {item.points.map((pt) => (
                      <li
                        key={pt}
                        className="text-sm text-foreground/55 flex gap-2"
                      >
                        <span
                          style={{ color: "oklch(0.87 0.28 145)" }}
                          className="mt-0.5 flex-shrink-0"
                        >
                          &#9658;
                        </span>
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

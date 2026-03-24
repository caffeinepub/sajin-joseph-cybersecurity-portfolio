import { Award } from "lucide-react";
import { useEffect, useRef } from "react";

const CERTS = [
  {
    name: "CEH V12",
    org: "EC-Council",
    subtitle: "Certified Ethical Hacker",
    highlight: true,
  },
  {
    name: "CND",
    org: "EC-Council",
    subtitle: "Certified Network Defender (Ongoing)",
    highlight: false,
  },
  {
    name: "Sophos Architect",
    org: "Sophos",
    subtitle: "Firewall & Endpoint Security",
    highlight: true,
  },
  {
    name: "Checkpoint Spark",
    org: "Check Point",
    subtitle: "Quantum Spark Technical Specialist",
    highlight: false,
  },
  {
    name: "Qualys",
    org: "Qualys",
    subtitle: "VMDR, CSAM & WAS",
    highlight: true,
  },
  {
    name: "Google Cyber",
    org: "Google",
    subtitle: "Cybersecurity Certificate",
    highlight: false,
  },
  {
    name: "AZ-900",
    org: "Microsoft",
    subtitle: "Azure Fundamentals",
    highlight: true,
  },
  {
    name: "AWS CCP",
    org: "Amazon",
    subtitle: "Cloud Practitioner",
    highlight: false,
  },
  {
    name: "CrowdStrike",
    org: "Udemy",
    subtitle: "CrowdStrike Admin",
    highlight: false,
  },
  {
    name: "FortiAnalyzer",
    org: "Fortinet",
    subtitle: "FortiAnalyzer 7.4 Administrator",
    highlight: true,
  },
  {
    name: "Sentinel One",
    org: "Sentinel One",
    subtitle: "Getting Started with Sentinel One",
    highlight: false,
  },
];

export default function Certifications() {
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
    <section
      id="certifications"
      className="relative z-10 py-20"
      ref={sectionRef}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 section-reveal">
          <span
            className="font-mono text-sm tracking-widest uppercase"
            style={{ color: "oklch(0.87 0.28 145)" }}
          >
            {"// Credentials"}
          </span>
          <h2 className="text-4xl font-bold mt-2 text-foreground">
            Certifications
          </h2>
          <div
            className="w-16 h-0.5 mx-auto mt-4"
            style={{ background: "oklch(0.87 0.28 145)" }}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {CERTS.map((cert, i) => (
            <div
              key={cert.name}
              className="cyber-card p-4 flex flex-col items-center text-center section-reveal"
              style={{
                transitionDelay: `${i * 60}ms`,
                borderColor: cert.highlight
                  ? "oklch(0.87 0.28 145 / 0.4)"
                  : undefined,
                boxShadow: cert.highlight
                  ? "0 0 15px oklch(0.87 0.28 145 / 0.1)"
                  : undefined,
              }}
              data-ocid={`certifications.item.${i + 1}`}
            >
              <Award
                className="w-6 h-6 mb-2"
                style={{
                  color: cert.highlight
                    ? "oklch(0.87 0.28 145)"
                    : "oklch(0.84 0.15 205)",
                }}
              />
              <div
                className="font-bold font-mono text-sm mb-0.5"
                style={{
                  color: cert.highlight
                    ? "oklch(0.87 0.28 145)"
                    : "oklch(0.84 0.15 205)",
                }}
              >
                {cert.name}
              </div>
              <div className="text-xs text-foreground/40 leading-tight">
                {cert.org}
              </div>
              <div className="text-xs text-foreground/30 mt-1 leading-tight">
                {cert.subtitle}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

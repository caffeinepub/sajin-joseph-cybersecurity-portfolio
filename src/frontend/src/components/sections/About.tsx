import { ExternalLink, Mail, MapPin, Terminal, User } from "lucide-react";
import { useEffect, useRef } from "react";

const QUICK_STATS = [
  { label: "Experience", value: "3+ Years" },
  { label: "Domain", value: "SOC / Network" },
  { label: "Clearance", value: "Available" },
  { label: "Status", value: "Active" },
];

const EXPERTISE_TAGS = [
  "SIEM",
  "EDR/XDR",
  "Threat Hunting",
  "DFIR",
  "Wazuh",
  "FortiGate",
  "Active Directory",
  "Cloud Security",
  "Incident Response",
  "Network Defense",
];

const INTRO_LINES = [
  "Infiltrating cyber threats since 2021.",
  "I don't just defend networks — I hunt the attackers.",
  "Specializing in SOC operations, threat intelligence,",
  "and building enterprise-grade security postures.",
  "Access without authorization will be logged, traced,",
  "and escalated. You've been warned.",
];

export default function About() {
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
    <section id="about" className="relative z-10 py-24" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-12 section-reveal">
          <span
            className="terminal-prompt font-mono text-sm tracking-widest uppercase"
            style={{ color: "oklch(0.87 0.28 145)" }}
          >
            {"root@portfolio:~$ whoami"}
          </span>
          <h2 className="text-4xl font-bold mt-2 text-foreground flex items-center gap-2">
            About Me
            <span className="cursor-blink" />
          </h2>
          <div
            className="w-16 h-0.5 mt-4"
            style={{ background: "oklch(0.87 0.28 145)" }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 section-reveal">
            <div
              className="cyber-card p-0 overflow-hidden"
              style={{
                background: "oklch(0.085 0.022 240 / 0.95)",
                backdropFilter: "blur(16px)",
              }}
            >
              <div
                className="flex items-center gap-2 px-4 py-3 border-b"
                style={{
                  background: "oklch(0.12 0.025 240)",
                  borderColor: "oklch(0.87 0.28 145 / 0.2)",
                }}
              >
                <div className="flex gap-1.5">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ background: "oklch(0.65 0.22 25)" }}
                  />
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ background: "oklch(0.78 0.18 75)" }}
                  />
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ background: "oklch(0.72 0.22 145)" }}
                  />
                </div>
                <span
                  className="font-mono text-xs ml-2"
                  style={{ color: "oklch(0.6 0.04 240)" }}
                >
                  sajin@cyberlab:~
                </span>
                <Terminal
                  className="w-3.5 h-3.5 ml-auto"
                  style={{ color: "oklch(0.87 0.28 145 / 0.5)" }}
                />
              </div>

              <div className="p-6 space-y-4 font-mono text-sm">
                <div>
                  <span style={{ color: "oklch(0.87 0.28 145)" }}>
                    root@sajin
                  </span>
                  <span style={{ color: "oklch(0.6 0.04 240)" }}>:~# </span>
                  <span style={{ color: "oklch(0.85 0.015 240)" }}>whoami</span>
                </div>
                <div className="space-y-1 pl-2">
                  <div className="flex items-center gap-3">
                    <User
                      className="w-4 h-4 flex-shrink-0"
                      style={{ color: "oklch(0.84 0.15 205)" }}
                    />
                    <span style={{ color: "oklch(0.9 0.015 240)" }}>
                      Sajin Joseph
                    </span>
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: "oklch(0.87 0.28 145)" }}
                  >
                    Cybersecurity Engineer | Network &amp; Infrastructure
                  </div>
                </div>

                <div className="mt-3">
                  <span style={{ color: "oklch(0.87 0.28 145)" }}>
                    root@sajin
                  </span>
                  <span style={{ color: "oklch(0.6 0.04 240)" }}>:~# </span>
                  <span style={{ color: "oklch(0.85 0.015 240)" }}>
                    cat intro.txt
                  </span>
                </div>
                <div
                  className="pl-2 leading-relaxed text-xs border-l-2 space-y-0.5"
                  style={{
                    borderColor: "oklch(0.87 0.28 145 / 0.4)",
                    color: "oklch(0.75 0.025 240)",
                  }}
                >
                  {INTRO_LINES.map((line) => (
                    <div key={line} className="flex items-start gap-1.5">
                      <span
                        className="flex-shrink-0"
                        style={{ color: "oklch(0.84 0.15 205)" }}
                      >
                        {"//"}
                      </span>
                      <span>{line}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-3">
                  <span style={{ color: "oklch(0.87 0.28 145)" }}>
                    root@sajin
                  </span>
                  <span style={{ color: "oklch(0.6 0.04 240)" }}>:~# </span>
                  <span style={{ color: "oklch(0.85 0.015 240)" }}>
                    cat contact.cfg
                  </span>
                </div>
                <div className="pl-2 space-y-1.5 text-xs">
                  <div className="flex items-center gap-2">
                    <Mail
                      className="w-3.5 h-3.5"
                      style={{ color: "oklch(0.87 0.28 145)" }}
                    />
                    <a
                      href="mailto:sajinjoseph363@gmail.com"
                      style={{ color: "oklch(0.84 0.15 205)" }}
                      className="hover:underline"
                    >
                      sajinjoseph363@gmail.com
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin
                      className="w-3.5 h-3.5"
                      style={{ color: "oklch(0.87 0.28 145)" }}
                    />
                    <span style={{ color: "oklch(0.75 0.025 240)" }}>
                      Kerala, India
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ExternalLink
                      className="w-3.5 h-3.5"
                      style={{ color: "oklch(0.87 0.28 145)" }}
                    />
                    <a
                      href="https://www.linkedin.com/in/sajin-joseph-9471a9254/"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "oklch(0.84 0.15 205)" }}
                      className="hover:underline"
                    >
                      linkedin.com/in/sajin-joseph
                    </a>
                  </div>
                </div>

                <div className="pt-1">
                  <span style={{ color: "oklch(0.87 0.28 145)" }}>
                    root@sajin
                  </span>
                  <span style={{ color: "oklch(0.6 0.04 240)" }}>:~# </span>
                  <span
                    className="inline-block w-2 h-4 align-middle"
                    style={{
                      background: "oklch(0.87 0.28 145)",
                      animation: "caretBlink 1s step-end infinite",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div
              className="grid grid-cols-2 gap-3 section-reveal"
              style={{ transitionDelay: "100ms" }}
            >
              {QUICK_STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="cyber-card p-4 text-center"
                  style={{
                    background: "oklch(0.085 0.022 240 / 0.8)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <div
                    className="font-mono text-sm font-bold"
                    style={{ color: "oklch(0.87 0.28 145)" }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-xs text-foreground/40 uppercase tracking-wider mt-0.5">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <div
              className="cyber-card p-5 section-reveal"
              style={{
                background: "oklch(0.085 0.022 240 / 0.8)",
                backdropFilter: "blur(12px)",
                transitionDelay: "180ms",
              }}
            >
              <div
                className="font-mono text-xs mb-3 uppercase tracking-widest"
                style={{ color: "oklch(0.84 0.15 205)" }}
              >
                {">"} Core Expertise
              </div>
              <div className="flex flex-wrap gap-2">
                {EXPERTISE_TAGS.map((tag, i) => (
                  <span
                    key={tag}
                    className="font-mono text-xs px-2.5 py-1 rounded badge-shimmer"
                    style={{
                      background:
                        i % 2 === 0
                          ? "oklch(0.87 0.28 145 / 0.1)"
                          : "oklch(0.84 0.15 205 / 0.1)",
                      border: `1px solid ${i % 2 === 0 ? "oklch(0.87 0.28 145 / 0.35)" : "oklch(0.84 0.15 205 / 0.35)"}`,
                      color:
                        i % 2 === 0
                          ? "oklch(0.87 0.28 145)"
                          : "oklch(0.84 0.15 205)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div
              className="cyber-card p-5 section-reveal"
              style={{
                background: "oklch(0.085 0.022 240 / 0.6)",
                backdropFilter: "blur(12px)",
                borderColor: "oklch(0.84 0.15 205 / 0.3)",
                transitionDelay: "260ms",
              }}
            >
              <p
                className="font-mono text-xs leading-relaxed italic"
                style={{ color: "oklch(0.65 0.025 240)" }}
              >
                <span style={{ color: "oklch(0.84 0.15 205)" }}>{`"`}</span>
                {
                  " The best defense is understanding how attackers think. Every alert tells a story — I read them all. "
                }
                <span style={{ color: "oklch(0.84 0.15 205)" }}>{`"`}</span>
              </p>
              <div
                className="mt-2 text-right font-mono text-xs"
                style={{ color: "oklch(0.87 0.28 145 / 0.6)" }}
              >
                — Sajin Joseph
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

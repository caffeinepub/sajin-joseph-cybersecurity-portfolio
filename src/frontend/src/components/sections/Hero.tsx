import { ChevronDown, Download, Eye, Mail } from "lucide-react";
import { useEffect, useState } from "react";

const ROLES = [
  "Cybersecurity Engineer",
  "SOC Analyst",
  "Threat Hunter",
  "Network Security Engineer",
];

export default function Hero() {
  const [roleIdx, setRoleIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const role = ROLES[roleIdx];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && displayed.length < role.length) {
      timeout = setTimeout(
        () => setDisplayed(role.slice(0, displayed.length + 1)),
        80,
      );
    } else if (!isDeleting && displayed.length === role.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40);
    } else if (isDeleting && displayed.length === 0) {
      setIsDeleting(false);
      setRoleIdx((prev) => (prev + 1) % ROLES.length);
    }

    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, roleIdx]);

  return (
    <section
      id="home"
      className="min-h-screen flex items-center relative z-10 hex-bg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left column */}
          <div className="space-y-6">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono tracking-wider border"
              style={{
                borderColor: "oklch(0.87 0.28 145 / 0.4)",
                color: "oklch(0.87 0.28 145)",
                background: "oklch(0.87 0.28 145 / 0.08)",
              }}
            >
              <span
                className="inline-block w-2 h-2 rounded-full animate-pulse"
                style={{ background: "oklch(0.87 0.28 145)" }}
              />
              Available for Security Engineering Roles
            </div>

            <div>
              <p className="text-foreground/50 text-lg font-medium mb-1">
                Hello, I'm
              </p>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
                <span
                  style={{
                    color: "oklch(0.87 0.28 145)",
                    textShadow: "0 0 30px oklch(0.87 0.28 145 / 0.5)",
                  }}
                >
                  Sajin
                </span>
                <br />
                <span className="text-foreground">Joseph</span>
              </h1>
            </div>

            <div className="h-8 flex items-center">
              <span
                className="font-mono text-xl"
                style={{ color: "oklch(0.84 0.15 205)" }}
              >
                {displayed}
                <span
                  className="inline-block w-0.5 h-5 ml-0.5 align-middle"
                  style={{
                    background: "oklch(0.87 0.28 145)",
                    animation: "caretBlink 1s step-end infinite",
                  }}
                />
              </span>
            </div>

            <p className="text-foreground/60 text-base leading-relaxed max-w-xl">
              I protect organizations from cyber threats using{" "}
              <span style={{ color: "oklch(0.87 0.28 145)" }}>SIEM</span>,{" "}
              <span style={{ color: "oklch(0.87 0.28 145)" }}>EDR</span>, threat
              intelligence, and{" "}
              <span style={{ color: "oklch(0.87 0.28 145)" }}>
                cloud security
              </span>{" "}
              solutions. 3+ years of hands-on experience in SOC operations,
              network defense, and incident response.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <a href="#projects" data-ocid="hero.primary_button">
                <button
                  type="button"
                  className="btn-primary-neon flex items-center gap-2 px-6 py-2.5"
                >
                  <Eye className="w-4 h-4" />
                  View Projects
                </button>
              </a>
              <a
                href="/assets/uploads/sajinjosephresume2026-019d1d6c-8a89-7359-8205-81e4cb2f1e8f-1.pdf"
                target="_blank"
                rel="noopener noreferrer"
                data-ocid="hero.secondary_button"
              >
                <button
                  type="button"
                  className="btn-neon flex items-center gap-2 px-6 py-2.5"
                >
                  <Download className="w-4 h-4" />
                  Download Resume
                </button>
              </a>
              <a href="#contact" data-ocid="hero.contact_button">
                <button
                  type="button"
                  className="btn-neon flex items-center gap-2 px-6 py-2.5"
                  style={{
                    borderColor: "oklch(0.84 0.15 205 / 0.7)",
                    color: "oklch(0.84 0.15 205)",
                  }}
                >
                  <Mail className="w-4 h-4" />
                  Contact Me
                </button>
              </a>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-4">
              {[
                { label: "Years Exp", value: "3+" },
                { label: "Tools Mastered", value: "25+" },
                { label: "Certifications", value: "11+" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div
                    className="text-2xl font-bold font-mono"
                    style={{ color: "oklch(0.87 0.28 145)" }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-xs text-foreground/40 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column — hex network visual */}
          <div className="hidden lg:flex items-center justify-center relative">
            <div className="relative w-[480px] h-[480px]">
              {/* Outer glow ring */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, oklch(0.87 0.28 145 / 0.05) 0%, transparent 70%)",
                  border: "1px solid oklch(0.87 0.28 145 / 0.15)",
                }}
              />
              {/* Main image */}
              <img
                src="/assets/generated/hero-hex-network.dim_600x600.png"
                alt="Hex network cyber visualization"
                className="w-full h-full object-cover rounded-full"
                style={{
                  filter: "drop-shadow(0 0 40px oklch(0.87 0.28 145 / 0.3))",
                  mixBlendMode: "screen",
                }}
              />
              {/* Center avatar */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-28 h-28 rounded-full flex items-center justify-center font-bold text-3xl font-mono"
                  style={{
                    background: "oklch(0.14 0.025 240)",
                    border: "2px solid oklch(0.87 0.28 145 / 0.7)",
                    boxShadow:
                      "0 0 30px oklch(0.87 0.28 145 / 0.4), inset 0 0 20px oklch(0.87 0.28 145 / 0.1)",
                    color: "oklch(0.87 0.28 145)",
                  }}
                >
                  SJ
                </div>
              </div>
              {/* Floating badges */}
              {[
                { label: "CEH", top: "10%", left: "5%" },
                { label: "SOC", top: "10%", right: "5%" },
                { label: "AWS", bottom: "15%", left: "5%" },
                { label: "Azure", bottom: "15%", right: "5%" },
              ].map((badge) => (
                <div
                  key={badge.label}
                  className="absolute px-2 py-1 rounded font-mono text-xs font-bold"
                  style={{
                    top: badge.top,
                    left: badge.left,
                    right: badge.right,
                    bottom: badge.bottom,
                    background: "oklch(0.14 0.025 240 / 0.9)",
                    border: "1px solid oklch(0.84 0.15 205 / 0.5)",
                    color: "oklch(0.84 0.15 205)",
                    boxShadow: "0 0 10px oklch(0.84 0.15 205 / 0.2)",
                  }}
                >
                  {badge.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-foreground/30">
          <span className="text-xs font-mono uppercase tracking-widest">
            Scroll
          </span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </div>
      </div>
    </section>
  );
}

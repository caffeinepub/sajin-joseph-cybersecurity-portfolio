import { ChevronDown, Download, LogIn, Mail } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ParticleBackground from "../ParticleBackground";

const BOOT_SEQUENCE = [
  {
    text: "Initializing Security Portfolio...",
    color: "oklch(0.75 0.025 240)",
  },
  { text: "Access Granted", color: "oklch(0.87 0.28 145)" },
  {
    text: "Welcome to Sajin Joseph Cybersecurity Lab",
    color: "oklch(0.84 0.15 205)",
  },
];

const ROLES = [
  "Cybersecurity Engineer",
  "SOC Analyst",
  "Threat Hunter",
  "Network Security Engineer",
];

function useCountUp(target: number, enabled: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    let start = 0;
    const duration = 1800;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, enabled]);
  return count;
}

function AnimatedStat({
  value,
  suffix,
  label,
}: {
  value: number;
  suffix: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const count = useCountUp(value, visible);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <div
        className="text-2xl font-bold font-mono"
        style={{ color: "oklch(0.87 0.28 145)" }}
      >
        {count}
        {suffix}
      </div>
      <div className="text-xs text-foreground/40 uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}

function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [completedLines, setCompletedLines] = useState<typeof BOOT_SEQUENCE>(
    [],
  );

  useEffect(() => {
    if (lineIdx >= BOOT_SEQUENCE.length) {
      const t = setTimeout(onComplete, 600);
      return () => clearTimeout(t);
    }
    const line = BOOT_SEQUENCE[lineIdx];
    if (charIdx < line.text.length) {
      const speed = lineIdx === 1 ? 60 : 45;
      const t = setTimeout(() => setCharIdx((c) => c + 1), speed);
      return () => clearTimeout(t);
    }
    const pause = lineIdx === 1 ? 700 : 400;
    const t = setTimeout(() => {
      setCompletedLines((prev) => [...prev, line]);
      setLineIdx((l) => l + 1);
      setCharIdx(0);
    }, pause);
    return () => clearTimeout(t);
  }, [lineIdx, charIdx, onComplete]);

  const currentEntry =
    lineIdx < BOOT_SEQUENCE.length ? BOOT_SEQUENCE[lineIdx] : null;
  const currentText = currentEntry ? currentEntry.text.slice(0, charIdx) : "";

  return (
    <div
      className="font-mono text-sm space-y-1 mb-6 p-3 rounded"
      style={{
        background: "oklch(0.09 0.022 240 / 0.6)",
        border: "1px solid oklch(0.87 0.28 145 / 0.2)",
        maxWidth: "520px",
      }}
    >
      {completedLines.map((entry) => (
        <div key={entry.text} className="flex items-start gap-2">
          <span style={{ color: "oklch(0.87 0.28 145 / 0.5)" }}>[SYSTEM]</span>
          <span style={{ color: entry.color }}>{entry.text}</span>
        </div>
      ))}
      {currentEntry && (
        <div className="flex items-start gap-2">
          <span style={{ color: "oklch(0.87 0.28 145 / 0.5)" }}>[SYSTEM]</span>
          <span style={{ color: currentEntry.color }}>
            {currentText}
            <span
              className="inline-block w-0.5 h-3.5 ml-0.5 align-middle"
              style={{
                background: "oklch(0.87 0.28 145)",
                animation: "caretBlink 1s step-end infinite",
              }}
            />
          </span>
        </div>
      )}
    </div>
  );
}

export default function Hero() {
  const [bootDone, setBootDone] = useState(false);
  const [roleIdx, setRoleIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!bootDone) return;
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
  }, [displayed, isDeleting, roleIdx, bootDone]);

  return (
    <section
      id="home"
      className="min-h-screen flex items-center relative z-10 hex-bg"
      style={{ overflow: "hidden" }}
    >
      <ParticleBackground />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24 w-full relative z-10">
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

            {/* Boot sequence or completed display */}
            {!bootDone ? (
              <BootSequence onComplete={() => setBootDone(true)} />
            ) : (
              <div
                className="font-mono text-sm p-3 rounded mb-2"
                style={{
                  background: "oklch(0.09 0.022 240 / 0.6)",
                  border: "1px solid oklch(0.87 0.28 145 / 0.2)",
                  maxWidth: "520px",
                }}
              >
                {BOOT_SEQUENCE.map((entry) => (
                  <div key={entry.text} className="flex items-start gap-2">
                    <span style={{ color: "oklch(0.87 0.28 145 / 0.5)" }}>
                      [SYSTEM]
                    </span>
                    <span style={{ color: entry.color }}>{entry.text}</span>
                  </div>
                ))}
              </div>
            )}

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
              {bootDone && (
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
              )}
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
              <a href="#about" data-ocid="hero.primary_button">
                <button
                  type="button"
                  className="btn-primary-neon cta-glow-pulse flex items-center gap-2 px-6 py-2.5"
                >
                  <LogIn className="w-4 h-4" />
                  Enter System
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

            <div className="flex gap-8 pt-4">
              <AnimatedStat value={3} suffix="+" label="Years Exp" />
              <AnimatedStat value={25} suffix="+" label="Tools Mastered" />
              <AnimatedStat value={11} suffix="+" label="Certifications" />
            </div>
          </div>

          {/* Right column */}
          <div className="hidden lg:flex items-center justify-center relative">
            <div className="relative w-[480px] h-[480px]">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, oklch(0.87 0.28 145 / 0.05) 0%, transparent 70%)",
                  border: "1px solid oklch(0.87 0.28 145 / 0.15)",
                }}
              />
              <img
                src="/assets/generated/hero-hex-network.dim_600x600.png"
                alt="Hex network cyber visualization"
                className="w-full h-full object-cover rounded-full"
                style={{
                  filter: "drop-shadow(0 0 40px oklch(0.87 0.28 145 / 0.3))",
                  mixBlendMode: "screen",
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src="/assets/generated/cyberpunk-avatar-sajin-v2.dim_600x600.png"
                  alt="Sajin Joseph"
                  className="w-64 h-64 rounded-full object-cover object-center"
                  style={{
                    filter: "drop-shadow(0 0 20px oklch(0.7 0.35 300 / 0.6))",
                  }}
                />
              </div>
              {[
                { label: "CEH", top: "10%", left: "5%" },
                { label: "SOC", top: "10%", right: "5%" },
                { label: "AWS", bottom: "15%", left: "5%" },
                { label: "Azure", bottom: "15%", right: "5%" },
              ].map((badge) => (
                <div
                  key={badge.label}
                  className="absolute px-2 py-1 rounded font-mono text-xs font-bold badge-shimmer"
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

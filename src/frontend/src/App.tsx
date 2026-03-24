import { Toaster } from "@/components/ui/sonner";
import { useEffect, useRef } from "react";
import Footer from "./components/Footer";
import HackerTerminal from "./components/HackerTerminal";
import MatrixBackground from "./components/MatrixBackground";
import Navbar from "./components/Navbar";
import Certifications from "./components/sections/Certifications";
import Contact from "./components/sections/Contact";
import Experience from "./components/sections/Experience";
import Hero from "./components/sections/Hero";
import Projects from "./components/sections/Projects";
import Skills from "./components/sections/Skills";

function useRevealOnScroll(ref: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) e.target.classList.add("visible");
        }
      },
      { threshold: 0.1 },
    );
    const elements = ref.current?.querySelectorAll(".section-reveal") ?? [];
    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
}

function TerminalSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  useRevealOnScroll(sectionRef);

  return (
    <section id="terminal" className="relative z-10 py-20" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Left: Terminal */}
          <div className="section-reveal">
            <div className="mb-6">
              <span
                className="font-mono text-sm tracking-widest uppercase"
                style={{ color: "oklch(0.87 0.28 145)" }}
              >
                {"// Interactive Shell"}
              </span>
              <h2 className="text-3xl font-bold mt-1 text-foreground">
                Hacker Terminal
              </h2>
              <p className="text-foreground/45 text-sm mt-2">
                Type{" "}
                <code
                  className="font-mono"
                  style={{ color: "oklch(0.87 0.28 145)" }}
                >
                  help
                </code>{" "}
                to explore available commands.
              </p>
            </div>
            <HackerTerminal />
          </div>

          {/* Right: About quick view */}
          <div className="section-reveal" style={{ transitionDelay: "150ms" }}>
            <div className="mb-6">
              <span
                className="font-mono text-sm tracking-widest uppercase"
                style={{ color: "oklch(0.84 0.15 205)" }}
              >
                {"// Quick Facts"}
              </span>
              <h2 className="text-3xl font-bold mt-1 text-foreground">
                About Me
              </h2>
            </div>
            <div
              className="cyber-card p-6"
              style={{
                borderColor: "oklch(0.84 0.15 205 / 0.3)",
                boxShadow: "0 0 25px oklch(0.84 0.15 205 / 0.08)",
              }}
            >
              <p className="text-foreground/60 text-sm leading-relaxed mb-6">
                I'm a Cybersecurity Engineer with 3+ years of hands-on
                experience protecting organizations from evolving cyber threats.
                I specialize in SOC operations, SIEM deployment, network
                security, endpoint defense, and incident response.
              </p>
              <p className="text-foreground/60 text-sm leading-relaxed mb-6">
                As the first point of contact for security intern teams at
                Upsmart Solutions, I coordinate daily SOC activities, mentor
                junior analysts, and ensure quality deliverables. I'm passionate
                about building secure infrastructure and analyzing attack
                patterns to prevent breaches before they happen.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Experience", val: "3+ Years" },
                  { label: "Current Role", val: "Security Analyst" },
                  { label: "Location", val: "Kerala, India" },
                  { label: "Focus Area", val: "SOC / Network Security" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-[oklch(0.11_0.02_240)] rounded p-3"
                  >
                    <div className="text-xs text-foreground/35 font-mono uppercase tracking-wider mb-0.5">
                      {item.label}
                    </div>
                    <div
                      className="text-sm font-semibold"
                      style={{ color: "oklch(0.87 0.28 145)" }}
                    >
                      {item.val}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <div className="relative min-h-screen">
      <MatrixBackground />
      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <Skills />
          <Projects />
          <TerminalSection />
          <Certifications />
          <Experience />
          <Contact />
        </main>
        <Footer />
      </div>
      <Toaster
        theme="dark"
        toastOptions={{
          style: {
            background: "oklch(0.14 0.025 240)",
            border: "1px solid oklch(0.87 0.28 145 / 0.4)",
            color: "oklch(0.95 0.015 240)",
          },
        }}
      />
    </div>
  );
}

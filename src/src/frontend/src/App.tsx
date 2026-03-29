import { Toaster } from "@/components/ui/sonner";
import { useEffect, useRef } from "react";
import Footer from "./components/Footer";
import GlobalThreatMap from "./components/GlobalThreatMap";
import KaliTerminal from "./components/KaliTerminal";
import MatrixBackground from "./components/MatrixBackground";
import Navbar from "./components/Navbar";
import NetworkTopologyDiagram from "./components/NetworkTopologyDiagram";
import SOCDashboard from "./components/SOCDashboard";
import Certifications from "./components/sections/Certifications";
import ChallengeMode from "./components/sections/ChallengeMode";
import Contact from "./components/sections/Contact";
import Hero from "./components/sections/Hero";
import Projects from "./components/sections/Projects";
import SimulationPage from "./components/sections/SimulationPage";
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
    const elements =
      ref.current?.querySelectorAll(
        ".section-reveal, .section-reveal-left, .section-reveal-right",
      ) ?? [];
    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
}

function SectionHeader({
  label,
  title,
  description,
}: { label: string; title: string; description?: string }) {
  return (
    <div className="mb-10 section-reveal">
      <span
        className="font-mono text-sm tracking-widest uppercase"
        style={{ color: "oklch(0.87 0.28 145)" }}
      >
        {label}
      </span>
      <h2 className="text-3xl font-bold mt-1 text-foreground">{title}</h2>
      {description && (
        <p className="text-foreground/45 text-sm mt-2">{description}</p>
      )}
      <div
        className="w-12 h-px mt-4"
        style={{ background: "oklch(0.87 0.28 145 / 0.5)" }}
      />
    </div>
  );
}

function TerminalSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  useRevealOnScroll(sectionRef);

  return (
    <section id="terminal" className="relative z-10 py-20" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="section-reveal mb-8">
          <span
            className="font-mono text-sm tracking-widest uppercase"
            style={{ color: "oklch(0.87 0.28 145)" }}
          >
            {"// Interactive Shell"}
          </span>
          <h2 className="text-3xl font-bold mt-1 text-foreground">
            Kali Linux Terminal
          </h2>
          <p className="text-foreground/45 text-sm mt-2">
            A live terminal simulator. Type{" "}
            <code
              className="font-mono"
              style={{ color: "oklch(0.87 0.28 145)" }}
            >
              help
            </code>{" "}
            to see all commands.
          </p>
        </div>
        <div className="section-reveal">
          <KaliTerminal />
        </div>
      </div>
    </section>
  );
}

function SOCTelemetrySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  useRevealOnScroll(sectionRef);

  return (
    <section
      id="soc-telemetry"
      className="relative z-10 py-20"
      ref={sectionRef}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader
          label="// Security Operations Centre"
          title="SOC Live Telemetry"
          description="Simulated real-time security operations dashboard with live-style metrics and global threat intelligence."
        />
        <div className="section-reveal mb-10">
          <SOCDashboard />
        </div>
        <div className="section-reveal mt-10">
          <div className="mb-6">
            <span
              className="font-mono text-sm tracking-widest uppercase"
              style={{ color: "oklch(0.84 0.15 205)" }}
            >
              {"// Global Attack Surface"}
            </span>
            <h3 className="text-2xl font-bold mt-1 text-foreground">
              Global Threat Map
            </h3>
            <p className="text-foreground/45 text-sm mt-1">
              Simulated real-time threat origin and target mapping across the
              globe.
            </p>
          </div>
          <GlobalThreatMap />
        </div>
      </div>
    </section>
  );
}

function NetworkTopologySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  useRevealOnScroll(sectionRef);

  return (
    <section
      id="network-topology"
      className="relative z-10 py-20"
      ref={sectionRef}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader
          label="// Enterprise Security Architecture"
          title="Enterprise Network Security Architecture"
          description="Simulated high-security multi-zone infrastructure with layered defense controls"
        />
        <div className="section-reveal">
          <NetworkTopologyDiagram />
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
          <SimulationPage />
          <SOCTelemetrySection />
          <NetworkTopologySection />
          <TerminalSection />
          <Certifications />
          <ChallengeMode />
          <Projects />
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

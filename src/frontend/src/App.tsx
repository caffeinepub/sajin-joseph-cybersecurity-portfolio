import { Toaster } from "@/components/ui/sonner";
import { useEffect, useRef, useState } from "react";
import Footer from "./components/Footer";
import GlobalThreatMap from "./components/GlobalThreatMap";
import InteractiveTerminal from "./components/InteractiveTerminal";
import KaliTerminal from "./components/KaliTerminal";
import LiveLogStream from "./components/LiveLogStream";
import MatrixBackground from "./components/MatrixBackground";
import Navbar from "./components/Navbar";
import NetworkTopologyDiagram from "./components/NetworkTopologyDiagram";
import SOCDashboard from "./components/SOCDashboard";
import About from "./components/sections/About";
import Certifications from "./components/sections/Certifications";
import ChallengeMode from "./components/sections/ChallengeMode";
import Contact from "./components/sections/Contact";
import Hero from "./components/sections/Hero";
import Projects from "./components/sections/Projects";
import SOCOperationsCenter from "./components/sections/SOCOperationsCenter";
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
        className="terminal-prompt font-mono text-sm tracking-widest uppercase"
        style={{ color: "oklch(0.87 0.28 145)" }}
      >
        {label}
      </span>
      <h2 className="text-3xl font-bold mt-1 text-foreground flex items-center gap-2">
        {title}
        <span className="cursor-blink" />
      </h2>
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
            className="terminal-prompt font-mono text-sm tracking-widest uppercase"
            style={{ color: "oklch(0.87 0.28 145)" }}
          >
            {"// Interactive Shell"}
          </span>
          <h2 className="text-3xl font-bold mt-1 text-foreground flex items-center gap-2">
            Kali Linux Terminal
            <span className="cursor-blink" />
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
              className="terminal-prompt font-mono text-sm tracking-widest uppercase"
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

function FloatingTerminal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="terminal-float-btn fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-lg font-mono text-sm font-bold transition-all duration-200 hover:scale-105 active:scale-95"
        style={{
          background: "#0a0a0a",
          border: "1px solid #00ff9f",
          color: "#00ff9f",
        }}
        data-ocid="terminal.open_modal_button"
      >
        <span className="text-base">&gt;_</span>
        <span>TERMINAL</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          data-ocid="terminal.modal"
        >
          <div className="relative w-full max-w-2xl">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute -top-10 right-0 font-mono text-sm z-10 flex items-center gap-1 transition-colors hover:opacity-100 opacity-70"
              style={{ color: "oklch(0.87 0.28 145)" }}
              data-ocid="terminal.close_button"
            >
              <span>✕</span>
              <span>close</span>
            </button>
            <InteractiveTerminal />
          </div>
        </div>
      )}
    </>
  );
}

export default function App() {
  return (
    <div className="relative min-h-screen">
      <LiveLogStream />
      <MatrixBackground />
      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <About />
          <Skills />
          <SimulationPage />
          <SOCTelemetrySection />
          <SOCOperationsCenter />
          <NetworkTopologySection />
          <TerminalSection />
          <Certifications />
          <ChallengeMode />
          <Projects />
          <Contact />
        </main>
        <Footer />
      </div>
      <FloatingTerminal />
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

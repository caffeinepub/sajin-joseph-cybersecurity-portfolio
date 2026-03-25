import { Toaster } from "@/components/ui/sonner";
import { useEffect, useRef } from "react";
import Footer from "./components/Footer";
import KaliTerminal from "./components/KaliTerminal";
import MatrixBackground from "./components/MatrixBackground";
import Navbar from "./components/Navbar";
import Certifications from "./components/sections/Certifications";
import Contact from "./components/sections/Contact";
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

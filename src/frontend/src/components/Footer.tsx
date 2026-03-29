import { FileDown, Github, Linkedin, Mail, Shield } from "lucide-react";

const RESUME_PATH =
  "/assets/uploads/sajinjosephresume2026-019d1d6c-8a89-7359-8205-81e4cb2f1e8f-1.pdf";

export default function Footer() {
  return (
    <footer className="relative z-10 mt-20 border-t border-[oklch(0.22_0.04_240)]">
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Main row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Identity */}
          <div className="flex flex-col items-center md:items-start gap-1">
            <div className="flex items-center gap-2">
              <Shield
                className="w-5 h-5"
                style={{ color: "oklch(0.87 0.28 145)" }}
              />
              <span
                className="font-mono font-bold text-base tracking-widest"
                style={{ color: "oklch(0.87 0.28 145)" }}
              >
                SAJIN JOSEPH
              </span>
            </div>
            <p className="text-xs font-mono tracking-widest text-foreground/40 uppercase">
              Cyber Security Engineer&nbsp;|&nbsp;Red Team | Blue Teaming
            </p>
          </div>

          {/* Social links + Resume */}
          <div className="flex items-center gap-4">
            <a
              href="https://www.linkedin.com/in/sajin-joseph-9471a9254/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="group flex items-center justify-center w-9 h-9 rounded border border-[oklch(0.22_0.04_240)] text-foreground/40 hover:border-[oklch(0.87_0.28_145)] hover:text-[oklch(0.87_0.28_145)] transition-all duration-200"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="group flex items-center justify-center w-9 h-9 rounded border border-[oklch(0.22_0.04_240)] text-foreground/40 hover:border-[oklch(0.87_0.28_145)] hover:text-[oklch(0.87_0.28_145)] transition-all duration-200"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="mailto:sajinjoseph363@gmail.com"
              aria-label="Email"
              className="group flex items-center justify-center w-9 h-9 rounded border border-[oklch(0.22_0.04_240)] text-foreground/40 hover:border-[oklch(0.87_0.28_145)] hover:text-[oklch(0.87_0.28_145)] transition-all duration-200"
            >
              <Mail className="w-4 h-4" />
            </a>
            <a
              href={RESUME_PATH}
              download
              aria-label="Download Resume"
              className="flex items-center gap-2 px-4 py-2 rounded border border-[oklch(0.87_0.28_145/0.4)] text-[oklch(0.87_0.28_145)] text-xs font-mono tracking-widest uppercase hover:bg-[oklch(0.87_0.28_145/0.08)] hover:border-[oklch(0.87_0.28_145)] transition-all duration-200"
            >
              <FileDown className="w-3.5 h-3.5" />
              Resume
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-[oklch(0.22_0.04_240/0.4)] flex items-center justify-center">
          <span className="text-xs font-mono text-foreground/25 tracking-wider">
            &copy; 2026 Sajin Joseph. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}

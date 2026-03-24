import { Shield } from "lucide-react";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Terminal", href: "#terminal" },
  { label: "Certs", href: "#certifications" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[oklch(0.09_0.022_240/0.95)] backdrop-blur-md border-b border-[oklch(0.87_0.28_145/0.3)]"
          : "bg-transparent border-b border-[oklch(0.22_0.04_240)]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <a
          href="#home"
          className="flex items-center gap-2"
          data-ocid="nav.link"
        >
          <Shield
            className="w-5 h-5"
            style={{ color: "oklch(0.87 0.28 145)" }}
          />
          <span
            className="font-mono font-bold text-lg"
            style={{ color: "oklch(0.87 0.28 145)" }}
          >
            SJ
          </span>
          <span className="text-foreground/60 font-medium text-sm hidden sm:inline">
            | Sajin Joseph
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="nav-link"
              data-ocid="nav.link"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden p-2 text-foreground/70 hover:text-neon transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ color: mobileOpen ? "oklch(0.87 0.28 145)" : undefined }}
          data-ocid="nav.toggle"
        >
          <span className="sr-only">Menu</span>
          <div className="flex flex-col gap-1">
            <span
              className={`block w-5 h-0.5 bg-current transition-transform ${mobileOpen ? "rotate-45 translate-y-1.5" : ""}`}
            />
            <span
              className={`block w-5 h-0.5 bg-current transition-opacity ${mobileOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block w-5 h-0.5 bg-current transition-transform ${mobileOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
            />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[oklch(0.10_0.022_240/0.97)] border-t border-[oklch(0.22_0.04_240)] px-4 py-3 flex flex-col gap-3">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="nav-link text-base py-1"
              onClick={() => setMobileOpen(false)}
              data-ocid="nav.link"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}

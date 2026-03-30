import { useEffect, useState } from "react";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Simulation", href: "#simulation" },
  { label: "SOC Ops", href: "#soc-ops" },
  { label: "Terminal", href: "#terminal" },
  { label: "Certs", href: "#certifications" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

function NavAvatar() {
  return (
    <a
      href="#home"
      className="nav-avatar-wrap flex items-center gap-2.5 group"
      aria-label="Scroll to top"
      data-ocid="nav.link"
    >
      {/* Avatar with animated neon ring */}
      <div className="nav-avatar-ring relative w-8 h-8 sm:w-10 sm:h-10 shrink-0">
        {/* Rotating + pulsing gradient ring */}
        <div className="nav-avatar-ring-outer absolute inset-[-3px] rounded-full" />
        {/* Inner image — explicit size attrs help browser render at correct DPR */}
        <img
          src="/assets/uploads/chatgpt_image_mar_30_2026_06_41_46_am-019d3c5e-e4d1-717a-a418-9279d135fed1-1.png"
          alt="Sajin Joseph"
          width={600}
          height={600}
          loading="eager"
          decoding="async"
          className="nav-avatar-img relative z-10 w-full h-full rounded-full object-cover object-center"
          style={{
            imageRendering: "auto",
            WebkitBackfaceVisibility: "hidden",
          }}
        />
      </div>
      <span className="text-foreground/60 font-medium text-sm hidden sm:inline transition-colors duration-200 group-hover:text-foreground/90">
        Sajin Joseph
      </span>
    </a>
  );
}

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
        <NavAvatar />

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

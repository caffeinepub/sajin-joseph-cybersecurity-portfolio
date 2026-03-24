import { Linkedin, Mail, Phone, Shield } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";

  return (
    <footer className="border-t border-[oklch(0.22_0.04_240)] mt-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <Shield
              className="w-5 h-5"
              style={{ color: "oklch(0.87 0.28 145)" }}
            />
            <span
              className="font-mono font-bold"
              style={{ color: "oklch(0.87 0.28 145)" }}
            >
              SJ
            </span>
            <span className="text-foreground/50 text-sm">
              Sajin Joseph — Cybersecurity Engineer
            </span>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-5">
            {["Home", "Skills", "Projects", "Experience", "Contact"].map(
              (item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-xs uppercase tracking-widest text-foreground/40 hover:text-neon transition-colors"
                  style={{ color: undefined }}
                  data-ocid="nav.link"
                >
                  {item}
                </a>
              ),
            )}
          </nav>

          {/* Social */}
          <div className="flex items-center gap-4">
            <a
              href="mailto:sajinjoseph363@gmail.com"
              className="text-foreground/40 hover:text-neon transition-colors"
              data-ocid="nav.link"
            >
              <Mail className="w-4 h-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/sajin-joseph-9471a9254/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/40 transition-colors"
              style={{}}
              data-ocid="nav.link"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="tel:+917994247021"
              className="text-foreground/40 hover:text-neon transition-colors"
              data-ocid="nav.link"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[oklch(0.22_0.04_240/0.5)] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-foreground/30">
          <span>© {year} Sajin Joseph. All rights reserved.</span>
          <span>
            Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground/60 transition-colors underline underline-offset-2"
            >
              caffeine.ai
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}

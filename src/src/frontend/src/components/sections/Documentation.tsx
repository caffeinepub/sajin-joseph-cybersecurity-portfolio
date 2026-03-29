import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Cpu,
  Database,
  FolderTree,
  GitBranch,
  Layers,
  Network,
  Palette,
  Zap,
} from "lucide-react";
import { useEffect, useRef } from "react";

const NEON = "oklch(0.87 0.28 145)";
const CYAN = "oklch(0.84 0.15 205)";
const CARD_BG = "oklch(0.14 0.025 240)";
const CODE_BG = "oklch(0.07 0.015 240)";
const BORDER_STD = "1px solid oklch(0.22 0.04 240)";

function SectionLabel({
  color,
  children,
}: { color: string; children: string }) {
  return (
    <span
      className="font-mono text-sm tracking-widest uppercase"
      style={{ color }}
    >
      {children}
    </span>
  );
}

function NeonDivider({ color }: { color: string }) {
  return (
    <div className="w-16 h-0.5 mx-auto mt-4" style={{ background: color }} />
  );
}

function CodeBlock({
  children,
  className = "",
}: { children: string; className?: string }) {
  return (
    <pre
      className={`rounded-lg p-4 overflow-x-auto text-xs leading-relaxed font-mono ${className}`}
      style={{
        background: CODE_BG,
        color: NEON,
        border: "1px solid oklch(0.87 0.28 145 / 0.2)",
      }}
    >
      <code>{children}</code>
    </pre>
  );
}

function TableCard({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto rounded-lg" style={{ border: BORDER_STD }}>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ background: CODE_BG }}>
            {headers.map((h) => (
              <th
                key={h}
                className="text-left px-4 py-3 font-mono text-xs tracking-wider uppercase"
                style={{ color: CYAN, borderBottom: BORDER_STD }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr
              key={row[0]}
              style={{
                background: ri % 2 === 0 ? "oklch(0.11 0.02 240)" : CARD_BG,
                borderBottom: "1px solid oklch(0.16 0.03 240)",
              }}
            >
              {row.map((cell, ci) => (
                <td
                  key={cell}
                  className="px-4 py-3 text-foreground/70"
                  style={
                    ci === 0
                      ? { color: NEON, fontFamily: "JetBrains Mono, monospace" }
                      : {}
                  }
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FlowStep({
  step,
  label,
  sublabel,
  color,
  last,
}: {
  step: string;
  label: string;
  sublabel?: string;
  color: string;
  last?: boolean;
}) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="rounded-lg px-4 py-3 text-center min-w-[160px]"
        style={{
          background: CARD_BG,
          border: `1px solid ${color}`,
          boxShadow: `0 0 12px ${color}33`,
        }}
      >
        <div className="font-mono text-xs mb-1" style={{ color }}>
          {step}
        </div>
        <div className="text-foreground font-semibold text-sm">{label}</div>
        {sublabel && (
          <div className="text-foreground/40 text-xs mt-0.5">{sublabel}</div>
        )}
      </div>
      {!last && (
        <div className="flex flex-col items-center my-1">
          <div className="w-0.5 h-4" style={{ background: `${color}66` }} />
          <div
            className="text-xs font-mono"
            style={{ color: `${color}99`, fontSize: "10px", lineHeight: 1 }}
          >
            ▼
          </div>
        </div>
      )}
    </div>
  );
}

// Overview Tab
function TabOverview() {
  const stats = [
    { label: "Platform", val: "Internet Computer (ICP)", color: NEON },
    { label: "Frontend", val: "React 19 + TypeScript", color: CYAN },
    { label: "Backend", val: "Motoko Smart Contract", color: NEON },
    { label: "Styling", val: "Tailwind CSS + OKLCH", color: CYAN },
    { label: "Sections", val: "10 Portfolio Sections", color: NEON },
    { label: "Certifications", val: "11 Displayed Badges", color: CYAN },
    { label: "Projects", val: "5 Security Labs", color: NEON },
    { label: "Hosting", val: "On-Chain — No AWS/GCP", color: CYAN },
  ];

  return (
    <div className="space-y-8">
      <div
        className="rounded-xl p-6"
        style={{ background: CODE_BG, border: `1px solid ${NEON}33` }}
      >
        <div className="flex items-start gap-4">
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: `${NEON}18`, border: `1px solid ${NEON}55` }}
          >
            <BookOpen className="w-6 h-6" style={{ color: NEON }} />
          </div>
          <div>
            <h3 className="text-foreground font-bold text-lg">
              Sajin Joseph — Cybersecurity Portfolio
            </h3>
            <p className="text-foreground/50 text-sm mt-1 leading-relaxed">
              A personal portfolio website built for a Cybersecurity Engineer
              specializing in SOC operations, SIEM deployment, network security,
              and incident response. Designed to impress recruiters for
              SOC/Security Engineering roles with technical depth and premium
              presentation.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {["Cybersecurity", "SOC", "Portfolio", "ICP", "Motoko"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="text-xs font-mono px-2 py-0.5 rounded"
                    style={{
                      background: `${NEON}15`,
                      border: `1px solid ${NEON}40`,
                      color: NEON,
                    }}
                  >
                    {tag}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-lg p-4 text-center"
            style={{ background: CARD_BG, border: BORDER_STD }}
          >
            <div className="font-bold text-sm mb-1" style={{ color: s.color }}>
              {s.val}
            </div>
            <div className="text-foreground/40 text-xs font-mono uppercase tracking-wider">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          className="rounded-lg p-4"
          style={{ background: CARD_BG, border: `1px solid ${CYAN}33` }}
        >
          <div className="font-mono text-xs mb-3" style={{ color: CYAN }}>
            {"// Live URL"}
          </div>
          <a
            href="https://theoretical-peach-p6b-draft.caffeine.xyz/"
            target="_blank"
            rel="noreferrer"
            className="text-sm break-all hover:underline"
            style={{ color: NEON }}
          >
            https://theoretical-peach-p6b-draft.caffeine.xyz/
          </a>
        </div>
        <div
          className="rounded-lg p-4"
          style={{ background: CARD_BG, border: `1px solid ${NEON}33` }}
        >
          <div className="font-mono text-xs mb-3" style={{ color: NEON }}>
            {"// Built With"}
          </div>
          <div className="text-sm text-foreground/60">
            Caffeine.ai — Serverless Web3 App Platform on the Internet Computer
          </div>
        </div>
      </div>
    </div>
  );
}

// Tech Stack Tab
function TabTechStack() {
  return (
    <div className="space-y-6">
      <p className="text-foreground/50 text-sm">
        Every layer of this portfolio runs on-chain on the Internet Computer —
        no external cloud providers, no centralized servers.
      </p>
      <TableCard
        headers={["Layer", "Technology", "Purpose"]}
        rows={[
          [
            "Blockchain",
            "Internet Computer (ICP)",
            "Hosting — decentralized, no AWS/GCP",
          ],
          ["Backend", "Motoko", "Smart contract logic, compiled to Wasm"],
          [
            "Frontend",
            "React 19 + TypeScript",
            "UI rendering and component tree",
          ],
          [
            "Styling",
            "Tailwind CSS v3 + OKLCH",
            "Design system with perceptual color space",
          ],
          [
            "UI Components",
            "Radix UI + shadcn/ui",
            "Accessible, unstyled component primitives",
          ],
          [
            "Icons",
            "Lucide React",
            "Consistent icon set across all components",
          ],
          ["Build Tool", "Vite", "Frontend bundler with HMR and path aliases"],
          ["Linter", "Biome", "Code quality, formatting, and lint rules"],
          [
            "State/Queries",
            "TanStack Query v5",
            "Backend data fetching and caching",
          ],
          [
            "Fonts",
            "Plus Jakarta Sans + JetBrains Mono",
            "Body typography + monospace for terminal",
          ],
          [
            "Animations",
            "Canvas API + CSS",
            "Matrix rain background + scroll reveals",
          ],
          ["Notifications", "Sonner", "Toast alerts for contact form feedback"],
        ]}
      />
    </div>
  );
}

// File Structure Tab
function TabFileStructure() {
  const tree = `/workspace
├── src/
│   ├── backend/
│   │   ├── main.mo              ← Motoko smart contract (backend logic)
│   │   ├── canister.yaml        ← Backend deployment config
│   │   └── system-idl/         ← ICP system interface definitions
│   └── frontend/
│       ├── index.html           ← HTML shell, font preloads, SEO meta
│       ├── package.json         ← npm dependencies (frozen lockfile)
│       ├── vite.config.js       ← Build config + @/ path alias
│       ├── tailwind.config.js   ← Design tokens, colors, animations
│       ├── tsconfig.json        ← TypeScript compiler settings
│       ├── biome.json           ← Linter/formatter rules
│       └── src/
│           ├── main.tsx         ← React entry point, QueryClientProvider
│           ├── App.tsx          ← Root layout, section order, scroll reveal
│           ├── index.css        ← Global styles, OKLCH tokens, animations
│           ├── backend.ts       ← ICP agent connection (auto-generated)
│           ├── backend.d.ts     ← Backend TypeScript types (auto-generated)
│           ├── config.ts        ← Runtime canister ID config
│           ├── hooks/
│           │   ├── useQueries.ts       ← Contact form backend calls
│           │   ├── useActor.ts         ← ICP actor/agent connection
│           │   ├── useInternetIdentity.ts ← Auth hook
│           │   └── use-mobile.tsx      ← Responsive breakpoint hook
│           ├── lib/
│           │   └── utils.ts     ← Tailwind cn() class merger
│           └── components/
│               ├── Navbar.tsx          ← Navigation bar (sticky, mobile-ready)
│               ├── Footer.tsx          ← Page footer with Caffeine attribution
│               ├── MatrixBackground.tsx← Animated canvas matrix rain
│               ├── HackerTerminal.tsx  ← Interactive CLI terminal
│               └── sections/
│                   ├── Hero.tsx        ← #home — typewriter, stats, CTAs
│                   ├── Skills.tsx      ← #skills — 10 category cards
│                   ├── Projects.tsx    ← #projects — 5 lab project cards
│                   ├── Certifications.tsx ← #certifications — 11 badges
│                   ├── Experience.tsx  ← #experience — vertical timeline
│                   ├── Contact.tsx     ← #contact — form + social links
│                   └── Documentation.tsx ← #docs — this technical reference`;

  return (
    <div className="space-y-4">
      <p className="text-foreground/50 text-sm">
        Project file tree annotated with each file's role in the website.
      </p>
      <CodeBlock>{tree}</CodeBlock>
    </div>
  );
}

// Architecture Tab
function TabArchitecture() {
  return (
    <div className="space-y-6">
      <p className="text-foreground/50 text-sm">
        The entire portfolio runs on the Internet Computer blockchain — no
        external cloud, no servers, no downtime.
      </p>
      <div
        className="rounded-xl p-6"
        style={{ background: CODE_BG, border: BORDER_STD }}
      >
        <div className="text-center mb-6">
          <span
            className="font-mono text-xs tracking-widest uppercase"
            style={{ color: CYAN }}
          >
            Internet Computer (ICP) — No External Servers
          </span>
        </div>

        <div
          className="rounded-xl p-5 mb-6"
          style={{ border: `1px dashed ${CYAN}55`, background: `${CYAN}06` }}
        >
          <div className="text-center mb-5">
            <span className="text-xs font-mono" style={{ color: CYAN }}>
              🌐 ICP Network
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              className="rounded-lg p-4"
              style={{
                background: CARD_BG,
                border: `1px solid ${NEON}55`,
                boxShadow: `0 0 20px ${NEON}18`,
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Cpu className="w-4 h-4" style={{ color: NEON }} />
                <span className="font-bold text-sm text-foreground">
                  Backend Canister
                </span>
              </div>
              <div className="font-mono text-xs mb-2" style={{ color: NEON }}>
                Motoko → Wasm
              </div>
              <ul className="text-xs text-foreground/50 space-y-1">
                <li>▸ Contact form message store</li>
                <li>▸ Map&lt;Text, ContactMessage&gt;</li>
                <li>▸ submitContactMessage() — update</li>
                <li>▸ getAllMessages() — query</li>
              </ul>
            </div>

            <div
              className="rounded-lg p-4"
              style={{
                background: CARD_BG,
                border: `1px solid ${CYAN}55`,
                boxShadow: `0 0 20px ${CYAN}18`,
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Layers className="w-4 h-4" style={{ color: CYAN }} />
                <span className="font-bold text-sm text-foreground">
                  Frontend Canister
                </span>
              </div>
              <div className="font-mono text-xs mb-2" style={{ color: CYAN }}>
                React 19 + TypeScript
              </div>
              <ul className="text-xs text-foreground/50 space-y-1">
                <li>▸ Hero / Skills / Projects</li>
                <li>▸ Certifications / Experience</li>
                <li>▸ Terminal / Contact / Docs</li>
                <li>▸ Static assets (resume PDF)</li>
              </ul>
            </div>
          </div>

          <div className="flex items-center justify-center mt-4 gap-3">
            <div className="h-0.5 flex-1" style={{ background: `${NEON}33` }} />
            <span className="text-xs font-mono text-foreground/40 px-2">
              ICP Agent calls
            </span>
            <div className="h-0.5 flex-1" style={{ background: `${CYAN}33` }} />
          </div>
        </div>

        <div className="flex flex-col items-center my-4">
          <div className="w-0.5 h-6" style={{ background: `${NEON}44` }} />
          <div className="text-xs font-mono" style={{ color: `${NEON}77` }}>
            ▼
          </div>
          <div className="text-xs font-mono text-foreground/30 mt-1">
            HTTP Request
          </div>
        </div>

        <div
          className="rounded-lg p-4 mx-auto max-w-xs text-center"
          style={{ background: CARD_BG, border: BORDER_STD }}
        >
          <Network
            className="w-5 h-5 mx-auto mb-2"
            style={{ color: "oklch(0.7 0.1 70)" }}
          />
          <div className="font-bold text-sm text-foreground">
            User / Recruiter
          </div>
          <div className="text-xs text-foreground/40 font-mono mt-1">
            Browser (any device)
          </div>
        </div>
      </div>
    </div>
  );
}

// Components Tab
function TabComponents() {
  return (
    <div className="space-y-4">
      <p className="text-foreground/50 text-sm">
        Every component in the portfolio, its source file, and its role.
      </p>
      <TableCard
        headers={["Component", "File", "Section", "Description"]}
        rows={[
          [
            "MatrixBackground",
            "MatrixBackground.tsx",
            "Always visible",
            "Canvas rain animation — katakana + ASCII chars, 45ms interval",
          ],
          [
            "Navbar",
            "Navbar.tsx",
            "Always visible",
            "Sticky top nav with smooth-scroll links and mobile hamburger",
          ],
          [
            "Hero",
            "sections/Hero.tsx",
            "#home",
            "Typewriter title cycling roles, animated stats, CTA buttons, hex network visual",
          ],
          [
            "Skills",
            "sections/Skills.tsx",
            "#skills",
            "10 category cards with tool lists, staggered reveal, responsive 5-col grid",
          ],
          [
            "Projects",
            "sections/Projects.tsx",
            "#projects",
            "5 lab project cards with tool badges and 3-col grid layout",
          ],
          [
            "HackerTerminal",
            "HackerTerminal.tsx",
            "#terminal",
            "Interactive CLI: help, about, skills, projects, contact, clear commands",
          ],
          [
            "Certifications",
            "sections/Certifications.tsx",
            "#certifications",
            "11 cert badges; highlighted ones glow with neon green aura",
          ],
          [
            "Experience",
            "sections/Experience.tsx",
            "#experience",
            "Vertical timeline: education + 3 jobs with bullet points",
          ],
          [
            "Contact",
            "sections/Contact.tsx",
            "#contact",
            "Contact form wired to Motoko backend + email / LinkedIn / phone links",
          ],
          [
            "Documentation",
            "sections/Documentation.tsx",
            "#docs",
            "This page — full technical reference with 8 tabbed sections",
          ],
          [
            "Footer",
            "Footer.tsx",
            "Bottom",
            "Copyright, social links, Caffeine attribution",
          ],
        ]}
      />
    </div>
  );
}

// Data Flow helpers
function DataFlowDiagram({
  title,
  color,
  steps,
}: {
  title: string;
  color: string;
  steps: { label: string; sublabel?: string }[];
}) {
  return (
    <div
      className="rounded-lg p-5"
      style={{ background: CARD_BG, border: BORDER_STD }}
    >
      <div
        className="font-mono text-xs mb-5"
        style={{ color }}
      >{`// ${title}`}</div>
      <div className="flex flex-col items-center">
        {steps.map((s, i) => (
          <FlowStep
            key={s.label}
            step={`[${String(i + 1).padStart(2, "0")}]`}
            label={s.label}
            sublabel={s.sublabel}
            color={color}
            last={i === steps.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

function TabDataFlow() {
  return (
    <div className="space-y-6">
      <p className="text-foreground/50 text-sm">
        Step-by-step data flow for the three main runtime operations.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DataFlowDiagram
          title="Contact Form"
          color={NEON}
          steps={[
            { label: "Contact.tsx", sublabel: "Form UI + validation" },
            { label: "useQueries.ts", sublabel: "TanStack mutation" },
            { label: "backend.ts", sublabel: "ICP agent call" },
            { label: "main.mo", sublabel: "Motoko canister" },
            { label: "Map<Text, Msg>", sublabel: "On-chain storage" },
            { label: "onSuccess", sublabel: "Toast + success state" },
          ]}
        />
        <DataFlowDiagram
          title="Resume Download"
          color={CYAN}
          steps={[
            { label: "Hero.tsx", sublabel: "Download Resume button" },
            { label: "<a href>", sublabel: "Direct file link" },
            { label: "/assets/uploads/", sublabel: "Frontend canister CDN" },
            {
              label: "sajinjoseph-resume.pdf",
              sublabel: "Served as static asset",
            },
          ]}
        />
        <DataFlowDiagram
          title="Scroll Animations"
          color="oklch(0.75 0.12 290)"
          steps={[
            { label: "App.tsx mount", sublabel: "useRevealOnScroll hook" },
            { label: "IntersectionObserver", sublabel: "threshold: 0.1" },
            { label: ".section-reveal", sublabel: "Watches all elements" },
            { label: "adds .visible", sublabel: "When 10% in viewport" },
            {
              label: "CSS transition",
              sublabel: "opacity 0→1, translateY 20→0",
            },
          ]}
        />
      </div>
    </div>
  );
}

// Design System Tab
function ColorSwatch({
  name,
  value,
  desc,
}: { name: string; value: string; desc: string }) {
  return (
    <div
      className="flex items-center gap-3 rounded-lg px-4 py-3"
      style={{ background: CARD_BG, border: BORDER_STD }}
    >
      <div
        className="w-8 h-8 rounded flex-shrink-0"
        style={{ background: value, boxShadow: `0 0 8px ${value}88` }}
      />
      <div className="min-w-0">
        <div className="font-mono text-xs font-bold" style={{ color: value }}>
          {name}
        </div>
        <div className="font-mono text-xs text-foreground/40 truncate">
          {value}
        </div>
        <div className="text-xs text-foreground/50 mt-0.5">{desc}</div>
      </div>
    </div>
  );
}

function TabDesignSystem() {
  const colors = [
    {
      name: "neon.green",
      value: "oklch(0.87 0.28 145)",
      desc: "Primary accent — buttons, highlights, borders",
    },
    {
      name: "neon.cyan",
      value: "oklch(0.84 0.15 205)",
      desc: "Secondary accent — labels, alternate borders",
    },
    {
      name: "cyber.dark",
      value: "oklch(0.085 0.022 240)",
      desc: "Page background",
    },
    {
      name: "cyber.card",
      value: "oklch(0.14 0.025 240)",
      desc: "Card surface",
    },
    {
      name: "cyber.border",
      value: "oklch(0.22 0.04 240)",
      desc: "Card and table borders",
    },
    {
      name: "foreground",
      value: "oklch(0.95 0.015 240)",
      desc: "Primary text",
    },
  ];

  const fonts = [
    { name: "Plus Jakarta Sans", use: "Body text, headings, navigation" },
    { name: "JetBrains Mono", use: "Code blocks, terminal, section labels" },
  ];

  const classes = [
    { name: ".cyber-card", desc: "Dark card with neon border + glow shadow" },
    { name: ".btn-neon", desc: "Outlined neon green button with glow hover" },
    {
      name: ".btn-primary-neon",
      desc: "Solid neon green button with text shadow",
    },
    {
      name: ".section-reveal",
      desc: "Initial opacity:0 translateY:20px — transitions to visible",
    },
    { name: ".hex-bg", desc: "SVG hexagonal grid background pattern" },
    {
      name: ".timeline-line",
      desc: "Vertical gradient line for experience timeline",
    },
    {
      name: ".nav-link",
      desc: "Monospace nav link with neon hover underline animation",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <div className="font-mono text-xs mb-3" style={{ color: CYAN }}>
          {"// Color Palette (OKLCH)"}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {colors.map((c) => (
            <ColorSwatch key={c.name} {...c} />
          ))}
        </div>
      </div>

      <div>
        <div className="font-mono text-xs mb-3" style={{ color: CYAN }}>
          {"// Typography"}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {fonts.map((f) => (
            <div
              key={f.name}
              className="rounded-lg px-4 py-3"
              style={{ background: CARD_BG, border: BORDER_STD }}
            >
              <div className="font-semibold text-foreground text-sm">
                {f.name}
              </div>
              <div className="text-foreground/40 text-xs mt-1">{f.use}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="font-mono text-xs mb-3" style={{ color: CYAN }}>
          {"// Custom CSS Classes"}
        </div>
        <TableCard
          headers={["Class", "Description"]}
          rows={classes.map((c) => [c.name, c.desc])}
        />
      </div>
    </div>
  );
}

// Backend API Tab
function TabBackendAPI() {
  const motokoType = `type ContactMessage = {
  name      : Text;
  email     : Text;
  message   : Text;
  timestamp : Time.Time;
};

// Storage
var messages : Map.Map<Text, ContactMessage> = Map.new();

// Imports used
import Map   "mo:base/HashMap";
import Text  "mo:base/Text";
import Time  "mo:base/Time";
import Iter  "mo:base/Iter";`;

  return (
    <div className="space-y-6">
      <div>
        <div className="font-mono text-xs mb-3" style={{ color: NEON }}>
          {"// Motoko Type Definition"}
        </div>
        <CodeBlock>{motokoType}</CodeBlock>
      </div>

      <div>
        <div className="font-mono text-xs mb-3" style={{ color: NEON }}>
          {"// Public API"}
        </div>
        <TableCard
          headers={["Function", "Call Type", "Description"]}
          rows={[
            [
              "submitContactMessage(name, email, message)",
              "update call",
              "Validates & stores a contact message on-chain with timestamp",
            ],
            [
              "getAllMessages()",
              "query call",
              "Returns all stored contact messages sorted by timestamp",
            ],
          ]}
        />
      </div>

      <div
        className="rounded-lg p-4"
        style={{ background: CARD_BG, border: `1px solid ${CYAN}33` }}
      >
        <div className="font-mono text-xs mb-2" style={{ color: CYAN }}>
          {"// Call Type Differences"}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="font-bold mb-1" style={{ color: NEON }}>
              Update Calls
            </div>
            <ul className="text-foreground/50 text-xs space-y-1">
              <li>▸ Mutates canister state</li>
              <li>▸ Goes through consensus (~2s)</li>
              <li>▸ Permanently recorded</li>
            </ul>
          </div>
          <div>
            <div className="font-bold mb-1" style={{ color: CYAN }}>
              Query Calls
            </div>
            <ul className="text-foreground/50 text-xs space-y-1">
              <li>▸ Read-only, no state changes</li>
              <li>▸ Near-instant (~200ms)</li>
              <li>▸ Served from single replica</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Component
const TABS = [
  { value: "overview", label: "Overview", icon: BookOpen },
  { value: "techstack", label: "Tech Stack", icon: Zap },
  { value: "files", label: "File Structure", icon: FolderTree },
  { value: "architecture", label: "Architecture", icon: Network },
  { value: "components", label: "Components", icon: Layers },
  { value: "dataflow", label: "Data Flow", icon: GitBranch },
  { value: "design", label: "Design System", icon: Palette },
  { value: "backend", label: "Backend API", icon: Database },
];

export default function Documentation() {
  const sectionRef = useRef<HTMLDivElement>(null);

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
      sectionRef.current?.querySelectorAll(".section-reveal") ?? [];
    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="docs" className="relative z-10 py-24" ref={sectionRef}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14 section-reveal">
          <SectionLabel color={NEON}>{"// Technical Reference"}</SectionLabel>
          <h2 className="text-4xl font-bold mt-2 text-foreground">
            Documentation
          </h2>
          <p className="text-foreground/40 text-sm mt-3 max-w-xl mx-auto">
            Complete technical reference for the portfolio website —
            architecture, file structure, component map, data flows, and design
            system.
          </p>
          <NeonDivider color={NEON} />
        </div>

        <div className="section-reveal">
          <Tabs defaultValue="overview">
            <TabsList
              className="flex flex-wrap gap-1 h-auto p-1 mb-8 rounded-xl w-full"
              style={{ background: "oklch(0.10 0.02 240)", border: BORDER_STD }}
            >
              {TABS.map((t) => {
                const Icon = t.icon;
                return (
                  <TabsTrigger
                    key={t.value}
                    value={t.value}
                    className="flex items-center gap-1.5 text-xs font-mono px-3 py-2 rounded-lg transition-all"
                    style={{ flex: "1 1 auto" }}
                    data-ocid={`docs.${t.value}.tab`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{t.label}</span>
                    <span className="sm:hidden">{t.label.split(" ")[0]}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <div
              className="rounded-xl p-6"
              style={{ background: CODE_BG, border: BORDER_STD }}
            >
              <TabsContent value="overview" className="mt-0">
                <TabOverview />
              </TabsContent>
              <TabsContent value="techstack" className="mt-0">
                <TabTechStack />
              </TabsContent>
              <TabsContent value="files" className="mt-0">
                <TabFileStructure />
              </TabsContent>
              <TabsContent value="architecture" className="mt-0">
                <TabArchitecture />
              </TabsContent>
              <TabsContent value="components" className="mt-0">
                <TabComponents />
              </TabsContent>
              <TabsContent value="dataflow" className="mt-0">
                <TabDataFlow />
              </TabsContent>
              <TabsContent value="design" className="mt-0">
                <TabDesignSystem />
              </TabsContent>
              <TabsContent value="backend" className="mt-0">
                <TabBackendAPI />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </section>
  );
}

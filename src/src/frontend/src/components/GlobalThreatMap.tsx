import { useEffect, useRef, useState } from "react";

const THREAT_DOTS = [
  { id: 1, x: 480, y: 130, label: "Moscow", type: "attacker" },
  { id: 2, x: 520, y: 160, label: "Beijing", type: "attacker" },
  { id: 3, x: 200, y: 155, label: "New York", type: "target" },
  { id: 4, x: 430, y: 170, label: "Frankfurt", type: "target" },
  { id: 5, x: 160, y: 200, label: "São Paulo", type: "target" },
  { id: 6, x: 590, y: 220, label: "Jakarta", type: "attacker" },
  { id: 7, x: 610, y: 140, label: "Seoul", type: "attacker" },
  { id: 8, x: 380, y: 250, label: "Lagos", type: "target" },
  { id: 9, x: 240, y: 145, label: "Chicago", type: "target" },
  { id: 10, x: 470, y: 200, label: "Cairo", type: "attacker" },
  { id: 11, x: 560, y: 175, label: "Mumbai", type: "target" },
  { id: 12, x: 130, y: 130, label: "Vancouver", type: "target" },
];

const ARCS = [
  { key: "arc-0-2", from: 0, to: 2 },
  { key: "arc-1-3", from: 1, to: 3 },
  { key: "arc-6-3", from: 6, to: 3 },
  { key: "arc-0-8", from: 0, to: 8 },
  { key: "arc-9-3", from: 9, to: 3 },
  { key: "arc-5-10", from: 5, to: 10 },
  { key: "arc-1-2", from: 1, to: 2 },
  { key: "arc-6-11", from: 6, to: 11 },
];

function getArcPath(x1: number, y1: number, x2: number, y2: number) {
  const mx = (x1 + x2) / 2;
  const my = Math.min(y1, y2) - 60;
  return `M${x1},${y1} Q${mx},${my} ${x2},${y2}`;
}

function getPathLength(x1: number, y1: number, x2: number, y2: number) {
  const mx = (x1 + x2) / 2;
  const my = Math.min(y1, y2) - 60;
  const dx1 = mx - x1;
  const dy1 = my - y1;
  const dx2 = x2 - mx;
  const dy2 = y2 - my;
  return Math.sqrt(dx1 * dx1 + dy1 * dy1) + Math.sqrt(dx2 * dx2 + dy2 * dy2);
}

export default function GlobalThreatMap() {
  const [counters, setCounters] = useState({
    blocked: 14872,
    active: 47,
    countries: 23,
    alertsPerMin: 312,
  });
  const [arcPhase, setArcPhase] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCounters((prev) => ({
        blocked: prev.blocked + Math.floor(Math.random() * 12 + 1),
        active: Math.max(30, prev.active + Math.floor(Math.random() * 7) - 3),
        countries: Math.max(
          18,
          Math.min(31, prev.countries + (Math.random() > 0.7 ? 1 : 0)),
        ),
        alertsPerMin: Math.max(
          280,
          Math.min(
            400,
            prev.alertsPerMin + Math.floor(Math.random() * 20) - 10,
          ),
        ),
      }));
      setArcPhase((p) => (p + 1) % 100);
    }, 2500);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="cyber-card p-4 sm:p-6">
      <div
        className="relative overflow-hidden rounded-lg"
        style={{
          background: "oklch(0.09 0.018 240)",
          border: "1px solid oklch(0.22 0.04 240)",
        }}
      >
        <svg
          role="img"
          aria-label="Simulated global threat map showing attack origins and targets"
          viewBox="0 0 760 330"
          className="w-full"
          style={{ display: "block" }}
        >
          <defs>
            <pattern
              id="scanlines"
              x="0"
              y="0"
              width="760"
              height="4"
              patternUnits="userSpaceOnUse"
            >
              <line
                x1="0"
                y1="0"
                x2="760"
                y2="0"
                stroke="oklch(0.87 0.28 145 / 0.03)"
                strokeWidth="1"
              />
            </pattern>
          </defs>

          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <line
              key={`hgrid-${i}`}
              x1="0"
              y1={i * 55}
              x2="760"
              y2={i * 55}
              stroke="oklch(0.87 0.28 145 / 0.05)"
              strokeWidth="1"
            />
          ))}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <line
              key={`vgrid-${i}`}
              x1={i * 76}
              y1="0"
              x2={i * 76}
              y2="330"
              stroke="oklch(0.87 0.28 145 / 0.05)"
              strokeWidth="1"
            />
          ))}

          {/* Continent blobs */}
          <ellipse
            cx="195"
            cy="150"
            rx="100"
            ry="75"
            fill="oklch(0.18 0.03 240)"
            stroke="oklch(0.87 0.28 145 / 0.12)"
            strokeWidth="1"
          />
          <ellipse
            cx="215"
            cy="235"
            rx="55"
            ry="70"
            fill="oklch(0.18 0.03 240)"
            stroke="oklch(0.87 0.28 145 / 0.12)"
            strokeWidth="1"
          />
          <ellipse
            cx="420"
            cy="145"
            rx="60"
            ry="50"
            fill="oklch(0.18 0.03 240)"
            stroke="oklch(0.87 0.28 145 / 0.12)"
            strokeWidth="1"
          />
          <ellipse
            cx="420"
            cy="230"
            rx="60"
            ry="75"
            fill="oklch(0.18 0.03 240)"
            stroke="oklch(0.87 0.28 145 / 0.12)"
            strokeWidth="1"
          />
          <ellipse
            cx="550"
            cy="155"
            rx="130"
            ry="85"
            fill="oklch(0.18 0.03 240)"
            stroke="oklch(0.87 0.28 145 / 0.12)"
            strokeWidth="1"
          />
          <ellipse
            cx="640"
            cy="255"
            rx="50"
            ry="35"
            fill="oklch(0.18 0.03 240)"
            stroke="oklch(0.87 0.28 145 / 0.12)"
            strokeWidth="1"
          />

          {/* Attack arcs */}
          {ARCS.map((arc, idx) => {
            const from = THREAT_DOTS[arc.from];
            const to = THREAT_DOTS[arc.to];
            const pathLen = getPathLength(from.x, from.y, to.x, to.y);
            const offset = ((arcPhase * 3 + idx * 33) % 100) / 100;
            const dashLen = pathLen * 0.35;
            const dashOffset = pathLen - offset * pathLen;
            return (
              <path
                key={arc.key}
                d={getArcPath(from.x, from.y, to.x, to.y)}
                fill="none"
                stroke="oklch(0.65 0.28 25 / 0.7)"
                strokeWidth="1.5"
                strokeDasharray={`${dashLen} ${pathLen - dashLen}`}
                strokeDashoffset={dashOffset}
                style={{ willChange: "stroke-dashoffset" }}
              />
            );
          })}

          {/* Threat dots */}
          {THREAT_DOTS.map((dot, i) => {
            const isAttacker = dot.type === "attacker";
            const color = isAttacker
              ? "oklch(0.65 0.28 25)"
              : "oklch(0.87 0.28 145)";
            const pulseDelay = `${i * 0.4}s`;
            return (
              <g key={dot.id}>
                <circle
                  cx={dot.x}
                  cy={dot.y}
                  r="10"
                  fill="none"
                  stroke={color}
                  strokeWidth="1"
                  opacity="0.4"
                  style={{
                    animation: `pulse-ring 2s ease-out ${pulseDelay} infinite`,
                    willChange: "transform, opacity",
                  }}
                />
                <circle
                  cx={dot.x}
                  cy={dot.y}
                  r="4"
                  fill={color}
                  style={{
                    filter: `drop-shadow(0 0 6px ${color})`,
                    animation: `pulse-dot 1.8s ease-in-out ${pulseDelay} infinite`,
                  }}
                />
                <text
                  x={dot.x + 7}
                  y={dot.y - 6}
                  fontSize="8"
                  fill={color}
                  fontFamily="JetBrains Mono, monospace"
                  opacity="0.75"
                >
                  {dot.label}
                </text>
              </g>
            );
          })}

          <rect
            x="0"
            y="0"
            width="760"
            height="330"
            fill="url(#scanlines)"
            pointerEvents="none"
          />
        </svg>

        <div
          className="absolute top-2 right-3 flex gap-3 text-xs font-mono"
          style={{ color: "oklch(0.63 0.04 240)" }}
        >
          <span className="flex items-center gap-1">
            <span
              className="w-2 h-2 rounded-full inline-block"
              style={{
                background: "oklch(0.65 0.28 25)",
                boxShadow: "0 0 6px oklch(0.65 0.28 25)",
              }}
            />
            Attacker
          </span>
          <span className="flex items-center gap-1">
            <span
              className="w-2 h-2 rounded-full inline-block"
              style={{
                background: "oklch(0.87 0.28 145)",
                boxShadow: "0 0 6px oklch(0.87 0.28 145)",
              }}
            />
            Target
          </span>
        </div>
        <div
          className="absolute top-2 left-3 font-mono text-xs"
          style={{ color: "oklch(0.87 0.28 145 / 0.6)" }}
        >
          LIVE FEED — SIMULATED
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
        {[
          {
            label: "Threats Blocked",
            value: counters.blocked.toLocaleString(),
            color: "oklch(0.87 0.28 145)",
          },
          {
            label: "Active Attacks",
            value: counters.active.toString(),
            color: "oklch(0.65 0.28 25)",
          },
          {
            label: "Countries Targeted",
            value: counters.countries.toString(),
            color: "oklch(0.84 0.15 205)",
          },
          {
            label: "Alerts / min",
            value: counters.alertsPerMin.toString(),
            color: "oklch(0.75 0.22 55)",
          },
        ].map((card) => (
          <div
            key={card.label}
            className="cyber-card p-3 text-center"
            data-ocid="threat_map.card"
          >
            <div
              className="font-mono text-2xl font-bold"
              style={{
                color: card.color,
                textShadow: `0 0 12px ${card.color}`,
              }}
            >
              {card.value}
            </div>
            <div
              className="font-mono text-xs mt-1"
              style={{ color: "oklch(0.55 0.04 240)" }}
            >
              {card.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

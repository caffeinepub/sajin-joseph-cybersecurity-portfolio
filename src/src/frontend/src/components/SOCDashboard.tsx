import { useEffect, useRef, useState } from "react";

const SPARKLINE_POINTS = 20;

function generateSparklinePoints(
  data: number[],
  width: number,
  height: number,
) {
  if (data.length < 2) return "";
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);
  return data
    .map(
      (v, i) =>
        `${i * step},${height - ((v - min) / range) * height * 0.85 - 2}`,
    )
    .join(" ");
}

function AnimatedCounter({ target, color }: { target: number; color: string }) {
  const [displayed, setDisplayed] = useState(target);
  const prevTarget = useRef(target);

  useEffect(() => {
    const start = prevTarget.current;
    prevTarget.current = target;
    const diff = target - start;
    const steps = 20;
    let step = 0;
    const t = setInterval(() => {
      step++;
      setDisplayed(Math.round(start + (diff * step) / steps));
      if (step >= steps) clearInterval(t);
    }, 30);
    return () => clearInterval(t);
  }, [target]);

  return (
    <span style={{ color, textShadow: `0 0 12px ${color}` }}>
      {displayed.toLocaleString()}
    </span>
  );
}

const ENDPOINT_COUNT = 8;
const ENDPOINT_KEYS = Array.from(
  { length: ENDPOINT_COUNT },
  (_, i) => `ep-${i + 1}`,
);
type HealthStatus = "green" | "amber" | "red";

export default function SOCDashboard() {
  const [metrics, setMetrics] = useState({
    threatsPerMin: 47,
    blockedIPs: 2841,
    openAlerts: 12,
    endpointsOnline: 143,
  });
  const [sparkData, setSparkData] = useState<number[]>(() =>
    Array.from({ length: SPARKLINE_POINTS }, () =>
      Math.floor(Math.random() * 60 + 40),
    ),
  );
  const [endpointHealth, setEndpointHealth] = useState<HealthStatus[]>(() =>
    Array.from({ length: ENDPOINT_COUNT }, () => "green" as HealthStatus),
  );
  const [severities, setSeverities] = useState({
    critical: 18,
    medium: 45,
    low: 37,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        threatsPerMin: Math.max(
          20,
          Math.min(90, prev.threatsPerMin + Math.floor(Math.random() * 10) - 4),
        ),
        blockedIPs: prev.blockedIPs + Math.floor(Math.random() * 5),
        openAlerts: Math.max(
          5,
          Math.min(30, prev.openAlerts + Math.floor(Math.random() * 5) - 2),
        ),
        endpointsOnline: Math.max(
          135,
          Math.min(
            150,
            prev.endpointsOnline + Math.floor(Math.random() * 3) - 1,
          ),
        ),
      }));
      setSparkData((prev) => [
        ...prev.slice(1),
        Math.floor(Math.random() * 60 + 40),
      ]);
      setEndpointHealth((prev) =>
        prev.map(() => {
          const r = Math.random();
          if (r < 0.05) return "red";
          if (r < 0.15) return "amber";
          return "green";
        }),
      );
      setSeverities({
        critical: Math.max(5, Math.min(35, Math.floor(Math.random() * 30 + 5))),
        medium: Math.max(20, Math.min(60, Math.floor(Math.random() * 40 + 20))),
        low: Math.max(20, Math.min(60, Math.floor(Math.random() * 40 + 20))),
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const total = severities.critical + severities.medium + severities.low;
  const critCirc = (severities.critical / total) * 283;
  const medCirc = (severities.medium / total) * 283;

  const metricCards = [
    {
      label: "Threats / Min",
      value: metrics.threatsPerMin,
      color: "oklch(0.65 0.28 25)",
    },
    {
      label: "Blocked IPs",
      value: metrics.blockedIPs,
      color: "oklch(0.87 0.28 145)",
    },
    {
      label: "Open Alerts",
      value: metrics.openAlerts,
      color: "oklch(0.75 0.22 55)",
    },
    {
      label: "Endpoints Online",
      value: metrics.endpointsOnline,
      color: "oklch(0.84 0.15 205)",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {metricCards.map((m) => (
          <div key={m.label} className="cyber-card p-4" data-ocid="soc.card">
            <div
              className="font-mono text-xs mb-2"
              style={{ color: "oklch(0.5 0.04 240)" }}
            >
              {m.label}
            </div>
            <div className="font-mono text-3xl font-bold">
              <AnimatedCounter target={m.value} color={m.color} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="cyber-card p-4 md:col-span-1">
          <div
            className="font-mono text-xs mb-3"
            style={{ color: "oklch(0.5 0.04 240)" }}
          >
            EVENT VOLUME
          </div>
          <svg
            role="img"
            aria-label="Event volume sparkline chart"
            viewBox="0 0 200 60"
            className="w-full"
            style={{ overflow: "visible" }}
          >
            <defs>
              <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="oklch(0.87 0.28 145)"
                  stopOpacity="0.3"
                />
                <stop
                  offset="100%"
                  stopColor="oklch(0.87 0.28 145)"
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>
            <polygon
              points={`0,60 ${generateSparklinePoints(sparkData, 200, 60)} 200,60`}
              fill="url(#spark-fill)"
            />
            <polyline
              points={generateSparklinePoints(sparkData, 200, 60)}
              fill="none"
              stroke="oklch(0.87 0.28 145)"
              strokeWidth="1.5"
              style={{ filter: "drop-shadow(0 0 3px oklch(0.87 0.28 145))" }}
            />
          </svg>
        </div>

        <div className="cyber-card p-4">
          <div
            className="font-mono text-xs mb-3"
            style={{ color: "oklch(0.5 0.04 240)" }}
          >
            ENDPOINT HEALTH
          </div>
          <div className="grid grid-cols-4 gap-2">
            {endpointHealth.map((status, i) => {
              const color =
                status === "green"
                  ? "oklch(0.87 0.28 145)"
                  : status === "amber"
                    ? "oklch(0.75 0.22 55)"
                    : "oklch(0.65 0.28 25)";
              return (
                <div
                  key={ENDPOINT_KEYS[i]}
                  className="aspect-square rounded-sm flex items-center justify-center font-mono text-xs"
                  style={{
                    background: `${color}22`,
                    border: `1px solid ${color}66`,
                    color,
                    boxShadow:
                      status !== "green" ? `0 0 8px ${color}55` : undefined,
                    transition: "all 0.5s",
                  }}
                  data-ocid={`soc.endpoint.${i + 1}`}
                >
                  EP{i + 1}
                </div>
              );
            })}
          </div>
        </div>

        <div className="cyber-card p-4 flex flex-col items-center justify-center">
          <div
            className="font-mono text-xs mb-3"
            style={{ color: "oklch(0.5 0.04 240)" }}
          >
            ALERT SEVERITY
          </div>
          <svg
            role="img"
            aria-label="Alert severity ring chart"
            viewBox="0 0 100 100"
            className="w-28 h-28"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="oklch(0.87 0.28 145 / 0.3)"
              strokeWidth="10"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="oklch(0.75 0.22 55)"
              strokeWidth="10"
              strokeDasharray={`${medCirc} ${283 - medCirc}`}
              strokeDashoffset={-critCirc}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
              style={{
                transition: "stroke-dasharray 1s ease",
                filter: "drop-shadow(0 0 4px oklch(0.75 0.22 55))",
              }}
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="oklch(0.65 0.28 25)"
              strokeWidth="10"
              strokeDasharray={`${critCirc} ${283 - critCirc}`}
              strokeDashoffset="0"
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
              style={{
                transition: "stroke-dasharray 1s ease",
                filter: "drop-shadow(0 0 4px oklch(0.65 0.28 25))",
              }}
            />
            <text
              x="50"
              y="46"
              textAnchor="middle"
              fontSize="12"
              fontFamily="JetBrains Mono"
              fill="oklch(0.65 0.28 25)"
              fontWeight="bold"
            >
              {severities.critical}%
            </text>
            <text
              x="50"
              y="58"
              textAnchor="middle"
              fontSize="7"
              fontFamily="JetBrains Mono"
              fill="oklch(0.55 0.04 240)"
            >
              CRITICAL
            </text>
          </svg>
          <div className="flex gap-3 mt-2 font-mono text-xs">
            <span style={{ color: "oklch(0.65 0.28 25)" }}>● Critical</span>
            <span style={{ color: "oklch(0.75 0.22 55)" }}>● Medium</span>
            <span style={{ color: "oklch(0.87 0.28 145 / 0.5)" }}>● Low</span>
          </div>
        </div>
      </div>
    </div>
  );
}

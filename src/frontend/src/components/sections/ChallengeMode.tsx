import { useEffect, useRef, useState } from "react";

type Difficulty = "beginner" | "intermediate" | "advanced";

interface Challenge {
  id: number;
  title: string;
  description: string;
  snippet: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  points: number;
}

const CHALLENGES: Record<Difficulty, Challenge[]> = {
  beginner: [
    {
      id: 1,
      title: "SQL Injection Spot",
      description: "Identify the dangerous line in this login query.",
      snippet: `// Login handler
const user = req.body.username;
const pass = req.body.password;
// Line A:
const query = "SELECT * FROM users WHERE username='" + user + "' AND password='" + pass + "'";
// Line B:
db.execute(query);`,
      options: [
        "Line B — db.execute is unsafe",
        "Line A — string concatenation enables SQL injection",
        "req.body parsing is unsafe",
        "The query is fine as-is",
      ],
      correctIndex: 1,
      explanation:
        "Concatenating user input directly into SQL strings allows attackers to inject malicious SQL. Use parameterized queries or prepared statements instead.",
      points: 50,
    },
    {
      id: 2,
      title: "Weak Password Policy",
      description: "Find the security weakness in this login config.",
      snippet: `// auth config
const authConfig = {
  minLength: 4,
  maxAttempts: 0,   // unlimited
  sessionTimeout: 86400000 * 30,  // 30 days
  requireSpecialChars: false,
  bcryptRounds: 1,
};`,
      options: [
        "sessionTimeout is too short",
        "minLength=4, unlimited attempts, bcryptRounds=1 are all weak",
        "requireSpecialChars is optional",
        "maxAttempts should be 100",
      ],
      correctIndex: 1,
      explanation:
        "A minimum length of 4, unlimited login attempts (brute-force risk), and bcrypt cost factor of 1 (trivially fast cracking) are all critical weaknesses.",
      points: 50,
    },
    {
      id: 3,
      title: "HTTP vs HTTPS",
      description: "A web app transmits credentials — what is wrong?",
      snippet: `// Frontend login form
fetch("http://api.company.com/login", {
  method: "POST",
  body: JSON.stringify({ username, password }),
  headers: { "Content-Type": "application/json" },
});
// Network captures show plaintext credentials`,
      options: [
        "POST method is insecure",
        "JSON.stringify is vulnerable",
        "Using HTTP instead of HTTPS exposes credentials in transit",
        "The Content-Type header is wrong",
      ],
      correctIndex: 2,
      explanation:
        "HTTP transmits data in plaintext. Any network observer (MITM) can read credentials. HTTPS with TLS encrypts data in transit.",
      points: 50,
    },
  ],
  intermediate: [
    {
      id: 4,
      title: "XSS Vulnerability",
      description: "Identify the XSS vector in this HTML snippet.",
      snippet: `// Comment display component
const displayComment = (comment) => {
  // Render user comment
  document.getElementById("output").innerHTML = comment;
};
// User input: comment = '<img src=x onerror="alert(document.cookie)">'`,
      options: [
        "getElementById is deprecated",
        "innerHTML with unsanitized user input enables XSS",
        "Arrow functions are unsafe",
        "The img tag is blocked by default",
      ],
      correctIndex: 1,
      explanation:
        "Setting innerHTML with user-controlled data allows script injection. Use textContent or a sanitization library like DOMPurify instead.",
      points: 100,
    },
    {
      id: 5,
      title: "Broken Authentication",
      description: "Spot the critical flaw in this JWT implementation.",
      snippet: `// Token verification
const decoded = jwt.verify(token, secret, {
  algorithms: ["HS256", "RS256", "none"],
});
// Attacker crafts: header={alg:"none"}
// Payload: {role:"admin", userId:999}`,
      options: [
        "HS256 is a weak algorithm",
        "The secret key is too short",
        'Accepting alg:"none" allows unsigned tokens bypassing verification',
        "userId should not be in the token",
      ],
      correctIndex: 2,
      explanation:
        'The "none" algorithm means no signature verification. Attackers craft tokens with any payload. Never allow alg:none in production JWT verification.',
      points: 100,
    },
    {
      id: 6,
      title: "SSRF Risk",
      description: "Identify the SSRF vector in this server-side code.",
      snippet: `// Image proxy endpoint
app.get("/proxy", async (req, res) => {
  const url = req.query.url;
  // Fetch and return remote image
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  res.send(Buffer.from(buffer));
});`,
      options: [
        "fetch() is an insecure function",
        "arrayBuffer conversion is dangerous",
        "The url parameter is not validated, allowing internal network access (SSRF)",
        "GET method should be POST",
      ],
      correctIndex: 2,
      explanation:
        "Without URL validation, attackers can request internal services like http://169.254.169.254/metadata (cloud IMDS) or internal databases. Whitelist allowed domains.",
      points: 100,
    },
  ],
  advanced: [
    {
      id: 7,
      title: "Command Injection",
      description: "Find the command injection in this bash script handler.",
      snippet: `// System diagnostics endpoint
import { exec } from "child_process";
app.post("/ping", (req, res) => {
  const host = req.body.host;
  exec(\`ping -c 4 \${host}\`, (err, stdout) => {
    res.json({ output: stdout });
  });
});
// Attacker input: host = "8.8.8.8; cat /etc/passwd"`,
      options: [
        "ping -c 4 is an invalid flag",
        "exec() is slower than execFile()",
        "Template literal with unsanitized host enables OS command injection",
        "POST body parsing is misconfigured",
      ],
      correctIndex: 2,
      explanation:
        "Interpolating user input into shell commands allows ; | && chaining. Use execFile() with argument arrays or a strict allow-list for the host parameter.",
      points: 200,
    },
    {
      id: 8,
      title: "Insecure Deserialization",
      description: "Identify the critical vulnerability in this Python code.",
      snippet: `import pickle, base64
from flask import request

@app.route('/load_session')
def load_session():
    data = request.cookies.get('session')
    # Restore session object
    session = pickle.loads(base64.b64decode(data))
    return session['user']`,
      options: [
        "base64 decoding is slow",
        "pickle.loads on attacker-controlled data allows arbitrary code execution",
        "Cookies should use SHA256",
        "The route should be POST",
      ],
      correctIndex: 1,
      explanation:
        "pickle.loads executes embedded Python bytecode. An attacker crafts a malicious pickle payload that runs OS commands on deserialization. Use JSON or signed tokens.",
      points: 200,
    },
    {
      id: 9,
      title: "Privilege Escalation Path",
      description:
        "Find the privilege escalation vulnerability in these Linux permissions.",
      snippet: `$ ls -la /usr/bin/custom_tool
-rwsr-xr-x 1 root root 45678 Jan 10 /usr/bin/custom_tool
# custom_tool executes: system("/bin/bash -p") if env DEBUG=1
# Current user: www-data
# Attacker runs: DEBUG=1 /usr/bin/custom_tool`,
      options: [
        "The file size (45678) indicates tampering",
        "The SUID bit + DEBUG env variable allows www-data to spawn a root shell",
        "custom_tool should not be in /usr/bin",
        "The date is suspicious",
      ],
      correctIndex: 1,
      explanation:
        "The SUID bit (rws) causes the binary to run as root regardless of the caller. If it respects a user-controlled env var to spawn a shell, any user can escalate to root.",
      points: 200,
    },
  ],
};

const MAX_SCORE = 50 * 3 + 100 * 3 + 200 * 3;

export default function ChallengeMode() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>("beginner");
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [completedIds, setCompletedIds] = useState<Set<number>>(new Set());
  const [flash, setFlash] = useState<"correct" | "wrong" | null>(null);

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

  const challenges = CHALLENGES[difficulty];
  const challenge = challenges[challengeIdx];
  const totalChallenges = Object.values(CHALLENGES).flat().length;

  const handleSubmit = () => {
    if (selected === null) return;
    const correct = selected === challenge.correctIndex;
    setSubmitted(true);
    setFlash(correct ? "correct" : "wrong");
    if (correct && !completedIds.has(challenge.id)) {
      setScore((s) => s + challenge.points);
      setCompletedIds((prev) => new Set([...prev, challenge.id]));
    }
    setTimeout(() => setFlash(null), 1000);
  };

  const handleNext = () => {
    if (challengeIdx < challenges.length - 1) {
      setChallengeIdx((i) => i + 1);
    } else {
      const order: Difficulty[] = ["beginner", "intermediate", "advanced"];
      const nextDiff = order[(order.indexOf(difficulty) + 1) % order.length];
      setDifficulty(nextDiff);
      setChallengeIdx(0);
    }
    setSelected(null);
    setSubmitted(false);
  };

  const handleReset = () => {
    setScore(0);
    setCompletedIds(new Set());
    setDifficulty("beginner");
    setChallengeIdx(0);
    setSelected(null);
    setSubmitted(false);
  };

  const diffColors: Record<Difficulty, string> = {
    beginner: "oklch(0.87 0.28 145)",
    intermediate: "oklch(0.84 0.15 205)",
    advanced: "oklch(0.7 0.22 30)",
  };

  return (
    <section id="challenges" className="relative z-10 py-24" ref={sectionRef}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 section-reveal">
          <span
            className="font-mono text-sm tracking-widest uppercase"
            style={{ color: "oklch(0.87 0.28 145)" }}
          >
            {"// Security Challenges"}
          </span>
          <h2 className="text-4xl font-bold mt-2 text-foreground">
            Gamified CTF Arena
          </h2>
          <div
            className="w-16 h-0.5 mx-auto mt-4"
            style={{ background: "oklch(0.87 0.28 145)" }}
          />
        </div>

        <div className="flex items-center justify-between mb-6 section-reveal">
          <div className="flex gap-2 items-center">
            <span className="font-mono text-xs text-foreground/40">
              COMPLETED:
            </span>
            <span
              className="font-mono text-sm font-bold"
              style={{ color: "oklch(0.87 0.28 145)" }}
            >
              {completedIds.size} / {totalChallenges}
            </span>
          </div>
          <div
            className="px-4 py-2 rounded font-mono text-sm font-bold"
            style={{
              background: "oklch(0.14 0.025 240)",
              border: "1px solid oklch(0.87 0.28 145 / 0.4)",
              color: "oklch(0.87 0.28 145)",
            }}
            data-ocid="challenges.panel"
          >
            SCORE: {score} / {MAX_SCORE} pts
          </div>
        </div>

        <div className="mb-8 section-reveal">
          <div
            className="w-full h-1.5 rounded-full"
            style={{ background: "oklch(0.18 0.03 240)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${(completedIds.size / totalChallenges) * 100}%`,
                background: "oklch(0.87 0.28 145)",
                boxShadow: "0 0 8px oklch(0.87 0.28 145 / 0.6)",
              }}
              data-ocid="challenges.loading_state"
            />
          </div>
        </div>

        <div
          className="flex gap-3 mb-8 section-reveal"
          data-ocid="challenges.tab"
        >
          {(["beginner", "intermediate", "advanced"] as Difficulty[]).map(
            (d) => (
              <button
                key={d}
                type="button"
                onClick={() => {
                  setDifficulty(d);
                  setChallengeIdx(0);
                  setSelected(null);
                  setSubmitted(false);
                }}
                className="px-4 py-2 rounded font-mono text-xs uppercase tracking-wider transition-all duration-200"
                style={{
                  background:
                    difficulty === d
                      ? `${diffColors[d]}20`
                      : "oklch(0.14 0.025 240)",
                  border: `1px solid ${
                    difficulty === d ? diffColors[d] : "oklch(0.22 0.04 240)"
                  }`,
                  color:
                    difficulty === d ? diffColors[d] : "oklch(0.5 0.04 240)",
                  boxShadow:
                    difficulty === d ? `0 0 12px ${diffColors[d]}40` : "none",
                }}
                data-ocid={`challenges.${d}.tab`}
              >
                {d}
              </button>
            ),
          )}
        </div>

        <div
          className="cyber-card p-6 section-reveal"
          style={{
            borderColor:
              flash === "correct"
                ? "oklch(0.87 0.28 145)"
                : flash === "wrong"
                  ? "oklch(0.6 0.22 30)"
                  : undefined,
            boxShadow:
              flash === "correct"
                ? "0 0 30px oklch(0.87 0.28 145 / 0.3)"
                : flash === "wrong"
                  ? "0 0 30px oklch(0.6 0.22 30 / 0.3)"
                  : undefined,
            transition: "border-color 0.3s, box-shadow 0.3s",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span
                className="px-2 py-0.5 rounded font-mono text-xs font-bold uppercase"
                style={{
                  background: `${diffColors[difficulty]}15`,
                  border: `1px solid ${diffColors[difficulty]}40`,
                  color: diffColors[difficulty],
                }}
              >
                {difficulty}
              </span>
              <span className="font-mono text-xs text-foreground/40">
                Challenge {challengeIdx + 1} / {challenges.length}
              </span>
            </div>
            <span
              className="font-mono text-sm font-bold"
              style={{ color: diffColors[difficulty] }}
            >
              +{challenge.points} pts
            </span>
          </div>

          <h3 className="text-lg font-bold text-foreground mb-2">
            {challenge.title}
          </h3>
          <p className="text-foreground/60 text-sm mb-4">
            {challenge.description}
          </p>

          <div
            className="rounded p-4 mb-6 overflow-x-auto"
            style={{
              background: "oklch(0.1 0.02 240)",
              border: "1px solid oklch(0.2 0.03 240)",
            }}
          >
            <pre
              className="font-mono text-xs leading-relaxed whitespace-pre-wrap"
              style={{ color: "oklch(0.87 0.28 145)" }}
            >
              {challenge.snippet}
            </pre>
          </div>

          <div className="space-y-3 mb-6">
            {challenge.options.map((opt, i) => {
              let borderColor = "oklch(0.22 0.04 240)";
              let bg = "transparent";
              let textColor = "oklch(0.75 0.025 240)";
              if (selected === i && !submitted) {
                borderColor = "oklch(0.84 0.15 205 / 0.8)";
                bg = "oklch(0.84 0.15 205 / 0.08)";
                textColor = "oklch(0.84 0.15 205)";
              }
              if (submitted && i === challenge.correctIndex) {
                borderColor = "oklch(0.87 0.28 145)";
                bg = "oklch(0.87 0.28 145 / 0.1)";
                textColor = "oklch(0.87 0.28 145)";
              } else if (
                submitted &&
                selected === i &&
                i !== challenge.correctIndex
              ) {
                borderColor = "oklch(0.6 0.22 30)";
                bg = "oklch(0.6 0.22 30 / 0.1)";
                textColor = "oklch(0.6 0.22 30)";
              }
              return (
                <button
                  key={opt}
                  type="button"
                  disabled={submitted}
                  onClick={() => setSelected(i)}
                  className="w-full text-left px-4 py-3 rounded transition-all duration-200"
                  style={{
                    border: `1px solid ${borderColor}`,
                    background: bg,
                    color: textColor,
                    cursor: submitted ? "default" : "pointer",
                  }}
                  data-ocid={`challenges.option.${i + 1}`}
                >
                  <span
                    className="font-mono text-xs mr-3"
                    style={{ color: "oklch(0.5 0.04 240)" }}
                  >
                    {String.fromCharCode(65 + i)}.
                  </span>
                  <span className="text-sm">{opt}</span>
                </button>
              );
            })}
          </div>

          {submitted && (
            <div
              className="rounded p-4 mb-6 text-sm leading-relaxed"
              style={{
                background:
                  selected === challenge.correctIndex
                    ? "oklch(0.87 0.28 145 / 0.06)"
                    : "oklch(0.6 0.22 30 / 0.06)",
                border: `1px solid ${
                  selected === challenge.correctIndex
                    ? "oklch(0.87 0.28 145 / 0.3)"
                    : "oklch(0.6 0.22 30 / 0.3)"
                }`,
                color:
                  selected === challenge.correctIndex
                    ? "oklch(0.87 0.28 145)"
                    : "oklch(0.75 0.15 30)",
              }}
              data-ocid="challenges.success_state"
            >
              <span className="font-mono font-bold mr-2">
                {selected === challenge.correctIndex
                  ? "✓ CORRECT —"
                  : "✗ WRONG —"}
              </span>
              {challenge.explanation}
            </div>
          )}

          <div className="flex gap-3 flex-wrap">
            {!submitted ? (
              <button
                type="button"
                disabled={selected === null}
                onClick={handleSubmit}
                className="btn-primary-neon flex items-center gap-2 px-5 py-2"
                style={{
                  opacity: selected === null ? 0.5 : 1,
                  cursor: selected === null ? "not-allowed" : "pointer",
                }}
                data-ocid="challenges.submit_button"
              >
                Submit Answer
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="btn-primary-neon flex items-center gap-2 px-5 py-2"
                data-ocid="challenges.primary_button"
              >
                Next Challenge →
              </button>
            )}
            <button
              type="button"
              onClick={handleReset}
              className="btn-neon px-5 py-2"
              style={{
                borderColor: "oklch(0.6 0.22 30 / 0.6)",
                color: "oklch(0.7 0.15 30)",
              }}
              data-ocid="challenges.delete_button"
            >
              Reset Score
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

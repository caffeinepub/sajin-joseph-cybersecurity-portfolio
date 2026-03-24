import { useEffect, useRef } from "react";

export default function MatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const fontSize = 13;
    const chars =
      "アイウエオカキクケコサシスセソタチツテトナニヌネノABCDEFGHIJKLMNOP0123456789@#$%^&*<>/\\{}[]";

    let cols = Math.floor(canvas.width / fontSize);
    let drops: number[] = Array(cols).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(5, 10, 18, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px JetBrains Mono, monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const intensity = Math.random();
        if (intensity > 0.95) {
          ctx.fillStyle = "rgba(0, 229, 255, 0.7)";
        } else if (intensity > 0.8) {
          ctx.fillStyle = "rgba(57, 255, 90, 0.9)";
        } else {
          ctx.fillStyle = `rgba(57, 255, 90, ${0.1 + intensity * 0.35})`;
        }
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      // Recalculate cols on resize
      const newCols = Math.floor(canvas.width / fontSize);
      if (newCols !== cols) {
        cols = newCols;
        drops = Array(cols).fill(1);
      }
    };

    const interval = setInterval(draw, 45);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.35 }}
    />
  );
}

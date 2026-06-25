"use client";

import { useEffect, useMemo, useState } from "react";
import { Gamepad2 } from "lucide-react";

const CODE = [
  "arrowup",
  "arrowup",
  "arrowdown",
  "arrowdown",
  "arrowleft",
  "arrowright",
  "arrowleft",
  "arrowright",
  "b",
  "a",
];
const COLORS = ["#7c7cf0", "#a855f7", "#2dd4e8", "#f472b6", "#fbbf24"];

export default function KonamiEasterEgg() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    let idx = 0;
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === CODE[idx]) {
        idx += 1;
        if (idx === CODE.length) {
          idx = 0;
          setActive(true);
        }
      } else {
        idx = key === CODE[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setActive(false), 4500);
    return () => clearTimeout(t);
  }, [active]);

  // Deterministic-ish confetti spread (varies per piece index).
  const pieces = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        left: (i * 37) % 100,
        color: COLORS[i % COLORS.length],
        delay: (i % 10) * 0.12,
        dur: 2.4 + ((i * 13) % 16) / 10,
      })),
    []
  );

  if (!active) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[120] overflow-hidden">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
          }}
        />
      ))}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="modal-pop flex items-center gap-3 rounded-2xl border border-border bg-card/90 px-6 py-4 shadow-2xl backdrop-blur-md">
          <Gamepad2 className="text-accent" />
          <div>
            <p className="font-display font-semibold">Dev mode unlocked</p>
            <p className="font-mono text-xs text-muted-foreground">
              {"// you found the konami code 🎮"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const LINES = [
  "> initializing portfolio…",
  "> loading assets…",
  "> mounting components…",
  "> ready.",
];

/**
 * First-visit boot splash. Renders nothing during SSR/first paint (so it can
 * never block content if JS fails), then plays once per session for visitors
 * who haven't seen it. Honors prefers-reduced-motion.
 */
export default function EntryScreen() {
  const [phase, setPhase] = useState<"idle" | "boot" | "done">("idle");
  const [shownLines, setShownLines] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("entry-shown") === "1";
    } catch {}
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduced) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- skip the intro on revisit / reduced-motion
      setPhase("done");
      return;
    }
    try {
      sessionStorage.setItem("entry-shown", "1");
    } catch {}
    setPhase("boot");

    // Reveal logic in the GSAP effect; this just paces the boot log.
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setShownLines(i);
      if (i >= LINES.length) clearInterval(interval);
    }, 320);
    return () => clearInterval(interval);
  }, []);

  useGSAP(
    () => {
      if (phase !== "boot" || !rootRef.current) return;
      const reveal = () => {
        gsap.to(rootRef.current, {
          yPercent: -100,
          duration: 0.8,
          ease: "power4.inOut",
          onComplete: () => setPhase("done"),
        });
      };
      // Reveal after the boot log finishes — with a hard safety cap.
      const t = gsap.delayedCall(1.7, reveal);
      return () => t.kill();
    },
    { dependencies: [phase] }
  );

  if (phase !== "boot") return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background"
    >
      <p className="font-display text-3xl font-bold tracking-tight">
        <span className="text-gradient">Soham</span>
        <span className="text-muted-foreground">.dev</span>
      </p>

      <div className="mt-8 h-28 w-72 max-w-[80vw] font-mono text-sm text-muted-foreground">
        {LINES.slice(0, shownLines).map((line, i) => (
          <p key={i} className={i === LINES.length - 1 ? "text-accent" : ""}>
            {line}
          </p>
        ))}
      </div>

      <div className="mt-2 h-1 w-72 max-w-[80vw] overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-[width] duration-300"
          style={{ width: `${(shownLines / LINES.length) * 100}%` }}
        />
      </div>
    </div>
  );
}

"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

/** Fixed, slowly-drifting gradient blobs behind all content. */
export default function Aurora() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.to(".aurora-1", { x: 90, y: 60, scale: 1.2, duration: 14, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".aurora-2", { x: -80, y: -50, scale: 1.15, duration: 18, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".aurora-3", { x: 60, y: -70, scale: 1.25, duration: 16, repeat: -1, yoyo: true, ease: "sine.inOut" });
    },
    { scope: ref }
  );

  return (
    <div ref={ref} aria-hidden className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div
        className="aurora-1 absolute -top-40 -left-32 w-[60vw] h-[60vw] rounded-full blur-[120px] opacity-40"
        style={{ background: "radial-gradient(circle, var(--primary), transparent 70%)" }}
      />
      <div
        className="aurora-2 absolute top-1/3 -right-32 w-[55vw] h-[55vw] rounded-full blur-[120px] opacity-30"
        style={{ background: "radial-gradient(circle, var(--violet), transparent 70%)" }}
      />
      <div
        className="aurora-3 absolute -bottom-40 left-1/4 w-[50vw] h-[50vw] rounded-full blur-[120px] opacity-25"
        style={{ background: "radial-gradient(circle, var(--accent), transparent 70%)" }}
      />
    </div>
  );
}

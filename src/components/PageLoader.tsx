"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Laptop, Code2, Rocket } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const icons = [Laptop, Code2, Rocket];

export default function PageLoader() {
  const [visible, setVisible] = useState(false); // logically active
  const [mounted, setMounted] = useState(false); // present in DOM
  const [iconIndex, setIconIndex] = useState(0);
  const pathname = usePathname();
  const prevPath = useRef(pathname);
  const overlayRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  // Show ONLY on a real route change — never on the initial load/refresh,
  // where the static page is already painted (nothing to load).
  useEffect(() => {
    if (prevPath.current === pathname) return;
    prevPath.current = pathname;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 900);
    return () => clearTimeout(t);
  }, [pathname]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mount overlay when a navigation begins
    if (visible) setMounted(true);
  }, [visible]);

  // Cycle icons while visible.
  useEffect(() => {
    if (!visible) return;
    const i = setInterval(
      () => setIconIndex((prev) => (prev + 1) % icons.length),
      400
    );
    return () => clearInterval(i);
  }, [visible]);

  // Fade overlay in/out (out-tween before unmount).
  useGSAP(
    () => {
      const el = overlayRef.current;
      if (!el) return;
      if (visible) {
        gsap.to(el, { opacity: 1, duration: 0.25, ease: "power2.out" });
      } else if (mounted) {
        gsap.to(el, {
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => setMounted(false),
        });
      }
    },
    { dependencies: [visible, mounted] }
  );

  // Pop the icon on each change.
  useGSAP(
    () => {
      if (!iconRef.current) return;
      gsap.fromTo(
        iconRef.current,
        { scale: 0.6, opacity: 0, rotate: -20 },
        { scale: 1, opacity: 1, rotate: 0, duration: 0.4, ease: "back.out(1.7)" }
      );
    },
    { dependencies: [iconIndex] }
  );

  if (!mounted) return null;
  const CurrentIcon = icons[iconIndex];

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background/80 backdrop-blur-md opacity-0"
    >
      <div ref={iconRef} className="text-primary">
        <CurrentIcon size={64} strokeWidth={1.5} />
      </div>
      <div className="mt-6 text-foreground text-lg font-semibold flex items-center gap-1">
        Loading
        <span className="loader-dot">.</span>
        <span className="loader-dot">.</span>
        <span className="loader-dot">.</span>
      </div>
    </div>
  );
}

"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Render a different element (e.g. "ul", "section"). Defaults to "div". */
  as?: ElementType;
  /** Vertical offset to animate from. */
  y?: number;
  /** When > 0, stagger the element's direct children instead of the element itself. */
  stagger?: number;
  /** Delay before the animation starts. */
  delay?: number;
};

/**
 * Scroll-triggered fade-up. Replaces Framer's whileInView / container+item
 * variants. Honors prefers-reduced-motion by snapping to the final state.
 */
export default function Reveal({
  children,
  className,
  as = "div",
  y = 28,
  stagger = 0,
  delay = 0,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const Tag = as;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const targets: Element | Element[] = stagger ? Array.from(el.children) : el;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduced) {
        gsap.set(targets, { opacity: 1, y: 0 });
        return;
      }

      gsap.from(targets, {
        opacity: 0,
        y,
        duration: 0.7,
        ease: "power3.out",
        delay,
        stagger: stagger || 0,
        scrollTrigger: { trigger: el, start: "top 85%" },
      });
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref as never} className={className}>
      {children}
    </Tag>
  );
}

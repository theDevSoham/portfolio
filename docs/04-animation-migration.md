# 04 — Animation Migration: Framer Motion → GSAP + Lenis (Goal #1)

Fully remove `framer-motion` / `motion`. Use **GSAP** (+ ScrollTrigger) for animation and **Lenis** for smooth scrolling. This doc maps every current Framer usage to its GSAP replacement so nothing is lost.

---

## Dependencies

```bash
# add
gsap            # core + ScrollTrigger (@gsap/react for the useGSAP hook)
@gsap/react
lenis           # smooth scroll (formerly @studio-freight/lenis)
# remove
motion / framer-motion
```

`@gsap/react` gives `useGSAP()` — a React-aware wrapper that auto-cleans up animations (the GSAP equivalent of avoiding leaks in `useEffect`).

---

## Foundation 1 — Lenis smooth scroll provider

A single client provider near the root drives Lenis and pumps its RAF into GSAP's ticker so ScrollTrigger stays in sync.

```tsx
// src/components/providers/SmoothScroll.tsx
"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => { gsap.ticker.remove(raf); lenis.destroy(); };
  }, []);
  return <>{children}</>;
}
```

Wrap it once in the root layout around `children`. Import `lenis/dist/lenis.css` (or set the recommended CSS). Keep it a thin client island so pages remain Server Components (doc 06).

> Respect `prefers-reduced-motion`: when set, skip Lenis init and make GSAP timelines instant (`gsap.set` final state). Bake this into every helper below.

---

## Foundation 2 — A `Reveal` island for scroll-in animations

Replaces all the `whileInView` / `containerVariants` / `itemVariants` reveals across About/Projects/Contact. Server pages stay server; they just wrap content in `<Reveal>`.

```tsx
// src/components/anim/Reveal.tsx
"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(ScrollTrigger, useGSAP);

export function Reveal({ children, y = 24, stagger = 0 }: {children: React.ReactNode; y?: number; stagger?: number}) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const targets = stagger ? ref.current!.children : ref.current!;
    gsap.from(targets, {
      opacity: 0, y, duration: 0.8, ease: "power3.out", stagger,
      scrollTrigger: { trigger: ref.current, start: "top 85%" },
    });
  }, { scope: ref });
  return <div ref={ref}>{children}</div>;
}
```

---

## Per-usage mapping

| Current (Framer) | Where | GSAP replacement |
|---|---|---|
| Blob `scale 0→1` | `page.tsx` | `gsap.from(".blob",{scale:0,duration:1.4,ease:"power2.out"})` |
| Hero image float (infinite `y`) | `page.tsx` | `gsap.to(".hero-img",{y:-15,repeat:-1,yoyo:true,duration:2,ease:"sine.inOut"})` |
| Headline/CTA staggered fade | `page.tsx` | one `gsap.timeline()` in `HeroAnimation` island |
| `whileInView` section reveals | about/projects/contact | `<Reveal>` (ScrollTrigger `start:"top 85%"`) |
| `containerVariants`+`itemVariants` stagger | about/projects | `<Reveal stagger={0.12}>` |
| Card `whileHover` scale/rotate | projects | CSS `:hover` transform (cheaper) or `gsap.to` on `mouseenter` |
| Card `whileTap` scale | projects | `:active` scale via Tailwind |
| Image-swap re-animate (`key`) | `[slug]` | `gsap.fromTo` on the active image in the `Gallery` island on index change |
| Title/desc/tags reveals | `[slug]` | `<Reveal>` |
| **`layoutId="underline"`** active nav indicator | Navbar | GSAP **Flip** plugin, or animate a single underline element's `x`/`width` to the active link's `getBoundingClientRect()` |
| Mobile menu height collapse | Navbar | `gsap.to(menu,{height:"auto"/0,duration:0.3})` or CSS grid-rows trick |
| `AnimatePresence` overlay fade (PageLoader) | PageLoader | GSAP timeline with an explicit exit tween before unmount; or rebuild loader per doc 07 |
| Loader icon scale/rotate + dots | PageLoader | `gsap.timeline({repeat:-1})` |
| Modal scale/opacity in/out | Admin* | `gsap.fromTo` on open; tween-out then unmount on close |

### Two tricky spots
1. **Shared-layout underline (`layoutId`)** has no direct GSAP equivalent. Use **GSAP Flip**: record the underline's state, move it under the new active link, `Flip.from(state,{duration:0.3})`. Simpler fallback: a single absolutely-positioned underline whose `left/width` you tween to the active link's measured rect.
2. **Exit animations (`AnimatePresence`)**: GSAP doesn't gate unmount. Pattern: keep the element mounted, run the out-tween, and unmount in the tween's `onComplete` (a small `useState` "isVisible" + "isAnimatingOut").

---

## Cleanup checklist
- [ ] `SmoothScroll` provider wired into root layout.
- [ ] `Reveal` + `HeroAnimation` + `Gallery` islands built.
- [ ] Navbar underline reimplemented (Flip).
- [ ] PageLoader/modals reimplemented (or replaced per doc 07).
- [ ] All `from "framer-motion"` imports gone; `motion`/`framer-motion` uninstalled.
- [ ] `prefers-reduced-motion` honored in `SmoothScroll`, `Reveal`, and hero.
- [ ] Footer text updated ("Built with Next.js + Tailwind + GSAP").

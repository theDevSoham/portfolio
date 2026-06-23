# 07 — Experience: Loading, Entry Screens, Gamification & 404 (Goal #4)

The delight layer. Built on the GSAP/Lenis foundation (doc 04) and the design system (doc 05). Keep it tasteful — a *touch* of gamification, not a game.

---

## 1. Entry / preloader screen

Replace the current cosmetic `PageLoader` (fakes a 1.2s load on every route change) with a **real first-visit intro** that only plays on initial load.

**Concept — "booting" sequence (developer vibe):**
- Full-screen overlay with the brand mark and a mono "boot log" that types out (`> initializing…`, `> loading projects…`, `> ready.`) using GSAP.
- A progress bar tied to actual asset/font readiness (`document.fonts.ready`, image preloads) rather than a fixed timer.
- On complete: GSAP timeline reveals the hero (curtain wipe / mask reveal), then unmounts.
- Show **once per session** (`sessionStorage` flag) so repeat navigation is instant.
- Respect `prefers-reduced-motion`: skip straight to content.

**Hero entry animation** (after preloader): staggered headline reveal, gradient sweep, hero image float — all GSAP timeline (doc 04).

> Remove the per-route `PageLoader`. Real navigation feedback comes from Next.js `loading.tsx` + `Skeleton` components (instant, data-driven), not a forced delay.

---

## 2. Loading states (real ones)

- Use route-segment `loading.tsx` files with **skeleton** layouts matching each page (project grid skeleton, about skeleton).
- Since pages become Server Components (doc 06), most loads are server-rendered and fast; skeletons cover streaming/suspense boundaries.
- Keep a small branded spinner component for client islands (form submit, gallery).

---

## 3. Gamification (a touch)

Pick 2–3, not all — restraint keeps it classy:

- **Konami code / secret key combo** → unlocks a fun easter-egg overlay (e.g. a retro "dev mode" theme, confetti, or a hidden message). Pure client island.
- **Scroll progress as XP:** a thin top gradient "XP bar" that fills as you scroll the page; small "achievements" toasts at milestones ("🏆 Reached Projects").
- **Interactive hero:** cursor-reactive accent glow / magnetic buttons (GSAP `quickTo` following the pointer).
- **Project cards as "quests":** subtle hover tilt + a "difficulty/tech" badge styled like a game stat.
- **Stats counter:** animated count-up of years/projects/commits on scroll into view (GSAP).
- **404 mini-game** (see below).

Implement each as an isolated client component so they don't pull whole pages client-side. Always provide a non-animated fallback and respect reduced-motion.

---

## 4. 404 page (`app/not-found.tsx`)

Currently missing → default Next.js 404. Add a branded, playful one:

- Big glitchy `404` (GSAP text scramble / RGB-split effect).
- Mono "stack trace"-style copy: `Error: page not found at /whatever` with a friendly line.
- Primary CTA back home + secondary "view projects."
- **Optional mini-game:** a tiny canvas game (e.g. catch-the-bug, or a one-button runner) — keep it lazy-loaded and skippable. This is the natural home for the gamification "touch" without cluttering main pages.
- Also add `error.tsx` (route error boundary) and a `global-error.tsx` with on-brand styling.

---

## 5. Polish checklist
- [ ] First-visit preloader (session-scoped, asset-aware, reduced-motion aware).
- [ ] Hero entry GSAP timeline.
- [ ] Per-route `loading.tsx` skeletons; remove forced `PageLoader`.
- [ ] 2–3 gamification touches chosen and built as isolated islands.
- [ ] `not-found.tsx` (+ optional mini-game), `error.tsx`, `global-error.tsx`.
- [ ] Toasts replace `alert()`; success/error states feel intentional.
- [ ] Everything degrades gracefully with `prefers-reduced-motion` and JS disabled where possible.

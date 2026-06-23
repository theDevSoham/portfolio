# 05 — Design System & Component Library (Goal #3)

A full visual revamp: a real design language, design tokens, and a **shadcn/ui-style** component library on Tailwind — modular, reusable, "vibrant developer vibes."

> **Decisions locked (2026-06-23):** direction = **Neon dev-terminal**; theming = **dark + light** via `next-themes`. The palette/typography below are the committed starting point.

---

## Design direction — Neon dev-terminal (locked)

**Vibe:** modern dark-first "developer terminal meets neon studio." Confident type, lots of negative space, a tasteful accent gradient, subtle grain/grid texture, and motion that feels physical (via GSAP/Lenis, doc 04).

### Color tokens (HSL, dark-first)
Define as CSS variables in `globals.css` and expose via Tailwind `@theme`. shadcn conventions (`--background`, `--foreground`, `--primary`, `--muted`, `--border`, `--ring`, etc.) so components drop in cleanly.

| Token | Dark value (proposed) | Use |
|---|---|---|
| `--background` | `#0A0A0B` near-black | page bg |
| `--foreground` | `#E7E7EA` | body text |
| `--card` | `#121214` | surfaces |
| `--muted` / `--muted-foreground` | `#1A1A1D` / `#9A9AA5` | secondary |
| `--border` | `#26262B` | hairlines |
| `--primary` | electric indigo `#6366F1` | primary accent (keep brand continuity) |
| `--accent` | cyan/teal `#22D3EE` | secondary accent for gradients |
| `--gradient` | `linear(135deg, #6366F1 → #22D3EE)` | hero, highlights, focus glows |
| `--ring` | `#6366F1` | focus rings |

Ship a **light theme** mirror via `next-themes` (confirmed in scope). Define a `.light` token set alongside the dark `:root`. The half-wired `--background/--foreground` block and the `body{font-family:Arial}` override were already removed in Phase 0.

### Typography
- **Display/headings:** a characterful geometric or grotesk (e.g. *Clash Display*, *Space Grotesk*, or keep **Geist**). Big, tight `tracking`.
- **Body:** **Geist Sans** (already intended — wire it via `next/font` and the `--font-sans` token).
- **Mono accent:** **Geist Mono** / *JetBrains Mono* for code-y labels, tags, section eyebrows ("// projects"), and the gamification HUD — this carries the "developer vibe."
- Load via `next/font/google` (or local) and map to `--font-sans` / `--font-mono` in `@theme` (the tokens already exist but aren't wired).

### Texture & depth
- Faint dotted/grid background (`radial-gradient` mask) behind hero.
- Glassmorphism for cards (`backdrop-blur` + `border-white/5`) — already a motif, refine it.
- Soft accent glows behind focal elements (replaces the current raw blobs).
- Subtle film grain overlay (optional, very low opacity).

---

## Component library — shadcn/ui on Tailwind v4

Adopt **shadcn/ui** (copy-in components, you own the code — fits "modular"). Note: shadcn's CLI assumed Tailwind v3; with **Tailwind v4** use the latest shadcn that supports v4, or hand-port components. Either way the primitives are:

**Install/scaffold:** `components.json`, `lib/utils.ts` (the `cn()` helper via `clsx` + `tailwind-merge`), `class-variance-authority` for variants, Radix UI primitives under the hood.

### Components to build (priority order)
1. **Primitives:** `Button` (variants: primary/ghost/outline/gradient), `Badge`/`Tag`, `Card`, `Input`, `Textarea`, `Label`, `Separator`, `Avatar`, `Tooltip`.
2. **Overlay:** `Dialog`/`Modal` (Radix — replaces the hand-rolled admin modals; gets focus trap + Escape + backdrop for free), `Sheet` (mobile nav), `DropdownMenu`.
3. **Composite (portfolio-specific):**
   - `ProjectCard` — image, title, truncated desc, tag row, repo/live links, hover lift.
   - `Section` + `SectionHeading` (with mono eyebrow `// about`).
   - `Timeline` — for education/experience.
   - `SkillChip` grid.
   - `SocialBar`.
   - `Navbar` (refactored, GSAP underline) + `Footer`.
   - `Reveal` wrapper (doc 04) for scroll-in.
4. **Feedback:** `Toast` (replace the `alert()` in contact success), `Skeleton` (real loading states, not the cosmetic 1.2s loader).

### Accessibility (was missing — bake in now)
- Radix gives focus management + ARIA for overlays.
- Add a **skip-to-content** link, visible focus rings (`--ring`), and `prefers-reduced-motion` handling.
- Ensure contrast ratios pass AA against the dark bg.

---

## Layout & IA refresh
- Widen content rhythm; the current `max-w-5xl` is fine for reading but the hero/projects can break out wider (`max-w-7xl`) with full-bleed accents.
- Consider a **single-page scroll** home (hero → featured projects → about teaser → contact CTA) with section ScrollTriggers, while keeping dedicated `/projects`, `/about`, `/contact` routes for depth and SEO.
- Sticky, condensing navbar on scroll (GSAP).

---

## Tokens → Tailwind wiring sketch
```css
/* globals.css (Tailwind v4) */
@import "tailwindcss";
:root {
  --background: #0A0A0B; --foreground: #E7E7EA;
  --primary: #6366F1; --accent: #22D3EE; --border: #26262B; --ring: #6366F1;
  /* ...full shadcn token set... */
}
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-accent: var(--accent);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}
```

**Resolved:** direction = Neon dev-terminal, theming = dark + light (`next-themes`). Remaining minor choice: the exact **display typeface** (Geist vs Space Grotesk vs Clash Display) — pick during Phase 4 when type is wired.

# 03 — Revamp Execution Plan (Roadmap)

The sequenced plan that ties the four goals together. Ordering matters: **harden and re-architect before re-skinning**, so the new design and animations are built on a clean, secure foundation rather than layered over the current client-everything app.

Cross-references: security [02], animation [04], design [05], architecture [06], experience [07].

---

## Guiding principles
- Ship in **independently deployable slices** — every phase leaves `main` working.
- **Server-first**: a page goes client only for a real interactive island.
- **Security is not a phase you skip** — it lands early (Phase 1) and is enforced thereafter.
- Confirm the **design direction** (palette/type/theme) before mass-building UI (one decision point, end of Phase 0).

---

## Phase 0 — Setup & decisions (foundation)
- Pick **one package manager** (resolve `yarn.lock` vs `package-lock.json`); delete the other lockfile.
- Add deps: `gsap`, `@gsap/react`, `lenis`, `zod`, `bcryptjs`, shadcn toolchain (`clsx`, `tailwind-merge`, `class-variance-authority`, Radix primitives, `isomorphic-dompurify` or `react-markdown`). Remove `motion`/`framer-motion` (after Phase 3).
- Clean `globals.css`: remove `body{font-family:Arial}` and dead tokens; wire Geist via `next/font`.
- Fix structural bugs: `contact/layout.tsx` nested `<html>`, leftover `console.log`, stale footer text, OG placeholders.
- **Decision point:** confirm palette, display typeface, light-theme yes/no (doc 05).

**Exit:** clean baseline, deps in place, design direction locked.

---

## Phase 1 — Security hardening (Goal #2a) 🔴 highest priority
Do this even before the visual work — the open APIs are a live risk.
- Extract `authOptions`; add `requireAdmin()` guard to **every** mutating handler (`about`, `contact`, `projects`, `social`, `upload`).
- Hash the admin password (`bcrypt`); add login rate limiting.
- Add **Zod** validation to all writes (URLs, slug, email, tags).
- Lock down `/api/upload`: admin-only + MIME/size allowlist (or signed Cloudinary).
- Remove `dangerouslySetInnerHTML` → Markdown/sanitized.
- Security headers + CSP in `next.config.ts`; gate the Admin nav link on session.

**Exit:** no anonymous writes; validated inputs; no XSS sink. (Checklist in [02].)

---

## Phase 2 — Server Component re-architecture (Goal #2b)
- Build `lib/data/*` server reads (`import "server-only"`).
- Convert public pages to Server Components one at a time: **about → projects → projects/[slug] → contact → home**, each reading via `lib/data`, delegating motion to client islands.
- Add `generateMetadata`/`generateStaticParams` for project pages.
- Replace hand-written `lib/*` interfaces with Prisma-generated types.
- Delete now-unused public GET API routes; optionally migrate admin writes to **Server Actions**.

**Exit:** real SSR, smaller client bundles, reduced API surface. (Detail in [06].)

---

## Phase 3 — Animation migration (Goal #1)
- Add `SmoothScroll` (Lenis) provider to root layout.
- Build `Reveal`, `HeroAnimation`, `ProjectGallery` islands; reimplement Navbar underline (GSAP Flip) and any modals.
- Replace every Framer usage per the mapping table in [04].
- **Uninstall `motion`/`framer-motion`**; grep to confirm zero imports.
- Honor `prefers-reduced-motion` throughout.

**Exit:** zero Framer Motion; GSAP + Lenis driving all motion. (Detail in [04].)

---

## Phase 4 — Design system & component library (Goal #3)
- Scaffold shadcn/ui (Tailwind v4-compatible) + tokens from [05].
- Build primitives → overlays → composite components (`ProjectCard`, `Timeline`, `Section`, etc.).
- Re-skin all pages with the new components; refactor Navbar/Footer; replace `alert()` with `Toast`.
- Bake in a11y: skip link, focus rings, contrast, Radix overlays (replaces hand-rolled modals).

**Exit:** cohesive, modular, vibrant UI on a reusable component library. (Detail in [05].)

---

## Phase 5 — Experience layer (Goal #4)
- First-visit preloader (session-scoped, asset-aware) + hero entry timeline.
- Real `loading.tsx` skeletons; remove the forced `PageLoader`.
- Choose 2–3 gamification touches and build them as isolated islands.
- `not-found.tsx` (+ optional mini-game), `error.tsx`, `global-error.tsx`.

**Exit:** delightful entry, honest loading, tasteful gamification, branded errors. (Detail in [07].)

---

## Phase 6 — QA, performance & launch
- Lighthouse/Core Web Vitals pass; verify SSR & metadata; test reduced-motion and keyboard nav.
- Verify admin auth end-to-end; attempt unauthenticated writes (should 401).
- Update README; refresh OG image and metadata; final content pass.

---

## Dependency graph (what blocks what)
```
Phase 0 ──► Phase 1 ──► Phase 2 ──► Phase 3 ──► Phase 4 ──► Phase 5 ──► Phase 6
            (security)   (server)    (gsap)      (design)    (experience) (launch)
```
Phases 1 and 2 can overlap (both backend-ish). Phase 4 depends on 3 (motion primitives) and 0 (tokens). Phase 5 depends on 3 + 4.

---

## Risk notes
- **shadcn + Tailwind v4**: CLI historically targeted v3 — verify v4 support or hand-port; budget time here.
- **GSAP Flip / exit animations**: the two non-trivial Framer replacements (nav underline, AnimatePresence) — prototype early (Phase 3 start).
- **Server Action migration of admin**: optional but larger; can stay fetch-based-but-guarded if time-boxed.
- **Don't regress SEO**: ensure each page-conversion keeps/ improves metadata as you remove client fetches.

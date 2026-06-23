# CLAUDE_UNDERSTANDINGS.md

> My (Claude's) working understanding of the portfolio codebase as it exists **today**, written before the revamp begins.
> This is the single source of truth for "what is" — the plans for "what will be" live in [`docs/`](./docs).
> Last reviewed: 2026-06-23 · Branch: `main`

---

## 1. What this project is

A personal portfolio site for **Soham Das** (Full‑Stack Developer). It is a Next.js App‑Router app with a small CMS-style admin area: the owner logs in and edits the About, Projects, and Contact content, which is stored in MongoDB and rendered on public pages. Images/media are uploaded to Cloudinary. The contact form submits through Formspree with reCAPTCHA v3.

It is a real, working app — but it was built quickly. Nearly everything is a client component, every mutation API is unauthenticated, and the visual design is a baseline Tailwind dark theme. This document captures that honestly so the revamp has a real baseline.

---

## 2. Tech stack (as installed)

| Concern | Choice | Version | Notes |
|---|---|---|---|
| Framework | Next.js (App Router) | `15.5.3` | React Server Components available but barely used |
| UI runtime | React | `19.1.0` | |
| Language | TypeScript | `^5` | `strict: true`; path alias `@/* → src/*` |
| Styling | Tailwind CSS | `^4` | v4 (CSS‑first config via `@import "tailwindcss"` + `@theme`) |
| Animation | `motion` (Framer Motion) | `^12.23.14` | **Imported as `framer-motion`** everywhere → to be removed |
| ORM | Prisma | `^6.16.2` | `@prisma/client` |
| Database | MongoDB | — | via `DATABASE_URL` |
| Auth | NextAuth | `^4.24.11` | Credentials provider, JWT sessions |
| Media | Cloudinary | `^2.7.0` + `next-cloudinary` | server SDK + `<CldImage>` not really used |
| Forms | `@formspree/react` | `^3.0.0` | contact form |
| Icons | `lucide-react` | `^0.544.0` | |
| HTTP | `axios` | `^1.12.2` | present in deps |

> Note: `package.json` depends on `motion`, but source imports from `"framer-motion"`. Both resolve today, but it's an inconsistency to be aware of. Goal #1 removes this entirely.

Build script runs `prisma generate && next build`. There is an untracked `package-lock.json` alongside a modified `yarn.lock` — **mixed lockfiles**; pick one package manager during the revamp (see docs/03).

---

## 3. Directory map

```
src/
├── app/
│   ├── layout.tsx              # Root layout — body, Navbar (header), PageLoader, footer
│   ├── page.tsx                # Home / hero  ("use client", framer-motion blobs + floating img)
│   ├── globals.css             # Tailwind v4 entry + :root tokens + .linkify
│   ├── loading.tsx             # Renders <PageLoader forced /> (route-level Suspense fallback)
│   ├── about/page.tsx          # Public About page ("use client", fetches /api/about)
│   ├── projects/page.tsx       # Public Projects grid ("use client", fetches /api/projects)
│   ├── projects/[slug]/page.tsx# Public Project detail ("use client", carousel, dangerouslySetInnerHTML)
│   ├── contact/page.tsx        # Public Contact ("use client", Formspree + reCAPTCHA)
│   ├── contact/layout.tsx      # ⚠️ Emits its OWN <html>/<body> (nested document bug)
│   ├── admin/page.tsx          # Admin dashboard (renders AdminAbout / AdminContact)
│   ├── login/page.tsx          # Credentials login ("use client", signIn)
│   └── api/
│       ├── about/route.ts            # GET/POST/PUT/DELETE  — NO AUTH
│       ├── auth/[...nextauth]/route.ts # NextAuth config (credentials vs env vars)
│       ├── contact/route.ts          # GET/POST/PUT/DELETE  — NO AUTH
│       ├── projects/route.ts         # GET/POST/PUT/DELETE + Cloudinary upload — NO AUTH
│       ├── projects/[slug]/route.ts  # GET single — read-only, fine
│       ├── social/route.ts           # POST/PUT/DELETE — NO AUTH
│       └── upload/route.ts           # POST file → Cloudinary — NO AUTH
├── components/
│   ├── Navbar.tsx              # "use client" — usePathname, shared-layout underline, mobile menu
│   ├── PageLoader.tsx          # "use client" — full-screen loader, cycling icons
│   ├── AdminAbout.tsx          # "use client" — big CRUD form + modal for About
│   └── AdminContact.tsx        # "use client" — CRUD form + modal for Contact/Socials
├── lib/
│   ├── prisma.ts               # Prisma singleton (global cache in dev)
│   ├── cloudinary.ts           # Cloudinary config (cloud_name/api_key/api_secret)
│   ├── iconMap.ts              # name → lucide icon component
│   ├── about.ts                # TS interfaces for About/Education/Experience/Skill/Achievement
│   ├── contact.ts              # TS interfaces for Contact/SocialLink
│   └── project.ts              # TS interfaces for Project/ProjectImage
└── middleware.ts               # NextAuth middleware, matcher: ["/admin/:path*"] (pages only)
prisma/schema.prisma            # MongoDB models (see §5)
```

---

## 4. Rendering & data‑flow model (the important part)

**Everything user‑facing is a client component.** The pattern across `about`, `projects`, `projects/[slug]`, and `contact` is identical:

1. Page is `"use client"`.
2. `useEffect` → `fetch("/api/...")` on mount.
3. Local `loading` state shows a spinner/placeholder.
4. Render once data arrives.

Consequences:
- **No SSR of content** → blank/loader first paint, worse SEO and LCP than the App Router can deliver.
- **Public read APIs exist only to feed the client** — they could be direct server `prisma` reads instead.
- **Waterfalls**: navigate → JS loads → effect runs → API call → DB → render.
- The `PageLoader` masks this with a forced ~1.2s loader on every route change (cosmetic, not real loading).

This is the central thing Goal #2 (server components) fixes: public pages should be Server Components that call `lib/*` data functions directly, with no public read API and no client fetch.

### Animation inventory (Framer Motion — Goal #1 removes all of this)
- `page.tsx`: scaling blobs, floating hero image (infinite y‑loop), staggered headline/CTA fade‑ins.
- `about/page.tsx`: container/item variants, `whileInView` section reveals, skill hover scale.
- `projects/page.tsx`: `whileInView` staggered cards, hover scale+rotate, tap scale.
- `projects/[slug]/page.tsx`: image swap re‑animation, title/description/tags reveals.
- `contact/page.tsx`: ~10 reveal/stagger animations.
- `Navbar.tsx`: entrance stagger, **shared‑layout `layoutId="underline"`** active indicator, mobile menu height animation.
- `PageLoader.tsx`: overlay fade, cycling icon scale/rotate, three bouncing dots.

The shared‑layout underline and `AnimatePresence` exit animations are the two things with no 1:1 GSAP primitive — they need deliberate re‑implementation (see docs/04).

---

## 5. Data model (Prisma / MongoDB)

Singletons-by-convention: code uses `findFirst()` for About and Contact, i.e. **one** About doc and **one** Contact doc are expected, even though the schema allows many.

- **Project** `(title, icon, slug @unique, description, tags[], repoUrl?, liveUrl?)` → `images: ProjectImage[]` (cascade delete).
- **ProjectImage** `(url, alt?)` → belongs to Project.
- **About** `(name, headline, bio, avatarUrl?)` → `education[]`, `experiences[]`, `skills[]`, `achievements[]`.
  - **Education** `(degree, school, startYear, endYear, grade?)`
  - **Experience** `(role, company, duration, desc)`
  - **Skill** `(name)`
  - **Achievement** `(text)`
- **Contact** `(phone?, email?, location?, resumeUrl?, mediaUrl?)` → `socials: SocialLink[]` (cascade delete).
- **SocialLink** `(platform, url)` → belongs to Contact.

The TS interfaces in `lib/{about,contact,project}.ts` mirror these but are maintained by hand (drift risk — Prisma already generates types).

---

## 6. Auth & security posture (today)

- **Page protection**: `middleware.ts` guards `/admin/*` via NextAuth middleware. Good.
- **API protection**: **none.** `/api/about`, `/api/contact`, `/api/projects`, `/api/social`, and `/api/upload` all accept POST/PUT/DELETE from anyone on the internet. Middleware does not cover `/api/*`, and no route calls `getServerSession`.
- **Credentials**: NextAuth Credentials provider compares against `ADMIN_USER` / `ADMIN_PASSWORD` **plaintext env vars**. No hashing, no rate limiting, no lockout.
- **File upload**: `/api/upload` and the projects route accept any file, any size, unauthenticated → Cloudinary cost/abuse exposure.
- **XSS**: `projects/[slug]/page.tsx` renders `description` via `dangerouslySetInnerHTML` with no sanitization. Combined with the open write API, this is a stored‑XSS path.
- **Input validation**: essentially none anywhere (only presence checks for `id`/`file`). No URL validation on `repoUrl`/`liveUrl`/`resumeUrl`/socials.
- **Secrets**: Cloudinary + DB + NextAuth secrets live in env (correct), but the plaintext admin password is the weak link.

Full severity‑ranked breakdown is in [`docs/02-security-audit.md`](./docs/02-security-audit.md). This is the most urgent area and underpins Goal #2.

### Env vars the app expects
`DATABASE_URL`, `ADMIN_USER`, `ADMIN_PASSWORD`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`. (Formspree form id `mvgbeqag` is hardcoded in `contact/page.tsx`.)

---

## 7. Design / UX posture (today)

- Global dark theme: `bg-black text-slate-300`, indigo (`indigo-400/600`) accent, frosted `backdrop-blur` cards (`bg-slate-800/70`).
- `globals.css` defines unused light/dark `--background`/`--foreground` tokens **and** sets `font-family: Arial` on `body` — overriding the intended Geist font. Token system is half‑wired.
- Layout: `max-w-5xl` main container, sticky blurred header, simple footer ("Built with Next.js + Tailwind + Framer Motion" — will be stale after Goal #1).
- No component library, no design tokens beyond ad‑hoc Tailwind classes, no 404 page (`not-found.tsx` missing → default Next.js 404), loading is the cosmetic `PageLoader`.
- Accessibility gaps: modals don't trap focus or close on backdrop/Escape; nav has no skip link; reveal animations don't respect `prefers-reduced-motion`.

This is the baseline Goal #3 (full design revamp + shadcn-style component library) and Goal #4 (loading/entry screens, gamification, 404) build on.

---

## 8. Known bugs & smells (catalogued, not yet fixed)

1. `contact/layout.tsx` renders a nested `<html><body>` inside the root layout → invalid DOM, double document.
2. `globals.css` forces `Arial`, defeating the font setup; dead `--background`/`--foreground` tokens.
3. Hand-written `lib/*.ts` interfaces duplicate Prisma's generated types (drift risk).
4. Mixed `yarn.lock` (modified) + untracked `package-lock.json`.
5. `axios` is a dependency but pages use `fetch` — unclear if used.
6. `console.log` of fetched data left in `projects/[slug]/page.tsx`.
7. Footer credits Framer Motion (becomes false after the revamp).
8. `OG`/Twitter metadata uses placeholders (`yourdomain.com`, `@your_twitter`, `/og-image.png`).
9. Admin link is always visible in the navbar regardless of auth state.

---

## 9. The revamp at a glance (goals → where they're planned)

| # | Goal | Primary doc |
|---|---|---|
| 1 | Drop Framer Motion → GSAP + Lenis smooth scroll | [`docs/04-animation-migration.md`](./docs/04-animation-migration.md) |
| 2 | Security hardening + proper Server Components | [`docs/02-security-audit.md`](./docs/02-security-audit.md), [`docs/06-architecture-target.md`](./docs/06-architecture-target.md) |
| 3 | Design revamp + shadcn-style component library | [`docs/05-design-system.md`](./docs/05-design-system.md) |
| 4 | Gamification, loading/entry screens, 404 | [`docs/07-experience-and-gamification.md`](./docs/07-experience-and-gamification.md) |
| — | Sequenced execution plan tying it together | [`docs/03-revamp-plan.md`](./docs/03-revamp-plan.md) |

Start with [`docs/03-revamp-plan.md`](./docs/03-revamp-plan.md) — it orders the work so security/architecture land before the visual layer is rebuilt on top.

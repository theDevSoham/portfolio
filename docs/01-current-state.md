# 01 — Current State Inventory

A precise, file-by-file snapshot of the app before the revamp. Use this as the "before" reference when refactoring. Higher-level narrative is in [`../CLAUDE_UNDERSTANDINGS.md`](../CLAUDE_UNDERSTANDINGS.md).

---

## Pages

### `src/app/layout.tsx` — Root layout (Server Component)
- Static `metadata` block (title, description, keywords, OG, Twitter). OG/Twitter use **placeholders** (`yourdomain.com`, `/og-image.png`, `@your_twitter`).
- Structure: `<body bg-black text-slate-300>` → `<PageLoader/>` → sticky `<header><Navbar/></header>` → `<main max-w-5xl>` → `<footer>` crediting "Next.js + Tailwind + Framer Motion".
- 🔁 Footer text, OG placeholders, and the always-on `PageLoader` all change in the revamp.

### `src/app/page.tsx` — Home / hero (`"use client"`)
- Framer Motion: two scaling blur blobs, floating hero image (infinite `y` loop + one-time fade), staggered `h1`/`p`/CTA reveals.
- Static content (no data fetch). CTAs link to `/projects` and `/contact`.
- 🔁 Can become a Server Component with a thin client island for the GSAP hero timeline.

### `src/app/about/page.tsx` (`"use client"`)
- `useEffect` → `fetch("/api/about")`; `loading` + empty states.
- Framer Motion: `containerVariants`/`itemVariants`, `whileInView` section reveals, skill card `whileHover` scale.
- 🔁 → Server Component reading `getAbout()` directly; reveals become GSAP ScrollTrigger.

### `src/app/projects/page.tsx` (`"use client"`)
- `useEffect` → `fetch("/api/projects")`. Grid of cards; `truncateWords(desc, 20)`.
- Framer Motion: staggered `whileInView` cards, hover scale+rotate, tap scale. Unused commented-out variants present.
- 🔁 → Server Component reading `getProjects()`.

### `src/app/projects/[slug]/page.tsx` (`"use client"`)
- `useParams()` → `fetch("/api/projects/${slug}")`. Image carousel with prev/next + thumbnails.
- 🔴 Renders `description` via **`dangerouslySetInnerHTML`** (no sanitization). Leftover `console.log`.
- 🔁 → Server Component with `generateStaticParams` / `generateMetadata`; carousel stays a small client island; sanitize or drop raw HTML.

### `src/app/contact/page.tsx` (`"use client"`)
- `useEffect` → `fetch("/api/contact")`. Form via Formspree `useForm("mvgbeqag")` (hardcoded id) + reCAPTCHA v3 (`NEXT_PUBLIC_RECAPTCHA_SITE_KEY`), injected via script tag. Success → `alert()`.
- ~10 Framer Motion reveals. Media block renders `.mp4` as `<video>` else `<Image>`.
- 🔁 Server Component shell reading `getContact()`; form stays a client island.

### `src/app/contact/layout.tsx` — 🔴 Bug
- Emits its **own `<html><body>`** nested inside the root layout. Invalid DOM. Fix: keep only metadata + `children`, or delete.

### `src/app/admin/page.tsx`
- Renders `AdminAbout` + `AdminContact`. Page itself is protected by middleware.

### `src/app/login/page.tsx` (`"use client"`)
- `signIn("credentials", {redirect:false})` → on success push `/admin`. No client validation; redirect target hardcoded.

### `src/app/loading.tsx`
- Returns `<PageLoader forced />` — the route-level Suspense fallback.

---

## Components

| File | Type | Role | Framer usage |
|---|---|---|---|
| `Navbar.tsx` | client | nav, active link, mobile menu | entrance stagger; **`layoutId="underline"`** shared layout; mobile menu height anim |
| `PageLoader.tsx` | client | full-screen loader | overlay fade, cycling icon scale/rotate, bouncing dots; ~1.2s on every route change |
| `AdminAbout.tsx` | client | About CRUD form + modal | modal scale/opacity |
| `AdminContact.tsx` | client | Contact/Socials CRUD + modal | modal scale/opacity |

Admin components hold large local state and call the unauthenticated mutation APIs + `/api/upload`. Modals don't trap focus or close on Escape/backdrop.

---

## API routes

| Route | Methods | Auth | Validation | Notes |
|---|---|---|---|---|
| `api/about` | GET/POST/PUT/DELETE | ❌ | ❌ | `upsertNested` helper for arrays |
| `api/auth/[...nextauth]` | GET/POST | ✅ NextAuth | basic | credentials vs `ADMIN_USER`/`ADMIN_PASSWORD` env, JWT sessions |
| `api/contact` | GET/POST/PUT/DELETE | ❌ | id-presence only | PUT nukes+recreates socials |
| `api/projects` | GET/POST/PUT/DELETE | ❌ | partial | parses FormData, uploads to Cloudinary inline |
| `api/projects/[slug]` | GET | n/a | ✅ 404 handling | read-only — fine |
| `api/social` | POST/PUT/DELETE | ❌ | id-presence only | no `contactId` existence check |
| `api/upload` | POST | ❌ | file-presence only | any type/size → Cloudinary |

Only `/api/projects/[slug]` (and the GET halves) are safe as-is. Every mutation endpoint is wide open. Details + fixes in [02-security-audit.md](./02-security-audit.md).

---

## Libs

- `prisma.ts` — singleton client with dev global cache. ✅
- `cloudinary.ts` — config from env, `secure:true`. ✅
- `iconMap.ts` — name → lucide component. ✅
- `about.ts` / `contact.ts` / `project.ts` — hand-written interfaces duplicating Prisma's generated types. 🔁 prefer `Prisma.*`/`@prisma/client` types.

---

## Config & tooling

- `next.config.ts` — `images.remotePatterns` for `res.cloudinary.com` + `github.com`.
- `tsconfig.json` — strict, `@/* → src/*`.
- `middleware.ts` — protects `/admin/:path*` only.
- `globals.css` — Tailwind v4 entry, dead `--background/--foreground` tokens, `.linkify`, and a `body { font-family: Arial }` that overrides Geist.
- Lockfiles — modified `yarn.lock` + untracked `package-lock.json` (pick one).

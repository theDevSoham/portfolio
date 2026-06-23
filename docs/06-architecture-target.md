# 06 — Target Architecture: Server Components & Data Layer (Goal #2)

The current app is "client-everything + fetch-in-useEffect." The target is "**Server Components by default, client islands only where interactivity demands it.**" This improves security (no public write APIs feeding the UI, less attack surface), performance (real SSR, better LCP/SEO), and simplicity (no loading-state plumbing).

---

## The rule of thumb

> Render on the server. Drop to `"use client"` only for a leaf that needs state, effects, event handlers, or browser APIs (animations, forms, carousels).

### Server vs Client split (target)

| Surface | Today | Target |
|---|---|---|
| `app/page.tsx` (home) | client | **Server** shell + `<HeroAnimation/>` client island (GSAP) |
| `about/page.tsx` | client + fetch | **Server**, `await getAbout()` + `<Reveal/>` client wrappers |
| `projects/page.tsx` | client + fetch | **Server**, `await getProjects()` |
| `projects/[slug]/page.tsx` | client + fetch | **Server** + `generateStaticParams`/`generateMetadata`; `<Gallery/>` client island |
| `contact/page.tsx` | client + fetch | **Server** shell + `<ContactForm/>` client island |
| `admin/*` | client | stays client (heavy interactivity) — but behind auth |
| Navbar | client | client (uses `usePathname`) — keep minimal |

---

## Data layer

Move all reads into `src/lib/data/*` server functions that call `prisma` directly. Server Components import these; no HTTP hop.

```ts
// src/lib/data/about.ts  (server-only)
import "server-only";
import { prisma } from "@/lib/prisma";
export async function getAbout() {
  return prisma.about.findFirst({
    include: { education: true, experiences: true, skills: true, achievements: true },
  });
}
```

```tsx
// app/about/page.tsx  (Server Component — no "use client")
import { getAbout } from "@/lib/data/about";
export default async function AboutPage() {
  const about = await getAbout();
  if (!about) return <EmptyState />;
  return <AboutView about={about} />; // presentational, server-rendered
}
```

- Add `import "server-only"` to data modules so they can never be bundled to the client.
- Use Next.js caching: `export const revalidate = 60` (or on-demand `revalidatePath` after admin edits) so public pages are static-ish but refresh after edits.
- Replace hand-written `lib/{about,contact,project}.ts` interfaces with Prisma-generated types (`Prisma.AboutGetPayload<...>`), eliminating drift.

### What happens to the API routes
- **Public GET routes** (`api/about`, `api/contact`, `api/projects`, `api/projects/[slug]`): no longer needed by the UI → **delete** (or keep one read-only JSON endpoint only if you want a public API). Removes surface (F7).
- **Mutation routes**: keep, but guard with `requireAdmin()` + Zod (doc 02). Or migrate admin writes to **Server Actions** (see below).
- `api/upload`: keep, guard + validate, or switch to signed Cloudinary uploads.

### Optional: Server Actions for admin writes
Instead of admin client components calling `fetch("/api/...")`, use **Server Actions**:
```ts
"use server";
export async function saveProject(input: ProjectInput) {
  await requireAdmin();
  const data = projectSchema.parse(input);
  const p = await prisma.project.upsert(/* ... */);
  revalidatePath("/projects");
  return p;
}
```
Benefits: auth + validation co-located, no public mutation endpoints at all, progressive-enhancement-friendly forms. This is the cleanest long-term shape and directly serves Goal #2. (Trade-off: a bigger refactor of the two admin components — can be phased.)

---

## Interactivity islands (the only client components)

- `HeroAnimation` — GSAP intro timeline (doc 04).
- `SmoothScrollProvider` — Lenis wrapper around `children` in root layout (doc 04).
- `Reveal` — small client wrapper that runs a ScrollTrigger fade-up on its children; used to sprinkle motion into server-rendered pages.
- `ProjectGallery` — carousel state.
- `ContactForm` — Formspree + reCAPTCHA + validation.
- `Navbar` — `usePathname` + mobile menu.
- Admin views — full CRUD (kept client, or Server-Action-backed forms).

---

## Migration order (low-risk)

1. Build `lib/data/*` server reads (additive, nothing breaks).
2. Convert `about` → `projects` → `projects/[slug]` → `contact` → `home` to Server Components one at a time, each reading via `lib/data` and delegating motion to small client islands.
3. Delete the now-unused public GET API routes.
4. Guard remaining mutation routes (or convert to Server Actions).
5. Fix `contact/layout.tsx` (remove nested `<html>`), add `not-found.tsx`, clean `globals.css`.

Each page conversion is independently shippable and testable.

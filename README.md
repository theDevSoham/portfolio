# Soham.dev — Portfolio

A modern, animated developer portfolio with a built-in admin CMS. Dark, gradient, "terminal-aurora" aesthetic, server-rendered for speed and SEO.

Built with **Next.js 15 (App Router)** · **TypeScript** · **Tailwind CSS v4** · **GSAP + Lenis** · **Prisma + MongoDB** · **NextAuth** · **Cloudinary**.

---

## Features

- **Server-first** — public pages are Server Components (SSR/SSG + ISR); no client-side data waterfalls.
- **GSAP + Lenis** — smooth scrolling, scroll-reveals, an animated hero portrait, and an aurora background. No Framer Motion.
- **Design system** — a neon dev-terminal token system (dark + light via `next-themes`) and a small shadcn-style component library (`Button`, `Card`, `Badge`, `Timeline`, …).
- **Admin CMS** — a real admin console (sidebar, loading skeletons, saving/toast states) to manage Projects, About, and Contact, gated by auth.
- **Hardened** — every mutation API requires an admin session and validates input with Zod; uploads are type/size limited.
- **Experience layer** — first-visit boot screen, scroll-progress bar, animated stat count-ups, a Konami easter egg, and a branded 404 / error pages.
- **SEO** — generated OG image, `sitemap.xml`, `robots.txt`, per-page metadata. Accessibility: skip link, focus rings, `prefers-reduced-motion` support throughout.

## Tech stack

| Area | Choice |
|---|---|
| Framework | Next.js 15 (App Router, RSC) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4, CSS variable tokens |
| Animation | GSAP, `@gsap/react`, Lenis |
| Data | Prisma ORM + MongoDB |
| Auth | NextAuth (credentials, JWT, bcrypt) |
| Media | Cloudinary |
| Forms | Formspree + reCAPTCHA v3 (contact) |

## Project structure

```
src/
├── app/
│   ├── (site)/            # public pages + marketing chrome layout
│   │   ├── page.tsx       # landing (hero, marquee, bento, featured, CTA)
│   │   ├── about/ projects/ contact/ login/
│   │   └── layout.tsx     # Navbar, Footer, Aurora, SmoothScroll, EntryScreen…
│   ├── admin/             # admin console (auth-gated, chrome-less)
│   ├── api/               # route handlers (guarded mutations)
│   ├── layout.tsx         # root: <html>/<body> + ThemeProvider + metadata
│   ├── opengraph-image.tsx, robots.ts, sitemap.ts, not-found.tsx, global-error.tsx
│   └── globals.css        # tokens, utilities, keyframes
├── components/            # ui/, admin/, home/, visual/, anim/, providers/
└── lib/                   # data/ (server reads), auth, validation, prisma, cloudinary
```

## Getting started

```bash
# 1. install
yarn install

# 2. configure env (see .env.example)
cp .env.example .env.local   # then fill in values

# 3. generate Prisma client & run
yarn prisma:generate
yarn dev
```

App runs at http://localhost:3000.

### Admin login

Generate a password hash and set it in `.env.local`:

```bash
node scripts/hash-password.mjs "your-password"
```

> **Heads-up:** bcrypt hashes contain `$`, which Next's env loader expands. The script prints a **`\$`-escaped** line for `.env.local`. On hosting dashboards (Vercel), paste the **raw** hash instead.

Log in at `/login`, manage content at `/admin`.

## Environment variables

See [`.env.example`](.env.example). Required: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `ADMIN_USER`, `ADMIN_PASSWORD_HASH`, `CLOUDINARY_*`, `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`. Set `NEXT_PUBLIC_SITE_URL` in production so metadata, OG, sitemap, and robots resolve to your domain.

## Deployment

Deploy on Vercel (or any Node host). Set all env vars in the dashboard (paste the **raw** bcrypt hash, no escaping). `yarn build` runs `prisma generate` then `next build`.

## License

Personal project — all rights reserved.

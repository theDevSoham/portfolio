# 02 — Security Audit & Hardening Plan (Goal #2)

The single most important workstream. The site currently lets **any anonymous visitor read, write, and delete all content** and **upload arbitrary files to your Cloudinary account**. Fix this before/with the architecture work — not after the visual redesign.

Severity: 🔴 critical · 🟠 high · 🟡 medium · 🟢 low

---

## Findings, ranked

### 🔴 F1 — All mutation APIs are unauthenticated
`api/about`, `api/contact`, `api/projects`, `api/social`, `api/upload` accept POST/PUT/DELETE from anyone. `middleware.ts` only matches `/admin/:path*`, which does **not** cover `/api/*`.

**Fix.**
1. Add a server-side guard and call it at the top of every mutating handler:
   ```ts
   // src/lib/auth.ts
   import { getServerSession } from "next-auth";
   import { authOptions } from "@/app/api/auth/[...nextauth]/options";
   export async function requireAdmin() {
     const session = await getServerSession(authOptions);
     if (!session) throw new Response("Unauthorized", { status: 401 });
     return session;
   }
   ```
   (Extract `authOptions` into its own file so it's importable; the route then just `export`s the handler.)
2. Also extend `middleware.ts` matcher to cover the mutating API paths as defense-in-depth:
   `matcher: ["/admin/:path*", "/api/about", "/api/contact", "/api/projects/:path*", "/api/social", "/api/upload"]` — but keep GET public where pages still need it (better: see §"Once pages are Server Components" below).

### 🔴 F2 — Unauthenticated, unrestricted file upload
`api/upload` (and the inline upload in `api/projects`) accept any file, any size, no auth → storage/bandwidth abuse and malware hosting on your domain's Cloudinary.

**Fix.** Require admin (F1) **and** validate: allowlist MIME types (`image/png|jpeg|webp|avif`, `video/mp4`), cap size (e.g. 5 MB image / 20 MB video), and consider Cloudinary **signed uploads** instead of proxying bytes through the Next server.

### 🔴 F3 — Stored XSS via `dangerouslySetInnerHTML`
`projects/[slug]/page.tsx` renders project `description` as raw HTML. With F1 open, an attacker can store a `<script>`; even after F1, if you keep rich text you must sanitize.

**Fix.** Preferred: store **plain text / Markdown** and render through a safe renderer (e.g. `react-markdown`, no raw HTML). If raw HTML is truly needed, sanitize server-side with `isomorphic-dompurify` and a strict allowlist.

### 🟠 F4 — Plaintext admin credentials, no rate limiting
NextAuth compares `credentials` to `ADMIN_USER`/`ADMIN_PASSWORD` env vars in plaintext. No brute-force protection, no lockout.

**Fix.** Store a **bcrypt/argon2 hash** (`ADMIN_PASSWORD_HASH`) and compare with `bcrypt.compare`. Add basic rate limiting on the credentials callback (e.g. Upstash Ratelimit, or an in-memory limiter for a single-admin site). Ensure `NEXTAUTH_SECRET` is set and strong.

### 🟠 F5 — No input validation anywhere
Endpoints trust the body shape; URLs (`repoUrl`, `liveUrl`, `resumeUrl`, social `url`), slugs, tags, emails are unvalidated.

**Fix.** Introduce **Zod** schemas per resource; `schema.parse(body)` at the top of each handler. Validate URL fields with `z.string().url()` and restrict protocol to `http(s)`. Enforce slug regex `^[a-z0-9-]+$`. Return `400` with the Zod error summary.

### 🟡 F6 — No ownership / existence checks
e.g. `api/social` creates links for any `contactId` without checking it exists. Single-admin app makes this lower-impact, but it allows orphaned/garbage data.

**Fix.** After auth, verify referenced records exist; rely on the single-admin model rather than per-user ownership.

### 🟡 F7 — Public read APIs leak structure & enable scraping
GET endpoints exist only to feed client components. Not a vuln per se, but unnecessary surface.

**Fix.** Once pages are Server Components (Goal #2 / doc 06), public pages read `prisma` directly via `lib/*`; the **public GET API routes can be deleted**, shrinking attack surface. Keep only what an external consumer truly needs.

### 🟡 F8 — Security headers / CSP absent
No CSP, `X-Frame-Options`, `Referrer-Policy`, etc.

**Fix.** Add a `headers()` block in `next.config.ts` (or middleware): CSP (tightened for the GSAP/Lenis/reCAPTCHA/Cloudinary origins), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, HSTS in prod.

### 🟢 F9 — Misc hygiene
- Remove `console.log` of data (`projects/[slug]`).
- Don't render personal phone/email as plain text if you want to reduce scraping (obfuscate or gate behind the form).
- Hide the Admin nav link when unauthenticated.
- Confirm `.env*` is git-ignored (it is via `.gitignore`); never commit secrets; rotate any that were ever committed.

---

## Target end-state checklist

- [ ] `requireAdmin()` guard on every POST/PUT/DELETE handler.
- [ ] `authOptions` extracted to importable module; password stored hashed; login rate-limited.
- [ ] Zod validation on every write; URL/slug/email constraints enforced.
- [ ] Upload endpoint: admin-only + MIME/size allowlist (or signed Cloudinary uploads).
- [ ] No `dangerouslySetInnerHTML`; Markdown or sanitized HTML only.
- [ ] Public pages read via server `lib/*`; redundant public GET APIs removed.
- [ ] Security headers + CSP in `next.config.ts`.
- [ ] Secrets audited; admin link gated on session.

See [06-architecture-target.md](./06-architecture-target.md) for how the Server Component migration removes much of this surface naturally.

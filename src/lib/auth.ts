import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import bcrypt from "bcryptjs";
import { rateLimit } from "@/lib/rateLimit";

/** Constant-time string comparison (avoids leaking match length via timing). */
function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

/**
 * NextAuth configuration. Extracted from the route handler so server code
 * (route guards) can import it via getServerSession(authOptions).
 *
 * Auth model (single admin):
 *  - Email must match ADMIN_USER (case-insensitive).
 *  - Password is checked against ADMIN_PASSWORD_HASH (bcrypt) when set.
 *  - If no hash is configured, falls back to plaintext ADMIN_PASSWORD with a
 *    warning so you are not locked out before running scripts/hash-password.mjs.
 */
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase() ?? "";
        const password = credentials?.password ?? "";
        const adminEmail = process.env.ADMIN_USER?.trim().toLowerCase() ?? "";

        // Best-effort brute-force throttle (per email). See lib/rateLimit.
        if (!rateLimit(`login:${email}`, 5, 60_000)) {
          throw new Error("Too many attempts. Try again in a minute.");
        }

        if (!email || !adminEmail || !safeEqual(email, adminEmail)) return null;

        const hash = process.env.ADMIN_PASSWORD_HASH;
        if (hash) {
          const ok = await bcrypt.compare(password, hash);
          return ok ? { id: "admin-1", name: "Admin", email: process.env.ADMIN_USER } : null;
        }

        const plain = process.env.ADMIN_PASSWORD;
        if (plain) {
          console.warn(
            "[auth] ADMIN_PASSWORD_HASH not set — using plaintext ADMIN_PASSWORD. " +
              "Generate a hash with `node scripts/hash-password.mjs <password>` and set ADMIN_PASSWORD_HASH."
          );
          return safeEqual(password, plain)
            ? { id: "admin-1", name: "Admin", email: process.env.ADMIN_USER }
            : null;
        }

        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  pages: { signIn: "/login" },
};

/** True when the current request carries a valid admin session. */
export async function isAdmin(): Promise<boolean> {
  const session = await getServerSession(authOptions);
  return Boolean(session);
}

/** Standard 401 response for unauthenticated mutations. */
export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

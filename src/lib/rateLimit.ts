/**
 * Minimal in-memory fixed-window rate limiter.
 *
 * Best-effort only: state lives in a single process, so it does NOT hold across
 * serverless instances or restarts. Good enough to blunt naive brute-force on a
 * single-admin site; for production-grade limiting use a shared store
 * (e.g. Upstash Ratelimit / Redis).
 */
const hits = new Map<string, { count: number; resetAt: number }>();

/**
 * @returns `true` if the action is allowed, `false` if the limit is exceeded.
 * @param key     identifier to bucket by (e.g. `login:<email>`)
 * @param max     max allowed actions per window
 * @param windowMs window length in milliseconds
 */
export function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= max) return false;

  entry.count += 1;
  return true;
}

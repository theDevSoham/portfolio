// Generate a bcrypt hash for the admin password.
// Usage:  node scripts/hash-password.mjs "your-password"
import bcrypt from "bcryptjs";

const password = process.argv[2];
if (!password) {
  console.error('Usage: node scripts/hash-password.mjs "your-password"');
  process.exit(1);
}

const hash = await bcrypt.hash(password, 12);
// bcrypt hashes contain `$`, which Next's .env loader treats as variable
// expansion and silently corrupts. Escape each `$` for local .env files.
const escaped = hash.replace(/\$/g, "\\$");

console.log("\n# .env.local — escape the $ signs (required, or the hash is mangled):");
console.log("ADMIN_PASSWORD_HASH=" + escaped);
console.log("\n# Hosting dashboard (Vercel, etc.) — env vars are literal, paste the raw hash:");
console.log("ADMIN_PASSWORD_HASH=" + hash + "\n");

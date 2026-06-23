// Generate a bcrypt hash for the admin password.
// Usage:  node scripts/hash-password.mjs "your-password"
// Copy the printed value into ADMIN_PASSWORD_HASH in your .env.local
import bcrypt from "bcryptjs";

const password = process.argv[2];
if (!password) {
  console.error('Usage: node scripts/hash-password.mjs "your-password"');
  process.exit(1);
}

const hash = await bcrypt.hash(password, 12);
console.log("\nADMIN_PASSWORD_HASH=" + hash + "\n");

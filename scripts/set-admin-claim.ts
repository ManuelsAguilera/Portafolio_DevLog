import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const keyPath = resolve(
  __dirname,
  "../manudevlog-firebase-adminsdk-fbsvc-3656f64ab1.json"
);

const serviceAccount = JSON.parse(readFileSync(keyPath, "utf-8"));

initializeApp({ credential: cert(serviceAccount) });

const auth = getAuth();

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error("Usage: npx tsx scripts/set-admin-claim.ts <email>");
    process.exit(1);
  }

  const user = await auth.getUserByEmail(email);
  await auth.setCustomUserClaims(user.uid, { admin: true });
  console.log(`✅ Admin claim set for ${email} (${user.uid})`);
}

main().catch((err) => {
  console.error("❌ Failed:", err);
  process.exit(1);
});

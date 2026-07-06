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

async function createAdmin() {
  const email = process.argv[2] || "manuelaguilera.devs@gmail.com";
  const password = process.env.ADMIN_PASSWORD || process.argv[3];

  if (!password) {
    console.error("Usage: Provide password via ADMIN_PASSWORD env var or as 2nd CLI arg");
    console.error("  npx tsx scripts/create-admin.ts [email] <password>");
    console.error("  ADMIN_PASSWORD=<pass> npx tsx scripts/create-admin.ts [email]");
    process.exit(1);
  }

  try {
    const user = await auth.createUser({
      email,
      password,
      emailVerified: true,
    });
    console.log("✅ Admin user created!");
    console.log(`UID: ${user.uid}`);
    console.log(`Email: ${user.email}`);
  } catch (err: any) {
    if (err.code === "auth/email-already-exists") {
      console.log("ℹ️  User already exists. Fetching UID...");
      const user = await auth.getUserByEmail(email);
      console.log(`UID: ${user.uid}`);
    } else {
      console.error("❌ Error:", err.message);
      process.exit(1);
    }
  }
}

createAdmin();

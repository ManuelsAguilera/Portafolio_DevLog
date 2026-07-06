import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (!serviceAccount) {
  throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY env var is required for admin SDK");
}

const app =
  getApps().length === 0
    ? initializeApp({
        credential: cert(JSON.parse(serviceAccount)),
      })
    : getApps()[0];

export const adminDb = getFirestore(app);
export const adminAuth = getAuth(app);

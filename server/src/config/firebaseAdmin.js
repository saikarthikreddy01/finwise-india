import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

export function getFirebaseAdminAuth() {
  const existing = getApps().find(app => app.name === "finwise-admin");
  if (existing) return getAuth(existing);

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!serviceAccountJson) {
    throw Object.assign(new Error("Firebase Admin is not configured. Set FIREBASE_SERVICE_ACCOUNT_JSON in server/.env."), { status: 503 });
  }

  let serviceAccount;
  try {
    serviceAccount = JSON.parse(serviceAccountJson);
  } catch {
    throw Object.assign(new Error("FIREBASE_SERVICE_ACCOUNT_JSON must contain valid service-account JSON."), { status: 503 });
  }

  const app = initializeApp({
    credential: cert(serviceAccount),
    projectId: serviceAccount.project_id
  }, "finwise-admin");
  return getAuth(app);
}

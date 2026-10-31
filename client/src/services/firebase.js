import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID
};

export function isFirebaseConfigured() {
  return Boolean(config.apiKey && config.authDomain && config.projectId && config.appId);
}

let firebaseAuth;

export function getFirebaseAuth() {
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase is not configured. Add the Firebase web app settings to client/.env.");
  }
  if (!firebaseAuth) {
    const app = getApps().length ? getApps()[0] : initializeApp(config);
    firebaseAuth = getAuth(app);
  }
  return firebaseAuth;
}

export function normalizeIndiaPhone(value) {
  const digits = String(value || "").replace(/\D/g, "");
  const national = digits.startsWith("91") && digits.length === 12 ? digits.slice(2) : digits;
  if (!/^[6-9]\d{9}$/.test(national)) {
    throw new Error("Enter a valid 10-digit Indian mobile number.");
  }
  return `+91${national}`;
}

export function firebaseAuthError(error) {
  const messages = {
    "auth/email-already-in-use": "An account already exists for this email. Sign in instead.",
    "auth/invalid-credential": "The email or password is incorrect.",
    "auth/invalid-email": "Enter a valid email address.",
    "auth/weak-password": "Choose a stronger password with at least 10 characters.",
    "auth/invalid-phone-number": "Enter a valid phone number in international format.",
    "auth/too-many-requests": "Too many attempts. Wait a while and try again.",
    "auth/captcha-check-failed": "Phone verification failed. Refresh the page and try again.",
    "auth/app-not-authorized": "This domain is not authorized in your Firebase project.",
    "auth/network-request-failed": "Network error. Check your connection and try again.",
    "auth/credential-already-in-use": "That phone number is linked to another Firebase account.",
    "auth/provider-already-linked": "A phone number is already linked to this account."
  };
  return messages[error?.code] || error?.message || "Unable to complete Firebase authentication.";
}

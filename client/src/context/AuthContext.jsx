import { createContext, useContext, useMemo, useRef, useState } from "react";
import {
  createUserWithEmailAndPassword,
  linkWithPhoneNumber,
  RecaptchaVerifier,
  reload,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  signOut,
  updateProfile
} from "firebase/auth";
import api from "../services/api";
import { firebaseAuthError, getFirebaseAuth, isFirebaseConfigured, normalizeIndiaPhone } from "../services/firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("finwise_user") || "null"); } catch { return null; }
  });
  const recaptchaVerifier = useRef(null);
  const phoneConfirmation = useRef(null);

  function saveSession(data) {
    localStorage.setItem("finwise_access_token", data.accessToken);
    localStorage.setItem("finwise_user", JSON.stringify(data.user));
    setUser(data.user);
  }

  async function createApiSession(firebaseUser) {
    const idToken = await firebaseUser.getIdToken(true);
    const { data } = await api.post("/auth/firebase/session", { idToken });
    saveSession(data);
  }

  async function getRecaptcha(containerId) {
    const auth = getFirebaseAuth();
    if (!recaptchaVerifier.current) {
      recaptchaVerifier.current = new RecaptchaVerifier(auth, containerId, { size: "invisible" });
    }
    return recaptchaVerifier.current;
  }

  async function register(name, email, password) {
    const auth = getFirebaseAuth();
    try {
      const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await updateProfile(credential.user, { displayName: name.trim() });
      await sendEmailVerification(credential.user);
    } catch (error) {
      throw new Error(firebaseAuthError(error));
    }
  }

  async function resendRegistrationCodes() {
    const auth = getFirebaseAuth();
    if (!auth.currentUser) throw new Error("Your sign-up session expired. Please create your account again.");
    try {
      await sendEmailVerification(auth.currentUser);
    } catch (error) {
      throw new Error(firebaseAuthError(error));
    }
  }

  async function verifyRegistration() {
    const auth = getFirebaseAuth();
    if (!auth.currentUser) throw new Error("Your sign-up session expired. Sign in after verifying your email.");
    await reload(auth.currentUser);
    if (!auth.currentUser.emailVerified) {
      throw new Error("Email is not verified yet. Open the verification link in your inbox, then try again.");
    }
    await createApiSession(auth.currentUser);
  }

  async function login(email, password) {
    const auth = getFirebaseAuth();
    let credential;
    try {
      credential = await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (error) {
      throw new Error(firebaseAuthError(error));
    }
    if (!credential.user.emailVerified) {
      await sendEmailVerification(credential.user);
      throw new Error("Verify your email using the link we just sent, then sign in again.");
    }
    await createApiSession(credential.user);
  }

  async function requestPhoneLoginCode(phone, containerId = "recaptcha-container") {
    const verifier = await getRecaptcha(containerId);
    try {
      phoneConfirmation.current = await signInWithPhoneNumber(getFirebaseAuth(), normalizeIndiaPhone(phone), verifier);
    } catch (error) {
      throw new Error(firebaseAuthError(error));
    } finally {
      verifier.clear();
      recaptchaVerifier.current = null;
    }
  }

  async function loginWithPhoneOtp(code) {
    if (!phoneConfirmation.current) throw new Error("Request a phone code first.");
    let credential;
    try {
      credential = await phoneConfirmation.current.confirm(code);
    } catch (error) {
      throw new Error(firebaseAuthError(error));
    }
    phoneConfirmation.current = null;
    await createApiSession(credential.user);
  }

  async function sendPhoneLinkCode(email, password, phone, containerId = "recaptcha-container") {
    const auth = getFirebaseAuth();
    let credential;
    try {
      credential = await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (error) {
      throw new Error(firebaseAuthError(error));
    }
    if (!credential.user.emailVerified) throw new Error("Verify your email before linking phone sign-in.");
    const verifier = await getRecaptcha(containerId);
    try {
      phoneConfirmation.current = await linkWithPhoneNumber(credential.user, normalizeIndiaPhone(phone), verifier);
    } catch (error) {
      throw new Error(firebaseAuthError(error));
    } finally {
      verifier.clear();
      recaptchaVerifier.current = null;
    }
  }

  async function verifyPhoneLinkCode(code) {
    if (!phoneConfirmation.current) throw new Error("Request a phone verification code first.");
    let credential;
    try {
      credential = await phoneConfirmation.current.confirm(code);
    } catch (error) {
      throw new Error(firebaseAuthError(error));
    }
    phoneConfirmation.current = null;
    const idToken = await credential.user.getIdToken(true);
    const { data } = await api.post("/auth/firebase/phone/link", { idToken });
    return data;
  }

  async function refreshUser() {
    const { data } = await api.get("/auth/me");
    localStorage.setItem("finwise_user", JSON.stringify(data.user));
    setUser(data.user);
  }

  async function logout() {
    localStorage.removeItem("finwise_access_token");
    localStorage.removeItem("finwise_user");
    setUser(null);
    phoneConfirmation.current = null;
    if (isFirebaseConfigured()) {
      const auth = getFirebaseAuth();
      if (auth.currentUser) await signOut(auth);
    }
  }

  const value = useMemo(() => ({
    user,
    login,
    register,
    resendRegistrationCodes,
    verifyRegistration,
    requestPhoneLoginCode,
    loginWithPhoneOtp,
    sendPhoneLinkCode,
    verifyPhoneLinkCode,
    refreshUser,
    logout
  }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

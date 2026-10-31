import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { getFirebaseAdminAuth } from "../config/firebaseAdmin.js";
import { createAccessToken } from "../utils/token.js";

function authResponse(user) {
  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      phoneVerified: user.phoneVerified
    },
    accessToken: createAccessToken(user)
  };
}

function normalizedEmail(email) {
  return typeof email === "string" ? email.trim().toLowerCase() : "";
}

async function findOrCreateFirebaseUser(claims) {
  const email = normalizedEmail(claims.email);
  const phone = claims.phone_number;
  const emailIsVerified = claims.email_verified === true;
  if (email && !emailIsVerified) {
    throw Object.assign(new Error("Verify your email address in Firebase before signing in."), { status: 403 });
  }
  if (!emailIsVerified && !phone) {
    throw Object.assign(new Error("Firebase token must contain a verified email or phone number."), { status: 401 });
  }

  let user = await User.findOne({ firebaseUid: claims.uid });
  if (!user && emailIsVerified) user = await User.findOne({ email });
  if (!user && phone) user = await User.findOne({ phone, phoneVerified: true });

  if (!user) {
    const passwordHash = await bcrypt.hash(randomBytes(48).toString("base64url"), 12);
    user = await User.create({
      name: claims.name?.trim().slice(0, 80) || (email ? email.split("@")[0] : "FinWise member"),
      email: email || `${claims.uid}@phone.finwise.invalid`,
      passwordHash,
      emailVerified: emailIsVerified || !email,
      firebaseUid: claims.uid,
      ...(phone ? { phone, phoneVerified: true } : {})
    });
    return user;
  }

  if (user.firebaseUid && user.firebaseUid !== claims.uid) {
    throw Object.assign(new Error("This account is linked to a different Firebase identity. Contact support."), { status: 409 });
  }

  const changes = {};
  if (!user.firebaseUid) changes.firebaseUid = claims.uid;
  if (emailIsVerified && !user.emailVerified) changes.emailVerified = true;
  if (phone && !user.phoneVerified) {
    changes.phone = phone;
    changes.phoneVerified = true;
  }
  if (Object.keys(changes).length) {
    try {
      Object.assign(user, changes);
      await user.save();
    } catch (error) {
      if (error.code === 11000) {
        throw Object.assign(new Error("That email or phone number is already linked to another account."), { status: 409 });
      }
      throw error;
    }
  }
  return user;
}

export async function createFirebaseSession(req, res) {
  const idToken = req.body?.idToken;
  if (typeof idToken !== "string" || !idToken) {
    return res.status(400).json({ message: "Firebase ID token is required" });
  }

  let claims;
  try {
    claims = await getFirebaseAdminAuth().verifyIdToken(idToken, true);
  } catch (error) {
    if (error.status) throw error;
    return res.status(401).json({ message: "Firebase sign-in is invalid or expired" });
  }

  const user = await findOrCreateFirebaseUser(claims);
  res.json(authResponse(user));
}

export async function linkFirebasePhone(req, res) {
  const idToken = req.body?.idToken;
  if (typeof idToken !== "string" || !idToken) {
    return res.status(400).json({ message: "Firebase ID token is required" });
  }

  let claims;
  try {
    claims = await getFirebaseAdminAuth().verifyIdToken(idToken, true);
  } catch (error) {
    if (error.status) throw error;
    return res.status(401).json({ message: "Firebase phone verification is invalid or expired" });
  }

  if (!claims.phone_number || normalizedEmail(claims.email) !== normalizedEmail(req.user.email)) {
    return res.status(403).json({ message: "Verify a phone number on the Firebase account for this email." });
  }
  if (req.user.firebaseUid && req.user.firebaseUid !== claims.uid) {
    return res.status(409).json({ message: "The Firebase account does not match the signed-in FinWise account." });
  }
  if (await User.exists({ phone: claims.phone_number, _id: { $ne: req.user._id } })) {
    return res.status(409).json({ message: "Phone number is already linked to another account" });
  }

  const user = await User.findById(req.user._id);
  user.phone = claims.phone_number;
  user.phoneVerified = true;
  user.firebaseUid = claims.uid;
  try {
    await user.save();
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Phone number is already linked to another account" });
    }
    throw error;
  }
  res.json({ message: "Phone number verified and ready for OTP sign-in." });
}

export async function me(req, res) {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      phone: req.user.phone,
      phoneVerified: req.user.phoneVerified
    }
  });
}

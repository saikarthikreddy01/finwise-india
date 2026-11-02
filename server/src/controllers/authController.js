import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { createAccessToken } from "../utils/token.js";

function authResponse(user) {
  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    accessToken: createAccessToken(user)
  };
}

function normalizedEmail(email) {
  return typeof email === "string" ? email.trim().toLowerCase() : "";
}

function invalidRequest(message) {
  return Object.assign(new Error(message), { status: 400 });
}

export async function register(req, res) {
  const { name, password } = req.body || {};
  const email = normalizedEmail(req.body?.email);

  if (typeof name !== "string" || !name.trim() || name.trim().length > 80) {
    throw invalidRequest("Enter a name between 1 and 80 characters.");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw invalidRequest("Enter a valid email address.");
  }
  if (typeof password !== "string" || password.length < 10) {
    throw invalidRequest("Password must be at least 10 characters.");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  let user;
  try {
    user = await User.create({ name: name.trim(), email, passwordHash });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "An account already exists for this email." });
    }
    throw error;
  }

  res.status(201).json(authResponse(user));
}

export async function login(req, res) {
  const email = normalizedEmail(req.body?.email);
  const password = req.body?.password;
  if (!email || typeof password !== "string" || !password) {
    throw invalidRequest("Enter your email address and password.");
  }

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ message: "The email or password is incorrect." });
  }

  res.json(authResponse(user));
}

export async function me(req, res) {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
}

import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { createAccessToken } from "../utils/token.js";

export async function register(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password || password.length < 10) {
    return res.status(400).json({ message: "Name, valid email and password (at least 10 characters) are required" });
  }
  const normalizedEmail = email.toLowerCase().trim();
  if (await User.exists({ email: normalizedEmail })) return res.status(409).json({ message: "Email already registered" });
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email: normalizedEmail, passwordHash });
  res.status(201).json({ user: { id: user._id, name: user.name, email: user.email }, accessToken: createAccessToken(user) });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email: String(email || "").toLowerCase().trim() });
  if (!user || !(await bcrypt.compare(password || "", user.passwordHash))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  res.json({ user: { id: user._id, name: user.name, email: user.email }, accessToken: createAccessToken(user) });
}

export async function me(req, res) {
  res.json({ user: { id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role } });
}

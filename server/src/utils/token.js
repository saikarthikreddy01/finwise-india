import jwt from "jsonwebtoken";

export function createAccessToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );
}

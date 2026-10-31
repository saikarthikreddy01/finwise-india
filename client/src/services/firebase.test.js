import { describe, expect, it } from "vitest";
import { firebaseAuthError, normalizeIndiaPhone } from "./firebase.js";

describe("Firebase authentication helpers", () => {
  it("normalizes valid Indian numbers to E.164", () => {
    expect(normalizeIndiaPhone("98765 43210")).toBe("+919876543210");
    expect(normalizeIndiaPhone("+91 98765 43210")).toBe("+919876543210");
  });

  it("rejects phone numbers outside the supported Indian format", () => {
    expect(() => normalizeIndiaPhone("12345")).toThrow("valid 10-digit Indian mobile");
  });

  it("translates common Firebase authentication errors", () => {
    expect(firebaseAuthError({ code: "auth/too-many-requests" })).toContain("Too many attempts");
    expect(firebaseAuthError({ code: "auth/invalid-credential" })).toContain("email or password");
  });
});

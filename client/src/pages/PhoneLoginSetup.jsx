import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function PhoneLoginSetup() {
  const { user, refreshUser, sendPhoneLinkCode, verifyPhoneLinkCode } = useAuth();
  const [phone, setPhone] = useState(user?.phone || "");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setBusy(true);
    try {
      if (!codeSent) {
        await sendPhoneLinkCode(user.email, password, phone);
        setCodeSent(true);
        setMessage("A Firebase verification code has been sent to your phone.");
        setPassword("");
      } else {
        const data = await verifyPhoneLinkCode(otp);
        await refreshUser();
        setMessage(data.message);
        setCodeSent(false);
        setOtp("");
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || "Unable to update phone login");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <p className="text-sm text-[#e0bd72]">ACCOUNT SECURITY</p>
      <h1 className="mt-1 text-3xl font-semibold">Phone login</h1>
      <p className="mt-2 text-slate-400">Link and verify a phone number with Firebase to use SMS one-time codes when signing in.</p>
      <form onSubmit={submit} className="mt-6 rounded-2xl border border-white/10 bg-[#101f32] p-6">
        <p className="mb-5 text-sm text-slate-400">
          {user?.phoneVerified ? `Verified phone: ${user.phone}` : "No verified phone number is linked to your account."}
        </p>
        <label className="auth-field">
          <span>Indian mobile number</span>
          <input required autoComplete="tel" type="tel" inputMode="tel" placeholder="+91 98765 43210" value={phone} onChange={event => setPhone(event.target.value)} />
        </label>
        {!codeSent && (
          <label className="auth-field">
            <span>Current password</span>
            <input required autoComplete="current-password" type="password" value={password} onChange={event => setPassword(event.target.value)} />
          </label>
        )}
        {codeSent && (
          <label className="auth-field">
            <span>6-digit verification code</span>
            <input required inputMode="numeric" pattern="[0-9]{6}" maxLength={6} autoComplete="one-time-code" placeholder="Enter SMS code" value={otp} onChange={event => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))} />
          </label>
        )}
        <div id="recaptcha-container" />
        {error && <p className="auth-error" role="alert">{error}</p>}
        {message && <p className="auth-success" role="status">{message}</p>}
        <button disabled={busy} className="auth-submit">
          {busy ? "Please wait..." : codeSent ? "Verify phone number" : "Send verification code"}
          <span aria-hidden="true">→</span>
        </button>
      </form>
    </div>
  );
}

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthPage({ mode = "login" }) {
  const isRegister = mode === "register";
  const {
    login, register, resendRegistrationCodes, verifyRegistration,
    requestPhoneLoginCode, loginWithPhoneOtp
  } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "", emailOtp: "", phoneOtp: ""
  });
  const [step, setStep] = useState("details");
  const [loginMethod, setLoginMethod] = useState("password");
  const [phoneCodeSent, setPhoneCodeSent] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setBusy(true);
    try {
      if (isRegister && step === "details") {
        await register(form.name, form.email, form.password);
        setStep("verify");
        setMessage("A verification link has been sent to your email.");
      } else if (isRegister) {
        await verifyRegistration();
        navigate("/");
      } else if (loginMethod === "password") {
        await login(form.email, form.password);
        navigate("/");
      } else if (!phoneCodeSent) {
        await requestPhoneLoginCode(form.phone);
        setPhoneCodeSent(true);
        setMessage("A sign-in code has been sent to your phone.");
      } else {
        await loginWithPhoneOtp(form.phoneOtp);
        navigate("/");
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || "Unable to continue");
    } finally {
      setBusy(false);
    }
  }

  async function resendCodes() {
    setError("");
    setMessage("");
    setBusy(true);
    try {
      await resendRegistrationCodes();
      setMessage("A new verification link has been sent to your email.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || "Unable to resend verification link");
    } finally {
      setBusy(false);
    }
  }

  async function requestAnotherPhoneCode() {
    setError("");
    setMessage("");
    setBusy(true);
    try {
      await requestPhoneLoginCode(form.phone);
      setMessage("A new sign-in code has been sent to your phone.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || "Unable to send a sign-in code");
    } finally {
      setBusy(false);
    }
  }

  const registrationVerification = isRegister && step === "verify";
  const usePassword = !isRegister && loginMethod === "password";
  const usePhone = !isRegister && loginMethod === "phone";

  return (
    <main className="auth-screen">
      <div className="auth-glow auth-glow-one" aria-hidden="true" />
      <div className="auth-glow auth-glow-two" aria-hidden="true" />
      <div className="auth-grid" aria-hidden="true" />
      <div className="auth-layout">
        <section className="auth-intro">
          <div className="auth-brand">
            <span className="auth-brand-mark">F</span>
            <span>FINWISE <b>INDIA</b></span>
          </div>
          <div className="auth-intro-copy">
            <p className="auth-eyebrow">YOUR FINANCES, REIMAGINED</p>
            <h2>Make every<br />rupee <span>count.</span></h2>
            <p className="auth-description">A calmer, clearer way to understand your money and plan what comes next.</p>
            <div className="auth-feature"><span className="auth-feature-dot" /> Built for your financial journey in India</div>
          </div>
          <p className="auth-footer">Personal finance, with a little more clarity.</p>
        </section>

        <section className="auth-card-wrap">
          <form onSubmit={submit} className="auth-card">
            <div className="auth-card-mark">₹</div>
            <p className="auth-card-eyebrow">
              {isRegister ? registrationVerification ? "VERIFY YOUR EMAIL" : "START YOUR JOURNEY" : "WELCOME TO FINWISE"}
            </p>
            <h1>{isRegister ? registrationVerification ? "Check your inbox" : "Create your account" : "Welcome back"}</h1>
            <p className="auth-card-description">
              {isRegister
                ? registrationVerification
                  ? "Open the verification link in your inbox, then return here."
                  : "Set up your personal finance space."
                : loginMethod === "phone"
                  ? phoneCodeSent ? "Enter the code we sent to your phone." : "Sign in securely with a one-time phone code."
                  : "Sign in to your personal finance space."}
            </p>

            {!registrationVerification && isRegister && (
              <label className="auth-field">
                <span>Full name</span>
                <input required autoComplete="name" placeholder="Your name" value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} />
              </label>
            )}
            {!registrationVerification && (isRegister || usePassword) && (
              <label className="auth-field">
                <span>Email address</span>
                <input required autoComplete="email" type="email" placeholder="you@example.com" value={form.email} onChange={event => setForm({ ...form, email: event.target.value })} />
              </label>
            )}
            {!registrationVerification && usePhone && (
              <label className="auth-field">
                <span>Indian mobile number</span>
                <input required autoComplete="tel" type="tel" inputMode="tel" placeholder="+91 98765 43210" value={form.phone} onChange={event => setForm({ ...form, phone: event.target.value })} />
              </label>
            )}
            {!registrationVerification && (isRegister || usePassword) && (
              <label className="auth-field">
                <span>Password</span>
                <input required minLength={10} autoComplete={isRegister ? "new-password" : "current-password"} type="password" placeholder="Minimum 10 characters" value={form.password} onChange={event => setForm({ ...form, password: event.target.value })} />
              </label>
            )}
            {registrationVerification && (
              <>
                <label className="auth-field">
                  <span>Email verification</span>
                  <p className="auth-card-description">Firebase sends a secure verification link to {form.email}.</p>
                </label>
                <button type="button" disabled={busy} onClick={resendCodes} className="auth-resend">Resend verification link</button>
                <button type="button" disabled={busy} onClick={async () => {
                  setError("");
                  setMessage("");
                  setBusy(true);
                  try {
                    await verifyRegistration();
                    navigate("/");
                  } catch (requestError) {
                    setError(requestError.message || "Email is not verified yet.");
                  } finally {
                    setBusy(false);
                  }
                }} className="auth-resend">I verified my email — continue</button>
              </>
            )}
            {!isRegister && (
              <div className="auth-method-switch" aria-label="Choose sign-in method">
                <button type="button" className={loginMethod === "password" ? "active" : ""} onClick={() => { setLoginMethod("password"); setPhoneCodeSent(false); setError(""); setMessage(""); }}>Email &amp; password</button>
                <button type="button" className={loginMethod === "phone" ? "active" : ""} onClick={() => { setLoginMethod("phone"); setError(""); setMessage(""); }}>Phone OTP</button>
              </div>
            )}
            {loginMethod === "phone" && phoneCodeSent && !isRegister && (
              <>
                <label className="auth-field">
                  <span>6-digit sign-in code</span>
                  <input required inputMode="numeric" pattern="[0-9]{6}" maxLength={6} autoComplete="one-time-code" placeholder="Enter code" value={form.phoneOtp} onChange={event => setForm({ ...form, phoneOtp: event.target.value.replace(/\D/g, "").slice(0, 6) })} />
                </label>
                <button type="button" disabled={busy} onClick={requestAnotherPhoneCode} className="auth-resend">Send another code</button>
              </>
            )}
            <div id="recaptcha-container" />
            {error && <p className="auth-error" role="alert">{error}</p>}
            {message && <p className="auth-success" role="status">{message}</p>}
            <button disabled={busy} className="auth-submit">
              {busy ? "Please wait..." : registrationVerification ? "Verify and continue" : isRegister ? "Send verification codes" : loginMethod === "phone" && !phoneCodeSent ? "Send sign-in code" : "Sign in"}
              <span aria-hidden="true">→</span>
            </button>
            <p className="auth-switch">
              {isRegister ? registrationVerification ? "Entered the wrong details?" : "Already have an account?" : "New to FinWise?"}{" "}
              <Link to={isRegister ? "/login" : "/register"}>{isRegister ? registrationVerification ? "Start over" : "Sign in" : "Create account"}</Link>
            </p>
            <p className="auth-security"><span aria-hidden="true">◇</span> Your financial workspace, protected</p>
          </form>
        </section>
      </div>
    </main>
  );
}

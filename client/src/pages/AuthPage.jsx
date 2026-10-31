import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthPage({ mode = "login" }) {
  const isRegister = mode === "register";
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault(); setError(""); setBusy(true);
    try {
      if (isRegister) await register(form.name, form.email, form.password);
      else await login(form.email, form.password);
      navigate("/");
    } catch (err) { setError(err.response?.data?.message || "Unable to continue"); }
    finally { setBusy(false); }
  }

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
            <p className="auth-card-eyebrow">{isRegister ? "START YOUR JOURNEY" : "WELCOME TO FINWISE"}</p>
            <h1>{isRegister ? "Create your account" : "Welcome back"}</h1>
            <p className="auth-card-description">{isRegister ? "Set up your personal finance space." : "Sign in to your personal finance space."}</p>

            {isRegister && (
              <label className="auth-field">
                <span>Full name</span>
                <input required autoComplete="name" placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </label>
            )}
            <label className="auth-field">
              <span>Email address</span>
              <input required autoComplete="email" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </label>
            <label className="auth-field">
              <span>Password</span>
              <input required minLength={8} autoComplete={isRegister ? "new-password" : "current-password"} type="password" placeholder="Minimum 10 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            </label>
            {error && <p className="auth-error" role="alert">{error}</p>}
            <button disabled={busy} className="auth-submit">{busy ? "Please wait..." : isRegister ? "Create account" : "Sign in"}<span aria-hidden="true">→</span></button>
            <p className="auth-switch">
              {isRegister ? "Already have an account?" : "New to FinWise?"}{" "}
              <Link to={isRegister ? "/login" : "/register"}>{isRegister ? "Sign in" : "Create account"}</Link>
            </p>
            <p className="auth-security"><span aria-hidden="true">◇</span> Your financial workspace, protected</p>
          </form>
        </section>
      </div>
    </main>
  );
}

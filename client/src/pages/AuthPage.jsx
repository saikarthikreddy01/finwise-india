import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

  return <div className="flex min-h-screen items-center justify-center bg-[#07111f] p-5">
    <form onSubmit={submit} className="w-full max-w-md rounded-3xl border border-white/10 bg-[#101f32] p-8">
      <div className="mb-2 text-sm font-semibold text-emerald-300">FINWISE INDIA</div>
      <h1 className="text-3xl font-semibold">{isRegister ? "Create your account" : "Welcome back"}</h1>
      <p className="mt-2 text-sm text-slate-400">Manage your money with clarity.</p>
      {isRegister && <input required placeholder="Full name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="mt-6 w-full rounded-xl border border-white/10 bg-[#07111f] p-3 outline-none focus:border-emerald-400"/>}
      <input required type="email" placeholder="Email address" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="mt-4 w-full rounded-xl border border-white/10 bg-[#07111f] p-3 outline-none focus:border-emerald-400"/>
      <input required minLength={10} type="password" placeholder="Password (minimum 10 characters)" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} className="mt-4 w-full rounded-xl border border-white/10 bg-[#07111f] p-3 outline-none focus:border-emerald-400"/>
      {error && <p className="mt-3 text-sm text-rose-300">{error}</p>}
      <button disabled={busy} className="mt-6 w-full rounded-xl bg-emerald-400 px-4 py-3 font-semibold text-[#062016] disabled:opacity-50">{busy ? "Please wait..." : isRegister ? "Create account" : "Sign in"}</button>
      <p className="mt-5 text-center text-sm text-slate-400">{isRegister ? "Already registered?" : "New to FinWise?"} <a className="text-emerald-300" href={isRegister ? "/login" : "/register"}>{isRegister ? "Sign in" : "Create account"}</a></p>
    </form>
  </div>;
}

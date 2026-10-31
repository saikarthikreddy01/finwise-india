import { lazy, Suspense, useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Transactions = lazy(() => import("./pages/Transactions"));
const Calculators = lazy(() => import("./pages/Calculators"));
const Goals = lazy(() => import("./pages/Goals"));
const Products = lazy(() => import("./pages/Products"));
const PhoneLoginSetup = lazy(() => import("./pages/PhoneLoginSetup"));
const AuthPage = lazy(() => import("./pages/AuthPage"));

function Shell({ children }) {
  const { user } = useAuth();
  return <div className="workspace-theme min-h-screen bg-[#07111f] text-slate-100 md:flex"><Sidebar/><main className="min-w-0 flex-1 p-5 md:p-8"><header className="mb-8 flex items-center justify-between border-b border-white/10 pb-5"><div><p className="text-xs uppercase tracking-widest text-slate-500">Personal finance workspace</p><p className="mt-1 text-sm text-slate-300">Welcome, {user?.name}</p></div><div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs text-emerald-300">INR · India</div></header><div className="mx-auto max-w-7xl">{children}</div></main></div>;
}

function Protected({ children }) {
  return <ProtectedRoute><Shell>{children}</Shell></ProtectedRoute>;
}

function OpeningCurtain() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timeout = window.setTimeout(() => setVisible(false), reducedMotion ? 50 : 1900);
    return () => window.clearTimeout(timeout);
  }, []);

  if (!visible) return null;

  return (
    <div className="curtain-splash" aria-hidden="true">
      <div className="curtain-panel curtain-panel-left" />
      <div className="curtain-panel curtain-panel-right" />
      <div className="curtain-brand">
        <div className="curtain-mark"><span>F</span></div>
        <p className="curtain-name">FinWise <span>India</span></p>
        <p className="curtain-tagline">Your money, in focus.</p>
      </div>
    </div>
  );
}

function AppRoutes() {
  const { user } = useAuth();
  return <Suspense fallback={<div className="p-6 text-sm text-slate-400" role="status">Loading page...</div>}><Routes>
    <Route path="/login" element={user ? <Navigate to="/"/> : <AuthPage/>}/>
    <Route path="/register" element={user ? <Navigate to="/"/> : <AuthPage mode="register"/>}/>
    <Route path="/" element={<Protected><Dashboard/></Protected>}/>
    <Route path="/transactions" element={<Protected><Transactions/></Protected>}/>
    <Route path="/calculators" element={<Protected><Calculators/></Protected>}/>
    <Route path="/goals" element={<Protected><Goals/></Protected>}/>
    <Route path="/products" element={<Protected><Products/></Protected>}/>
    <Route path="/phone-login" element={<Protected><PhoneLoginSetup/></Protected>}/>
    <Route path="*" element={<Navigate to="/"/>}/>
  </Routes></Suspense>;
}

export default function App() {
  return <AuthProvider><OpeningCurtain/><AppRoutes/></AuthProvider>;
}

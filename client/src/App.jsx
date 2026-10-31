import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Transactions = lazy(() => import("./pages/Transactions"));
const Calculators = lazy(() => import("./pages/Calculators"));
const Goals = lazy(() => import("./pages/Goals"));
const Products = lazy(() => import("./pages/Products"));
const AuthPage = lazy(() => import("./pages/AuthPage"));

function Shell({ children }) {
  const { user } = useAuth();
  return <div className="min-h-screen bg-[#07111f] text-slate-100 md:flex"><Sidebar/><main className="min-w-0 flex-1 p-5 md:p-8"><header className="mb-8 flex items-center justify-between border-b border-white/10 pb-5"><div><p className="text-xs uppercase tracking-widest text-slate-500">Personal finance workspace</p><p className="mt-1 text-sm text-slate-300">Welcome, {user?.name}</p></div><div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs text-emerald-300">INR · India</div></header><div className="mx-auto max-w-7xl">{children}</div></main></div>;
}

function Protected({ children }) {
  return <ProtectedRoute><Shell>{children}</Shell></ProtectedRoute>;
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
    <Route path="*" element={<Navigate to="/"/>}/>
  </Routes></Suspense>;
}

export default function App() {
  return <AuthProvider><AppRoutes/></AuthProvider>;
}

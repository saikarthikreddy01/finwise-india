import { NavLink } from "react-router-dom";
import { LayoutDashboard, Wallet, Calculator, Target, Landmark, LogOut, ChartNoAxesCombined } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const links = [
  ["/", "Overview", LayoutDashboard],
  ["/transactions", "Transactions", Wallet],
  ["/calculators", "Calculators", Calculator],
  ["/goals", "Goals", Target],
  ["/products", "Products", Landmark]
];

export default function Sidebar() {
  const { logout } = useAuth();
  return <aside className="w-full md:w-64 shrink-0 border-b md:border-b-0 md:border-r border-white/10 bg-[#0b1727] p-5">
    <div className="mb-8 flex items-center gap-3">
      <div className="rounded-xl bg-emerald-400/15 p-2 text-emerald-300"><ChartNoAxesCombined size={24}/></div>
      <div><div className="text-lg font-bold tracking-tight">FinWise India</div><div className="text-xs text-slate-400">Your financial command center</div></div>
    </div>
    <nav className="grid grid-cols-2 gap-2 md:grid-cols-1">
      {links.map(([to, label, Icon]) => <NavLink key={to} to={to} end={to === "/"} className={({isActive}) => `flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${isActive ? "bg-emerald-400/15 text-emerald-300" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}>
        <Icon size={18}/>{label}
      </NavLink>)}
    </nav>
    <button onClick={logout} className="mt-8 flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-400 hover:bg-white/5 hover:text-white"><LogOut size={18}/> Sign out</button>
  </aside>;
}

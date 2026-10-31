import { useEffect, useState } from "react";
import { ArrowUpRight, IndianRupee, Wallet, Target } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import api from "../services/api";
import StatCard from "../components/StatCard";

const money = value => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value || 0);

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => { api.get("/dashboard/overview").then(r=>setData(r.data)).catch(()=>setError("Could not load dashboard. Add an account and transactions to get started.")); }, []);
  const chartData = [
    { month: "This month", income: data?.currentMonthIncome || 0, expenses: data?.currentMonthExpenses || 0 }
  ];
  return <div>
    <div className="mb-7"><p className="text-sm text-emerald-300">FINANCIAL OVERVIEW</p><h1 className="mt-1 text-3xl font-semibold">Your money, in focus.</h1><p className="mt-2 text-slate-400">A clear view of your current-month activity.</p></div>
    {error && <div className="mb-4 rounded-xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-200">{error}</div>}
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Monthly income" value={money(data?.currentMonthIncome)} note="Income recorded this month" accent="emerald"/>
      <StatCard label="Monthly expenses" value={money(data?.currentMonthExpenses)} note="Expenses recorded this month" accent="amber"/>
      <StatCard label="Monthly net cash flow" value={money(data?.currentMonthNet)} note="Income minus expenses" accent="blue"/>
      <StatCard label="Accounts" value={data?.accountCount ?? "—"} note="Your tracked accounts" accent="violet"/>
    </div>
    <div className="mt-6 grid gap-5 xl:grid-cols-3">
      <section className="rounded-2xl border border-white/10 bg-[#101f32] p-5 xl:col-span-2">
        <div className="mb-5"><h2 className="font-semibold">Cash flow snapshot</h2><p className="text-xs text-slate-500">Current-month totals; add more history for richer trends.</p></div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}><defs><linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#34d399" stopOpacity={0.35}/><stop offset="100%" stopColor="#34d399" stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke="#26364a" strokeDasharray="3 3"/><XAxis dataKey="month" stroke="#94a3b8"/><YAxis stroke="#94a3b8"/><Tooltip contentStyle={{background:"#0b1727",border:"1px solid #334155",borderRadius:12}}/><Area type="monotone" dataKey="income" stroke="#34d399" fill="url(#incomeFill)"/><Area type="monotone" dataKey="expenses" stroke="#fbbf24" fill="transparent"/></AreaChart>
          </ResponsiveContainer>
        </div>
      </section>
      <section className="rounded-2xl border border-white/10 bg-[#101f32] p-5">
        <h2 className="font-semibold">Quick actions</h2>
        <div className="mt-4 grid gap-3">
          <a href="/transactions" className="flex items-center gap-3 rounded-xl bg-white/5 p-4 hover:bg-white/10"><Wallet className="text-emerald-300"/> <span>Add a transaction</span><ArrowUpRight className="ml-auto"/></a>
          <a href="/calculators" className="flex items-center gap-3 rounded-xl bg-white/5 p-4 hover:bg-white/10"><IndianRupee className="text-blue-300"/> <span>Try a calculator</span><ArrowUpRight className="ml-auto"/></a>
          <a href="/goals" className="flex items-center gap-3 rounded-xl bg-white/5 p-4 hover:bg-white/10"><Target className="text-violet-300"/> <span>Set a financial goal</span><ArrowUpRight className="ml-auto"/></a>
        </div>
      </section>
    </div>
    <section className="mt-6 rounded-2xl border border-white/10 bg-[#101f32] p-5">
      <h2 className="font-semibold">Recent transactions</h2>
      <div className="mt-4 divide-y divide-white/5">
        {(data?.recentTransactions || []).length === 0 && <p className="py-6 text-sm text-slate-500">No transactions yet. Add your first transaction to see activity here.</p>}
        {(data?.recentTransactions || []).map(t=><div key={t._id} className="flex items-center justify-between py-3"><div><p className="text-sm">{t.description || t.category}</p><p className="text-xs text-slate-500">{t.category} · {new Date(t.transactionDate).toLocaleDateString("en-IN")}</p></div><p className={t.type==="income"?"text-emerald-300":"text-slate-200"}>{t.type==="income"?"+":"−"}{money(t.amountPaise/100)}</p></div>)}
      </div>
    </section>
  </div>;
}

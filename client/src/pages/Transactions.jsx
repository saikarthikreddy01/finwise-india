import { useEffect, useState } from "react";
import api from "../services/api";

const money = n => new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:2}).format(n||0);

export default function Transactions() {
  const [items,setItems]=useState([]), [accounts,setAccounts]=useState([]), [error,setError]=useState("");
  const [form,setForm]=useState({accountId:"",type:"expense",amount:"",category:"Food",description:"",transactionDate:new Date().toISOString().slice(0,10)});
  async function load(){ try { const [t,a]=await Promise.all([api.get("/transactions"),api.get("/accounts")]); setItems(t.data.items); setAccounts(a.data); if(!form.accountId&&a.data[0])setForm(f=>({...f,accountId:a.data[0]._id})); } catch(e){setError(e.response?.data?.message||"Unable to load data");}}
  useEffect(()=>{load();},[]);
  async function submit(e){e.preventDefault();setError("");try{await api.post("/transactions",form);setForm(f=>({...f,amount:"",description:""}));await load();}catch(e){setError(e.response?.data?.message||"Could not save transaction");}}
  async function addAccount(){const name=prompt("Account name (e.g. Main Savings)");if(!name)return;try{await api.post("/accounts",{name,type:"savings"});await load();}catch(e){setError(e.response?.data?.message||"Could not create account");}}
  async function remove(id){if(!confirm("Delete this transaction?"))return;await api.delete(`/transactions/${id}`);load();}
  return <div><h1 className="text-3xl font-semibold">Transactions</h1><p className="mt-2 text-slate-400">Record and review your income and expenses.</p>
    {error&&<p className="mt-4 rounded-xl bg-rose-400/10 p-3 text-sm text-rose-200">{error}</p>}
    <div className="mt-6 grid gap-5 xl:grid-cols-3">
      <form onSubmit={submit} className="h-fit rounded-2xl border border-white/10 bg-[#101f32] p-5 xl:col-span-1">
        <h2 className="mb-4 font-semibold">Add transaction</h2>
        {accounts.length===0?<button type="button" onClick={addAccount} className="mb-4 rounded-lg bg-emerald-400 px-3 py-2 text-sm font-semibold text-slate-950">Create first account</button>:null}
        <label className="mb-2 block text-xs text-slate-400">Account</label><select required value={form.accountId} onChange={e=>setForm({...form,accountId:e.target.value})} className="mb-3 w-full rounded-lg border border-white/10 bg-[#07111f] p-3">{accounts.map(a=><option key={a._id} value={a._id}>{a.name}</option>)}</select>
        <label className="mb-2 block text-xs text-slate-400">Type</label><select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} className="mb-3 w-full rounded-lg border border-white/10 bg-[#07111f] p-3"><option value="expense">Expense</option><option value="income">Income</option></select>
        <input required type="number" min="0.01" step="0.01" placeholder="Amount in ₹" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})} className="mb-3 w-full rounded-lg border border-white/10 bg-[#07111f] p-3"/>
        <input placeholder="Category" value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="mb-3 w-full rounded-lg border border-white/10 bg-[#07111f] p-3"/>
        <input placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="mb-3 w-full rounded-lg border border-white/10 bg-[#07111f] p-3"/>
        <input required type="date" value={form.transactionDate} onChange={e=>setForm({...form,transactionDate:e.target.value})} className="mb-4 w-full rounded-lg border border-white/10 bg-[#07111f] p-3"/>
        <button disabled={!accounts.length} className="w-full rounded-xl bg-emerald-400 p-3 font-semibold text-slate-950 disabled:opacity-40">Save transaction</button>
      </form>
      <section className="rounded-2xl border border-white/10 bg-[#101f32] p-5 xl:col-span-2"><div className="mb-4 flex items-center justify-between"><h2 className="font-semibold">Transaction history</h2><button onClick={addAccount} className="text-sm text-emerald-300">+ Add account</button></div>
        <div className="space-y-2">{items.map(t=><div key={t._id} className="flex items-center justify-between gap-3 rounded-xl bg-white/[0.03] p-3"><div className="min-w-0"><p className="truncate text-sm">{t.description||t.category}</p><p className="text-xs text-slate-500">{t.category} · {new Date(t.transactionDate).toLocaleDateString("en-IN")}</p></div><div className="flex items-center gap-3"><b className={t.type==="income"?"text-emerald-300":"text-slate-200"}>{t.type==="income"?"+":"−"}{money(t.amountPaise/100)}</b><button onClick={()=>remove(t._id)} className="text-xs text-rose-300">Delete</button></div></div>)}{items.length===0&&<p className="py-10 text-center text-sm text-slate-500">No transactions yet.</p>}</div>
      </section>
    </div>
  </div>;
}

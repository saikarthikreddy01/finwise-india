import { useState } from "react";
import api from "../services/api";

const configs = {
  emi: { title:"EMI calculator", fields:[["principal","Loan amount (₹)",1000000],["annualRate","Annual interest (%)",9],["months","Tenure (months)",60]] },
  sip: { title:"SIP calculator", fields:[["monthlyInvestment","Monthly investment (₹)",5000],["annualRate","Assumed annual return (%)",12],["months","Duration (months)",120]] },
  fd: { title:"Fixed deposit calculator", fields:[["principal","Deposit amount (₹)",100000],["annualRate","Annual interest (%)",7],["years","Duration (years)",3],["compoundsPerYear","Compounds per year",4]] },
  "compound-interest": { title:"Compound interest", fields:[["principal","Principal (₹)",100000],["annualRate","Annual interest (%)",8],["years","Years",5]] },
  inflation: { title:"Inflation calculator", fields:[["presentValue","Today's cost (₹)",100000],["inflationRate","Inflation rate (%)",6],["years","Years",10]] },
  cagr: { title:"CAGR calculator", fields:[["beginningValue","Beginning value (₹)",100000],["endingValue","Ending value (₹)",180000],["years","Years",5]] }
};
const money = n => new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:2}).format(n||0);

export default function Calculators(){
  const [type,setType]=useState("emi"),[values,setValues]=useState(Object.fromEntries(Object.entries(configs).map(([k,c])=>[k,Object.fromEntries(c.fields.map(([f,_label,v])=>[f,v]))])));
  const [result,setResult]=useState(null),[error,setError]=useState("");
  async function calculate(e){e.preventDefault();setError("");try{const {data}=await api.post(`/calculators/${type}`,values[type]);setResult(data.result);}catch(e){setError(e.response?.data?.message||"Calculation failed");}}
  return <div><h1 className="text-3xl font-semibold">Financial calculators</h1><p className="mt-2 text-slate-400">Explore illustrative financial outcomes using transparent assumptions.</p>
    <div className="mt-6 grid gap-5 lg:grid-cols-2">
      <form onSubmit={calculate} className="rounded-2xl border border-white/10 bg-[#101f32] p-5">
        <label className="mb-2 block text-sm text-slate-400">Choose calculator</label><select value={type} onChange={e=>{setType(e.target.value);setResult(null);}} className="mb-5 w-full rounded-xl border border-white/10 bg-[#07111f] p-3">{Object.entries(configs).map(([k,c])=><option key={k} value={k}>{c.title}</option>)}</select>
        {configs[type].fields.map(([field,label])=><label key={field} className="mb-4 block text-sm text-slate-300">{label}<input type="number" min="0" step="any" value={values[type][field]} onChange={e=>setValues(old=>({...old,[type]:{...old[type],[field]:e.target.value}}))} className="mt-2 w-full rounded-xl border border-white/10 bg-[#07111f] p-3 text-white"/></label>)}
        <button className="w-full rounded-xl bg-emerald-400 p-3 font-semibold text-slate-950">Calculate</button>
        {error&&<p className="mt-3 text-sm text-rose-300">{error}</p>}
      </form>
      <section className="rounded-2xl border border-white/10 bg-[#101f32] p-5"><h2 className="font-semibold">Your result</h2>{!result?<p className="mt-6 text-sm text-slate-500">Enter your assumptions and calculate to see the result.</p>:<div className="mt-5 space-y-4">{Object.entries(result).map(([key,value])=><div className="rounded-xl bg-white/5 p-4" key={key}><p className="text-xs capitalize text-slate-400">{key.replace(/([A-Z])/g," $1")}</p><p className="mt-1 break-words text-xl font-semibold text-emerald-300">{typeof value==="number" ? (key.toLowerCase().includes("percent") ? `${value}%` : money(value)) : value}</p></div>)}</div>}<p className="mt-6 text-xs leading-5 text-slate-500">These are estimates based on the inputs and simplified assumptions. Actual bank, tax and investment outcomes may differ. Returns are not guaranteed.</p></section>
    </div>
  </div>;
}

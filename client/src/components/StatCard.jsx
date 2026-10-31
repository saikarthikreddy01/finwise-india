export default function StatCard({ label, value, note, accent = "emerald" }) {
  const colors = { emerald: "text-emerald-300", blue: "text-blue-300", amber: "text-amber-300", violet: "text-violet-300" };
  return <div className="rounded-2xl border border-white/10 bg-[#101f32] p-5">
    <p className="text-sm text-slate-400">{label}</p>
    <p className={`mt-3 text-2xl font-semibold tracking-tight ${colors[accent]}`}>{value}</p>
    {note && <p className="mt-2 text-xs text-slate-500">{note}</p>}
  </div>;
}

export default function StatCard({ label, value, note, accent = "emerald" }) {
  const colors = { emerald: "text-[#e0bd72]", blue: "text-[#e0bd72]", amber: "text-[#e0bd72]", violet: "text-[#e0bd72]" };
  return <div className="rounded-2xl border border-white/10 bg-[#101f32] p-5">
    <p className="text-sm text-slate-400">{label}</p>
    <p className={`mt-3 text-2xl font-semibold tracking-tight ${colors[accent]}`}>{value}</p>
    {note && <p className="mt-2 text-xs text-slate-500">{note}</p>}
  </div>;
}

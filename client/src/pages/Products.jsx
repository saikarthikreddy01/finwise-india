import { useEffect, useState } from "react";
import api from "../services/api";
export default function Products() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [studentsOnly, setStudentsOnly] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/products")
      .then(response => setProducts(response.data))
      .catch(() => setError("Unable to load product catalogue"));
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesStudentFilter = !studentsOnly || product.isStudentFocused;
    const searchText = `${product.name} ${product.provider} ${product.category} ${product.description}`;
    return matchesStudentFilter && searchText.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <div>
      <h1 className="text-3xl font-semibold">Financial products</h1>
      <p className="mt-2 text-slate-400">Explore illustrative options, including student savings, education loans, scholarships, and investing basics. Verify current terms with official providers.</p>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <input
          value={query}
          onChange={event => setQuery(event.target.value)}
          placeholder="Search products and details..."
          className="w-full max-w-lg rounded-xl border border-white/10 bg-[#101f32] p-3 outline-none focus:border-emerald-400"
        />
        <button
          type="button"
          aria-pressed={studentsOnly}
          onClick={() => setStudentsOnly(value => !value)}
          className={`rounded-xl border px-4 py-3 text-sm transition ${studentsOnly ? "border-emerald-400/40 bg-emerald-400/15 text-emerald-300" : "border-white/10 bg-[#101f32] text-slate-300 hover:border-white/20"}`}
        >
          Student-focused
        </button>
      </div>
      {error && <p className="mt-4 text-rose-300" role="alert">{error}</p>}
      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredProducts.map(product => (
          <article key={product._id} className="rounded-2xl border border-white/10 bg-[#101f32] p-5">
            <div className="flex flex-wrap gap-2">
              <p className="text-xs uppercase tracking-wider text-emerald-300">{product.category.replaceAll("_", " ")}</p>
              {product.isStudentFocused && <p className="rounded-full bg-sky-400/10 px-2 py-0.5 text-xs text-sky-300">Student-focused</p>}
            </div>
            <h2 className="mt-2 text-lg font-semibold">{product.name}</h2>
            <p className="mt-1 text-sm text-slate-400">{product.provider}</p>
            <p className="mt-4 text-sm text-slate-300">{product.description}</p>
            {product.indicativeRateMin != null && <p className="mt-4 text-sm">Indicative rate: <b>{product.indicativeRateMin}% – {product.indicativeRateMax}%</b></p>}
            <p className="mt-4 text-xs text-amber-300">Demo data · Verify current terms</p>
          </article>
        ))}
      </div>
      {filteredProducts.length === 0 && <p className="mt-8 text-slate-500">No matching products.</p>}
    </div>
  );
}

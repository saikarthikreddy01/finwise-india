import { useEffect, useState } from "react";
import api from "../services/api";

const learningModules = [
  {
    title: "Credit card essentials",
    category: "Credit cards",
    description: "Understand billing cycles, statement balances, due dates, and how interest can build up.",
    tips: [
      "Pay the full statement balance by the due date when possible.",
      "A minimum payment avoids some late-payment consequences, but interest may still accrue.",
      "Check fees, interest rates, and reward conditions before applying."
    ]
  },
  {
    title: "Use UPI safely",
    category: "UPI",
    description: "Learn what a UPI PIN does and how to avoid common payment and collection-request scams.",
    tips: [
      "Enter your UPI PIN only to authorize a payment; receiving money does not require your PIN.",
      "Check the recipient name and amount before approving a payment.",
      "Never share your PIN or approve an unexpected collect request."
    ]
  },
  {
    title: "Build a healthy credit history",
    category: "Credit score",
    description: "See how repayment habits and responsible use of credit can affect your credit profile.",
    tips: [
      "Pay loan and card dues on time.",
      "Borrow only what you can repay and review your statements regularly.",
      "Check your credit report for errors and use the bureau's official dispute process."
    ]
  },
  {
    title: "Make a simple monthly budget",
    category: "Budgeting",
    description: "Plan for needs, savings, and flexible spending using income and expense tracking.",
    tips: [
      "Start with take-home income and list recurring expenses.",
      "Set a realistic savings goal and review it each month.",
      "Adjust the plan when your income or essential expenses change."
    ]
  },
  {
    title: "Understand loans and EMIs",
    category: "Borrowing",
    description: "Compare the total cost of borrowing, not just the advertised monthly instalment.",
    tips: [
      "Compare interest rates, processing fees, tenure, and total repayment.",
      "Check whether the rate is fixed or variable and read late-payment terms.",
      "Choose an EMI that leaves room for essential expenses and emergencies."
    ]
  },
  {
    title: "Investing basics",
    category: "Investing",
    description: "Learn about risk, diversification, time horizon, and why market returns are not guaranteed.",
    tips: [
      "Keep emergency savings separate from long-term investments.",
      "Understand the product and its risks before investing.",
      "Past performance does not guarantee future returns."
    ]
  }
];

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
      <section className="mt-8" aria-labelledby="learning-modules-heading">
        <h2 id="learning-modules-heading" className="text-2xl font-semibold">Money learning modules</h2>
        <p className="mt-2 text-sm text-slate-400">Practical starting points for managing money. These modules are educational and are not personalized financial advice.</p>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {learningModules.map(module => (
            <article key={module.title} className="rounded-2xl border border-white/10 bg-[#101f32] p-5">
              <p className="text-xs uppercase tracking-wider text-emerald-300">{module.category}</p>
              <h3 className="mt-2 text-lg font-semibold">{module.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{module.description}</p>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-300">
                {module.tips.map(tip => <li key={tip}>{tip}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </section>
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

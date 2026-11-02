import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  CalendarDays,
  Check,
  Clock3,
  CreditCard,
  Landmark,
  Lightbulb,
  PiggyBank,
  ShieldCheck,
  Smartphone,
  Wallet
} from "lucide-react";
import api from "../services/api";

const savingsOptions = [
  {
    icon: Wallet,
    title: "Savings account",
    label: "Everyday access",
    description: "For salary, bills, and money you may need soon. Compare access, fees, minimum-balance rules, and the interest offered by each bank.",
    note: "Keep day-to-day money separate from long-term goals."
  },
  {
    icon: CalendarDays,
    title: "Recurring deposit",
    label: "Regular contributions",
    description: "A scheduled deposit can help build a habit over a chosen term. Check the instalment rules, interest calculation, missed-payment charges, and early-closure terms.",
    note: "Useful for a goal with a known date and regular contributions."
  },
  {
    icon: Landmark,
    title: "Fixed deposit",
    label: "Lump sum · fixed term",
    description: "A deposit is placed for a set period. Compare the effective return, payout choice, tax treatment, and premature-withdrawal penalty before booking.",
    note: "The highest advertised rate may not fit your access needs."
  },
  {
    icon: ShieldCheck,
    title: "Post office & government small-savings schemes",
    label: "Check eligibility and lock-in",
    description: "Schemes such as PPF, NSC, and Sukanya Samriddhi Yojana have their own eligibility, contribution, withdrawal, and tax rules. Rates and rules can change; confirm current details through official sources.",
    note: "Read the current scheme rules before contributing."
  },
  {
    icon: PiggyBank,
    title: "Emergency savings",
    label: "Accessible buffer",
    description: "Set aside money for essential unexpected costs, such as a medical bill or temporary income gap. Keep it accessible and avoid taking investment risk with money you may need urgently.",
    note: "Build gradually around your own expenses and circumstances."
  },
  {
    icon: ArrowUpRight,
    title: "Market-linked investments",
    label: "Risk varies · value can fall",
    description: "Mutual funds and other market-linked products are investments, not bank deposits. Learn about risk, diversification, time horizon, and fees; returns are not guaranteed.",
    note: "Do not invest emergency or near-term essential money in products you do not understand."
  }
];

const savingsRules = [
  {
    number: "01",
    title: "Give every goal a time horizon",
    description: "Separate money needed soon from long-term goals. Access and stability matter more for near-term needs; taking more risk does not guarantee a better result."
  },
  {
    number: "02",
    title: "Automate a realistic amount",
    description: "Schedule a transfer after payday, once essential bills are accounted for. Start with an amount you can sustain and review it when your circumstances change."
  },
  {
    number: "03",
    title: "Build a buffer before chasing returns",
    description: "Set aside accessible emergency money over time. If you have costly debt, compare its interest and fees with the uncertain return from saving or investing."
  },
  {
    number: "04",
    title: "Compare what you actually keep",
    description: "Look beyond the headline rate: account fees, penalties, tax treatment, lock-in, and when interest is paid can change the outcome. Tax rules vary; check current official guidance."
  },
  {
    number: "05",
    title: "Check deposit protection and terms",
    description: "DICGC currently covers eligible deposits up to ₹5 lakh per depositor per insured bank, including principal and interest combined, subject to its rules and aggregation by the same right and capacity.",
    link: "https://www.dicgc.org.in/FAQs",
    linkLabel: "Read DICGC's official FAQs"
  }
];

const savingHabits = [
  {
    icon: CalendarDays,
    title: "Pay yourself on payday",
    description: "Set an automatic transfer for the day income arrives. A small repeatable amount is more useful than a big target you keep postponing."
  },
  {
    icon: Clock3,
    title: "Use a 24-hour pause",
    description: "For a non-essential purchase, wait a day and check it against your budget. For larger buys, compare total cost, warranty, and return terms."
  },
  {
    icon: CreditCard,
    title: "Audit recurring charges",
    description: "Once a month, review subscriptions, app renewals, and bank/card statements. Cancel services you no longer use through the provider's official channel."
  },
  {
    icon: Smartphone,
    title: "Make UPI safer",
    description: "Check the recipient and amount before paying. Enter your UPI PIN only to authorize a payment; receiving money does not require your PIN. Never share your PIN or approve an unexpected request."
  },
  {
    icon: Wallet,
    title: "Create separate goal buckets",
    description: "Name savings for their purpose—rent, fees, travel, or emergencies—using separate accounts or a tracker. This makes planned money less likely to become impulse spending."
  },
  {
    icon: Lightbulb,
    title: "Compare the unit price",
    description: "For groceries and household essentials, compare the price per litre, kilogram, or item—not just the discount label. Buy only what you can use before it expires."
  }
];

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

function SectionHeading({ id, eyebrow, title, description }) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">{eyebrow}</p>
      <h2 id={id} className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-400 sm:text-base">{description}</p>
    </div>
  );
}

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
    <div className="space-y-14 pb-10">
      <section className="relative isolate overflow-hidden rounded-3xl border border-emerald-300/15 bg-gradient-to-br from-emerald-950 via-[#102b2b] to-[#101f32] p-6 shadow-2xl shadow-emerald-950/20 sm:p-10">
        <div className="pointer-events-none absolute -right-16 -top-20 -z-10 h-64 w-64 rounded-full bg-emerald-300/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 left-1/3 -z-10 h-56 w-56 rounded-full bg-cyan-300/10 blur-3xl" />
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/20 bg-emerald-200/10 px-3 py-1.5 text-xs font-medium text-emerald-100">
            <PiggyBank size={15} aria-hidden="true" />
            Your practical money guide
          </div>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            Make your savings work for <span className="text-emerald-300">your goals.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
            Explore common ways to save, simple rules to compare options, and everyday habits that can help you keep more of your money.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#savings-options" className="inline-flex items-center gap-2 rounded-xl bg-emerald-300 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:ring-offset-2 focus:ring-offset-[#102b2b]">
              Explore savings options <ArrowDown size={16} aria-hidden="true" />
            </a>
            <a href="#smart-habits" className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:ring-offset-2 focus:ring-offset-[#102b2b]">
              See practical tips
            </a>
          </div>
        </div>
        <div className="mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
          {[
            ["01", "Choose a goal"],
            ["02", "Compare the terms"],
            ["03", "Build a steady habit"]
          ].map(([number, label]) => (
            <div key={number} className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/10 px-4 py-3">
              <span className="text-xs font-semibold text-emerald-300">{number}</span>
              <span className="text-sm text-slate-200">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="savings-options" className="scroll-mt-8">
        <SectionHeading
          eyebrow="Start with the purpose"
          title="Savings options, clearly explained"
          description="Different options suit different needs. Compare access, risk, term, fees, tax treatment, and current rules—not just the headline return."
        />
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {savingsOptions.map(({ icon: Icon, title, label, description, note }) => (
            <article key={title} className="group rounded-2xl border border-white/10 bg-[#101f32] p-5 transition duration-200 hover:-translate-y-1 hover:border-emerald-300/30 hover:bg-[#12243a]">
              <div className="flex items-start justify-between gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl border border-emerald-300/15 bg-emerald-300/10 text-emerald-300">
                  <Icon size={20} aria-hidden="true" />
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-slate-300">{label}</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
              <p className="mt-4 border-t border-white/10 pt-3 text-xs leading-5 text-emerald-200/90">{note}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="savings-rules" className="scroll-mt-8 rounded-3xl border border-white/10 bg-white/[0.025] p-5 sm:p-8">
        <SectionHeading
          eyebrow="A simple checklist"
          title="Five rules for smarter saving"
          description="Use this checklist before opening an account, locking away money, or changing your savings plan."
        />
        <div className="mt-7 grid gap-3 lg:grid-cols-2">
          {savingsRules.map(rule => (
            <article key={rule.number} className="flex gap-4 rounded-2xl border border-white/10 bg-[#101f32] p-5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-300/10 text-xs font-bold text-emerald-300">{rule.number}</span>
              <div>
                <h3 className="font-semibold text-white">{rule.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{rule.description}</p>
                {rule.link && (
                  <a href={rule.link} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-emerald-300 hover:text-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-300">
                    {rule.linkLabel} <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="smart-habits" className="scroll-mt-8">
        <SectionHeading
          eyebrow="Small moves, repeated"
          title="Money-saving habits that actually help"
          description="No secret shortcuts or guaranteed returns—just practical ways to reduce avoidable spending and make good habits easier."
        />
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {savingHabits.map(({ icon: Icon, title, description }) => (
            <article key={title} className="rounded-2xl border border-white/10 bg-[#101f32] p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-300/10 text-amber-200">
                <Icon size={19} aria-hidden="true" />
              </div>
              <h3 className="mt-4 font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="money-basics-heading">
        <SectionHeading
          id="money-basics-heading"
          eyebrow="Learn the basics"
          title="More money modules"
          description="Short, practical guides for using credit, borrowing carefully, and understanding investment risk."
        />
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {learningModules.map(module => (
            <article key={module.title} className="rounded-2xl border border-white/10 bg-[#101f32] p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300">{module.category}</p>
              <h3 className="mt-2 text-lg font-semibold text-white">{module.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{module.description}</p>
              <ul className="mt-4 space-y-2.5">
                {module.tips.map(tip => (
                  <li key={tip} className="flex gap-2 text-sm leading-5 text-slate-300">
                    <Check size={16} className="mt-0.5 shrink-0 text-emerald-300" aria-hidden="true" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section id="products-catalogue" className="scroll-mt-8 border-t border-white/10 pt-10">
        <SectionHeading
          eyebrow="Illustrative catalogue"
          title="Explore example products"
          description="These catalogue entries are examples, not current offers. Verify eligibility, rates, fees, and terms directly with official providers."
        />
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <label htmlFor="product-search" className="sr-only">Search products and details</label>
          <input
            id="product-search"
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Search products and details..."
            className="w-full max-w-lg rounded-xl border border-white/10 bg-[#101f32] p-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
          />
          <button
            type="button"
            aria-pressed={studentsOnly}
            onClick={() => setStudentsOnly(value => !value)}
            className={`rounded-xl border px-4 py-3 text-sm transition focus:outline-none focus:ring-2 focus:ring-emerald-400 ${studentsOnly ? "border-emerald-400/40 bg-emerald-400/15 text-emerald-300" : "border-white/10 bg-[#101f32] text-slate-300 hover:border-white/20"}`}
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
              <h3 className="mt-2 text-lg font-semibold text-white">{product.name}</h3>
              <p className="mt-1 text-sm text-slate-400">{product.provider}</p>
              <p className="mt-4 text-sm leading-6 text-slate-300">{product.description}</p>
              {product.indicativeRateMin != null && <p className="mt-4 text-sm">Indicative rate: <b>{product.indicativeRateMin}% – {product.indicativeRateMax}%</b></p>}
              <p className="mt-4 text-xs text-amber-300">Demo data · Verify current terms</p>
            </article>
          ))}
        </div>
        {filteredProducts.length === 0 && <p className="mt-8 text-slate-500">No matching products.</p>}
      </section>

      <aside className="flex gap-3 rounded-2xl border border-amber-300/15 bg-amber-300/[0.06] p-4 text-sm leading-6 text-amber-100/80" aria-label="Educational disclaimer">
        <ShieldCheck size={19} className="mt-0.5 shrink-0 text-amber-200" aria-hidden="true" />
        <p>Educational information only, not personalized financial, tax, or legal advice. Rates, eligibility, tax treatment, and regulations can change. Confirm current details with official providers before making a decision.</p>
      </aside>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Briefcase, GraduationCap, HeartHandshake, Check, Sprout, ShieldCheck,
  Landmark, Wallet, Receipt, ArrowLeftRight, TrendingUp, Users,
} from "lucide-react";
import { SiteNav, SiteFooter, ApplyButton } from "@/components/SiteNav";
import { Wizard } from "@/components/Wizard";
import { getProduct, fitToProduct } from "@/lib/loan-products";
import { computeLoan } from "@/lib/demo-auth";

export const Route = createFileRoute("/loans")({
  head: () => ({
    meta: [
      { title: "Loans, Payments & Investing — Our Services | LendFlow" },
      { name: "description", content: "Borrow, pay and invest with LendFlow Africa: personal, business, agri, civil servant, scheme, collateral-backed and salary advance loans at 2.5% interest." },
      { property: "og:title", content: "Our Services — LendFlow Africa" },
      { property: "og:description", content: "Borrow, pay and invest — personal, business, agri, civil servant, scheme, collateral-backed and salary advance loans." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Loans,
});

const PILLARS = [
  { icon: <Wallet />, title: "Borrow", body: "Access instant and flexible loans made for you.", cta: "Apply now" },
  { icon: <ArrowLeftRight />, title: "Pay", body: "Pay bills, transfer money and manage transactions.", cta: "Get started" },
  { icon: <TrendingUp />, title: "Invest", body: "Lend to creditworthy borrowers and enjoy rewarding returns.", cta: "Learn more" },
];

const OPTIONS = [
  {
    icon: <HeartHandshake />, title: "Personal Loans", productId: "personal",
    body: "For medical bills, home repairs and the unexpected moments.",
    points: ["K500 – K250,000", "Fast decisions", "Mobile wallet payout"],
  },
  {
    icon: <Briefcase />, title: "Business Loans", productId: "business",
    body: "Grow your stock, expand your stall or cover a cash-flow gap.",
    points: ["K500 – K1,000,000", "3 – 24 month terms", "Same-day disbursement"],
  },
  {
    icon: <Sprout />, title: "Agri Loans", productId: "agri",
    body: "Fund seeds, fertiliser, tools and equipment to grow your farm.",
    points: ["Harvest-aligned repayments", "Input supplier payouts", "Seasonal terms"],
  },
  {
    icon: <Landmark />, title: "Civil Servant Loans", productId: "civil-servant",
    body: "Payroll-backed lending for government and public sector workers.",
    points: ["Payroll deduction", "Higher limits", "Low documentation"],
  },
  {
    icon: <Users />, title: "Scheme Loans", productId: "scheme",
    body: "Employer-approved schemes for staff at partner organisations.",
    points: ["Employer partnership", "Group onboarding", "Preferential rates"],
  },
  {
    icon: <ShieldCheck />, title: "Collateral Backed Loans", productId: "collateral",
    body: "Unlock bigger amounts against a vehicle, property or equipment.",
    points: ["Largest limits", "Longer terms", "Asset valuation included"],
  },
  {
    icon: <Wallet />, title: "Salary Advance", productId: "salary-advance",
    body: "Bridge the gap to payday with a short-term advance.",
    points: ["1 – 3 month terms", "Same-day payout", "Repaid on payday"],
  },
  {
    icon: <GraduationCap />, title: "Education Loans", productId: "education",
    body: "Cover school fees, uniforms and exam costs without the stress.",
    points: ["Term-aligned repayments", "Pay school directly", "No hidden charges"],
  },
  {
    icon: <Receipt />, title: "Bill Credit", productId: "bill-credit", soon: true,
    body: "Airtime, data, pay TV, electricity and water on credit.",
    points: ["Buy now, pay later", "All major billers", "Coming soon"],
  },
];


function Loans() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="min-h-screen">
      <SiteNav onApply={() => setOpen("personal")} />

      <section className="mx-auto max-w-7xl px-6 py-16 text-center">
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Our Services</h1>
        <p className="mt-3 text-lg text-[color:var(--color-muted)]">Borrow, pay and invest — all from your phone</p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {PILLARS.map((p) => (
            <article key={p.title} className="card card-lift flex flex-col p-7 text-left">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[color:var(--color-sky)] text-[color:var(--color-navy)] [&_svg]:h-6 [&_svg]:w-6">
                {p.icon}
              </div>
              <h2 className="mt-4 text-xl font-black">{p.title}</h2>
              <p className="mt-2 text-sm text-[color:var(--color-muted)]">{p.body}</p>
              <button onClick={() => setOpen("personal")} className="mt-5 self-start text-sm font-bold text-[color:var(--color-leaf-dark)] hover:underline">
                {p.cta} →
              </button>
            </article>
          ))}
        </div>

        <h2 className="mt-20 text-3xl font-black tracking-tight sm:text-4xl">Flexible loan options, made for you</h2>
        <p className="mt-3 text-[color:var(--color-muted)]">Every loan carries a flat 2.5% interest and a one-off service fee</p>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {OPTIONS.map((o) => (
            <article key={o.title} className="card flex flex-col p-7 text-left">
              <div className="flex items-start justify-between gap-3">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[color:var(--color-mint)] text-[color:var(--color-leaf-dark)] [&_svg]:h-7 [&_svg]:w-7">
                  {o.icon}
                </div>
                {"soon" in o && o.soon && (
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-700">
                    Coming soon
                  </span>
                )}
              </div>
              <h3 className="mt-5 text-xl font-bold">{o.title}</h3>
              <p className="mt-2 text-sm text-[color:var(--color-muted)]">{o.body}</p>
              <ul className="mt-5 space-y-2 text-sm">
                {o.points.map((p) => (
                  <li key={p} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[color:var(--color-leaf)]" /> {p}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-6">
                {"soon" in o && o.soon ? (
                  <button disabled className="w-full rounded-full border border-[color:var(--color-line)] px-5 py-2.5 text-sm font-bold text-[color:var(--color-muted)] opacity-60">
                    Coming soon
                  </button>
                ) : (
                  <ApplyButton onApply={() => setOpen(o.productId)} className="w-full" />
                )}
              </div>
            </article>
          ))}
        </div>
      </section>


      <section className="border-y border-[color:var(--color-line)] bg-[color:var(--color-mint)]/60">
        <dl className="mx-auto grid max-w-5xl gap-8 px-6 py-12 text-center sm:grid-cols-3">
          {[["2.5%", "Interest charged"], ["24h", "Typical payout"], ["4", "Countries served"]].map(([v, l]) => (
            <div key={l}>
              <dt className="text-4xl font-black text-[color:var(--color-leaf-dark)]">{v}</dt>
              <dd className="mt-1 text-sm font-semibold text-[color:var(--color-muted)]">{l}</dd>
            </div>
          ))}
        </dl>
      </section>

      <SiteFooter />
      {open && (() => {
        const p = getProduct(open);
        const fit = fitToProduct(p, 15000, 12);
        const c = computeLoan(fit.amount, fit.pct, fit.term, p.interestRate);
        return (
          <Wizard onClose={() => setOpen(null)}
            loan={{ amount: fit.amount, term: fit.term, pct: fit.pct, serviceFee: c.serviceFee, monthly: c.monthly, productId: p.id }} />
        );
      })()}
    </div>
  );
}

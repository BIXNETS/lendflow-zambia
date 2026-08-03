import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Briefcase, GraduationCap, HeartHandshake, Check, Sprout, ShieldCheck,
  Landmark, Wallet, Receipt, ArrowLeftRight, TrendingUp, Users,
} from "lucide-react";
import { SiteNav, SiteFooter, ApplyButton } from "@/components/SiteNav";
import { Wizard } from "@/components/Wizard";

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
    icon: <HeartHandshake />, title: "Personal Loans",
    body: "For medical bills, home repairs and the unexpected moments.",
    points: ["K500 – K250,000", "Fast decisions", "Mobile wallet payout"],
  },
  {
    icon: <Briefcase />, title: "Business Loans",
    body: "Grow your stock, expand your stall or cover a cash-flow gap.",
    points: ["K500 – K1,000,000", "3 – 24 month terms", "Same-day disbursement"],
  },
  {
    icon: <Sprout />, title: "Agri Loans",
    body: "Fund seeds, fertiliser, tools and equipment to grow your farm.",
    points: ["Harvest-aligned repayments", "Input supplier payouts", "Seasonal terms"],
  },
  {
    icon: <Landmark />, title: "Civil Servant Loans",
    body: "Payroll-backed lending for government and public sector workers.",
    points: ["Payroll deduction", "Higher limits", "Low documentation"],
  },
  {
    icon: <Users />, title: "Scheme Loans",
    body: "Employer-approved schemes for staff at partner organisations.",
    points: ["Employer partnership", "Group onboarding", "Preferential rates"],
  },
  {
    icon: <ShieldCheck />, title: "Collateral Backed Loans",
    body: "Unlock bigger amounts against a vehicle, property or equipment.",
    points: ["Largest limits", "Longer terms", "Asset valuation included"],
  },
  {
    icon: <Wallet />, title: "Salary Advance",
    body: "Bridge the gap to payday with a short-term advance.",
    points: ["1 – 3 month terms", "Same-day payout", "Repaid on payday"],
  },
  {
    icon: <GraduationCap />, title: "Education Loans",
    body: "Cover school fees, uniforms and exam costs without the stress.",
    points: ["Term-aligned repayments", "Pay school directly", "No hidden charges"],
  },
  {
    icon: <Receipt />, title: "Bill Credit", soon: true,
    body: "Airtime, data, pay TV, electricity and water on credit.",
    points: ["Buy now, pay later", "All major billers", "Coming soon"],
  },
];


function Loans() {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen">
      <SiteNav onApply={() => setOpen(true)} />

      <section className="mx-auto max-w-7xl px-6 py-16 text-center">
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Loan Options</h1>
        <p className="mt-3 text-lg text-[color:var(--color-muted)]">Choose the loan that fits your goal</p>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {OPTIONS.map((o) => (
            <article key={o.title} className="card flex flex-col p-7 text-left">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[color:var(--color-mint)] text-[color:var(--color-leaf-dark)] [&_svg]:h-7 [&_svg]:w-7">
                {o.icon}
              </div>
              <h2 className="mt-5 text-xl font-bold">{o.title}</h2>
              <p className="mt-2 text-sm text-[color:var(--color-muted)]">{o.body}</p>
              <ul className="mt-5 space-y-2 text-sm">
                {o.points.map((p) => (
                  <li key={p} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[color:var(--color-leaf)]" /> {p}
                  </li>
                ))}
              </ul>
              <ApplyButton onApply={() => setOpen(true)} className="mt-6 w-full" />
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
      {open && <Wizard onClose={() => setOpen(false)} loan={{ amount: 15000, term: 12, pct: 12, serviceFee: 1800, monthly: 1250 }} />}
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Briefcase, GraduationCap, HeartHandshake, Check } from "lucide-react";
import { SiteNav, SiteFooter, ApplyButton } from "@/components/SiteNav";
import { Wizard } from "@/components/Wizard";

export const Route = createFileRoute("/loans")({
  head: () => ({
    meta: [
      { title: "Loan Options — Business, Education & Personal | LendFlow" },
      { name: "description", content: "Compare LendFlow Africa loan options: business capital, education fees and personal loans with 2.5% interest and flexible mobile money repayments." },
      { property: "og:title", content: "Loan Options — LendFlow Africa" },
      { property: "og:description", content: "Business, education and personal micro loans with flexible repayments." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Loans,
});

const OPTIONS = [
  {
    icon: <Briefcase />, title: "Business Loans",
    body: "Grow your stock, expand your stall or cover a cash-flow gap.",
    points: ["K1,000 – K50,000", "3 – 24 month terms", "Same-day disbursement"],
  },
  {
    icon: <GraduationCap />, title: "Education Loans",
    body: "Cover school fees, uniforms and exam costs without the stress.",
    points: ["Term-aligned repayments", "Pay school directly", "No hidden charges"],
  },
  {
    icon: <HeartHandshake />, title: "Personal Loans",
    body: "For medical bills, home repairs and the unexpected moments.",
    points: ["Fast decisions", "2.5% interest", "Mobile wallet payout"],
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

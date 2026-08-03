import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { SiteNav, SiteFooter, ApplyButton } from "@/components/SiteNav";
import { Wizard } from "@/components/Wizard";

export const Route = createFileRoute("/faqs")({
  head: () => ({
    meta: [
      { title: "FAQs — LendFlow Africa Loans, Fees and Repayments" },
      { name: "description", content: "Answers about LendFlow Africa: 0% interest, how the commitment fee works, refunds, eligibility, repayment options and supported countries." },
      { property: "og:title", content: "LendFlow Africa FAQs" },
      { property: "og:description", content: "Everything about fees, eligibility, repayments and refunds — answered up front." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Faqs,
});

const FAQS = [
  { q: "Do you really charge 0% interest?", a: "Yes. LendFlow Africa charges no interest at all. Instead you pay a one-time commitment of 10–15% of your requested amount before disbursement." },
  { q: "How is the commitment calculated?", a: "It is 10% to 15% of the loan you request, based on your tier and history. A K10,000 loan at 12% means a K1,200 commitment, and you repay exactly K10,000." },
  { q: "What if my application is declined?", a: "Your commitment is refunded in full to the same mobile money wallet within 48 hours." },
  { q: "Which countries do you serve?", a: "Zambia, Ghana, Kenya and Nigeria today, with more African markets rolling out on the same platform." },
  { q: "How fast do I get the money?", a: "Most approved loans are disbursed to your mobile wallet within 24 hours, and often the same day." },
  { q: "How do I repay?", a: "Repay from your mobile money wallet on a weekly, fortnightly or monthly schedule. Payments are reconciled automatically the moment your provider confirms them." },
  { q: "What documents do I need?", a: "A national ID (front and back) and a selfie for verification. Some tiers may ask for proof of income." },
];

function Faqs() {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen">
      <SiteNav onApply={() => setOpen(true)} />

      <section className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-center text-4xl font-black tracking-tight sm:text-5xl">FAQs</h1>
        <p className="mt-3 text-center text-lg text-[color:var(--color-muted)]">Answers, up front.</p>

        <div className="mt-10 space-y-3">
          {FAQS.map((f) => (
            <details key={f.q} className="acc card px-5">
              <summary className="flex cursor-pointer items-center justify-between py-4 text-left text-base font-semibold">
                {f.q}
                <ChevronDown className="chev h-5 w-5 text-[color:var(--color-muted)] transition-transform" />
              </summary>
              <div className="acc-content"><p className="pb-5 text-[color:var(--color-muted)]">{f.a}</p></div>
            </details>
          ))}
        </div>

        <div className="mt-12 rounded-3xl bg-[color:var(--color-leaf-dark)] px-8 py-10 text-center text-white">
          <h2 className="text-2xl font-black">Still have a question?</h2>
          <p className="mt-2 text-sm text-white/80">Start your application — our team will guide you through it.</p>
          <ApplyButton onApply={() => setOpen(true)} className="mt-6 bg-white text-[color:var(--color-leaf-dark)] hover:bg-white/90" />
        </div>
      </section>

      <SiteFooter />
      {open && <Wizard onClose={() => setOpen(false)} loan={{ amount: 15000, term: 12, pct: 12, commitment: 1800, monthly: 1250 }} />}
    </div>
  );
}

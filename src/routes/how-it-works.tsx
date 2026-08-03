import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileEdit, ShieldCheck, Wallet } from "lucide-react";
import { SiteNav, SiteFooter, ApplyButton } from "@/components/SiteNav";
import { Wizard } from "@/components/Wizard";
import farmer from "@/assets/farmer-phone.jpg";
import vendor from "@/assets/hero-vendor.jpg";
import shopOwner from "@/assets/shop-owner.jpg";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How It Works — Get a LendFlow Africa Loan in 3 Steps" },
      { name: "description", content: "Apply in minutes, get approved fast and receive your money directly in your mobile wallet. See how a LendFlow Africa micro loan works." },
      { property: "og:title", content: "How It Works — LendFlow Africa" },
      { property: "og:description", content: "Apply, get approved, get funded. Three simple steps to a 2.5% interest mobile money loan." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HowItWorks,
});

const STEPS = [
  { icon: <FileEdit />, title: "Apply", body: "Fill out a quick and easy application in minutes." },
  { icon: <ShieldCheck />, title: "Get Approved", body: "We review your application and approve it fast." },
  { icon: <Wallet />, title: "Get Funded", body: "Receive the money directly in your mobile wallet." },
];

function HowItWorks() {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen">
      <SiteNav onApply={() => setOpen(true)} />

      <section className="mx-auto max-w-7xl px-6 py-16 text-center">
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">How It Works</h1>
        <p className="mt-3 text-lg text-[color:var(--color-muted)]">Get your loan in 3 simple steps</p>

        <div className="relative mt-14 grid gap-10 md:grid-cols-3">
          <div className="absolute left-[16%] right-[16%] top-9 hidden border-t-2 border-dashed border-[color:var(--color-line)] md:block" />
          {STEPS.map((s, i) => (
            <div key={s.title} className="relative flex flex-col items-center">
              <div className="grid h-[4.5rem] w-[4.5rem] place-items-center rounded-full bg-[color:var(--color-leaf-dark)] text-white [&_svg]:h-8 [&_svg]:w-8">
                {s.icon}
              </div>
              <div className="mt-5 flex items-center gap-2">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-[color:var(--color-leaf-dark)] text-xs font-bold text-white">{i + 1}</span>
                <h2 className="text-lg font-bold">{s.title}</h2>
              </div>
              <p className="mt-2 max-w-[15rem] text-sm text-[color:var(--color-muted)]">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="grid items-center gap-8 rounded-3xl border border-[color:var(--color-line)] bg-[color:var(--color-mint)]/60 p-6 md:grid-cols-[1fr_1fr_1fr] md:p-8">
          <img src={farmer} alt="Farmer checking his LendFlow loan on a phone" loading="lazy" width={1200} height={912}
            className="h-56 w-full rounded-2xl object-cover" />
          <div>
            <h2 className="text-2xl font-black tracking-tight">Loans that fit your life</h2>
            <p className="mt-3 text-sm text-[color:var(--color-muted)]">
              Whether you need a little boost or a big push, LendFlow Africa is here for you.
              Weekly, fortnightly or monthly repayments — at 2.5% interest.
            </p>
            <ApplyButton onApply={() => setOpen(true)} className="mt-5" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[vendor, shopOwner, farmer].map((src, i) => (
              <img key={i} src={src} alt="LendFlow Africa borrower" loading="lazy" width={400} height={500}
                className="h-40 w-full rounded-xl object-cover" />
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
      {open && <Wizard onClose={() => setOpen(false)} loan={{ amount: 15000, term: 12, pct: 12, commitment: 1800, monthly: 1250 }} />}
    </div>
  );
}

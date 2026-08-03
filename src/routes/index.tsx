import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight, FileEdit, ShieldCheck, Wallet, Star, Briefcase, GraduationCap,
  HeartHandshake, Smartphone, Quote, Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { money } from "@/lib/demo-auth";
import { SiteNav, SiteFooter } from "@/components/SiteNav";
import { Wizard } from "@/components/Wizard";
import heroVendor from "@/assets/hero-vendor.jpg";
import farmer from "@/assets/farmer-phone.jpg";
import shopOwner from "@/assets/shop-owner.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LendFlow Africa — Quick Loans. Real Growth." },
      { name: "description", content: "Micro loans for everyday Africans at 2.5% interest. Apply in minutes and get funded straight to your MTN MoMo, Airtel Money or M-Pesa wallet." },
      { property: "og:title", content: "LendFlow Africa — Quick Loans. Real Growth." },
      { property: "og:description", content: "Fast, flexible micro loans funded to your mobile wallet across Zambia, Ghana, Kenya and Nigeria." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function useCounter(target: number, duration = 1400) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf = 0; const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setN(Math.floor(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return n;
}

const STEPS = [
  { icon: <FileEdit />, title: "Apply", body: "Fill out a quick and easy application in minutes." },
  { icon: <ShieldCheck />, title: "Get Approved", body: "We review your application and approve it fast." },
  { icon: <Wallet />, title: "Get Funded", body: "Receive the money directly in your mobile wallet." },
];

const OPTIONS = [
  { icon: <Briefcase />, title: "Business Loans", body: "Grow your stock, expand your stall or cover a cash-flow gap." },
  { icon: <GraduationCap />, title: "Education Loans", body: "Cover school fees, uniforms and exam costs without the stress." },
  { icon: <HeartHandshake />, title: "Personal Loans", body: "For medical bills, home repairs and the unexpected moments." },
];

const TESTIMONIALS = [
  { name: "Grace M.", role: "Market vendor, Lusaka", img: heroVendor, quote: "I doubled my stock before the festive rush. The money was in my wallet the same day." },
  { name: "Joseph B.", role: "Farmer, Kabwe", img: farmer, quote: "A flat 2.5% and no hidden fees. I knew exactly what I had to repay from day one." },
  { name: "Amina K.", role: "Shop owner, Accra", img: shopOwner, quote: "Applying took ten minutes on my phone. LendFlow made growing my shop possible." },
];

function Landing() {
  const [wizardOpen, setWizardOpen] = useState(false);
  const [amount, setAmount] = useState(15000);
  const [term, setTerm] = useState(12);
  const [pct, setPct] = useState(12);

  const serviceFee = Math.round((amount * pct) / 100);
  const totalRepaid = Math.round(amount * 1.025); // flat 2.5% interest
  const monthly = totalRepaid / term;
  const disbursed = useCounter(50);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <SiteNav onApply={() => setWizardOpen(true)} />

      {/* HERO */}
      <section className="mx-auto max-w-7xl px-6 pt-12 pb-16 lg:pt-16">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="rise">
            <h1 className="text-5xl font-black leading-[1.03] tracking-tight sm:text-6xl">
              Quick Loans. <span className="gradient-text">Real Growth.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-[color:var(--color-muted)]">
              Micro loans for everyday Africans. Fast, flexible and built to help you achieve more —
              funded straight to your MTN MoMo, Airtel Money or M-Pesa wallet.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => setWizardOpen(true)}
                className="btn-primary group inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-bold transition">
                Apply Now <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <Link to="/how-it-works"
                className="inline-flex items-center gap-2 rounded-lg border border-[color:var(--color-line)] bg-white px-6 py-3 text-sm font-bold text-[color:var(--color-navy)] transition hover:bg-[color:var(--color-sky)]">
                Learn More
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-[color:var(--color-muted)]">
              <span className="flex items-center gap-2"><Check className="h-4 w-4 text-[color:var(--color-leaf)]" /> 2.5% interest</span>
              <span className="flex items-center gap-2"><Check className="h-4 w-4 text-[color:var(--color-leaf)]" /> K{disbursed}M+ disbursed</span>
              <span className="flex items-center gap-2"><Star className="h-4 w-4 text-[color:var(--color-leaf)]" /> 4.8/5 rating</span>
            </div>
          </div>

          <div className="rise relative">
            <img src={heroVendor} alt="Market vendor using her phone to apply for a LendFlow loan"
              width={1200} height={1200} className="h-[28rem] w-full rounded-3xl object-cover shadow-xl" />
            <div className="card absolute -bottom-6 left-6 right-6 flex items-center gap-3 p-4 sm:left-auto sm:right-8 sm:w-64">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[color:var(--color-mint)] text-[color:var(--color-leaf-dark)]">
                <Check className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-bold">You're pre-qualified!</div>
                <div className="text-xs text-[color:var(--color-muted)]">Up to {money(50000)} today</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="mx-auto max-w-7xl px-6 py-20 text-center">
        <h2 className="text-3xl font-black tracking-tight sm:text-4xl">How It Works</h2>
        <p className="mt-3 text-[color:var(--color-muted)]">Get your loan in 3 simple steps</p>
        <div className="relative mt-14 grid gap-10 md:grid-cols-3">
          <div className="absolute left-[16%] right-[16%] top-9 hidden border-t-2 border-dashed border-[color:var(--color-line)] md:block" />
          {STEPS.map((s, i) => (
            <div key={s.title} className="relative flex flex-col items-center">
              <div className="grid h-[4.5rem] w-[4.5rem] place-items-center rounded-full bg-[color:var(--color-leaf-dark)] text-white [&_svg]:h-8 [&_svg]:w-8">
                {s.icon}
              </div>
              <div className="mt-5 flex items-center gap-2">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-[color:var(--color-leaf-dark)] text-xs font-bold text-white">{i + 1}</span>
                <h3 className="text-lg font-bold">{s.title}</h3>
              </div>
              <p className="mt-2 max-w-[15rem] text-sm text-[color:var(--color-muted)]">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* LOAN OPTIONS */}
      <section className="border-y border-[color:var(--color-line)] bg-[color:var(--color-mint)]/40 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Loan Options</h2>
            <p className="mt-3 text-[color:var(--color-muted)]">Choose the loan that fits your goal</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {OPTIONS.map((o) => (
              <article key={o.title} className="card card-lift p-7">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-[color:var(--color-leaf-dark)] text-white [&_svg]:h-6 [&_svg]:w-6">{o.icon}</div>
                <h3 className="mt-5 text-lg font-bold">{o.title}</h3>
                <p className="mt-2 text-sm text-[color:var(--color-muted)]">{o.body}</p>
                <Link to="/loans" className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-[color:var(--color-leaf-dark)]">
                  Learn more <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CALCULATOR + APP */}
      <section id="apply" className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="card p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Loan calculator</h2>
              <span className="rounded-full bg-[color:var(--color-mint)] px-3 py-1 text-xs font-bold text-[color:var(--color-leaf-dark)]">2.5% interest</span>
            </div>
            <div className="mt-6">
              <SliderRow label="Loan amount" value={money(amount)} min={1000} max={50000} step={500} v={amount} onChange={setAmount} />
              <SliderRow label="Repayment term" value={`${term} months`} min={3} max={24} step={1} v={term} onChange={setTerm} className="mt-6" />
              <SliderRow label="Service fee (10–15%)" value={`${pct}%`} min={10} max={15} step={1} v={pct} onChange={setPct} className="mt-6" />
            </div>
            <div className="mt-8 grid grid-cols-3 gap-3 text-center">
              <Stat label="Service fee" value={money(serviceFee)} highlight />
              <Stat label="Monthly" value={money(monthly)} />
              <Stat label="Total repaid" value={money(totalRepaid)} />
            </div>
            <button onClick={() => setWizardOpen(true)}
              className="btn-primary mt-8 flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 text-base font-bold transition">
              Get your loan <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="rounded-3xl bg-[color:var(--color-navy)] p-8 text-white sm:p-12">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/60">
              <Smartphone className="h-4 w-4" /> Everything on your phone
            </div>
            <h2 className="mt-4 text-3xl font-black tracking-tight">Manage your loan anywhere</h2>
            <ul className="mt-6 space-y-3 text-sm text-white/80">
              {[
                "Track application status in real time",
                "See repayments reconciled automatically",
                "Repay from MTN MoMo, Airtel Money or M-Pesa",
                "Unlock higher limits as you repay on time",
              ].map((t) => (
                <li key={t} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--color-leaf)]" />{t}</li>
              ))}
            </ul>
            <Link to="/auth" className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-bold text-[color:var(--color-navy)]">
              Open my dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="border-y border-[color:var(--color-line)] bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">What our customers say</h2>
            <p className="mt-3 text-[color:var(--color-muted)]">Real borrowers, real growth</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <figure key={t.name} className="card p-7">
                <Quote className="h-6 w-6 text-[color:var(--color-leaf)]" />
                <blockquote className="mt-4 text-sm text-[color:var(--color-muted)]">“{t.quote}”</blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <img src={t.img} alt={t.name} loading="lazy" width={96} height={96} className="h-11 w-11 rounded-full object-cover" />
                  <div>
                    <div className="text-sm font-bold">{t.name}</div>
                    <div className="text-xs text-[color:var(--color-muted)]">{t.role}</div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="rounded-3xl bg-[color:var(--color-leaf-dark)] px-8 py-14 text-center text-white">
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Ready to take the next step?</h2>
          <p className="mt-3 text-white/80">Apply today and get funded to your mobile wallet.</p>
          <button onClick={() => setWizardOpen(true)}
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-7 py-3.5 text-sm font-bold text-[color:var(--color-leaf-dark)] transition hover:bg-white/90">
            Apply Now <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      <SiteFooter />

      {wizardOpen && (
        <Wizard onClose={() => setWizardOpen(false)} loan={{ amount, term, pct, commitment: serviceFee, monthly }} />
      )}
    </div>
  );
}

/* ---------------- primitives ---------------- */
function SliderRow({ label, value, min, max, step, v, onChange, className }:
  { label: string; value: string; min: number; max: number; step: number; v: number; onChange: (n: number) => void; className?: string }) {
  const pct = ((v - min) / (max - min)) * 100;
  return (
    <div className={className}>
      <div className="flex items-baseline justify-between">
        <label className="text-sm font-medium text-[color:var(--color-muted)]">{label}</label>
        <span className="text-lg font-bold tabular-nums">{value}</span>
      </div>
      <input type="range" className="slider mt-3" min={min} max={max} step={step} value={v}
        aria-label={label}
        onChange={(e) => onChange(Number(e.target.value))} style={{ ["--val" as string]: `${pct}%` }} />
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={cn("rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-sky)] px-3 py-4",
      highlight && "border-[color:var(--color-leaf)]/40 bg-[color:var(--color-mint)]")}>
      <div className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--color-muted)]">{label}</div>
      <div className="mt-1 text-lg font-black tabular-nums">{value}</div>
    </div>
  );
}

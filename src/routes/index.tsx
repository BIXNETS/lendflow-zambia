import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight, Zap, CalendarClock, ShieldCheck, ChevronDown, User, Mail, Phone,
  Smartphone, CheckCircle2, Star, TrendingUp, Loader, Sparkles, Wallet, BadgePercent,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Brand } from "@/components/Brand";
import { currentUser, money, saveApplication, type Application } from "@/lib/demo-auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LendFlow Africa — 0% Interest Mobile Money Loans" },
      { name: "description", content: "Borrow at 0% interest across Zambia, Ghana and Kenya. Pay a 10-15% commitment, receive funds straight to your mobile wallet." },
      { property: "og:title", content: "LendFlow Africa — 0% Interest Mobile Money Loans" },
      { property: "og:description", content: "Quick loans, real growth. 0% interest, funded to MTN MoMo, Airtel Money or M-Pesa." },
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

function Landing() {
  const [wizardOpen, setWizardOpen] = useState(false);
  const [amount, setAmount] = useState(15000);
  const [term, setTerm] = useState(12);
  const [pct, setPct] = useState(12);

  const commitment = Math.round((amount * pct) / 100);
  const monthly = amount / term; // 0% interest
  const disbursed = useCounter(50);
  const rating = useCounter(48);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Nav onApply={() => setWizardOpen(true)} />

      {/* HERO */}
      <section className="mx-auto max-w-7xl px-6 pt-12 pb-20 lg:pt-20">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div className="rise">
            <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-leaf)]/30 bg-[color:var(--color-mint)] px-3 py-1.5 text-xs font-semibold text-[color:var(--color-leaf-dark)]">
              <Sparkles className="h-3.5 w-3.5" />
              0% interest on every LendFlow micro loan
            </div>
            <h1 className="mt-6 text-5xl font-black leading-[1.03] tracking-tight sm:text-6xl">
              Quick loans. <span className="gradient-text">Real growth.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-[color:var(--color-muted)]">
              Pay a 10–15% commitment, borrow at zero interest and get funded straight to your
              MTN MoMo, Airtel Money or M-Pesa wallet — across Zambia, Ghana and Kenya.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => setWizardOpen(true)}
                className="btn-primary group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition">
                Start application <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <Link to="/auth"
                className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-line)] bg-white px-6 py-3 text-sm font-bold text-[color:var(--color-navy)] transition hover:bg-[color:var(--color-sky)]">
                Sign in to dashboard
              </Link>
            </div>

            <dl className="mt-12 grid max-w-md grid-cols-3 gap-6">
              <Metric label="Disbursed" value={`K${disbursed}M+`} icon={<TrendingUp className="h-4 w-4" />} />
              <Metric label="Rating" value={`${(rating / 10).toFixed(1)}/5`} icon={<Star className="h-4 w-4" />} />
              <Metric label="Interest" value="0%" icon={<BadgePercent className="h-4 w-4" />} />
            </dl>
          </div>

          {/* CALCULATOR */}
          <div className="rise card p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Loan calculator</h2>
              <span className="rounded-full bg-[color:var(--color-mint)] px-3 py-1 text-xs font-bold text-[color:var(--color-leaf-dark)]">
                0% interest
              </span>
            </div>

            <div className="mt-6">
              <SliderRow label="Loan amount" value={money(amount)} min={1000} max={50000} step={500} v={amount} onChange={setAmount} />
              <SliderRow label="Repayment term" value={`${term} months`} min={3} max={24} step={1} v={term} onChange={setTerm} className="mt-6" />
              <SliderRow label="Commitment (10–15%)" value={`${pct}%`} min={10} max={15} step={1} v={pct} onChange={setPct} className="mt-6" />
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3 text-center">
              <Stat label="Commitment" value={money(commitment)} highlight />
              <Stat label="Monthly" value={money(monthly)} />
              <Stat label="Total repaid" value={money(amount)} />
            </div>

            <button onClick={() => setWizardOpen(true)}
              className="btn-primary mt-8 flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-base font-bold transition">
              Get your loan <ArrowRight className="h-4 w-4" />
            </button>
            <p className="mt-3 text-center text-xs text-[color:var(--color-muted)]">
              You repay exactly what you borrow. The commitment fee is paid up front by mobile money.
            </p>
          </div>
        </div>
      </section>

      {/* HOW */}
      <section id="how" className="mx-auto max-w-7xl px-6 py-16">
        <SectionHeader eyebrow="How it works" title="Four steps to funded." />
        <div className="mt-12 grid gap-6 md:grid-cols-4">
          <FeatureCard icon={<User />} title="1. Register" body="Create your free LendFlow account in under a minute." />
          <FeatureCard icon={<Wallet />} title="2. Pay commitment" body="Send 10–15% of your requested amount by mobile money." />
          <FeatureCard icon={<Zap />} title="3. Instant review" body="Our managers review and approve most files the same day." />
          <FeatureCard icon={<Smartphone />} title="4. Get funded" body="Money lands in your mobile wallet — repay at 0% interest." />
        </div>
      </section>

      {/* COMMITMENT */}
      <section id="commitment" className="mx-auto max-w-7xl px-6 py-16">
        <div className="card overflow-hidden">
          <div className="grid gap-8 p-8 md:grid-cols-2 md:p-12">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-[color:var(--color-leaf-dark)]">Commitment policy</div>
              <h2 className="mt-3 text-3xl font-black tracking-tight">Zero interest, one honest fee.</h2>
              <p className="mt-4 text-[color:var(--color-muted)]">
                Every borrower pays a commitment of <strong>10% to 15%</strong> of the requested amount before the
                loan is released. It replaces interest entirely — after that, you repay only the principal.
              </p>
              <ul className="mt-6 space-y-3 text-sm">
                {[
                  "No interest, ever — 0% APR on all tiers.",
                  "Commitment paid by MTN MoMo, Airtel Money or M-Pesa.",
                  "Refunded in full if your application is declined.",
                  "No late-payment interest — only a flat rescheduling fee.",
                ].map((t) => (
                  <li key={t} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--color-leaf)]" />
                    <span className="text-[color:var(--color-muted)]">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-1">
              {[
                { amt: 5000, p: 10 }, { amt: 15000, p: 12 }, { amt: 30000, p: 15 },
              ].map(r => (
                <div key={r.amt} className="rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-mint)] p-5">
                  <div className="text-sm font-semibold text-[color:var(--color-navy)]">Borrow {money(r.amt)}</div>
                  <div className="mt-1 text-3xl font-black text-[color:var(--color-leaf-dark)]">{money(r.amt * r.p / 100)}</div>
                  <div className="text-xs text-[color:var(--color-muted)]">{r.p}% commitment · repay {money(r.amt)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section id="benefits" className="mx-auto max-w-7xl px-6 py-16">
        <SectionHeader eyebrow="Why LendFlow" title="Built for African entrepreneurs." />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <FeatureCard icon={<CalendarClock />} title="Flexible schedules" body="Weekly, fortnightly or monthly repayments that fit your cash flow." />
          <FeatureCard icon={<ShieldCheck />} title="Secure KYC" body="Bank-grade encryption on every ID document and selfie you upload." />
          <FeatureCard icon={<TrendingUp />} title="Grow your limit" body="Repay on time and unlock higher tiers automatically." />
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-6 py-16">
        <SectionHeader eyebrow="FAQ" title="Answers, up front." center />
        <div className="mt-10 space-y-3">
          {faqs.map((f, i) => (
            <details key={i} className="acc card px-5">
              <summary className="flex cursor-pointer items-center justify-between py-4 text-left text-base font-semibold">
                {f.q}
                <ChevronDown className="chev h-5 w-5 text-[color:var(--color-muted)] transition-transform" />
              </summary>
              <div className="acc-content"><p className="pb-5 text-[color:var(--color-muted)]">{f.a}</p></div>
            </details>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-[color:var(--color-line)] bg-white/70 py-8">
        <div className="marquee-track gap-16 px-8 text-[color:var(--color-navy)]/50">
          {[...partners, ...partners].map((p, i) => (
            <div key={i} className="whitespace-nowrap text-xl font-extrabold tracking-tight">{p}</div>
          ))}
        </div>
      </section>

      <footer className="mx-auto max-w-7xl px-6 py-14 text-sm text-[color:var(--color-muted)]">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <Brand />
          <div>© {new Date().getFullYear()} LendFlow Africa. Quick Loans. Real Growth.</div>
        </div>
      </footer>

      {wizardOpen && (
        <Wizard onClose={() => setWizardOpen(false)} loan={{ amount, term, pct, commitment, monthly }} />
      )}
    </div>
  );
}

/* ---------------- Nav ---------------- */
function Nav({ onApply }: { onApply: () => void }) {
  return (
    <header className="sticky top-0 z-40 mx-auto max-w-7xl px-6 py-4">
      <div className="card flex items-center justify-between gap-4 rounded-full px-4 py-2.5">
        <Link to="/" className="pl-1"><Brand /></Link>
        <nav className="hidden items-center gap-6 text-sm font-semibold text-[color:var(--color-muted)] md:flex">
          <a href="#how" className="hover:text-[color:var(--color-navy)]">How it works</a>
          <a href="#commitment" className="hover:text-[color:var(--color-navy)]">Commitment</a>
          <a href="#benefits" className="hover:text-[color:var(--color-navy)]">Benefits</a>
          <a href="#faq" className="hover:text-[color:var(--color-navy)]">FAQ</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/auth" className="hidden rounded-full px-4 py-2 text-sm font-bold text-[color:var(--color-navy)] hover:bg-[color:var(--color-sky)] sm:block">
            Sign in
          </Link>
          <button onClick={onApply} className="btn-primary pulse-cta rounded-full px-4 py-2 text-sm font-bold">
            Apply now
          </button>
        </div>
      </div>
    </header>
  );
}

/* ---------------- primitives ---------------- */
function Metric({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div>
      <dt className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[color:var(--color-muted)]">{icon}{label}</dt>
      <dd className="mt-1 text-2xl font-black tracking-tight">{value}</dd>
    </div>
  );
}

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

function SectionHeader({ eyebrow, title, center }: { eyebrow: string; title: string; center?: boolean }) {
  return (
    <div className={cn(center && "mx-auto max-w-2xl text-center")}>
      <div className="text-xs font-bold uppercase tracking-widest text-[color:var(--color-leaf-dark)]">{eyebrow}</div>
      <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">{title}</h2>
    </div>
  );
}

function FeatureCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="card card-lift p-7">
      <div className="grid h-11 w-11 place-items-center rounded-xl bg-[color:var(--color-navy)] text-white [&_svg]:h-5 [&_svg]:w-5">{icon}</div>
      <h3 className="mt-5 text-lg font-bold">{title}</h3>
      <p className="mt-2 text-sm text-[color:var(--color-muted)]">{body}</p>
    </div>
  );
}


const faqs = [
  { q: "Do you really charge 0% interest?", a: "Yes. LendFlow Africa charges no interest at all. Instead you pay a one-time commitment of 10–15% of your requested amount before disbursement." },
  { q: "How is the commitment calculated?", a: "It is 10% to 15% of the loan you request, based on your tier and history. A K10,000 loan at 12% means a K1,200 commitment, and you repay exactly K10,000." },
  { q: "What if my application is declined?", a: "Your commitment is refunded in full to the same mobile money wallet within 48 hours." },
  { q: "Which countries do you serve?", a: "Zambia, Ghana and Kenya today, with more African markets rolling out on the same platform." },
];

const partners = ["MTN MOMO", "AIRTEL MONEY", "M-PESA", "ZANACO", "FLUTTERWAVE", "STANBIC", "ABSA"];

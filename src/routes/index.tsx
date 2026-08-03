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

/* ---------------- Wizard ---------------- */
type LoanCtx = { amount: number; term: number; pct: number; commitment: number; monthly: number };
type Form = {
  firstName: string; lastName: string; email: string; phone: string;
  purpose: string; provider: string; msisdn: string; consent: boolean;
};

function Wizard({ onClose, loan }: { onClose: () => void; loan: LoanCtx }) {
  const navigate = useNavigate();
  const user = typeof window !== "undefined" ? currentUser() : null;
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<Form>({
    firstName: user?.name.split(" ")[0] ?? "", lastName: user?.name.split(" ")[1] ?? "",
    email: user?.email ?? "", phone: user?.phone ?? "",
    purpose: "", provider: "", msisdn: "", consent: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "processing" | "done">("idle");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);

  const update = <K extends keyof Form>(k: K, v: Form[K]) => setForm(f => ({ ...f, [k]: v }));

  const validate = (s: number) => {
    const e: Record<string, string> = {};
    if (s === 1) {
      if (!form.firstName.trim()) e.firstName = "Required";
      if (!form.lastName.trim()) e.lastName = "Required";
      if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Valid email required";
      if (!/^[+\d\s()-]{7,}$/.test(form.phone)) e.phone = "Valid phone required";
    }
    if (s === 2) { if (!form.purpose) e.purpose = "Please select a purpose"; }
    if (s === 3) {
      if (!form.provider) e.provider = "Choose a mobile money provider";
      if (!/^[+\d\s()-]{7,}$/.test(form.msisdn)) e.msisdn = "Valid mobile money number required";
      if (!form.consent) e.consent = "You must authorise the commitment payment";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate(step)) setStep(s => Math.min(4, s + 1)); };
  const back = () => setStep(s => Math.max(1, s - 1));

  const submit = () => {
    setStatus("processing");
    const app: Application = {
      id: "LF-" + Math.floor(10000 + Math.random() * 89999),
      email: form.email.trim().toLowerCase(),
      name: `${form.firstName} ${form.lastName}`.trim(),
      amount: loan.amount, term: loan.term,
      commitmentPct: loan.pct, commitment: loan.commitment,
      provider: form.provider, msisdn: form.msisdn, purpose: form.purpose,
      status: "under_review", createdAt: new Date().toISOString(),
    };
    setTimeout(() => { saveApplication(app); setStatus("done"); }, 1800);
  };

  const stepTitle = ["Your details", "Loan purpose", "Commitment payment", "Review & submit"][step - 1];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6">
      <div className="absolute inset-0 bg-[color:var(--color-navy)]/40 backdrop-blur-sm" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-label="Loan application"
        className="rise card relative w-full max-w-2xl overflow-hidden rounded-t-3xl p-0 sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-[color:var(--color-line)] px-6 py-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-[color:var(--color-leaf-dark)]">Application</div>
            <div className="text-lg font-bold">{status === "done" ? "Submitted" : `Step ${step} of 4 · ${stepTitle}`}</div>
          </div>
          <button onClick={onClose} aria-label="Close"
            className="grid h-9 w-9 place-items-center rounded-full border border-[color:var(--color-line)] hover:bg-[color:var(--color-sky)]">✕</button>
        </div>

        <div className="px-6 pt-4">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[color:var(--color-line)]">
            <div className="h-full rounded-full bg-[color:var(--color-leaf)] transition-all duration-500"
              style={{ width: `${((status === "done" ? 4 : step) / 4) * 100}%` }} />
          </div>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-6 py-6">
          {status === "processing" && <ProcessingView />}
          {status === "done" && (
            <SuccessView commitment={loan.commitment} onDashboard={() => { onClose(); navigate({ to: "/dashboard" }); }} />
          )}

          {status === "idle" && step === 1 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="First name" icon={<User className="h-4 w-4" />} error={errors.firstName}>
                <input value={form.firstName} onChange={e => update("firstName", e.target.value)} className={inputCls(errors.firstName)} placeholder="Joseph" />
              </Field>
              <Field label="Last name" icon={<User className="h-4 w-4" />} error={errors.lastName}>
                <input value={form.lastName} onChange={e => update("lastName", e.target.value)} className={inputCls(errors.lastName)} placeholder="Banda" />
              </Field>
              <Field label="Email" icon={<Mail className="h-4 w-4" />} error={errors.email} full>
                <input type="email" value={form.email} onChange={e => update("email", e.target.value)} className={inputCls(errors.email)} placeholder="you@example.com" />
              </Field>
              <Field label="Phone" icon={<Phone className="h-4 w-4" />} error={errors.phone} full>
                <input value={form.phone} onChange={e => update("phone", e.target.value)} className={inputCls(errors.phone)} placeholder="+260 97 000 0000" />
              </Field>
            </div>
          )}

          {status === "idle" && step === 2 && (
            <div className="space-y-5">
              <div className="rounded-2xl bg-[color:var(--color-mint)] p-5">
                <div className="text-sm font-bold text-[color:var(--color-navy)]">Your requested loan</div>
                <div className="mt-3 grid grid-cols-3 gap-3">
                  <ReviewItem label="Amount" value={money(loan.amount)} />
                  <ReviewItem label="Term" value={`${loan.term} months`} />
                  <ReviewItem label="Interest" value="0%" />
                </div>
              </div>
              <Field label="Purpose of loan" error={errors.purpose} full>
                <select value={form.purpose} onChange={e => update("purpose", e.target.value)} className={inputCls(errors.purpose)}>
                  <option value="">Select…</option>
                  <option>Business stock</option><option>Farming inputs</option>
                  <option>School fees</option><option>Home improvement</option><option>Emergency</option>
                </select>
              </Field>
            </div>
          )}

          {status === "idle" && step === 3 && (
            <div className="space-y-5">
              <div className="rounded-2xl border border-[color:var(--color-leaf)]/40 bg-[color:var(--color-mint)] p-5">
                <div className="text-xs font-bold uppercase tracking-widest text-[color:var(--color-leaf-dark)]">Commitment due now</div>
                <div className="mt-1 text-3xl font-black">{money(loan.commitment)}</div>
                <p className="mt-1 text-xs text-[color:var(--color-muted)]">
                  {loan.pct}% of {money(loan.amount)} — this replaces interest. You repay only {money(loan.amount)}.
                </p>
              </div>
              <Field label="Mobile money provider" error={errors.provider} full>
                <div className="grid gap-3 sm:grid-cols-3">
                  {["MTN MoMo", "Airtel Money", "M-Pesa"].map(p => (
                    <button key={p} type="button" onClick={() => update("provider", p)}
                      className={cn("rounded-xl border px-3 py-3 text-sm font-bold transition",
                        form.provider === p
                          ? "border-[color:var(--color-leaf)] bg-[color:var(--color-mint)] text-[color:var(--color-leaf-dark)]"
                          : "border-[color:var(--color-line)] bg-white hover:bg-[color:var(--color-sky)]")}>
                      {p}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Mobile money number" icon={<Smartphone className="h-4 w-4" />} error={errors.msisdn} full>
                <input value={form.msisdn} onChange={e => update("msisdn", e.target.value)} className={inputCls(errors.msisdn)} placeholder="+260 96 000 0000" />
              </Field>
              <label className="flex items-start gap-3 text-sm">
                <input type="checkbox" checked={form.consent} onChange={e => update("consent", e.target.checked)}
                  className="mt-1 h-4 w-4 accent-[color:var(--color-leaf)]" />
                <span className="text-[color:var(--color-muted)]">
                  I authorise LendFlow Africa to collect the {money(loan.commitment)} commitment from this wallet, refundable if declined.
                </span>
              </label>
              {errors.consent && <p className="text-sm text-red-600">{errors.consent}</p>}
            </div>
          )}

          {status === "idle" && step === 4 && (
            <div className="space-y-5">
              <div className="card p-5">
                <div className="text-xs font-bold uppercase tracking-widest text-[color:var(--color-leaf-dark)]">Loan summary</div>
                <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <ReviewItem label="Amount" value={money(loan.amount)} />
                  <ReviewItem label="Term" value={`${loan.term} mo`} />
                  <ReviewItem label="Interest" value="0%" />
                  <ReviewItem label="Commitment" value={`${money(loan.commitment)} (${loan.pct}%)`} />
                </div>
              </div>
              <div className="card p-5">
                <div className="text-xs font-bold uppercase tracking-widest text-[color:var(--color-leaf-dark)]">Applicant</div>
                <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                  <ReviewItem label="Name" value={`${form.firstName} ${form.lastName}`} />
                  <ReviewItem label="Email" value={form.email} />
                  <ReviewItem label="Phone" value={form.phone} />
                  <ReviewItem label="Purpose" value={form.purpose} />
                  <ReviewItem label="Provider" value={form.provider} />
                  <ReviewItem label="Wallet" value={form.msisdn} />
                </div>
              </div>
            </div>
          )}
        </div>

        {status === "idle" && (
          <div className="flex items-center justify-between border-t border-[color:var(--color-line)] px-6 py-4">
            <button onClick={back} disabled={step === 1}
              className="rounded-full border border-[color:var(--color-line)] px-5 py-2.5 text-sm font-bold text-[color:var(--color-navy)] transition hover:bg-[color:var(--color-sky)] disabled:opacity-40">
              Back
            </button>
            {step < 4 ? (
              <button onClick={next} className="btn-navy inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold">
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button onClick={submit} className="btn-primary inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold">
                Pay commitment & submit <CheckCircle2 className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ProcessingView() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <Loader className="spin h-12 w-12 text-[color:var(--color-leaf)]" />
      <div className="mt-6 text-lg font-bold">Collecting your commitment…</div>
      <div className="mt-1 text-sm text-[color:var(--color-muted)]">Approve the prompt on your phone</div>
    </div>
  );
}

function SuccessView({ commitment, onDashboard }: { commitment: number; onDashboard: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-full bg-[color:var(--color-mint)] ring-2 ring-[color:var(--color-leaf)]/50">
        <svg viewBox="0 0 24 24" className="h-8 w-8 text-[color:var(--color-leaf-dark)]" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
          <path className="check-path" d="M4 12l5 5 11-11" />
        </svg>
      </div>
      <div className="mt-5 text-2xl font-black">Commitment of {money(commitment)} received!</div>
      <p className="mt-2 max-w-sm text-sm text-[color:var(--color-muted)]">
        Your application is now with a LendFlow manager. Track its status from your dashboard.
      </p>
      <button onClick={onDashboard} className="btn-primary mt-6 rounded-full px-6 py-2.5 text-sm font-bold">
        Go to my dashboard
      </button>
    </div>
  );
}

function Field({ label, icon, error, children, full }:
  { label: string; icon?: React.ReactNode; error?: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={cn(full && "sm:col-span-2")}>
      <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[color:var(--color-muted)]">
        {icon}{label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs font-semibold text-red-600">{error}</p>}
    </div>
  );
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-[color:var(--color-muted)]">{label}</div>
      <div className="mt-0.5 font-bold">{value || "—"}</div>
    </div>
  );
}

export function inputCls(error?: string) {
  return cn(
    "w-full rounded-xl border bg-white px-3.5 py-3 text-sm outline-none transition placeholder:text-[color:var(--color-muted)]/60",
    "focus:border-[color:var(--color-leaf)] focus:ring-2 focus:ring-[color:var(--color-leaf)]/25",
    error ? "border-red-400 ring-2 ring-red-200" : "border-[color:var(--color-line)]",
  );
}

const faqs = [
  { q: "Do you really charge 0% interest?", a: "Yes. LendFlow Africa charges no interest at all. Instead you pay a one-time commitment of 10–15% of your requested amount before disbursement." },
  { q: "How is the commitment calculated?", a: "It is 10% to 15% of the loan you request, based on your tier and history. A K10,000 loan at 12% means a K1,200 commitment, and you repay exactly K10,000." },
  { q: "What if my application is declined?", a: "Your commitment is refunded in full to the same mobile money wallet within 48 hours." },
  { q: "Which countries do you serve?", a: "Zambia, Ghana and Kenya today, with more African markets rolling out on the same platform." },
];

const partners = ["MTN MOMO", "AIRTEL MONEY", "M-PESA", "ZANACO", "FLUTTERWAVE", "STANBIC", "ABSA"];

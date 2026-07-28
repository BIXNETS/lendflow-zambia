import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight, Sun, Moon, Waves, Zap, CalendarClock, ShieldCheck,
  ChevronDown, User, Mail, Phone, Briefcase, Upload, CheckCircle2,
  DollarSign, Star, TrendingUp, Loader, Check, Smartphone, X, AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lendflow — Smart financing, built to let your life flow." },
      { name: "description", content: "Premium personal loans with instant approval, transparent rates, and flexible terms up to 36 months." },
      { property: "og:title", content: "Lendflow — Smart financing, built to let your life flow." },
      { property: "og:description", content: "Premium personal loans with instant approval and transparent rates." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LendflowLanding,
});

const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function useTheme() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("theme")) as "dark" | "light" | null;
    if (saved) setTheme(saved);
  }, []);
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);
  return { theme, toggle: () => setTheme(t => (t === "dark" ? "light" : "dark")) };
}

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

function LendflowLanding() {
  const { theme, toggle } = useTheme();
  const [wizardOpen, setWizardOpen] = useState(false);
  const [amount, setAmount] = useState(15000);
  const [term, setTerm] = useState(24);

  const rate = term > 12 ? 8.5 : 7.5;
  const monthly = useMemo(() => {
    const r = rate / 100 / 12;
    return (amount * r) / (1 - Math.pow(1 + r, -term));
  }, [amount, term, rate]);
  const total = monthly * term;

  const disbursed = useCounter(50);
  const rating = useCounter(48);

  const openWizard = () => setWizardOpen(true);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="aurora" />
      <div className="relative z-10">
        <Nav theme={theme} onToggle={toggle} onApply={openWizard} />

        {/* HERO */}
        <section className="mx-auto max-w-7xl px-6 pt-16 pb-20 lg:pt-24 lg:pb-32">
          <div className="grid gap-14 lg:grid-cols-2 lg:gap-10 items-center">
            <div className="rise">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 backdrop-blur">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                Now approving applications in under 60 seconds
              </div>
              <h1 className="mt-6 text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
                Smart financing,{" "}
                <span className="gradient-text">built to let your life flow.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg text-[color:var(--color-muted)]">
                Get approved in minutes with competitive rates and flexible terms.
                No hidden fees, just seamless capital.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={openWizard}
                  className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:from-indigo-400 hover:to-violet-400"
                >
                  Start application
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
                <a
                  href="#how"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white/80 backdrop-blur transition hover:bg-white/10"
                >
                  How it works
                </a>
              </div>

              <dl className="mt-12 grid grid-cols-2 gap-6 max-w-md">
                <Metric label="Disbursed" value={`$${disbursed}M+`} icon={<TrendingUp className="h-4 w-4" />} />
                <Metric label="Customer rating" value={`${(rating / 10).toFixed(1)}/5`} icon={<Star className="h-4 w-4" />} />
              </dl>
            </div>

            {/* CALCULATOR */}
            <div className="rise glass p-6 sm:p-8 shadow-2xl shadow-indigo-500/10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Loan calculator</h2>
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                  Live estimate
                </span>
              </div>

              <div className="mt-6">
                <SliderRow
                  label="Loan amount"
                  value={money(amount)}
                  min={1000} max={50000} step={500} v={amount}
                  onChange={setAmount}
                />
                <SliderRow
                  label="Term"
                  value={`${term} months`}
                  min={3} max={36} step={1} v={term}
                  onChange={setTerm}
                  className="mt-6"
                />
              </div>

              <div className="mt-8 grid grid-cols-3 gap-3 text-center">
                <Stat label="Monthly" value={money(monthly)} highlight />
                <Stat label="Rate" value={`${rate}%`} />
                <Stat label="Total" value={money(total)} />
              </div>

              <button
                onClick={openWizard}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:from-emerald-400 hover:to-teal-400"
              >
                Get your loan
                <ArrowRight className="h-4 w-4" />
              </button>
              <p className="mt-3 text-center text-xs text-[color:var(--color-muted)]">
                Checking your rate won't affect your credit score.
              </p>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how" className="mx-auto max-w-7xl px-6 py-20">
          <SectionHeader eyebrow="How it works" title="Everything you need. Nothing you don't." />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <FeatureCard icon={<Zap />} title="Instant analysis"
              body="Automated credit check with zero impact on your credit score." />
            <FeatureCard icon={<CalendarClock />} title="Flexible payback"
              body="Change your monthly payment date anytime from the app." />
            <FeatureCard icon={<ShieldCheck />} title="Secure by design"
              body="Bank-grade 256-bit encryption keeps your financial data private." />
          </div>
        </section>

        {/* RATES */}
        <section id="rates" className="mx-auto max-w-7xl px-6 py-20">
          <SectionHeader eyebrow="Rates" title="Transparent, all-in pricing." />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { term: "3–12 months", apr: "7.5%", note: "Best for short-term needs" },
              { term: "13–24 months", apr: "8.5%", note: "Most popular" },
              { term: "25–36 months", apr: "8.5%", note: "Lowest monthly payment" },
            ].map((t, i) => (
              <div key={i} className={cn("glass p-6", i === 1 && "ring-1 ring-indigo-400/40")}>
                <div className="text-sm text-[color:var(--color-muted)]">{t.term}</div>
                <div className="mt-2 text-4xl font-bold">{t.apr}<span className="text-base font-normal text-[color:var(--color-muted)]"> APR</span></div>
                <div className="mt-2 text-sm text-[color:var(--color-muted)]">{t.note}</div>
              </div>
            ))}
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section id="testimonials" className="mx-auto max-w-7xl px-6 py-20">
          <SectionHeader eyebrow="Testimonials" title="Loved by 25,000+ borrowers." />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { q: "Approved in 4 minutes. Funded the next morning. Unreal.", n: "Priya S.", r: "Consolidated $18k" },
              { q: "The calculator matched my final rate exactly. No surprises.", n: "Marcus L.", r: "Home renovation" },
              { q: "Best fintech UX I've used. Even changing my due date is one tap.", n: "Elena R.", r: "Business loan" },
            ].map((t, i) => (
              <div key={i} className="glass p-6">
                <div className="flex gap-1 text-amber-400">
                  {[...Array(5)].map((_, j) => <Star key={j} className="h-4 w-4 fill-current" />)}
                </div>
                <p className="mt-4 text-lg leading-snug">"{t.q}"</p>
                <div className="mt-6 text-sm">
                  <div className="font-semibold">{t.n}</div>
                  <div className="text-[color:var(--color-muted)]">{t.r}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto max-w-3xl px-6 py-20">
          <SectionHeader eyebrow="FAQ" title="Answers, up front." center />
          <div className="mt-10 space-y-3">
            {faqs.map((f, i) => (
              <details key={i} className="acc glass px-5">
                <summary className="flex cursor-pointer items-center justify-between py-4 text-left text-base font-medium">
                  {f.q}
                  <ChevronDown className="chev h-5 w-5 text-[color:var(--color-muted)] transition-transform" />
                </summary>
                <div className="acc-content">
                  <p className="pb-5 text-[color:var(--color-muted)]">{f.a}</p>
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* MARQUEE */}
        <section className="relative overflow-hidden border-y border-white/5 py-8">
          <div className="marquee-track gap-16 px-8 opacity-60">
            {[...partners, ...partners].map((p, i) => (
              <div key={i} className="text-xl font-semibold tracking-tight whitespace-nowrap">{p}</div>
            ))}
          </div>
        </section>

        <footer className="mx-auto max-w-7xl px-6 py-14 text-sm text-[color:var(--color-muted)]">
          <div className="flex flex-col items-start justify-between gap-6 border-t border-white/5 pt-8 md:flex-row md:items-center">
            <div className="flex items-center gap-2">
              <LogoMark />
              <span className="text-base font-semibold text-[color:var(--color-fg)]">Lendflow</span>
            </div>
            <div>© {new Date().getFullYear()} Lendflow, Inc. All rights reserved.</div>
          </div>
        </footer>
      </div>

      {wizardOpen && (
        <Wizard
          onClose={() => setWizardOpen(false)}
          loan={{ amount, term, rate, monthly, total }}
        />
      )}
    </div>
  );
}

/* ---------------- Nav ---------------- */
function Nav({ theme, onToggle, onApply }: { theme: "dark" | "light"; onToggle: () => void; onApply: () => void }) {
  return (
    <header className="sticky top-0 z-40 mx-auto max-w-7xl px-6 py-4">
      <div className="glass flex items-center justify-between gap-4 rounded-full px-4 py-2.5">
        <a href="#" className="flex items-center gap-2 pl-2">
          <LogoMark />
          <span className="text-base font-semibold tracking-tight">Lendflow</span>
        </a>
        <nav className="hidden items-center gap-6 text-sm text-white/70 md:flex">
          <a href="#how" className="hover:text-white">How it works</a>
          <a href="#rates" className="hover:text-white">Rates</a>
          <a href="#faq" className="hover:text-white">FAQ</a>
          <a href="#testimonials" className="hover:text-white">Testimonials</a>
        </nav>
        <div className="flex items-center gap-2">
          <button
            aria-label="Toggle theme"
            onClick={onToggle}
            className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-white/80 transition hover:bg-white/10"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            onClick={onApply}
            className="pulse-cta rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-violet-500/30 transition hover:from-indigo-400 hover:to-violet-400"
          >
            Apply now
          </button>
        </div>
      </div>
    </header>
  );
}

function LogoMark() {
  return (
    <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-emerald-500 shadow-lg shadow-violet-500/30">
      <Waves className="h-4 w-4 text-white" />
    </span>
  );
}

/* ---------------- Small primitives ---------------- */
function Metric({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div>
      <dt className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-[color:var(--color-muted)]">
        {icon}{label}
      </dt>
      <dd className="mt-1 text-3xl font-bold tracking-tight">{value}</dd>
    </div>
  );
}

function SliderRow({
  label, value, min, max, step, v, onChange, className,
}: { label: string; value: string; min: number; max: number; step: number; v: number; onChange: (n: number) => void; className?: string }) {
  const pct = ((v - min) / (max - min)) * 100;
  return (
    <div className={className}>
      <div className="flex items-baseline justify-between">
        <label className="text-sm text-[color:var(--color-muted)]">{label}</label>
        <span className="text-lg font-semibold tabular-nums">{value}</span>
      </div>
      <input
        type="range" className="slider mt-3"
        min={min} max={max} step={step} value={v}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ ["--val" as string]: `${pct}%` }}
      />
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={cn(
      "rounded-2xl border border-white/5 bg-white/[0.03] px-3 py-4",
      highlight && "bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border-indigo-400/30",
    )}>
      <div className="text-[10px] uppercase tracking-widest text-[color:var(--color-muted)]">{label}</div>
      <div className="mt-1 text-lg font-bold tabular-nums">{value}</div>
    </div>
  );
}

function SectionHeader({ eyebrow, title, center }: { eyebrow: string; title: string; center?: boolean }) {
  return (
    <div className={cn(center && "text-center mx-auto max-w-2xl")}>
      <div className="text-xs font-semibold uppercase tracking-widest text-indigo-400">{eyebrow}</div>
      <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
    </div>
  );
}

function FeatureCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="glass group relative overflow-hidden p-8 transition hover:-translate-y-1">
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-indigo-500/20 to-emerald-500/20 opacity-0 blur-2xl transition group-hover:opacity-100" />
      <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-lg shadow-violet-500/25 [&_svg]:h-5 [&_svg]:w-5">
        {icon}
      </div>
      <h3 className="mt-5 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-[color:var(--color-muted)]">{body}</p>
    </div>
  );
}

/* ---------------- Wizard ---------------- */
type LoanCtx = { amount: number; term: number; rate: number; monthly: number; total: number };
type Form = {
  firstName: string; lastName: string; email: string; phone: string;
  income: number; employment: string; purpose: string;
  consent: boolean;
  idFront: File | null; idBack: File | null; selfie: File | null;
  provider: "" | "M-Pesa" | "MTN MoMo" | "Airtel Money";
  mobileNumber: string;
};
type Tier = {
  id: string; name: string;
  min_amount: number; max_amount: number;
  min_term_months: number; max_term_months: number;
  interest_rate: number;
};

const TOTAL_STEPS = 5;
const STEP_TITLES = ["Personal", "Financial", "Identity", "Payment", "Review"];

function Wizard({ onClose, loan }: { onClose: () => void; loan: LoanCtx }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<Form>({
    firstName: "", lastName: "", email: "", phone: "",
    income: 5000, employment: "", purpose: "",
    consent: false,
    idFront: null, idBack: null, selfie: null,
    provider: "", mobileNumber: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "processing" | "done">("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [tiers, setTiers] = useState<Tier[]>([]);

  const dialogRef = useRef<HTMLDivElement>(null);
  const headingId = "wizard-title";
  const descId = "wizard-desc";

  // Focus trap + escape + body scroll lock
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";

    const focusables = () => {
      const root = dialogRef.current;
      if (!root) return [] as HTMLElement[];
      return Array.from(
        root.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter(el => el.offsetParent !== null || el.getClientRects().length > 0);
    };

    // initial focus on first field in the dialog
    requestAnimationFrame(() => {
      const list = focusables();
      const target = list.find(el => el.tagName === "INPUT" || el.tagName === "SELECT") ?? list[0];
      target?.focus();
    });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.stopPropagation(); onClose(); return; }
      if (e.key !== "Tab") return;
      const list = focusables();
      if (list.length === 0) return;
      const first = list[0];
      const last = list[list.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && active === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  // Refocus first field / error on step change
  useEffect(() => {
    requestAnimationFrame(() => {
      const root = dialogRef.current;
      if (!root) return;
      const firstError = root.querySelector<HTMLElement>('[aria-invalid="true"]');
      const firstField = root.querySelector<HTMLElement>('[data-step-first="true"]');
      (firstError ?? firstField)?.focus();
    });
  }, [step]);

  // Load loan tiers for live eligibility
  useEffect(() => {
    let cancelled = false;
    supabase
      .from("loan_tiers")
      .select("id,name,min_amount,max_amount,min_term_months,max_term_months,interest_rate")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .then(({ data }) => { if (!cancelled && data) setTiers(data as Tier[]); });
    return () => { cancelled = true; };
  }, []);

  const update = <K extends keyof Form>(k: K, v: Form[K]) => setForm(f => ({ ...f, [k]: v }));

  const validate = (s: number) => {
    const e: Record<string, string> = {};
    if (s === 1) {
      if (!form.firstName.trim()) e.firstName = "First name is required";
      if (!form.lastName.trim()) e.lastName = "Last name is required";
      if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email address";
      if (!/^[+\d\s()-]{7,}$/.test(form.phone)) e.phone = "Enter a valid phone number";
    }
    if (s === 2) {
      if (!form.employment) e.employment = "Select your employment status";
      if (!form.purpose) e.purpose = "Select a loan purpose";
    }
    if (s === 3) {
      if (!form.idFront) e.idFront = "Upload the front of your ID";
      if (!form.idBack) e.idBack = "Upload the back of your ID";
      if (!form.selfie) e.selfie = "Upload a selfie for identity check";
      if (!form.consent) e.consent = "You must consent to identity verification";
    }
    if (s === 4) {
      if (!form.provider) e.provider = "Choose a mobile money provider";
      if (!/^\+?\d[\d\s-]{7,}$/.test(form.mobileNumber)) e.mobileNumber = "Enter a valid mobile money number";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate(step)) setStep(s => Math.min(TOTAL_STEPS, s + 1)); };
  const back = () => setStep(s => Math.max(1, s - 1));

  const uploadOne = async (file: File, appId: string, tag: string) => {
    const ext = file.name.split(".").pop() || "bin";
    const path = `${appId}/${tag}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("application-uploads")
      .upload(path, file, { contentType: file.type, upsert: false });
    if (error) throw error;
    return path;
  };

  const submit = async () => {
    setSubmitError(null);
    setStatus("processing");
    try {
      const appId = crypto.randomUUID();
      const [idFrontPath, idBackPath, selfiePath] = await Promise.all([
        uploadOne(form.idFront!, appId, "id-front"),
        uploadOne(form.idBack!, appId, "id-back"),
        uploadOne(form.selfie!, appId, "selfie"),
      ]);
      const { error } = await supabase.from("loan_applications").insert({
        id: appId,
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
        phone: form.phone,
        amount: loan.amount,
        term_months: loan.term,
        rate: loan.rate,
        monthly_payment: Math.round(loan.monthly * 100) / 100,
        monthly_income: form.income,
        employment: form.employment,
        purpose: form.purpose,
        id_front_path: idFrontPath,
        id_back_path: idBackPath,
        selfie_path: selfiePath,
        mobile_provider: form.provider,
        mobile_number: form.mobileNumber,
      });
      if (error) throw error;
      setStatus("done");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setSubmitError(msg);
      setStatus("idle");
    }
  };

  const eligibleTiers = useMemo(() => {
    return tiers.map(t => {
      const reasons: string[] = [];
      if (loan.amount < t.min_amount) reasons.push(`Increase amount to ≥ ${money(t.min_amount)}`);
      if (loan.amount > t.max_amount) reasons.push(`Reduce amount to ≤ ${money(t.max_amount)}`);
      if (loan.term < t.min_term_months) reasons.push(`Term ≥ ${t.min_term_months} mo`);
      if (loan.term > t.max_term_months) reasons.push(`Term ≤ ${t.max_term_months} mo`);
      return { ...t, eligible: reasons.length === 0, reasons };
    });
  }, [tiers, loan.amount, loan.term]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} aria-hidden="true" />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        aria-describedby={descId}
        className="relative w-full max-w-3xl overflow-hidden rounded-t-3xl sm:rounded-3xl glass p-0 shadow-2xl rise"
      >
        <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
          <div>
            <div id={descId} className="text-xs uppercase tracking-widest text-indigo-400">Application</div>
            <h2 id={headingId} className="text-lg font-semibold">
              Step {status === "done" ? TOTAL_STEPS : step} of {TOTAL_STEPS} · {STEP_TITLES[(status === "done" ? TOTAL_STEPS : step) - 1]}
            </h2>
          </div>
          <button onClick={onClose} aria-label="Close application" className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 hover:bg-white/10">
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="px-6 pt-4">
          <div
            className="h-1.5 w-full overflow-hidden rounded-full bg-white/10"
            role="progressbar"
            aria-valuemin={0} aria-valuemax={TOTAL_STEPS}
            aria-valuenow={status === "done" ? TOTAL_STEPS : step}
            aria-label="Application progress"
          >
            <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500"
                 style={{ width: `${(status === "done" ? TOTAL_STEPS : step) / TOTAL_STEPS * 100}%` }} />
          </div>
        </div>

        {/* Live eligibility banner */}
        {status === "idle" && tiers.length > 0 && (
          <div className="mx-6 mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
                Live eligibility · {money(loan.amount)} / {loan.term} mo
              </div>
              <div className="text-xs text-[color:var(--color-muted)]" aria-live="polite">
                {eligibleTiers.filter(t => t.eligible).length} of {eligibleTiers.length} tiers match
              </div>
            </div>
            <ul className="mt-3 flex flex-wrap gap-2" role="list">
              {eligibleTiers.map(t => (
                <li key={t.id}
                  title={t.eligible ? `Eligible — ${t.interest_rate}% APR` : t.reasons.join(" · ")}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs",
                    t.eligible
                      ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-300"
                      : "border-white/10 bg-white/5 text-white/50",
                  )}
                >
                  {t.eligible ? <Check className="h-3 w-3" aria-hidden="true" /> : <AlertCircle className="h-3 w-3" aria-hidden="true" />}
                  {t.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        {submitError && (
          <div role="alert" className="mx-6 mt-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {submitError}
          </div>
        )}

        <div className="max-h-[60vh] overflow-y-auto px-6 py-6">
          {status === "processing" && <ProcessingView />}
          {status === "done" && <SuccessView onClose={onClose} />}

          {status === "idle" && step === 1 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="firstName" label="First name" icon={<User className="h-4 w-4" />} error={errors.firstName}>
                <input id="firstName" data-step-first="true" value={form.firstName}
                  onChange={e => update("firstName", e.target.value)}
                  className={inputCls(errors.firstName)} placeholder="Jane"
                  aria-invalid={!!errors.firstName} aria-describedby={errors.firstName ? "firstName-err" : undefined}
                  autoComplete="given-name" />
              </Field>
              <Field id="lastName" label="Last name" icon={<User className="h-4 w-4" />} error={errors.lastName}>
                <input id="lastName" value={form.lastName}
                  onChange={e => update("lastName", e.target.value)}
                  className={inputCls(errors.lastName)} placeholder="Doe"
                  aria-invalid={!!errors.lastName} aria-describedby={errors.lastName ? "lastName-err" : undefined}
                  autoComplete="family-name" />
              </Field>
              <Field id="email" label="Email" icon={<Mail className="h-4 w-4" />} error={errors.email} full>
                <input id="email" type="email" value={form.email}
                  onChange={e => update("email", e.target.value)}
                  className={inputCls(errors.email)} placeholder="jane@example.com"
                  aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-err" : undefined}
                  autoComplete="email" inputMode="email" />
              </Field>
              <Field id="phone" label="Phone" icon={<Phone className="h-4 w-4" />} error={errors.phone} full>
                <input id="phone" value={form.phone}
                  onChange={e => update("phone", e.target.value)}
                  className={inputCls(errors.phone)} placeholder="+260 97 000 1234"
                  aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "phone-err" : undefined}
                  autoComplete="tel" inputMode="tel" />
              </Field>
            </div>
          )}

          {status === "idle" && step === 2 && (
            <div className="space-y-6">
              <div>
                <div className="flex items-baseline justify-between">
                  <label htmlFor="income" className="text-sm text-[color:var(--color-muted)]">Monthly income</label>
                  <span className="text-lg font-semibold tabular-nums">{money(form.income)}</span>
                </div>
                <input id="income" data-step-first="true" type="range" min={1000} max={30000} step={500} value={form.income}
                  onChange={e => update("income", Number(e.target.value))}
                  className="slider mt-3"
                  aria-valuemin={1000} aria-valuemax={30000} aria-valuenow={form.income}
                  style={{ ["--val" as string]: `${((form.income - 1000) / 29000) * 100}%` }}
                />
              </div>
              <Field id="employment" label="Employment status" icon={<Briefcase className="h-4 w-4" />} error={errors.employment} full>
                <select id="employment" value={form.employment} onChange={e => update("employment", e.target.value)}
                  className={inputCls(errors.employment)}
                  aria-invalid={!!errors.employment} aria-describedby={errors.employment ? "employment-err" : undefined}>
                  <option value="">Select…</option>
                  <option>Employed</option><option>Self-Employed</option>
                  <option>Freelancer</option><option>Student</option>
                </select>
              </Field>
              <Field id="purpose" label="Purpose of loan" icon={<DollarSign className="h-4 w-4" />} error={errors.purpose} full>
                <select id="purpose" value={form.purpose} onChange={e => update("purpose", e.target.value)}
                  className={inputCls(errors.purpose)}
                  aria-invalid={!!errors.purpose} aria-describedby={errors.purpose ? "purpose-err" : undefined}>
                  <option value="">Select…</option>
                  <option>Debt Consolidation</option><option>Business</option>
                  <option>Home Improvement</option><option>Emergency</option>
                </select>
              </Field>
            </div>
          )}

          {status === "idle" && step === 3 && (
            <div className="space-y-4">
              <FileDrop id="idFront" label="ID — front" file={form.idFront}
                onFile={f => update("idFront", f)} error={errors.idFront} first />
              <FileDrop id="idBack" label="ID — back" file={form.idBack}
                onFile={f => update("idBack", f)} error={errors.idBack} />
              <FileDrop id="selfie" label="Selfie" file={form.selfie}
                onFile={f => update("selfie", f)} error={errors.selfie} />
              <label className="flex items-start gap-3 text-sm">
                <input type="checkbox" checked={form.consent} onChange={e => update("consent", e.target.checked)}
                  aria-invalid={!!errors.consent} aria-describedby={errors.consent ? "consent-err" : undefined}
                  className="mt-1 h-4 w-4 rounded border-white/20 accent-indigo-500" />
                <span className="text-[color:var(--color-muted)]">
                  I consent to Lendflow verifying my identity and reviewing my credit profile.
                </span>
              </label>
              {errors.consent && <p id="consent-err" role="alert" className="text-sm text-red-400">{errors.consent}</p>}
            </div>
          )}

          {status === "idle" && step === 4 && (
            <div className="space-y-5">
              <fieldset>
                <legend className="mb-2 text-xs font-medium uppercase tracking-widest text-[color:var(--color-muted)]">
                  Mobile money provider
                </legend>
                <div className="grid gap-3 sm:grid-cols-3" role="radiogroup"
                  aria-invalid={!!errors.provider} aria-describedby={errors.provider ? "provider-err" : undefined}>
                  {(["M-Pesa", "MTN MoMo", "Airtel Money"] as const).map((p, i) => (
                    <label key={p} className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition",
                      form.provider === p
                        ? "border-indigo-400/60 bg-indigo-500/10"
                        : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]",
                    )}>
                      <input type="radio" name="provider" value={p}
                        data-step-first={i === 0 ? "true" : undefined}
                        checked={form.provider === p}
                        onChange={() => update("provider", p)}
                        className="sr-only" />
                      <Smartphone className="h-4 w-4 text-indigo-400" aria-hidden="true" />
                      <span className="font-medium">{p}</span>
                    </label>
                  ))}
                </div>
                {errors.provider && <p id="provider-err" role="alert" className="mt-2 text-sm text-red-400">{errors.provider}</p>}
              </fieldset>
              <Field id="mobileNumber" label="Mobile money number" icon={<Phone className="h-4 w-4" />} error={errors.mobileNumber} full>
                <input id="mobileNumber" value={form.mobileNumber}
                  onChange={e => update("mobileNumber", e.target.value)}
                  className={inputCls(errors.mobileNumber)} placeholder="+260 97 000 1234"
                  aria-invalid={!!errors.mobileNumber} aria-describedby={errors.mobileNumber ? "mobileNumber-err" : undefined}
                  autoComplete="tel" inputMode="tel" />
              </Field>
              <p className="text-xs text-[color:var(--color-muted)]">
                Repayments and disbursements will use this number. You'll approve each transaction with a prompt on your phone.
              </p>
            </div>
          )}

          {status === "idle" && step === 5 && (
            <div className="space-y-6">
              <div className="glass p-5">
                <div className="text-xs uppercase tracking-widest text-indigo-400">Your Lendflow loan</div>
                <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <ReviewItem label="Amount" value={money(loan.amount)} />
                  <ReviewItem label="Term" value={`${loan.term} mo`} />
                  <ReviewItem label="Rate" value={`${loan.rate}%`} />
                  <ReviewItem label="Monthly" value={money(loan.monthly)} />
                </div>
              </div>
              <div className="glass p-5">
                <div className="text-xs uppercase tracking-widest text-indigo-400">Applicant</div>
                <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                  <ReviewItem label="Name" value={`${form.firstName} ${form.lastName}`} />
                  <ReviewItem label="Email" value={form.email} />
                  <ReviewItem label="Phone" value={form.phone} />
                  <ReviewItem label="Income" value={money(form.income) + "/mo"} />
                  <ReviewItem label="Employment" value={form.employment} />
                  <ReviewItem label="Purpose" value={form.purpose} />
                </div>
              </div>
              <div className="glass p-5">
                <div className="text-xs uppercase tracking-widest text-indigo-400">Payment</div>
                <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                  <ReviewItem label="Provider" value={form.provider} />
                  <ReviewItem label="Mobile number" value={form.mobileNumber} />
                </div>
              </div>
            </div>
          )}
        </div>

        {status === "idle" && (
          <div className="flex items-center justify-between border-t border-white/5 px-6 py-4">
            <button onClick={back} disabled={step === 1}
              className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/80 transition hover:bg-white/10 disabled:opacity-40">
              Back
            </button>
            {step < TOTAL_STEPS ? (
              <button onClick={next}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-400 hover:to-violet-400">
                Continue <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            ) : (
              <button onClick={submit}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-400">
                Submit application <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function FileDrop({ id, label, file, onFile, error, first }: {
  id: string; label: string; file: File | null;
  onFile: (f: File | null) => void; error?: string; first?: boolean;
}) {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const errId = error ? `${id}-err` : undefined;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-[color:var(--color-muted)]">
        <Upload className="h-3.5 w-3.5" aria-hidden="true" />{label}
      </label>
      <div
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={e => {
          e.preventDefault(); setDrag(false);
          const f = e.dataTransfer.files?.[0]; if (f) onFile(f);
        }}
        onClick={() => inputRef.current?.click()}
        onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); inputRef.current?.click(); } }}
        role="button" tabIndex={0}
        aria-describedby={errId}
        className={cn(
          "flex cursor-pointer items-center justify-between rounded-2xl border-2 border-dashed px-4 py-4 text-sm transition focus:outline-none focus:ring-2 focus:ring-indigo-400/40",
          error ? "border-red-500/60 bg-red-500/5"
            : drag ? "border-indigo-400/70 bg-indigo-500/10"
            : "border-white/15 bg-white/[0.03] hover:bg-white/[0.06]",
        )}
      >
        <div className="flex items-center gap-3">
          <Upload className="h-5 w-5 text-indigo-400" aria-hidden="true" />
          <div>
            <div className="font-medium">{file ? file.name : "Drop file or click to browse"}</div>
            <div className="text-xs text-[color:var(--color-muted)]">
              {file ? `${(file.size / 1024).toFixed(0)} KB` : "PNG, JPG, or PDF up to 10MB"}
            </div>
          </div>
        </div>
        {file && <Check className="h-5 w-5 text-emerald-400" aria-hidden="true" />}
      </div>
      <input ref={inputRef} id={id} data-step-first={first ? "true" : undefined}
        type="file" className="sr-only" accept="image/*,.pdf"
        aria-invalid={!!error} aria-describedby={errId}
        onChange={e => onFile(e.target.files?.[0] || null)} />
      {error && <p id={errId} role="alert" className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

function ProcessingView() {
  return (
    <div className="flex flex-col items-center justify-center py-16" role="status" aria-live="polite">
      <Loader className="h-12 w-12 text-indigo-400 spin" aria-hidden="true" />
      <div className="mt-6 text-lg font-semibold">Submitting your application…</div>
      <div className="mt-1 text-sm text-[color:var(--color-muted)]">Uploading documents and preparing your file</div>
    </div>
  );
}

function SuccessView({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-center" role="status" aria-live="polite">
      <div className="grid h-16 w-16 place-items-center rounded-full bg-emerald-500/15 ring-2 ring-emerald-500/40">
        <svg viewBox="0 0 24 24" className="h-8 w-8 text-emerald-400" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path className="check-path" d="M4 12l5 5 11-11" />
        </svg>
      </div>
      <div className="mt-5 text-2xl font-bold">Application submitted!</div>
      <p className="mt-2 max-w-sm text-sm text-[color:var(--color-muted)]">
        We're reviewing your details and identity documents. You'll receive an update and a mobile money prompt within 24 hours.
      </p>
      <button onClick={onClose}
        className="mt-6 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-400 hover:to-violet-400">
        Back to Lendflow
      </button>
    </div>
  );
}

function Field({ id, label, icon, error, children, full }: { id?: string; label: string; icon?: React.ReactNode; error?: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={cn(full && "sm:col-span-2")}>
      <label htmlFor={id} className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-[color:var(--color-muted)]">
        {icon}{label}
      </label>
      {children}
      {error && <p id={id ? `${id}-err` : undefined} role="alert" className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-[color:var(--color-muted)]">{label}</div>
      <div className="mt-0.5 font-semibold">{value || "—"}</div>
    </div>
  );
}

function inputCls(error?: string) {
  return cn(
    "w-full rounded-xl border bg-white/[0.03] px-3.5 py-3 text-sm outline-none transition placeholder:text-white/30",
    "focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-400/20",
    error ? "border-red-500/60 ring-2 ring-red-500/20" : "border-white/10",
  );
}

/* ---------------- Data ---------------- */
const faqs = [
  { q: "How fast do I get funds?", a: "Most approved borrowers receive funds within 24 hours of signing their agreement — many the same day." },
  { q: "What are the eligibility criteria?", a: "You must be 18+, a legal resident, have a steady income, and a bank account. A soft credit check confirms your rate without affecting your score." },
  { q: "Can I pay off my loan early?", a: "Yes. Lendflow never charges prepayment penalties. Pay any amount, any time, right from the app." },
  { q: "Are there any hidden fees?", a: "No. What you see in the calculator is what you pay. No origination or servicing fees, ever." },
];

const partners = ["NORTHBANK", "MERIDIAN", "APEX CAPITAL", "SILVERLINE", "HORIZON", "OAKRIDGE", "PRIMEBANK"];

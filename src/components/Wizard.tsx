import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, User, Mail, Phone, Smartphone, CheckCircle2, Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import { currentUser, money, saveApplication, computeLoan, INTEREST_LABEL, type Application } from "@/lib/demo-auth";

export type LoanCtx = { amount: number; term: number; pct: number; serviceFee: number; monthly: number };

/* ---------------- Wizard ---------------- */
type Form = {
  firstName: string; lastName: string; email: string; phone: string;
  purpose: string; provider: string; msisdn: string; consent: boolean;
};

export function Wizard({ onClose, loan }: { onClose: () => void; loan: LoanCtx }) {
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
      if (!form.consent) e.consent = "You must authorise the service fee payment";
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
      serviceFeePct: loan.pct, serviceFee: loan.serviceFee,
      provider: form.provider, msisdn: form.msisdn, purpose: form.purpose,
      status: "under_review", createdAt: new Date().toISOString(),
    };
    setTimeout(() => { saveApplication(app); setStatus("done"); }, 1800);
  };

  const stepTitle = ["Your details", "Loan purpose", "Service fee payment", "Review & submit"][step - 1];

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
            <SuccessView serviceFee={loan.serviceFee} onDashboard={() => { onClose(); navigate({ to: "/dashboard" }); }} />
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
                  <ReviewItem label="Interest" value={INTEREST_LABEL} />
                </div>
              </div>
              <Breakdown loan={loan} />
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
                <div className="text-xs font-bold uppercase tracking-widest text-[color:var(--color-leaf-dark)]">Service fee due now</div>
                <div className="mt-1 text-3xl font-black">{money(loan.serviceFee)}</div>
                <p className="mt-1 text-xs text-[color:var(--color-muted)]">
                  {loan.pct}% of {money(loan.amount)}, paid once up front. Your loan then carries a flat {INTEREST_LABEL} interest — you repay {money(computeLoan(loan.amount, loan.pct, loan.term).totalRepayment)} in total.
                </p>
              </div>
              <Breakdown loan={loan} />

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
                  I authorise LendFlow Africa to collect the {money(loan.serviceFee)} service fee from this wallet, refundable if declined.
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
                  <ReviewItem label="Interest" value="2.5%" />
                  <ReviewItem label="Service fee" value={`${money(loan.serviceFee)} (${loan.pct}%)`} />
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
                Pay service fee & submit <CheckCircle2 className="h-4 w-4" />
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
      <div className="mt-6 text-lg font-bold">Collecting your service fee…</div>
      <div className="mt-1 text-sm text-[color:var(--color-muted)]">Approve the prompt on your phone</div>
    </div>
  );
}

function SuccessView({ serviceFee, onDashboard }: { serviceFee: number; onDashboard: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-full bg-[color:var(--color-mint)] ring-2 ring-[color:var(--color-leaf)]/50">
        <svg viewBox="0 0 24 24" className="h-8 w-8 text-[color:var(--color-leaf-dark)]" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
          <path className="check-path" d="M4 12l5 5 11-11" />
        </svg>
      </div>
      <div className="mt-5 text-2xl font-black">Service fee of {money(serviceFee)} received!</div>
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

function Breakdown({ loan }: { loan: LoanCtx }) {
  const b = computeLoan(loan.amount, loan.pct, loan.term);
  return (
    <dl className="space-y-2 rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-sky)]/60 p-4 text-sm">
      <div className="flex items-center justify-between gap-3">
        <dt className="text-[color:var(--color-muted)]">Principal</dt>
        <dd className="font-bold tabular-nums">{money(b.principal)}</dd>
      </div>
      <div className="flex items-center justify-between gap-3">
        <dt className="text-[color:var(--color-muted)]">Interest ({INTEREST_LABEL} flat)</dt>
        <dd className="font-bold tabular-nums">{money(b.interest)}</dd>
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-[color:var(--color-line)] pt-2">
        <dt className="font-bold">Total repayment</dt>
        <dd className="font-black tabular-nums">{money(b.totalRepayment)}</dd>
      </div>
      <div className="flex items-center justify-between gap-3">
        <dt className="text-[color:var(--color-muted)]">Service fee ({loan.pct}%, paid up front)</dt>
        <dd className="font-bold tabular-nums">{money(b.serviceFee)}</dd>
      </div>
    </dl>
  );
}

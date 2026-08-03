import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, User, Mail, Phone, Smartphone, CheckCircle2, Loader, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { money, computeLoan } from "@/lib/demo-auth";
import { useAccount, useKycStatus } from "@/lib/session";
import { submitApplication } from "@/lib/lending.functions";
import { LOAN_PRODUCTS, getProduct, fitToProduct, DEFAULT_PRODUCT_ID } from "@/lib/loan-products";


export type LoanCtx = {
  amount: number; term: number; pct: number; serviceFee: number; monthly: number;
  productId?: string;
};

/* ---------------- Wizard ---------------- */
type Form = {
  firstName: string; lastName: string; email: string; phone: string;
  productId: string; provider: string; msisdn: string; consent: boolean;
  eligibility: boolean;
};

export function Wizard({ onClose, loan }: { onClose: () => void; loan: LoanCtx }) {
  const navigate = useNavigate();
  const { account: user } = useAccount();
  const kyc = useKycStatus();
  const verified = kyc === "approved";
  const send = useServerFn(submitApplication);
  const [submitError, setSubmitError] = useState("");
  const [step, setStep] = useState(1);

  const [form, setForm] = useState<Form>({
    firstName: user?.name.split(" ")[0] ?? "", lastName: user?.name.split(" ")[1] ?? "",
    email: user?.email ?? "", phone: user?.phone ?? "",
    productId: loan.productId ?? DEFAULT_PRODUCT_ID,
    provider: "", msisdn: "", consent: false, eligibility: false,
  });
  const product = getProduct(form.productId);
  const [amount, setAmount] = useState(() => fitToProduct(product, loan.amount, loan.term).amount);
  const [term, setTerm] = useState(() => fitToProduct(product, loan.amount, loan.term).term);

  // Keep the requested amount/term inside the selected product's lending rules.
  useEffect(() => {
    const fit = fitToProduct(product, amount, term);
    if (fit.amount !== amount) setAmount(fit.amount);
    if (fit.term !== term) setTerm(fit.term);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  const calc = computeLoan(amount, product.serviceFeePct, term, product.interestRate);
  const L = {
    amount, term, pct: product.serviceFeePct, serviceFee: calc.serviceFee,
    monthly: calc.monthly, interest: calc.interest, total: calc.totalRepayment, rate: product.interestRate,
    rateLabel: (product.interestRate * 100).toFixed(1).replace(/\.0$/, "") + "%",
  };
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "processing" | "done">("idle");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);

  // Prefill from the signed-in account once the session resolves.
  useEffect(() => {
    if (!user) return;
    setForm(f => ({
      ...f,
      firstName: f.firstName || (user.name.split(" ")[0] ?? ""),
      lastName: f.lastName || (user.name.split(" ")[1] ?? ""),
      email: f.email || user.email,
      phone: f.phone || (user.phone ?? ""),
    }));
  }, [user]);

  const update = <K extends keyof Form>(k: K, v: Form[K]) => setForm(f => ({ ...f, [k]: v }));

  const validate = (s: number) => {
    const e: Record<string, string> = {};
    if (s === 1) {
      if (!form.firstName.trim()) e.firstName = "Required";
      if (!form.lastName.trim()) e.lastName = "Required";
      if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Valid email required";
      if (!/^[+\d\s()-]{7,}$/.test(form.phone)) e.phone = "Valid phone required";
      if (!form.productId) e.productId = "Please select a service";
      else if (product.soon) e.productId = `${product.title} is not lending yet — pick another service`;
    }
    if (s === 2) {
      if (!form.productId) e.productId = "Please select a service";
      if (product.soon) e.productId = `${product.title} is not lending yet — pick another service`;
      if (amount < product.minAmount || amount > product.maxAmount)
        e.amount = `${product.title}: ${money(product.minAmount)} – ${money(product.maxAmount)}`;
      if (term < product.minTerm || term > product.maxTerm)
        e.term = `${product.title}: ${product.minTerm} – ${product.maxTerm} months`;
      if (!verified) e.eligibility = "Verify your identity before applying";
      else if (!form.eligibility) e.eligibility = "Please confirm you meet the requirements";

    }
    if (s === 3) {
      if (!form.provider) e.provider = "Choose a mobile money provider";
      if (!/^[+\d\s()-]{7,}$/.test(form.msisdn)) e.msisdn = "Valid mobile money number required";
      if (!form.consent) e.consent = "You must authorise the service fee payment";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /** Snap the requested figures onto the selected product's rules. */
  const clampToProduct = () => {
    const fit = fitToProduct(product, amount, term);
    if (fit.amount !== amount) setAmount(fit.amount);
    if (fit.term !== term) setTerm(fit.term);
  };

  const next = () => {
    if (step === 1) clampToProduct();
    if (!validate(step)) return;
    if (step === 2) clampToProduct();
    setStep(s => Math.min(4, s + 1));
  };
  const back = () => setStep(s => Math.max(1, s - 1));

  const submit = async () => {
    setStatus("processing");
    setSubmitError("");
    try {
      await send({
        data: {
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim().toLowerCase(),
          phone: form.phone.trim(),
          productId: product.id,
          productTitle: product.title,
          amount: L.amount,
          term: L.term,
          serviceFeePct: L.pct,
          serviceFee: L.serviceFee,
          interestRate: product.interestRate,
          monthly: Math.round(L.monthly),
          provider: form.provider,
          msisdn: form.msisdn.trim(),
          purpose: product.title,
        },
      });
      setStatus("done");
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "We could not submit your application. Please try again.");
      setStatus("idle");
      setStep(4);
    }
  };


  const stepTitle = ["Your details & service", "Amount & terms", "Service fee payment", "Review & submit"][step - 1];

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
            <SuccessView serviceFee={L.serviceFee} onDashboard={() => { onClose(); navigate({ to: "/dashboard" }); }} />
          )}

          {status === "idle" && step === 1 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label="Service you are applying for" error={errors.productId} full>
                  <select aria-label="Service" value={form.productId} onChange={e => update("productId", e.target.value)} className={inputCls(errors.productId)}>
                    {LOAN_PRODUCTS.map(p => (
                      <option key={p.id} value={p.id} disabled={p.soon}>
                        {p.title}{p.soon ? " (coming soon)" : ` · ${p.serviceFeePct}% service fee`}
                      </option>
                    ))}
                  </select>
                </Field>
                <div className="mt-4 rounded-2xl bg-[color:var(--color-mint)] p-5">
                  <div className="text-sm font-bold text-[color:var(--color-navy)]">{product.title} rules</div>
                  <div className="mt-3 grid grid-cols-3 gap-3">
                    <ReviewItem label="Amount range" value={`${money(product.minAmount)} – ${money(product.maxAmount)}`} />
                    <ReviewItem label="Term range" value={`${product.minTerm} – ${product.maxTerm} mo`} />
                    <ReviewItem label="Service fee" value={`${product.serviceFeePct}%`} />
                  </div>
                </div>
              </div>
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
              <Field label="Service" error={errors.productId} full>
                <select value={form.productId} onChange={e => update("productId", e.target.value)} className={inputCls(errors.productId)}>
                  {LOAN_PRODUCTS.map(p => (
                    <option key={p.id} value={p.id} disabled={p.soon}>
                      {p.title}{p.soon ? " (coming soon)" : ` · ${p.serviceFeePct}% service fee`}
                    </option>
                  ))}
                </select>
              </Field>

              <div className="rounded-2xl bg-[color:var(--color-mint)] p-5">
                <div className="text-sm font-bold text-[color:var(--color-navy)]">{product.title} rules</div>
                <div className="mt-3 grid grid-cols-3 gap-3">
                  <ReviewItem label="Amount range" value={`${money(product.minAmount)} – ${money(product.maxAmount)}`} />
                  <ReviewItem label="Term range" value={`${product.minTerm} – ${product.maxTerm} mo`} />
                  <ReviewItem label="Service fee" value={`${product.serviceFeePct}%`} />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Loan amount" error={errors.amount}>
                  <input type="number" inputMode="numeric" value={amount} min={product.minAmount} max={product.maxAmount}
                    onChange={e => setAmount(Number(e.target.value))}
                    onBlur={() => setAmount(a => fitToProduct(product, a, term).amount)}
                    className={inputCls(errors.amount)} />
                </Field>
                <Field label="Term (months)" error={errors.term}>
                  <input type="number" inputMode="numeric" value={term} min={product.minTerm} max={product.maxTerm}
                    onChange={e => setTerm(Number(e.target.value))}
                    onBlur={() => setTerm(t => fitToProduct(product, amount, t).term)}
                    className={inputCls(errors.term)} />
                </Field>
              </div>

              <Breakdown loan={L} />

              <div data-testid="eligibility-block" className="rounded-2xl border border-[color:var(--color-line)] p-5">
                <div className="text-xs font-bold uppercase tracking-widest text-[color:var(--color-leaf-dark)]">
                  {product.title} eligibility
                </div>
                <ul className="mt-3 space-y-2 text-sm text-[color:var(--color-muted)]">
                  {product.eligibility.map(r => (
                    <li key={r} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--color-leaf)]" /> {r}
                    </li>
                  ))}
                </ul>

                <div
                  data-testid="kyc-gate"
                  data-verified={verified ? "true" : "false"}
                  className={cn(
                    "mt-4 flex flex-wrap items-center gap-3 rounded-xl px-4 py-3 text-sm",
                    verified ? "bg-[color:var(--color-mint)] text-[color:var(--color-leaf-dark)]" : "bg-amber-50 text-amber-800",
                  )}
                >
                  <ShieldCheck className="h-4 w-4 shrink-0" />
                  <span className="min-w-0 flex-1 font-semibold">
                    {verified
                      ? "Identity verified — you can confirm eligibility."
                      : kyc === "signed_out"
                        ? "Sign in and verify your identity to continue."
                        : `Identity verification ${kyc ?? "loading"} — required before you can apply.`}
                  </span>
                  {!verified && (
                    <Link to={kyc === "signed_out" ? "/auth" : "/kyc"} onClick={onClose}
                      className="btn-navy rounded-full px-4 py-2 text-xs font-bold">
                      {kyc === "signed_out" ? "Sign in" : "Verify identity"}
                    </Link>
                  )}
                </div>

                <label className={cn("mt-4 flex items-start gap-3 text-sm", !verified && "opacity-50")}>
                  <input type="checkbox" disabled={!verified} checked={form.eligibility}
                    onChange={e => update("eligibility", e.target.checked)}
                    className="mt-1 h-4 w-4 accent-[color:var(--color-leaf)]" />
                  <span className="text-[color:var(--color-muted)]">I confirm I meet these {product.title.toLowerCase()} requirements.</span>
                </label>
                {errors.eligibility && <p className="mt-1 field-error text-xs font-semibold text-red-600">{errors.eligibility}</p>}
              </div>

            </div>
          )}

          {status === "idle" && step === 3 && (
            <div className="space-y-5">
              <div className="rounded-2xl border border-[color:var(--color-leaf)]/40 bg-[color:var(--color-mint)] p-5">
                <div className="text-xs font-bold uppercase tracking-widest text-[color:var(--color-leaf-dark)]">Service fee due now</div>
                <div className="mt-1 text-3xl font-black">{money(L.serviceFee)}</div>
                <p className="mt-1 text-xs text-[color:var(--color-muted)]">
                  {L.pct}% of {money(L.amount)} for your {product.title.toLowerCase()}, paid once up front. Your loan then carries a flat {L.rateLabel} interest — you repay {money(L.total)} in total.
                </p>
              </div>
              <Breakdown loan={L} />

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
                  I authorise LendFlow Africa to collect the {money(L.serviceFee)} service fee from this wallet, refundable if declined.
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
                  <div data-testid="review-amount"><ReviewItem label="Amount" value={money(L.amount)} /></div>
                  <ReviewItem label="Term" value={`${L.term} mo`} />
                  <div data-testid="review-interest"><ReviewItem label="Interest" value={L.rateLabel} /></div>
                  <div data-testid="review-fee"><ReviewItem label="Service fee" value={`${money(L.serviceFee)} (${L.pct}%)`} /></div>
                </div>
              </div>
              <div className="card p-5">
                <div className="text-xs font-bold uppercase tracking-widest text-[color:var(--color-leaf-dark)]">Applicant</div>
                <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                  <ReviewItem label="Name" value={`${form.firstName} ${form.lastName}`} />
                  <ReviewItem label="Email" value={form.email} />
                  <ReviewItem label="Phone" value={form.phone} />
                  <div data-testid="review-service"><ReviewItem label="Service" value={product.title} /></div>
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
      <p className="mt-4 rounded-2xl bg-[color:var(--color-mint)] px-5 py-3 text-sm font-bold text-[color:var(--color-navy)]">
        Need help? Call or WhatsApp us on{" "}
        <a href="tel:+254757860014" className="underline">+254757860014</a>
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

function Breakdown({ loan }: { loan: { amount: number; pct: number; term: number; rate?: number; rateLabel?: string } }) {
  const b = computeLoan(loan.amount, loan.pct, loan.term, loan.rate);
  return (
    <dl className="space-y-2 rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-sky)]/60 p-4 text-sm">
      <div className="flex items-center justify-between gap-3">
        <dt className="text-[color:var(--color-muted)]">Principal</dt>
        <dd className="font-bold tabular-nums">{money(b.principal)}</dd>
      </div>
      <div className="flex items-center justify-between gap-3">
        <dt className="text-[color:var(--color-muted)]">Interest ({loan.rateLabel ?? "2.5%"} flat)</dt>
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

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader, Plus, Save, ShieldAlert } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SiteNav, SiteFooter } from "@/components/SiteNav";
import { inputCls } from "@/components/Wizard";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Country Settings — LendFlow Africa Admin" },
      { name: "description", content: "Configure currency, loan limits, commitment ranges, eligibility rules and mobile money payment methods for each LendFlow country." },
      { property: "og:title", content: "LendFlow Africa Admin — Country Settings" },
      { property: "og:description", content: "Manage per-country lending configuration without code changes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminSettings,
});

type Eligibility = { min_age: number; require_kyc: boolean; max_active_loans: number; min_monthly_income: number };

type Country = {
  id: string;
  country_code: string;
  country_name: string;
  currency_code: string;
  currency_symbol: string;
  min_loan_amount: number;
  max_loan_amount: number;
  min_term_months: number;
  max_term_months: number;
  commitment_pct_min: number;
  commitment_pct_max: number;
  eligibility_rules: Eligibility;
  payment_methods: string[];
  is_active: boolean;
  sort_order: number;
};

const ALL_METHODS = ["MTN MoMo", "Airtel Money", "M-Pesa", "Orange Money", "Bank transfer"];

const blank = (): Country => ({
  id: "",
  country_code: "",
  country_name: "",
  currency_code: "",
  currency_symbol: "",
  min_loan_amount: 500,
  max_loan_amount: 50000,
  min_term_months: 3,
  max_term_months: 24,
  commitment_pct_min: 10,
  commitment_pct_max: 15,
  eligibility_rules: { min_age: 18, require_kyc: true, max_active_loans: 1, min_monthly_income: 0 },
  payment_methods: [],
  is_active: true,
  sort_order: 99,
});

function AdminSettings() {
  const [rows, setRows] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [draft, setDraft] = useState<Country | null>(null);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data: sess } = await supabase.auth.getSession();
    const uid = sess.session?.user.id ?? null;
    setSignedIn(Boolean(uid));
    if (uid) {
      const { data: admin } = await supabase.rpc("has_role", { _user_id: uid, _role: "admin" });
      setIsAdmin(Boolean(admin));
    }
    const { data } = await supabase.from("country_settings").select("*").order("sort_order");
    const list = ((data ?? []) as unknown as Country[]).map((r) => ({
      ...r,
      eligibility_rules: { ...blank().eligibility_rules, ...(r.eligibility_rules ?? {}) },
      payment_methods: Array.isArray(r.payment_methods) ? r.payment_methods : [],
    }));
    setRows(list);
    setSelected((s) => s ?? list[0]?.id ?? null);
    setDraft((d) => d ?? list[0] ?? null);
    setLoading(false);
  };

  useEffect(() => { void load(); }, []);

  const pick = (c: Country) => { setSelected(c.id); setDraft({ ...c }); setMsg(null); };

  const set = <K extends keyof Country>(k: K, v: Country[K]) =>
    setDraft((d) => (d ? { ...d, [k]: v } : d));

  const setRule = <K extends keyof Eligibility>(k: K, v: Eligibility[K]) =>
    setDraft((d) => (d ? { ...d, eligibility_rules: { ...d.eligibility_rules, [k]: v } } : d));

  const toggleMethod = (m: string) =>
    setDraft((d) =>
      d ? { ...d, payment_methods: d.payment_methods.includes(m) ? d.payment_methods.filter((x) => x !== m) : [...d.payment_methods, m] } : d,
    );

  const claimAdmin = async () => {
    const { data, error } = await supabase.rpc("claim_admin");
    if (error) setMsg({ kind: "err", text: error.message });
    else if (data) { setIsAdmin(true); setMsg({ kind: "ok", text: "You are now an admin." }); }
    else setMsg({ kind: "err", text: "An admin already exists — ask them to grant you access." });
  };

  const save = async () => {
    if (!draft) return;
    setSaving(true);
    setMsg(null);
    const payload = {
      country_code: draft.country_code.toUpperCase(),
      country_name: draft.country_name,
      currency_code: draft.currency_code.toUpperCase(),
      currency_symbol: draft.currency_symbol,
      min_loan_amount: Number(draft.min_loan_amount),
      max_loan_amount: Number(draft.max_loan_amount),
      min_term_months: Number(draft.min_term_months),
      max_term_months: Number(draft.max_term_months),
      commitment_pct_min: Number(draft.commitment_pct_min),
      commitment_pct_max: Number(draft.commitment_pct_max),
      eligibility_rules: draft.eligibility_rules,
      payment_methods: draft.payment_methods,
      is_active: draft.is_active,
      sort_order: Number(draft.sort_order),
    };
    const q = draft.id
      ? supabase.from("country_settings").update(payload).eq("id", draft.id)
      : supabase.from("country_settings").insert(payload);
    const { error } = await q;
    setSaving(false);
    if (error) { setMsg({ kind: "err", text: error.message }); return; }
    setMsg({ kind: "ok", text: "Settings saved." });
    await load();
  };

  return (
    <div className="min-h-screen">
      <SiteNav />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="text-3xl font-black tracking-tight">Country settings</h1>
        <p className="mt-2 text-sm text-[color:var(--color-muted)]">
          Currency, loan limits, commitment ranges, eligibility rules and payment methods — configurable per market, no code changes.
        </p>

        {!signedIn && (
          <div className="card mt-6 flex items-center gap-3 p-5 text-sm">
            <ShieldAlert className="h-5 w-5 text-[color:var(--color-leaf-dark)]" />
            Sign in with your account to edit country settings.
          </div>
        )}
        {signedIn && !isAdmin && (
          <div className="card mt-6 flex flex-wrap items-center gap-3 p-5 text-sm">
            <ShieldAlert className="h-5 w-5 text-[color:var(--color-leaf-dark)]" />
            <span>You are signed in but not an admin. Changes are read-only.</span>
            <button onClick={claimAdmin} className="btn-navy rounded-full px-4 py-2 text-xs font-bold">Claim admin (first user only)</button>
          </div>
        )}
        {msg && (
          <div className={cn("mt-4 rounded-xl px-4 py-3 text-sm font-semibold",
            msg.kind === "ok" ? "bg-[color:var(--color-mint)] text-[color:var(--color-leaf-dark)]" : "bg-red-50 text-red-700")}>
            {msg.text}
          </div>
        )}

        {loading ? (
          <div className="flex items-center gap-3 py-20 text-sm text-[color:var(--color-muted)]">
            <Loader className="spin h-5 w-5" /> Loading countries…
          </div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-[16rem_1fr]">
            <aside className="space-y-2">
              {rows.map((c) => (
                <button key={c.id} onClick={() => pick(c)}
                  className={cn("flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-bold transition",
                    selected === c.id
                      ? "border-[color:var(--color-leaf)] bg-[color:var(--color-mint)] text-[color:var(--color-leaf-dark)]"
                      : "border-[color:var(--color-line)] bg-white hover:bg-[color:var(--color-sky)]")}>
                  <span>{c.country_name}</span>
                  <span className="text-xs text-[color:var(--color-muted)]">{c.currency_code}</span>
                </button>
              ))}
              <button onClick={() => { setSelected(null); setDraft(blank()); setMsg(null); }}
                className="flex w-full items-center gap-2 rounded-xl border border-dashed border-[color:var(--color-line)] px-4 py-3 text-sm font-bold text-[color:var(--color-muted)] hover:bg-[color:var(--color-sky)]">
                <Plus className="h-4 w-4" /> Add country
              </button>
            </aside>

            {draft && (
              <section className="card p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <F label="Country name"><input className={inputCls()} value={draft.country_name} onChange={(e) => set("country_name", e.target.value)} /></F>
                  <F label="Country code"><input className={inputCls()} value={draft.country_code} onChange={(e) => set("country_code", e.target.value)} placeholder="ZM" /></F>
                  <F label="Currency code"><input className={inputCls()} value={draft.currency_code} onChange={(e) => set("currency_code", e.target.value)} placeholder="ZMW" /></F>
                  <F label="Currency symbol"><input className={inputCls()} value={draft.currency_symbol} onChange={(e) => set("currency_symbol", e.target.value)} placeholder="K" /></F>
                  <F label="Min loan amount"><Num v={draft.min_loan_amount} on={(v) => set("min_loan_amount", v)} /></F>
                  <F label="Max loan amount"><Num v={draft.max_loan_amount} on={(v) => set("max_loan_amount", v)} /></F>
                  <F label="Min term (months)"><Num v={draft.min_term_months} on={(v) => set("min_term_months", v)} /></F>
                  <F label="Max term (months)"><Num v={draft.max_term_months} on={(v) => set("max_term_months", v)} /></F>
                  <F label="Commitment % min"><Num v={draft.commitment_pct_min} on={(v) => set("commitment_pct_min", v)} /></F>
                  <F label="Commitment % max"><Num v={draft.commitment_pct_max} on={(v) => set("commitment_pct_max", v)} /></F>
                </div>

                <h2 className="mt-8 text-xs font-bold uppercase tracking-widest text-[color:var(--color-muted)]">Eligibility rules</h2>
                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  <F label="Minimum age"><Num v={draft.eligibility_rules.min_age} on={(v) => setRule("min_age", v)} /></F>
                  <F label="Max active loans"><Num v={draft.eligibility_rules.max_active_loans} on={(v) => setRule("max_active_loans", v)} /></F>
                  <F label="Min monthly income"><Num v={draft.eligibility_rules.min_monthly_income} on={(v) => setRule("min_monthly_income", v)} /></F>
                  <label className="flex items-center gap-2 self-end text-sm font-semibold">
                    <input type="checkbox" className="h-4 w-4 accent-[color:var(--color-leaf)]"
                      checked={draft.eligibility_rules.require_kyc}
                      onChange={(e) => setRule("require_kyc", e.target.checked)} />
                    Require verified KYC
                  </label>
                </div>

                <h2 className="mt-8 text-xs font-bold uppercase tracking-widest text-[color:var(--color-muted)]">Payment methods</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {ALL_METHODS.map((m) => (
                    <button key={m} type="button" onClick={() => toggleMethod(m)}
                      className={cn("rounded-full border px-4 py-2 text-sm font-bold transition",
                        draft.payment_methods.includes(m)
                          ? "border-[color:var(--color-leaf)] bg-[color:var(--color-mint)] text-[color:var(--color-leaf-dark)]"
                          : "border-[color:var(--color-line)] bg-white hover:bg-[color:var(--color-sky)]")}>
                      {m}
                    </button>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[color:var(--color-line)] pt-5">
                  <label className="flex items-center gap-2 text-sm font-semibold">
                    <input type="checkbox" className="h-4 w-4 accent-[color:var(--color-leaf)]"
                      checked={draft.is_active} onChange={(e) => set("is_active", e.target.checked)} />
                    Country is live
                  </label>
                  <button onClick={save} disabled={!isAdmin || saving}
                    className="btn-primary inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold disabled:opacity-40">
                    {saving ? <Loader className="spin h-4 w-4" /> : <Save className="h-4 w-4" />}
                    {draft.id ? "Save changes" : "Create country"}
                  </button>
                </div>
              </section>
            )}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-[color:var(--color-muted)]">{label}</label>
      {children}
    </div>
  );
}

function Num({ v, on }: { v: number; on: (v: number) => void }) {
  return <input type="number" className={inputCls()} value={v} onChange={(e) => on(Number(e.target.value))} />;
}

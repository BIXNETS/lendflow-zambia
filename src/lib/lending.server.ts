/**
 * Server-only lending ledger helpers.
 * Every money movement is written to `payment_transactions` and mirrored onto
 * the loan, so the borrower dashboard and the manager console reconcile against
 * the same rows.
 */
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export type NotifyRow = {
  user_id: string;
  kind: string;
  title: string;
  body: string;
  audience?: string;
  application_id?: string | null;
  loan_id?: string | null;
};

export async function notify(rows: NotifyRow[]) {
  if (!rows.length) return;
  await supabaseAdmin.from("notifications").insert(
    rows.map(r => ({
      user_id: r.user_id,
      kind: r.kind,
      title: r.title,
      body: r.body,
      audience: r.audience ?? "borrower",
      application_id: r.application_id ?? null,
      loan_id: r.loan_id ?? null,
    })),
  );
}

export async function adminUserIds(): Promise<string[]> {
  const { data } = await supabaseAdmin.from("user_roles").select("user_id").eq("role", "admin");
  return (data ?? []).map(r => r.user_id);
}

export async function recordTransaction(input: {
  provider: string;
  txType: "disbursement" | "repayment" | "commitment";
  status: "pending" | "succeeded" | "failed";
  amount: number;
  currency: string;
  msisdn?: string | null;
  loanId?: string | null;
  applicationId?: string | null;
  userId?: string | null;
  reference?: string;
}) {
  const provider_ref =
    input.reference ?? `LF-${input.txType.toUpperCase()}-${Date.now()}-${Math.floor(Math.random() * 9999)}`;
  const { data, error } = await supabaseAdmin
    .from("payment_transactions")
    .insert({
      provider: input.provider,
      provider_ref,
      tx_type: input.txType,
      status: input.status,
      amount: input.amount,
      currency_code: input.currency,
      msisdn: input.msisdn ?? null,
      loan_id: input.loanId ?? null,
      application_id: input.applicationId ?? null,
      user_id: input.userId ?? null,
      raw_payload: { source: "lendflow.console" },
    })
    .select("id, provider_ref")
    .single();
  if (error) throw new Error(`could not record transaction: ${error.message}`);
  return data;
}

/** Money out: marks the loan active and stamps the disbursement date. */
export async function applyDisbursement(loanId: string) {
  const { data: loan, error } = await supabaseAdmin
    .from("loans")
    .select("*")
    .eq("id", loanId)
    .maybeSingle();
  if (error || !loan) throw new Error("loan not found");
  if (loan.status !== "pending") throw new Error("this loan has already been disbursed");

  const tx = await recordTransaction({
    provider: loan.provider ?? "MTN MoMo",
    txType: "disbursement",
    status: "succeeded",
    amount: Number(loan.principal),
    currency: loan.currency_code ?? "ZMW",
    msisdn: loan.msisdn,
    loanId: loan.id,
    applicationId: loan.application_id,
    userId: loan.user_id,
  });

  await supabaseAdmin
    .from("loans")
    .update({
      status: "active",
      disbursed_at: new Date().toISOString(),
      outstanding_principal: Number(loan.total_repayment) || Number(loan.principal),
    })
    .eq("id", loan.id);

  if (loan.application_id) {
    await supabaseAdmin.from("loan_applications").update({ status: "disbursed" }).eq("id", loan.application_id);
  }

  const admins = await adminUserIds();
  await notify([
    {
      user_id: loan.user_id,
      kind: "disbursement",
      title: "Your money is on the way",
      body: `We have sent ${loan.currency_code ?? "ZMW"} ${Math.round(Number(loan.principal)).toLocaleString()} to ${loan.msisdn ?? "your wallet"} via ${loan.provider ?? "mobile money"}. Reference ${tx.provider_ref}.`,
      loan_id: loan.id,
      application_id: loan.application_id,
    },
    ...admins.map(id => ({
      user_id: id,
      audience: "admin",
      kind: "disbursement",
      title: "Loan disbursed",
      body: `${loan.product_title ?? "Loan"} of ${Math.round(Number(loan.principal)).toLocaleString()} disbursed. Reference ${tx.provider_ref}.`,
      loan_id: loan.id,
    })),
  ]);

  return { reference: tx.provider_ref };
}

/** Money in: applies a repayment against the outstanding balance. */
export async function applyRepayment(loanId: string, amount: number) {
  const { data: loan, error } = await supabaseAdmin.from("loans").select("*").eq("id", loanId).maybeSingle();
  if (error || !loan) throw new Error("loan not found");
  if (loan.status === "pending") throw new Error("this loan has not been disbursed yet");
  if (loan.status === "repaid") throw new Error("this loan is already settled");

  const due = Number(loan.outstanding_principal);
  const applied = Math.min(Math.round(amount), Math.round(due));
  if (applied <= 0) throw new Error("repayment amount must be greater than zero");

  const tx = await recordTransaction({
    provider: loan.provider ?? "MTN MoMo",
    txType: "repayment",
    status: "succeeded",
    amount: applied,
    currency: loan.currency_code ?? "ZMW",
    msisdn: loan.msisdn,
    loanId: loan.id,
    applicationId: loan.application_id,
    userId: loan.user_id,
  });

  const outstanding = Math.max(0, due - applied);
  await supabaseAdmin
    .from("loans")
    .update({
      amount_paid: Number(loan.amount_paid ?? 0) + applied,
      outstanding_principal: outstanding,
      status: outstanding <= 0 ? "repaid" : "active",
    })
    .eq("id", loan.id);

  const admins = await adminUserIds();
  await notify([
    {
      user_id: loan.user_id,
      kind: "repayment",
      title: outstanding <= 0 ? "Loan fully repaid 🎉" : "Repayment received",
      body:
        outstanding <= 0
          ? `We received your final ${applied.toLocaleString()} payment. Your loan is now settled. Reference ${tx.provider_ref}.`
          : `We received ${applied.toLocaleString()}. Your remaining balance is ${outstanding.toLocaleString()}. Reference ${tx.provider_ref}.`,
      loan_id: loan.id,
    },
    ...admins.map(id => ({
      user_id: id,
      audience: "admin",
      kind: "repayment",
      title: "Repayment received",
      body: `${applied.toLocaleString()} received on ${loan.product_title ?? "loan"}. Balance ${outstanding.toLocaleString()}.`,
      loan_id: loan.id,
    })),
  ]);

  return { applied, outstanding, settled: outstanding <= 0, reference: tx.provider_ref };
}

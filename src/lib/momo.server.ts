import { createHmac, timingSafeEqual } from "crypto";
import { z } from "zod";

/** Canonical webhook payload accepted from the mobile money aggregator. */
export const momoEventSchema = z.object({
  event_id: z.string().min(1).max(200),
  event_type: z.enum([
    "disbursement.succeeded",
    "disbursement.failed",
    "repayment.succeeded",
    "repayment.failed",
    "commitment.succeeded",
    "commitment.failed",
  ]),
  provider: z.string().min(2).max(50),
  reference: z.string().min(1).max(200),
  amount: z.number().nonnegative().max(100_000_000),
  currency: z.string().min(3).max(5),
  msisdn: z.string().max(30).optional(),
  loan_id: z.string().uuid().optional(),
  application_id: z.string().uuid().optional(),
  occurred_at: z.string().optional(),
});

export type MomoEvent = z.infer<typeof momoEventSchema>;

/** Constant-time HMAC-SHA256 check over the raw request body. */
export function verifySignature(rawBody: string, header: string | null, secret: string): boolean {
  if (!header || !secret) return false;
  const provided = header.startsWith("sha256=") ? header.slice(7) : header;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const a = Buffer.from(provided.trim().toLowerCase(), "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** Rejects replayed deliveries older than the tolerance window (seconds). */
export function timestampFresh(header: string | null, toleranceSec = 300): boolean {
  if (!header) return true; // timestamp header is optional
  const ts = Number(header);
  if (!Number.isFinite(ts)) return false;
  const seconds = ts > 1e12 ? ts / 1000 : ts;
  return Math.abs(Date.now() / 1000 - seconds) <= toleranceSec;
}

type Admin = Awaited<typeof import("@/integrations/supabase/client.server")>["supabaseAdmin"];

const TX_TYPE: Record<string, "disbursement" | "repayment" | "commitment"> = {
  "disbursement.succeeded": "disbursement",
  "disbursement.failed": "disbursement",
  "repayment.succeeded": "repayment",
  "repayment.failed": "repayment",
  "commitment.succeeded": "commitment",
  "commitment.failed": "commitment",
};

/**
 * Applies a verified provider event to the ledger.
 * Idempotent: the (provider, reference) unique key means a redelivery updates
 * the same transaction row, and loan balances are only moved on first success.
 */
export async function reconcileEvent(supabaseAdmin: Admin, event: MomoEvent) {
  const succeeded = event.event_type.endsWith(".succeeded");
  const txType = TX_TYPE[event.event_type]!;

  const { data: existing } = await supabaseAdmin
    .from("payment_transactions")
    .select("id, status")
    .eq("provider", event.provider)
    .eq("provider_ref", event.reference)
    .maybeSingle();

  const alreadySettled = existing?.status === "succeeded";

  const row = {
    provider: event.provider,
    provider_ref: event.reference,
    tx_type: txType,
    status: succeeded ? "succeeded" : "failed",
    amount: event.amount,
    currency_code: event.currency.toUpperCase(),
    msisdn: event.msisdn ?? null,
    loan_id: event.loan_id ?? null,
    application_id: event.application_id ?? null,
    raw_payload: JSON.parse(JSON.stringify(event)),
    occurred_at: event.occurred_at ?? new Date().toISOString(),
  };

  const { error: txError } = await supabaseAdmin
    .from("payment_transactions")
    .upsert(row, { onConflict: "provider,provider_ref" });
  if (txError) throw new Error(`transaction upsert failed: ${txError.message}`);

  if (!succeeded || alreadySettled) {
    return { applied: false, reason: alreadySettled ? "duplicate" : "not_successful" };
  }

  if (txType === "commitment" && event.application_id) {
    await supabaseAdmin
      .from("loan_applications")
      .update({ status: "commitment_paid" })
      .eq("id", event.application_id);
    return { applied: true, reason: "commitment_recorded" };
  }

  if (!event.loan_id) return { applied: true, reason: "no_loan_linked" };

  const { data: loan, error: loanError } = await supabaseAdmin
    .from("loans")
    .select("id, principal, outstanding_principal, amount_paid, status")
    .eq("id", event.loan_id)
    .maybeSingle();
  if (loanError) throw new Error(`loan lookup failed: ${loanError.message}`);
  if (!loan) return { applied: true, reason: "loan_not_found" };

  if (txType === "disbursement") {
    await supabaseAdmin
      .from("loans")
      .update({
        status: "active",
        disbursed_at: row.occurred_at,
        outstanding_principal: loan.outstanding_principal || loan.principal,
      })
      .eq("id", loan.id);
    return { applied: true, reason: "loan_disbursed" };
  }

  // repayment
  const paid = Number(loan.amount_paid ?? 0) + event.amount;
  const outstanding = Math.max(0, Number(loan.outstanding_principal ?? loan.principal) - event.amount);
  await supabaseAdmin
    .from("loans")
    .update({
      amount_paid: paid,
      outstanding_principal: outstanding,
      status: outstanding <= 0 ? "repaid" : loan.status === "pending" ? "active" : loan.status,
    })
    .eq("id", loan.id);

  return { applied: true, reason: outstanding <= 0 ? "loan_settled" : "repayment_applied" };
}

import { i as createServerFn } from "./esm-9EjmF9OT.js";
import { t as createServerRpc } from "./createServerRpc-TAUNrjZd.js";
import { t as requireSupabaseAuth } from "./auth-middleware-Dpn8S0gM.js";
import { a as repaySchema } from "./schemas-Cze1BLcm.js";
import { t as settleToMpesaWallet } from "./settlement-ChyNMCJ9.js";
import { t as getProvider } from "./providers-DSQ8GxEs.js";
//#region src/lib/repayments.functions.ts?tss-serverfn-split
var initiateRepayment_createServerFn_handler = createServerRpc({
	id: "178900f74004694eb7b8d6ccdcf0ba64d89767102f25f4921f4ca6cf30e98506",
	name: "initiateRepayment",
	filename: "src/lib/repayments.functions.ts"
}, (opts) => initiateRepayment.__executeServer(opts));
var initiateRepayment = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => repaySchema.parse(input)).handler(initiateRepayment_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	const { data: loan, error: loanErr } = await supabase.from("loans").select("id, user_id, outstanding, currency, status").eq("id", data.loan_id).maybeSingle();
	if (loanErr) throw new Error(loanErr.message);
	if (!loan) throw new Error("Loan not found");
	if (loan.user_id !== userId) throw new Error("Forbidden");
	if (loan.status !== "active") throw new Error("Loan is not active");
	if (data.amount > loan.outstanding) throw new Error("Amount exceeds outstanding balance");
	const result = await getProvider(data.provider).initiatePayment({
		amount: data.amount,
		currency: loan.currency,
		msisdn: data.msisdn,
		reference: `loan_${loan.id}`,
		description: `Repayment for loan ${loan.id.slice(0, 8)}`
	});
	if (!result.ok) throw new Error(result.message ?? "Provider rejected request");
	const { data: tx, error: txErr } = await supabase.from("transactions").insert({
		loan_id: loan.id,
		user_id: userId,
		direction: "repayment",
		provider: data.provider,
		provider_ref: result.providerRef,
		msisdn: data.msisdn,
		amount: data.amount,
		currency: loan.currency,
		status: "pending"
	}).select("id, provider_ref").single();
	if (txErr) throw new Error(txErr.message);
	return {
		transaction_id: tx.id,
		provider_ref: tx.provider_ref
	};
});
var verifyRepayment_createServerFn_handler = createServerRpc({
	id: "63d3b6a1c370511fb809943541504fe8b0c2d1a61abd30797b6b3c3630a8bc15",
	name: "verifyRepayment",
	filename: "src/lib/repayments.functions.ts"
}, (opts) => verifyRepayment.__executeServer(opts));
var verifyRepayment = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	const obj = input;
	if (typeof obj.transaction_id !== "string") throw new Error("transaction_id required");
	return { transaction_id: obj.transaction_id };
}).handler(verifyRepayment_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	const { data: tx, error } = await supabase.from("transactions").select("id, user_id, loan_id, provider, provider_ref, amount, status").eq("id", data.transaction_id).maybeSingle();
	if (error) throw new Error(error.message);
	if (!tx) throw new Error("Transaction not found");
	if (tx.user_id !== userId) throw new Error("Forbidden");
	if (tx.status !== "pending") return { status: tx.status };
	if (!tx.provider_ref) return { status: "pending" };
	const verify = await getProvider(tx.provider).verifyPayment(tx.provider_ref);
	if (verify.status === "pending") return { status: "pending" };
	const { supabaseAdmin } = await import("./client.server-D1oHePJa.js");
	if (verify.status === "failed") {
		await supabaseAdmin.from("transactions").update({
			status: "failed",
			failure_reason: verify.failureReason ?? "Unknown"
		}).eq("id", tx.id);
		return { status: "failed" };
	}
	await supabaseAdmin.from("transactions").update({
		status: "success",
		raw_payload: verify.raw
	}).eq("id", tx.id);
	if (tx.loan_id) {
		const { data: loanRow } = await supabaseAdmin.from("loans").select("outstanding").eq("id", tx.loan_id).single();
		if (loanRow) {
			const newOutstanding = Math.max(0, loanRow.outstanding - tx.amount);
			await supabaseAdmin.from("loans").update({
				outstanding: newOutstanding,
				status: newOutstanding === 0 ? "completed" : "active"
			}).eq("id", tx.loan_id);
			const { data: schedules } = await supabaseAdmin.from("repayment_schedules").select("id, amount_due, amount_paid, status").eq("loan_id", tx.loan_id).order("installment_no", { ascending: true });
			let remaining = tx.amount;
			for (const s of schedules ?? []) {
				if (remaining <= 0) break;
				if (s.status === "paid") continue;
				const need = s.amount_due - s.amount_paid;
				const pay = Math.min(need, remaining);
				const paid = s.amount_paid + pay;
				await supabaseAdmin.from("repayment_schedules").update({
					amount_paid: paid,
					status: paid >= s.amount_due ? "paid" : "partial"
				}).eq("id", s.id);
				remaining -= pay;
			}
			await supabaseAdmin.from("notifications").insert({
				user_id: tx.user_id,
				channel: "inapp",
				template: "repayment_success",
				title: "Payment received",
				body: `We received your payment. Outstanding: ${newOutstanding}`
			});
		}
	}
	await settleToMpesaWallet({
		source: "transaction",
		sourceId: tx.id,
		provider: tx.provider,
		amount: tx.amount
	}).catch((error) => {
		console.error("M-Pesa settlement submission failed", error);
	});
	return { status: "success" };
});
//#endregion
export { initiateRepayment_createServerFn_handler, verifyRepayment_createServerFn_handler };

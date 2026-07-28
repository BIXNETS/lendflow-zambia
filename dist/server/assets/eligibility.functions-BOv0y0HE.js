import { i as createServerFn } from "./esm-9EjmF9OT.js";
import { t as createServerRpc } from "./createServerRpc-TAUNrjZd.js";
import { t as requireSupabaseAuth } from "./auth-middleware-Dpn8S0gM.js";
import { z } from "zod";
//#region src/lib/eligibility.functions.ts?tss-serverfn-split
var getTierEligibility_createServerFn_handler = createServerRpc({
	id: "fa3c4a7831dbebbbbdc0d0314da29174c248e38d78c108e2bc32affe4780469d",
	name: "getTierEligibility",
	filename: "src/lib/eligibility.functions.ts"
}, (opts) => getTierEligibility.__executeServer(opts));
var getTierEligibility = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator(z.object({ userId: z.string().uuid().optional() })).handler(getTierEligibility_createServerFn_handler, async ({ data, context }) => {
	const targetUserId = data.userId ?? context.userId;
	if (targetUserId !== context.userId) {
		const { data: isAdmin } = await context.supabase.rpc("has_role", {
			_user_id: context.userId,
			_role: "admin"
		});
		if (!isAdmin) throw new Error("Forbidden");
	}
	const { data: rows, error } = await context.supabase.rpc("evaluate_tier_eligibility", { _user_id: targetUserId });
	if (error) throw new Error(error.message);
	return (rows ?? []).map((r) => ({
		tier_id: r.tier_id,
		tier_name: r.tier_name,
		eligible: r.eligible,
		reasons: r.reasons ?? [],
		active_loan_count: r.active_loan_count ?? 0,
		outstanding_principal: Number(r.outstanding_principal ?? 0)
	}));
});
var applyForLoan_createServerFn_handler = createServerRpc({
	id: "ca7959bd604b5ed172b1fa7fc7d866b8d07012028dd8d4288c7189fcb945abf6",
	name: "applyForLoan",
	filename: "src/lib/eligibility.functions.ts"
}, (opts) => applyForLoan.__executeServer(opts));
var applyForLoan = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator(z.object({
	tierId: z.string().uuid(),
	amount: z.number().positive(),
	termMonths: z.number().int().positive(),
	repaymentFrequencyDays: z.number().int().positive()
})).handler(applyForLoan_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	const { data: tier, error: tErr } = await supabase.from("loan_tiers").select("*").eq("id", data.tierId).maybeSingle();
	if (tErr) throw new Error(tErr.message);
	if (!tier || !tier.is_active) throw new Error("Tier is not available");
	if (data.amount < tier.min_amount || data.amount > tier.max_amount) throw new Error(`Amount must be between K${tier.min_amount} and K${tier.max_amount}`);
	if (data.termMonths < tier.min_term_months || data.termMonths > tier.max_term_months) throw new Error(`Term must be between ${tier.min_term_months} and ${tier.max_term_months} months`);
	if (data.repaymentFrequencyDays < tier.min_repayment_frequency_days || data.repaymentFrequencyDays > tier.max_repayment_frequency_days) throw new Error(`Repayment frequency must be ${tier.min_repayment_frequency_days}–${tier.max_repayment_frequency_days} days`);
	const { data: eligibility, error: eErr } = await supabase.rpc("evaluate_tier_eligibility", { _user_id: userId });
	if (eErr) throw new Error(eErr.message);
	const row = (eligibility ?? []).find((r) => r.tier_id === data.tierId);
	if (!row) throw new Error("Tier not found in eligibility results");
	if (!row.eligible) throw new Error(`Not eligible for ${row.tier_name}: ${(row.reasons ?? []).join("; ")}`);
	const { supabaseAdmin } = await import("./client.server-D1oHePJa.js");
	const { data: created, error: iErr } = await supabaseAdmin.from("loans").insert({
		user_id: userId,
		tier_id: tier.id,
		principal: data.amount,
		term_months: data.termMonths,
		repayment_frequency_days: data.repaymentFrequencyDays,
		interest_rate: tier.interest_rate,
		outstanding_principal: data.amount,
		status: "pending"
	}).select("id").single();
	if (iErr) throw new Error(iErr.message);
	return { loanId: created.id };
});
//#endregion
export { applyForLoan_createServerFn_handler, getTierEligibility_createServerFn_handler };

import { i as createServerFn } from "./esm-9EjmF9OT.js";
import { t as createServerRpc } from "./createServerRpc-TAUNrjZd.js";
import { t as requireSupabaseAuth } from "./auth-middleware-Dpn8S0gM.js";
import { n as decisionSchema } from "./schemas-Cze1BLcm.js";
import { t as computeLoan } from "./calc-hbospc3j.js";
import { z } from "zod";
//#region src/lib/admin.functions.ts?tss-serverfn-split
async function assertAdmin(supabase, userId) {
	const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId).in("role", ["admin", "reviewer"]);
	if (!data?.length) throw new Error("Forbidden — admin only");
}
var decideApplication_createServerFn_handler = createServerRpc({
	id: "e1d97c76be5239d2d172f793da67eb0e4c1dcbdd4dee3058f4a8ca0cf57a5762",
	name: "decideApplication",
	filename: "src/lib/admin.functions.ts"
}, (opts) => decideApplication.__executeServer(opts));
var decideApplication = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => decisionSchema.parse(input)).handler(decideApplication_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	await assertAdmin(supabase, userId);
	const { data: app, error } = await supabase.from("loan_applications").select("id, user_id, product_id, requested_amount, term_days, status").eq("id", data.application_id).maybeSingle();
	if (error || !app) throw new Error("Application not found");
	if (app.status !== "submitted" && app.status !== "under_review") throw new Error("Application already decided");
	const { supabaseAdmin } = await import("./client.server-D1oHePJa.js");
	if (data.decision === "reject") {
		await supabaseAdmin.from("loan_applications").update({
			status: "rejected",
			decision_notes: data.notes ?? null,
			decided_by: userId,
			decided_at: (/* @__PURE__ */ new Date()).toISOString()
		}).eq("id", app.id);
		await supabaseAdmin.from("notifications").insert({
			user_id: app.user_id,
			channel: "inapp",
			template: "application_rejected",
			title: "Loan application rejected",
			body: data.notes || "Your application was not approved at this time."
		});
		return { ok: true };
	}
	const { data: product } = await supabaseAdmin.from("loan_products").select("interest_rate_pct, currency").eq("id", app.product_id).single();
	if (!product) throw new Error("Product missing");
	const c = computeLoan(app.requested_amount, Number(product.interest_rate_pct), app.term_days);
	const { data: loan, error: lerr } = await supabaseAdmin.from("loans").insert({
		application_id: app.id,
		user_id: app.user_id,
		product_id: app.product_id,
		principal: c.principal,
		interest: c.interest,
		total_payable: c.total,
		outstanding: c.total,
		currency: product.currency,
		due_date: c.dueDate,
		status: "pending_disbursement"
	}).select("id").single();
	if (lerr) throw new Error(lerr.message);
	await supabaseAdmin.from("repayment_schedules").insert({
		loan_id: loan.id,
		installment_no: 1,
		due_date: c.dueDate,
		amount_due: c.total
	});
	await supabaseAdmin.from("loan_applications").update({
		status: "approved",
		decision_notes: data.notes ?? null,
		decided_by: userId,
		decided_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("id", app.id);
	await supabaseAdmin.from("notifications").insert({
		user_id: app.user_id,
		channel: "inapp",
		template: "application_approved",
		title: "Loan approved",
		body: `Your loan was approved. ${c.principal} principal, ${c.total} total payable.`
	});
	return {
		ok: true,
		loan_id: loan.id
	};
});
var markDisbursed_createServerFn_handler = createServerRpc({
	id: "270ea7e6e1110855b6509e287b4279a924cbd0b6e85a03b68c84dde216d1b0b4",
	name: "markDisbursed",
	filename: "src/lib/admin.functions.ts"
}, (opts) => markDisbursed.__executeServer(opts));
var markDisbursed = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => z.object({ loan_id: z.string().uuid() }).parse(input)).handler(markDisbursed_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	await assertAdmin(supabase, userId);
	const { supabaseAdmin } = await import("./client.server-D1oHePJa.js");
	const { data: loan } = await supabaseAdmin.from("loans").select("id, user_id, principal, currency, status").eq("id", data.loan_id).single();
	if (!loan) throw new Error("Loan not found");
	if (loan.status !== "pending_disbursement") throw new Error("Loan not in pending_disbursement");
	await supabaseAdmin.from("loans").update({
		status: "active",
		disbursed_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("id", loan.id);
	await supabaseAdmin.from("transactions").insert({
		loan_id: loan.id,
		user_id: loan.user_id,
		direction: "disbursement",
		provider: "manual",
		amount: loan.principal,
		currency: loan.currency,
		status: "success"
	});
	await supabaseAdmin.from("notifications").insert({
		user_id: loan.user_id,
		channel: "inapp",
		template: "loan_disbursed",
		title: "Loan disbursed",
		body: "Your funds are on the way to your mobile money wallet."
	});
	return { ok: true };
});
var updateKycStatus_createServerFn_handler = createServerRpc({
	id: "b66449bef6081fffbf984f933b4199ae6ead1dc57a5731f9736d41946a263e54",
	name: "updateKycStatus",
	filename: "src/lib/admin.functions.ts"
}, (opts) => updateKycStatus.__executeServer(opts));
var updateKycStatus = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => z.object({
	user_id: z.string().uuid(),
	status: z.enum([
		"approved",
		"rejected",
		"in_review"
	]),
	reason: z.string().optional()
}).parse(input)).handler(updateKycStatus_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	await assertAdmin(supabase, userId);
	const { supabaseAdmin } = await import("./client.server-D1oHePJa.js");
	await supabaseAdmin.from("profiles").update({ kyc_status: data.status }).eq("user_id", data.user_id);
	await supabaseAdmin.from("kyc_documents").update({
		status: data.status === "approved" ? "approved" : data.status === "rejected" ? "rejected" : "pending",
		reviewer_id: userId,
		reviewed_at: (/* @__PURE__ */ new Date()).toISOString(),
		rejection_reason: data.reason ?? null
	}).eq("user_id", data.user_id);
	await supabaseAdmin.from("notifications").insert({
		user_id: data.user_id,
		channel: "inapp",
		template: `kyc_${data.status}`,
		title: `KYC ${data.status}`,
		body: data.reason || `Your KYC status is now ${data.status}.`
	});
	return { ok: true };
});
//#endregion
export { decideApplication_createServerFn_handler, markDisbursed_createServerFn_handler, updateKycStatus_createServerFn_handler };

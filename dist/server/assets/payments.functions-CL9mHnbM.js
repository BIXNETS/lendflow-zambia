import { i as createServerFn } from "./esm-9EjmF9OT.js";
import { t as createServerRpc } from "./createServerRpc-TAUNrjZd.js";
import { t as requireSupabaseAuth } from "./auth-middleware-Dpn8S0gM.js";
import { a as normalizeAirtelMsisdn, i as getAirtelMoneyPaymentStatus, o as requestAirtelMoneyPayment, t as settleToMpesaWallet } from "./settlement-ChyNMCJ9.js";
import { z } from "zod";
import { Buffer } from "node:buffer";
//#region src/lib/mtn-momo.server.ts
function getMtnMomoConfig() {
	const missing = [
		!process.env.MTN_MOMO_COLLECTION_SUBSCRIPTION_KEY && "MTN_MOMO_COLLECTION_SUBSCRIPTION_KEY",
		!process.env.MTN_MOMO_COLLECTION_API_USER && "MTN_MOMO_COLLECTION_API_USER",
		!process.env.MTN_MOMO_COLLECTION_API_KEY && "MTN_MOMO_COLLECTION_API_KEY"
	].filter(Boolean);
	if (missing.length > 0) throw new Error(`Missing MTN MoMo environment variable(s): ${missing.join(", ")}`);
	const config = {
		baseUrl: (process.env.MTN_MOMO_BASE_URL ?? "https://sandbox.momodeveloper.mtn.com").replace(/\/$/, ""),
		subscriptionKey: process.env.MTN_MOMO_COLLECTION_SUBSCRIPTION_KEY,
		apiUser: process.env.MTN_MOMO_COLLECTION_API_USER,
		apiKey: process.env.MTN_MOMO_COLLECTION_API_KEY,
		targetEnvironment: process.env.MTN_MOMO_TARGET_ENVIRONMENT ?? "sandbox",
		currency: process.env.MTN_MOMO_CURRENCY ?? "ZMW",
		callbackUrl: process.env.MTN_MOMO_CALLBACK_URL
	};
	if (!/^[A-Z]{3}$/.test(config.currency)) throw new Error("MTN_MOMO_CURRENCY must be a three-letter ISO currency code");
	if (config.callbackUrl) try {
		if (new URL(config.callbackUrl).protocol !== "https:") throw new Error();
	} catch {
		throw new Error("MTN_MOMO_CALLBACK_URL must be a valid HTTPS URL");
	}
	return config;
}
function normalizeMomoMsisdn(value) {
	return value.replace(/[^\d]/g, "");
}
async function getCollectionAccessToken(config) {
	const credentials = Buffer.from(`${config.apiUser}:${config.apiKey}`).toString("base64");
	const response = await fetch(`${config.baseUrl}/collection/token/`, {
		method: "POST",
		headers: {
			Authorization: `Basic ${credentials}`,
			"Ocp-Apim-Subscription-Key": config.subscriptionKey
		}
	});
	if (!response.ok) throw new Error(`MTN MoMo token request failed (${response.status})`);
	const body = await response.json();
	if (!body.access_token) throw new Error("MTN MoMo token response did not include an access token");
	return body.access_token;
}
async function requestMtnMomoPayment(params) {
	const config = getMtnMomoConfig();
	const phone = normalizeMomoMsisdn(params.phone);
	if (!Number.isFinite(params.amount) || params.amount <= 0) throw new Error("MTN MoMo payment amount must be greater than zero");
	if (params.currency !== config.currency) throw new Error(`MTN MoMo currency mismatch: payment uses ${params.currency}, but MTN_MOMO_CURRENCY is ${config.currency}`);
	if (!/^\d{9,15}$/.test(phone)) throw new Error("MTN MoMo payer number must use international format");
	const headers = {
		Authorization: `Bearer ${await getCollectionAccessToken(config)}`,
		"Content-Type": "application/json",
		"X-Reference-Id": params.referenceId,
		"X-Target-Environment": config.targetEnvironment,
		"Ocp-Apim-Subscription-Key": config.subscriptionKey
	};
	if (config.callbackUrl) headers["X-Callback-Url"] = config.callbackUrl;
	const response = await fetch(`${config.baseUrl}/collection/v1_0/requesttopay`, {
		method: "POST",
		headers,
		body: JSON.stringify({
			amount: params.amount.toFixed(2),
			currency: params.currency,
			externalId: params.externalId,
			payer: {
				partyIdType: "MSISDN",
				partyId: phone
			},
			payerMessage: params.payerMessage,
			payeeNote: params.payeeNote
		})
	});
	if (response.status !== 202) {
		const detail = await response.text().catch(() => "");
		throw new Error(`MTN MoMo payment request failed (${response.status})${detail ? `: ${detail}` : ""}`);
	}
	return {
		referenceId: params.referenceId,
		currency: params.currency,
		status: "PENDING"
	};
}
async function getMtnMomoPaymentStatus(referenceId) {
	const config = getMtnMomoConfig();
	const token = await getCollectionAccessToken(config);
	const response = await fetch(`${config.baseUrl}/collection/v1_0/requesttopay/${referenceId}`, { headers: {
		Authorization: `Bearer ${token}`,
		"X-Target-Environment": config.targetEnvironment,
		"Ocp-Apim-Subscription-Key": config.subscriptionKey
	} });
	if (!response.ok) throw new Error(`MTN MoMo status request failed (${response.status})`);
	return await response.json();
}
//#endregion
//#region src/lib/payments.functions.ts?tss-serverfn-split
var providerSchema = z.enum(["mtn_momo", "airtel_money"]);
function assertValidMsisdn(phone) {
	if (!/^\d{9,15}$/.test(phone)) throw new Error("Enter the phone number in international format, for example 260971234567");
}
function normalizePhone(provider, phone) {
	const normalized = provider === "mtn_momo" ? normalizeMomoMsisdn(phone) : normalizeAirtelMsisdn(phone);
	assertValidMsisdn(normalized);
	return normalized;
}
var getPromotionPackages_createServerFn_handler = createServerRpc({
	id: "0e367a1aed0f1eb6ad2bd4e6ec7c75e0cbab3903f09e6a617b2976db02f5dccd",
	name: "getPromotionPackages",
	filename: "src/lib/payments.functions.ts"
}, (opts) => getPromotionPackages.__executeServer(opts));
var getPromotionPackages = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator(z.object({})).handler(getPromotionPackages_createServerFn_handler, async ({ context }) => {
	const { data, error } = await context.supabase.from("promotion_packages").select("id,name,headline,badge,accent,description,qualification_amount,fee_amount,currency").eq("is_active", true).order("sort_order", { ascending: true });
	if (error) throw new Error(error.message);
	return (data ?? []).map((row) => ({
		id: row.id,
		name: row.name,
		headline: row.headline,
		badge: row.badge,
		accent: row.accent,
		description: row.description,
		qualificationAmount: Number(row.qualification_amount),
		feeAmount: Number(row.fee_amount),
		currency: row.currency
	}));
});
var startMobileMoneyPackagePayment_createServerFn_handler = createServerRpc({
	id: "6d13f1c941580f980c35f82ebc54e15e3695c497bbbd11619192ba99af92ece5",
	name: "startMobileMoneyPackagePayment",
	filename: "src/lib/payments.functions.ts"
}, (opts) => startMobileMoneyPackagePayment.__executeServer(opts));
var startMobileMoneyPackagePayment = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator(z.object({
	packageId: z.string().uuid(),
	provider: providerSchema,
	phone: z.string().min(1)
})).handler(startMobileMoneyPackagePayment_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	const { supabaseAdmin } = await import("./client.server-D1oHePJa.js");
	const phone = normalizePhone(data.provider, data.phone);
	const { data: profile, error: profileError } = await supabase.from("profiles").select("kyc_status").eq("id", userId).single();
	if (profileError) throw new Error(profileError.message);
	if (profile.kyc_status !== "approved") throw new Error("Complete KYC approval before choosing a promotion package");
	const { data: pack, error: packageError } = await supabase.from("promotion_packages").select("id,name,fee_amount,currency").eq("id", data.packageId).eq("is_active", true).single();
	if (packageError) throw new Error(packageError.message);
	const amount = Number(pack.fee_amount);
	if (!Number.isFinite(amount) || amount <= 0) throw new Error("The selected package does not have a valid fee");
	let paymentCurrency = pack.currency;
	if (data.provider === "mtn_momo") {
		const momoConfig = getMtnMomoConfig();
		paymentCurrency = momoConfig.currency;
		if (momoConfig.targetEnvironment !== "sandbox" && pack.currency !== paymentCurrency) throw new Error(`This package is priced in ${pack.currency}, but MTN MoMo is configured for ${paymentCurrency}`);
	}
	const referenceId = crypto.randomUUID();
	const externalId = `${data.provider}-${referenceId.slice(0, 8)}`;
	const { data: payment, error: insertError } = await supabaseAdmin.from("mobile_money_payments").insert({
		user_id: userId,
		package_id: pack.id,
		provider: data.provider,
		reference_id: referenceId,
		external_id: externalId,
		amount,
		currency: paymentCurrency,
		phone,
		status: "pending"
	}).select("id").single();
	if (insertError) throw new Error(insertError.message);
	try {
		if (data.provider === "mtn_momo") await requestMtnMomoPayment({
			referenceId,
			externalId,
			amount,
			currency: paymentCurrency,
			phone,
			payerMessage: "LendFlow promotion package",
			payeeNote: `Promotion fee for ${pack.name}`
		});
		else await requestAirtelMoneyPayment({
			referenceId,
			externalId,
			amount,
			phone
		});
	} catch (error) {
		await supabaseAdmin.from("mobile_money_payments").update({
			status: "failed",
			provider_status: "REQUEST_FAILED",
			reason: error instanceof Error ? error.message : "Mobile money request failed"
		}).eq("id", payment.id);
		throw error;
	}
	await supabaseAdmin.from("profiles").update({
		phone,
		activation_status: "pending"
	}).eq("id", userId);
	return {
		paymentId: payment.id,
		referenceId,
		packageId: pack.id,
		provider: data.provider,
		amount,
		currency: paymentCurrency,
		status: "pending",
		phone
	};
});
var checkMobileMoneyPackagePayment_createServerFn_handler = createServerRpc({
	id: "964606b809aa1d6f9bd3ca10d0759b327056309e284c4b91ac9f35ed687adfc3",
	name: "checkMobileMoneyPackagePayment",
	filename: "src/lib/payments.functions.ts"
}, (opts) => checkMobileMoneyPackagePayment.__executeServer(opts));
var checkMobileMoneyPackagePayment = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator(z.object({ paymentId: z.string().uuid() })).handler(checkMobileMoneyPackagePayment_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	const { supabaseAdmin } = await import("./client.server-D1oHePJa.js");
	const { data: payment, error } = await supabase.from("mobile_money_payments").select("id,reference_id,external_id,package_id,provider,amount,currency,phone,status").eq("id", data.paymentId).eq("user_id", userId).single();
	if (error) throw new Error(error.message);
	if (payment.status !== "pending") return {
		paymentId: payment.id,
		referenceId: payment.reference_id,
		packageId: payment.package_id,
		provider: payment.provider,
		amount: Number(payment.amount),
		currency: payment.currency,
		status: payment.status,
		phone: payment.phone
	};
	const provider = payment.provider;
	const providerStatus = provider === "mtn_momo" ? await getMtnMomoPaymentStatus(payment.reference_id) : await getAirtelMoneyPaymentStatus(payment.external_id);
	const rawStatus = "status" in providerStatus && typeof providerStatus.status === "string" ? providerStatus.status : "PENDING";
	const status = rawStatus === "SUCCESSFUL" || rawStatus === "SUCCESS" || rawStatus === "TS" ? "successful" : rawStatus === "FAILED" || rawStatus === "TF" ? "failed" : "pending";
	const { error: updateError } = await supabaseAdmin.from("mobile_money_payments").update({
		status,
		provider_status: rawStatus,
		reason: "reason" in providerStatus ? providerStatus.reason ?? null : providerStatus.message ?? null,
		raw_response: providerStatus,
		completed_at: status === "pending" ? null : (/* @__PURE__ */ new Date()).toISOString()
	}).eq("id", payment.id);
	if (updateError) throw new Error(updateError.message);
	if (status === "successful") {
		const { error: profileError } = await supabaseAdmin.from("profiles").update({ activation_status: "active" }).eq("id", userId);
		if (profileError) throw new Error(profileError.message);
		await settleToMpesaWallet({
			source: "mobile_money_payment",
			sourceId: payment.id,
			provider,
			amount: Number(payment.amount)
		}).catch((error) => {
			console.error("M-Pesa settlement submission failed", error);
		});
	}
	return {
		paymentId: payment.id,
		referenceId: payment.reference_id,
		packageId: payment.package_id,
		provider,
		amount: Number(payment.amount),
		currency: payment.currency,
		status,
		phone: payment.phone
	};
});
//#endregion
export { checkMobileMoneyPackagePayment_createServerFn_handler, getPromotionPackages_createServerFn_handler, startMobileMoneyPackagePayment_createServerFn_handler };

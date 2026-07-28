import { Buffer } from "node:buffer";
//#region src/lib/airtel-money.server.ts
function getAirtelMoneyConfig() {
	const missing = [!process.env.AIRTEL_MONEY_CLIENT_ID && "AIRTEL_MONEY_CLIENT_ID", !process.env.AIRTEL_MONEY_CLIENT_SECRET && "AIRTEL_MONEY_CLIENT_SECRET"].filter(Boolean);
	if (missing.length > 0) throw new Error(`Missing Airtel Money environment variable(s): ${missing.join(", ")}`);
	return {
		baseUrl: (process.env.AIRTEL_MONEY_BASE_URL ?? "https://openapi.airtel.africa").replace(/\/$/, ""),
		clientId: process.env.AIRTEL_MONEY_CLIENT_ID,
		clientSecret: process.env.AIRTEL_MONEY_CLIENT_SECRET,
		country: process.env.AIRTEL_MONEY_COUNTRY ?? "ZM",
		currency: process.env.AIRTEL_MONEY_CURRENCY ?? "ZMW"
	};
}
function normalizeAirtelMsisdn(value) {
	return value.replace(/[^\d]/g, "");
}
async function getAirtelAccessToken(config) {
	const response = await fetch(`${config.baseUrl}/auth/oauth2/token`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			client_id: config.clientId,
			client_secret: config.clientSecret,
			grant_type: "client_credentials"
		})
	});
	if (!response.ok) throw new Error(`Airtel Money token request failed (${response.status})`);
	const body = await response.json();
	const token = body.access_token ?? body.data?.access_token;
	if (!token) throw new Error("Airtel Money token response did not include an access token");
	return token;
}
async function requestAirtelMoneyPayment(params) {
	const config = getAirtelMoneyConfig();
	const token = await getAirtelAccessToken(config);
	const response = await fetch(`${config.baseUrl}/merchant/v1/payments/`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
			"X-Country": config.country,
			"X-Currency": config.currency
		},
		body: JSON.stringify({
			reference: params.referenceId,
			subscriber: {
				country: config.country,
				currency: config.currency,
				msisdn: params.phone
			},
			transaction: {
				amount: params.amount.toFixed(2),
				country: config.country,
				currency: config.currency,
				id: params.externalId
			}
		})
	});
	if (!response.ok) {
		const detail = await response.text().catch(() => "");
		throw new Error(`Airtel Money payment request failed (${response.status})${detail ? `: ${detail}` : ""}`);
	}
	return { currency: config.currency };
}
async function getAirtelMoneyPaymentStatus(externalId) {
	const config = getAirtelMoneyConfig();
	const token = await getAirtelAccessToken(config);
	const response = await fetch(`${config.baseUrl}/standard/v1/payments/${externalId}`, { headers: {
		Accept: "application/json",
		Authorization: `Bearer ${token}`,
		"X-Country": config.country,
		"X-Currency": config.currency
	} });
	if (!response.ok) throw new Error(`Airtel Money status request failed (${response.status})`);
	return await response.json();
}
//#endregion
//#region src/lib/mpesa-daraja.server.ts
function normalizeMpesaMsisdn(value) {
	const digits = value.replace(/[^\d]/g, "");
	if (digits.startsWith("0")) return `254${digits.slice(1)}`;
	return digits;
}
function getMpesaDarajaConfig() {
	const missing = [
		!process.env.MPESA_CONSUMER_KEY && "MPESA_CONSUMER_KEY",
		!process.env.MPESA_CONSUMER_SECRET && "MPESA_CONSUMER_SECRET",
		!process.env.MPESA_BUSINESS_SHORT_CODE && "MPESA_BUSINESS_SHORT_CODE",
		!process.env.MPESA_PASSKEY && "MPESA_PASSKEY",
		!process.env.MPESA_CALLBACK_URL && "MPESA_CALLBACK_URL"
	].filter(Boolean);
	if (missing.length > 0) throw new Error(`Missing M-Pesa Daraja environment variable(s): ${missing.join(", ")}`);
	const config = {
		baseUrl: (process.env.MPESA_BASE_URL ?? "https://api.safaricom.co.ke").replace(/\/$/, ""),
		consumerKey: process.env.MPESA_CONSUMER_KEY,
		consumerSecret: process.env.MPESA_CONSUMER_SECRET,
		businessShortCode: process.env.MPESA_BUSINESS_SHORT_CODE,
		passkey: process.env.MPESA_PASSKEY,
		callbackUrl: process.env.MPESA_CALLBACK_URL,
		b2cInitiatorName: process.env.MPESA_B2C_INITIATOR_NAME,
		b2cSecurityCredential: process.env.MPESA_B2C_SECURITY_CREDENTIAL,
		b2cResultUrl: process.env.MPESA_B2C_RESULT_URL,
		b2cQueueTimeoutUrl: process.env.MPESA_B2C_QUEUE_TIMEOUT_URL,
		settlementMsisdn: process.env.MPESA_SETTLEMENT_MSISDN
	};
	for (const [name, url] of [
		["MPESA_CALLBACK_URL", config.callbackUrl],
		["MPESA_B2C_RESULT_URL", config.b2cResultUrl],
		["MPESA_B2C_QUEUE_TIMEOUT_URL", config.b2cQueueTimeoutUrl]
	]) {
		if (!url) continue;
		try {
			if (new URL(url).protocol !== "https:") throw new Error();
		} catch {
			throw new Error(`${name} must be a valid HTTPS URL`);
		}
	}
	return config;
}
var cachedToken = null;
async function getAccessToken(config) {
	const now = Date.now();
	if (cachedToken && cachedToken.expiresAt > now + 6e4) return cachedToken.token;
	const credentials = Buffer.from(`${config.consumerKey}:${config.consumerSecret}`).toString("base64");
	const response = await fetch(`${config.baseUrl}/oauth/v1/generate?grant_type=client_credentials`, { headers: { Authorization: `Basic ${credentials}` } });
	if (!response.ok) {
		const detail = await response.text().catch(() => "");
		throw new Error(`M-Pesa token request failed (${response.status})${detail ? `: ${detail}` : ""}`);
	}
	const body = await response.json();
	if (!body.access_token) throw new Error("M-Pesa token response did not include an access token");
	cachedToken = {
		token: body.access_token,
		expiresAt: now + Number(body.expires_in ?? 3599) * 1e3
	};
	return cachedToken.token;
}
function darajaTimestamp() {
	const now = /* @__PURE__ */ new Date();
	const pad = (value) => String(value).padStart(2, "0");
	return [
		now.getFullYear(),
		pad(now.getMonth() + 1),
		pad(now.getDate()),
		pad(now.getHours()),
		pad(now.getMinutes()),
		pad(now.getSeconds())
	].join("");
}
function validateAmount(amount) {
	if (!Number.isFinite(amount) || amount <= 0) throw new Error("M-Pesa amount must be greater than zero");
	return Math.round(amount);
}
async function requestMpesaStkPush(params) {
	const config = getMpesaDarajaConfig();
	const token = await getAccessToken(config);
	const timestamp = darajaTimestamp();
	const password = Buffer.from(`${config.businessShortCode}${config.passkey}${timestamp}`).toString("base64");
	const amount = validateAmount(params.amount);
	const phone = normalizeMpesaMsisdn(params.phone);
	if (!/^254\d{9}$/.test(phone)) throw new Error("M-Pesa phone number must be a Kenyan MSISDN, for example +254712345678");
	const response = await fetch(`${config.baseUrl}/mpesa/stkpush/v1/processrequest`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			BusinessShortCode: config.businessShortCode,
			Password: password,
			Timestamp: timestamp,
			TransactionType: "CustomerPayBillOnline",
			Amount: amount,
			PartyA: phone,
			PartyB: config.businessShortCode,
			PhoneNumber: phone,
			CallBackURL: config.callbackUrl,
			AccountReference: params.accountReference.slice(0, 12),
			TransactionDesc: params.description.slice(0, 100)
		})
	});
	const body = await response.json().catch(() => ({}));
	if (!response.ok || body.ResponseCode !== "0" || !body.CheckoutRequestID) throw new Error(`M-Pesa STK push failed (${response.status}): ${body.errorMessage ?? body.ResponseDescription ?? "Request rejected"}`);
	return body;
}
async function queryMpesaStkPush(checkoutRequestId) {
	const config = getMpesaDarajaConfig();
	const token = await getAccessToken(config);
	const timestamp = darajaTimestamp();
	const password = Buffer.from(`${config.businessShortCode}${config.passkey}${timestamp}`).toString("base64");
	const response = await fetch(`${config.baseUrl}/mpesa/stkpushquery/v1/query`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			BusinessShortCode: config.businessShortCode,
			Password: password,
			Timestamp: timestamp,
			CheckoutRequestID: checkoutRequestId
		})
	});
	if (!response.ok) {
		const detail = await response.text().catch(() => "");
		throw new Error(`M-Pesa STK query failed (${response.status})${detail ? `: ${detail}` : ""}`);
	}
	return await response.json();
}
async function sendMpesaB2cPayment(params) {
	const config = getMpesaDarajaConfig();
	const missing = [
		!config.b2cInitiatorName && "MPESA_B2C_INITIATOR_NAME",
		!config.b2cSecurityCredential && "MPESA_B2C_SECURITY_CREDENTIAL",
		!config.b2cResultUrl && "MPESA_B2C_RESULT_URL",
		!config.b2cQueueTimeoutUrl && "MPESA_B2C_QUEUE_TIMEOUT_URL",
		!(params.phone ?? config.settlementMsisdn) && "MPESA_SETTLEMENT_MSISDN"
	].filter(Boolean);
	if (missing.length > 0) throw new Error(`Missing M-Pesa B2C environment variable(s): ${missing.join(", ")}`);
	const token = await getAccessToken(config);
	const amount = validateAmount(params.amount);
	const partyB = normalizeMpesaMsisdn(params.phone ?? config.settlementMsisdn);
	if (!/^254\d{9}$/.test(partyB)) throw new Error("M-Pesa settlement wallet must be a Kenyan MSISDN");
	const response = await fetch(`${config.baseUrl}/mpesa/b2c/v3/paymentrequest`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			OriginatorConversationID: params.originatorConversationId,
			InitiatorName: config.b2cInitiatorName,
			SecurityCredential: config.b2cSecurityCredential,
			CommandID: "BusinessPayment",
			Amount: amount,
			PartyA: config.businessShortCode,
			PartyB: partyB,
			Remarks: params.remarks.slice(0, 100),
			QueueTimeOutURL: config.b2cQueueTimeoutUrl,
			ResultURL: config.b2cResultUrl,
			Occasion: (params.occasion ?? "LendFlow settlement").slice(0, 100)
		})
	});
	const body = await response.json().catch(() => ({}));
	if (!response.ok || body.ResponseCode && body.ResponseCode !== "0") throw new Error(`M-Pesa B2C request failed (${response.status}): ${body.errorMessage ?? body.ResponseDescription ?? "Request rejected"}`);
	return body;
}
//#endregion
//#region src/lib/payments/settlement.ts
async function settleToMpesaWallet(params) {
	if (!process.env.MPESA_SETTLEMENT_MSISDN) return;
	if (params.enabledOnlyForAirtel !== false && !params.provider.includes("airtel")) return;
	const { supabaseAdmin } = await import("./client.server-D1oHePJa.js");
	const originatorConversationId = `${params.source}-${params.sourceId}`.slice(0, 64);
	const { data: existing, error: existingError } = await supabaseAdmin.from("payment_settlements").select("id,status").eq("source_table", params.source).eq("source_id", params.sourceId).maybeSingle();
	if (existingError) throw new Error(existingError.message);
	if (existing && existing.status !== "failed") return;
	const payload = {
		source_table: params.source,
		source_id: params.sourceId,
		destination_provider: "mpesa",
		destination_msisdn: process.env.MPESA_SETTLEMENT_MSISDN,
		amount: params.amount,
		status: "pending"
	};
	const { data: settlement, error: upsertError } = await supabaseAdmin.from("payment_settlements").upsert(payload, { onConflict: "source_table,source_id" }).select("id").single();
	if (upsertError) throw new Error(upsertError.message);
	try {
		const response = await sendMpesaB2cPayment({
			amount: params.amount,
			remarks: `LendFlow ${params.source} settlement`,
			occasion: params.sourceId,
			originatorConversationId
		});
		await supabaseAdmin.from("payment_settlements").update({
			status: "submitted",
			provider_ref: response.ConversationID ?? response.OriginatorConversationID ?? null,
			raw_response: response,
			submitted_at: (/* @__PURE__ */ new Date()).toISOString()
		}).eq("id", settlement.id);
	} catch (error) {
		await supabaseAdmin.from("payment_settlements").update({
			status: "failed",
			failure_reason: error instanceof Error ? error.message : "M-Pesa settlement failed"
		}).eq("id", settlement.id);
		throw error;
	}
}
//#endregion
export { normalizeAirtelMsisdn as a, getAirtelMoneyPaymentStatus as i, queryMpesaStkPush as n, requestAirtelMoneyPayment as o, requestMpesaStkPush as r, settleToMpesaWallet as t };

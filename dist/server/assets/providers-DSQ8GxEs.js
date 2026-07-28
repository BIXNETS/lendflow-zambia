import { i as getAirtelMoneyPaymentStatus, n as queryMpesaStkPush, o as requestAirtelMoneyPayment, r as requestMpesaStkPush } from "./settlement-ChyNMCJ9.js";
//#region src/lib/payments/airtel.ts
function statusToVerify(providerRef, raw) {
	const status = raw.status;
	if (status === "SUCCESS" || status === "SUCCESSFUL" || status === "TS") return {
		status: "success",
		providerRef,
		raw
	};
	if (status === "FAILED" || status === "TF") return {
		status: "failed",
		providerRef,
		raw,
		failureReason: raw.message ?? "Declined"
	};
	return {
		status: "pending",
		providerRef,
		raw
	};
}
var AirtelProvider = {
	id: "airtel",
	async initiatePayment(input) {
		const externalId = crypto.randomUUID();
		await requestAirtelMoneyPayment({
			referenceId: input.reference,
			externalId,
			amount: input.amount,
			phone: input.msisdn
		});
		return {
			ok: true,
			providerRef: externalId,
			message: "Awaiting customer authorization on Airtel Money"
		};
	},
	async verifyPayment(providerRef) {
		return statusToVerify(providerRef, await getAirtelMoneyPaymentStatus(providerRef));
	},
	async refundPayment(_input) {
		return {
			ok: false,
			providerRef: "",
			message: "Airtel Money refunds are not configured for this merchant account."
		};
	}
};
//#endregion
//#region src/lib/payments/mpesa.ts
var MpesaProvider = {
	id: "mpesa",
	async initiatePayment(input) {
		const result = await requestMpesaStkPush({
			amount: input.amount,
			phone: input.msisdn,
			accountReference: input.reference,
			description: input.description ?? "LendFlow payment"
		});
		return {
			ok: true,
			providerRef: result.CheckoutRequestID,
			message: result.CustomerMessage ?? "Enter your M-Pesa PIN to complete payment"
		};
	},
	async verifyPayment(providerRef) {
		const result = await queryMpesaStkPush(providerRef);
		if (result.ResultCode === "0") return {
			status: "success",
			providerRef,
			raw: result
		};
		if (result.ResponseCode === "0" && !result.ResultCode) return {
			status: "pending",
			providerRef,
			raw: result
		};
		const pendingCodes = new Set(["500.001.1001", "500.001.1002"]);
		if (result.errorCode && pendingCodes.has(result.errorCode)) return {
			status: "pending",
			providerRef,
			raw: result
		};
		return {
			status: "failed",
			providerRef,
			raw: result,
			failureReason: result.ResultDesc ?? result.ResponseDescription ?? result.errorMessage
		};
	},
	async refundPayment(_input) {
		return {
			ok: false,
			providerRef: "",
			message: "M-Pesa refunds require a reversal flow and are not enabled in this app."
		};
	}
};
//#endregion
//#region src/lib/payments/mtn.ts
function baseUrl(env) {
	return env === "sandbox" ? "https://sandbox.momodeveloper.mtn.com" : "https://proxy.momoapi.mtn.com";
}
function readEnv() {
	const subKey = process.env.MTN_SUBSCRIPTION_KEY;
	const apiUser = process.env.MTN_API_USER;
	const apiKey = process.env.MTN_API_KEY;
	const targetEnv = process.env.MTN_TARGET_ENV;
	const callbackHost = process.env.MTN_CALLBACK_HOST;
	if (!subKey || !apiUser || !apiKey || !targetEnv) throw new Error("MTN MoMo not configured: set MTN_SUBSCRIPTION_KEY, MTN_API_USER, MTN_API_KEY, MTN_TARGET_ENV.");
	return {
		subKey,
		apiUser,
		apiKey,
		targetEnv,
		callbackHost
	};
}
var cachedToken = null;
async function getAccessToken() {
	const now = Date.now();
	if (cachedToken && cachedToken.expiresAt > now + 6e4) return cachedToken.token;
	const { subKey, apiUser, apiKey, targetEnv } = readEnv();
	const basic = btoa(`${apiUser}:${apiKey}`);
	const res = await fetch(`${baseUrl(targetEnv)}/collection/token/`, {
		method: "POST",
		headers: {
			Authorization: `Basic ${basic}`,
			"Ocp-Apim-Subscription-Key": subKey
		}
	});
	if (!res.ok) {
		const body = await res.text();
		throw new Error(`MTN token error ${res.status}: ${body.slice(0, 200)}`);
	}
	const json = await res.json();
	cachedToken = {
		token: json.access_token,
		expiresAt: now + json.expires_in * 1e3
	};
	return cachedToken.token;
}
function uuid() {
	return crypto.randomUUID();
}
function normalizeMsisdn(input) {
	return input.replace(/[^0-9]/g, "");
}
var MTNProvider = {
	id: "mtn",
	async initiatePayment(input) {
		if (input.amount <= 0) return {
			ok: false,
			providerRef: "",
			message: "Invalid amount"
		};
		const { subKey, targetEnv, callbackHost } = readEnv();
		const token = await getAccessToken();
		const referenceId = uuid();
		const headers = {
			Authorization: `Bearer ${token}`,
			"X-Reference-Id": referenceId,
			"X-Target-Environment": targetEnv,
			"Ocp-Apim-Subscription-Key": subKey,
			"Content-Type": "application/json"
		};
		if (callbackHost) headers["X-Callback-Url"] = `${callbackHost.replace(/\/$/, "")}/api/public/payments/mtn`;
		const body = {
			amount: String(input.amount),
			currency: input.currency,
			externalId: referenceId,
			payer: {
				partyIdType: "MSISDN",
				partyId: normalizeMsisdn(input.msisdn)
			},
			payerMessage: (input.description ?? "Akiba Loans payment").slice(0, 160),
			payeeNote: input.reference.slice(0, 160)
		};
		const res = await fetch(`${baseUrl(targetEnv)}/collection/v1_0/requesttopay`, {
			method: "POST",
			headers,
			body: JSON.stringify(body)
		});
		if (res.status !== 202) {
			const text = await res.text();
			return {
				ok: false,
				providerRef: referenceId,
				message: `MTN requestToPay ${res.status}: ${text.slice(0, 200)}`
			};
		}
		return {
			ok: true,
			providerRef: referenceId,
			message: "Awaiting customer authorization on phone"
		};
	},
	async verifyPayment(providerRef) {
		const { subKey, targetEnv } = readEnv();
		const token = await getAccessToken();
		const res = await fetch(`${baseUrl(targetEnv)}/collection/v1_0/requesttopay/${providerRef}`, { headers: {
			Authorization: `Bearer ${token}`,
			"X-Target-Environment": targetEnv,
			"Ocp-Apim-Subscription-Key": subKey
		} });
		if (!res.ok) {
			const text = await res.text();
			return {
				status: "pending",
				providerRef,
				failureReason: `lookup ${res.status}: ${text.slice(0, 120)}`
			};
		}
		const data = await res.json();
		const reason = typeof data.reason === "string" ? data.reason : data.reason?.message ?? data.reason?.code;
		if (data.status === "SUCCESSFUL") return {
			status: "success",
			providerRef,
			raw: data
		};
		if (data.status === "FAILED") return {
			status: "failed",
			providerRef,
			raw: data,
			failureReason: reason ?? "Declined"
		};
		return {
			status: "pending",
			providerRef,
			raw: data
		};
	},
	async refundPayment(_input) {
		return {
			ok: false,
			providerRef: "",
			message: "MTN refunds require a Disbursements subscription (not configured)."
		};
	}
};
//#endregion
//#region src/lib/payments/providers.ts
function getProvider(id) {
	switch (id) {
		case "mtn": return MTNProvider;
		case "airtel": return AirtelProvider;
		case "mpesa": return MpesaProvider;
	}
}
//#endregion
export { getProvider as t };

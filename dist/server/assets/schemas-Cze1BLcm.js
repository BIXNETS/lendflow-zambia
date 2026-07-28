import { z } from "zod";
//#region src/lib/schemas.ts
var COUNTRY = z.enum([
	"KE",
	"UG",
	"TZ",
	"RW",
	"GH",
	"NG"
]);
var CURRENCY = z.enum([
	"KES",
	"UGX",
	"TZS",
	"RWF",
	"GHS",
	"NGN"
]);
var profileSchema = z.object({
	full_name: z.string().trim().min(2).max(100),
	country: COUNTRY,
	phone_e164: z.string().trim().regex(/^\+\d{8,15}$/, "Phone must be in E.164 format like +2547XXXXXXXX"),
	national_id: z.string().trim().min(4).max(40),
	date_of_birth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal("")),
	address: z.string().trim().min(4).max(300),
	employment: z.string().trim().max(120).optional().or(z.literal(""))
});
var applicationSchema = z.object({
	product_id: z.string().uuid(),
	requested_amount: z.number().int().positive(),
	term_days: z.number().int().positive().max(365),
	purpose: z.string().trim().min(3).max(300)
});
var productSchema = z.object({
	id: z.string().uuid().optional(),
	name: z.string().trim().min(2).max(100),
	description: z.string().trim().max(500).optional().or(z.literal("")),
	country: COUNTRY,
	currency: CURRENCY,
	min_amount: z.number().int().positive(),
	max_amount: z.number().int().positive(),
	interest_rate_pct: z.number().min(0).max(100),
	term_days: z.number().int().positive().max(365),
	active: z.boolean()
});
var repaySchema = z.object({
	loan_id: z.string().uuid(),
	amount: z.number().int().positive(),
	provider: z.enum([
		"mtn",
		"airtel",
		"mpesa"
	]),
	msisdn: z.string().trim().regex(/^\+\d{8,15}$/, "Phone must be in E.164 format")
});
var decisionSchema = z.object({
	application_id: z.string().uuid(),
	decision: z.enum(["approve", "reject"]),
	notes: z.string().trim().max(500).optional().or(z.literal(""))
});
//#endregion
export { repaySchema as a, profileSchema as i, decisionSchema as n, productSchema as r, applicationSchema as t };

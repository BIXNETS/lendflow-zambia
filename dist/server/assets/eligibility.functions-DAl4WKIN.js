import { i as createServerFn } from "./esm-9EjmF9OT.js";
import { t as createSsrRpc } from "./createSsrRpc-BgjJZxCC.js";
import { t as requireSupabaseAuth } from "./auth-middleware-Dpn8S0gM.js";
import { z } from "zod";
//#region src/lib/eligibility.functions.ts
var getTierEligibility = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator(z.object({ userId: z.string().uuid().optional() })).handler(createSsrRpc("fa3c4a7831dbebbbbdc0d0314da29174c248e38d78c108e2bc32affe4780469d"));
createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator(z.object({
	tierId: z.string().uuid(),
	amount: z.number().positive(),
	termMonths: z.number().int().positive(),
	repaymentFrequencyDays: z.number().int().positive()
})).handler(createSsrRpc("ca7959bd604b5ed172b1fa7fc7d866b8d07012028dd8d4288c7189fcb945abf6"));
//#endregion
export { getTierEligibility as t };

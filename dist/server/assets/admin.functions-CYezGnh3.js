import { i as createServerFn } from "./esm-9EjmF9OT.js";
import { t as createSsrRpc } from "./createSsrRpc-BgjJZxCC.js";
import { t as requireSupabaseAuth } from "./auth-middleware-Dpn8S0gM.js";
import { n as decisionSchema } from "./schemas-Cze1BLcm.js";
import { z } from "zod";
//#region src/lib/admin.functions.ts
var decideApplication = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => decisionSchema.parse(input)).handler(createSsrRpc("e1d97c76be5239d2d172f793da67eb0e4c1dcbdd4dee3058f4a8ca0cf57a5762"));
var markDisbursed = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => z.object({ loan_id: z.string().uuid() }).parse(input)).handler(createSsrRpc("270ea7e6e1110855b6509e287b4279a924cbd0b6e85a03b68c84dde216d1b0b4"));
var updateKycStatus = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => z.object({
	user_id: z.string().uuid(),
	status: z.enum([
		"approved",
		"rejected",
		"in_review"
	]),
	reason: z.string().optional()
}).parse(input)).handler(createSsrRpc("b66449bef6081fffbf984f933b4199ae6ead1dc57a5731f9736d41946a263e54"));
//#endregion
export { markDisbursed as n, updateKycStatus as r, decideApplication as t };

//#region \0%23tanstack-start-server-fn-resolver
var manifest = {
	"0e367a1aed0f1eb6ad2bd4e6ec7c75e0cbab3903f09e6a617b2976db02f5dccd": {
		functionName: "getPromotionPackages_createServerFn_handler",
		importer: () => import("./payments.functions-CL9mHnbM.js")
	},
	"178900f74004694eb7b8d6ccdcf0ba64d89767102f25f4921f4ca6cf30e98506": {
		functionName: "initiateRepayment_createServerFn_handler",
		importer: () => import("./repayments.functions-Dp_poTNb.js")
	},
	"270ea7e6e1110855b6509e287b4279a924cbd0b6e85a03b68c84dde216d1b0b4": {
		functionName: "markDisbursed_createServerFn_handler",
		importer: () => import("./admin.functions-CiiA5HZZ.js")
	},
	"63d3b6a1c370511fb809943541504fe8b0c2d1a61abd30797b6b3c3630a8bc15": {
		functionName: "verifyRepayment_createServerFn_handler",
		importer: () => import("./repayments.functions-Dp_poTNb.js")
	},
	"6d13f1c941580f980c35f82ebc54e15e3695c497bbbd11619192ba99af92ece5": {
		functionName: "startMobileMoneyPackagePayment_createServerFn_handler",
		importer: () => import("./payments.functions-CL9mHnbM.js")
	},
	"964606b809aa1d6f9bd3ca10d0759b327056309e284c4b91ac9f35ed687adfc3": {
		functionName: "checkMobileMoneyPackagePayment_createServerFn_handler",
		importer: () => import("./payments.functions-CL9mHnbM.js")
	},
	"b66449bef6081fffbf984f933b4199ae6ead1dc57a5731f9736d41946a263e54": {
		functionName: "updateKycStatus_createServerFn_handler",
		importer: () => import("./admin.functions-CiiA5HZZ.js")
	},
	"ca7959bd604b5ed172b1fa7fc7d866b8d07012028dd8d4288c7189fcb945abf6": {
		functionName: "applyForLoan_createServerFn_handler",
		importer: () => import("./eligibility.functions-BOv0y0HE.js")
	},
	"e1d97c76be5239d2d172f793da67eb0e4c1dcbdd4dee3058f4a8ca0cf57a5762": {
		functionName: "decideApplication_createServerFn_handler",
		importer: () => import("./admin.functions-CiiA5HZZ.js")
	},
	"fa3c4a7831dbebbbbdc0d0314da29174c248e38d78c108e2bc32affe4780469d": {
		functionName: "getTierEligibility_createServerFn_handler",
		importer: () => import("./eligibility.functions-BOv0y0HE.js")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };

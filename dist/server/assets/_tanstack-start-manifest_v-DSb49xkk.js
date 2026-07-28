//#region \0tanstack-start-manifest:v
var tsrStartManifest = () => ({ routes: {
	__root__: {
		filePath: "/home/whrite/Desktop/Projects/lendflow/src/routes/__root.tsx",
		children: [
			"/",
			"/_authenticated",
			"/auth",
			"/loans-calculator",
			"/api/public/payments/$provider"
		],
		css: ["/assets/index-CysIsZjG.css"],
		preloads: [
			"/assets/index-4jlrwbCF.js",
			"/assets/jsx-runtime-bzQ4Vb5N.js",
			"/assets/useStore-DEJ6VQYh.js",
			"/assets/link-DsYZLIHZ.js",
			"/assets/matchContext-CeRjqyBa.js",
			"/assets/useRouter-Cjk_0i46.js",
			"/assets/useMatch-Cq79N93C.js",
			"/assets/utils-DVIDEbJ1.js",
			"/assets/invariant-DEEwAagU.js",
			"/assets/redirect-CaDPrkdo.js",
			"/assets/root-DLTE-HSj.js",
			"/assets/dist-C1RJhgYD.js",
			"/assets/utils-B6KiDbIe.js",
			"/assets/createLucideIcon-DeQrcgrh.js",
			"/assets/react-dom-DUKFG4MT.js"
		],
		scripts: [{ attrs: {
			type: "module",
			async: !0,
			src: "/assets/index-4jlrwbCF.js"
		} }]
	},
	"/": {
		filePath: "/home/whrite/Desktop/Projects/lendflow/src/routes/index.tsx",
		children: void 0,
		preloads: [
			"/assets/routes-DEJSUoQ6.js",
			"/assets/shield-check-DRzoqlHD.js",
			"/assets/zap-CNmpbX0l.js",
			"/assets/button-CW_VAcxM.js"
		]
	},
	"/_authenticated": {
		filePath: "/home/whrite/Desktop/Projects/lendflow/src/routes/_authenticated/route.tsx",
		children: [
			"/_authenticated/admin",
			"/_authenticated/app",
			"/_authenticated/dashboard",
			"/_authenticated/eligibility",
			"/_authenticated/kyc"
		],
		preloads: ["/assets/route-DWXqd4BF.js"]
	},
	"/auth": {
		filePath: "/home/whrite/Desktop/Projects/lendflow/src/routes/auth.tsx",
		children: ["/auth/reset-password"],
		preloads: [
			"/assets/auth-B-2kbF56.js",
			"/assets/label-HWg2Zfn7.js",
			"/assets/button-CW_VAcxM.js",
			"/assets/input-ybUNh9ew.js"
		]
	},
	"/loans-calculator": {
		filePath: "/home/whrite/Desktop/Projects/lendflow/src/routes/loans-calculator.tsx",
		children: void 0,
		preloads: [
			"/assets/loans-calculator-DGZjbGOU.js",
			"/assets/clock-D8_Twrcp.js",
			"/assets/zap-CNmpbX0l.js",
			"/assets/trending-up-BLNUKBl-.js",
			"/assets/button-CW_VAcxM.js"
		]
	},
	"/_authenticated/admin": {
		filePath: "/home/whrite/Desktop/Projects/lendflow/src/routes/_authenticated/admin.tsx",
		children: [
			"/_authenticated/admin/analytics",
			"/_authenticated/admin/applications",
			"/_authenticated/admin/audit",
			"/_authenticated/admin/collections",
			"/_authenticated/admin/eligibility",
			"/_authenticated/admin/kyc",
			"/_authenticated/admin/loans",
			"/_authenticated/admin/products",
			"/_authenticated/admin/tiers",
			"/_authenticated/admin/users",
			"/_authenticated/admin/"
		],
		preloads: [
			"/assets/admin-BRhlIOgD.js",
			"/assets/useRouterState-C99liEQ8.js",
			"/assets/arrow-left-DWsA1N-W.js",
			"/assets/banknote-BxomcnAc.js",
			"/assets/file-check-corner-CBnjCIOa.js",
			"/assets/log-out-DoLQqS8K.js",
			"/assets/trending-up-BLNUKBl-.js",
			"/assets/users-CG7u0fQJ.js",
			"/assets/button-CW_VAcxM.js"
		]
	},
	"/_authenticated/app": {
		filePath: "/home/whrite/Desktop/Projects/lendflow/src/routes/_authenticated/app.tsx",
		children: [
			"/_authenticated/app/kyc",
			"/_authenticated/app/loans",
			"/_authenticated/app/profile",
			"/_authenticated/app/"
		],
		preloads: [
			"/assets/app-B_pzvnPt.js",
			"/assets/useRouterState-C99liEQ8.js",
			"/assets/log-out-DoLQqS8K.js",
			"/assets/shield-check-DRzoqlHD.js",
			"/assets/wallet-D0ZsrWOM.js",
			"/assets/button-CW_VAcxM.js"
		]
	},
	"/_authenticated/dashboard": {
		filePath: "/home/whrite/Desktop/Projects/lendflow/src/routes/_authenticated/dashboard.tsx",
		children: void 0,
		preloads: [
			"/assets/dashboard-CeLxdjIT.js",
			"/assets/auth-middleware-DRo0xiFd.js",
			"/assets/banknote-BxomcnAc.js",
			"/assets/clock-D8_Twrcp.js",
			"/assets/file-check-corner-CBnjCIOa.js",
			"/assets/log-out-DoLQqS8K.js",
			"/assets/shield-check-DRzoqlHD.js",
			"/assets/sparkles-b6Z3h6qd.js",
			"/assets/wallet-D0ZsrWOM.js"
		]
	},
	"/_authenticated/eligibility": {
		filePath: "/home/whrite/Desktop/Projects/lendflow/src/routes/_authenticated/eligibility.tsx",
		children: void 0,
		preloads: [
			"/assets/eligibility-DXflBGPp.js",
			"/assets/auth-middleware-DRo0xiFd.js",
			"/assets/sparkles-b6Z3h6qd.js",
			"/assets/eligibility.functions-BrfQsCL5.js"
		]
	},
	"/_authenticated/kyc": {
		filePath: "/home/whrite/Desktop/Projects/lendflow/src/routes/_authenticated/kyc.tsx",
		children: void 0,
		preloads: [
			"/assets/kyc-2da4odGd.js",
			"/assets/arrow-left-DWsA1N-W.js",
			"/assets/clock-D8_Twrcp.js",
			"/assets/upload-DsjEK5H6.js"
		]
	},
	"/auth/reset-password": {
		filePath: "/home/whrite/Desktop/Projects/lendflow/src/routes/auth.reset-password.tsx",
		children: void 0,
		preloads: ["/assets/auth.reset-password-Dt_ZPXRq.js"]
	},
	"/_authenticated/admin/analytics": {
		filePath: "/home/whrite/Desktop/Projects/lendflow/src/routes/_authenticated/admin.analytics.tsx",
		children: void 0,
		preloads: [
			"/assets/admin.analytics-DgtJWUSD.js",
			"/assets/useQuery-C0nQoDMP.js",
			"/assets/format-CYAkvTqe.js"
		]
	},
	"/_authenticated/admin/applications": {
		filePath: "/home/whrite/Desktop/Projects/lendflow/src/routes/_authenticated/admin.applications.tsx",
		children: void 0,
		preloads: [
			"/assets/admin.applications-D-ikm_tx.js",
			"/assets/useQuery-C0nQoDMP.js",
			"/assets/auth-middleware-DRo0xiFd.js",
			"/assets/status-pill-Dot-qnpi.js",
			"/assets/admin.functions-bmEHpYfh.js",
			"/assets/format-CYAkvTqe.js"
		]
	},
	"/_authenticated/admin/audit": {
		filePath: "/home/whrite/Desktop/Projects/lendflow/src/routes/_authenticated/admin.audit.tsx",
		children: void 0,
		preloads: [
			"/assets/admin.audit-CGTafbhP.js",
			"/assets/useQuery-C0nQoDMP.js",
			"/assets/format-CYAkvTqe.js"
		]
	},
	"/_authenticated/admin/collections": {
		filePath: "/home/whrite/Desktop/Projects/lendflow/src/routes/_authenticated/admin.collections.tsx",
		children: void 0,
		preloads: [
			"/assets/admin.collections-yuq5s3ax.js",
			"/assets/useQuery-C0nQoDMP.js",
			"/assets/status-pill-Dot-qnpi.js",
			"/assets/format-CYAkvTqe.js"
		]
	},
	"/_authenticated/admin/eligibility": {
		filePath: "/home/whrite/Desktop/Projects/lendflow/src/routes/_authenticated/admin.eligibility.tsx",
		children: void 0,
		preloads: [
			"/assets/admin.eligibility-zt0pjFlP.js",
			"/assets/label-HWg2Zfn7.js",
			"/assets/auth-middleware-DRo0xiFd.js",
			"/assets/sparkles-b6Z3h6qd.js",
			"/assets/input-ybUNh9ew.js",
			"/assets/eligibility.functions-BrfQsCL5.js"
		]
	},
	"/_authenticated/admin/kyc": {
		filePath: "/home/whrite/Desktop/Projects/lendflow/src/routes/_authenticated/admin.kyc.tsx",
		children: void 0,
		preloads: [
			"/assets/admin.kyc-CYg0DLUo.js",
			"/assets/useQuery-C0nQoDMP.js",
			"/assets/auth-middleware-DRo0xiFd.js",
			"/assets/status-pill-Dot-qnpi.js",
			"/assets/admin.functions-bmEHpYfh.js"
		]
	},
	"/_authenticated/admin/loans": {
		filePath: "/home/whrite/Desktop/Projects/lendflow/src/routes/_authenticated/admin.loans.tsx",
		children: void 0,
		preloads: [
			"/assets/admin.loans-guXcTbi7.js",
			"/assets/useQuery-C0nQoDMP.js",
			"/assets/auth-middleware-DRo0xiFd.js",
			"/assets/status-pill-Dot-qnpi.js",
			"/assets/admin.functions-bmEHpYfh.js",
			"/assets/format-CYAkvTqe.js"
		]
	},
	"/_authenticated/admin/products": {
		filePath: "/home/whrite/Desktop/Projects/lendflow/src/routes/_authenticated/admin.products.tsx",
		children: void 0,
		preloads: [
			"/assets/admin.products-DDUg289O.js",
			"/assets/select-DIeInjBQ.js",
			"/assets/label-HWg2Zfn7.js",
			"/assets/switch-CBwDNdRv.js",
			"/assets/useQuery-C0nQoDMP.js",
			"/assets/input-ybUNh9ew.js",
			"/assets/format-CYAkvTqe.js",
			"/assets/schemas-C85EfFrF.js"
		]
	},
	"/_authenticated/admin/tiers": {
		filePath: "/home/whrite/Desktop/Projects/lendflow/src/routes/_authenticated/admin.tiers.tsx",
		children: void 0,
		preloads: [
			"/assets/admin.tiers-Cxxl_ghn.js",
			"/assets/dist-tz3Fsx2n.js",
			"/assets/dist-D11jfPcz.js",
			"/assets/Combination-CJFqljL8.js",
			"/assets/label-HWg2Zfn7.js",
			"/assets/switch-CBwDNdRv.js",
			"/assets/input-ybUNh9ew.js",
			"/assets/textarea-h9sk1H2c.js"
		]
	},
	"/_authenticated/admin/users": {
		filePath: "/home/whrite/Desktop/Projects/lendflow/src/routes/_authenticated/admin.users.tsx",
		children: void 0,
		preloads: [
			"/assets/admin.users-BHfWPwQi.js",
			"/assets/useQuery-C0nQoDMP.js",
			"/assets/status-pill-Dot-qnpi.js",
			"/assets/input-ybUNh9ew.js",
			"/assets/format-CYAkvTqe.js"
		]
	},
	"/_authenticated/app/kyc": {
		filePath: "/home/whrite/Desktop/Projects/lendflow/src/routes/_authenticated/app.kyc.tsx",
		children: void 0,
		preloads: [
			"/assets/app.kyc-CmYhskfP.js",
			"/assets/select-DIeInjBQ.js",
			"/assets/label-HWg2Zfn7.js",
			"/assets/useQuery-C0nQoDMP.js",
			"/assets/upload-DsjEK5H6.js",
			"/assets/status-pill-Dot-qnpi.js"
		]
	},
	"/_authenticated/app/loans": {
		filePath: "/home/whrite/Desktop/Projects/lendflow/src/routes/_authenticated/app.loans.tsx",
		children: ["/_authenticated/app/loans/$id", "/_authenticated/app/loans/apply"],
		preloads: [
			"/assets/app.loans-CqJeBjND.js",
			"/assets/useQuery-C0nQoDMP.js",
			"/assets/status-pill-Dot-qnpi.js",
			"/assets/format-CYAkvTqe.js"
		]
	},
	"/_authenticated/app/profile": {
		filePath: "/home/whrite/Desktop/Projects/lendflow/src/routes/_authenticated/app.profile.tsx",
		children: void 0,
		preloads: [
			"/assets/app.profile-BwMMk0Hz.js",
			"/assets/select-DIeInjBQ.js",
			"/assets/label-HWg2Zfn7.js",
			"/assets/useQuery-C0nQoDMP.js",
			"/assets/input-ybUNh9ew.js",
			"/assets/textarea-h9sk1H2c.js",
			"/assets/format-CYAkvTqe.js",
			"/assets/schemas-C85EfFrF.js"
		]
	},
	"/_authenticated/admin/": {
		filePath: "/home/whrite/Desktop/Projects/lendflow/src/routes/_authenticated/admin.index.tsx",
		children: void 0,
		preloads: [
			"/assets/admin.index-4nWeYy2d.js",
			"/assets/useQuery-C0nQoDMP.js",
			"/assets/wallet-D0ZsrWOM.js",
			"/assets/kpi-card-DFWbIYgl.js",
			"/assets/format-CYAkvTqe.js"
		]
	},
	"/_authenticated/app/": {
		filePath: "/home/whrite/Desktop/Projects/lendflow/src/routes/_authenticated/app.index.tsx",
		children: void 0,
		preloads: [
			"/assets/app.index-BmMGf_4o.js",
			"/assets/useQuery-C0nQoDMP.js",
			"/assets/trending-up-BLNUKBl-.js",
			"/assets/kpi-card-DFWbIYgl.js",
			"/assets/status-pill-Dot-qnpi.js",
			"/assets/format-CYAkvTqe.js"
		]
	},
	"/_authenticated/app/loans/$id": {
		filePath: "/home/whrite/Desktop/Projects/lendflow/src/routes/_authenticated/app.loans.$id.tsx",
		children: void 0,
		preloads: [
			"/assets/app.loans._id-BoqTi50I.js",
			"/assets/select-DIeInjBQ.js",
			"/assets/label-HWg2Zfn7.js",
			"/assets/auth-middleware-DRo0xiFd.js",
			"/assets/input-ybUNh9ew.js"
		]
	},
	"/_authenticated/app/loans/apply": {
		filePath: "/home/whrite/Desktop/Projects/lendflow/src/routes/_authenticated/app.loans.apply.tsx",
		children: void 0,
		preloads: [
			"/assets/app.loans.apply-Dx8D4n3F.js",
			"/assets/dist-qEV9u1Ef.js",
			"/assets/dist-tz3Fsx2n.js",
			"/assets/dist-D11jfPcz.js",
			"/assets/label-HWg2Zfn7.js",
			"/assets/input-ybUNh9ew.js",
			"/assets/textarea-h9sk1H2c.js",
			"/assets/schemas-C85EfFrF.js"
		]
	}
} });
//#endregion
export { tsrStartManifest };

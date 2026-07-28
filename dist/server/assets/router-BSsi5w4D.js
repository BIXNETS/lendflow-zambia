import { t as settleToMpesaWallet } from "./settlement-ChyNMCJ9.js";
import { t as getProvider } from "./providers-DSQ8GxEs.js";
import { t as supabase } from "./client-CrwDbVDs.js";
import { n as Route$27 } from "./eligibility-DVGbW3va.js";
import { t as Route$28 } from "./app.loans._id-0j5orLXI.js";
import { useEffect } from "react";
import { HeadContent, Link, Outlet, Scripts, createFileRoute, createRootRouteWithContext, createRouter, lazyRouteComponent, redirect, useRouter } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { z } from "zod";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
//#region src/components/ui/sonner.tsx
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ jsx(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
//#endregion
//#region src/styles.css?url
var styles_default = "/assets/styles-Br0DM9l6.css";
//#endregion
//#region src/lib/lovable-error-reporting.ts
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
//#endregion
//#region src/routes/__root.tsx
function NotFoundComponent() {
	return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ jsx("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ jsx("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-6",
					children: /* @__PURE__ */ jsx(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	useEffect(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ jsx("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ jsx("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ jsx("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$26 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Akiba Loans — Mobile money loans across Africa" },
			{
				name: "description",
				content: "Fast, fair digital loans on M-Pesa, MTN MoMo and Airtel Money. Apply in 2 minutes."
			},
			{
				name: "author",
				content: "Akiba Loans"
			},
			{
				property: "og:title",
				content: "Akiba Loans"
			},
			{
				property: "og:description",
				content: "Fair credit, instantly. On your phone."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [{
			rel: "stylesheet",
			href: styles_default
		}]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ jsxs("html", {
		lang: "en",
		children: [/* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }), /* @__PURE__ */ jsxs("body", { children: [children, /* @__PURE__ */ jsx(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$26.useRouteContext();
	const router = useRouter();
	useEffect(() => {
		const { data: sub } = supabase.auth.onAuthStateChange((event) => {
			if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
			router.invalidate();
			if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
		});
		return () => sub.subscription.unsubscribe();
	}, [router, queryClient]);
	return /* @__PURE__ */ jsxs(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ jsx(Outlet, {}), /* @__PURE__ */ jsx(Toaster$1, {
			richColors: true,
			position: "top-right"
		})]
	});
}
//#endregion
//#region src/routes/loans-calculator.tsx
var $$splitComponentImporter$24 = () => import("./loans-calculator-CHxNCW7U.js");
var Route$25 = createFileRoute("/loans-calculator")({
	head: () => ({ meta: [{ title: "Loan Calculator — LendFlow Zambia" }, {
		name: "description",
		content: "Estimate your repayments and compare instant mobile money loan offers across Zambian lenders."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$24, "component")
});
//#endregion
//#region src/routes/auth.tsx
var $$splitComponentImporter$23 = () => import("./auth-DB-MLbin.js");
var search = z.object({ mode: z.enum(["signin", "signup"]).optional() });
var Route$24 = createFileRoute("/auth")({
	validateSearch: search,
	head: () => ({ meta: [
		{ title: "Sign in — Akiba Loans" },
		{
			name: "description",
			content: "Sign in to Akiba Loans to apply for fast mobile-money loans across Africa."
		},
		{
			property: "og:title",
			content: "Akiba Loans — Sign in"
		},
		{
			property: "og:description",
			content: "Fast, fair digital loans across Kenya, Uganda, Tanzania, Rwanda, Ghana and Nigeria."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$23, "component")
});
//#endregion
//#region src/routes/_authenticated/route.tsx
var $$splitComponentImporter$22 = () => import("./route-Di7iQBCH.js");
var Route$23 = createFileRoute("/_authenticated")({
	ssr: false,
	beforeLoad: async () => {
		const { data, error } = await supabase.auth.getUser();
		if (error || !data.user) throw redirect({ to: "/auth" });
		return { user: data.user };
	},
	component: lazyRouteComponent($$splitComponentImporter$22, "component")
});
//#endregion
//#region src/routes/index.tsx
var $$splitComponentImporter$21 = () => import("./routes-xrAfIFp8.js");
var Route$22 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "Akiba Loans — Fast mobile money loans across Africa" },
		{
			name: "description",
			content: "Apply in 2 minutes. Funds straight to M-Pesa, MTN MoMo or Airtel Money. Trusted by borrowers in Kenya, Uganda, Tanzania, Rwanda, Ghana and Nigeria."
		},
		{
			property: "og:title",
			content: "Akiba Loans — Fast mobile money loans"
		},
		{
			property: "og:description",
			content: "Fair credit, instantly. Apply, get approved, and receive funds on your phone."
		},
		{
			property: "og:type",
			content: "website"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$21, "component")
});
//#endregion
//#region src/routes/auth.reset-password.tsx
var $$splitComponentImporter$20 = () => import("./auth.reset-password-CHoesgj0.js");
var Route$21 = createFileRoute("/auth/reset-password")({
	head: () => ({ meta: [{ title: "Reset password — Akiba Loans" }] }),
	component: lazyRouteComponent($$splitComponentImporter$20, "component")
});
//#endregion
//#region src/routes/_authenticated/kyc.tsx
var $$splitComponentImporter$19 = () => import("./kyc-wH7aSBCo.js");
var Route$20 = createFileRoute("/_authenticated/kyc")({
	head: () => ({ meta: [{ title: "Verify identity — LendFlow Zambia" }] }),
	component: lazyRouteComponent($$splitComponentImporter$19, "component")
});
//#endregion
//#region src/routes/_authenticated/dashboard.tsx
var $$splitComponentImporter$18 = () => import("./dashboard-mhkgk3DR.js");
var Route$19 = createFileRoute("/_authenticated/dashboard")({
	head: () => ({ meta: [{ title: "Dashboard — LendFlow Zambia" }] }),
	component: lazyRouteComponent($$splitComponentImporter$18, "component")
});
//#endregion
//#region src/routes/_authenticated/app.tsx
var $$splitComponentImporter$17 = () => import("./app-CMhG049C.js");
var Route$18 = createFileRoute("/_authenticated/app")({ component: lazyRouteComponent($$splitComponentImporter$17, "component") });
//#endregion
//#region src/routes/_authenticated/admin.tsx
var $$splitComponentImporter$16 = () => import("./admin-0gcOheiE.js");
var Route$17 = createFileRoute("/_authenticated/admin")({
	ssr: false,
	beforeLoad: async () => {
		const { data: u } = await supabase.auth.getUser();
		if (!u.user) throw redirect({ to: "/auth" });
		const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", u.user.id);
		if (!roles?.some((r) => r.role === "admin" || r.role === "reviewer")) throw redirect({ to: "/app" });
	},
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
//#endregion
//#region src/routes/_authenticated/app.index.tsx
var $$splitComponentImporter$15 = () => import("./app.index-lVXu7ALs.js");
var Route$16 = createFileRoute("/_authenticated/app/")({
	head: () => ({ meta: [{ title: "Dashboard — Akiba" }] }),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
//#endregion
//#region src/routes/_authenticated/admin.index.tsx
var $$splitComponentImporter$14 = () => import("./admin.index-RzDN98_Z.js");
var Route$15 = createFileRoute("/_authenticated/admin/")({
	head: () => ({ meta: [{ title: "Admin — Akiba" }] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
//#endregion
//#region src/routes/_authenticated/app.profile.tsx
var $$splitComponentImporter$13 = () => import("./app.profile-CnOUJPEK.js");
var Route$14 = createFileRoute("/_authenticated/app/profile")({
	head: () => ({ meta: [{ title: "Profile — Akiba" }] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
//#endregion
//#region src/routes/_authenticated/app.loans.tsx
var $$splitComponentImporter$12 = () => import("./app.loans-CJKuuTzy.js");
var Route$13 = createFileRoute("/_authenticated/app/loans")({
	head: () => ({ meta: [{ title: "Loans — Akiba" }] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
//#endregion
//#region src/routes/_authenticated/app.kyc.tsx
var $$splitComponentImporter$11 = () => import("./app.kyc-D9BOV7dW.js");
var Route$12 = createFileRoute("/_authenticated/app/kyc")({
	head: () => ({ meta: [{ title: "Verification — Akiba" }] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
//#endregion
//#region src/routes/_authenticated/admin.users.tsx
var $$splitComponentImporter$10 = () => import("./admin.users-C-Gezymh.js");
var Route$11 = createFileRoute("/_authenticated/admin/users")({
	head: () => ({ meta: [{ title: "Users — Admin" }] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
//#endregion
//#region src/routes/_authenticated/admin.tiers.tsx
var $$splitComponentImporter$9 = () => import("./admin.tiers-Dr44buGT.js");
var Route$10 = createFileRoute("/_authenticated/admin/tiers")({
	head: () => ({ meta: [{ title: "Loan tiers — Admin" }] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
//#endregion
//#region src/routes/_authenticated/admin.products.tsx
var $$splitComponentImporter$8 = () => import("./admin.products-DeLcWr91.js");
var Route$9 = createFileRoute("/_authenticated/admin/products")({
	head: () => ({ meta: [{ title: "Products — Admin" }] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
//#endregion
//#region src/routes/_authenticated/admin.loans.tsx
var $$splitComponentImporter$7 = () => import("./admin.loans-hbktecyp.js");
var Route$8 = createFileRoute("/_authenticated/admin/loans")({
	head: () => ({ meta: [{ title: "Loans — Admin" }] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
//#endregion
//#region src/routes/_authenticated/admin.kyc.tsx
var $$splitComponentImporter$6 = () => import("./admin.kyc-DSBA45wq.js");
var Route$7 = createFileRoute("/_authenticated/admin/kyc")({
	head: () => ({ meta: [{ title: "KYC queue — Admin" }] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
//#endregion
//#region src/routes/_authenticated/admin.eligibility.tsx
var $$splitComponentImporter$5 = () => import("./admin.eligibility-DoCOLgk6.js");
var Route$6 = createFileRoute("/_authenticated/admin/eligibility")({
	head: () => ({ meta: [{ title: "Eligibility preview — Admin" }] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
//#endregion
//#region src/routes/_authenticated/admin.collections.tsx
var $$splitComponentImporter$4 = () => import("./admin.collections-DmbCADpx.js");
var Route$5 = createFileRoute("/_authenticated/admin/collections")({
	head: () => ({ meta: [{ title: "Collections — Admin" }] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
//#endregion
//#region src/routes/_authenticated/admin.audit.tsx
var $$splitComponentImporter$3 = () => import("./admin.audit-DesYyvvl.js");
var Route$4 = createFileRoute("/_authenticated/admin/audit")({
	head: () => ({ meta: [{ title: "Audit log — Admin" }] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
//#endregion
//#region src/routes/_authenticated/admin.applications.tsx
var $$splitComponentImporter$2 = () => import("./admin.applications-CjDZFHzs.js");
var Route$3 = createFileRoute("/_authenticated/admin/applications")({
	head: () => ({ meta: [{ title: "Applications — Admin" }] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
//#endregion
//#region src/routes/_authenticated/admin.analytics.tsx
var $$splitComponentImporter$1 = () => import("./admin.analytics-DjBvyE-k.js");
var Route$2 = createFileRoute("/_authenticated/admin/analytics")({
	head: () => ({ meta: [{ title: "Analytics — Admin" }] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
//#endregion
//#region src/routes/api/public/payments/$provider.ts
var KNOWN = [
	"mtn",
	"airtel",
	"mpesa"
];
var B2C_CALLBACKS = ["mpesa-b2c", "mpesa-b2c-timeout"];
var Route$1 = createFileRoute("/api/public/payments/$provider")({ server: { handlers: { POST: async ({ request, params }) => {
	const providerParam = params.provider;
	if (!KNOWN.includes(providerParam) && !B2C_CALLBACKS.includes(providerParam)) return new Response("Unknown provider", { status: 404 });
	let payload = null;
	try {
		payload = await request.json();
	} catch {
		return new Response("invalid json", { status: 400 });
	}
	if (B2C_CALLBACKS.includes(providerParam)) {
		const result = payload.Body?.Result;
		const originatorConversationId = result?.OriginatorConversationID ?? payload.OriginatorConversationID;
		if (!originatorConversationId) return new Response("missing conversation id", { status: 400 });
		const [sourceTable, sourceId] = originatorConversationId.split(/-(.+)/);
		if (!sourceTable || !sourceId) return new Response("invalid conversation id", { status: 400 });
		const resultCode = String(result?.ResultCode ?? payload.ResultCode ?? "");
		const success = providerParam === "mpesa-b2c" && resultCode === "0";
		const { supabaseAdmin } = await import("./client.server-D1oHePJa.js");
		await supabaseAdmin.from("payment_settlements").update({
			status: success ? "completed" : "failed",
			failure_reason: success ? null : String(result?.ResultDesc ?? payload.ResultDesc ?? "M-Pesa B2C callback failed"),
			raw_response: payload
		}).eq("source_table", sourceTable).eq("source_id", sourceId);
		return Response.json({ ok: true });
	}
	const provider = providerParam;
	let ref;
	if (provider === "mtn") ref = payload?.externalId ?? payload?.referenceId;
	else if (provider === "mpesa") ref = ((payload?.Body)?.stkCallback)?.CheckoutRequestID ?? payload?.CheckoutRequestID ?? payload?.providerRef;
	else ref = (payload?.transaction)?.id ?? payload?.id ?? payload?.providerRef ?? payload?.reference;
	if (!ref) return new Response("missing reference", { status: 400 });
	const { supabaseAdmin } = await import("./client.server-D1oHePJa.js");
	const { data: tx } = await supabaseAdmin.from("transactions").select("id, status, loan_id, user_id, amount, provider, provider_ref").eq("provider_ref", ref).maybeSingle();
	if (!tx) return new Response("unknown ref", { status: 404 });
	if (tx.status !== "pending") return Response.json({
		ok: true,
		already: tx.status
	});
	const verify = await getProvider(provider).verifyPayment(ref);
	if (verify.status === "pending") return Response.json({
		ok: true,
		status: "pending"
	});
	const success = verify.status === "success";
	const failureReason = verify.failureReason;
	await supabaseAdmin.from("transactions").update({
		status: success ? "success" : "failed",
		failure_reason: success ? null : failureReason ?? "Declined",
		raw_payload: {
			callback: payload,
			verify: verify.raw
		}
	}).eq("id", tx.id);
	if (success && tx.loan_id) {
		const { data: loan } = await supabaseAdmin.from("loans").select("outstanding").eq("id", tx.loan_id).single();
		if (loan) {
			const newOut = Math.max(0, loan.outstanding - tx.amount);
			await supabaseAdmin.from("loans").update({
				outstanding: newOut,
				status: newOut === 0 ? "completed" : "active"
			}).eq("id", tx.loan_id);
			const { data: schedules } = await supabaseAdmin.from("repayment_schedules").select("id, amount_due, amount_paid, status").eq("loan_id", tx.loan_id).order("installment_no", { ascending: true });
			let remaining = tx.amount;
			for (const s of schedules ?? []) {
				if (remaining <= 0) break;
				if (s.status === "paid") continue;
				const need = s.amount_due - s.amount_paid;
				const pay = Math.min(need, remaining);
				const paid = s.amount_paid + pay;
				await supabaseAdmin.from("repayment_schedules").update({
					amount_paid: paid,
					status: paid >= s.amount_due ? "paid" : "partial"
				}).eq("id", s.id);
				remaining -= pay;
			}
		}
		await settleToMpesaWallet({
			source: "transaction",
			sourceId: tx.id,
			provider,
			amount: tx.amount
		}).catch((error) => {
			console.error("M-Pesa settlement submission failed", error);
		});
	}
	return Response.json({ ok: true });
} } } });
//#endregion
//#region src/routes/_authenticated/app.loans.apply.tsx
var $$splitComponentImporter = () => import("./app.loans.apply-G2nh0Gsh.js");
var Route = createFileRoute("/_authenticated/app/loans/apply")({
	head: () => ({ meta: [{ title: "Apply for a loan — Akiba" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
//#region src/routeTree.gen.ts
var LoansCalculatorRoute = Route$25.update({
	id: "/loans-calculator",
	path: "/loans-calculator",
	getParentRoute: () => Route$26
});
var AuthRoute = Route$24.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$26
});
var AuthenticatedRouteRoute = Route$23.update({
	id: "/_authenticated",
	getParentRoute: () => Route$26
});
var IndexRoute = Route$22.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$26
});
var AuthResetPasswordRoute = Route$21.update({
	id: "/reset-password",
	path: "/reset-password",
	getParentRoute: () => AuthRoute
});
var AuthenticatedKycRoute = Route$20.update({
	id: "/kyc",
	path: "/kyc",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedEligibilityRoute = Route$27.update({
	id: "/eligibility",
	path: "/eligibility",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedDashboardRoute = Route$19.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAppRoute = Route$18.update({
	id: "/app",
	path: "/app",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAdminRoute = Route$17.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAppIndexRoute = Route$16.update({
	id: "/",
	path: "/",
	getParentRoute: () => AuthenticatedAppRoute
});
var AuthenticatedAdminIndexRoute = Route$15.update({
	id: "/",
	path: "/",
	getParentRoute: () => AuthenticatedAdminRoute
});
var AuthenticatedAppProfileRoute = Route$14.update({
	id: "/profile",
	path: "/profile",
	getParentRoute: () => AuthenticatedAppRoute
});
var AuthenticatedAppLoansRoute = Route$13.update({
	id: "/loans",
	path: "/loans",
	getParentRoute: () => AuthenticatedAppRoute
});
var AuthenticatedAppKycRoute = Route$12.update({
	id: "/kyc",
	path: "/kyc",
	getParentRoute: () => AuthenticatedAppRoute
});
var AuthenticatedAdminUsersRoute = Route$11.update({
	id: "/users",
	path: "/users",
	getParentRoute: () => AuthenticatedAdminRoute
});
var AuthenticatedAdminTiersRoute = Route$10.update({
	id: "/tiers",
	path: "/tiers",
	getParentRoute: () => AuthenticatedAdminRoute
});
var AuthenticatedAdminProductsRoute = Route$9.update({
	id: "/products",
	path: "/products",
	getParentRoute: () => AuthenticatedAdminRoute
});
var AuthenticatedAdminLoansRoute = Route$8.update({
	id: "/loans",
	path: "/loans",
	getParentRoute: () => AuthenticatedAdminRoute
});
var AuthenticatedAdminKycRoute = Route$7.update({
	id: "/kyc",
	path: "/kyc",
	getParentRoute: () => AuthenticatedAdminRoute
});
var AuthenticatedAdminEligibilityRoute = Route$6.update({
	id: "/eligibility",
	path: "/eligibility",
	getParentRoute: () => AuthenticatedAdminRoute
});
var AuthenticatedAdminCollectionsRoute = Route$5.update({
	id: "/collections",
	path: "/collections",
	getParentRoute: () => AuthenticatedAdminRoute
});
var AuthenticatedAdminAuditRoute = Route$4.update({
	id: "/audit",
	path: "/audit",
	getParentRoute: () => AuthenticatedAdminRoute
});
var AuthenticatedAdminApplicationsRoute = Route$3.update({
	id: "/applications",
	path: "/applications",
	getParentRoute: () => AuthenticatedAdminRoute
});
var AuthenticatedAdminAnalyticsRoute = Route$2.update({
	id: "/analytics",
	path: "/analytics",
	getParentRoute: () => AuthenticatedAdminRoute
});
var ApiPublicPaymentsProviderRoute = Route$1.update({
	id: "/api/public/payments/$provider",
	path: "/api/public/payments/$provider",
	getParentRoute: () => Route$26
});
var AuthenticatedAppLoansApplyRoute = Route.update({
	id: "/apply",
	path: "/apply",
	getParentRoute: () => AuthenticatedAppLoansRoute
});
var AuthenticatedAppLoansIdRoute = Route$28.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => AuthenticatedAppLoansRoute
});
var AuthenticatedAdminRouteChildren = {
	AuthenticatedAdminAnalyticsRoute,
	AuthenticatedAdminApplicationsRoute,
	AuthenticatedAdminAuditRoute,
	AuthenticatedAdminCollectionsRoute,
	AuthenticatedAdminEligibilityRoute,
	AuthenticatedAdminKycRoute,
	AuthenticatedAdminLoansRoute,
	AuthenticatedAdminProductsRoute,
	AuthenticatedAdminTiersRoute,
	AuthenticatedAdminUsersRoute,
	AuthenticatedAdminIndexRoute
};
var AuthenticatedAdminRouteWithChildren = AuthenticatedAdminRoute._addFileChildren(AuthenticatedAdminRouteChildren);
var AuthenticatedAppLoansRouteChildren = {
	AuthenticatedAppLoansIdRoute,
	AuthenticatedAppLoansApplyRoute
};
var AuthenticatedAppRouteChildren = {
	AuthenticatedAppKycRoute,
	AuthenticatedAppLoansRoute: AuthenticatedAppLoansRoute._addFileChildren(AuthenticatedAppLoansRouteChildren),
	AuthenticatedAppProfileRoute,
	AuthenticatedAppIndexRoute
};
var AuthenticatedRouteRouteChildren = {
	AuthenticatedAdminRoute: AuthenticatedAdminRouteWithChildren,
	AuthenticatedAppRoute: AuthenticatedAppRoute._addFileChildren(AuthenticatedAppRouteChildren),
	AuthenticatedDashboardRoute,
	AuthenticatedEligibilityRoute,
	AuthenticatedKycRoute
};
var AuthenticatedRouteRouteWithChildren = AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren);
var AuthRouteChildren = { AuthResetPasswordRoute };
var rootRouteChildren = {
	IndexRoute,
	AuthenticatedRouteRoute: AuthenticatedRouteRouteWithChildren,
	AuthRoute: AuthRoute._addFileChildren(AuthRouteChildren),
	LoansCalculatorRoute,
	ApiPublicPaymentsProviderRoute
};
var routeTree = Route$26._addFileChildren(rootRouteChildren)._addFileTypes();
//#endregion
//#region src/router.tsx
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };

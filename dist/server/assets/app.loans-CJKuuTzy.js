import { t as supabase } from "./client-CrwDbVDs.js";
import { t as Card } from "./card-BXjpJ96D.js";
import { a as formatMoney, r as formatDate } from "./format-ocX-SQtS.js";
import { t as Button } from "./button-PJVP9td7.js";
import { t as AutoStatusPill } from "./status-pill-DJaFxHY0.js";
import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
//#region src/routes/_authenticated/app.loans.tsx?tsr-split=component
function LoansList() {
	const { data, isLoading } = useQuery({
		queryKey: ["my-loans-page"],
		queryFn: async () => {
			const { data: u } = await supabase.auth.getUser();
			const uid = u.user.id;
			const [loans, apps] = await Promise.all([supabase.from("loans").select("*").eq("user_id", uid).order("created_at", { ascending: false }), supabase.from("loan_applications").select("*, loan_products(name, currency)").eq("user_id", uid).order("created_at", { ascending: false })]);
			return {
				loans: loans.data ?? [],
				apps: apps.data ?? []
			};
		}
	});
	if (isLoading || !data) return /* @__PURE__ */ jsx("div", {
		className: "text-muted-foreground",
		children: "Loading…"
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-5xl space-y-6",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ jsx("h1", {
					className: "font-display text-3xl font-semibold",
					children: "Loans"
				}), /* @__PURE__ */ jsx(Link, {
					to: "/app/loans/apply",
					children: /* @__PURE__ */ jsx(Button, { children: "New application" })
				})]
			}),
			/* @__PURE__ */ jsxs(Card, {
				className: "p-6",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "mb-4 font-display text-lg font-semibold",
					children: "Disbursed loans"
				}), data.loans.length === 0 ? /* @__PURE__ */ jsx("p", {
					className: "text-sm text-muted-foreground",
					children: "No loans yet."
				}) : /* @__PURE__ */ jsx("ul", {
					className: "divide-y",
					children: data.loans.map((l) => /* @__PURE__ */ jsxs("li", {
						className: "flex flex-wrap items-center justify-between gap-3 py-4",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
							className: "font-medium tabular",
							children: [formatMoney(l.principal, l.currency), " principal"]
						}), /* @__PURE__ */ jsxs("div", {
							className: "text-xs text-muted-foreground",
							children: [
								"Outstanding ",
								formatMoney(l.outstanding, l.currency),
								" · Due ",
								formatDate(l.due_date)
							]
						})] }), /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ jsx(AutoStatusPill, { status: l.status }), /* @__PURE__ */ jsx(Link, {
								to: "/app/loans/$id",
								params: { id: l.id },
								children: /* @__PURE__ */ jsx(Button, {
									size: "sm",
									variant: "outline",
									children: "Open"
								})
							})]
						})]
					}, l.id))
				})]
			}),
			/* @__PURE__ */ jsxs(Card, {
				className: "p-6",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "mb-4 font-display text-lg font-semibold",
					children: "Applications"
				}), data.apps.length === 0 ? /* @__PURE__ */ jsx("p", {
					className: "text-sm text-muted-foreground",
					children: "No applications yet."
				}) : /* @__PURE__ */ jsx("ul", {
					className: "divide-y",
					children: data.apps.map((a) => {
						const product = a.loan_products;
						return /* @__PURE__ */ jsxs("li", {
							className: "flex flex-wrap items-center justify-between gap-3 py-4",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
								className: "font-medium",
								children: product?.name ?? "Loan"
							}), /* @__PURE__ */ jsxs("div", {
								className: "text-xs text-muted-foreground tabular",
								children: [
									formatMoney(a.requested_amount, product?.currency ?? "KES"),
									" · ",
									a.term_days,
									" days · ",
									formatDate(a.created_at)
								]
							})] }), /* @__PURE__ */ jsx(AutoStatusPill, { status: a.status })]
						}, a.id);
					})
				})]
			})
		]
	});
}
var SplitComponent = () => {
	if (useRouterState({ select: (s) => s.location.pathname }) !== "/app/loans") return /* @__PURE__ */ jsx(Outlet, {});
	return /* @__PURE__ */ jsx(LoansList, {});
};
//#endregion
export { SplitComponent as component };

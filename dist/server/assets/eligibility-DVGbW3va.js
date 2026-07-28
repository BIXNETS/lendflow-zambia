import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-BXjpJ96D.js";
import { t as Badge } from "./badge-D1Dupn2y.js";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
//#region src/routes/_authenticated/eligibility.tsx
var $$splitComponentImporter = () => import("./eligibility-x9ZPX0Ce.js");
var Route = createFileRoute("/_authenticated/eligibility")({
	head: () => ({ meta: [{ title: "Loan eligibility" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
function EligibilityList({ rows, err }) {
	if (err) return /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, {
		className: "py-10 text-sm text-destructive",
		children: err
	}) });
	if (!rows) return /* @__PURE__ */ jsx("div", {
		className: "flex items-center justify-center py-20 text-muted-foreground",
		children: /* @__PURE__ */ jsx(Loader2, { className: "size-5 animate-spin" })
	});
	if (rows.length === 0) return /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, {
		className: "py-10 text-sm text-muted-foreground text-center",
		children: "No active loan tiers configured."
	}) });
	return /* @__PURE__ */ jsx("div", {
		className: "grid gap-4 md:grid-cols-2",
		children: rows.map((r) => /* @__PURE__ */ jsxs(Card, {
			className: r.eligible ? "border-emerald/40" : "",
			children: [/* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ jsx(CardTitle, {
					className: "text-lg",
					children: r.tier_name
				}), /* @__PURE__ */ jsx(Badge, {
					className: r.eligible ? "bg-emerald text-emerald-foreground" : "bg-muted text-muted-foreground",
					children: r.eligible ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "size-3.5 mr-1" }), " Eligible"] }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(XCircle, { className: "size-3.5 mr-1" }), " Not eligible"] })
				})]
			}) }), /* @__PURE__ */ jsxs(CardContent, {
				className: "space-y-3 text-sm",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						className: "text-xs text-muted-foreground",
						children: "Active loans"
					}), /* @__PURE__ */ jsx("div", {
						className: "font-medium",
						children: r.active_loan_count
					})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						className: "text-xs text-muted-foreground",
						children: "Outstanding"
					}), /* @__PURE__ */ jsxs("div", {
						className: "font-medium",
						children: ["K ", r.outstanding_principal.toLocaleString()]
					})] })]
				}), r.reasons.length > 0 && /* @__PURE__ */ jsx("ul", {
					className: "space-y-1 border-t border-hairline pt-3 text-xs text-muted-foreground",
					children: r.reasons.map((reason, i) => /* @__PURE__ */ jsxs("li", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ jsx(XCircle, { className: "size-3.5 shrink-0 text-destructive" }), /* @__PURE__ */ jsx("span", { children: reason })]
					}, i))
				})]
			})]
		}, r.tier_id))
	});
}
//#endregion
export { Route as n, EligibilityList as t };

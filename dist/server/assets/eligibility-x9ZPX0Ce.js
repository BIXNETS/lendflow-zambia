import { n as useServerFn } from "./createSsrRpc-BgjJZxCC.js";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-BXjpJ96D.js";
import { t as Badge } from "./badge-D1Dupn2y.js";
import { t as getTierEligibility } from "./eligibility.functions-DAl4WKIN.js";
import { useEffect, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { CheckCircle2, Loader2, Sparkles, XCircle } from "lucide-react";
//#region src/routes/_authenticated/eligibility.tsx?tsr-split=component
function EligibilityPage() {
	const fetchEligibility = useServerFn(getTierEligibility);
	const [rows, setRows] = useState(null);
	const [err, setErr] = useState(null);
	useEffect(() => {
		fetchEligibility({ data: {} }).then(setRows).catch((e) => setErr(e.message));
	}, [fetchEligibility]);
	return /* @__PURE__ */ jsx("div", {
		className: "min-h-screen bg-background",
		children: /* @__PURE__ */ jsxs("main", {
			className: "max-w-5xl mx-auto px-6 py-12 space-y-8",
			children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h1", {
				className: "flex items-center gap-2 text-2xl font-semibold tracking-tight text-foreground",
				children: [/* @__PURE__ */ jsx(Sparkles, { className: "size-6 text-emerald" }), " Your loan eligibility"]
			}), /* @__PURE__ */ jsx("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Live evaluation against current tier rules and your outstanding loans."
			})] }), /* @__PURE__ */ jsx(EligibilityList, {
				rows,
				err
			})]
		})
	});
}
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
export { EligibilityList, EligibilityPage as component };

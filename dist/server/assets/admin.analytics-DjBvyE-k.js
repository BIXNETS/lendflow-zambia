import { t as supabase } from "./client-CrwDbVDs.js";
import { t as Card } from "./card-BXjpJ96D.js";
import { a as formatMoney } from "./format-ocX-SQtS.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
//#region src/routes/_authenticated/admin.analytics.tsx?tsr-split=component
function Analytics() {
	const { data, isLoading } = useQuery({
		queryKey: ["admin-analytics"],
		queryFn: async () => {
			const [loans, txs] = await Promise.all([supabase.from("loans").select("currency, principal, interest, status, disbursed_at"), supabase.from("transactions").select("currency, amount, direction, status, created_at")]);
			return {
				loans: loans.data ?? [],
				txs: txs.data ?? []
			};
		}
	});
	if (isLoading || !data) return /* @__PURE__ */ jsx("div", {
		className: "text-muted-foreground",
		children: "Loading…"
	});
	const byCurrency = /* @__PURE__ */ new Map();
	for (const l of data.loans) {
		const c = byCurrency.get(l.currency) ?? {
			disbursed: 0,
			collected: 0,
			interest: 0,
			defaulted: 0,
			total: 0
		};
		if (l.disbursed_at) c.disbursed += l.principal;
		if (l.status === "completed") c.interest += l.interest;
		if (l.status === "defaulted") c.defaulted += 1;
		c.total += 1;
		byCurrency.set(l.currency, c);
	}
	for (const t of data.txs) if (t.direction === "repayment" && t.status === "success") {
		const c = byCurrency.get(t.currency) ?? {
			disbursed: 0,
			collected: 0,
			interest: 0,
			defaulted: 0,
			total: 0
		};
		c.collected += t.amount;
		byCurrency.set(t.currency, c);
	}
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-6xl space-y-6",
		children: [/* @__PURE__ */ jsx("h1", {
			className: "font-display text-3xl font-semibold",
			children: "Analytics"
		}), /* @__PURE__ */ jsxs("div", {
			className: "grid gap-4 md:grid-cols-2",
			children: [[...byCurrency.entries()].map(([currency, c]) => {
				const rate = c.disbursed > 0 ? Math.round(c.collected / c.disbursed * 100) : 0;
				const defaultRate = c.total > 0 ? Math.round(c.defaulted / c.total * 100) : 0;
				return /* @__PURE__ */ jsxs(Card, {
					className: "p-6",
					children: [/* @__PURE__ */ jsx("h2", {
						className: "font-display text-lg font-semibold",
						children: currency
					}), /* @__PURE__ */ jsxs("div", {
						className: "mt-4 grid grid-cols-2 gap-3 text-sm",
						children: [
							/* @__PURE__ */ jsx(Mini, {
								label: "Total loans",
								value: c.total
							}),
							/* @__PURE__ */ jsx(Mini, {
								label: "Disbursed",
								value: formatMoney(c.disbursed, currency)
							}),
							/* @__PURE__ */ jsx(Mini, {
								label: "Collected",
								value: formatMoney(c.collected, currency)
							}),
							/* @__PURE__ */ jsx(Mini, {
								label: "Interest revenue",
								value: formatMoney(c.interest, currency)
							}),
							/* @__PURE__ */ jsx(Mini, {
								label: "Collection rate",
								value: `${rate}%`
							}),
							/* @__PURE__ */ jsx(Mini, {
								label: "Default rate",
								value: `${defaultRate}%`
							})
						]
					})]
				}, currency);
			}), byCurrency.size === 0 && /* @__PURE__ */ jsx("p", {
				className: "text-muted-foreground",
				children: "No data yet."
			})]
		})]
	});
}
function Mini({ label, value }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "rounded-lg border bg-muted/20 p-3",
		children: [/* @__PURE__ */ jsx("div", {
			className: "text-[10px] uppercase tracking-wider text-muted-foreground",
			children: label
		}), /* @__PURE__ */ jsx("div", {
			className: "mt-1 font-display text-lg tabular",
			children: value
		})]
	});
}
//#endregion
export { Analytics as component };

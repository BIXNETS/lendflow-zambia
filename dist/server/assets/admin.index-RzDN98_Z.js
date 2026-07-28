import { t as supabase } from "./client-CrwDbVDs.js";
import { a as formatMoney } from "./format-ocX-SQtS.js";
import { t as KpiCard } from "./kpi-card-B3OdEzVj.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, CircleDollarSign, FileCheck2, TrendingUp, Users, Wallet } from "lucide-react";
//#region src/routes/_authenticated/admin.index.tsx?tsr-split=component
function AdminOverview() {
	const { data, isLoading } = useQuery({
		queryKey: ["admin-overview"],
		queryFn: async () => {
			const [profiles, loans, apps, txs] = await Promise.all([
				supabase.from("profiles").select("user_id, kyc_status", {
					count: "exact",
					head: false
				}),
				supabase.from("loans").select("*"),
				supabase.from("loan_applications").select("id, status"),
				supabase.from("transactions").select("direction, status, amount, currency")
			]);
			return {
				users: profiles.data?.length ?? 0,
				kycPending: profiles.data?.filter((p) => p.kyc_status !== "approved").length ?? 0,
				loans: loans.data ?? [],
				apps: apps.data ?? [],
				txs: txs.data ?? []
			};
		}
	});
	if (isLoading || !data) return /* @__PURE__ */ jsx("div", {
		className: "text-muted-foreground",
		children: "Loading…"
	});
	const active = data.loans.filter((l) => l.status === "active");
	const overdue = data.loans.filter((l) => l.status === "active" && new Date(l.due_date).getTime() < Date.now());
	const totalRevenue = data.loans.filter((l) => l.status === "completed").reduce((s, l) => s + l.interest, 0);
	const totalDisbursed = data.loans.reduce((s, l) => s + (l.disbursed_at ? l.principal : 0), 0);
	const collected = data.txs.filter((t) => t.direction === "repayment" && t.status === "success").reduce((s, t) => s + t.amount, 0);
	const collectionRate = totalDisbursed > 0 ? Math.round(collected / totalDisbursed * 100) : 0;
	const currency = data.loans[0]?.currency ?? "KES";
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-6xl space-y-8",
		children: [
			/* @__PURE__ */ jsxs("header", { children: [/* @__PURE__ */ jsx("h1", {
				className: "font-display text-3xl font-semibold",
				children: "Admin overview"
			}), /* @__PURE__ */ jsx("p", {
				className: "text-sm text-muted-foreground",
				children: "Platform-wide metrics at a glance."
			})] }),
			/* @__PURE__ */ jsxs("section", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
				children: [
					/* @__PURE__ */ jsx(KpiCard, {
						label: "Total users",
						value: data.users,
						icon: /* @__PURE__ */ jsx(Users, { className: "size-4" }),
						hint: `${data.kycPending} need KYC`
					}),
					/* @__PURE__ */ jsx(KpiCard, {
						label: "Active loans",
						value: active.length,
						icon: /* @__PURE__ */ jsx(Wallet, { className: "size-4" }),
						tone: "accent"
					}),
					/* @__PURE__ */ jsx(KpiCard, {
						label: "Overdue",
						value: overdue.length,
						icon: /* @__PURE__ */ jsx(AlertTriangle, { className: "size-4" }),
						tone: overdue.length ? "danger" : "default"
					}),
					/* @__PURE__ */ jsx(KpiCard, {
						label: "Total disbursed",
						value: formatMoney(totalDisbursed, currency),
						icon: /* @__PURE__ */ jsx(CircleDollarSign, { className: "size-4" })
					}),
					/* @__PURE__ */ jsx(KpiCard, {
						label: "Revenue (interest)",
						value: formatMoney(totalRevenue, currency),
						icon: /* @__PURE__ */ jsx(TrendingUp, { className: "size-4" })
					}),
					/* @__PURE__ */ jsx(KpiCard, {
						label: "Collection rate",
						value: `${collectionRate}%`,
						icon: /* @__PURE__ */ jsx(FileCheck2, { className: "size-4" }),
						hint: "Collected ÷ disbursed"
					})
				]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "grid gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ jsx(Panel, {
					title: "Applications by status",
					items: countBy(data.apps, "status")
				}), /* @__PURE__ */ jsx(Panel, {
					title: "Loans by status",
					items: countBy(data.loans, "status")
				})]
			})
		]
	});
}
function countBy(items, key) {
	const map = /* @__PURE__ */ new Map();
	for (const i of items) map.set(String(i[key]), (map.get(String(i[key])) ?? 0) + 1);
	return [...map.entries()].sort((a, b) => b[1] - a[1]);
}
function Panel({ title, items }) {
	const max = Math.max(1, ...items.map((i) => i[1]));
	return /* @__PURE__ */ jsxs("div", {
		className: "rounded-2xl border bg-card p-6",
		children: [/* @__PURE__ */ jsx("h2", {
			className: "mb-4 font-display text-lg font-semibold",
			children: title
		}), items.length === 0 ? /* @__PURE__ */ jsx("p", {
			className: "text-sm text-muted-foreground",
			children: "No data."
		}) : /* @__PURE__ */ jsx("ul", {
			className: "space-y-2",
			children: items.map(([k, v]) => /* @__PURE__ */ jsxs("li", {
				className: "space-y-1",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between text-sm",
					children: [/* @__PURE__ */ jsx("span", {
						className: "capitalize",
						children: k.replace(/_/g, " ")
					}), /* @__PURE__ */ jsx("span", {
						className: "tabular text-muted-foreground",
						children: v
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "h-2 rounded-full bg-muted",
					children: /* @__PURE__ */ jsx("div", {
						className: "h-full rounded-full bg-accent",
						style: { width: `${v / max * 100}%` }
					})
				})]
			}, k))
		})]
	});
}
//#endregion
export { AdminOverview as component };

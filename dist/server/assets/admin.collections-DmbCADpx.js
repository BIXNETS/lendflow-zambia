import { t as supabase } from "./client-CrwDbVDs.js";
import { t as Card } from "./card-BXjpJ96D.js";
import { a as formatMoney, i as formatDateTime } from "./format-ocX-SQtS.js";
import { t as AutoStatusPill } from "./status-pill-DJaFxHY0.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
//#region src/routes/_authenticated/admin.collections.tsx?tsr-split=component
function Collections() {
	const { data, isLoading } = useQuery({
		queryKey: ["admin-collections"],
		queryFn: async () => (await supabase.from("transactions").select("*, profiles!transactions_user_id_fkey(full_name)").order("created_at", { ascending: false }).limit(200)).data ?? []
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-6xl space-y-6",
		children: [/* @__PURE__ */ jsx("h1", {
			className: "font-display text-3xl font-semibold",
			children: "Collections"
		}), /* @__PURE__ */ jsx(Card, {
			className: "overflow-hidden p-0",
			children: /* @__PURE__ */ jsxs("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ jsx("thead", {
					className: "bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground",
					children: /* @__PURE__ */ jsxs("tr", { children: [
						/* @__PURE__ */ jsx("th", {
							className: "p-3",
							children: "When"
						}),
						/* @__PURE__ */ jsx("th", {
							className: "p-3",
							children: "Borrower"
						}),
						/* @__PURE__ */ jsx("th", {
							className: "p-3",
							children: "Direction"
						}),
						/* @__PURE__ */ jsx("th", {
							className: "p-3",
							children: "Provider"
						}),
						/* @__PURE__ */ jsx("th", {
							className: "p-3",
							children: "Amount"
						}),
						/* @__PURE__ */ jsx("th", {
							className: "p-3",
							children: "Status"
						}),
						/* @__PURE__ */ jsx("th", {
							className: "p-3",
							children: "Ref"
						})
					] })
				}), /* @__PURE__ */ jsxs("tbody", {
					className: "divide-y",
					children: [isLoading ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
						colSpan: 7,
						className: "p-6 text-center text-muted-foreground",
						children: "Loading…"
					}) }) : (data ?? []).map((t) => {
						const u = t.profiles;
						return /* @__PURE__ */ jsxs("tr", { children: [
							/* @__PURE__ */ jsx("td", {
								className: "p-3",
								children: formatDateTime(t.created_at)
							}),
							/* @__PURE__ */ jsx("td", {
								className: "p-3",
								children: u?.full_name ?? "—"
							}),
							/* @__PURE__ */ jsx("td", {
								className: "p-3 capitalize",
								children: t.direction
							}),
							/* @__PURE__ */ jsx("td", {
								className: "p-3 uppercase",
								children: t.provider
							}),
							/* @__PURE__ */ jsx("td", {
								className: "p-3 tabular",
								children: formatMoney(t.amount, t.currency)
							}),
							/* @__PURE__ */ jsx("td", {
								className: "p-3",
								children: /* @__PURE__ */ jsx(AutoStatusPill, { status: t.status })
							}),
							/* @__PURE__ */ jsx("td", {
								className: "p-3 font-mono text-xs",
								children: t.provider_ref ?? "—"
							})
						] }, t.id);
					}), !isLoading && (data?.length ?? 0) === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
						colSpan: 7,
						className: "p-6 text-center text-muted-foreground",
						children: "No transactions yet."
					}) })]
				})]
			})
		})]
	});
}
//#endregion
export { Collections as component };

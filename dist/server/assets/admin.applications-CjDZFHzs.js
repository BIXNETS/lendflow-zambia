import { n as useServerFn } from "./createSsrRpc-BgjJZxCC.js";
import { t as supabase } from "./client-CrwDbVDs.js";
import { t as Card } from "./card-BXjpJ96D.js";
import { a as formatMoney, r as formatDate } from "./format-ocX-SQtS.js";
import { t as Button } from "./button-PJVP9td7.js";
import { t as AutoStatusPill } from "./status-pill-DJaFxHY0.js";
import { t as decideApplication } from "./admin.functions-CYezGnh3.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
//#region src/routes/_authenticated/admin.applications.tsx?tsr-split=component
function ApplicationsAdmin() {
	const qc = useQueryClient();
	const decide = useServerFn(decideApplication);
	const { data, isLoading } = useQuery({
		queryKey: ["admin-applications"],
		queryFn: async () => {
			const { data } = await supabase.from("loan_applications").select("*, loan_products(name, currency), profiles!loan_applications_user_id_fkey(full_name, country)").order("created_at", { ascending: false });
			return data ?? [];
		}
	});
	async function act(id, decision) {
		const notes = decision === "reject" ? window.prompt("Reason for rejection?") ?? "" : "";
		try {
			await decide({ data: {
				application_id: id,
				decision,
				notes
			} });
			toast.success(`Application ${decision}d`);
			qc.invalidateQueries({ queryKey: ["admin-applications"] });
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Failed");
		}
	}
	if (isLoading || !data) return /* @__PURE__ */ jsx("div", {
		className: "text-muted-foreground",
		children: "Loading…"
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-6xl space-y-6",
		children: [/* @__PURE__ */ jsx("h1", {
			className: "font-display text-3xl font-semibold",
			children: "Loan applications"
		}), /* @__PURE__ */ jsx(Card, {
			className: "p-0 overflow-hidden",
			children: /* @__PURE__ */ jsxs("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ jsx("thead", {
					className: "bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground",
					children: /* @__PURE__ */ jsxs("tr", { children: [
						/* @__PURE__ */ jsx("th", {
							className: "p-3",
							children: "Customer"
						}),
						/* @__PURE__ */ jsx("th", {
							className: "p-3",
							children: "Product"
						}),
						/* @__PURE__ */ jsx("th", {
							className: "p-3",
							children: "Amount"
						}),
						/* @__PURE__ */ jsx("th", {
							className: "p-3",
							children: "Term"
						}),
						/* @__PURE__ */ jsx("th", {
							className: "p-3",
							children: "Submitted"
						}),
						/* @__PURE__ */ jsx("th", {
							className: "p-3",
							children: "Status"
						}),
						/* @__PURE__ */ jsx("th", {
							className: "p-3 text-right",
							children: "Actions"
						})
					] })
				}), /* @__PURE__ */ jsxs("tbody", {
					className: "divide-y",
					children: [data.map((a) => {
						const p = a.loan_products;
						const u = a.profiles;
						const open = a.status === "submitted" || a.status === "under_review";
						return /* @__PURE__ */ jsxs("tr", { children: [
							/* @__PURE__ */ jsxs("td", {
								className: "p-3",
								children: [
									u?.full_name ?? "—",
									" ",
									/* @__PURE__ */ jsx("span", {
										className: "text-xs text-muted-foreground",
										children: u?.country
									})
								]
							}),
							/* @__PURE__ */ jsx("td", {
								className: "p-3",
								children: p?.name ?? "—"
							}),
							/* @__PURE__ */ jsx("td", {
								className: "p-3 tabular",
								children: formatMoney(a.requested_amount, p?.currency ?? "KES")
							}),
							/* @__PURE__ */ jsxs("td", {
								className: "p-3 tabular",
								children: [a.term_days, "d"]
							}),
							/* @__PURE__ */ jsx("td", {
								className: "p-3",
								children: formatDate(a.created_at)
							}),
							/* @__PURE__ */ jsx("td", {
								className: "p-3",
								children: /* @__PURE__ */ jsx(AutoStatusPill, { status: a.status })
							}),
							/* @__PURE__ */ jsx("td", {
								className: "p-3 text-right",
								children: open && /* @__PURE__ */ jsxs("div", {
									className: "flex justify-end gap-2",
									children: [/* @__PURE__ */ jsx(Button, {
										size: "sm",
										variant: "outline",
										onClick: () => act(a.id, "reject"),
										children: "Reject"
									}), /* @__PURE__ */ jsx(Button, {
										size: "sm",
										onClick: () => act(a.id, "approve"),
										children: "Approve"
									})]
								})
							})
						] }, a.id);
					}), data.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
						colSpan: 7,
						className: "p-6 text-center text-muted-foreground",
						children: "No applications."
					}) })]
				})]
			})
		})]
	});
}
//#endregion
export { ApplicationsAdmin as component };

import { n as useServerFn } from "./createSsrRpc-BgjJZxCC.js";
import { t as supabase } from "./client-CrwDbVDs.js";
import { t as Card } from "./card-BXjpJ96D.js";
import { a as formatMoney, r as formatDate } from "./format-ocX-SQtS.js";
import { t as Button } from "./button-PJVP9td7.js";
import { t as AutoStatusPill } from "./status-pill-DJaFxHY0.js";
import { n as markDisbursed } from "./admin.functions-CYezGnh3.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
//#region src/routes/_authenticated/admin.loans.tsx?tsr-split=component
function AdminLoans() {
	const qc = useQueryClient();
	const disburse = useServerFn(markDisbursed);
	const { data, isLoading } = useQuery({
		queryKey: ["admin-loans"],
		queryFn: async () => {
			const { data } = await supabase.from("loans").select("*, profiles!loans_user_id_fkey(full_name)").order("created_at", { ascending: false });
			return data ?? [];
		}
	});
	async function doDisburse(id) {
		try {
			await disburse({ data: { loan_id: id } });
			toast.success("Loan marked disbursed");
			qc.invalidateQueries({ queryKey: ["admin-loans"] });
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
			children: "Loans"
		}), /* @__PURE__ */ jsx(Card, {
			className: "overflow-hidden p-0",
			children: /* @__PURE__ */ jsxs("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ jsx("thead", {
					className: "bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground",
					children: /* @__PURE__ */ jsxs("tr", { children: [
						/* @__PURE__ */ jsx("th", {
							className: "p-3",
							children: "Borrower"
						}),
						/* @__PURE__ */ jsx("th", {
							className: "p-3",
							children: "Principal"
						}),
						/* @__PURE__ */ jsx("th", {
							className: "p-3",
							children: "Outstanding"
						}),
						/* @__PURE__ */ jsx("th", {
							className: "p-3",
							children: "Due"
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
					children: [data.map((l) => {
						const u = l.profiles;
						return /* @__PURE__ */ jsxs("tr", { children: [
							/* @__PURE__ */ jsx("td", {
								className: "p-3",
								children: u?.full_name ?? "—"
							}),
							/* @__PURE__ */ jsx("td", {
								className: "p-3 tabular",
								children: formatMoney(l.principal, l.currency)
							}),
							/* @__PURE__ */ jsx("td", {
								className: "p-3 tabular",
								children: formatMoney(l.outstanding, l.currency)
							}),
							/* @__PURE__ */ jsx("td", {
								className: "p-3",
								children: formatDate(l.due_date)
							}),
							/* @__PURE__ */ jsx("td", {
								className: "p-3",
								children: /* @__PURE__ */ jsx(AutoStatusPill, { status: l.status })
							}),
							/* @__PURE__ */ jsx("td", {
								className: "p-3 text-right",
								children: l.status === "pending_disbursement" && /* @__PURE__ */ jsx(Button, {
									size: "sm",
									onClick: () => doDisburse(l.id),
									children: "Mark disbursed"
								})
							})
						] }, l.id);
					}), data.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
						colSpan: 6,
						className: "p-6 text-center text-muted-foreground",
						children: "No loans yet."
					}) })]
				})]
			})
		})]
	});
}
//#endregion
export { AdminLoans as component };

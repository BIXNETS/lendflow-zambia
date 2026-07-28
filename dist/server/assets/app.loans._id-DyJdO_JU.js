import { i as createServerFn } from "./esm-9EjmF9OT.js";
import { n as useServerFn, t as createSsrRpc } from "./createSsrRpc-BgjJZxCC.js";
import { t as requireSupabaseAuth } from "./auth-middleware-Dpn8S0gM.js";
import { a as repaySchema } from "./schemas-Cze1BLcm.js";
import { t as supabase } from "./client-CrwDbVDs.js";
import { t as Card } from "./card-BXjpJ96D.js";
import { t as Route } from "./app.loans._id-0j5orLXI.js";
import { a as formatMoney, r as formatDate } from "./format-ocX-SQtS.js";
import { t as Button } from "./button-PJVP9td7.js";
import { t as AutoStatusPill } from "./status-pill-DJaFxHY0.js";
import { t as Input } from "./input-B8Q2ztVi.js";
import { t as Label } from "./label-DBD1bRRP.js";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.js";
import { useState } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
//#region src/lib/repayments.functions.ts
var initiateRepayment = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => repaySchema.parse(input)).handler(createSsrRpc("178900f74004694eb7b8d6ccdcf0ba64d89767102f25f4921f4ca6cf30e98506"));
var verifyRepayment = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	const obj = input;
	if (typeof obj.transaction_id !== "string") throw new Error("transaction_id required");
	return { transaction_id: obj.transaction_id };
}).handler(createSsrRpc("63d3b6a1c370511fb809943541504fe8b0c2d1a61abd30797b6b3c3630a8bc15"));
//#endregion
//#region src/routes/_authenticated/app.loans.$id.tsx?tsr-split=component
function LoanDetail() {
	const { id } = Route.useParams();
	const router = useRouter();
	const qc = useQueryClient();
	const initiate = useServerFn(initiateRepayment);
	const verify = useServerFn(verifyRepayment);
	const { data, isLoading } = useQuery({
		queryKey: ["loan-detail", id],
		queryFn: async () => {
			const [loan, schedule, txs] = await Promise.all([
				supabase.from("loans").select("*, loan_products(name)").eq("id", id).maybeSingle(),
				supabase.from("repayment_schedules").select("*").eq("loan_id", id).order("installment_no"),
				supabase.from("transactions").select("*").eq("loan_id", id).order("created_at", { ascending: false })
			]);
			return {
				loan: loan.data,
				schedule: schedule.data ?? [],
				txs: txs.data ?? []
			};
		}
	});
	const [amount, setAmount] = useState(0);
	const [provider, setProvider] = useState("mpesa");
	const [msisdn, setMsisdn] = useState("");
	const [paying, setPaying] = useState(false);
	const repayMutation = useMutation({
		mutationFn: async () => {
			const initRes = await initiate({ data: {
				loan_id: id,
				amount,
				provider,
				msisdn
			} });
			for (let i = 0; i < 5; i++) {
				await new Promise((r) => setTimeout(r, 1500));
				const v = await verify({ data: { transaction_id: initRes.transaction_id } });
				if (v.status !== "pending") return v.status;
			}
			return "pending";
		},
		onSuccess: (status) => {
			if (status === "success") toast.success("Payment received");
			else if (status === "failed") toast.error("Payment failed");
			else toast.info("Payment pending — check back shortly");
			qc.invalidateQueries({ queryKey: ["loan-detail", id] });
			qc.invalidateQueries({ queryKey: ["borrower-dashboard"] });
			router.invalidate();
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Payment failed"),
		onSettled: () => setPaying(false)
	});
	if (isLoading || !data) return /* @__PURE__ */ jsx("div", {
		className: "text-muted-foreground",
		children: "Loading…"
	});
	if (!data.loan) return /* @__PURE__ */ jsxs("div", { children: ["Loan not found. ", /* @__PURE__ */ jsx(Link, {
		to: "/app/loans",
		className: "text-accent",
		children: "Back"
	})] });
	const l = data.loan;
	const product = l.loan_products;
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-4xl space-y-6",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
					className: "font-display text-3xl font-semibold",
					children: product?.name ?? "Loan"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-sm text-muted-foreground",
					children: l.id
				})] }), /* @__PURE__ */ jsx(AutoStatusPill, { status: l.status })]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid gap-4 sm:grid-cols-4",
				children: [
					/* @__PURE__ */ jsx(Stat, {
						label: "Principal",
						value: formatMoney(l.principal, l.currency)
					}),
					/* @__PURE__ */ jsx(Stat, {
						label: "Interest",
						value: formatMoney(l.interest, l.currency)
					}),
					/* @__PURE__ */ jsx(Stat, {
						label: "Total payable",
						value: formatMoney(l.total_payable, l.currency)
					}),
					/* @__PURE__ */ jsx(Stat, {
						label: "Outstanding",
						value: formatMoney(l.outstanding, l.currency),
						tone: "accent"
					})
				]
			}),
			/* @__PURE__ */ jsxs(Card, {
				className: "p-6",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "mb-4 font-display text-lg font-semibold",
					children: "Timeline"
				}), /* @__PURE__ */ jsx(Timeline, { status: l.status })]
			}),
			l.status === "active" && /* @__PURE__ */ jsxs(Card, {
				className: "p-6",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "mb-4 font-display text-lg font-semibold",
					children: "Make a payment"
				}), /* @__PURE__ */ jsxs("form", {
					onSubmit: (e) => {
						e.preventDefault();
						if (!amount || !msisdn) return toast.error("Fill all fields");
						setPaying(true);
						repayMutation.mutate();
					},
					className: "grid gap-4 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ jsxs(Label, { children: [
								"Amount (",
								l.currency,
								")"
							] }), /* @__PURE__ */ jsx(Input, {
								type: "number",
								value: amount || "",
								onChange: (e) => setAmount(Number(e.target.value)),
								max: l.outstanding,
								min: 1,
								required: true
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ jsx(Label, { children: "Provider" }), /* @__PURE__ */ jsxs(Select, {
								value: provider,
								onValueChange: (v) => setProvider(v),
								children: [/* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }), /* @__PURE__ */ jsxs(SelectContent, { children: [
									/* @__PURE__ */ jsx(SelectItem, {
										value: "mpesa",
										children: "M-Pesa"
									}),
									/* @__PURE__ */ jsx(SelectItem, {
										value: "mtn",
										children: "MTN MoMo"
									}),
									/* @__PURE__ */ jsx(SelectItem, {
										value: "airtel",
										children: "Airtel Money"
									})
								] })]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ jsx(Label, { children: "Phone number" }), /* @__PURE__ */ jsx(Input, {
								value: msisdn,
								onChange: (e) => setMsisdn(e.target.value),
								placeholder: "+2547XXXXXXXX",
								required: true
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "sm:col-span-3",
							children: [/* @__PURE__ */ jsx(Button, {
								type: "submit",
								disabled: paying,
								size: "lg",
								children: paying ? "Authorizing…" : `Pay ${amount ? formatMoney(amount, l.currency) : ""}`
							}), /* @__PURE__ */ jsx("p", {
								className: "mt-2 text-xs text-muted-foreground",
								children: "A push notification will appear on your phone to authorize the transfer."
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ jsxs(Card, {
				className: "p-6",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "mb-4 font-display text-lg font-semibold",
					children: "Repayment schedule"
				}), /* @__PURE__ */ jsx("ul", {
					className: "divide-y",
					children: data.schedule.map((s) => /* @__PURE__ */ jsxs("li", {
						className: "flex items-center justify-between py-3",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
							className: "font-medium",
							children: ["Installment ", s.installment_no]
						}), /* @__PURE__ */ jsxs("div", {
							className: "text-xs text-muted-foreground",
							children: ["Due ", formatDate(s.due_date)]
						})] }), /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ jsxs("span", {
								className: "tabular",
								children: [
									formatMoney(s.amount_paid, l.currency),
									" / ",
									formatMoney(s.amount_due, l.currency)
								]
							}), /* @__PURE__ */ jsx(AutoStatusPill, { status: s.status })]
						})]
					}, s.id))
				})]
			}),
			/* @__PURE__ */ jsxs(Card, {
				className: "p-6",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "mb-4 font-display text-lg font-semibold",
					children: "Transactions"
				}), data.txs.length === 0 ? /* @__PURE__ */ jsx("p", {
					className: "text-sm text-muted-foreground",
					children: "No transactions yet."
				}) : /* @__PURE__ */ jsx("ul", {
					className: "divide-y",
					children: data.txs.map((t) => /* @__PURE__ */ jsxs("li", {
						className: "flex items-center justify-between py-3 text-sm",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
							className: "font-medium capitalize",
							children: [
								t.direction,
								" · ",
								t.provider
							]
						}), /* @__PURE__ */ jsxs("div", {
							className: "text-xs text-muted-foreground",
							children: [
								formatDate(t.created_at),
								" · ",
								t.provider_ref ?? "—"
							]
						})] }), /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ jsx("span", {
								className: "tabular",
								children: formatMoney(t.amount, t.currency)
							}), /* @__PURE__ */ jsx(AutoStatusPill, { status: t.status })]
						})]
					}, t.id))
				})]
			})
		]
	});
}
function Stat({ label, value, tone }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "rounded-2xl border p-5 " + (tone === "accent" ? "border-accent/30 bg-accent/5" : "bg-card"),
		children: [/* @__PURE__ */ jsx("div", {
			className: "text-xs uppercase tracking-wider text-muted-foreground",
			children: label
		}), /* @__PURE__ */ jsx("div", {
			className: "mt-1 font-display text-2xl font-semibold tabular",
			children: value
		})]
	});
}
var STAGES = [
	"pending_disbursement",
	"active",
	"completed"
];
function Timeline({ status }) {
	const idx = STAGES.indexOf(status);
	const failed = status === "defaulted" || status === "written_off";
	return /* @__PURE__ */ jsx("ol", {
		className: "flex items-center",
		children: STAGES.map((s, i) => {
			const reached = !failed && i <= (idx < 0 ? 0 : idx);
			return /* @__PURE__ */ jsxs("li", {
				className: "flex flex-1 items-center",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "grid size-8 place-items-center rounded-full border text-xs " + (reached ? "border-accent bg-accent text-accent-foreground" : "border-border bg-card text-muted-foreground"),
						children: i + 1
					}),
					/* @__PURE__ */ jsx("span", {
						className: "ml-2 mr-3 hidden text-sm capitalize sm:inline",
						children: s.replace(/_/g, " ")
					}),
					i < STAGES.length - 1 && /* @__PURE__ */ jsx("div", { className: "h-px flex-1 " + (reached ? "bg-accent" : "bg-border") })
				]
			}, s);
		})
	});
}
//#endregion
export { LoanDetail as component };

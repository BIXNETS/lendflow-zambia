import { r as productSchema } from "./schemas-Cze1BLcm.js";
import { t as supabase } from "./client-CrwDbVDs.js";
import { t as Card } from "./card-BXjpJ96D.js";
import { a as formatMoney, n as COUNTRY_NAMES } from "./format-ocX-SQtS.js";
import { t as Button } from "./button-PJVP9td7.js";
import { t as Input } from "./input-B8Q2ztVi.js";
import { t as Label } from "./label-DBD1bRRP.js";
import { t as Switch } from "./switch-Cn1w-cIH.js";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.js";
import { useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil, Plus } from "lucide-react";
//#region src/routes/_authenticated/admin.products.tsx?tsr-split=component
var blank = {
	name: "",
	description: "",
	country: "KE",
	currency: "KES",
	min_amount: 5e4,
	max_amount: 5e5,
	interest_rate_pct: 12.5,
	term_days: 30,
	active: true
};
function ProductsAdmin() {
	const qc = useQueryClient();
	const { data, isLoading } = useQuery({
		queryKey: ["admin-products"],
		queryFn: async () => (await supabase.from("loan_products").select("*").order("country").order("name")).data ?? []
	});
	const [editing, setEditing] = useState(null);
	async function save(p) {
		const parsed = productSchema.safeParse({
			...p,
			description: p.description ?? ""
		});
		if (!parsed.success) return toast.error(parsed.error.issues[0].message);
		if (p.min_amount >= p.max_amount) return toast.error("Min must be less than max");
		const row = {
			...parsed.data,
			description: parsed.data.description || null
		};
		const { error } = await (p.id ? supabase.from("loan_products").update(row).eq("id", p.id) : supabase.from("loan_products").insert(row));
		if (error) return toast.error(error.message);
		toast.success("Saved");
		setEditing(null);
		qc.invalidateQueries({ queryKey: ["admin-products"] });
	}
	async function toggle(p) {
		await supabase.from("loan_products").update({ active: !p.active }).eq("id", p.id);
		qc.invalidateQueries({ queryKey: ["admin-products"] });
	}
	if (isLoading || !data) return /* @__PURE__ */ jsx("div", {
		className: "text-muted-foreground",
		children: "Loading…"
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-6xl space-y-6",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ jsx("h1", {
					className: "font-display text-3xl font-semibold",
					children: "Loan products"
				}), /* @__PURE__ */ jsxs(Button, {
					onClick: () => setEditing(blank),
					children: [/* @__PURE__ */ jsx(Plus, { className: "size-4" }), " New product"]
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "grid gap-4 md:grid-cols-2",
				children: data.map((p) => /* @__PURE__ */ jsxs(Card, {
					className: "p-5",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-start justify-between",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
								className: "font-display text-lg font-semibold",
								children: p.name
							}), /* @__PURE__ */ jsxs("p", {
								className: "text-xs text-muted-foreground",
								children: [
									COUNTRY_NAMES[p.country],
									" · ",
									p.currency
								]
							})] }), /* @__PURE__ */ jsx(Switch, {
								checked: p.active,
								onCheckedChange: () => toggle({
									id: p.id,
									active: p.active
								})
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-3 grid grid-cols-2 gap-1 text-sm tabular",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-muted-foreground",
									children: "Range"
								}),
								/* @__PURE__ */ jsxs("span", {
									className: "text-right",
									children: [
										formatMoney(p.min_amount, p.currency),
										" – ",
										formatMoney(p.max_amount, p.currency)
									]
								}),
								/* @__PURE__ */ jsx("span", {
									className: "text-muted-foreground",
									children: "Rate"
								}),
								/* @__PURE__ */ jsxs("span", {
									className: "text-right",
									children: [Number(p.interest_rate_pct), "%"]
								}),
								/* @__PURE__ */ jsx("span", {
									className: "text-muted-foreground",
									children: "Term"
								}),
								/* @__PURE__ */ jsxs("span", {
									className: "text-right",
									children: [p.term_days, " days"]
								})
							]
						}),
						/* @__PURE__ */ jsxs(Button, {
							variant: "outline",
							size: "sm",
							className: "mt-4",
							onClick: () => setEditing(p),
							children: [/* @__PURE__ */ jsx(Pencil, { className: "size-3" }), " Edit"]
						})
					]
				}, p.id))
			}),
			editing && /* @__PURE__ */ jsx(EditorModal, {
				product: editing,
				onClose: () => setEditing(null),
				onSave: save
			})
		]
	});
}
function EditorModal({ product, onClose, onSave }) {
	const [p, setP] = useState(product);
	return /* @__PURE__ */ jsx("div", {
		className: "fixed inset-0 z-50 grid place-items-center bg-black/50 p-4",
		onClick: onClose,
		children: /* @__PURE__ */ jsxs(Card, {
			className: "w-full max-w-lg p-6",
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ jsx("h2", {
					className: "font-display text-xl font-semibold",
					children: product.id ? "Edit product" : "New product"
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-4 grid gap-4 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ jsx(F, {
							label: "Name",
							children: /* @__PURE__ */ jsx(Input, {
								value: p.name,
								onChange: (e) => setP({
									...p,
									name: e.target.value
								})
							})
						}),
						/* @__PURE__ */ jsx(F, {
							label: "Country",
							children: /* @__PURE__ */ jsxs(Select, {
								value: p.country,
								onValueChange: (v) => setP({
									...p,
									country: v
								}),
								children: [/* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }), /* @__PURE__ */ jsx(SelectContent, { children: Object.entries(COUNTRY_NAMES).map(([k, v]) => /* @__PURE__ */ jsx(SelectItem, {
									value: k,
									children: v
								}, k)) })]
							})
						}),
						/* @__PURE__ */ jsx(F, {
							label: "Currency",
							children: /* @__PURE__ */ jsxs(Select, {
								value: p.currency,
								onValueChange: (v) => setP({
									...p,
									currency: v
								}),
								children: [/* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }), /* @__PURE__ */ jsx(SelectContent, { children: [
									"KES",
									"UGX",
									"TZS",
									"RWF",
									"GHS",
									"NGN"
								].map((c) => /* @__PURE__ */ jsx(SelectItem, {
									value: c,
									children: c
								}, c)) })]
							})
						}),
						/* @__PURE__ */ jsx(F, {
							label: "Min amount",
							children: /* @__PURE__ */ jsx(Input, {
								type: "number",
								value: p.min_amount,
								onChange: (e) => setP({
									...p,
									min_amount: +e.target.value
								})
							})
						}),
						/* @__PURE__ */ jsx(F, {
							label: "Max amount",
							children: /* @__PURE__ */ jsx(Input, {
								type: "number",
								value: p.max_amount,
								onChange: (e) => setP({
									...p,
									max_amount: +e.target.value
								})
							})
						}),
						/* @__PURE__ */ jsx(F, {
							label: "Interest %",
							children: /* @__PURE__ */ jsx(Input, {
								type: "number",
								step: "0.1",
								value: p.interest_rate_pct,
								onChange: (e) => setP({
									...p,
									interest_rate_pct: +e.target.value
								})
							})
						}),
						/* @__PURE__ */ jsx(F, {
							label: "Term (days)",
							children: /* @__PURE__ */ jsx(Input, {
								type: "number",
								value: p.term_days,
								onChange: (e) => setP({
									...p,
									term_days: +e.target.value
								})
							})
						}),
						/* @__PURE__ */ jsx("div", {
							className: "sm:col-span-2",
							children: /* @__PURE__ */ jsx(F, {
								label: "Description",
								children: /* @__PURE__ */ jsx(Input, {
									value: p.description ?? "",
									onChange: (e) => setP({
										...p,
										description: e.target.value
									})
								})
							})
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-6 flex justify-end gap-2",
					children: [/* @__PURE__ */ jsx(Button, {
						variant: "outline",
						onClick: onClose,
						children: "Cancel"
					}), /* @__PURE__ */ jsx(Button, {
						onClick: () => onSave(p),
						children: "Save"
					})]
				})
			]
		})
	});
}
function F({ label, children }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ jsx(Label, { children: label }), children]
	});
}
//#endregion
export { ProductsAdmin as component };

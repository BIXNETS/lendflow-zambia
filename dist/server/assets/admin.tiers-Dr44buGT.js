import { t as supabase } from "./client-CrwDbVDs.js";
import { t as cn } from "./utils-C_uf36nf.js";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-BXjpJ96D.js";
import { t as Badge } from "./badge-D1Dupn2y.js";
import { t as Button } from "./button-PJVP9td7.js";
import { t as Input } from "./input-B8Q2ztVi.js";
import { t as Label } from "./label-DBD1bRRP.js";
import { t as Switch } from "./switch-Cn1w-cIH.js";
import { t as Textarea } from "./textarea-kko37XEX.js";
import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { Layers, Loader2, Pencil, Plus, Power, PowerOff, Trash2, X } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
//#region src/components/ui/dialog.tsx
var Dialog = DialogPrimitive.Root;
var DialogPortal = DialogPrimitive.Portal;
var DialogOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(DialogPrimitive.Overlay, {
	ref,
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
var DialogContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(DialogPortal, { children: [/* @__PURE__ */ jsx(DialogOverlay, {}), /* @__PURE__ */ jsxs(DialogPrimitive.Content, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props,
	children: [children, /* @__PURE__ */ jsxs(DialogPrimitive.Close, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
		children: [/* @__PURE__ */ jsx(X, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
DialogContent.displayName = DialogPrimitive.Content.displayName;
var DialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsx("div", {
	className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className),
	...props
});
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({ className, ...props }) => /* @__PURE__ */ jsx("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
DialogFooter.displayName = "DialogFooter";
var DialogTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(DialogPrimitive.Title, {
	ref,
	className: cn("text-lg font-semibold leading-none tracking-tight", className),
	...props
}));
DialogTitle.displayName = DialogPrimitive.Title.displayName;
var DialogDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(DialogPrimitive.Description, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
DialogDescription.displayName = DialogPrimitive.Description.displayName;
//#endregion
//#region src/routes/_authenticated/admin.tiers.tsx?tsr-split=component
var emptyDraft = {
	name: "",
	description: "",
	min_amount: 500,
	max_amount: 5e3,
	min_term_months: 1,
	max_term_months: 6,
	interest_rate: 10,
	processing_fee: 0,
	activation_fee: 0,
	is_active: true,
	sort_order: 0,
	max_active_loans: 1,
	max_outstanding_principal: null,
	min_repayment_frequency_days: 7,
	max_repayment_frequency_days: 31,
	min_age: 18,
	required_kyc_status: "approved",
	required_activation_status: "active"
};
var fmt = (n) => new Intl.NumberFormat("en-ZM", { maximumFractionDigits: 0 }).format(n);
function AdminTiers() {
	const [tiers, setTiers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [open, setOpen] = useState(false);
	const [draft, setDraft] = useState(emptyDraft);
	const [saving, setSaving] = useState(false);
	const load = async () => {
		setLoading(true);
		const { data, error } = await supabase.from("loan_tiers").select("id,name,description,min_amount,max_amount,min_term_months,max_term_months,interest_rate,processing_fee,activation_fee,is_active,sort_order,max_active_loans,max_outstanding_principal,min_repayment_frequency_days,max_repayment_frequency_days,min_age,required_kyc_status,required_activation_status").order("sort_order", { ascending: true }).order("created_at", { ascending: true });
		if (error) toast.error(error.message);
		setTiers(data ?? []);
		setLoading(false);
	};
	useEffect(() => {
		load();
	}, []);
	const openCreate = () => {
		setDraft({
			...emptyDraft,
			sort_order: tiers.length + 1
		});
		setOpen(true);
	};
	const openEdit = (t) => {
		setDraft({ ...t });
		setOpen(true);
	};
	const save = async () => {
		if (!draft.name.trim()) return toast.error("Name is required");
		if (draft.max_amount < draft.min_amount) return toast.error("Max amount must be ≥ min");
		if (draft.max_term_months < draft.min_term_months) return toast.error("Max term must be ≥ min");
		setSaving(true);
		const payload = {
			name: draft.name.trim(),
			description: draft.description?.trim() || null,
			min_amount: Number(draft.min_amount),
			max_amount: Number(draft.max_amount),
			min_term_months: Number(draft.min_term_months),
			max_term_months: Number(draft.max_term_months),
			interest_rate: Number(draft.interest_rate),
			processing_fee: Number(draft.processing_fee),
			activation_fee: Number(draft.activation_fee),
			is_active: draft.is_active,
			sort_order: Number(draft.sort_order),
			max_active_loans: Number(draft.max_active_loans),
			max_outstanding_principal: draft.max_outstanding_principal === null || Number.isNaN(Number(draft.max_outstanding_principal)) ? null : Number(draft.max_outstanding_principal),
			min_repayment_frequency_days: Number(draft.min_repayment_frequency_days),
			max_repayment_frequency_days: Number(draft.max_repayment_frequency_days),
			min_age: Number(draft.min_age),
			required_kyc_status: draft.required_kyc_status,
			required_activation_status: draft.required_activation_status
		};
		const { error } = draft.id ? await supabase.from("loan_tiers").update(payload).eq("id", draft.id) : await supabase.from("loan_tiers").insert(payload);
		setSaving(false);
		if (error) return toast.error(error.message);
		toast.success(draft.id ? "Tier updated" : "Tier created");
		setOpen(false);
		load();
	};
	const toggleActive = async (t) => {
		const { error } = await supabase.from("loan_tiers").update({ is_active: !t.is_active }).eq("id", t.id);
		if (error) return toast.error(error.message);
		toast.success(!t.is_active ? "Tier activated" : "Tier deactivated");
		load();
	};
	const remove = async (t) => {
		if (!confirm(`Delete tier "${t.name}"?`)) return;
		const { error } = await supabase.from("loan_tiers").delete().eq("id", t.id);
		if (error) return toast.error(error.message);
		toast.success("Tier deleted");
		load();
	};
	const summary = useMemo(() => ({
		total: tiers.length,
		active: tiers.filter((t) => t.is_active).length
	}), [tiers]);
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-end justify-between gap-4",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h1", {
					className: "flex items-center gap-2 text-2xl font-semibold tracking-tight text-foreground",
					children: [/* @__PURE__ */ jsx(Layers, { className: "size-6 text-emerald" }), " Loan tiers"]
				}), /* @__PURE__ */ jsxs("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: [
						"Configure loan products without code changes. ",
						summary.active,
						" active of ",
						summary.total,
						"."
					]
				})] }), /* @__PURE__ */ jsxs(Button, {
					onClick: openCreate,
					className: "bg-emerald text-emerald-foreground hover:bg-emerald/90",
					children: [/* @__PURE__ */ jsx(Plus, { className: "size-4" }), " New tier"]
				})]
			}),
			loading ? /* @__PURE__ */ jsx("div", {
				className: "flex items-center justify-center py-20 text-muted-foreground",
				children: /* @__PURE__ */ jsx(Loader2, { className: "size-5 animate-spin" })
			}) : tiers.length === 0 ? /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, {
				className: "py-12 text-center text-sm text-muted-foreground",
				children: "No loan tiers yet. Create your first to make loans available to borrowers."
			}) }) : /* @__PURE__ */ jsx("div", {
				className: "grid gap-4 md:grid-cols-2 xl:grid-cols-3",
				children: tiers.map((t) => /* @__PURE__ */ jsxs(Card, {
					className: t.is_active ? "" : "opacity-60",
					children: [/* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", {
						className: "flex items-start justify-between gap-2",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(CardTitle, {
							className: "text-lg",
							children: t.name
						}), t.description && /* @__PURE__ */ jsx("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: t.description
						})] }), /* @__PURE__ */ jsx(Badge, {
							variant: t.is_active ? "default" : "secondary",
							className: t.is_active ? "bg-emerald text-emerald-foreground" : "",
							children: t.is_active ? "Active" : "Inactive"
						})]
					}) }), /* @__PURE__ */ jsxs(CardContent, {
						className: "space-y-4",
						children: [/* @__PURE__ */ jsxs("dl", {
							className: "grid grid-cols-2 gap-3 text-sm",
							children: [
								/* @__PURE__ */ jsx(Stat, {
									label: "Amount",
									value: `K ${fmt(t.min_amount)} – K ${fmt(t.max_amount)}`
								}),
								/* @__PURE__ */ jsx(Stat, {
									label: "Term",
									value: `${t.min_term_months}–${t.max_term_months} mo`
								}),
								/* @__PURE__ */ jsx(Stat, {
									label: "Interest",
									value: `${t.interest_rate}% / mo`
								}),
								/* @__PURE__ */ jsx(Stat, {
									label: "Processing",
									value: `K ${fmt(t.processing_fee)}`
								}),
								/* @__PURE__ */ jsx(Stat, {
									label: "Activation",
									value: `K ${fmt(t.activation_fee)}`
								}),
								/* @__PURE__ */ jsx(Stat, {
									label: "Max active",
									value: `${t.max_active_loans} loan${t.max_active_loans === 1 ? "" : "s"}`
								}),
								/* @__PURE__ */ jsx(Stat, {
									label: "Outstanding cap",
									value: t.max_outstanding_principal == null ? "None" : `K ${fmt(t.max_outstanding_principal)}`
								}),
								/* @__PURE__ */ jsx(Stat, {
									label: "Repay every",
									value: `${t.min_repayment_frequency_days}–${t.max_repayment_frequency_days} days`
								}),
								/* @__PURE__ */ jsx(Stat, {
									label: "Min age",
									value: `${t.min_age}`
								}),
								/* @__PURE__ */ jsx(Stat, {
									label: "Requires",
									value: `KYC ${t.required_kyc_status}`
								})
							]
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex flex-wrap items-center gap-2 border-t border-hairline pt-3",
							children: [
								/* @__PURE__ */ jsxs(Button, {
									size: "sm",
									variant: "outline",
									onClick: () => openEdit(t),
									children: [/* @__PURE__ */ jsx(Pencil, { className: "size-3.5" }), " Edit"]
								}),
								/* @__PURE__ */ jsxs(Button, {
									size: "sm",
									variant: "outline",
									onClick: () => toggleActive(t),
									children: [t.is_active ? /* @__PURE__ */ jsx(PowerOff, { className: "size-3.5" }) : /* @__PURE__ */ jsx(Power, { className: "size-3.5" }), t.is_active ? "Deactivate" : "Activate"]
								}),
								/* @__PURE__ */ jsx(Button, {
									size: "sm",
									variant: "ghost",
									onClick: () => remove(t),
									className: "ml-auto text-destructive hover:text-destructive",
									children: /* @__PURE__ */ jsx(Trash2, { className: "size-3.5" })
								})
							]
						})]
					})]
				}, t.id))
			}),
			/* @__PURE__ */ jsx(Dialog, {
				open,
				onOpenChange: setOpen,
				children: /* @__PURE__ */ jsxs(DialogContent, {
					className: "max-w-2xl",
					children: [
						/* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: draft.id ? "Edit tier" : "New tier" }) }),
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-2 gap-4",
							children: [
								/* @__PURE__ */ jsx(Field, {
									label: "Name",
									className: "col-span-2",
									children: /* @__PURE__ */ jsx(Input, {
										value: draft.name,
										onChange: (e) => setDraft({
											...draft,
											name: e.target.value
										})
									})
								}),
								/* @__PURE__ */ jsx(Field, {
									label: "Description",
									className: "col-span-2",
									children: /* @__PURE__ */ jsx(Textarea, {
										rows: 2,
										value: draft.description ?? "",
										onChange: (e) => setDraft({
											...draft,
											description: e.target.value
										})
									})
								}),
								/* @__PURE__ */ jsx(Field, {
									label: "Min amount (K)",
									children: /* @__PURE__ */ jsx(Input, {
										type: "number",
										value: draft.min_amount,
										onChange: (e) => setDraft({
											...draft,
											min_amount: Number(e.target.value)
										})
									})
								}),
								/* @__PURE__ */ jsx(Field, {
									label: "Max amount (K)",
									children: /* @__PURE__ */ jsx(Input, {
										type: "number",
										value: draft.max_amount,
										onChange: (e) => setDraft({
											...draft,
											max_amount: Number(e.target.value)
										})
									})
								}),
								/* @__PURE__ */ jsx(Field, {
									label: "Min term (months)",
									children: /* @__PURE__ */ jsx(Input, {
										type: "number",
										value: draft.min_term_months,
										onChange: (e) => setDraft({
											...draft,
											min_term_months: Number(e.target.value)
										})
									})
								}),
								/* @__PURE__ */ jsx(Field, {
									label: "Max term (months)",
									children: /* @__PURE__ */ jsx(Input, {
										type: "number",
										value: draft.max_term_months,
										onChange: (e) => setDraft({
											...draft,
											max_term_months: Number(e.target.value)
										})
									})
								}),
								/* @__PURE__ */ jsx(Field, {
									label: "Interest rate (% / month)",
									children: /* @__PURE__ */ jsx(Input, {
										type: "number",
										step: "0.01",
										value: draft.interest_rate,
										onChange: (e) => setDraft({
											...draft,
											interest_rate: Number(e.target.value)
										})
									})
								}),
								/* @__PURE__ */ jsx(Field, {
									label: "Sort order",
									children: /* @__PURE__ */ jsx(Input, {
										type: "number",
										value: draft.sort_order,
										onChange: (e) => setDraft({
											...draft,
											sort_order: Number(e.target.value)
										})
									})
								}),
								/* @__PURE__ */ jsx(Field, {
									label: "Processing fee (K)",
									children: /* @__PURE__ */ jsx(Input, {
										type: "number",
										value: draft.processing_fee,
										onChange: (e) => setDraft({
											...draft,
											processing_fee: Number(e.target.value)
										})
									})
								}),
								/* @__PURE__ */ jsx(Field, {
									label: "Activation fee (K)",
									children: /* @__PURE__ */ jsx(Input, {
										type: "number",
										value: draft.activation_fee,
										onChange: (e) => setDraft({
											...draft,
											activation_fee: Number(e.target.value)
										})
									})
								}),
								/* @__PURE__ */ jsx(Field, {
									label: "Max active loans per borrower",
									children: /* @__PURE__ */ jsx(Input, {
										type: "number",
										min: 1,
										value: draft.max_active_loans,
										onChange: (e) => setDraft({
											...draft,
											max_active_loans: Number(e.target.value)
										})
									})
								}),
								/* @__PURE__ */ jsx(Field, {
									label: "Outstanding principal cap (K, blank = no cap)",
									children: /* @__PURE__ */ jsx(Input, {
										type: "number",
										value: draft.max_outstanding_principal ?? "",
										onChange: (e) => setDraft({
											...draft,
											max_outstanding_principal: e.target.value === "" ? null : Number(e.target.value)
										})
									})
								}),
								/* @__PURE__ */ jsx(Field, {
									label: "Min repayment frequency (days)",
									children: /* @__PURE__ */ jsx(Input, {
										type: "number",
										min: 1,
										value: draft.min_repayment_frequency_days,
										onChange: (e) => setDraft({
											...draft,
											min_repayment_frequency_days: Number(e.target.value)
										})
									})
								}),
								/* @__PURE__ */ jsx(Field, {
									label: "Max repayment frequency (days)",
									children: /* @__PURE__ */ jsx(Input, {
										type: "number",
										min: 1,
										value: draft.max_repayment_frequency_days,
										onChange: (e) => setDraft({
											...draft,
											max_repayment_frequency_days: Number(e.target.value)
										})
									})
								}),
								/* @__PURE__ */ jsx(Field, {
									label: "Minimum age",
									children: /* @__PURE__ */ jsx(Input, {
										type: "number",
										min: 18,
										value: draft.min_age,
										onChange: (e) => setDraft({
											...draft,
											min_age: Number(e.target.value)
										})
									})
								}),
								/* @__PURE__ */ jsx(Field, {
									label: "Required KYC status",
									children: /* @__PURE__ */ jsx(Input, {
										value: draft.required_kyc_status,
										onChange: (e) => setDraft({
											...draft,
											required_kyc_status: e.target.value
										})
									})
								}),
								/* @__PURE__ */ jsx(Field, {
									label: "Required activation status",
									children: /* @__PURE__ */ jsx(Input, {
										value: draft.required_activation_status,
										onChange: (e) => setDraft({
											...draft,
											required_activation_status: e.target.value
										})
									})
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "col-span-2 flex items-center justify-between rounded-lg border border-hairline p-3",
									children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, {
										className: "text-sm",
										children: "Active"
									}), /* @__PURE__ */ jsx("p", {
										className: "text-xs text-muted-foreground",
										children: "Borrowers see only active tiers."
									})] }), /* @__PURE__ */ jsx(Switch, {
										checked: draft.is_active,
										onCheckedChange: (v) => setDraft({
											...draft,
											is_active: v
										})
									})]
								})
							]
						}),
						/* @__PURE__ */ jsxs(DialogFooter, { children: [/* @__PURE__ */ jsx(Button, {
							variant: "outline",
							onClick: () => setOpen(false),
							disabled: saving,
							children: "Cancel"
						}), /* @__PURE__ */ jsxs(Button, {
							onClick: save,
							disabled: saving,
							className: "bg-emerald text-emerald-foreground hover:bg-emerald/90",
							children: [saving && /* @__PURE__ */ jsx(Loader2, { className: "size-4 animate-spin" }), draft.id ? "Save changes" : "Create tier"]
						})] })
					]
				})
			})
		]
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", {
		className: "text-xs text-muted-foreground",
		children: label
	}), /* @__PURE__ */ jsx("dd", {
		className: "font-medium text-foreground",
		children: value
	})] });
}
function Field({ label, children, className }) {
	return /* @__PURE__ */ jsxs("div", {
		className,
		children: [/* @__PURE__ */ jsx(Label, {
			className: "mb-1.5 block text-xs font-medium text-foreground",
			children: label
		}), children]
	});
}
//#endregion
export { AdminTiers as component };

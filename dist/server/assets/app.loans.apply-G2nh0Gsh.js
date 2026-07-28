import { t as applicationSchema } from "./schemas-Cze1BLcm.js";
import { t as computeLoan } from "./calc-hbospc3j.js";
import { t as supabase } from "./client-CrwDbVDs.js";
import { t as cn } from "./utils-C_uf36nf.js";
import { t as Card } from "./card-BXjpJ96D.js";
import { a as formatMoney } from "./format-ocX-SQtS.js";
import { t as Button } from "./button-PJVP9td7.js";
import { t as Input } from "./input-B8Q2ztVi.js";
import { t as Label } from "./label-DBD1bRRP.js";
import { t as Textarea } from "./textarea-kko37XEX.js";
import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import * as SliderPrimitive from "@radix-ui/react-slider";
//#region src/components/ui/slider.tsx
var Slider = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxs(SliderPrimitive.Root, {
	ref,
	className: cn("relative flex w-full touch-none select-none items-center", className),
	...props,
	children: [/* @__PURE__ */ jsx(SliderPrimitive.Track, {
		className: "relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20",
		children: /* @__PURE__ */ jsx(SliderPrimitive.Range, { className: "absolute h-full bg-primary" })
	}), /* @__PURE__ */ jsx(SliderPrimitive.Thumb, { className: "block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" })]
}));
Slider.displayName = SliderPrimitive.Root.displayName;
//#endregion
//#region src/routes/_authenticated/app.loans.apply.tsx?tsr-split=component
function ApplyPage() {
	const navigate = useNavigate();
	const { data: products, isLoading } = useQuery({
		queryKey: ["loan-products-eligible"],
		queryFn: async () => {
			const { data: u } = await supabase.auth.getUser();
			const { data: prof } = await supabase.from("profiles").select("country, kyc_status").eq("user_id", u.user.id).maybeSingle();
			const q = supabase.from("loan_products").select("*").eq("active", true);
			const { data } = prof?.country ? await q.eq("country", prof.country) : await q;
			return {
				products: data ?? [],
				profile: prof
			};
		}
	});
	const [productId, setProductId] = useState(null);
	const product = products?.products.find((p) => p.id === productId);
	const [amount, setAmount] = useState(0);
	const [term, setTerm] = useState(30);
	const [purpose, setPurpose] = useState("");
	const [submitting, setSubmitting] = useState(false);
	useEffect(() => {
		if (product) {
			setAmount(Math.round((product.min_amount + product.max_amount) / 2));
			setTerm(product.term_days);
		}
	}, [productId, product]);
	const summary = useMemo(() => {
		if (!product) return null;
		return computeLoan(amount, Number(product.interest_rate_pct), term);
	}, [
		product,
		amount,
		term
	]);
	async function submit(e) {
		e.preventDefault();
		if (!product) return;
		const parsed = applicationSchema.safeParse({
			product_id: product.id,
			requested_amount: amount,
			term_days: term,
			purpose
		});
		if (!parsed.success) return toast.error(parsed.error.issues[0].message);
		if (amount < product.min_amount || amount > product.max_amount) return toast.error(`Amount must be between ${formatMoney(product.min_amount, product.currency)} and ${formatMoney(product.max_amount, product.currency)}`);
		setSubmitting(true);
		const { data: u } = await supabase.auth.getUser();
		const { error } = await supabase.from("loan_applications").insert({
			user_id: u.user.id,
			product_id: product.id,
			requested_amount: amount,
			term_days: term,
			purpose
		});
		setSubmitting(false);
		if (error) return toast.error(error.message);
		toast.success("Application submitted");
		navigate({ to: "/app/loans" });
	}
	if (isLoading || !products) return /* @__PURE__ */ jsx("div", {
		className: "text-muted-foreground",
		children: "Loading products…"
	});
	if (!products.profile?.country) return /* @__PURE__ */ jsxs(Card, {
		className: "mx-auto max-w-2xl p-6",
		children: [
			/* @__PURE__ */ jsx("h2", {
				className: "font-display text-xl font-semibold",
				children: "Complete your profile first"
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "We need your country and details before showing loan options."
			}),
			/* @__PURE__ */ jsx(Button, {
				asChild: true,
				className: "mt-4",
				children: /* @__PURE__ */ jsx("a", {
					href: "/app/profile",
					children: "Go to profile"
				})
			})
		]
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-3xl space-y-6",
		children: [
			/* @__PURE__ */ jsxs("header", { children: [/* @__PURE__ */ jsx("h1", {
				className: "font-display text-3xl font-semibold",
				children: "Apply for a loan"
			}), /* @__PURE__ */ jsx("p", {
				className: "text-sm text-muted-foreground",
				children: "Pick a product, choose your amount and term."
			})] }),
			/* @__PURE__ */ jsx("div", {
				className: "grid gap-3 sm:grid-cols-2",
				children: products.products.map((p) => /* @__PURE__ */ jsxs("button", {
					type: "button",
					onClick: () => setProductId(p.id),
					className: "rounded-2xl border p-5 text-left transition hover:border-accent " + (productId === p.id ? "border-accent bg-accent/5" : "bg-card"),
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "font-display text-lg font-semibold",
							children: p.name
						}),
						/* @__PURE__ */ jsx("div", {
							className: "text-xs text-muted-foreground",
							children: p.description
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-3 grid grid-cols-2 gap-1 text-xs",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-muted-foreground",
									children: "Range"
								}),
								/* @__PURE__ */ jsxs("span", {
									className: "tabular text-right",
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
									className: "tabular text-right",
									children: [Number(p.interest_rate_pct), "%"]
								}),
								/* @__PURE__ */ jsx("span", {
									className: "text-muted-foreground",
									children: "Term"
								}),
								/* @__PURE__ */ jsxs("span", {
									className: "tabular text-right",
									children: [p.term_days, " days"]
								})
							]
						})
					]
				}, p.id))
			}),
			product && summary && /* @__PURE__ */ jsx(Card, {
				className: "p-6",
				children: /* @__PURE__ */ jsxs("form", {
					onSubmit: submit,
					className: "space-y-6",
					children: [
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
							className: "mb-2 flex items-center justify-between",
							children: [/* @__PURE__ */ jsx(Label, { children: "Amount" }), /* @__PURE__ */ jsx("span", {
								className: "font-display text-xl font-semibold tabular",
								children: formatMoney(amount, product.currency)
							})]
						}), /* @__PURE__ */ jsx(Slider, {
							min: product.min_amount,
							max: product.max_amount,
							step: Math.max(1, Math.round((product.max_amount - product.min_amount) / 100)),
							value: [amount],
							onValueChange: ([v]) => setAmount(v)
						})] }),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
							className: "mb-2 flex items-center justify-between",
							children: [/* @__PURE__ */ jsx(Label, { children: "Term (days)" }), /* @__PURE__ */ jsx("span", {
								className: "font-display text-xl font-semibold tabular",
								children: term
							})]
						}), /* @__PURE__ */ jsx(Input, {
							type: "number",
							min: 7,
							max: product.term_days,
							value: term,
							onChange: (e) => setTerm(Number(e.target.value))
						})] }),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ jsx(Label, { children: "Purpose" }), /* @__PURE__ */ jsx(Textarea, {
								rows: 3,
								value: purpose,
								onChange: (e) => setPurpose(e.target.value),
								required: true,
								minLength: 3,
								placeholder: "e.g. School fees, business stock, emergency"
							})]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "rounded-xl border bg-muted/40 p-4 text-sm",
							children: /* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-2 gap-2 tabular",
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "text-muted-foreground",
										children: "Principal"
									}),
									/* @__PURE__ */ jsx("span", {
										className: "text-right",
										children: formatMoney(summary.principal, product.currency)
									}),
									/* @__PURE__ */ jsx("span", {
										className: "text-muted-foreground",
										children: "Interest"
									}),
									/* @__PURE__ */ jsx("span", {
										className: "text-right",
										children: formatMoney(summary.interest, product.currency)
									}),
									/* @__PURE__ */ jsx("span", {
										className: "text-muted-foreground",
										children: "Total payable"
									}),
									/* @__PURE__ */ jsx("span", {
										className: "text-right font-semibold",
										children: formatMoney(summary.total, product.currency)
									}),
									/* @__PURE__ */ jsx("span", {
										className: "text-muted-foreground",
										children: "Due date"
									}),
									/* @__PURE__ */ jsx("span", {
										className: "text-right",
										children: summary.dueDate
									})
								]
							})
						}),
						/* @__PURE__ */ jsx(Button, {
							type: "submit",
							size: "lg",
							className: "w-full",
							disabled: submitting,
							children: submitting ? "Submitting…" : "Submit application"
						})
					]
				})
			})
		]
	});
}
//#endregion
export { ApplyPage as component };

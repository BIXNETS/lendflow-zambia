import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-BXjpJ96D.js";
import { t as Badge } from "./badge-D1Dupn2y.js";
import { t as Button } from "./button-PJVP9td7.js";
import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { ArrowUpRight, Calendar, CheckCircle2, Clock, DollarSign, Percent, Shield, Smartphone, TrendingUp, Zap } from "lucide-react";
//#region src/routes/loans-calculator.tsx?tsr-split=component
var baseOffers = [
	{
		id: "1",
		provider: "LendFlow Prime",
		interestRate: 8.5,
		apr: 9.1,
		processingFee: 0,
		earlyRepayment: true,
		featured: true
	},
	{
		id: "2",
		provider: "Kwacha Capital",
		interestRate: 10.25,
		apr: 11,
		processingFee: 150,
		earlyRepayment: true
	},
	{
		id: "3",
		provider: "Zamloan Express",
		interestRate: 12.5,
		apr: 13.4,
		processingFee: 300,
		earlyRepayment: false
	}
];
function calcMonthly(principal, ratePct, months) {
	const r = ratePct / 100 / 12;
	if (r === 0) return Math.round(principal / months);
	const p = principal * r * Math.pow(1 + r, months) / (Math.pow(1 + r, months) - 1);
	return Math.round(p);
}
var fmtZmw = (n) => new Intl.NumberFormat("en-ZM", { maximumFractionDigits: 0 }).format(n);
function PhoneMockup() {
	const steps = [
		{
			title: "Enter Amount",
			subtitle: "How much do you need?",
			icon: DollarSign
		},
		{
			title: "Select Term",
			subtitle: "Choose your repayment period",
			icon: Calendar
		},
		{
			title: "Compare Offers",
			subtitle: "See personalised rates",
			icon: TrendingUp
		},
		{
			title: "Instant Approval",
			subtitle: "Funds to your wallet",
			icon: CheckCircle2
		}
	];
	const [step, setStep] = useState(0);
	useEffect(() => {
		const id = setInterval(() => setStep((p) => (p + 1) % steps.length), 3e3);
		return () => clearInterval(id);
	}, [steps.length]);
	const current = steps[step];
	const Icon = current.icon;
	return /* @__PURE__ */ jsx("div", {
		className: "relative mx-auto w-[280px]",
		children: /* @__PURE__ */ jsx("div", {
			className: "relative rounded-[2.75rem] bg-navy p-3 shadow-2xl shadow-navy/30",
			children: /* @__PURE__ */ jsxs("div", {
				className: "relative overflow-hidden rounded-[2.25rem] bg-surface aspect-[9/19]",
				children: [/* @__PURE__ */ jsx("div", { className: "absolute left-1/2 top-2 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-navy" }), /* @__PURE__ */ jsxs("div", {
					className: "flex h-full flex-col px-6 pt-10",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between text-[10px] font-medium text-muted-foreground",
							children: [/* @__PURE__ */ jsx("span", { children: "9:41" }), /* @__PURE__ */ jsx("span", { children: "LendFlow" })]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "flex flex-1 items-center justify-center",
							children: /* @__PURE__ */ jsxs("div", {
								className: "flex flex-col items-center text-center",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald text-emerald-foreground",
										children: /* @__PURE__ */ jsx(Icon, { className: "h-7 w-7" })
									}),
									/* @__PURE__ */ jsx("h3", {
										className: "text-base font-semibold text-foreground",
										children: current.title
									}),
									/* @__PURE__ */ jsx("p", {
										className: "mt-1 text-xs text-muted-foreground",
										children: current.subtitle
									}),
									/* @__PURE__ */ jsx("div", {
										className: "mt-6 flex gap-1.5",
										children: steps.map((_, i) => /* @__PURE__ */ jsx("span", { className: `h-1.5 rounded-full transition-all ${i === step ? "w-6 bg-emerald" : "w-1.5 bg-hairline"}` }, i))
									})
								]
							}, step)
						}),
						/* @__PURE__ */ jsx("div", {
							className: "pb-6",
							children: /* @__PURE__ */ jsx("div", { className: "h-10 rounded-xl bg-navy/90" })
						})
					]
				})]
			})
		})
	});
}
function OfferCard({ offer, amount, term }) {
	const monthly = calcMonthly(amount, offer.interestRate, term);
	const total = monthly * term;
	return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs(Card, {
		className: offer.featured ? "border-emerald/40 ring-1 ring-emerald/30" : "",
		children: [/* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", {
			className: "flex items-start justify-between",
			children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(CardTitle, {
				className: "text-lg",
				children: offer.provider
			}), /* @__PURE__ */ jsxs("div", {
				className: "mt-1 flex items-center gap-1.5 text-xs text-muted-foreground",
				children: [/* @__PURE__ */ jsx(Shield, { className: "h-3.5 w-3.5" }), "Verified lender"]
			})] }), offer.featured && /* @__PURE__ */ jsx(Badge, {
				className: "bg-emerald text-emerald-foreground",
				children: "Best offer"
			})]
		}) }), /* @__PURE__ */ jsxs(CardContent, {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-2 gap-4 rounded-lg bg-surface-muted p-4",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
						className: "text-xs text-muted-foreground",
						children: "Monthly"
					}), /* @__PURE__ */ jsxs("p", {
						className: "text-xl font-semibold text-foreground",
						children: ["K ", fmtZmw(monthly)]
					})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
						className: "text-xs text-muted-foreground",
						children: "Rate"
					}), /* @__PURE__ */ jsxs("p", {
						className: "text-xl font-semibold text-foreground",
						children: [offer.interestRate, "%"]
					})] })]
				}),
				/* @__PURE__ */ jsxs("dl", {
					className: "space-y-2 text-sm",
					children: [
						/* @__PURE__ */ jsx(Row, {
							label: "Total repayment",
							value: `K ${fmtZmw(total)}`
						}),
						/* @__PURE__ */ jsx(Row, {
							label: "APR",
							value: `${offer.apr}%`
						}),
						/* @__PURE__ */ jsx(Row, {
							label: "Processing fee",
							value: offer.processingFee === 0 ? "Free" : `K ${fmtZmw(offer.processingFee)}`
						}),
						/* @__PURE__ */ jsx(Row, {
							label: "Early repayment",
							value: offer.earlyRepayment ? "Allowed" : "Not allowed"
						})
					]
				}),
				/* @__PURE__ */ jsx(Button, {
					className: "w-full",
					asChild: true,
					children: /* @__PURE__ */ jsxs(Link, {
						to: "/dashboard",
						children: ["Apply now ", /* @__PURE__ */ jsx(ArrowUpRight, { className: "h-4 w-4" })]
					})
				})
			]
		})]
	}) });
}
function Row({ label, value }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex items-center justify-between border-b border-hairline pb-2 last:border-0 last:pb-0",
		children: [/* @__PURE__ */ jsx("dt", {
			className: "text-muted-foreground",
			children: label
		}), /* @__PURE__ */ jsx("dd", {
			className: "font-medium text-foreground",
			children: value
		})]
	});
}
function LoansCalculatorPage() {
	const [amount, setAmount] = useState(5e3);
	const [term, setTerm] = useState(12);
	const offers = useMemo(() => baseOffers, []);
	const best = useMemo(() => {
		const monthly = calcMonthly(amount, offers[0].interestRate, term);
		return {
			monthly,
			total: monthly * term,
			interest: monthly * term - amount
		};
	}, [
		amount,
		term,
		offers
	]);
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ jsx("header", {
			className: "border-b border-hairline bg-card",
			children: /* @__PURE__ */ jsxs("div", {
				className: "mx-auto flex max-w-6xl items-center justify-between px-6 py-5",
				children: [/* @__PURE__ */ jsxs(Link, {
					to: "/",
					className: "text-lg font-semibold tracking-tight text-foreground",
					children: ["LendFlow ", /* @__PURE__ */ jsx("span", {
						className: "text-emerald",
						children: "Zambia"
					})]
				}), /* @__PURE__ */ jsx(Button, {
					asChild: true,
					variant: "outline",
					children: /* @__PURE__ */ jsx(Link, {
						to: "/auth",
						children: "Sign in"
					})
				})]
			})
		}), /* @__PURE__ */ jsxs("main", {
			className: "mx-auto max-w-6xl space-y-20 px-6 py-16",
			children: [
				/* @__PURE__ */ jsxs("section", {
					className: "grid items-center gap-12 lg:grid-cols-2",
					children: [/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsxs("div", {
							className: "inline-flex items-center gap-2 rounded-full border border-hairline bg-surface-muted px-3 py-1 text-xs font-medium text-foreground",
							children: [/* @__PURE__ */ jsx(Zap, { className: "h-3.5 w-3.5 text-emerald" }), "Instant approval in 60 seconds"]
						}),
						/* @__PURE__ */ jsxs("h1", {
							className: "mt-6 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl",
							children: ["Borrow with clarity.", /* @__PURE__ */ jsx("span", {
								className: "block text-emerald",
								children: "Repay with confidence."
							})]
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-5 max-w-lg text-base text-muted-foreground",
							children: "Compare personalised loan offers from trusted Zambian lenders. Transparent rates, mobile-money disbursement, and funds in your wallet within 24 hours."
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-8 grid gap-4 sm:grid-cols-2",
							children: [/* @__PURE__ */ jsx(Feature, {
								icon: Shield,
								title: "Bank-level security",
								sub: "256-bit encryption"
							}), /* @__PURE__ */ jsx(Feature, {
								icon: Clock,
								title: "24/7 support",
								sub: "Always here to help"
							})]
						}),
						/* @__PURE__ */ jsx(Button, {
							size: "lg",
							className: "mt-8 bg-emerald text-emerald-foreground hover:bg-emerald/90",
							asChild: true,
							children: /* @__PURE__ */ jsxs(Link, {
								to: "/auth",
								children: ["Get started ", /* @__PURE__ */ jsx(ArrowUpRight, { className: "h-4 w-4" })]
							})
						})
					] }), /* @__PURE__ */ jsx(PhoneMockup, {})]
				}),
				/* @__PURE__ */ jsxs(Card, { children: [/* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ jsx(DollarSign, { className: "h-5 w-5 text-emerald" }), "Loan calculator"]
				}) }), /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", {
					className: "grid gap-8 lg:grid-cols-2",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "space-y-6",
						children: [/* @__PURE__ */ jsx(Slider, {
							label: "Loan amount",
							value: amount,
							min: 500,
							max: 5e4,
							step: 500,
							display: `K ${fmtZmw(amount)}`,
							onChange: setAmount
						}), /* @__PURE__ */ jsx(Slider, {
							label: "Loan term",
							value: term,
							min: 3,
							max: 36,
							step: 1,
							display: `${term} months`,
							onChange: setTerm
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "rounded-xl bg-navy p-6 text-navy-foreground",
						children: [
							/* @__PURE__ */ jsx("p", {
								className: "text-xs uppercase tracking-wider text-navy-foreground/70",
								children: "Estimated monthly payment"
							}),
							/* @__PURE__ */ jsxs("p", {
								className: "mt-2 text-4xl font-semibold",
								children: ["K ", fmtZmw(best.monthly)]
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-1 text-xs text-navy-foreground/70",
								children: "Based on best available rate"
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "mt-6 grid grid-cols-2 gap-4 border-t border-white/10 pt-4 text-sm",
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
									className: "text-navy-foreground/70",
									children: "Total interest"
								}), /* @__PURE__ */ jsxs("p", {
									className: "mt-1 font-semibold",
									children: ["K ", fmtZmw(best.interest)]
								})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
									className: "text-navy-foreground/70",
									children: "Total repayment"
								}), /* @__PURE__ */ jsxs("p", {
									className: "mt-1 font-semibold",
									children: ["K ", fmtZmw(best.total)]
								})] })]
							})
						]
					})]
				}) })] }),
				/* @__PURE__ */ jsxs("section", {
					className: "grid gap-4 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ jsx(Stat, {
							icon: Percent,
							value: "8.5%",
							label: "Lowest rate"
						}),
						/* @__PURE__ */ jsx(Stat, {
							icon: CheckCircle2,
							value: "95%",
							label: "Approval rate"
						}),
						/* @__PURE__ */ jsx(Stat, {
							icon: Smartphone,
							value: "<24h",
							label: "Wallet disbursement"
						})
					]
				}),
				/* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsxs("div", {
					className: "mb-6 flex items-end justify-between",
					children: [/* @__PURE__ */ jsx("h2", {
						className: "text-2xl font-semibold tracking-tight text-foreground",
						children: "Available loan offers"
					}), /* @__PURE__ */ jsx("p", {
						className: "text-sm text-muted-foreground",
						children: "Updated in real time"
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "grid gap-6 md:grid-cols-3",
					children: offers.map((o, i) => /* @__PURE__ */ jsx(OfferCard, {
						offer: o,
						amount,
						term,
						index: i
					}, o.id))
				})] }),
				/* @__PURE__ */ jsx("p", {
					className: "text-center text-xs text-muted-foreground",
					children: "All rates are subject to approval and may vary based on credit assessment."
				})
			]
		})]
	});
}
function Feature({ icon: Icon, title, sub }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex items-start gap-3 rounded-xl border border-hairline bg-card p-4",
		children: [/* @__PURE__ */ jsx("div", {
			className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald/10 text-emerald",
			children: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5" })
		}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
			className: "text-sm font-semibold text-foreground",
			children: title
		}), /* @__PURE__ */ jsx("p", {
			className: "text-xs text-muted-foreground",
			children: sub
		})] })]
	});
}
function Stat({ icon: Icon, value, label }) {
	return /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, {
		className: "flex items-center gap-4 p-6",
		children: [/* @__PURE__ */ jsx("div", {
			className: "flex h-12 w-12 items-center justify-center rounded-lg bg-emerald/10 text-emerald",
			children: /* @__PURE__ */ jsx(Icon, { className: "h-6 w-6" })
		}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
			className: "text-2xl font-semibold text-foreground",
			children: value
		}), /* @__PURE__ */ jsx("p", {
			className: "text-xs text-muted-foreground",
			children: label
		})] })]
	}) });
}
function Slider({ label, value, min, max, step, display, onChange }) {
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsxs("div", {
			className: "mb-2 flex items-center justify-between",
			children: [/* @__PURE__ */ jsx("label", {
				className: "text-sm font-medium text-foreground",
				children: label
			}), /* @__PURE__ */ jsx("span", {
				className: "text-sm font-semibold text-emerald",
				children: display
			})]
		}),
		/* @__PURE__ */ jsx("input", {
			type: "range",
			min,
			max,
			step,
			value,
			onChange: (e) => onChange(Number(e.target.value)),
			className: "h-2 w-full cursor-pointer appearance-none rounded-lg bg-hairline accent-emerald"
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "mt-1 flex justify-between text-xs text-muted-foreground",
			children: [/* @__PURE__ */ jsx("span", { children: label.includes("amount") ? `K ${fmtZmw(min)}` : `${min} mo` }), /* @__PURE__ */ jsx("span", { children: label.includes("amount") ? `K ${fmtZmw(max)}` : `${max} mo` })]
		})
	] });
}
//#endregion
export { LoansCalculatorPage as component };

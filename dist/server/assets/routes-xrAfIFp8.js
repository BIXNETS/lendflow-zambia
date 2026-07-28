import { t as Button } from "./button-PJVP9td7.js";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { Globe2, ShieldCheck, Smartphone, Zap } from "lucide-react";
//#region src/routes/index.tsx?tsr-split=component
function Landing() {
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen",
		children: [
			/* @__PURE__ */ jsx("header", {
				className: "sticky top-0 z-30 border-b bg-background/80 backdrop-blur",
				children: /* @__PURE__ */ jsxs("div", {
					className: "mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6",
					children: [/* @__PURE__ */ jsxs(Link, {
						to: "/",
						className: "flex items-center gap-2 font-display text-lg font-semibold",
						children: [/* @__PURE__ */ jsx("span", {
							className: "grid size-8 place-items-center rounded-lg bg-accent text-accent-foreground",
							children: "A"
						}), "Akiba Loans"]
					}), /* @__PURE__ */ jsxs("nav", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ jsx(Link, {
							to: "/auth",
							children: /* @__PURE__ */ jsx(Button, {
								variant: "ghost",
								children: "Sign in"
							})
						}), /* @__PURE__ */ jsx(Link, {
							to: "/auth",
							search: { mode: "signup" },
							children: /* @__PURE__ */ jsx(Button, { children: "Get started" })
						})]
					})]
				})
			}),
			/* @__PURE__ */ jsxs("main", { children: [
				/* @__PURE__ */ jsxs("section", {
					className: "relative overflow-hidden",
					children: [
						/* @__PURE__ */ jsx("div", { className: "absolute inset-0 -z-10 bg-gradient-to-br from-sidebar via-sidebar to-primary opacity-95" }),
						/* @__PURE__ */ jsx("div", { className: "absolute inset-0 -z-10 opacity-30 [background-image:radial-gradient(circle_at_30%_20%,oklch(0.7_0.17_158/.4),transparent_50%)]" }),
						/* @__PURE__ */ jsxs("div", {
							className: "mx-auto max-w-6xl px-4 py-24 text-sidebar-foreground sm:px-6 sm:py-32 lg:py-40",
							children: [
								/* @__PURE__ */ jsxs("span", {
									className: "inline-flex items-center gap-2 rounded-full border border-sidebar-foreground/20 bg-sidebar-foreground/5 px-3 py-1 text-xs font-medium",
									children: [/* @__PURE__ */ jsx("span", { className: "size-1.5 rounded-full bg-accent" }), " Trusted in 6 countries"]
								}),
								/* @__PURE__ */ jsxs("h1", {
									className: "mt-6 max-w-3xl font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl",
									children: ["Fair credit, instantly. ", /* @__PURE__ */ jsx("span", {
										className: "text-accent",
										children: "On your phone."
									})]
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-6 max-w-xl text-lg text-sidebar-foreground/75",
									children: "Apply in two minutes. Get funds straight to your M-Pesa, MTN MoMo or Airtel Money wallet. Transparent rates. No hidden fees."
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "mt-10 flex flex-wrap gap-3",
									children: [/* @__PURE__ */ jsx(Link, {
										to: "/auth",
										search: { mode: "signup" },
										children: /* @__PURE__ */ jsx(Button, {
											size: "lg",
											className: "h-12 px-6",
											children: "Apply now"
										})
									}), /* @__PURE__ */ jsx(Link, {
										to: "/auth",
										children: /* @__PURE__ */ jsx(Button, {
											size: "lg",
											variant: "outline",
											className: "h-12 border-sidebar-foreground/20 bg-transparent px-6 text-sidebar-foreground hover:bg-sidebar-foreground/10 hover:text-sidebar-foreground",
											children: "I have an account"
										})
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "mt-16 grid max-w-3xl gap-6 sm:grid-cols-3",
									children: [
										/* @__PURE__ */ jsx(Stat, {
											n: "120k+",
											l: "borrowers served"
										}),
										/* @__PURE__ */ jsx(Stat, {
											n: "2 min",
											l: "average approval"
										}),
										/* @__PURE__ */ jsx(Stat, {
											n: "6",
											l: "African countries"
										})
									]
								})
							]
						})
					]
				}),
				/* @__PURE__ */ jsxs("section", {
					className: "mx-auto max-w-6xl px-4 py-24 sm:px-6",
					children: [
						/* @__PURE__ */ jsx("h2", {
							className: "font-display text-3xl font-semibold tracking-tight sm:text-4xl",
							children: "Why Akiba"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-3 max-w-2xl text-muted-foreground",
							children: "A premium lending experience designed for the way Africa transacts — mobile-first, instant, transparent."
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4",
							children: [
								/* @__PURE__ */ jsx(Feature, {
									icon: /* @__PURE__ */ jsx(Zap, {}),
									title: "2-minute apply",
									body: "Choose amount, pick a term, submit. We decide in minutes."
								}),
								/* @__PURE__ */ jsx(Feature, {
									icon: /* @__PURE__ */ jsx(Smartphone, {}),
									title: "Mobile money native",
									body: "M-Pesa, MTN MoMo, Airtel Money — receive and repay from one place."
								}),
								/* @__PURE__ */ jsx(Feature, {
									icon: /* @__PURE__ */ jsx(ShieldCheck, {}),
									title: "Bank-grade security",
									body: "Encrypted KYC, RLS-protected data, MFA-ready."
								}),
								/* @__PURE__ */ jsx(Feature, {
									icon: /* @__PURE__ */ jsx(Globe2, {}),
									title: "Across the region",
									body: "Kenya, Uganda, Tanzania, Rwanda, Ghana and Nigeria."
								})
							]
						})
					]
				}),
				/* @__PURE__ */ jsx("section", {
					className: "border-t bg-muted/30",
					children: /* @__PURE__ */ jsxs("div", {
						className: "mx-auto max-w-6xl px-4 py-24 sm:px-6",
						children: [/* @__PURE__ */ jsx("h2", {
							className: "font-display text-3xl font-semibold sm:text-4xl",
							children: "How it works"
						}), /* @__PURE__ */ jsx("ol", {
							className: "mt-10 grid gap-8 md:grid-cols-3",
							children: [
								"Verify",
								"Apply",
								"Repay"
							].map((step, i) => /* @__PURE__ */ jsxs("li", {
								className: "rounded-2xl border bg-card p-6",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "grid size-10 place-items-center rounded-lg bg-accent font-display text-lg font-semibold text-accent-foreground",
										children: i + 1
									}),
									/* @__PURE__ */ jsx("h3", {
										className: "mt-4 font-display text-xl font-semibold",
										children: step
									}),
									/* @__PURE__ */ jsxs("p", {
										className: "mt-2 text-sm text-muted-foreground",
										children: [
											i === 0 && "Sign up, complete profile, upload ID. Approved in minutes.",
											i === 1 && "Pick an amount and term. See total payable up front. Submit.",
											i === 2 && "Pay back from your wallet. Top up early to lower your interest."
										]
									})
								]
							}, step))
						})]
					})
				}),
				/* @__PURE__ */ jsx("section", {
					className: "mx-auto max-w-6xl px-4 py-24 sm:px-6",
					children: /* @__PURE__ */ jsxs("div", {
						className: "overflow-hidden rounded-3xl bg-sidebar p-10 text-sidebar-foreground sm:p-16",
						children: [
							/* @__PURE__ */ jsx("h2", {
								className: "max-w-2xl font-display text-3xl font-semibold sm:text-4xl",
								children: "Borrow with dignity. Pay back with ease."
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-3 max-w-xl text-sidebar-foreground/70",
								children: "Join thousands across Africa who use Akiba for life's moments — school fees, business stock, emergencies."
							}),
							/* @__PURE__ */ jsx(Link, {
								to: "/auth",
								search: { mode: "signup" },
								className: "mt-6 inline-block",
								children: /* @__PURE__ */ jsx(Button, {
									size: "lg",
									className: "h-12 px-6",
									children: "Create your account"
								})
							})
						]
					})
				})
			] }),
			/* @__PURE__ */ jsx("footer", {
				className: "border-t",
				children: /* @__PURE__ */ jsxs("div", {
					className: "mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:px-6",
					children: [/* @__PURE__ */ jsxs("span", { children: [
						"© ",
						(/* @__PURE__ */ new Date()).getFullYear(),
						" Akiba Loans. Licensed digital lender."
					] }), /* @__PURE__ */ jsx("span", { children: "Mobile money loans across Africa." })]
				})
			})
		]
	});
}
function Stat({ n, l }) {
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
		className: "font-display text-3xl font-semibold tabular text-accent",
		children: n
	}), /* @__PURE__ */ jsx("div", {
		className: "text-sm text-sidebar-foreground/70",
		children: l
	})] });
}
function Feature({ icon, title, body }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "rounded-2xl border bg-card p-6",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "grid size-10 place-items-center rounded-lg bg-accent/10 text-accent",
				children: icon
			}),
			/* @__PURE__ */ jsx("h3", {
				className: "mt-4 font-display text-lg font-semibold",
				children: title
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: body
			})
		]
	});
}
//#endregion
export { Landing as component };

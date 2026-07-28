import { t as supabase } from "./client-CrwDbVDs.js";
import { a as formatMoney, r as formatDate } from "./format-ocX-SQtS.js";
import { t as Button } from "./button-PJVP9td7.js";
import { t as AutoStatusPill } from "./status-pill-DJaFxHY0.js";
import { t as KpiCard } from "./kpi-card-B3OdEzVj.js";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { FileText, ShieldCheck, TrendingUp, Wallet } from "lucide-react";
//#region src/routes/_authenticated/app.index.tsx?tsr-split=component
function Dashboard() {
	const { data, isLoading } = useQuery({
		queryKey: ["borrower-dashboard"],
		queryFn: async () => {
			const { data: user } = await supabase.auth.getUser();
			const uid = user.user.id;
			const [profile, loans, apps, notifs] = await Promise.all([
				supabase.from("profiles").select("*").eq("user_id", uid).maybeSingle(),
				supabase.from("loans").select("*").eq("user_id", uid).order("created_at", { ascending: false }),
				supabase.from("loan_applications").select("*").eq("user_id", uid).order("created_at", { ascending: false }).limit(5),
				supabase.from("notifications").select("*").eq("user_id", uid).order("created_at", { ascending: false }).limit(5)
			]);
			return {
				profile: profile.data,
				loans: loans.data ?? [],
				apps: apps.data ?? [],
				notifs: notifs.data ?? []
			};
		}
	});
	if (isLoading || !data) return /* @__PURE__ */ jsx("div", {
		className: "text-muted-foreground",
		children: "Loading your dashboard…"
	});
	const active = data.loans.find((l) => l.status === "active");
	const outstanding = data.loans.filter((l) => l.status === "active" || l.status === "pending_disbursement").reduce((s, l) => s + l.outstanding, 0);
	const currency = active?.currency ?? data.loans[0]?.currency ?? "KES";
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-6xl space-y-8",
		children: [
			/* @__PURE__ */ jsxs("header", {
				className: "flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
					className: "text-sm text-muted-foreground",
					children: "Welcome back"
				}), /* @__PURE__ */ jsx("h1", {
					className: "font-display text-3xl font-semibold tracking-tight",
					children: data.profile?.full_name ?? "Borrower"
				})] }), /* @__PURE__ */ jsx(Link, {
					to: "/app/loans/apply",
					children: /* @__PURE__ */ jsx(Button, {
						size: "lg",
						children: "Apply for a loan"
					})
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ jsx(KpiCard, {
						label: "Outstanding",
						value: formatMoney(outstanding, currency),
						icon: /* @__PURE__ */ jsx(Wallet, { className: "size-4" }),
						tone: outstanding > 0 ? "accent" : "default"
					}),
					/* @__PURE__ */ jsx(KpiCard, {
						label: "Active loans",
						value: data.loans.filter((l) => l.status === "active").length,
						icon: /* @__PURE__ */ jsx(TrendingUp, { className: "size-4" })
					}),
					/* @__PURE__ */ jsx(KpiCard, {
						label: "Open applications",
						value: data.apps.filter((a) => a.status === "submitted" || a.status === "under_review").length,
						icon: /* @__PURE__ */ jsx(FileText, { className: "size-4" })
					}),
					/* @__PURE__ */ jsx(KpiCard, {
						label: "KYC status",
						value: /* @__PURE__ */ jsx("span", {
							className: "text-base",
							children: /* @__PURE__ */ jsx(AutoStatusPill, { status: data.profile?.kyc_status ?? "pending" })
						}),
						icon: /* @__PURE__ */ jsx(ShieldCheck, { className: "size-4" })
					})
				]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "grid gap-6 lg:grid-cols-3",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "rounded-2xl border bg-card p-6 lg:col-span-2",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "mb-4 flex items-center justify-between",
						children: [/* @__PURE__ */ jsx("h2", {
							className: "font-display text-lg font-semibold",
							children: "Your loans"
						}), /* @__PURE__ */ jsx(Link, {
							to: "/app/loans",
							className: "text-sm text-accent hover:underline",
							children: "View all"
						})]
					}), data.loans.length === 0 ? /* @__PURE__ */ jsx(EmptyState, {
						title: "No loans yet",
						body: "Browse our products and apply in under two minutes.",
						cta: /* @__PURE__ */ jsx(Link, {
							to: "/app/loans/apply",
							children: /* @__PURE__ */ jsx(Button, { children: "Apply now" })
						})
					}) : /* @__PURE__ */ jsx("ul", {
						className: "divide-y",
						children: data.loans.slice(0, 5).map((l) => /* @__PURE__ */ jsxs("li", {
							className: "flex flex-wrap items-center justify-between gap-3 py-4",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
								className: "font-medium tabular",
								children: formatMoney(l.principal, l.currency)
							}), /* @__PURE__ */ jsxs("div", {
								className: "text-xs text-muted-foreground",
								children: [
									"Due ",
									formatDate(l.due_date),
									" · Outstanding ",
									formatMoney(l.outstanding, l.currency)
								]
							})] }), /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ jsx(AutoStatusPill, { status: l.status }), /* @__PURE__ */ jsx(Link, {
									to: "/app/loans/$id",
									params: { id: l.id },
									children: /* @__PURE__ */ jsx(Button, {
										variant: "outline",
										size: "sm",
										children: "View"
									})
								})]
							})]
						}, l.id))
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "rounded-2xl border bg-card p-6",
					children: [/* @__PURE__ */ jsx("h2", {
						className: "mb-4 font-display text-lg font-semibold",
						children: "Notifications"
					}), data.notifs.length === 0 ? /* @__PURE__ */ jsx("p", {
						className: "text-sm text-muted-foreground",
						children: "All caught up."
					}) : /* @__PURE__ */ jsx("ul", {
						className: "space-y-3",
						children: data.notifs.map((n) => /* @__PURE__ */ jsxs("li", {
							className: "rounded-lg border bg-background p-3",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "text-sm font-medium",
									children: n.title
								}),
								n.body && /* @__PURE__ */ jsx("div", {
									className: "text-xs text-muted-foreground",
									children: n.body
								}),
								/* @__PURE__ */ jsx("div", {
									className: "mt-1 text-[10px] uppercase tracking-wider text-muted-foreground",
									children: formatDate(n.created_at)
								})
							]
						}, n.id))
					})]
				})]
			})
		]
	});
}
function EmptyState({ title, body, cta }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "rounded-xl border border-dashed py-10 text-center",
		children: [
			/* @__PURE__ */ jsx("p", {
				className: "font-medium",
				children: title
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mx-auto mt-1 max-w-sm text-sm text-muted-foreground",
				children: body
			}),
			cta && /* @__PURE__ */ jsx("div", {
				className: "mt-4",
				children: cta
			})
		]
	});
}
//#endregion
export { Dashboard as component };

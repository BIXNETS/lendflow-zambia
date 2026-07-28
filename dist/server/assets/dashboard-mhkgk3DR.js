import { i as createServerFn } from "./esm-9EjmF9OT.js";
import { n as useServerFn, t as createSsrRpc } from "./createSsrRpc-BgjJZxCC.js";
import { t as requireSupabaseAuth } from "./auth-middleware-Dpn8S0gM.js";
import { t as supabase } from "./client-CrwDbVDs.js";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowRight, BadgeCheck, Banknote, BellRing, Clock, CreditCard, FileCheck2, Loader2, Lock, LogOut, RefreshCcw, ShieldCheck, Sparkles, Wallet } from "lucide-react";
//#region src/lib/payments.functions.ts
var providerSchema = z.enum(["mtn_momo", "airtel_money"]);
var getPromotionPackages = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator(z.object({})).handler(createSsrRpc("0e367a1aed0f1eb6ad2bd4e6ec7c75e0cbab3903f09e6a617b2976db02f5dccd"));
var startMobileMoneyPackagePayment = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator(z.object({
	packageId: z.string().uuid(),
	provider: providerSchema,
	phone: z.string().min(1)
})).handler(createSsrRpc("6d13f1c941580f980c35f82ebc54e15e3695c497bbbd11619192ba99af92ece5"));
var checkMobileMoneyPackagePayment = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator(z.object({ paymentId: z.string().uuid() })).handler(createSsrRpc("964606b809aa1d6f9bd3ca10d0759b327056309e284c4b91ac9f35ed687adfc3"));
//#endregion
//#region src/routes/_authenticated/dashboard.tsx?tsr-split=component
function Dashboard() {
	const navigate = useNavigate();
	const loadPackages = useServerFn(getPromotionPackages);
	const startPackagePayment = useServerFn(startMobileMoneyPackagePayment);
	const checkPackagePayment = useServerFn(checkMobileMoneyPackagePayment);
	const [profile, setProfile] = useState(null);
	const [email, setEmail] = useState("");
	const [isAdmin, setIsAdmin] = useState(false);
	const [paymentPhone, setPaymentPhone] = useState("");
	const [packages, setPackages] = useState([]);
	const [selectedPackageId, setSelectedPackageId] = useState("");
	const [paymentProvider, setPaymentProvider] = useState("mtn_momo");
	const [payment, setPayment] = useState(null);
	const [paymentBusy, setPaymentBusy] = useState(false);
	useEffect(() => {
		(async () => {
			const { data: u } = await supabase.auth.getUser();
			if (!u.user) return;
			setEmail(u.user.email ?? "");
			const { data } = await supabase.from("profiles").select("first_name,last_name,phone,kyc_status,activation_status").eq("id", u.user.id).maybeSingle();
			if (data) setProfile(data);
			if (data?.phone) setPaymentPhone(data.phone);
			const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", u.user.id);
			setIsAdmin((roles ?? []).some((r) => r.role === "admin"));
		})();
	}, []);
	useEffect(() => {
		loadPackages({ data: {} }).then((rows) => {
			setPackages(rows);
			setSelectedPackageId((current) => current || rows[0]?.id || "");
		}).catch((error) => toast.error(error.message));
	}, [loadPackages]);
	const signOut = async () => {
		await supabase.auth.signOut();
		toast.success("Signed out");
		navigate({ to: "/auth" });
	};
	const fullName = [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") || "Borrower";
	const kyc = profile?.kyc_status ?? "pending";
	const activation = profile?.activation_status ?? "unpaid";
	const completion = computeCompletion(profile);
	const kycApproved = kyc === "approved";
	const beginPayment = async () => {
		if (!kycApproved) {
			toast.error("Complete KYC before choosing a promotion package");
			return;
		}
		if (!selectedPackageId) {
			toast.error("Choose a package first");
			return;
		}
		setPaymentBusy(true);
		try {
			const result = await startPackagePayment({ data: {
				packageId: selectedPackageId,
				provider: paymentProvider,
				phone: paymentPhone
			} });
			setPayment(result);
			setProfile((p) => p ? {
				...p,
				phone: result.phone,
				activation_status: "pending"
			} : p);
			setPaymentPhone(result.phone);
			toast.success("Mobile money payment request sent");
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Could not start mobile money payment");
		} finally {
			setPaymentBusy(false);
		}
	};
	const refreshPayment = async () => {
		if (!payment) return;
		setPaymentBusy(true);
		try {
			const result = await checkPackagePayment({ data: { paymentId: payment.paymentId } });
			setPayment(result);
			if (result.status === "successful") {
				setProfile((p) => p ? {
					...p,
					activation_status: "active"
				} : p);
				toast.success("Payment confirmed. Your package is active.");
			} else if (result.status === "failed") toast.error("Mobile money payment failed");
			else toast.info("Payment is still pending");
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Could not check payment status");
		} finally {
			setPaymentBusy(false);
		}
	};
	const selectedPackage = packages.find((pack) => pack.id === selectedPackageId);
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ jsx("header", {
			className: "sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-hairline",
			children: /* @__PURE__ */ jsxs("div", {
				className: "max-w-7xl mx-auto px-6 h-16 flex items-center justify-between",
				children: [/* @__PURE__ */ jsxs(Link, {
					to: "/",
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ jsx("div", {
						className: "size-6 bg-navy rounded-sm flex items-center justify-center",
						children: /* @__PURE__ */ jsx("div", { className: "size-2 bg-emerald rounded-full" })
					}), /* @__PURE__ */ jsx("span", {
						className: "font-semibold text-navy tracking-tight",
						children: "LendFlow"
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-4",
					children: [
						isAdmin && /* @__PURE__ */ jsx(Link, {
							to: "/admin/kyc",
							className: "text-xs font-semibold uppercase tracking-wider text-emerald hover:underline",
							children: "Admin"
						}),
						/* @__PURE__ */ jsxs("button", {
							className: "relative size-9 rounded-md hover:bg-surface-muted flex items-center justify-center text-muted-foreground",
							children: [/* @__PURE__ */ jsx(BellRing, { className: "size-4" }), /* @__PURE__ */ jsx("span", { className: "absolute top-2 right-2 size-1.5 rounded-full bg-emerald" })]
						}),
						/* @__PURE__ */ jsxs("button", {
							onClick: signOut,
							className: "text-sm font-medium text-muted-foreground hover:text-navy inline-flex items-center gap-1.5",
							children: [/* @__PURE__ */ jsx(LogOut, { className: "size-4" }), " Sign out"]
						})
					]
				})]
			})
		}), /* @__PURE__ */ jsxs("main", {
			className: "max-w-7xl mx-auto px-6 py-10 space-y-10",
			children: [
				/* @__PURE__ */ jsxs("section", {
					className: "flex flex-col md:flex-row md:items-end md:justify-between gap-4",
					children: [/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsx("p", {
							className: "text-xs font-semibold uppercase tracking-wider text-emerald",
							children: "Borrower Dashboard"
						}),
						/* @__PURE__ */ jsxs("h1", {
							className: "text-3xl md:text-4xl font-medium text-navy mt-2",
							children: ["Welcome, ", fullName]
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-sm text-muted-foreground mt-1",
							children: email
						})
					] }), /* @__PURE__ */ jsx("div", {
						className: "flex items-center gap-3",
						children: /* @__PURE__ */ jsx(ProfilePill, {
							label: "Profile",
							value: `${completion}% complete`
						})
					})]
				}),
				/* @__PURE__ */ jsxs("section", {
					className: "grid md:grid-cols-4 gap-4",
					children: [
						/* @__PURE__ */ jsx(Kpi, {
							icon: Wallet,
							label: "Available Limit",
							value: "K 0",
							hint: "Choose a package to unlock"
						}),
						/* @__PURE__ */ jsx(Kpi, {
							icon: CreditCard,
							label: "Active Loans",
							value: "0",
							hint: "No active loans"
						}),
						/* @__PURE__ */ jsx(Kpi, {
							icon: Banknote,
							label: "Outstanding",
							value: "K 0",
							hint: "Nothing due"
						}),
						/* @__PURE__ */ jsx(Kpi, {
							icon: Clock,
							label: "Next Due Date",
							value: "—",
							hint: "No upcoming payments"
						})
					]
				}),
				/* @__PURE__ */ jsxs("section", {
					className: "bg-card ring-1 ring-black/5 rounded-2xl p-8",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between mb-6",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
							className: "text-xl font-medium text-navy",
							children: "Get loan-ready"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-sm text-muted-foreground",
							children: "Complete these steps to unlock loan applications."
						})] }), /* @__PURE__ */ jsx(ArrowRight, { className: "text-muted-foreground" })]
					}), /* @__PURE__ */ jsxs("div", {
						className: "grid md:grid-cols-3 gap-1",
						children: [
							/* @__PURE__ */ jsx(Step, {
								icon: FileCheck2,
								n: "01",
								title: "Complete profile",
								status: completion === 100 ? "done" : "in-progress",
								desc: "Add your NRC, address and contact details."
							}),
							/* @__PURE__ */ jsx(Link, {
								to: "/kyc",
								className: "contents",
								children: /* @__PURE__ */ jsx(Step, {
									icon: ShieldCheck,
									n: "02",
									title: "Verify identity (KYC)",
									status: statusFromKyc(kyc),
									desc: "Upload your National ID and a selfie.",
									interactive: true
								})
							}),
							/* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => document.getElementById("promotion-package-payment")?.scrollIntoView({
									behavior: "smooth",
									block: "center"
								}),
								className: "contents",
								children: /* @__PURE__ */ jsx(Step, {
									icon: BadgeCheck,
									n: "03",
									title: "Choose promotion package",
									status: statusFromActivation(activation),
									desc: "Pick a qualification package and pay by mobile money.",
									interactive: true
								})
							})
						]
					})]
				}),
				/* @__PURE__ */ jsxs("section", {
					className: "grid lg:grid-cols-3 gap-6",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "lg:col-span-2 bg-navy rounded-2xl p-8 text-navy-foreground flex flex-col justify-between gap-8",
						children: [/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx("p", {
								className: "text-xs font-semibold uppercase tracking-wider text-emerald",
								children: "Loan Application"
							}),
							/* @__PURE__ */ jsx("h2", {
								className: "text-2xl font-medium mt-2 text-balance",
								children: "Ready when you are."
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-sm text-navy-foreground/60 mt-2 max-w-[44ch]",
								children: "Once your package payment is confirmed, apply for a loan in under 60 seconds. Funds are disbursed straight to your mobile money wallet."
							})
						] }), /* @__PURE__ */ jsxs("div", {
							className: "flex flex-wrap gap-3",
							children: [/* @__PURE__ */ jsxs("button", {
								disabled: activation !== "active" || kyc !== "approved",
								className: "self-start bg-emerald text-emerald-foreground py-3 px-6 rounded-lg font-medium text-sm hover:bg-emerald/90 transition-colors disabled:opacity-50 inline-flex items-center gap-2",
								children: ["Apply for a loan ", /* @__PURE__ */ jsx(ArrowRight, { className: "size-4" })]
							}), /* @__PURE__ */ jsxs(Link, {
								to: "/eligibility",
								className: "self-start py-3 px-6 rounded-lg font-medium text-sm border border-emerald/40 text-emerald hover:bg-emerald/10 transition-colors inline-flex items-center gap-2",
								children: ["Check eligibility ", /* @__PURE__ */ jsx(ArrowRight, { className: "size-4" })]
							})]
						})]
					}), /* @__PURE__ */ jsxs("div", {
						id: "promotion-package-payment",
						className: "bg-card ring-1 ring-black/5 rounded-2xl p-8 space-y-5",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-start justify-between gap-4",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
								className: "font-medium text-navy",
								children: "Promotion packages"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-sm text-muted-foreground mt-1",
								children: "Congratulations, you have been slotted to qualify for a promotion."
							})] }), kycApproved ? /* @__PURE__ */ jsx(Sparkles, { className: "size-5 text-emerald" }) : /* @__PURE__ */ jsx(Lock, { className: "size-5 text-muted-foreground" })]
						}), activation === "active" ? /* @__PURE__ */ jsx("div", {
							className: "rounded-lg bg-emerald/10 px-4 py-3 text-sm font-medium text-emerald",
							children: "Your promotion package is active."
						}) : /* @__PURE__ */ jsxs("div", {
							className: "space-y-4",
							children: [
								!kycApproved && /* @__PURE__ */ jsxs(Link, {
									to: "/kyc",
									className: "flex items-center justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800",
									children: [/* @__PURE__ */ jsx("span", { children: "Complete KYC to unlock package selection." }), /* @__PURE__ */ jsx(ArrowRight, { className: "size-4 shrink-0" })]
								}),
								/* @__PURE__ */ jsx("div", {
									className: "grid gap-3",
									children: packages.map((pack) => /* @__PURE__ */ jsx(PromotionPackageCard, {
										pack,
										selected: selectedPackageId === pack.id,
										locked: !kycApproved,
										onSelect: () => {
											if (!kycApproved) {
												toast.error("Complete KYC to customize and choose a package");
												return;
											}
											setSelectedPackageId(pack.id);
										}
									}, pack.id))
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "grid grid-cols-2 gap-2",
									children: [/* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => setPaymentProvider("mtn_momo"),
										disabled: !kycApproved,
										className: `rounded-lg border px-3 py-2 text-sm font-medium ${paymentProvider === "mtn_momo" ? "border-emerald bg-emerald/5 text-emerald" : "border-hairline text-muted-foreground"}`,
										children: "MTN MoMo"
									}), /* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => setPaymentProvider("airtel_money"),
										disabled: !kycApproved,
										className: `rounded-lg border px-3 py-2 text-sm font-medium ${paymentProvider === "airtel_money" ? "border-emerald bg-emerald/5 text-emerald" : "border-hairline text-muted-foreground"}`,
										children: "Airtel Money"
									})]
								}),
								/* @__PURE__ */ jsxs("label", {
									className: "space-y-2 block",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
										children: "Wallet number"
									}), /* @__PURE__ */ jsx("input", {
										value: paymentPhone,
										onChange: (e) => setPaymentPhone(e.target.value),
										disabled: !kycApproved,
										placeholder: "260971234567",
										className: "w-full rounded-lg border border-hairline bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald/30"
									})]
								}),
								/* @__PURE__ */ jsxs("button", {
									onClick: beginPayment,
									disabled: paymentBusy || activation === "active" || !selectedPackage || !kycApproved,
									className: "w-full bg-emerald text-emerald-foreground py-3 px-4 rounded-lg font-medium text-sm hover:bg-emerald/90 transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2",
									children: [
										paymentBusy ? /* @__PURE__ */ jsx(Loader2, { className: "size-4 animate-spin" }) : /* @__PURE__ */ jsx(Wallet, { className: "size-4" }),
										"Pay K ",
										selectedPackage?.feeAmount.toLocaleString() ?? "0",
										" with ",
										paymentProvider === "mtn_momo" ? "MTN MoMo" : "Airtel Money"
									]
								}),
								payment && /* @__PURE__ */ jsxs("div", {
									className: "rounded-lg border border-hairline p-4 space-y-3",
									children: [
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-center justify-between gap-3",
											children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
												className: "text-xs text-muted-foreground",
												children: "Payment request"
											}), /* @__PURE__ */ jsxs("p", {
												className: "font-medium text-navy",
												children: [
													"K ",
													payment.amount.toLocaleString(),
													" ",
													payment.currency
												]
											})] }), /* @__PURE__ */ jsx("span", {
												className: `text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded-full ${payment.status === "successful" ? "bg-emerald/10 text-emerald" : payment.status === "failed" ? "bg-destructive/10 text-destructive" : "bg-amber-50 text-amber-700"}`,
												children: payment.status
											})]
										}),
										/* @__PURE__ */ jsxs("p", {
											className: "break-all text-xs text-muted-foreground",
											children: ["Ref: ", payment.referenceId]
										}),
										/* @__PURE__ */ jsxs("button", {
											onClick: refreshPayment,
											disabled: paymentBusy || payment.status !== "pending",
											className: "w-full border border-hairline py-2 px-3 rounded-lg font-medium text-sm hover:bg-surface-muted transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2",
											children: [paymentBusy ? /* @__PURE__ */ jsx(Loader2, { className: "size-4 animate-spin" }) : /* @__PURE__ */ jsx(RefreshCcw, { className: "size-4" }), "Check status"]
										})
									]
								})
							]
						})]
					})]
				})
			]
		})]
	});
}
function computeCompletion(p) {
	if (!p) return 25;
	const fields = [
		p.first_name,
		p.last_name,
		p.phone
	];
	const filled = fields.filter(Boolean).length;
	return Math.round((filled + 1) / (fields.length + 1) * 100);
}
function statusFromKyc(s) {
	if (s === "approved") return "done";
	if (s === "rejected") return "todo";
	return "in-progress";
}
function statusFromActivation(s) {
	if (s === "active") return "done";
	if (s === "pending") return "in-progress";
	return "todo";
}
function PromotionPackageCard({ pack, selected, locked, onSelect }) {
	const theme = packageTheme(pack.accent);
	return /* @__PURE__ */ jsxs("button", {
		type: "button",
		onClick: onSelect,
		className: `group relative overflow-hidden rounded-xl border p-4 text-left transition-all ${selected ? `${theme.border} ${theme.bg} shadow-lg shadow-black/5` : "border-hairline bg-background hover:border-emerald/40 hover:bg-surface-muted"} ${locked ? "opacity-75" : "hover:-translate-y-0.5"}`,
		children: [
			/* @__PURE__ */ jsx("div", { className: `absolute inset-y-0 left-0 w-1 ${theme.rail}` }),
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-sm font-semibold text-navy",
								children: pack.name
							}), pack.badge && /* @__PURE__ */ jsx("span", {
								className: `rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${theme.badge}`,
								children: pack.badge
							})]
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-1 text-xs font-medium text-foreground",
							children: pack.headline
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: pack.description
						})
					]
				}), locked ? /* @__PURE__ */ jsx(Lock, { className: "size-4 shrink-0 text-muted-foreground" }) : selected ? /* @__PURE__ */ jsx(BadgeCheck, { className: `size-4 shrink-0 ${theme.text}` }) : null]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-4 grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
					className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
					children: "Qualify"
				}), /* @__PURE__ */ jsxs("div", {
					className: "mt-1 text-lg font-semibold text-navy",
					children: ["K ", pack.qualificationAmount.toLocaleString()]
				})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
					className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
					children: "Pay fee"
				}), /* @__PURE__ */ jsxs("div", {
					className: `mt-1 text-lg font-semibold ${theme.text}`,
					children: ["K ", pack.feeAmount.toLocaleString()]
				})] })]
			})
		]
	});
}
function packageTheme(accent) {
	const themes = {
		emerald: {
			bg: "bg-emerald/5",
			border: "border-emerald/50",
			rail: "bg-emerald",
			text: "text-emerald",
			badge: "bg-emerald/10 text-emerald"
		},
		amber: {
			bg: "bg-amber-50",
			border: "border-amber-300",
			rail: "bg-amber-500",
			text: "text-amber-700",
			badge: "bg-amber-100 text-amber-800"
		},
		sky: {
			bg: "bg-sky-50",
			border: "border-sky-300",
			rail: "bg-sky-500",
			text: "text-sky-700",
			badge: "bg-sky-100 text-sky-800"
		},
		violet: {
			bg: "bg-violet-50",
			border: "border-violet-300",
			rail: "bg-violet-500",
			text: "text-violet-700",
			badge: "bg-violet-100 text-violet-800"
		},
		rose: {
			bg: "bg-rose-50",
			border: "border-rose-300",
			rail: "bg-rose-500",
			text: "text-rose-700",
			badge: "bg-rose-100 text-rose-800"
		},
		indigo: {
			bg: "bg-indigo-50",
			border: "border-indigo-300",
			rail: "bg-indigo-500",
			text: "text-indigo-700",
			badge: "bg-indigo-100 text-indigo-800"
		},
		slate: {
			bg: "bg-slate-50",
			border: "border-slate-300",
			rail: "bg-slate-700",
			text: "text-slate-700",
			badge: "bg-slate-200 text-slate-800"
		}
	};
	return themes[accent] ?? themes.emerald;
}
function ProfilePill({ label, value }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "inline-flex items-center gap-3 bg-card ring-1 ring-hairline rounded-full px-4 py-2",
		children: [/* @__PURE__ */ jsx("span", {
			className: "text-xs uppercase tracking-wider text-muted-foreground",
			children: label
		}), /* @__PURE__ */ jsx("span", {
			className: "text-sm font-medium text-navy",
			children: value
		})]
	});
}
function Kpi({ icon: Icon, label, value, hint }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "bg-card ring-1 ring-black/5 rounded-2xl p-6 space-y-3",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ jsx("span", {
					className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
					children: label
				}), /* @__PURE__ */ jsx(Icon, { className: "size-4 text-emerald" })]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "text-2xl font-medium text-navy",
				children: value
			}),
			/* @__PURE__ */ jsx("div", {
				className: "text-xs text-muted-foreground",
				children: hint
			})
		]
	});
}
function Step({ icon: Icon, n, title, desc, status, interactive }) {
	const badge = status === "done" ? {
		text: "Done",
		cls: "bg-emerald/10 text-emerald"
	} : status === "in-progress" ? {
		text: "In progress",
		cls: "bg-amber-50 text-amber-700"
	} : {
		text: "To do",
		cls: "bg-surface-muted text-muted-foreground"
	};
	return /* @__PURE__ */ jsxs("div", {
		className: `p-6 ring-1 ring-black/5 bg-surface flex flex-col gap-4 ${interactive ? "hover:bg-surface-muted cursor-pointer transition-colors" : ""}`,
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ jsx("span", {
					className: "text-xs font-mono text-muted-foreground",
					children: n
				}), /* @__PURE__ */ jsx("span", {
					className: `text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded-full ${badge.cls}`,
					children: badge.text
				})]
			}),
			/* @__PURE__ */ jsx(Icon, { className: "size-5 text-emerald" }),
			/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
				className: "font-medium text-navy",
				children: title
			}), /* @__PURE__ */ jsx("p", {
				className: "text-sm text-muted-foreground mt-1",
				children: desc
			})] })
		]
	});
}
//#endregion
export { Dashboard as component };

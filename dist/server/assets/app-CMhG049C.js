import { t as supabase } from "./client-CrwDbVDs.js";
import { t as cn } from "./utils-C_uf36nf.js";
import { t as Button } from "./button-PJVP9td7.js";
import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { useQueryClient } from "@tanstack/react-query";
import { Home, LogOut, Moon, ShieldCheck, ShieldQuestion, Sun, User2, Wallet } from "lucide-react";
//#region src/routes/_authenticated/app.tsx?tsr-split=component
var NAV = [
	{
		to: "/app",
		label: "Dashboard",
		icon: Home,
		exact: true
	},
	{
		to: "/app/loans",
		label: "Loans",
		icon: Wallet
	},
	{
		to: "/app/kyc",
		label: "Verification",
		icon: ShieldCheck
	},
	{
		to: "/app/profile",
		label: "Profile",
		icon: User2
	}
];
function AppShell() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const [isAdmin, setIsAdmin] = useState(false);
	const [dark, setDark] = useState(() => typeof window !== "undefined" && document.documentElement.classList.contains("dark"));
	useEffect(() => {
		(async () => {
			const { data } = await supabase.auth.getUser();
			if (!data.user) return;
			const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", data.user.id);
			setIsAdmin(!!roles?.some((r) => r.role === "admin"));
		})();
	}, []);
	function toggleTheme() {
		document.documentElement.classList.toggle("dark");
		setDark(document.documentElement.classList.contains("dark"));
	}
	async function signOut() {
		await queryClient.cancelQueries();
		queryClient.clear();
		await supabase.auth.signOut();
		navigate({
			to: "/auth",
			replace: true
		});
	}
	return /* @__PURE__ */ jsxs("div", {
		className: "grid min-h-screen lg:grid-cols-[260px_1fr]",
		children: [/* @__PURE__ */ jsxs("aside", {
			className: "hidden border-r bg-sidebar text-sidebar-foreground lg:flex lg:flex-col",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex h-16 items-center gap-2 border-b border-sidebar-border px-6 font-display text-lg font-semibold",
					children: [/* @__PURE__ */ jsx("span", {
						className: "grid size-8 place-items-center rounded-lg bg-accent text-accent-foreground",
						children: "A"
					}), "Akiba"]
				}),
				/* @__PURE__ */ jsxs("nav", {
					className: "flex-1 space-y-1 px-3 py-4",
					children: [NAV.map((item) => {
						const Icon = item.icon;
						const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
						return /* @__PURE__ */ jsxs(Link, {
							to: item.to,
							className: cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition", active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"),
							children: [
								/* @__PURE__ */ jsx(Icon, { className: "size-4" }),
								" ",
								item.label
							]
						}, item.to);
					}), isAdmin && /* @__PURE__ */ jsxs(Link, {
						to: "/admin",
						className: "mt-4 flex items-center gap-3 rounded-lg border border-sidebar-border bg-sidebar-accent/40 px-3 py-2 text-sm text-sidebar-foreground/90 hover:bg-sidebar-accent",
						children: [/* @__PURE__ */ jsx(ShieldQuestion, { className: "size-4" }), " Admin portal"]
					})]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "border-t border-sidebar-border p-3",
					children: /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ jsxs(Button, {
							variant: "ghost",
							size: "sm",
							className: "flex-1 justify-start text-sidebar-foreground/80 hover:bg-sidebar-accent",
							onClick: toggleTheme,
							children: [
								dark ? /* @__PURE__ */ jsx(Sun, { className: "size-4" }) : /* @__PURE__ */ jsx(Moon, { className: "size-4" }),
								" ",
								dark ? "Light" : "Dark"
							]
						}), /* @__PURE__ */ jsx(Button, {
							variant: "ghost",
							size: "sm",
							className: "text-sidebar-foreground/80 hover:bg-sidebar-accent",
							onClick: signOut,
							children: /* @__PURE__ */ jsx(LogOut, { className: "size-4" })
						})]
					})
				})
			]
		}), /* @__PURE__ */ jsxs("main", {
			className: "flex min-h-screen flex-col",
			children: [
				/* @__PURE__ */ jsxs("header", {
					className: "flex h-14 items-center justify-between border-b bg-card px-4 lg:hidden",
					children: [/* @__PURE__ */ jsxs(Link, {
						to: "/app",
						className: "flex items-center gap-2 font-display text-base font-semibold",
						children: [/* @__PURE__ */ jsx("span", {
							className: "grid size-7 place-items-center rounded-md bg-accent text-accent-foreground text-sm",
							children: "A"
						}), "Akiba"]
					}), /* @__PURE__ */ jsx(Button, {
						variant: "ghost",
						size: "sm",
						onClick: signOut,
						children: /* @__PURE__ */ jsx(LogOut, { className: "size-4" })
					})]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "flex-1 px-4 py-6 sm:px-8 sm:py-10",
					children: /* @__PURE__ */ jsx(Outlet, {})
				}),
				/* @__PURE__ */ jsx("nav", {
					className: "sticky bottom-0 grid grid-cols-4 border-t bg-card lg:hidden",
					children: NAV.map((item) => {
						const Icon = item.icon;
						const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
						return /* @__PURE__ */ jsxs(Link, {
							to: item.to,
							className: cn("flex flex-col items-center gap-1 py-3 text-xs", active ? "text-accent" : "text-muted-foreground"),
							children: [
								/* @__PURE__ */ jsx(Icon, { className: "size-5" }),
								" ",
								item.label
							]
						}, item.to);
					})
				})
			]
		})]
	});
}
//#endregion
export { AppShell as component };

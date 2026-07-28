import { t as supabase } from "./client-CrwDbVDs.js";
import { t as cn } from "./utils-C_uf36nf.js";
import { t as Button } from "./button-PJVP9td7.js";
import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Banknote, Boxes, FileCheck2, LayoutDashboard, LogOut, Receipt, ScrollText, TrendingUp, Users } from "lucide-react";
//#region src/routes/_authenticated/admin.tsx?tsr-split=component
var NAV = [
	{
		to: "/admin",
		label: "Overview",
		icon: LayoutDashboard,
		exact: true
	},
	{
		to: "/admin/applications",
		label: "Applications",
		icon: FileCheck2
	},
	{
		to: "/admin/loans",
		label: "Loans",
		icon: Banknote
	},
	{
		to: "/admin/collections",
		label: "Collections",
		icon: Receipt
	},
	{
		to: "/admin/products",
		label: "Products",
		icon: Boxes
	},
	{
		to: "/admin/kyc",
		label: "KYC queue",
		icon: FileCheck2
	},
	{
		to: "/admin/users",
		label: "Users",
		icon: Users
	},
	{
		to: "/admin/analytics",
		label: "Analytics",
		icon: TrendingUp
	},
	{
		to: "/admin/audit",
		label: "Audit log",
		icon: ScrollText
	}
];
function AdminShell() {
	const navigate = useNavigate();
	const qc = useQueryClient();
	const path = useRouterState({ select: (s) => s.location.pathname });
	async function signOut() {
		await qc.cancelQueries();
		qc.clear();
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
					className: "flex h-16 items-center justify-between border-b border-sidebar-border px-6",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2 font-display text-lg font-semibold",
						children: [/* @__PURE__ */ jsx("span", {
							className: "grid size-8 place-items-center rounded-lg bg-accent text-accent-foreground",
							children: "A"
						}), "Admin"]
					}), /* @__PURE__ */ jsxs(Link, {
						to: "/app",
						className: "text-xs text-sidebar-foreground/60 hover:text-sidebar-foreground",
						children: [/* @__PURE__ */ jsx(ArrowLeft, { className: "inline size-3" }), " App"]
					})]
				}),
				/* @__PURE__ */ jsx("nav", {
					className: "flex-1 space-y-1 px-3 py-4",
					children: NAV.map((item) => {
						const Icon = item.icon;
						const active = item.exact ? path === item.to : path.startsWith(item.to);
						return /* @__PURE__ */ jsxs(Link, {
							to: item.to,
							className: cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition", active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"),
							children: [
								/* @__PURE__ */ jsx(Icon, { className: "size-4" }),
								" ",
								item.label
							]
						}, item.to);
					})
				}),
				/* @__PURE__ */ jsx("div", {
					className: "border-t border-sidebar-border p-3",
					children: /* @__PURE__ */ jsxs(Button, {
						variant: "ghost",
						size: "sm",
						className: "w-full justify-start text-sidebar-foreground/80 hover:bg-sidebar-accent",
						onClick: signOut,
						children: [/* @__PURE__ */ jsx(LogOut, { className: "size-4" }), " Sign out"]
					})
				})
			]
		}), /* @__PURE__ */ jsx("main", {
			className: "px-4 py-6 sm:px-8 sm:py-10",
			children: /* @__PURE__ */ jsx(Outlet, {})
		})]
	});
}
//#endregion
export { AdminShell as component };

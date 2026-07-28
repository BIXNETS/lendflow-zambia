import { t as supabase } from "./client-CrwDbVDs.js";
import { t as Card } from "./card-BXjpJ96D.js";
import { r as formatDate } from "./format-ocX-SQtS.js";
import { t as AutoStatusPill } from "./status-pill-DJaFxHY0.js";
import { t as Input } from "./input-B8Q2ztVi.js";
import { useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
//#region src/routes/_authenticated/admin.users.tsx?tsr-split=component
function UsersAdmin() {
	const [q, setQ] = useState("");
	const { data, isLoading } = useQuery({
		queryKey: ["admin-users"],
		queryFn: async () => (await supabase.from("profiles").select("*").order("created_at", { ascending: false })).data ?? []
	});
	const rows = (data ?? []).filter((p) => !q || p.full_name?.toLowerCase().includes(q.toLowerCase()) || p.phone_e164?.includes(q) || p.email?.toLowerCase().includes(q.toLowerCase()));
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-6xl space-y-6",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex flex-wrap items-center justify-between gap-3",
			children: [/* @__PURE__ */ jsx("h1", {
				className: "font-display text-3xl font-semibold",
				children: "Users"
			}), /* @__PURE__ */ jsx(Input, {
				placeholder: "Search by name, email or phone",
				className: "max-w-sm",
				value: q,
				onChange: (e) => setQ(e.target.value)
			})]
		}), /* @__PURE__ */ jsx(Card, {
			className: "overflow-hidden p-0",
			children: /* @__PURE__ */ jsxs("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ jsx("thead", {
					className: "bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground",
					children: /* @__PURE__ */ jsxs("tr", { children: [
						/* @__PURE__ */ jsx("th", {
							className: "p-3",
							children: "Name"
						}),
						/* @__PURE__ */ jsx("th", {
							className: "p-3",
							children: "Email"
						}),
						/* @__PURE__ */ jsx("th", {
							className: "p-3",
							children: "Phone"
						}),
						/* @__PURE__ */ jsx("th", {
							className: "p-3",
							children: "Country"
						}),
						/* @__PURE__ */ jsx("th", {
							className: "p-3",
							children: "KYC"
						}),
						/* @__PURE__ */ jsx("th", {
							className: "p-3",
							children: "Joined"
						})
					] })
				}), /* @__PURE__ */ jsxs("tbody", {
					className: "divide-y",
					children: [isLoading ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
						colSpan: 6,
						className: "p-6 text-center text-muted-foreground",
						children: "Loading…"
					}) }) : rows.map((p) => /* @__PURE__ */ jsxs("tr", { children: [
						/* @__PURE__ */ jsx("td", {
							className: "p-3",
							children: p.full_name ?? "—"
						}),
						/* @__PURE__ */ jsx("td", {
							className: "p-3",
							children: p.email ?? "—"
						}),
						/* @__PURE__ */ jsx("td", {
							className: "p-3 tabular",
							children: p.phone_e164 ?? "—"
						}),
						/* @__PURE__ */ jsx("td", {
							className: "p-3",
							children: p.country ?? "—"
						}),
						/* @__PURE__ */ jsx("td", {
							className: "p-3",
							children: /* @__PURE__ */ jsx(AutoStatusPill, { status: p.kyc_status })
						}),
						/* @__PURE__ */ jsx("td", {
							className: "p-3",
							children: formatDate(p.created_at)
						})
					] }, p.user_id)), !isLoading && rows.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
						colSpan: 6,
						className: "p-6 text-center text-muted-foreground",
						children: "No matches."
					}) })]
				})]
			})
		})]
	});
}
//#endregion
export { UsersAdmin as component };

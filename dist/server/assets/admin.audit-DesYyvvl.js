import { t as supabase } from "./client-CrwDbVDs.js";
import { t as Card } from "./card-BXjpJ96D.js";
import { i as formatDateTime } from "./format-ocX-SQtS.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
//#region src/routes/_authenticated/admin.audit.tsx?tsr-split=component
function AuditPage() {
	const { data, isLoading } = useQuery({
		queryKey: ["admin-audit"],
		queryFn: async () => (await supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(200)).data ?? []
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-6xl space-y-6",
		children: [/* @__PURE__ */ jsx("h1", {
			className: "font-display text-3xl font-semibold",
			children: "Audit log"
		}), /* @__PURE__ */ jsx(Card, {
			className: "overflow-hidden p-0",
			children: /* @__PURE__ */ jsxs("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ jsx("thead", {
					className: "bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground",
					children: /* @__PURE__ */ jsxs("tr", { children: [
						/* @__PURE__ */ jsx("th", {
							className: "p-3",
							children: "When"
						}),
						/* @__PURE__ */ jsx("th", {
							className: "p-3",
							children: "Actor"
						}),
						/* @__PURE__ */ jsx("th", {
							className: "p-3",
							children: "Action"
						}),
						/* @__PURE__ */ jsx("th", {
							className: "p-3",
							children: "Entity"
						})
					] })
				}), /* @__PURE__ */ jsxs("tbody", {
					className: "divide-y",
					children: [isLoading ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
						colSpan: 4,
						className: "p-6 text-center text-muted-foreground",
						children: "Loading…"
					}) }) : (data ?? []).map((a) => /* @__PURE__ */ jsxs("tr", { children: [
						/* @__PURE__ */ jsx("td", {
							className: "p-3",
							children: formatDateTime(a.created_at)
						}),
						/* @__PURE__ */ jsx("td", {
							className: "p-3 font-mono text-xs",
							children: a.actor_id?.slice(0, 8) ?? "system"
						}),
						/* @__PURE__ */ jsx("td", {
							className: "p-3",
							children: a.action
						}),
						/* @__PURE__ */ jsxs("td", {
							className: "p-3",
							children: [
								a.entity,
								" ",
								a.entity_id ? `#${a.entity_id.slice(0, 8)}` : ""
							]
						})
					] }, a.id)), !isLoading && (data?.length ?? 0) === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
						colSpan: 4,
						className: "p-6 text-center text-muted-foreground",
						children: "No entries."
					}) })]
				})]
			})
		})]
	});
}
//#endregion
export { AuditPage as component };

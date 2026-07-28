import { t as cn } from "./utils-C_uf36nf.js";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/components/kpi-card.tsx
function KpiCard({ label, value, hint, icon, tone = "default", className }) {
	const toneClass = {
		default: "from-card to-card",
		accent: "from-accent/10 to-card",
		warning: "from-warning/10 to-card",
		danger: "from-destructive/10 to-card"
	}[tone];
	return /* @__PURE__ */ jsxs("div", {
		className: cn("rounded-2xl border bg-gradient-to-br p-5 shadow-sm", toneClass, className),
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ jsx("p", {
					className: "text-xs font-medium uppercase tracking-wider text-muted-foreground",
					children: label
				}), icon && /* @__PURE__ */ jsx("div", {
					className: "text-muted-foreground",
					children: icon
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "mt-3 font-display text-3xl font-semibold tabular tracking-tight",
				children: value
			}),
			hint && /* @__PURE__ */ jsx("div", {
				className: "mt-1 text-xs text-muted-foreground",
				children: hint
			})
		]
	});
}
//#endregion
export { KpiCard as t };

import { t as cn } from "./utils-C_uf36nf.js";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/components/status-pill.tsx
var VARIANTS = {
	default: "bg-secondary text-secondary-foreground",
	success: "bg-success/15 text-success border-success/30",
	warning: "bg-warning/15 text-warning-foreground border-warning/30",
	danger: "bg-destructive/15 text-destructive border-destructive/30",
	info: "bg-accent/15 text-accent border-accent/30",
	muted: "bg-muted text-muted-foreground"
};
function StatusPill({ status, variant = "default", className }) {
	return /* @__PURE__ */ jsxs("span", {
		className: cn("inline-flex items-center gap-1.5 rounded-full border border-transparent px-2.5 py-0.5 text-xs font-medium capitalize tabular", VARIANTS[variant], className),
		children: [/* @__PURE__ */ jsx("span", { className: "size-1.5 rounded-full bg-current opacity-70" }), status.replace(/_/g, " ")]
	});
}
var STATUS_VARIANT = {
	submitted: "info",
	under_review: "warning",
	approved: "success",
	rejected: "danger",
	withdrawn: "muted",
	pending_disbursement: "warning",
	active: "info",
	completed: "success",
	defaulted: "danger",
	written_off: "muted",
	pending: "warning",
	in_review: "warning",
	upcoming: "muted",
	paid: "success",
	partial: "warning",
	overdue: "danger",
	success: "success",
	failed: "danger",
	reversed: "muted"
};
function AutoStatusPill({ status }) {
	return /* @__PURE__ */ jsx(StatusPill, {
		status,
		variant: STATUS_VARIANT[status] ?? "default"
	});
}
//#endregion
export { AutoStatusPill as t };

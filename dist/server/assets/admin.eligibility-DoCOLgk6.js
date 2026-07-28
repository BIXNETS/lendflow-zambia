import { n as useServerFn } from "./createSsrRpc-BgjJZxCC.js";
import { t as supabase } from "./client-CrwDbVDs.js";
import { n as CardContent, t as Card } from "./card-BXjpJ96D.js";
import { t as EligibilityList } from "./eligibility-DVGbW3va.js";
import { t as getTierEligibility } from "./eligibility.functions-DAl4WKIN.js";
import { t as Input } from "./input-B8Q2ztVi.js";
import { t as Label } from "./label-DBD1bRRP.js";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Loader2, Sparkles } from "lucide-react";
//#region src/routes/_authenticated/admin.eligibility.tsx?tsr-split=component
function AdminEligibility() {
	const [search, setSearch] = useState("");
	const [profiles, setProfiles] = useState([]);
	const [selected, setSelected] = useState(null);
	const [rows, setRows] = useState(null);
	const [err, setErr] = useState(null);
	const [loading, setLoading] = useState(false);
	const evaluate = useServerFn(getTierEligibility);
	useEffect(() => {
		let cancelled = false;
		setLoading(true);
		supabase.from("profiles").select("id,first_name,last_name,phone,kyc_status,activation_status").order("updated_at", { ascending: false }).limit(50).then(({ data, error }) => {
			if (cancelled) return;
			if (error) setErr(error.message);
			else setProfiles(data ?? []);
			setLoading(false);
		});
		return () => {
			cancelled = true;
		};
	}, []);
	useEffect(() => {
		if (!selected) {
			setRows(null);
			return;
		}
		setRows(null);
		setErr(null);
		evaluate({ data: { userId: selected.id } }).then(setRows).catch((e) => setErr(e.message));
	}, [selected, evaluate]);
	const filtered = profiles.filter((p) => {
		const q = search.toLowerCase().trim();
		if (!q) return true;
		return `${p.first_name ?? ""} ${p.last_name ?? ""}`.toLowerCase().includes(q) || (p.phone ?? "").toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-8",
		children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h1", {
			className: "flex items-center gap-2 text-2xl font-semibold tracking-tight text-foreground",
			children: [/* @__PURE__ */ jsx(Sparkles, { className: "size-6 text-emerald" }), " Eligibility preview"]
		}), /* @__PURE__ */ jsx("p", {
			className: "mt-1 text-sm text-muted-foreground",
			children: "Pick a borrower to preview which loan tiers they qualify for under current tier rules."
		})] }), /* @__PURE__ */ jsxs("div", {
			className: "grid gap-6 lg:grid-cols-[320px_1fr]",
			children: [/* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, {
				className: "p-4 space-y-3",
				children: [
					/* @__PURE__ */ jsx(Label, {
						className: "text-xs",
						children: "Search borrowers"
					}),
					/* @__PURE__ */ jsx(Input, {
						placeholder: "Name, phone, or id",
						value: search,
						onChange: (e) => setSearch(e.target.value)
					}),
					/* @__PURE__ */ jsx("div", {
						className: "max-h-[28rem] overflow-y-auto -mx-2",
						children: loading ? /* @__PURE__ */ jsx("div", {
							className: "flex items-center justify-center py-8 text-muted-foreground",
							children: /* @__PURE__ */ jsx(Loader2, { className: "size-4 animate-spin" })
						}) : filtered.length === 0 ? /* @__PURE__ */ jsx("p", {
							className: "px-2 py-6 text-xs text-muted-foreground text-center",
							children: "No borrowers."
						}) : filtered.map((p) => {
							const name = `${p.first_name ?? ""} ${p.last_name ?? ""}`.trim() || "Unnamed";
							return /* @__PURE__ */ jsxs("button", {
								onClick: () => setSelected(p),
								className: `w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${selected?.id === p.id ? "bg-emerald/10 text-foreground" : "hover:bg-muted text-muted-foreground"}`,
								children: [/* @__PURE__ */ jsx("div", {
									className: "font-medium text-foreground",
									children: name
								}), /* @__PURE__ */ jsxs("div", {
									className: "text-xs",
									children: [
										"KYC: ",
										p.kyc_status,
										" · ",
										p.activation_status
									]
								})]
							}, p.id);
						})
					})
				]
			}) }), /* @__PURE__ */ jsx("div", { children: !selected ? /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, {
				className: "py-16 text-center text-sm text-muted-foreground",
				children: "Select a borrower to view their eligibility."
			}) }) : /* @__PURE__ */ jsxs("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, {
					className: "py-4 text-sm",
					children: [
						/* @__PURE__ */ jsx("span", {
							className: "font-medium text-foreground",
							children: `${selected.first_name ?? ""} ${selected.last_name ?? ""}`.trim() || "Unnamed"
						}),
						" ",
						/* @__PURE__ */ jsxs("span", {
							className: "text-muted-foreground",
							children: [
								"· KYC ",
								selected.kyc_status,
								" · Account ",
								selected.activation_status
							]
						})
					]
				}) }), /* @__PURE__ */ jsx(EligibilityList, {
					rows,
					err
				})]
			}) })]
		})]
	});
}
//#endregion
export { AdminEligibility as component };

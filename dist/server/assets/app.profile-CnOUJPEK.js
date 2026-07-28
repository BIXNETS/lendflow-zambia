import { i as profileSchema } from "./schemas-Cze1BLcm.js";
import { t as supabase } from "./client-CrwDbVDs.js";
import { t as Card } from "./card-BXjpJ96D.js";
import { n as COUNTRY_NAMES, t as COUNTRY_DIAL } from "./format-ocX-SQtS.js";
import { t as Button } from "./button-PJVP9td7.js";
import { t as Input } from "./input-B8Q2ztVi.js";
import { t as Label } from "./label-DBD1bRRP.js";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.js";
import { t as Textarea } from "./textarea-kko37XEX.js";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
//#region src/routes/_authenticated/app.profile.tsx?tsr-split=component
function ProfilePage() {
	const qc = useQueryClient();
	const { data: profile, isLoading } = useQuery({
		queryKey: ["my-profile"],
		queryFn: async () => {
			const { data: u } = await supabase.auth.getUser();
			const { data } = await supabase.from("profiles").select("*").eq("user_id", u.user.id).maybeSingle();
			return data;
		}
	});
	const [form, setForm] = useState({
		full_name: "",
		country: "KE",
		phone_e164: "",
		national_id: "",
		date_of_birth: "",
		address: "",
		employment: ""
	});
	const [saving, setSaving] = useState(false);
	useEffect(() => {
		if (profile) setForm({
			full_name: profile.full_name ?? "",
			country: profile.country ?? "KE",
			phone_e164: profile.phone_e164 ?? "",
			national_id: profile.national_id ?? "",
			date_of_birth: profile.date_of_birth ?? "",
			address: profile.address ?? "",
			employment: profile.employment ?? ""
		});
	}, [profile]);
	async function save(e) {
		e.preventDefault();
		const parsed = profileSchema.safeParse(form);
		if (!parsed.success) return toast.error(parsed.error.issues[0].message);
		setSaving(true);
		const { data: u } = await supabase.auth.getUser();
		const { error } = await supabase.from("profiles").update(parsed.data).eq("user_id", u.user.id);
		setSaving(false);
		if (error) return toast.error(error.message);
		toast.success("Profile saved");
		qc.invalidateQueries({ queryKey: ["my-profile"] });
		qc.invalidateQueries({ queryKey: ["borrower-dashboard"] });
	}
	if (isLoading) return /* @__PURE__ */ jsx("div", {
		className: "text-muted-foreground",
		children: "Loading…"
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-3xl space-y-6",
		children: [/* @__PURE__ */ jsxs("header", { children: [/* @__PURE__ */ jsx("h1", {
			className: "font-display text-3xl font-semibold",
			children: "Your profile"
		}), /* @__PURE__ */ jsx("p", {
			className: "text-sm text-muted-foreground",
			children: "Complete your details to qualify for higher loan limits."
		})] }), /* @__PURE__ */ jsx(Card, {
			className: "p-6",
			children: /* @__PURE__ */ jsxs("form", {
				onSubmit: save,
				className: "grid gap-5 sm:grid-cols-2",
				children: [
					/* @__PURE__ */ jsx(Field, {
						label: "Full name",
						children: /* @__PURE__ */ jsx(Input, {
							value: form.full_name,
							onChange: (e) => setForm({
								...form,
								full_name: e.target.value
							}),
							required: true
						})
					}),
					/* @__PURE__ */ jsx(Field, {
						label: "Country",
						children: /* @__PURE__ */ jsxs(Select, {
							value: form.country,
							onValueChange: (v) => setForm({
								...form,
								country: v
							}),
							children: [/* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }), /* @__PURE__ */ jsx(SelectContent, { children: Object.entries(COUNTRY_NAMES).map(([k, v]) => /* @__PURE__ */ jsxs(SelectItem, {
								value: k,
								children: [
									v,
									" (",
									COUNTRY_DIAL[k],
									")"
								]
							}, k)) })]
						})
					}),
					/* @__PURE__ */ jsx(Field, {
						label: "Phone (E.164)",
						hint: `Example: ${COUNTRY_DIAL[form.country]}7XXXXXXXX`,
						children: /* @__PURE__ */ jsx(Input, {
							value: form.phone_e164,
							onChange: (e) => setForm({
								...form,
								phone_e164: e.target.value
							}),
							required: true,
							placeholder: `${COUNTRY_DIAL[form.country]}…`
						})
					}),
					/* @__PURE__ */ jsx(Field, {
						label: "National ID",
						children: /* @__PURE__ */ jsx(Input, {
							value: form.national_id,
							onChange: (e) => setForm({
								...form,
								national_id: e.target.value
							}),
							required: true
						})
					}),
					/* @__PURE__ */ jsx(Field, {
						label: "Date of birth",
						children: /* @__PURE__ */ jsx(Input, {
							type: "date",
							value: form.date_of_birth,
							onChange: (e) => setForm({
								...form,
								date_of_birth: e.target.value
							})
						})
					}),
					/* @__PURE__ */ jsx(Field, {
						label: "Employment",
						children: /* @__PURE__ */ jsx(Input, {
							value: form.employment,
							onChange: (e) => setForm({
								...form,
								employment: e.target.value
							}),
							placeholder: "Employed / Self-employed / Other"
						})
					}),
					/* @__PURE__ */ jsx("div", {
						className: "sm:col-span-2",
						children: /* @__PURE__ */ jsx(Field, {
							label: "Address",
							children: /* @__PURE__ */ jsx(Textarea, {
								rows: 3,
								value: form.address,
								onChange: (e) => setForm({
									...form,
									address: e.target.value
								}),
								required: true
							})
						})
					}),
					/* @__PURE__ */ jsx("div", {
						className: "sm:col-span-2",
						children: /* @__PURE__ */ jsx(Button, {
							type: "submit",
							disabled: saving,
							children: saving ? "Saving…" : "Save profile"
						})
					})
				]
			})
		})]
	});
}
function Field({ label, hint, children }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-1.5",
		children: [
			/* @__PURE__ */ jsx(Label, { children: label }),
			children,
			hint && /* @__PURE__ */ jsx("p", {
				className: "text-xs text-muted-foreground",
				children: hint
			})
		]
	});
}
//#endregion
export { ProfilePage as component };

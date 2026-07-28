import { t as supabase } from "./client-CrwDbVDs.js";
import { t as Card } from "./card-BXjpJ96D.js";
import { t as AutoStatusPill } from "./status-pill-DJaFxHY0.js";
import { t as Label } from "./label-DBD1bRRP.js";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.js";
import { useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Upload } from "lucide-react";
//#region src/routes/_authenticated/app.kyc.tsx?tsr-split=component
var DOC_TYPES = [
	{
		value: "national_id",
		label: "National ID"
	},
	{
		value: "passport",
		label: "Passport"
	},
	{
		value: "utility_bill",
		label: "Utility bill"
	},
	{
		value: "selfie",
		label: "Selfie with ID"
	}
];
function KycPage() {
	const qc = useQueryClient();
	const { data, isLoading } = useQuery({
		queryKey: ["my-kyc"],
		queryFn: async () => {
			const { data: u } = await supabase.auth.getUser();
			const [docs, prof] = await Promise.all([supabase.from("kyc_documents").select("*").eq("user_id", u.user.id).order("created_at", { ascending: false }), supabase.from("profiles").select("kyc_status").eq("user_id", u.user.id).maybeSingle()]);
			return {
				docs: docs.data ?? [],
				status: prof.data?.kyc_status ?? "pending"
			};
		}
	});
	const [docType, setDocType] = useState("national_id");
	const [uploading, setUploading] = useState(false);
	async function onUpload(e) {
		const file = e.target.files?.[0];
		if (!file) return;
		if (file.size > 10 * 1024 * 1024) return toast.error("Max 10MB per file");
		setUploading(true);
		try {
			const { data: u } = await supabase.auth.getUser();
			const uid = u.user.id;
			const ext = file.name.split(".").pop() || "bin";
			const path = `${uid}/${docType}-${Date.now()}.${ext}`;
			const { error: upErr } = await supabase.storage.from("kyc").upload(path, file, { upsert: false });
			if (upErr) throw upErr;
			const { error: insErr } = await supabase.from("kyc_documents").insert({
				user_id: uid,
				doc_type: docType,
				storage_path: path
			});
			if (insErr) throw insErr;
			await supabase.from("profiles").update({ kyc_status: "in_review" }).eq("user_id", uid);
			toast.success("Document uploaded. We'll review shortly.");
			qc.invalidateQueries({ queryKey: ["my-kyc"] });
			qc.invalidateQueries({ queryKey: ["borrower-dashboard"] });
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Upload failed");
		} finally {
			setUploading(false);
			e.target.value = "";
		}
	}
	if (isLoading || !data) return /* @__PURE__ */ jsx("div", {
		className: "text-muted-foreground",
		children: "Loading…"
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-3xl space-y-6",
		children: [
			/* @__PURE__ */ jsxs("header", {
				className: "flex items-end justify-between gap-4",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
					className: "font-display text-3xl font-semibold",
					children: "Verification"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-sm text-muted-foreground",
					children: "Upload clear photos of your documents to unlock loans."
				})] }), /* @__PURE__ */ jsx(AutoStatusPill, { status: data.status })]
			}),
			/* @__PURE__ */ jsx(Card, {
				className: "p-6",
				children: /* @__PURE__ */ jsxs("div", {
					className: "grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ jsx(Label, { children: "Document type" }), /* @__PURE__ */ jsxs(Select, {
							value: docType,
							onValueChange: (v) => setDocType(v),
							children: [/* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }), /* @__PURE__ */ jsx(SelectContent, { children: DOC_TYPES.map((d) => /* @__PURE__ */ jsx(SelectItem, {
								value: d.value,
								children: d.label
							}, d.value)) })]
						})]
					}), /* @__PURE__ */ jsxs("label", {
						className: "inline-flex",
						children: [/* @__PURE__ */ jsx("input", {
							type: "file",
							hidden: true,
							accept: "image/*,application/pdf",
							onChange: onUpload,
							disabled: uploading
						}), /* @__PURE__ */ jsxs("span", {
							className: "inline-flex cursor-pointer items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90",
							children: [
								/* @__PURE__ */ jsx(Upload, { className: "size-4" }),
								" ",
								uploading ? "Uploading…" : "Upload"
							]
						})]
					})]
				})
			}),
			/* @__PURE__ */ jsxs(Card, {
				className: "p-6",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "mb-4 font-display text-lg font-semibold",
					children: "Uploaded documents"
				}), data.docs.length === 0 ? /* @__PURE__ */ jsx("p", {
					className: "text-sm text-muted-foreground",
					children: "No documents yet."
				}) : /* @__PURE__ */ jsx("ul", {
					className: "divide-y",
					children: data.docs.map((d) => /* @__PURE__ */ jsxs("li", {
						className: "flex items-center justify-between py-3",
						children: [/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx("div", {
								className: "font-medium capitalize",
								children: d.doc_type.replace("_", " ")
							}),
							/* @__PURE__ */ jsx("div", {
								className: "text-xs text-muted-foreground",
								children: d.storage_path.split("/").pop()
							}),
							d.rejection_reason && /* @__PURE__ */ jsx("div", {
								className: "text-xs text-destructive",
								children: d.rejection_reason
							})
						] }), /* @__PURE__ */ jsx(AutoStatusPill, { status: d.status })]
					}, d.id))
				})]
			})
		]
	});
}
//#endregion
export { KycPage as component };

import { t as supabase } from "./client-CrwDbVDs.js";
import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle2, Clock, FileImage, Loader2, Upload, XCircle } from "lucide-react";
//#region src/routes/_authenticated/kyc.tsx?tsr-split=component
var DOCS = [
	{
		type: "id_front",
		title: "National ID — Front",
		desc: "Clear photo of the front of your NRC."
	},
	{
		type: "id_back",
		title: "National ID — Back",
		desc: "Clear photo of the back of your NRC."
	},
	{
		type: "selfie",
		title: "Selfie",
		desc: "A photo of your face holding your NRC."
	}
];
function KycPage() {
	const [userId, setUserId] = useState("");
	const [docs, setDocs] = useState([]);
	const [loading, setLoading] = useState(true);
	const load = async () => {
		const { data: u } = await supabase.auth.getUser();
		if (!u.user) return;
		setUserId(u.user.id);
		const { data, error } = await supabase.from("kyc_documents").select("id,doc_type,storage_path,status,review_notes,updated_at").eq("user_id", u.user.id);
		if (error) toast.error(error.message);
		setDocs(data ?? []);
		setLoading(false);
	};
	useEffect(() => {
		load();
	}, []);
	const byType = (t) => docs.find((d) => d.doc_type === t);
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ jsx("header", {
			className: "sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-hairline",
			children: /* @__PURE__ */ jsxs("div", {
				className: "max-w-5xl mx-auto px-6 h-16 flex items-center justify-between",
				children: [/* @__PURE__ */ jsxs(Link, {
					to: "/dashboard",
					className: "inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-navy",
					children: [/* @__PURE__ */ jsx(ArrowLeft, { className: "size-4" }), " Back to dashboard"]
				}), /* @__PURE__ */ jsx("span", {
					className: "text-xs font-semibold uppercase tracking-wider text-emerald",
					children: "KYC Verification"
				})]
			})
		}), /* @__PURE__ */ jsxs("main", {
			className: "max-w-5xl mx-auto px-6 py-10 space-y-8",
			children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
				className: "text-3xl md:text-4xl font-medium text-navy",
				children: "Verify your identity"
			}), /* @__PURE__ */ jsx("p", {
				className: "text-sm text-muted-foreground mt-2 max-w-prose",
				children: "Upload the three required documents below. Reviews are typically completed within 24 hours. All files are encrypted and visible only to our compliance team."
			})] }), loading ? /* @__PURE__ */ jsx("div", {
				className: "flex items-center justify-center py-20",
				children: /* @__PURE__ */ jsx(Loader2, { className: "size-6 animate-spin text-emerald" })
			}) : /* @__PURE__ */ jsx("div", {
				className: "grid md:grid-cols-3 gap-4",
				children: DOCS.map((d) => /* @__PURE__ */ jsx(DocCard, {
					userId,
					meta: d,
					doc: byType(d.type),
					onChange: load
				}, d.type))
			})]
		})]
	});
}
function DocCard({ userId, meta, doc, onChange }) {
	const [previewUrl, setPreviewUrl] = useState(null);
	const [uploading, setUploading] = useState(false);
	const inputRef = useRef(null);
	useEffect(() => {
		let cancelled = false;
		(async () => {
			if (!doc?.storage_path) {
				setPreviewUrl(null);
				return;
			}
			const { data } = await supabase.storage.from("kyc-documents").createSignedUrl(doc.storage_path, 300);
			if (!cancelled) setPreviewUrl(data?.signedUrl ?? null);
		})();
		return () => {
			cancelled = true;
		};
	}, [doc?.storage_path]);
	const upload = async (file) => {
		if (!userId) return;
		if (file.size > 8 * 1024 * 1024) {
			toast.error("File must be under 8MB");
			return;
		}
		if (!file.type.startsWith("image/")) {
			toast.error("Only image files are allowed");
			return;
		}
		setUploading(true);
		const ext = file.name.split(".").pop() || "jpg";
		const path = `${userId}/${meta.type}-${Date.now()}.${ext}`;
		const { error: upErr } = await supabase.storage.from("kyc-documents").upload(path, file, {
			contentType: file.type,
			upsert: false
		});
		if (upErr) {
			setUploading(false);
			toast.error(upErr.message);
			return;
		}
		if (doc?.storage_path) await supabase.storage.from("kyc-documents").remove([doc.storage_path]);
		const { error: dbErr } = await supabase.from("kyc_documents").upsert({
			user_id: userId,
			doc_type: meta.type,
			storage_path: path,
			status: "pending",
			review_notes: null,
			reviewed_at: null,
			reviewed_by: null
		}, { onConflict: "user_id,doc_type" });
		setUploading(false);
		if (dbErr) {
			toast.error(dbErr.message);
			return;
		}
		toast.success(`${meta.title} uploaded`);
		onChange();
	};
	const status = doc?.status ?? "missing";
	const locked = status === "approved";
	return /* @__PURE__ */ jsxs("div", {
		className: "bg-card ring-1 ring-black/5 rounded-2xl p-6 flex flex-col gap-4",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-start justify-between gap-2",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
					className: "font-medium text-navy",
					children: meta.title
				}), /* @__PURE__ */ jsx("p", {
					className: "text-xs text-muted-foreground mt-1",
					children: meta.desc
				})] }), /* @__PURE__ */ jsx(StatusBadge, { status })]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "aspect-[4/3] rounded-lg bg-surface-muted ring-1 ring-hairline flex items-center justify-center overflow-hidden",
				children: previewUrl ? /* @__PURE__ */ jsx("img", {
					src: previewUrl,
					alt: meta.title,
					className: "w-full h-full object-cover"
				}) : /* @__PURE__ */ jsx(FileImage, { className: "size-8 text-muted-foreground/40" })
			}),
			doc?.status === "rejected" && doc.review_notes && /* @__PURE__ */ jsxs("div", {
				className: "text-xs bg-destructive/5 text-destructive p-3 rounded-md",
				children: [
					/* @__PURE__ */ jsx("strong", { children: "Reviewer note:" }),
					" ",
					doc.review_notes
				]
			}),
			/* @__PURE__ */ jsx("input", {
				ref: inputRef,
				type: "file",
				accept: "image/*",
				className: "hidden",
				onChange: (e) => {
					const f = e.target.files?.[0];
					if (f) upload(f);
					e.target.value = "";
				}
			}),
			/* @__PURE__ */ jsxs("button", {
				onClick: () => inputRef.current?.click(),
				disabled: uploading || locked,
				className: "w-full py-2.5 rounded-lg bg-navy text-navy-foreground text-sm font-medium hover:bg-navy/90 transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2",
				children: [uploading ? /* @__PURE__ */ jsx(Loader2, { className: "size-4 animate-spin" }) : /* @__PURE__ */ jsx(Upload, { className: "size-4" }), locked ? "Approved" : doc ? "Replace" : "Upload"]
			})
		]
	});
}
function StatusBadge({ status }) {
	const map = {
		approved: {
			text: "Approved",
			cls: "bg-emerald/10 text-emerald",
			Icon: CheckCircle2
		},
		rejected: {
			text: "Rejected",
			cls: "bg-destructive/10 text-destructive",
			Icon: XCircle
		},
		pending: {
			text: "Pending review",
			cls: "bg-amber-50 text-amber-700",
			Icon: Clock
		},
		missing: {
			text: "Required",
			cls: "bg-surface-muted text-muted-foreground",
			Icon: Upload
		}
	}[status];
	const Icon = map.Icon;
	return /* @__PURE__ */ jsxs("span", {
		className: `text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded-full inline-flex items-center gap-1 ${map.cls}`,
		children: [
			/* @__PURE__ */ jsx(Icon, { className: "size-3" }),
			" ",
			map.text
		]
	});
}
//#endregion
export { KycPage as component };

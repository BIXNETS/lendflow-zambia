import { n as useServerFn } from "./createSsrRpc-BgjJZxCC.js";
import { t as supabase } from "./client-CrwDbVDs.js";
import { t as Card } from "./card-BXjpJ96D.js";
import { t as Button } from "./button-PJVP9td7.js";
import { t as AutoStatusPill } from "./status-pill-DJaFxHY0.js";
import { r as updateKycStatus } from "./admin.functions-CYezGnh3.js";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
//#region src/routes/_authenticated/admin.kyc.tsx?tsr-split=component
function KycQueue() {
	const qc = useQueryClient();
	const update = useServerFn(updateKycStatus);
	const { data, isLoading } = useQuery({
		queryKey: ["admin-kyc"],
		queryFn: async () => {
			const { data: docs } = await supabase.from("kyc_documents").select("*, profiles!kyc_documents_user_id_fkey(full_name, country, kyc_status)").order("created_at", { ascending: false });
			return docs ?? [];
		}
	});
	async function decide(userId, status) {
		const reason = status === "rejected" ? window.prompt("Reason?") ?? "" : "";
		try {
			await update({ data: {
				user_id: userId,
				status,
				reason
			} });
			toast.success(`KYC ${status}`);
			qc.invalidateQueries({ queryKey: ["admin-kyc"] });
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Failed");
		}
	}
	if (isLoading || !data) return /* @__PURE__ */ jsx("div", {
		className: "text-muted-foreground",
		children: "Loading…"
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-6xl space-y-6",
		children: [/* @__PURE__ */ jsx("h1", {
			className: "font-display text-3xl font-semibold",
			children: "KYC review queue"
		}), /* @__PURE__ */ jsxs("div", {
			className: "grid gap-4 lg:grid-cols-2",
			children: [data.map((d) => {
				const p = d.profiles;
				return /* @__PURE__ */ jsx(KycCard, {
					doc: d,
					profile: p,
					onDecide: decide
				}, d.id);
			}), data.length === 0 && /* @__PURE__ */ jsx("p", {
				className: "text-muted-foreground",
				children: "Queue empty."
			})]
		})]
	});
}
function KycCard({ doc, profile, onDecide }) {
	const [url, setUrl] = useState(null);
	useEffect(() => {
		supabase.storage.from("kyc").createSignedUrl(doc.storage_path, 300).then(({ data }) => setUrl(data?.signedUrl ?? null));
	}, [doc.storage_path]);
	return /* @__PURE__ */ jsxs(Card, {
		className: "overflow-hidden",
		children: [url ? doc.storage_path.endsWith(".pdf") ? /* @__PURE__ */ jsx("a", {
			href: url,
			target: "_blank",
			rel: "noreferrer",
			className: "block bg-muted/50 p-12 text-center text-accent",
			children: "Open PDF"
		}) : /* @__PURE__ */ jsx("img", {
			src: url,
			alt: "",
			className: "aspect-video w-full bg-muted object-contain"
		}) : /* @__PURE__ */ jsx("div", { className: "aspect-video w-full animate-pulse bg-muted" }), /* @__PURE__ */ jsxs("div", {
			className: "p-4",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
					className: "font-medium",
					children: profile?.full_name ?? "—"
				}), /* @__PURE__ */ jsxs("div", {
					className: "text-xs text-muted-foreground",
					children: [
						profile?.country,
						" · ",
						doc.doc_type.replace("_", " ")
					]
				})] }), /* @__PURE__ */ jsx(AutoStatusPill, { status: doc.status })]
			}), (doc.status === "pending" || doc.status === "in_review") && /* @__PURE__ */ jsxs("div", {
				className: "mt-4 flex gap-2",
				children: [/* @__PURE__ */ jsx(Button, {
					size: "sm",
					variant: "outline",
					className: "flex-1",
					onClick: () => onDecide(doc.user_id, "rejected"),
					children: "Reject"
				}), /* @__PURE__ */ jsx(Button, {
					size: "sm",
					className: "flex-1",
					onClick: () => onDecide(doc.user_id, "approved"),
					children: "Approve"
				})]
			})]
		})]
	});
}
//#endregion
export { KycQueue as component };

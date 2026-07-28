import { t as supabase } from "./client-CrwDbVDs.js";
import { t as Card } from "./card-BXjpJ96D.js";
import { t as Button } from "./button-PJVP9td7.js";
import { t as Input } from "./input-B8Q2ztVi.js";
import { t as Label } from "./label-DBD1bRRP.js";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
//#region src/routes/auth.reset-password.tsx?tsr-split=component
function ResetPasswordPage() {
	const navigate = useNavigate();
	const [pwd, setPwd] = useState("");
	const [loading, setLoading] = useState(false);
	async function submit(e) {
		e.preventDefault();
		setLoading(true);
		const { error } = await supabase.auth.updateUser({ password: pwd });
		setLoading(false);
		if (error) return toast.error(error.message);
		toast.success("Password updated");
		navigate({ to: "/app" });
	}
	return /* @__PURE__ */ jsx("div", {
		className: "grid min-h-screen place-items-center p-6",
		children: /* @__PURE__ */ jsxs(Card, {
			className: "w-full max-w-md p-8",
			children: [/* @__PURE__ */ jsx("h1", {
				className: "font-display text-2xl font-semibold",
				children: "Set a new password"
			}), /* @__PURE__ */ jsxs("form", {
				onSubmit: submit,
				className: "mt-6 space-y-4",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ jsx(Label, {
						htmlFor: "pwd",
						children: "New password"
					}), /* @__PURE__ */ jsx(Input, {
						id: "pwd",
						type: "password",
						minLength: 8,
						value: pwd,
						onChange: (e) => setPwd(e.target.value),
						required: true
					})]
				}), /* @__PURE__ */ jsx(Button, {
					type: "submit",
					className: "w-full",
					disabled: loading,
					children: loading ? "Saving…" : "Update password"
				})]
			})]
		})
	});
}
//#endregion
export { ResetPasswordPage as component };

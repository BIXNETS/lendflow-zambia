import { t as supabase } from "./client-CrwDbVDs.js";
import { t as Card } from "./card-BXjpJ96D.js";
import { t as Button } from "./button-PJVP9td7.js";
import { t as Input } from "./input-B8Q2ztVi.js";
import { t as Label } from "./label-DBD1bRRP.js";
import { useState } from "react";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { createLovableAuth } from "@lovable.dev/cloud-auth-js";
//#region src/integrations/lovable/index.ts
var lovableAuth = createLovableAuth();
var lovable = { auth: { signInWithOAuth: async (provider, opts) => {
	const result = await lovableAuth.signInWithOAuth(provider, {
		redirect_uri: opts?.redirect_uri,
		extraParams: { ...opts?.extraParams }
	});
	if (result.redirected) return result;
	if (result.error) return result;
	try {
		await supabase.auth.setSession(result.tokens);
	} catch (e) {
		return { error: e instanceof Error ? e : new Error(String(e)) };
	}
	return result;
} } };
//#endregion
//#region src/routes/auth.tsx?tsr-split=component
function AuthPage() {
	const { mode = "signin" } = useSearch({ from: "/auth" });
	const navigate = useNavigate();
	const [isSignup, setIsSignup] = useState(mode === "signup");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [loading, setLoading] = useState(false);
	async function handleSubmit(e) {
		e.preventDefault();
		setLoading(true);
		try {
			if (isSignup) {
				const { error } = await supabase.auth.signUp({
					email,
					password,
					options: {
						emailRedirectTo: window.location.origin + "/app",
						data: { full_name: name }
					}
				});
				if (error) throw error;
				toast.success("Account created. Welcome to Akiba.");
				navigate({ to: "/app" });
			} else {
				const { error } = await supabase.auth.signInWithPassword({
					email,
					password
				});
				if (error) throw error;
				navigate({ to: "/app" });
			}
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Authentication failed");
		} finally {
			setLoading(false);
		}
	}
	async function handleGoogle() {
		setLoading(true);
		try {
			const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/app" });
			if (result.error) throw result.error;
			if (result.redirected) return;
			navigate({ to: "/app" });
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Google sign-in failed");
			setLoading(false);
		}
	}
	async function handleReset() {
		if (!email) return toast.error("Enter your email first");
		const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + "/auth/reset-password" });
		if (error) toast.error(error.message);
		else toast.success("Password reset email sent.");
	}
	return /* @__PURE__ */ jsxs("div", {
		className: "grid min-h-screen lg:grid-cols-2",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "hidden bg-sidebar p-12 text-sidebar-foreground lg:flex lg:flex-col lg:justify-between",
			children: [
				/* @__PURE__ */ jsxs(Link, {
					to: "/",
					className: "flex items-center gap-2 font-display text-xl font-semibold",
					children: [/* @__PURE__ */ jsx("span", {
						className: "grid size-9 place-items-center rounded-lg bg-accent text-accent-foreground",
						children: "A"
					}), "Akiba Loans"]
				}),
				/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx("h2", {
						className: "font-display text-4xl font-semibold leading-tight",
						children: "Fair credit, instantly. Built for Africa."
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-4 max-w-md text-sidebar-foreground/70",
						children: "Apply in under two minutes. Get funds straight to your mobile money wallet. Transparent rates, no hidden fees."
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-10 grid gap-3 text-sm text-sidebar-foreground/80",
						children: [
							/* @__PURE__ */ jsx("div", { children: "✓ M-Pesa, MTN MoMo, Airtel Money" }),
							/* @__PURE__ */ jsx("div", { children: "✓ Loans from KES 5k to KES 200k" }),
							/* @__PURE__ */ jsx("div", { children: "✓ Trusted by borrowers in 6 countries" })
						]
					})
				] }),
				/* @__PURE__ */ jsx("p", {
					className: "text-xs text-sidebar-foreground/60",
					children: "© Akiba Loans. Licensed digital lender."
				})
			]
		}), /* @__PURE__ */ jsx("div", {
			className: "flex items-center justify-center p-6",
			children: /* @__PURE__ */ jsxs(Card, {
				className: "w-full max-w-md p-8",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "mb-6 flex items-center justify-between",
						children: [/* @__PURE__ */ jsx("h1", {
							className: "font-display text-2xl font-semibold",
							children: isSignup ? "Create account" : "Welcome back"
						}), /* @__PURE__ */ jsx("button", {
							onClick: () => setIsSignup(!isSignup),
							className: "text-sm text-accent hover:underline",
							children: isSignup ? "Sign in" : "Create one"
						})]
					}),
					/* @__PURE__ */ jsx(Button, {
						variant: "outline",
						className: "w-full",
						onClick: handleGoogle,
						disabled: loading,
						children: "Continue with Google"
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "my-5 flex items-center gap-3 text-xs text-muted-foreground",
						children: [
							/* @__PURE__ */ jsx("div", { className: "h-px flex-1 bg-border" }),
							" OR ",
							/* @__PURE__ */ jsx("div", { className: "h-px flex-1 bg-border" })
						]
					}),
					/* @__PURE__ */ jsxs("form", {
						onSubmit: handleSubmit,
						className: "space-y-4",
						children: [
							isSignup && /* @__PURE__ */ jsxs("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ jsx(Label, {
									htmlFor: "name",
									children: "Full name"
								}), /* @__PURE__ */ jsx(Input, {
									id: "name",
									value: name,
									onChange: (e) => setName(e.target.value),
									required: true,
									minLength: 2
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ jsx(Label, {
									htmlFor: "email",
									children: "Email"
								}), /* @__PURE__ */ jsx(Input, {
									id: "email",
									type: "email",
									value: email,
									onChange: (e) => setEmail(e.target.value),
									required: true
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ jsx(Label, {
										htmlFor: "password",
										children: "Password"
									}), !isSignup && /* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: handleReset,
										className: "text-xs text-muted-foreground hover:text-accent",
										children: "Forgot?"
									})]
								}), /* @__PURE__ */ jsx(Input, {
									id: "password",
									type: "password",
									value: password,
									onChange: (e) => setPassword(e.target.value),
									required: true,
									minLength: 8
								})]
							}),
							/* @__PURE__ */ jsx(Button, {
								type: "submit",
								className: "w-full",
								disabled: loading,
								children: loading ? "Please wait…" : isSignup ? "Create account" : "Sign in"
							})
						]
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-6 text-center text-xs text-muted-foreground",
						children: "By continuing you agree to our terms and privacy policy."
					})
				]
			})
		})]
	});
}
//#endregion
export { AuthPage as component };

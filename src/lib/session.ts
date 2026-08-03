import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import type { Account, Role } from "@/lib/demo-auth";

/** Admin / back-office credentials seeded for this project. */
export const ADMIN_EMAIL = "admin@lendflowafrica.com";
export const ADMIN_PASSWORD = "Admin@2026!";

export type SignResult = { ok: true; account: Account } | { ok: false; error: string };

async function accountFromSession(): Promise<Account | null> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  const user = data.user;

  const [{ data: profile }, { data: roles }] = await Promise.all([
    supabase.from("profiles").select("first_name,last_name,phone").eq("id", user.id).maybeSingle(),
    supabase.from("user_roles").select("role").eq("user_id", user.id),
  ]);

  const isAdmin = (roles ?? []).some(r => r.role === "admin");
  const meta = (user.user_metadata ?? {}) as Record<string, string>;
  const name =
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ").trim() ||
    [meta.first_name, meta.last_name].filter(Boolean).join(" ").trim() ||
    (user.email ?? "").split("@")[0]!;

  return {
    email: user.email ?? "",
    password: "",
    name,
    role: (isAdmin ? "manager" : "client") as Role,
    phone: profile?.phone ?? meta.phone ?? "",
  };
}

export async function signInAccount(email: string, password: string): Promise<SignResult> {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });
  if (error) return { ok: false, error: error.message };
  const account = await accountFromSession();
  if (!account) return { ok: false, error: "Could not load your account." };
  return { ok: true, account };
}

export async function signUpAccount(input: {
  name: string; email: string; password: string; phone: string;
}): Promise<SignResult> {
  const [first_name, ...rest] = input.name.trim().split(/\s+/);
  const { error } = await supabase.auth.signUp({
    email: input.email.trim().toLowerCase(),
    password: input.password,
    options: {
      emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
      data: { first_name: first_name ?? "", last_name: rest.join(" "), phone: input.phone },
    },
  });
  if (error) return { ok: false, error: error.message };

  const account = await accountFromSession();
  if (!account) {
    return { ok: false, error: "Account created. Please check your email to confirm, then sign in." };
  }
  return { ok: true, account };
}

export async function signOutAccount() {
  await supabase.auth.signOut();
}

export async function getAccount(): Promise<Account | null> {
  return accountFromSession();
}

/** Client-side hook: null while loading, then the signed-in account or false. */
export function useAccount() {
  const [account, setAccount] = useState<Account | null | undefined>(undefined);

  useEffect(() => {
    let alive = true;
    getAccount().then(a => alive && setAccount(a));
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      getAccount().then(a => alive && setAccount(a));
    });
    return () => { alive = false; data.subscription.unsubscribe(); };
  }, []);

  return { account, loading: account === undefined };
}

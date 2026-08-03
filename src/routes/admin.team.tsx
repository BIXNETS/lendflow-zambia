import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Loader, ShieldCheck, ShieldOff, UserPlus, ArrowLeft } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { SiteNav, SiteFooter } from "@/components/SiteNav";
import { inputCls } from "@/components/Wizard";
import { cn } from "@/lib/utils";
import { getMyRoles, listTeam, setUserRole, grantAdminByEmail, type TeamMember } from "@/lib/roles.functions";

export const Route = createFileRoute("/admin/team")({
  head: () => ({
    meta: [
      { title: "Team & Roles — LendFlow Africa Admin" },
      { name: "description", content: "Grant or revoke admin access for LendFlow staff accounts, with safeguards that keep at least one administrator active." },
      { property: "og:title", content: "LendFlow Africa — Team & Roles" },
      { property: "og:description", content: "Role-based access control for the LendFlow admin console." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TeamRoles,
});

function TeamRoles() {
  const navigate = useNavigate();
  const myRoles = useServerFn(getMyRoles);
  const fetchTeam = useServerFn(listTeam);
  const changeRole = useServerFn(setUserRole);
  const grantByEmail = useServerFn(grantAdminByEmail);

  const [state, setState] = useState<"loading" | "denied" | "ready">("loading");
  const [me, setMe] = useState<string>("");
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [adminCount, setAdminCount] = useState(0);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const load = useCallback(async () => {
    try {
      const mine = await myRoles({});
      setMe(mine.userId);
      if (!mine.isAdmin) { setState("denied"); return; }
      const team = await fetchTeam({});
      setMembers(team.members);
      setAdminCount(team.adminCount);
      setState("ready");
    } catch {
      setState("denied");
    }
  }, [myRoles, fetchTeam]);

  useEffect(() => { void load(); }, [load]);

  const toggleAdmin = async (m: TeamMember) => {
    setBusy(m.userId); setMsg(null);
    try {
      await changeRole({ data: { userId: m.userId, role: "admin", grant: !m.roles.includes("admin") } });
      setMsg({ kind: "ok", text: `Updated access for ${m.email}.` });
      await load();
    } catch (e) {
      setMsg({ kind: "err", text: e instanceof Error ? e.message : "Could not update role." });
    } finally { setBusy(null); }
  };

  const invite = async () => {
    if (!email.trim()) return;
    setBusy("invite"); setMsg(null);
    try {
      await grantByEmail({ data: { email: email.trim() } });
      setMsg({ kind: "ok", text: `${email.trim()} is now an admin.` });
      setEmail("");
      await load();
    } catch (e) {
      setMsg({ kind: "err", text: e instanceof Error ? e.message : "Could not grant admin." });
    } finally { setBusy(null); }
  };

  return (
    <div className="min-h-screen">
      <SiteNav />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <Link to="/admin" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[color:var(--color-muted)] hover:underline">
          <ArrowLeft className="h-4 w-4" /> Country settings
        </Link>
        <h1 className="mt-3 text-3xl font-black tracking-tight">Team &amp; roles</h1>
        <p className="mt-2 text-sm text-[color:var(--color-muted)]">
          Administrators can review applications, approve identity documents, disburse loans and edit country settings. Everyone else is a borrower.
        </p>

        {state === "loading" && (
          <div className="flex items-center gap-3 py-20 text-sm text-[color:var(--color-muted)]">
            <Loader className="spin h-5 w-5" /> Checking your access…
          </div>
        )}

        {state === "denied" && (
          <div className="card mt-8 space-y-3 p-6 text-sm">
            <div className="flex items-center gap-2 font-bold"><ShieldOff className="h-5 w-5 text-red-500" /> Admins only</div>
            <p className="text-[color:var(--color-muted)]">You do not have permission to manage team roles.</p>
            <button onClick={() => navigate({ to: "/dashboard" })} className="btn-navy rounded-full px-5 py-2 text-xs font-bold">
              Back to dashboard
            </button>
          </div>
        )}

        {state === "ready" && (
          <>
            {msg && (
              <div className={cn("mt-6 rounded-xl px-4 py-3 text-sm font-semibold",
                msg.kind === "ok" ? "bg-[color:var(--color-mint)] text-[color:var(--color-leaf-dark)]" : "bg-red-50 text-red-700")}>
                {msg.text}
              </div>
            )}

            <section className="card mt-6 p-5">
              <h2 className="text-xs font-bold uppercase tracking-widest text-[color:var(--color-muted)]">Grant admin by email</h2>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <input className={inputCls()} value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="colleague@company.com" type="email" aria-label="Email address" />
                <button onClick={invite} disabled={busy === "invite"}
                  className="btn-primary inline-flex shrink-0 items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold disabled:opacity-40">
                  {busy === "invite" ? <Loader className="spin h-4 w-4" /> : <UserPlus className="h-4 w-4" />} Make admin
                </button>
              </div>
              <p className="mt-2 text-xs text-[color:var(--color-muted)]">The person must already have a LendFlow account.</p>
            </section>

            <section className="card mt-6 overflow-x-auto p-0">
              <table className="w-full min-w-[42rem] text-left text-sm">
                <thead className="bg-[color:var(--color-sky)] text-xs font-bold uppercase tracking-widest text-[color:var(--color-muted)]">
                  <tr>
                    <th className="px-5 py-3">Member</th>
                    <th className="px-5 py-3">Role</th>
                    <th className="px-5 py-3">Last sign-in</th>
                    <th className="px-5 py-3 text-right">Access</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((m) => {
                    const admin = m.roles.includes("admin");
                    const locked = admin && (m.userId === me || adminCount <= 1);
                    return (
                      <tr key={m.userId} className="border-t border-[color:var(--color-line)]">
                        <td className="px-5 py-3">
                          <div className="font-bold">{m.name}</div>
                          <div className="text-xs text-[color:var(--color-muted)]">{m.email}</div>
                        </td>
                        <td className="px-5 py-3">
                          <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold",
                            admin ? "bg-[color:var(--color-mint)] text-[color:var(--color-leaf-dark)]" : "bg-[color:var(--color-sky)] text-[color:var(--color-muted)]")}>
                            {admin ? <ShieldCheck className="h-3.5 w-3.5" /> : null}
                            {admin ? "Administrator" : "Borrower"}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-xs text-[color:var(--color-muted)]">
                          {m.lastSignInAt ? new Date(m.lastSignInAt).toLocaleDateString() : "—"}
                        </td>
                        <td className="px-5 py-3 text-right">
                          <button onClick={() => toggleAdmin(m)} disabled={locked || busy === m.userId}
                            title={locked ? "At least one admin must remain" : undefined}
                            className={cn("rounded-full px-4 py-2 text-xs font-bold disabled:opacity-40",
                              admin ? "border border-[color:var(--color-line)] bg-white hover:bg-red-50" : "btn-navy")}>
                            {busy === m.userId ? "Saving…" : admin ? "Revoke admin" : "Make admin"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </section>
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

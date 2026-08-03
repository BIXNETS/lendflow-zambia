import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell, KpiCard, StatusPill } from "@/components/AppShell";
import { currentUser, listApplications, money, computeLoan, type Account, type Application } from "@/lib/demo-auth";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "My dashboard — LendFlow Africa" },
      { name: "description", content: "Track your LendFlow Africa loan applications, service fee payments and 2.5% interest repayment schedule." },
      { property: "og:title", content: "My dashboard — LendFlow Africa" },
      { property: "og:description", content: "Track applications, service fees and repayments." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  ssr: false,
  component: ClientDashboard,
});

function ClientDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<Account | null>(null);
  const [apps, setApps] = useState<Application[]>([]);

  useEffect(() => {
    const u = currentUser();
    if (!u) { navigate({ to: "/auth" }); return; }
    if (u.role === "manager") { navigate({ to: "/manager" }); return; }
    setUser(u);
    setApps(listApplications().filter(a => a.email === u.email));
  }, [navigate]);

  if (!user) return null;

  const approved = apps.filter(a => a.status === "approved");
  const outstanding = approved.reduce((s, a) => s + a.amount, 0);
  const paidServiceFees = apps.reduce((s, a) => s + a.serviceFee, 0);

  return (
    <AppShell user={user} subtitle="Borrower account">
      <div className="rise">
        <h1 className="text-3xl font-black tracking-tight">Hello, {user.name.split(" ")[0]} 👋</h1>
        <p className="mt-1 text-[color:var(--color-muted)]">All LendFlow loans carry a flat 2.5% interest — no surprises.</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard label="Applications" value={String(apps.length)} hint="Lifetime" tone="sky" />
          <KpiCard label="Outstanding" value={money(outstanding)} hint="Principal only" />
          <KpiCard label="Service fees paid" value={money(paidServiceFees)} tone="sun" />
          <KpiCard label="Interest charged" value="2.5%" hint="flat, on the loan amount" />
        </div>

        <div className="mt-8 card overflow-hidden">
          <div className="flex items-center justify-between border-b border-[color:var(--color-line)] px-6 py-4">
            <h2 className="text-lg font-bold">My applications</h2>
            <Link to="/" className="btn-primary rounded-full px-4 py-2 text-xs font-bold">New application</Link>
          </div>
          {apps.length === 0 ? (
            <p className="px-6 py-10 text-center text-sm text-[color:var(--color-muted)]">
              No applications yet. Start one from the home page — you'll pay a 10–15% service fee and a flat 2.5% interest.
            </p>
          ) : (
            <div className="divide-y divide-[color:var(--color-line)]">
              {apps.map(a => (
                <div key={a.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-6 py-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-black">{money(a.amount)}</span>
                      <span className="text-xs text-[color:var(--color-muted)]">· {a.term} months · {a.purpose}</span>
                    </div>
                    <div className="mt-1 text-xs text-[color:var(--color-muted)]">
                      {a.id} · service fee {money(a.serviceFee)} ({a.serviceFeePct}%) via {a.provider}
                    </div>
                  </div>
                  <StatusPill status={a.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 card p-6">
          <h2 className="text-lg font-bold">Repayment schedule</h2>
          {approved.length === 0 ? (
            <p className="mt-2 text-sm text-[color:var(--color-muted)]">A schedule appears here once a loan is approved.</p>
          ) : (
            <ul className="mt-4 space-y-2 text-sm">
              {approved.map(a =>
                Array.from({ length: Math.min(a.term, 6) }).map((_, i) => (
                  <li key={a.id + i} className="flex items-center justify-between rounded-xl bg-[color:var(--color-sky)] px-4 py-2.5">
                    <span className="text-[color:var(--color-muted)]">{a.id} · instalment {i + 1}</span>
                    <span className="font-bold tabular-nums">{money(computeLoan(a.amount, a.serviceFeePct, a.term).monthly)}</span>
                  </li>
                )),
              )}
            </ul>
          )}
        </div>
      </div>
    </AppShell>
  );
}

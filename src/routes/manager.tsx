import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell, KpiCard, StatusPill } from "@/components/AppShell";
import {
  listApplications, money, updateApplication,
  type Account, type Application,
} from "@/lib/demo-auth";
import { useAccount } from "@/lib/session";

export const Route = createFileRoute("/manager")({
  head: () => ({
    meta: [
      { title: "Manager console — LendFlow Africa" },
      { name: "description", content: "Review LendFlow Africa loan applications, verify service fee payments and approve 2.5% interest disbursements." },
      { property: "og:title", content: "Manager console — LendFlow Africa" },
      { property: "og:description", content: "Review applications and approve disbursements." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  ssr: false,
  component: ManagerDashboard,
});

function ManagerDashboard() {
  const navigate = useNavigate();
  const { account, loading } = useAccount();
  const [apps, setApps] = useState<Application[]>([]);
  const [filter, setFilter] = useState<"all" | Application["status"]>("all");

  useEffect(() => {
    if (loading) return;
    if (!account) { navigate({ to: "/auth" }); return; }
    if (account.role !== "manager") { navigate({ to: "/dashboard" }); return; }
    setApps(listApplications());
  }, [navigate, account, loading]);

  const user: Account | null = account && account.role === "manager" ? account : null;
  if (!user) return null;

  const act = (id: string, status: Application["status"]) => {
    updateApplication(id, { status });
    setApps(listApplications());
  };

  const shown = filter === "all" ? apps : apps.filter(a => a.status === filter);
  const pending = apps.filter(a => a.status === "under_review").length;
  const book = apps.filter(a => a.status === "approved").reduce((s, a) => s + a.amount, 0);
  const fees = apps.reduce((s, a) => s + a.serviceFee, 0);

  return (
    <AppShell user={user} subtitle="Manager · back office">
      <div className="rise">
        <h1 className="text-3xl font-black tracking-tight">Manager console</h1>
        <p className="mt-1 text-[color:var(--color-muted)]">Review service fees and release 2.5% interest loans.</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard label="Pending review" value={String(pending)} tone="sun" />
          <KpiCard label="Total applications" value={String(apps.length)} tone="sky" />
          <KpiCard label="Approved book" value={money(book)} />
          <KpiCard label="Service fees collected" value={money(fees)} tone="sky" />
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {(["all", "under_review", "awaiting_fee", "approved", "declined"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-2 text-xs font-bold capitalize transition ${
                filter === f ? "btn-navy" : "border border-[color:var(--color-line)] bg-white text-[color:var(--color-navy)] hover:bg-[color:var(--color-sky)]"
              }`}>
              {f.replace(/_/g, " ")}
            </button>
          ))}
        </div>

        <div className="mt-4 card overflow-hidden">
          {shown.length === 0 ? (
            <p className="px-6 py-10 text-center text-sm text-[color:var(--color-muted)]">No applications in this view.</p>
          ) : (
            <div className="divide-y divide-[color:var(--color-line)]">
              {shown.map(a => (
                <div key={a.id} className="grid gap-4 px-6 py-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-black">{a.name}</span>
                      <StatusPill status={a.status} />
                    </div>
                    <div className="mt-1 text-sm text-[color:var(--color-muted)]">
                      {a.id} · {money(a.amount)} over {a.term} months · {a.productTitle ?? a.purpose}
                    </div>
                    <div className="mt-1 text-xs text-[color:var(--color-muted)]">
                      Service fee {money(a.serviceFee)} ({a.serviceFeePct}%) · {a.provider} {a.msisdn} · {a.email}
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    <button onClick={() => act(a.id, "approved")}
                      className="btn-primary rounded-full px-4 py-2 text-xs font-bold">Approve</button>
                    <button onClick={() => act(a.id, "declined")}
                      className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-100">Decline</button>
                    <button onClick={() => act(a.id, "under_review")}
                      className="rounded-full border border-[color:var(--color-line)] px-4 py-2 text-xs font-bold text-[color:var(--color-navy)] hover:bg-[color:var(--color-sky)]">Reset</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { Surface } from "@/components/app/Surface";
import { KpiCard } from "@/components/app/KpiCard";
import { StatusChip } from "@/components/app/StatusChip";
import { Repeat, Pause, Play, AlertTriangle } from "lucide-react";
import { fetchCustomers, fetchPlans } from "@/lib/apiClient";
import useRealtime from "@/lib/useRealtime";

export const Route = createFileRoute("/_app/subscriptions/active")({ component: Page });

const TONE = { active: "success", paused: "warning", "churn-risk": "danger", cancelled: "neutral" } as const;

function Page() {
  const liveCustomers = useRealtime('customers', fetchCustomers, 'customers:update');
  const livePlans = useRealtime('plans', fetchPlans, 'plans:update');
  const customers = liveCustomers;
  const plans = livePlans;
  const planPrices = new Map(plans.map((plan) => [plan.name, plan.price]));
  const subs = customers.filter((customer) => customer.status !== "cancelled").map((customer, index) => ({
    id: customer.id ?? `SUB-${20480 + index}`,
    customer: customer.name,
    plan: customer.plan ?? "—",
    vehicles: customer.vehicles ?? 0,
    mrr: planPrices.get(customer.plan ?? "") ?? 0,
    nextRenewal: customer.status === "paused" ? "Paused" : customer.status === "cancelled" ? "Cancelled" : "—",
    status: customer.status ?? "active",
  }));
  return (
    <>
      <TopBar title="Active Subscriptions" subtitle={`${subs.length} live subscriptions across ${plans.length} plans`} />
      <div className="px-6 py-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <KpiCard label="Total active" value={subs.length.toString()} icon={Repeat} accent="success" />
          <KpiCard label="Paused" value={subs.filter((subscription) => subscription.status === "paused").length.toString()} icon={Pause} accent="warning" />
          <KpiCard label="Churn-risk" value={subs.filter((subscription) => subscription.status === "churn-risk").length.toString()} icon={AlertTriangle} accent="warning" />
          <KpiCard label="Reactivated (MTD)" value={subs.filter((subscription) => subscription.status === "active").length.toString()} icon={Play} accent="success" />
        </div>
        <Surface>
          <div className="grid gap-3 md:grid-cols-4">
            {plans.map(p => (
              <div key={p.id} className="rounded-xl border border-border bg-surface-muted/40 p-4">
                <div className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">{p.id}</div>
                <div className="mt-0.5 text-[14px] font-black">{p.name}</div>
                <div className="mt-2 text-[24px] font-black tabular-nums">{p.active ?? 0}</div>
                <div className="text-[11px] text-muted-foreground">active subscriptions</div>
              </div>
            ))}
            {!plans.length ? (
              <div className="rounded-xl border border-dashed border-border bg-surface-muted/20 p-4 text-sm text-muted-foreground md:col-span-4">
                No live plan data yet.
              </div>
            ) : null}
          </div>
        </Surface>
        <Surface padded={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-[12.5px] min-w-180">
              <thead className="bg-surface-muted text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
                <tr><th className="px-4 py-3 text-left">Subscription</th><th className="px-4 py-3 text-left">Customer</th><th className="px-4 py-3 text-left">Plan</th><th className="px-4 py-3 text-right">Vehicles</th><th className="px-4 py-3 text-right">MRR</th><th className="px-4 py-3 text-left">Next renewal</th><th className="px-4 py-3 text-right">Status</th></tr>
              </thead>
              <tbody>
                {subs.length ? subs.map(s => (
                  <tr key={s.id} className="border-t border-border hover:bg-surface-muted/60">
                    <td className="px-4 py-3 font-mono font-bold">{s.id}</td>
                    <td className="px-4 py-3">{s.customer}</td>
                    <td className="px-4 py-3 font-bold">{s.plan}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{s.vehicles}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-bold">AED {s.mrr.toLocaleString()}</td>
                    <td className="px-4 py-3 text-muted-foreground">{s.nextRenewal}</td>
                    <td className="px-4 py-3 text-right"><StatusChip tone={TONE[s.status as keyof typeof TONE]}>{s.status}</StatusChip></td>
                  </tr>
                )) : (
                  <tr>
                    <td className="px-4 py-8 text-center text-muted-foreground" colSpan={7}>
                      No active subscriptions available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Surface>
      </div>
    </>
  );
}

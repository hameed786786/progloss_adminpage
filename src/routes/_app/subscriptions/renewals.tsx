import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { Surface } from "@/components/app/Surface";
import { KpiCard } from "@/components/app/KpiCard";
import { StatusChip } from "@/components/app/StatusChip";
import { RefreshCcw, Calendar, AlertTriangle, CheckCircle2 } from "lucide-react";
import { fetchCustomers, fetchPlans } from "@/lib/apiClient";
import useRealtime from "@/lib/useRealtime";

export const Route = createFileRoute("/_app/subscriptions/renewals")({ component: Page });

function dueLabel(index: number) {
  if (index === 0) return "Tomorrow";
  return `in ${index + 1} days`;
}

function Page() {
  const customers = useRealtime('customers', fetchCustomers, 'customers:update');
  const plans = useRealtime('plans', fetchPlans, 'plans:update');

  const renewals = useMemo(() => {
    const planPrices = new Map(plans.map((plan) => [plan.name, plan.price]));

    return customers
      .filter((customer) => customer.status !== 'cancelled')
      .slice(0, 6)
      .map((customer, index) => ({
        id: `SUB-${20480 + index}`,
        customer: customer.name,
        plan: customer.plan ?? '—',
        amount: Number(planPrices.get(customer.plan ?? '') ?? 0),
        dueIn: dueLabel(index),
        method: index % 2 === 0 ? 'Visa' : 'Mastercard',
        autopay: customer.status !== 'paused',
        status: customer.status === 'paused' ? 'paused' : customer.status === 'churn-risk' ? 'at-risk' : 'scheduled',
      }));
  }, [customers, plans]);

  const dueCount = renewals.length;
  const expectedRevenue = renewals.reduce((sum, renewal) => sum + Number(renewal.amount ?? 0), 0);
  const atRiskCount = renewals.filter((renewal) => renewal.status === 'at-risk').length;
  const autoRenewing = renewals.length ? ((renewals.filter((renewal) => renewal.autopay).length / renewals.length) * 100) : 0;

  return (
    <>
      <TopBar title="Renewals" subtitle={`${dueCount} renewals due in next 7 days · AED ${expectedRevenue.toLocaleString()} expected`} />
      <div className="px-6 py-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <KpiCard label="Due in 7 days" value={dueCount.toString()} icon={Calendar} accent="warning" />
          <KpiCard label="Expected revenue" value={`AED ${expectedRevenue.toLocaleString()}`} icon={Calendar} accent="primary" />
          <KpiCard label="At-risk" value={atRiskCount.toString()} icon={AlertTriangle} accent="danger" hint="Paused or churn-risk" />
          <KpiCard label="Auto-renewing" value={`${autoRenewing.toFixed(1)}%`} icon={CheckCircle2} accent="success" />
        </div>
        <Surface padded={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-[12.5px] min-w-180">
              <thead className="bg-surface-muted text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
                <tr><th className="px-4 py-3 text-left">Subscription</th><th className="px-4 py-3 text-left">Customer</th><th className="px-4 py-3 text-left">Plan</th><th className="px-4 py-3 text-right">Amount</th><th className="px-4 py-3 text-left">Due</th><th className="px-4 py-3 text-left">Method</th><th className="px-4 py-3 text-right">Status</th></tr>
              </thead>
              <tbody>
                {renewals.map(r => (
                  <tr key={r.id} className="border-t border-border hover:bg-surface-muted/60">
                    <td className="px-4 py-3 font-mono font-bold">{r.id}</td>
                    <td className="px-4 py-3">{r.customer}</td>
                    <td className="px-4 py-3 font-bold">{r.plan}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-bold">AED {r.amount.toFixed(2)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.dueIn}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.method}{r.autopay && <RefreshCcw className="inline ml-1.5 h-3 w-3 text-primary"/>}</td>
                    <td className="px-4 py-3 text-right"><StatusChip tone={r.status==="scheduled"?"info":r.status==="at-risk"?"danger":"warning"}>{r.status}</StatusChip></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Surface>
      </div>
    </>
  );
}

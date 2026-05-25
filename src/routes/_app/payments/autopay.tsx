import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { Surface } from "@/components/app/Surface";
import { KpiCard } from "@/components/app/KpiCard";
import { StatusChip } from "@/components/app/StatusChip";
import { Repeat, CreditCard, ShieldCheck } from "lucide-react";
import { fetchCustomers, fetchPlans, fetchPayments } from "@/lib/apiClient";
import useRealtime from "@/lib/useRealtime";

export const Route = createFileRoute("/_app/payments/autopay")({ component: Page });

function Page() {
  const customers = useRealtime("customers", fetchCustomers, "customers:update");
  const plans = useRealtime("plans", fetchPlans, "plans:update");
  const payments = useRealtime("payments", fetchPayments, "payments:update");

  const mandates = useMemo(() => {
    const planPrices = new Map(plans.map((p) => [p.name, p.price]));
    return (customers || [])
      .filter((c) => Boolean(c.plan))
      .slice(0, 100)
      .map((c) => {
        const amount = Number(planPrices.get(c.plan ?? "") ?? 0);
        const custPayments = (payments || []).filter((p) => p.customer === c.name || p.customer === c.id);
        const latest = custPayments.slice().sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()))[0];
        let status: "active" | "paused" | "revoked" = "active";
        if (c.status === "cancelled" || c.status === "revoked") status = "revoked";
        else if (latest?.status === "revoked") status = "revoked";
        else if (c.status === "paused") status = "paused";
        return {
          id: `AP-${Math.abs(c.name.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0)) % 100000}`,
          customer: c.name,
          method: latest?.method ?? "—",
          plan: c.plan ?? "—",
          nextCharge: "—",
          amount,
          status,
          autopay: c.status !== "paused",
        };
      });
  }, [customers, plans, payments]);

  const activeCount = mandates.filter((m) => m.status === "active").length;
  const autoCharged = mandates.reduce((s, m) => s + (m.autopay ? m.amount : 0), 0);
  const revokedCount = mandates.filter((m) => m.status === "revoked").length;
  const coverage = mandates.length ? ((mandates.filter((m) => m.autopay).length / mandates.length) * 100) : 0;

  return (
    <>
      <TopBar title="AutoPay Mandates" subtitle={`${mandates.length} mandates · AED ${autoCharged.toLocaleString()} auto-charged`} />
      <div className="px-6 py-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <KpiCard label="Active mandates" value={activeCount.toString()} icon={Repeat} accent="success" />
          <KpiCard label="Auto-charged (MTD)" value={`AED ${autoCharged.toLocaleString()}`} icon={CreditCard} accent="primary" />
          <KpiCard label="Mandate revocations" value={revokedCount.toString()} icon={ShieldCheck} accent="warning" />
          <KpiCard label="Coverage rate" value={`${coverage.toFixed(1)}%`} icon={ShieldCheck} accent="success" />
        </div>

        <Surface padded={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-[12.5px] min-w-[720px]">
              <thead className="bg-surface-muted text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left">Mandate</th>
                  <th className="px-4 py-3 text-left">Customer</th>
                  <th className="px-4 py-3 text-left">Method</th>
                  <th className="px-4 py-3 text-left">Plan</th>
                  <th className="px-4 py-3 text-left">Next charge</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {(mandates || []).map((m) => (
                  <tr key={m.id} className="border-t border-border hover:bg-surface-muted/60">
                    <td className="px-4 py-3 font-mono font-bold">{m.id}</td>
                    <td className="px-4 py-3">{m.customer}</td>
                    <td className="px-4 py-3 text-muted-foreground">{m.method}</td>
                    <td className="px-4 py-3">{m.plan}</td>
                    <td className="px-4 py-3">{m.nextCharge}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-bold">AED {Number(m.amount ?? 0).toFixed(2)}</td>
                    <td className="px-4 py-3 text-right">
                      <StatusChip tone={m.status === "active" ? "success" : m.status === "paused" ? "warning" : "danger"}>{m.status}</StatusChip>
                    </td>
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

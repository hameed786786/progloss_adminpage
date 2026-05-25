import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { Surface, SectionTitle } from "@/components/app/Surface";
import { KpiCard } from "@/components/app/KpiCard";
import { StatusChip } from "@/components/app/StatusChip";
import { Network, Activity, AlertTriangle } from "lucide-react";
import { fetchPayments } from "@/lib/apiClient";
import useRealtime from "@/lib/useRealtime";

export const Route = createFileRoute("/_app/payments/gateway")({ component: Page });

function gatewayLabel(payment: any, index: number) {
  return payment.gateway ?? (payment.method?.includes('Visa') || payment.method?.includes('Mastercard') ? 'Network Intl' : index % 2 === 0 ? 'Stripe' : 'Telr');
}

function Page() {
  const payments = useRealtime('payments', fetchPayments, 'payments:update');

  const gateways = useMemo(() => {
    const grouped = new Map<string, { name: string; region: string; uptime: number; volume: number; success: number; status: string }>();
    for (const [index, payment] of payments.entries()) {
      const name = gatewayLabel(payment, index);
      const current = grouped.get(name) ?? { name, region: name === 'Network Intl' ? 'UAE' : name === 'Telr' ? 'UAE' : name === 'Apple Pay' ? 'Global' : 'EU', uptime: name === 'Apple Pay' ? 100 : name === 'Telr' ? 99.99 : name === 'Network Intl' ? 99.98 : 99.94, volume: 0, success: 0, status: 'operational' };
      current.volume += Number(payment.amount ?? 0);
      current.success += payment.status === 'captured' ? 1 : 0;
      grouped.set(name, current);
    }

    return [...grouped.values()].map((gateway) => ({
      ...gateway,
      success: payments.filter((payment, index) => gatewayLabel(payment, index) === gateway.name).length
        ? Number(((gateway.success / payments.filter((payment, index) => gatewayLabel(payment, index) === gateway.name).length) * 100).toFixed(1))
        : 0,
      status: gateway.name === 'Stripe' && payments.some((payment, index) => gatewayLabel(payment, index) === 'Stripe' && payment.status === 'failed') ? 'degraded' : 'operational',
    })).sort((a, b) => b.volume - a.volume);
  }, [payments]);

  const events = useMemo(() => {
    return [...payments]
      .slice(0, 6)
      .map((payment: any, index) => ({
        ts: payment.date ?? payment.createdAt ?? `Today ${String(11 - index).padStart(2, '0')}:00`,
        gw: gatewayLabel(payment, index),
        event: payment.status === 'failed' ? 'payment_intent.payment_failed' : payment.status === 'captured' ? 'charge.captured' : 'subscription.charged',
        payload: `${payment.id} · AED ${Number(payment.amount ?? 0).toFixed(2)}`,
        level: payment.status === 'failed' ? 'error' : payment.status === 'pending' ? 'warning' : 'info',
      }));
  }, [payments]);

  const gatewaysOnline = gateways.filter((gateway) => gateway.status === 'operational').length;
  const webhookSuccess = payments.length ? (payments.filter((payment) => payment.status === 'captured').length / payments.length) * 100 : 0;
  const volume24h = payments.reduce((sum, payment) => sum + Number(payment.amount ?? 0), 0);
  const alerts24h = payments.filter((payment) => payment.status === 'failed').length;

  return (
    <>
      <TopBar title="Gateway Logs" subtitle="Multi-gateway routing · webhooks & reconciliation" />
      <div className="px-6 py-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <KpiCard label="Gateways online" value={`${gatewaysOnline} / ${gateways.length}`} icon={Network} accent="primary" />
          <KpiCard label="Webhook success" value={`${webhookSuccess.toFixed(1)}%`} icon={Activity} accent="success" />
          <KpiCard label="Volume (24h)" value={`AED ${volume24h.toLocaleString()}`} icon={Network} accent="primary" />
          <KpiCard label="Alerts (24h)" value={alerts24h.toString()} icon={AlertTriangle} accent="warning" />
        </div>
        <Surface padded={false}>
          <div className="px-5 py-4 border-b border-border"><SectionTitle title="Gateway status"/></div>
          <div className="overflow-x-auto">
            <table className="w-full text-[12.5px] min-w-160">
              <thead className="bg-surface-muted text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
                <tr><th className="px-4 py-3 text-left">Gateway</th><th className="px-4 py-3 text-left">Region</th><th className="px-4 py-3 text-right">Uptime</th><th className="px-4 py-3 text-right">Volume (MTD)</th><th className="px-4 py-3 text-right">Success</th><th className="px-4 py-3 text-right">Status</th></tr>
              </thead>
              <tbody>
                {gateways.map(g => (
                  <tr key={g.name} className="border-t border-border hover:bg-surface-muted/60">
                    <td className="px-4 py-3 font-bold">{g.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{g.region}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{g.uptime}%</td>
                    <td className="px-4 py-3 text-right tabular-nums">AED {g.volume.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-bold">{g.success}%</td>
                    <td className="px-4 py-3 text-right"><StatusChip tone={g.status==="operational"?"success":"warning"}>{g.status}</StatusChip></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Surface>
        <Surface padded={false}>
          <div className="px-5 py-4 border-b border-border"><SectionTitle title="Recent events" sub="Live webhook feed"/></div>
          <div className="divide-y divide-border max-h-90 overflow-y-auto font-mono text-[11.5px]">
            {events.map((e, i) => (
              <div key={i} className="flex items-start gap-3 px-5 py-2.5">
                <span className="text-muted-foreground w-24 shrink-0">{e.ts}</span>
                <span className="w-24 shrink-0 font-bold text-foreground">{e.gw}</span>
                <span className={`w-44 shrink-0 ${e.level==="error"?"text-destructive font-bold":e.level==="warning"?"text-[oklch(0.55_0.16_60)]":"text-primary"}`}>{e.event}</span>
                <span className="flex-1 text-muted-foreground truncate">{e.payload}</span>
              </div>
            ))}
          </div>
        </Surface>
      </div>
    </>
  );
}

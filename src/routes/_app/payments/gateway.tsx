import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { Surface, SectionTitle } from "@/components/app/Surface";
import { KpiCard } from "@/components/app/KpiCard";
import { StatusChip } from "@/components/app/StatusChip";
import { Network, Activity, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/_app/payments/gateway")({ component: Page });

const GATEWAYS = [
  { name: "Network Intl", region: "UAE", uptime: 99.98, volume: 268420, success: 98.4, status: "operational" },
  { name: "Stripe", region: "EU", uptime: 99.94, volume: 84120, success: 96.8, status: "degraded" },
  { name: "Telr", region: "UAE", uptime: 99.99, volume: 32180, success: 99.1, status: "operational" },
  { name: "Apple Pay", region: "Global", uptime: 100, volume: 41820, success: 99.6, status: "operational" },
];

const EVENTS = [
  { ts: "Today 11:42", gw: "Stripe", event: "payment_intent.payment_failed", payload: "TXN-2026-9003 · card_declined", level: "error" },
  { ts: "Today 11:18", gw: "Network Intl", event: "charge.captured", payload: "TXN-2026-9002 · AED 273.00", level: "info" },
  { ts: "Today 10:48", gw: "Network Intl", event: "charge.captured", payload: "TXN-2026-9001 · AED 441.00", level: "info" },
  { ts: "Today 10:12", gw: "Stripe", event: "webhook.retry", payload: "delivery #4 · 2xx", level: "warning" },
  { ts: "Today 09:55", gw: "Telr", event: "subscription.charged", payload: "AP-2026-9185 · AED 152.25", level: "info" },
  { ts: "Today 09:11", gw: "Stripe", event: "payment_intent.payment_failed", payload: "TXN-2026-9006 · insufficient_funds", level: "error" },
];

function Page() {
  return (
    <>
      <TopBar title="Gateway Logs" subtitle="Multi-gateway routing · webhooks & reconciliation" />
      <div className="px-6 py-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <KpiCard label="Gateways online" value="3 / 4" icon={Network} accent="primary" />
          <KpiCard label="Webhook success" value="99.4%" delta={0.2} icon={Activity} accent="success" />
          <KpiCard label="Volume (24h)" value="AED 268,420" icon={Network} accent="primary" />
          <KpiCard label="Alerts (24h)" value="2" icon={AlertTriangle} accent="warning" />
        </div>
        <Surface padded={false}>
          <div className="px-5 py-4 border-b border-border"><SectionTitle title="Gateway status"/></div>
          <div className="overflow-x-auto">
            <table className="w-full text-[12.5px] min-w-[640px]">
              <thead className="bg-surface-muted text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
                <tr><th className="px-4 py-3 text-left">Gateway</th><th className="px-4 py-3 text-left">Region</th><th className="px-4 py-3 text-right">Uptime</th><th className="px-4 py-3 text-right">Volume (MTD)</th><th className="px-4 py-3 text-right">Success</th><th className="px-4 py-3 text-right">Status</th></tr>
              </thead>
              <tbody>
                {GATEWAYS.map(g => (
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
          <div className="divide-y divide-border max-h-[360px] overflow-y-auto font-mono text-[11.5px]">
            {EVENTS.map((e, i) => (
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

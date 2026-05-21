import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { Surface } from "@/components/app/Surface";
import { KpiCard } from "@/components/app/KpiCard";
import { StatusChip } from "@/components/app/StatusChip";
import { Repeat, Pause, Play, AlertTriangle } from "lucide-react";
import { CUSTOMERS, PLANS } from "@/lib/data";

export const Route = createFileRoute("/_app/subscriptions/active")({ component: Page });

const SUBS = CUSTOMERS.map((c, i) => ({
  id: `SUB-${20480 + i}`,
  customer: c.name,
  plan: c.plan,
  vehicles: c.vehicles,
  mrr: [420, 260, 1240, 840, 145, 260, 145, 260][i] ?? 260,
  nextRenewal: ["28 May","26 May","01 Jun","Paused","21 May","23 May","22 May","Cancelled"][i],
  status: c.status,
}));

const TONE = { active: "success", paused: "warning", "churn-risk": "danger", cancelled: "neutral" } as const;

function Page() {
  return (
    <>
      <TopBar title="Active Subscriptions" subtitle="1,624 active across 4 plans" />
      <div className="px-6 py-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <KpiCard label="Total active" value="1,624" delta={5.2} icon={Repeat} accent="success" />
          <KpiCard label="Paused" value="38" icon={Pause} accent="warning" />
          <KpiCard label="Churn-risk" value="142" delta={-8.4} icon={AlertTriangle} accent="warning" />
          <KpiCard label="Reactivated (MTD)" value="22" delta={11.1} icon={Play} accent="success" />
        </div>
        <Surface>
          <div className="grid gap-3 md:grid-cols-4">
            {PLANS.map(p => (
              <div key={p.id} className="rounded-xl border border-border bg-surface-muted/40 p-4">
                <div className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">{p.id}</div>
                <div className="mt-0.5 text-[14px] font-black">{p.name}</div>
                <div className="mt-2 text-[24px] font-black tabular-nums">{p.active}</div>
                <div className="text-[11px] text-muted-foreground">active subscriptions</div>
              </div>
            ))}
          </div>
        </Surface>
        <Surface padded={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-[12.5px] min-w-[720px]">
              <thead className="bg-surface-muted text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
                <tr><th className="px-4 py-3 text-left">Subscription</th><th className="px-4 py-3 text-left">Customer</th><th className="px-4 py-3 text-left">Plan</th><th className="px-4 py-3 text-right">Vehicles</th><th className="px-4 py-3 text-right">MRR</th><th className="px-4 py-3 text-left">Next renewal</th><th className="px-4 py-3 text-right">Status</th></tr>
              </thead>
              <tbody>
                {SUBS.map(s => (
                  <tr key={s.id} className="border-t border-border hover:bg-surface-muted/60">
                    <td className="px-4 py-3 font-mono font-bold">{s.id}</td>
                    <td className="px-4 py-3">{s.customer}</td>
                    <td className="px-4 py-3 font-bold">{s.plan}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{s.vehicles}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-bold">AED {s.mrr}</td>
                    <td className="px-4 py-3 text-muted-foreground">{s.nextRenewal}</td>
                    <td className="px-4 py-3 text-right"><StatusChip tone={TONE[s.status as keyof typeof TONE]}>{s.status}</StatusChip></td>
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

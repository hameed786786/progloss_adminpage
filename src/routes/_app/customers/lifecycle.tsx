import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { Surface, SectionTitle } from "@/components/app/Surface";
import { KpiCard } from "@/components/app/KpiCard";
import { Users, UserPlus, UserMinus, Heart, AlertTriangle } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/_app/customers/lifecycle")({ component: Page });

const STAGES = [
  { stage: "Lead", count: 482, pct: 100, color: "oklch(0.62 0.14 230)" },
  { stage: "Trial", count: 268, pct: 56, color: "oklch(0.55 0.16 258)" },
  { stage: "Active", count: 1378, pct: 88, color: "oklch(0.48 0.16 258)" },
  { stage: "Loyal (6mo+)", count: 821, pct: 60, color: "oklch(0.55 0.14 155)" },
  { stage: "Churn-risk", count: 142, pct: 10, color: "oklch(0.7 0.15 75)" },
  { stage: "Churned", count: 84, pct: 6, color: "oklch(0.6 0.18 25)" },
];

const COHORT = [
  { m: "Dec", retained: 92 }, { m: "Jan", retained: 88 }, { m: "Feb", retained: 85 },
  { m: "Mar", retained: 82 }, { m: "Apr", retained: 81 }, { m: "May", retained: 79 },
];

function Page() {
  return (
    <>
      <TopBar title="Customer Lifecycle" subtitle="Acquisition → activation → retention → churn" />
      <div className="px-6 py-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <KpiCard label="New customers (MTD)" value="142" delta={11.2} icon={UserPlus} accent="success" />
          <KpiCard label="Active customers" value="1,378" delta={4.1} icon={Users} accent="primary" />
          <KpiCard label="Churn-risk" value="142" delta={-8.4} icon={AlertTriangle} accent="warning" />
          <KpiCard label="Churned (MTD)" value="21" delta={-12.1} icon={UserMinus} accent="success" />
        </div>
        <div className="grid gap-4 xl:grid-cols-3">
          <Surface className="xl:col-span-2">
            <SectionTitle title="Lifecycle funnel" sub="Last 90 days" />
            <div className="space-y-3">
              {STAGES.map(s => (
                <div key={s.stage}>
                  <div className="flex items-center justify-between text-[12.5px] mb-1.5"><span className="font-bold">{s.stage}</span><span className="tabular-nums font-bold">{s.count.toLocaleString()}</span></div>
                  <div className="h-3 rounded-full bg-surface-muted overflow-hidden"><div className="h-full rounded-full" style={{ width: `${s.pct}%`, background: s.color }}/></div>
                </div>
              ))}
            </div>
          </Surface>
          <Surface>
            <SectionTitle title="6-month retention" sub="Cohort by signup month" />
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={COHORT} margin={{ left: -20, right: 0, top: 10 }}>
                <defs><linearGradient id="ret" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="oklch(0.55 0.14 155)" stopOpacity={0.4}/><stop offset="100%" stopColor="oklch(0.55 0.14 155)" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.93 0.008 250)" vertical={false}/>
                <XAxis dataKey="m" tick={{ fontSize: 11, fill: "oklch(0.52 0.02 256)" }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fontSize: 11, fill: "oklch(0.52 0.02 256)" }} axisLine={false} tickLine={false} domain={[60,100]}/>
                <Tooltip contentStyle={{ background: "white", border: "1px solid oklch(0.92 0.008 250)", borderRadius: 12, fontSize: 12 }}/>
                <Area type="monotone" dataKey="retained" stroke="oklch(0.55 0.14 155)" strokeWidth={2.5} fill="url(#ret)"/>
              </AreaChart>
            </ResponsiveContainer>
            <div className="mt-3 flex items-center justify-between rounded-xl bg-surface-muted/50 px-3 py-2 text-[12px]"><span className="text-muted-foreground">LTV / customer</span><span className="font-black flex items-center gap-1"><Heart className="h-3 w-3 text-primary"/>AED 6,840</span></div>
          </Surface>
        </div>
      </div>
    </>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { Surface, SectionTitle } from "@/components/app/Surface";
import { REVENUE_TREND, SUBSCRIPTION_GROWTH } from "@/lib/data";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Line, LineChart, PieChart, Pie, Cell } from "recharts";
import { useState } from "react";

export const Route = createFileRoute("/_app/analytics")({ component: Analytics });

const tabs = ["Revenue", "Customers", "Staff", "Subscriptions", "Apartments"];
const tooltipStyle = { background: "white", border: "1px solid oklch(0.92 0.008 250)", borderRadius: 12, fontSize: 12 };
const axis = { fontSize: 11, fill: "oklch(0.52 0.02 256)" };
const pieData = [
  { n: "Eco Weekly", v: 412, c: "oklch(0.62 0.14 230)" },
  { n: "Premium", v: 638, c: "oklch(0.48 0.16 258)" },
  { n: "Royal", v: 281, c: "oklch(0.55 0.21 25)" },
  { n: "Fleet", v: 47, c: "oklch(0.74 0.15 75)" },
];

function Analytics() {
  const [tab, setTab] = useState(0);
  return (
    <>
      <TopBar title="Analytics Hub" subtitle="Cross-module insights · May 2026 · UAE" actions={
        <button className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border bg-surface px-3 text-[12.5px] font-bold hover:bg-accent">Last 30 days</button>
      }/>
      <div className="px-6 py-6 space-y-4">
        <div className="flex items-center gap-1 rounded-xl border border-border bg-surface p-1 shadow-card w-fit">
          {tabs.map((t,i) => (
            <button key={t} onClick={() => setTab(i)} className={`rounded-lg px-3.5 py-1.5 text-[12.5px] font-bold ${tab === i ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>{t}</button>
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <Surface className="xl:col-span-2">
            <SectionTitle title={`${tabs[tab]} trend`} sub="Monthly · last 6 months" />
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={REVENUE_TREND}>
                <defs><linearGradient id="a" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="oklch(0.48 0.16 258)" stopOpacity={0.28}/><stop offset="100%" stopColor="oklch(0.48 0.16 258)" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.93 0.008 250)" vertical={false} />
                <XAxis dataKey="m" tick={axis} axisLine={false} tickLine={false} />
                <YAxis tick={axis} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="mrr" stroke="oklch(0.48 0.16 258)" strokeWidth={2.5} fill="url(#a)" />
              </AreaChart>
            </ResponsiveContainer>
          </Surface>
          <Surface>
            <SectionTitle title="Plan mix" sub="Subscriptions distribution" />
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} dataKey="v" nameKey="n" innerRadius={50} outerRadius={80} paddingAngle={2}>
                  {pieData.map((d,i) => <Cell key={i} fill={d.c} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 space-y-1.5 text-[12px]">
              {pieData.map(d => (
                <div key={d.n} className="flex items-center justify-between"><div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: d.c }}/>{d.n}</div><span className="tabular-nums font-bold">{d.v}</span></div>
              ))}
            </div>
          </Surface>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <Surface>
            <SectionTitle title="New vs churn" sub="Subscription movement" />
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={SUBSCRIPTION_GROWTH}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.93 0.008 250)" vertical={false} />
                <XAxis dataKey="m" tick={axis} axisLine={false} tickLine={false}/><YAxis tick={axis} axisLine={false} tickLine={false}/>
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="new" fill="oklch(0.48 0.16 258)" radius={[6,6,0,0]} maxBarSize={22}/>
                <Bar dataKey="churn" fill="oklch(0.55 0.21 25)" radius={[6,6,0,0]} maxBarSize={22}/>
              </BarChart>
            </ResponsiveContainer>
          </Surface>
          <Surface>
            <SectionTitle title="Churn rate" sub="Monthly %" />
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={REVENUE_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.93 0.008 250)" vertical={false} />
                <XAxis dataKey="m" tick={axis} axisLine={false} tickLine={false}/><YAxis tick={axis} axisLine={false} tickLine={false}/>
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="churn" stroke="oklch(0.55 0.21 25)" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </Surface>
        </div>
      </div>
    </>
  );
}

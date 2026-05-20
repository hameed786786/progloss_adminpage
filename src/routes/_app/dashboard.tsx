import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { KpiCard } from "@/components/app/KpiCard";
import { Surface, SectionTitle } from "@/components/app/Surface";
import { StatusChip } from "@/components/app/StatusChip";
import { Banknote, Users, Repeat, MessageSquareWarning, Car, AlertOctagon, UserCheck, Calendar, ArrowUpRight } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Line, LineChart } from "recharts";
import { REVENUE_TREND, SUBSCRIPTION_GROWTH, COMPLAINT_TREND, APARTMENTS, STAFF } from "@/lib/data";

export const Route = createFileRoute("/_app/dashboard")({ component: DashboardPage });

const chartAxis = { fontSize: 11, fill: "oklch(0.52 0.02 256)" };
const tooltipStyle = { background: "white", border: "1px solid oklch(0.92 0.008 250)", borderRadius: 12, fontSize: 12, boxShadow: "0 8px 24px -8px rgb(16 24 40 / 0.12)" };

function DashboardPage() {
  const onlineStaff = STAFF.filter(s => s.status !== "Offline").length;
  return (
    <>
      <TopBar
        title="Operations Overview"
        subtitle="Wednesday · 20 May 2026 · Dubai, UAE · All systems nominal"
        actions={
          <button className="hidden md:inline-flex h-9 items-center gap-1.5 rounded-xl border border-border bg-surface px-3 text-[13px] font-bold text-foreground shadow-card hover:bg-accent">
            <Calendar className="h-3.5 w-3.5" /> Last 30 days
          </button>
        }
      />
      <div className="px-6 py-6 space-y-6">
        {/* KPIs */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <KpiCard label="Monthly Recurring Revenue" value="AED 268,420" delta={8.4} icon={Banknote} accent="primary" hint="vs AED 247,180 last month" />
          <KpiCard label="Active Customers" value="1,378" delta={4.1} icon={Users} accent="primary" hint="142 new this month" />
          <KpiCard label="Active Subscriptions" value="1,624" delta={5.2} icon={Repeat} accent="success" hint="412 Eco · 638 Premium · 281 Royal · 47 Fleet" />
          <KpiCard label="Open Complaints" value="14" delta={-22.1} icon={MessageSquareWarning} accent="danger" hint="3 escalated · SLA breach: 1" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <KpiCard label="Cars Cleaned Today" value="847" delta={3.2} icon={Car} accent="primary" hint="92% on time" />
          <KpiCard label="Technicians Online" value={`${onlineStaff} / 94`} delta={1.1} icon={UserCheck} accent="success" hint="11 on break · 5 offline" />
          <KpiCard label="Renewals Due (7 days)" value="184" delta={6.8} icon={Calendar} accent="warning" hint="AED 48,920 expected" />
          <KpiCard label="Failed Payments (24h)" value="12" delta={-18.3} icon={AlertOctagon} accent="danger" hint="AED 3,148 to retry" />
        </div>

        {/* Revenue trend + Subscription growth */}
        <div className="grid gap-4 xl:grid-cols-3">
          <Surface className="xl:col-span-2">
            <SectionTitle
              title="Revenue trend"
              sub="Monthly recurring revenue · AED thousands"
              action={
                <div className="flex items-center gap-1 rounded-lg border border-border bg-surface-muted p-0.5 text-[11px] font-bold">
                  {["7D","30D","90D","12M"].map((t,i) => (
                    <button key={t} className={`px-2.5 py-1 rounded-md ${i===3 ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>{t}</button>
                  ))}
                </div>
              }
            />
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={REVENUE_TREND} margin={{ left: -10, right: 10, top: 10 }}>
                <defs>
                  <linearGradient id="mrr" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.48 0.16 258)" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="oklch(0.48 0.16 258)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.93 0.008 250)" vertical={false} />
                <XAxis dataKey="m" tick={chartAxis} axisLine={false} tickLine={false} />
                <YAxis tick={chartAxis} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="mrr" stroke="oklch(0.48 0.16 258)" strokeWidth={2.5} fill="url(#mrr)" />
              </AreaChart>
            </ResponsiveContainer>
          </Surface>

          <Surface>
            <SectionTitle title="Subscription growth" sub="New vs churned" />
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={SUBSCRIPTION_GROWTH} margin={{ left: -20, right: 0, top: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.93 0.008 250)" vertical={false} />
                <XAxis dataKey="m" tick={chartAxis} axisLine={false} tickLine={false} />
                <YAxis tick={chartAxis} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="new" fill="oklch(0.48 0.16 258)" radius={[6,6,0,0]} maxBarSize={18} />
                <Bar dataKey="churn" fill="oklch(0.55 0.21 25)" radius={[6,6,0,0]} maxBarSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </Surface>
        </div>

        {/* Apartment performance + Complaint trend + Live ops */}
        <div className="grid gap-4 xl:grid-cols-3">
          <Surface className="xl:col-span-2">
            <SectionTitle title="Apartment performance" sub="Top communities by MRR" action={
              <button className="inline-flex items-center gap-1 text-[12px] font-bold text-primary hover:underline">View all <ArrowUpRight className="h-3 w-3" /></button>
            }/>
            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full text-[12.5px]">
                <thead className="bg-surface-muted text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2.5 text-left">Community</th>
                    <th className="px-3 py-2.5 text-right">Vehicles</th>
                    <th className="px-3 py-2.5 text-right">Staff</th>
                    <th className="px-3 py-2.5 text-right">MRR</th>
                    <th className="px-3 py-2.5 text-right">Complaints</th>
                    <th className="px-3 py-2.5 text-right">Occupancy</th>
                  </tr>
                </thead>
                <tbody>
                  {APARTMENTS.map((a) => (
                    <tr key={a.name} className="border-t border-border hover:bg-surface-muted/60">
                      <td className="px-3 py-3 font-bold text-foreground">{a.name}</td>
                      <td className="px-3 py-3 text-right tabular-nums">{a.vehicles}</td>
                      <td className="px-3 py-3 text-right tabular-nums">{a.staff}</td>
                      <td className="px-3 py-3 text-right tabular-nums font-bold">AED {a.mrr.toLocaleString()}</td>
                      <td className="px-3 py-3 text-right">
                        {a.complaints === 0
                          ? <StatusChip tone="success">0</StatusChip>
                          : <StatusChip tone={a.complaints > 2 ? "danger" : "warning"}>{a.complaints}</StatusChip>}
                      </td>
                      <td className="px-3 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="h-1.5 w-16 rounded-full bg-surface-muted overflow-hidden">
                            <div className="h-full rounded-full bg-primary" style={{ width: `${a.occupancy}%` }} />
                          </div>
                          <span className="tabular-nums text-muted-foreground">{a.occupancy}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Surface>

          <Surface>
            <SectionTitle title="Complaint trend" sub="Last 7 days" />
            <ResponsiveContainer width="100%" height={140}>
              <LineChart data={COMPLAINT_TREND} margin={{ left: -20, right: 0, top: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.93 0.008 250)" vertical={false} />
                <XAxis dataKey="d" tick={chartAxis} axisLine={false} tickLine={false} />
                <YAxis tick={chartAxis} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="c" stroke="oklch(0.55 0.21 25)" strokeWidth={2.5} dot={{ r: 3, fill: "oklch(0.55 0.21 25)" }} />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2.5">
              {[
                { label: "Pending washes", val: "38", tone: "warning" as const },
                { label: "Delayed washes", val: "6", tone: "danger" as const },
                { label: "Support escalations", val: "3", tone: "danger" as const },
                { label: "Technicians active now", val: onlineStaff.toString(), tone: "success" as const },
              ].map((r) => (
                <div key={r.label} className="flex items-center justify-between rounded-xl border border-border bg-surface-muted/50 px-3 py-2.5">
                  <span className="text-[12.5px] text-foreground/80">{r.label}</span>
                  <StatusChip tone={r.tone}>{r.val}</StatusChip>
                </div>
              ))}
            </div>
          </Surface>
        </div>
      </div>
    </>
  );
}

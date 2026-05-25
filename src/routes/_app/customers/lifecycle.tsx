import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { Surface, SectionTitle } from "@/components/app/Surface";
import { KpiCard } from "@/components/app/KpiCard";
import { Users, UserPlus, UserMinus, Heart, AlertTriangle } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { fetchCustomers } from "@/lib/apiClient";
import useRealtime from "@/lib/useRealtime";

export const Route = createFileRoute("/_app/customers/lifecycle")({ component: Page });

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function parseSince(value?: string) {
  if (!value) return null;
  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) return parsed;

  const match = value.trim().match(/^([A-Za-z]{3,9})\s+(\d{4})$/);
  if (!match) return null;

  const monthIndex = MONTHS.findIndex((month) => month.toLowerCase() === match[1].slice(0, 3).toLowerCase());
  if (monthIndex === -1) return null;

  return new Date(Number(match[2]), monthIndex, 1);
}

function monthLabel(date: Date) {
  return date.toLocaleString(undefined, { month: "short" });
}

function monthStart(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function Page() {
  const customers = useRealtime('customers', fetchCustomers, 'customers:update');

  const metrics = useMemo(() => {
    const now = new Date();
    const monthKey = monthLabel(now);
    const monthStartDate = monthStart(now);
    const nextMonthStartDate = monthStart(new Date(now.getFullYear(), now.getMonth() + 1, 1));
    const previousMonthStartDate = monthStart(new Date(now.getFullYear(), now.getMonth() - 1, 1));
    const recentWindowStart = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const parsedCustomers = customers.map((customer) => ({
      ...customer,
      sinceDate: parseSince((customer as any).createdAt ?? (customer as any).since),
    }));
    const activeCustomers = parsedCustomers.filter((customer) => customer.status === 'active');
    const churnRiskCustomers = parsedCustomers.filter((customer) => customer.status === 'churn-risk' || customer.status === 'paused');
    const cancelledCustomers = parsedCustomers.filter((customer) => customer.status === 'cancelled');
    const currentMonthCustomers = parsedCustomers.filter((customer) => customer.sinceDate && customer.sinceDate >= monthStartDate && customer.sinceDate < nextMonthStartDate);
    const previousMonthCustomers = parsedCustomers.filter((customer) => customer.sinceDate && customer.sinceDate >= previousMonthStartDate && customer.sinceDate < monthStartDate);
    const newCustomersMTD = currentMonthCustomers.length;
    const churnedMTD = cancelledCustomers.filter((customer) => customer.sinceDate && customer.sinceDate >= monthStartDate && customer.sinceDate < nextMonthStartDate).length;
    const customerDelta = previousMonthCustomers.length
      ? ((newCustomersMTD - previousMonthCustomers.length) / previousMonthCustomers.length) * 100
      : newCustomersMTD > 0
        ? 100
        : 0;

    const monthlyCounts = new Map<string, number>();
    for (let i = 5; i >= 0; i -= 1) {
      const label = monthLabel(new Date(now.getFullYear(), now.getMonth() - i, 1));
      monthlyCounts.set(label, 0);
    }

    for (const customer of parsedCustomers) {
      if (!customer.sinceDate || customer.sinceDate < recentWindowStart) continue;
      const label = monthLabel(customer.sinceDate);
      if (monthlyCounts.has(label)) monthlyCounts.set(label, (monthlyCounts.get(label) ?? 0) + 1);
    }

    const peak = Math.max(...Array.from(monthlyCounts.values()), 1);
    const cohort = Array.from(monthlyCounts.entries()).map(([m, count]) => ({
      m,
      retained: Math.round((count / peak) * 100),
    }));

    const stages = [
      { stage: 'Lead', count: Math.max(parsedCustomers.length - activeCustomers.length - churnRiskCustomers.length - cancelledCustomers.length, 0), color: 'oklch(0.62 0.14 230)' },
      { stage: 'Trial', count: parsedCustomers.filter((customer) => customer.sinceDate && customer.sinceDate >= new Date(now.getFullYear(), now.getMonth() - 2, 1) && customer.status !== 'active').length, color: 'oklch(0.55 0.16 258)' },
      { stage: 'Active', count: activeCustomers.length, color: 'oklch(0.48 0.16 258)' },
      { stage: 'Loyal (6mo+)', count: activeCustomers.filter((customer) => customer.sinceDate && customer.sinceDate < new Date(now.getFullYear(), now.getMonth() - 6, 1)).length, color: 'oklch(0.55 0.14 155)' },
      { stage: 'Churn-risk', count: churnRiskCustomers.length, color: 'oklch(0.7 0.15 75)' },
      { stage: 'Churned', count: cancelledCustomers.length, color: 'oklch(0.6 0.18 25)' },
    ].map((item) => ({
      ...item,
      pct: item.count && parsedCustomers.length ? Math.max(6, Math.round((item.count / Math.max(activeCustomers.length, parsedCustomers.length)) * 100)) : 0,
    }));

    const averageLtv = parsedCustomers.length
      ? Math.round(parsedCustomers.reduce((sum, customer) => sum + Number((customer as any).ltv ?? 0), 0) / parsedCustomers.length)
      : 0;

    return {
      newCustomersMTD,
      activeCustomers: activeCustomers.length,
      churnRisk: churnRiskCustomers.length,
      churnedMTD,
      customerDelta,
      stages,
      cohort,
      averageLtv,
      monthKey,
      totalCustomers: parsedCustomers.length,
    };
  }, [customers]);

  return (
    <>
      <TopBar title="Customer Lifecycle" subtitle={`${metrics.totalCustomers} customers · ${metrics.activeCustomers} active · ${metrics.newCustomersMTD} new this month`} />
      <div className="px-6 py-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <KpiCard label="New customers (MTD)" value={metrics.newCustomersMTD.toString()} delta={metrics.customerDelta} icon={UserPlus} accent="success" hint="Compared with the previous month" />
          <KpiCard label="Active customers" value={metrics.activeCustomers.toString()} icon={Users} accent="primary" hint="Live backend customer count" />
          <KpiCard label="Churn-risk" value={metrics.churnRisk.toString()} icon={AlertTriangle} accent="warning" hint="Paused and churn-risk customers" />
          <KpiCard label="Churned (MTD)" value={metrics.churnedMTD.toString()} icon={UserMinus} accent="success" hint="Cancelled this month" />
        </div>
        <div className="grid gap-4 xl:grid-cols-3">
          <Surface className="xl:col-span-2">
            <SectionTitle title="Lifecycle funnel" sub="Last 90 days" />
            <div className="space-y-3">
              {metrics.stages.map(s => (
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
              <AreaChart data={metrics.cohort} margin={{ left: -20, right: 0, top: 10 }}>
                <defs><linearGradient id="ret" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="oklch(0.55 0.14 155)" stopOpacity={0.4}/><stop offset="100%" stopColor="oklch(0.55 0.14 155)" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.93 0.008 250)" vertical={false}/>
                <XAxis dataKey="m" tick={{ fontSize: 11, fill: "oklch(0.52 0.02 256)" }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fontSize: 11, fill: "oklch(0.52 0.02 256)" }} axisLine={false} tickLine={false} domain={[60,100]}/>
                <Tooltip contentStyle={{ background: "white", border: "1px solid oklch(0.92 0.008 250)", borderRadius: 12, fontSize: 12 }}/>
                <Area type="monotone" dataKey="retained" stroke="oklch(0.55 0.14 155)" strokeWidth={2.5} fill="url(#ret)"/>
              </AreaChart>
            </ResponsiveContainer>
            <div className="mt-3 flex items-center justify-between rounded-xl bg-surface-muted/50 px-3 py-2 text-[12px]"><span className="text-muted-foreground">LTV / customer</span><span className="font-black flex items-center gap-1"><Heart className="h-3 w-3 text-primary"/>AED {metrics.averageLtv.toLocaleString()}</span></div>
          </Surface>
        </div>
      </div>
    </>
  );
}

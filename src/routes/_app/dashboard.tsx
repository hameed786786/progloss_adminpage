import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { KpiCard } from "@/components/app/KpiCard";
import { Surface, SectionTitle } from "@/components/app/Surface";
import { StatusChip } from "@/components/app/StatusChip";
import { Banknote, Users, Repeat, MessageSquareWarning, Car, AlertOctagon, UserCheck, Calendar, ArrowUpRight } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Line, LineChart } from "recharts";
import { fetchCustomers, fetchInvoices, fetchPayments, fetchPlans, fetchStaff, fetchTickets } from "@/lib/apiClient";
import useRealtime from "@/lib/useRealtime";

export const Route = createFileRoute("/_app/dashboard")({ component: DashboardPage });

const chartAxis = { fontSize: 11, fill: "oklch(0.52 0.02 256)" };
const tooltipStyle = { background: "white", border: "1px solid oklch(0.92 0.008 250)", borderRadius: 12, fontSize: 12, boxShadow: "0 8px 24px -8px rgb(16 24 40 / 0.12)" };
const tabs = ["Revenue", "Customers", "Staff", "Subscriptions", "Apartments"];
const ranges = [
  { key: "D", label: "D" },
  { key: "30D", label: "30D" },
  { key: "90D", label: "90D" },
  { key: "12M", label: "12M" },
] as const;

type RangeKey = (typeof ranges)[number]["key"];

function parseDate(value: unknown) {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  const parsed = new Date(String(value));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function getRecordDate(record: any) {
  return parseDate(record?.date ?? record?.createdAt ?? record?.issuedAt ?? record?.created ?? record?.since);
}

function localDayKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatRangeLabel(range: RangeKey) {
  return range === "D" ? "Today" : range === "30D" ? "Last 30 days" : range === "90D" ? "Last 90 days" : "Last 12 months";
}

function getRangeWindow(range: RangeKey, previous = false) {
  const now = new Date();

  if (range === "12M") {
    const currentStart = new Date(now.getFullYear(), now.getMonth() - 11, 1);
    const previousStart = new Date(now.getFullYear(), now.getMonth() - 23, 1);
    return previous ? { start: previousStart, end: currentStart } : { start: currentStart, end: now };
  }

  const days = range === "D" ? 1 : range === "30D" ? 30 : 90;
  const currentStart = new Date(now);
  currentStart.setHours(0, 0, 0, 0);
  currentStart.setDate(now.getDate() - (days - 1));

  if (!previous) return { start: currentStart, end: now };

  const previousStart = new Date(currentStart);
  previousStart.setDate(currentStart.getDate() - days);
  return { start: previousStart, end: currentStart };
}

function isInWindow(date: Date, start: Date, end: Date) {
  return date >= start && date < end;
}

function buildRangeBuckets(range: RangeKey) {
  const now = new Date();

  if (range === "12M") {
    return Array.from({ length: 12 }, (_, idx) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (11 - idx), 1);
      return { key: `${date.getFullYear()}-${date.getMonth()}`, label: date.toLocaleString(undefined, { month: "short" }) };
    });
  }

  const days = range === "D" ? 1 : range === "30D" ? 30 : 90;
  return Array.from({ length: days }, (_, idx) => {
    const date = new Date(now);
    date.setHours(0, 0, 0, 0);
    date.setDate(now.getDate() - (days - 1 - idx));
    return {
      key: localDayKey(date),
      label: days === 1 ? "Today" : date.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    };
  });
}

function monthBuckets(monthsBack: number) {
  const now = new Date();
  return Array.from({ length: monthsBack }, (_, idx) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (monthsBack - 1 - idx), 1);
    return { key: `${date.getFullYear()}-${date.getMonth()}`, label: date.toLocaleString(undefined, { month: "short" }) };
  });
}

function percentDelta(current: number, previous: number) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

function monthKeyOffset(offset: number) {
  const now = new Date();
  const date = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  return `${date.getFullYear()}-${date.getMonth()}`;
}

function DashboardPage() {
  const [tab, setTab] = useState(0);
  const [range, setRange] = useState<RangeKey>("12M");
  const customers = useRealtime("customers", fetchCustomers, "customers:update");
  const invoices = useRealtime("invoices", fetchInvoices, "invoices:update");
  const staff = useRealtime("staff", fetchStaff, "staff:update");
  const plans = useRealtime("plans", fetchPlans, "plans:update");
  const payments = useRealtime("payments", fetchPayments, "payments:update");
  const tickets = useRealtime("tickets", fetchTickets, "tickets:update");

  const liveCustomers = customers;
  const liveStaff = staff;
  const planPrices = new Map(plans.map((plan) => [plan.name, Number(plan.price ?? 0)]));
  const rangeWindow = useMemo(() => getRangeWindow(range), [range]);
  const previousWindow = useMemo(() => getRangeWindow(range, true), [range]);
  const rangeBuckets = useMemo(() => buildRangeBuckets(range), [range]);

  const currentCustomers = useMemo(
    () => liveCustomers.filter((customer) => isInWindow(getRecordDate(customer) ?? new Date(), rangeWindow.start, rangeWindow.end)),
    [liveCustomers, rangeWindow],
  );
  const previousCustomers = useMemo(
    () => liveCustomers.filter((customer) => isInWindow(getRecordDate(customer) ?? new Date(), previousWindow.start, previousWindow.end)),
    [liveCustomers, previousWindow],
  );
  const currentInvoices = useMemo(
    () => invoices.filter((invoice) => isInWindow(parseDate(invoice.date ?? invoice.createdAt ?? invoice.issuedAt) ?? new Date(), rangeWindow.start, rangeWindow.end)),
    [invoices, rangeWindow],
  );
  const previousInvoices = useMemo(
    () => invoices.filter((invoice) => isInWindow(parseDate(invoice.date ?? invoice.createdAt ?? invoice.issuedAt) ?? new Date(), previousWindow.start, previousWindow.end)),
    [invoices, previousWindow],
  );
  const currentPayments = useMemo(
    () => payments.filter((payment) => isInWindow(parseDate(payment.date ?? payment.createdAt ?? payment.issuedAt) ?? new Date(), rangeWindow.start, rangeWindow.end)),
    [payments, rangeWindow],
  );
  const previousPayments = useMemo(
    () => payments.filter((payment) => isInWindow(parseDate(payment.date ?? payment.createdAt ?? payment.issuedAt) ?? new Date(), previousWindow.start, previousWindow.end)),
    [payments, previousWindow],
  );
  const currentTickets = useMemo(
    () => tickets.filter((ticket) => isInWindow(getRecordDate(ticket) ?? new Date(), rangeWindow.start, rangeWindow.end)),
    [tickets, rangeWindow],
  );
  const currentStaff = liveStaff;

  const onlineStaff = currentStaff.filter((member) => member.status !== "Offline").length;
  const activeCustomers = liveCustomers.filter((customer) => customer.status === "active").length;
  const activeCustomersPrevious = previousCustomers.filter((customer) => customer.status === "active").length;
  const activeSubscriptions = liveCustomers.filter((customer) => customer.status !== "cancelled").length;
  const activeSubscriptionsPrevious = previousCustomers.filter((customer) => customer.status !== "cancelled").length;
  const renewalsDue = liveCustomers.filter((customer) => customer.status === "active" && /(weekly|bi-weekly)/i.test(customer.plan ?? "")).length;
  const mrr = liveCustomers.reduce((sum, customer) => sum + (planPrices.get(customer.plan ?? "") ?? 0), 0);
  const mrrPrevious = previousCustomers.reduce((sum, customer) => sum + (planPrices.get(customer.plan ?? "") ?? 0), 0);

  const monthlyRevenue = useMemo(() => {
    const map = new Map(rangeBuckets.map((bucket) => [bucket.key, 0] as const));
    for (const invoice of currentInvoices) {
      const date = parseDate(invoice.date ?? invoice.createdAt ?? invoice.issuedAt) ?? new Date();
      const key = range === "12M" ? `${date.getFullYear()}-${date.getMonth()}` : localDayKey(date);
      if (map.has(key)) map.set(key, (map.get(key) ?? 0) + Number(invoice.total ?? 0));
    }
    return rangeBuckets.map((bucket) => ({ m: bucket.label, mrr: Math.round((map.get(bucket.key) ?? 0) / 1000) }));
  }, [currentInvoices, range, rangeBuckets]);

  const customerGrowth = useMemo(() => {
    const map = new Map(rangeBuckets.map((bucket) => [bucket.key, 0] as const));
    for (const customer of currentCustomers) {
      const date = getRecordDate(customer) ?? new Date();
      const key = range === "12M" ? `${date.getFullYear()}-${date.getMonth()}` : localDayKey(date);
      if (map.has(key)) map.set(key, (map.get(key) ?? 0) + 1);
    }
    return rangeBuckets.map((bucket) => ({ m: bucket.label, value: map.get(bucket.key) ?? 0 }));
  }, [currentCustomers, range, rangeBuckets]);

  const subscriptionGrowth = useMemo(() => {
    const current = new Map(rangeBuckets.map((bucket) => [bucket.key, { added: 0, churned: 0 }] as const));
    for (const customer of currentCustomers) {
      const date = getRecordDate(customer) ?? new Date();
      const key = range === "12M" ? `${date.getFullYear()}-${date.getMonth()}` : localDayKey(date);
      if (current.has(key)) {
        const bucket = current.get(key)!;
        bucket.added += customer.status === "cancelled" ? 0 : 1;
        bucket.churned += customer.status === "cancelled" ? 1 : 0;
      }
    }
    return rangeBuckets.map((bucket) => {
      const bucketValue = current.get(bucket.key) ?? { added: 0, churned: 0 };
      return { m: bucket.label, new: bucketValue.added, churn: bucketValue.churned };
    });
  }, [currentCustomers, range, rangeBuckets]);

  const staffStatusData = useMemo(() => {
    const statuses = ["Available", "Cleaning", "En Route", "Break", "Offline"];
    return statuses.map((status) => ({ name: status, value: currentStaff.filter((member) => (member.status ?? "").toLowerCase() === status.toLowerCase()).length }));
  }, [currentStaff]);

  const apartmentRows = useMemo(() => {
    const communities = new Map<string, { name: string; vehicles: number; staff: number; mrr: number; complaints: number; occupancy: number }>();
    for (const customer of currentCustomers) {
      const name = customer.community ?? customer.apartment ?? customer.building ?? "Unassigned";
      const current = communities.get(name) ?? { name, vehicles: 0, staff: 0, mrr: 0, complaints: 0, occupancy: 0 };
      current.vehicles += 1;
      current.mrr += Number(planPrices.get(customer.plan ?? "") ?? 0);
      current.occupancy = Math.min(100, current.vehicles * 4);
      communities.set(name, current);
    }
    for (const member of currentStaff) {
      const name = member.community ?? member.zone ?? "Unassigned";
      const current = communities.get(name) ?? { name, vehicles: 0, staff: 0, mrr: 0, complaints: 0, occupancy: 0 };
      current.staff += 1;
      communities.set(name, current);
    }
    for (const ticket of currentTickets) {
      const name = ticket.community ?? ticket.apartment ?? ticket.building ?? "Unassigned";
      const current = communities.get(name) ?? { name, vehicles: 0, staff: 0, mrr: 0, complaints: 0, occupancy: 0 };
      current.complaints += ticket.status === "resolved" ? 0 : 1;
      communities.set(name, current);
    }
    return [...communities.values()].sort((a, b) => b.mrr - a.mrr).slice(0, 6);
  }, [currentCustomers, currentStaff, currentTickets, planPrices]);

  const currentOpenTickets = tickets.filter((ticket) => String(ticket.status ?? "").toLowerCase() !== "resolved").length;
  const urgentTickets = tickets.filter((ticket) => String(ticket.priority ?? "").toLowerCase() === "urgent" || String(ticket.status ?? "").toLowerCase() === "escalated").length;
  const pendingWashes = invoices.filter((invoice) => String(invoice.status ?? "").toLowerCase() === "pending").length;
  const delayedWashes = invoices.filter((invoice) => String(invoice.status ?? "").toLowerCase() === "overdue").length;
  const completedWashes = invoices.filter((invoice) => String(invoice.status ?? "").toLowerCase() === "paid").length;
  const completedWashesPrevious = previousInvoices.filter((invoice) => String(invoice.status ?? "").toLowerCase() === "paid").length;
  const failedPaymentsCurrent = currentPayments.filter((payment) => String(payment.status ?? "").toLowerCase() === "failed").length;
  const failedPaymentsPrevious = previousPayments.filter((payment) => String(payment.status ?? "").toLowerCase() === "failed").length;
  const activeCustomersCurrent = activeCustomers;
  const activeCustomersPreviousCount = activeCustomersPrevious;
  const activeSubscriptionsCurrent = activeSubscriptions;
  const activeSubscriptionsPreviousCount = activeSubscriptionsPrevious;
  const chartRangeLabel = formatRangeLabel(range);

  const currentChart = tab === 0 ? monthlyRevenue
    : tab === 1 ? customerGrowth
      : tab === 2 ? staffStatusData
        : tab === 3 ? subscriptionGrowth
          : apartmentRows.map((row) => ({ m: row.name, mrr: Math.round(row.mrr / 1000) }));

  const chartTitle = tabs[tab];
  const chartSubtitle = tab === 0 ? `Revenue trend · ${chartRangeLabel}`
    : tab === 1 ? `Customer signups · ${chartRangeLabel}`
      : tab === 2 ? "Live staff status breakdown"
        : tab === 3 ? `New customers vs churned customers · ${chartRangeLabel}`
          : `Top communities by live MRR · ${chartRangeLabel}`;

  return (
    <>
      <TopBar
        title="Operations Overview"
        subtitle={`${activeCustomers || 0} live customers · ${currentOpenTickets || 0} open tickets · ${onlineStaff} staff online · ${chartRangeLabel}`}
        actions={
          <button className="hidden md:inline-flex h-9 items-center gap-1.5 rounded-xl border border-border bg-surface px-3 text-[13px] font-bold text-foreground shadow-card hover:bg-accent">
            <Calendar className="h-3.5 w-3.5" /> Live dashboard
          </button>
        }
      />
      <div className="px-6 py-6 space-y-6">
        <div className="flex items-center gap-1 rounded-xl border border-border bg-surface p-1 shadow-card w-fit">
          {tabs.map((label, index) => (
            <button key={label} onClick={() => setTab(index)} className={`rounded-lg px-3.5 py-1.5 text-[12.5px] font-bold ${tab === index ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              {label}
            </button>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <KpiCard label="Monthly Recurring Revenue" value={`AED ${mrr.toLocaleString()}`} delta={percentDelta(mrr, mrrPrevious)} icon={Banknote} accent="primary" hint={`Live pricing from active customers · ${chartRangeLabel}`} />
          <KpiCard label="Active Customers" value={activeCustomers.toLocaleString()} delta={percentDelta(activeCustomersCurrent, activeCustomersPreviousCount)} icon={Users} accent="primary" hint={`Live backend customer count · ${chartRangeLabel}`} />
          <KpiCard label="Active Subscriptions" value={activeSubscriptions.toLocaleString()} delta={percentDelta(activeSubscriptionsCurrent, activeSubscriptionsPreviousCount)} icon={Repeat} accent="success" hint={`Customers not marked cancelled · ${chartRangeLabel}`} />
          <KpiCard label="Open Complaints" value={currentOpenTickets.toString()} icon={MessageSquareWarning} accent="danger" hint="Tickets not yet resolved" />
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <KpiCard label="Cars Cleaned" value={completedWashes.toString()} delta={percentDelta(completedWashes, completedWashesPrevious)} icon={Car} accent="primary" hint={`Paid invoices completed · ${chartRangeLabel}`} />
          <KpiCard label="Technicians Online" value={`${onlineStaff} / ${liveStaff.length}`} icon={UserCheck} accent="success" hint="Live staff availability" />
          <KpiCard label="Renewals Due (7 days)" value={renewalsDue.toString()} delta={percentDelta(renewalsDue, Math.max(activeSubscriptions - renewalsDue, 1))} icon={Calendar} accent="warning" hint="Active weekly and bi-weekly plans" />
          <KpiCard label="Failed Payments (24h)" value={failedPaymentsCurrent.toString()} delta={percentDelta(failedPaymentsCurrent, failedPaymentsPrevious)} icon={AlertOctagon} accent="danger" hint="Backend payment failures" />
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <Surface className="xl:col-span-2">
            <SectionTitle
              title={`${chartTitle} trend`}
              sub={chartSubtitle}
              action={
                <div className="flex items-center gap-1 rounded-lg border border-border bg-surface-muted p-0.5 text-[11px] font-bold">
                  {ranges.map((value) => (
                    <button
                      key={value.key}
                      onClick={() => setRange(value.key)}
                      className={`px-2.5 py-1 rounded-md transition ${range === value.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      {value.label}
                    </button>
                  ))}
                </div>
              }
            />
            <ResponsiveContainer width="100%" height={260}>
              {tab === 1 ? (
                <BarChart data={currentChart} margin={{ left: -10, right: 10, top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.93 0.008 250)" vertical={false} />
                  <XAxis dataKey="m" tick={chartAxis} axisLine={false} tickLine={false} />
                  <YAxis tick={chartAxis} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="value" fill="oklch(0.48 0.16 258)" radius={[6, 6, 0, 0]} maxBarSize={24} />
                </BarChart>
              ) : tab === 2 ? (
                <BarChart data={currentChart} margin={{ left: -10, right: 10, top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.93 0.008 250)" vertical={false} />
                  <XAxis dataKey="name" tick={chartAxis} axisLine={false} tickLine={false} />
                  <YAxis tick={chartAxis} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="value" fill="oklch(0.48 0.16 258)" radius={[6, 6, 0, 0]} maxBarSize={24} />
                </BarChart>
              ) : tab === 3 ? (
                <BarChart data={currentChart} margin={{ left: -10, right: 10, top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.93 0.008 250)" vertical={false} />
                  <XAxis dataKey="m" tick={chartAxis} axisLine={false} tickLine={false} />
                  <YAxis tick={chartAxis} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="new" fill="oklch(0.48 0.16 258)" radius={[6, 6, 0, 0]} maxBarSize={18} />
                  <Bar dataKey="churn" fill="oklch(0.55 0.21 25)" radius={[6, 6, 0, 0]} maxBarSize={18} />
                </BarChart>
              ) : tab === 4 ? (
                <BarChart data={currentChart} margin={{ left: -10, right: 10, top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.93 0.008 250)" vertical={false} />
                  <XAxis dataKey="m" tick={chartAxis} axisLine={false} tickLine={false} interval={0} />
                  <YAxis tick={chartAxis} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="mrr" fill="oklch(0.48 0.16 258)" radius={[6, 6, 0, 0]} maxBarSize={18} />
                </BarChart>
              ) : (
                <AreaChart data={currentChart} margin={{ left: -10, right: 10, top: 10 }}>
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
              )}
            </ResponsiveContainer>
          </Surface>

          <Surface>
            <SectionTitle title="Complaint trend" sub="Live operational counts" />
            <ResponsiveContainer width="100%" height={140}>
              <LineChart
                data={[
                  { d: "Open", c: currentOpenTickets },
                  { d: "Escalated", c: urgentTickets },
                  { d: "Pending", c: pendingWashes },
                  { d: "Delayed", c: delayedWashes },
                ]}
                margin={{ left: -20, right: 0, top: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.93 0.008 250)" vertical={false} />
                <XAxis dataKey="d" tick={chartAxis} axisLine={false} tickLine={false} />
                <YAxis tick={chartAxis} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="c" stroke="oklch(0.55 0.21 25)" strokeWidth={2.5} dot={{ r: 3, fill: "oklch(0.55 0.21 25)" }} />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2.5">
              {[
                { label: "Pending washes", val: pendingWashes.toString(), tone: "warning" as const },
                { label: "Delayed washes", val: delayedWashes.toString(), tone: "danger" as const },
                { label: "Support escalations", val: urgentTickets.toString(), tone: "danger" as const },
                { label: "Technicians active now", val: onlineStaff.toString(), tone: "success" as const },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-xl border border-border bg-surface-muted/50 px-3 py-2.5">
                  <span className="text-[12.5px] text-foreground/80">{item.label}</span>
                  <StatusChip tone={item.tone}>{item.val}</StatusChip>
                </div>
              ))}
            </div>
          </Surface>
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <Surface className="xl:col-span-2">
            <SectionTitle title="Apartment performance" sub="Top communities by MRR" action={<button className="inline-flex items-center gap-1 text-[12px] font-bold text-primary hover:underline">View all <ArrowUpRight className="h-3 w-3" /></button>} />
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
                  {apartmentRows.map((row) => (
                    <tr key={row.name} className="border-t border-border hover:bg-surface-muted/60">
                      <td className="px-3 py-3 font-bold text-foreground">{row.name}</td>
                      <td className="px-3 py-3 text-right tabular-nums">{row.vehicles}</td>
                      <td className="px-3 py-3 text-right tabular-nums">{row.staff}</td>
                      <td className="px-3 py-3 text-right tabular-nums font-bold">AED {row.mrr.toLocaleString()}</td>
                      <td className="px-3 py-3 text-right">
                        {row.complaints === 0 ? <StatusChip tone="success">0</StatusChip> : <StatusChip tone={row.complaints > 2 ? "danger" : "warning"}>{row.complaints}</StatusChip>}
                      </td>
                      <td className="px-3 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-surface-muted">
                            <div className="h-full rounded-full bg-primary" style={{ width: `${row.occupancy}%` }} />
                          </div>
                          <span className="tabular-nums text-muted-foreground">{row.occupancy}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Surface>
        </div>
      </div>
    </>
  );
}

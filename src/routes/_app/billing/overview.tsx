import { useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { Surface, SectionTitle } from "@/components/app/Surface";
import { StatusChip } from "@/components/app/StatusChip";
import { Banknote, FileText, AlertOctagon, Undo2, Download, Filter, MoreHorizontal } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { fetchInvoices } from "@/lib/apiClient";
import { exportToCsv } from '@/lib/csv';
import useRealtime from "@/lib/useRealtime";

export const Route = createFileRoute("/_app/billing/overview")({ component: BillingOverview });

const STATUS: Record<string, "success"|"warning"|"danger"|"neutral"> = {
  paid: "success", pending: "warning", overdue: "danger", failed: "danger", refunded: "neutral",
};

function parseInvoiceDate(date?: string) {
  if (!date) return null;
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function buildCashflow(rows: any[]) {
  const now = new Date();
  const days = Array.from({ length: 7 }, (_, index) => {
    const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (6 - index));
    return { key: day.toISOString().slice(0, 10), d: day.toLocaleDateString(undefined, { day: '2-digit' }), v: 0 };
  });

  for (const invoice of rows) {
    const parsed = parseInvoiceDate(invoice.date ?? invoice.createdAt ?? invoice.issuedAt);
    if (!parsed) continue;
    const key = parsed.toISOString().slice(0, 10);
    const match = days.find((entry) => entry.key === key);
    if (match) match.v += Number(invoice.total ?? 0);
  }

  return days.map(({ d, v }) => ({ d, v: Number((v / 1000).toFixed(1)) }));
}

function currentMonthRows(rows: any[]) {
  const now = new Date();
  return rows.filter((invoice) => {
    const parsed = parseInvoiceDate(invoice.date ?? invoice.createdAt ?? invoice.issuedAt);
    return parsed ? parsed.getFullYear() === now.getFullYear() && parsed.getMonth() === now.getMonth() : false;
  });
}

function BillingOverview() {
  const rows = useRealtime('invoices', fetchInvoices, 'invoices:update');
  const monthRows = currentMonthRows(rows);
  const invoiced = monthRows.reduce((sum, invoice) => sum + Number(invoice.total ?? 0), 0);
  const collected = monthRows.filter((invoice) => invoice.status === "paid").reduce((sum, invoice) => sum + Number(invoice.total ?? 0), 0);
  const failedOverdue = monthRows.filter((invoice) => ["failed", "overdue", "pending"].includes(invoice.status)).reduce((sum, invoice) => sum + Number(invoice.total ?? 0), 0);
  const refunds = monthRows.filter((invoice) => invoice.status === "refunded").reduce((sum, invoice) => sum + Number(invoice.total ?? 0), 0);
  const collectionRate = invoiced ? (collected / invoiced) * 100 : 0;
  const cashflow = useMemo(() => buildCashflow(rows), [rows]);
  const vatCollected = monthRows.reduce((sum, invoice) => sum + Number(invoice.vat ?? 0), 0);
  const taxableSales = monthRows.reduce((sum, invoice) => sum + Number(invoice.subtotal ?? 0), 0);
  const currentMonthLabel = new Date().toLocaleString(undefined, { month: 'long', year: 'numeric' });
  const exemptSales = monthRows.filter((invoice) => Number(invoice.vat ?? 0) === 0).reduce((sum, invoice) => sum + Number(invoice.total ?? 0), 0);
  const currentQuarter = `Q${Math.floor(new Date().getMonth() / 3) + 1} ${new Date().getFullYear()}`;
  const kpis = useMemo(() => ([
    { l: "Invoiced (MTD)", v: `AED ${invoiced.toLocaleString()}`, d: `${rows.length} invoices`, i: FileText, t: "primary" as const },
    { l: "Collected", v: `AED ${collected.toLocaleString()}`, d: `${collectionRate.toFixed(1)}% collection rate`, i: Banknote, t: "success" as const },
    { l: "Failed / Overdue", v: `AED ${failedOverdue.toLocaleString()}`, d: `${rows.filter((invoice) => ["failed", "overdue", "pending"].includes(invoice.status)).length} invoices · auto-retry on`, i: AlertOctagon, t: "danger" as const },
    { l: "Refunds (MTD)", v: `AED ${refunds.toLocaleString()}`, d: `${rows.filter((invoice) => invoice.status === "refunded").length} refunds processed`, i: Undo2, t: "warning" as const },
  ]), [invoiced, collected, collectionRate, failedOverdue, refunds, rows.length]);
  const exportCsv = () => {
    const rowsData = (rows || []).map((i: any) => ({ id: i.id, customer: i.customer, plate: i.plate, plan: i.plan, total: Number(i.total ?? 0).toFixed(2), status: i.status, date: i.date }));
    if (!rowsData.length) return;
    exportToCsv(`invoices_export_${new Date().toISOString().slice(0,10)}.csv`, rowsData as any);
  };
  return (
    <>
      <TopBar title="Billing & VAT" subtitle={`Live cycle · AED ${invoiced.toLocaleString()} invoiced · ${collectionRate.toFixed(1)}% collected`} />
      <div className="px-6 py-6 space-y-4">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {kpis.map((k) => (
            <Surface key={k.l}>
              <div className="flex items-center justify-between">
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                  k.t === "primary" ? "bg-primary/10 text-primary"
                  : k.t === "success" ? "bg-[oklch(0.95_0.05_155)] text-[oklch(0.4_0.12_155)]"
                  : k.t === "danger" ? "bg-[oklch(0.96_0.04_25)] text-[oklch(0.45_0.18_25)]"
                  : "bg-[oklch(0.97_0.06_75)] text-[oklch(0.45_0.13_60)]"
                }`}><k.i className="h-4 w-4" /></div>
              </div>
              <div className="mt-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{k.l}</div>
              <div className="mt-0.5 text-[22px] font-black tracking-tight">{k.v}</div>
              <div className="mt-1 text-[11.5px] text-muted-foreground">{k.d}</div>
            </Surface>
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <Surface className="xl:col-span-2">
            <SectionTitle title={`Cashflow · ${currentMonthLabel}`} sub="Daily invoiced volume · AED thousands" />
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={cashflow} margin={{ left: -10, right: 10, top: 10 }}>
                <defs><linearGradient id="cf" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.48 0.16 258)" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="oklch(0.48 0.16 258)" stopOpacity={0} />
                </linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.93 0.008 250)" vertical={false} />
                <XAxis dataKey="d" tick={{ fontSize: 11, fill: "oklch(0.52 0.02 256)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "oklch(0.52 0.02 256)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "white", border: "1px solid oklch(0.92 0.008 250)", borderRadius: 12, fontSize: 12 }} />
                <Area type="monotone" dataKey="v" stroke="oklch(0.48 0.16 258)" strokeWidth={2.5} fill="url(#cf)" />
              </AreaChart>
            </ResponsiveContainer>
          </Surface>

          <Surface>
            <SectionTitle title="VAT 5% summary" sub="UAE Federal Tax Authority" />
            <div className="space-y-3 text-[12.5px]">
              {[
                { l: "Taxable sales", v: `AED ${taxableSales.toLocaleString()}` },
                { l: "Output VAT", v: `AED ${vatCollected.toLocaleString()}`, b: true },
                { l: "Zero-rated", v: `AED ${monthRows.filter((invoice) => invoice.vat === 0).reduce((sum, invoice) => sum + Number(invoice.total ?? 0), 0).toLocaleString()}` },
                { l: "Exempt", v: `AED ${exemptSales.toLocaleString()}` },
                { l: "Recoverable VAT", v: `AED ${Math.round(vatCollected * 0.14).toLocaleString()}` },
              ].map((r,i) => (
                <div key={i} className={`flex items-center justify-between rounded-xl ${r.b ? "bg-primary/8 px-3 py-2.5" : "px-3 py-1"}`}>
                  <span className={r.b ? "font-bold text-foreground" : "text-muted-foreground"}>{r.l}</span>
                  <span className={`tabular-nums ${r.b ? "font-black text-primary" : "font-bold"}`}>{r.v}</span>
                </div>
              ))}
              <button className="mt-2 w-full rounded-xl bg-primary py-2.5 text-[12.5px] font-bold text-primary-foreground hover:bg-primary/90">Generate {currentQuarter} VAT return</button>
            </div>
          </Surface>
        </div>

        <Surface padded={false}>
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <div className="text-[14px] font-black tracking-tight">Latest invoices</div>
              <div className="text-[11.5px] text-muted-foreground">Live cycle · {rows.length} most recent</div>
            </div>
            <div className="flex items-center gap-2">
              <button className="inline-flex items-center gap-1 rounded-xl border border-border bg-surface px-3 py-1.5 text-[12px] font-bold hover:bg-accent"><Filter className="h-3 w-3" /> Filter</button>
              <button onClick={exportCsv} className="inline-flex items-center gap-1 rounded-xl border border-border bg-surface px-3 py-1.5 text-[12px] font-bold hover:bg-accent"><Download className="h-3 w-3" /> Export</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[12.5px]">
              <thead className="bg-surface-muted/40 text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5 text-left">Invoice</th>
                  <th className="px-4 py-2.5 text-left">Customer</th>
                  <th className="px-4 py-2.5 text-left">Plate</th>
                  <th className="px-4 py-2.5 text-left">Plan</th>
                  <th className="px-4 py-2.5 text-right">Subtotal</th>
                  <th className="px-4 py-2.5 text-right">VAT 5%</th>
                  <th className="px-4 py-2.5 text-right">Total</th>
                  <th className="px-4 py-2.5 text-left">Status</th>
                  <th className="px-4 py-2.5"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((i) => (
                  <tr key={i.id} className="border-t border-border hover:bg-surface-muted/40">
                    <td className="px-4 py-3"><Link to="/billing/invoices/$id" params={{id: i.id}} className="font-bold text-primary hover:underline">{i.id}</Link></td>
                    <td className="px-4 py-3">{i.customer}</td>
                    <td className="px-4 py-3 font-mono text-[11.5px] text-muted-foreground">{i.plate}</td>
                    <td className="px-4 py-3">{i.plan}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{i.subtotal.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">{i.vat.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-bold">{i.total.toFixed(2)}</td>
                    <td className="px-4 py-3"><StatusChip tone={STATUS[i.status]}>{i.status}</StatusChip></td>
                    <td className="px-4 py-3 text-right"><MoreHorizontal className="h-4 w-4 text-muted-foreground" /></td>
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

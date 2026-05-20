import { createFileRoute, Link } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { Surface, SectionTitle } from "@/components/app/Surface";
import { StatusChip } from "@/components/app/StatusChip";
import { INVOICES } from "@/lib/data";
import { Banknote, FileText, AlertOctagon, Undo2, Download, Filter, MoreHorizontal } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/_app/billing/overview")({ component: BillingOverview });

const data = [
  { d: "01", v: 8.4 }, { d: "05", v: 12.1 }, { d: "08", v: 9.8 }, { d: "12", v: 14.2 },
  { d: "15", v: 16.4 }, { d: "18", v: 13.9 }, { d: "20", v: 18.2 },
];

const STATUS: Record<string, "success"|"warning"|"danger"|"neutral"> = {
  paid: "success", pending: "warning", overdue: "danger", failed: "danger", refunded: "neutral",
};

function BillingOverview() {
  return (
    <>
      <TopBar title="Billing & VAT" subtitle="May 2026 cycle · AED 268,420 invoiced · 94.2% collected" />
      <div className="px-6 py-6 space-y-4">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { l: "Invoiced (MTD)", v: "AED 268,420", d: "1,624 invoices", i: FileText, t: "primary" as const },
            { l: "Collected", v: "AED 252,718", d: "94.2% collection rate", i: Banknote, t: "success" as const },
            { l: "Failed / Overdue", v: "AED 11,420", d: "12 invoices · auto-retry on", i: AlertOctagon, t: "danger" as const },
            { l: "Refunds (MTD)", v: "AED 4,282", d: "8 refunds processed", i: Undo2, t: "warning" as const },
          ].map((k) => (
            <Surface key={k.l}>
              <div className="flex items-center justify-between">
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                  k.t === "primary" ? "bg-primary/10 text-primary"
                  : k.t === "success" ? "bg-[color:oklch(0.95_0.05_155)] text-[color:oklch(0.4_0.12_155)]"
                  : k.t === "danger" ? "bg-[color:oklch(0.96_0.04_25)] text-[color:oklch(0.45_0.18_25)]"
                  : "bg-[color:oklch(0.97_0.06_75)] text-[color:oklch(0.45_0.13_60)]"
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
            <SectionTitle title="Cashflow · May 2026" sub="Daily invoiced volume · AED thousands" />
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={data} margin={{ left: -10, right: 10, top: 10 }}>
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
                { l: "Taxable sales", v: "AED 256,140" },
                { l: "Output VAT", v: "AED 12,807", b: true },
                { l: "Zero-rated", v: "AED 12,280" },
                { l: "Exempt", v: "AED 0" },
                { l: "Recoverable VAT", v: "AED 1,948" },
              ].map((r,i) => (
                <div key={i} className={`flex items-center justify-between rounded-xl ${r.b ? "bg-primary/8 px-3 py-2.5" : "px-3 py-1"}`}>
                  <span className={r.b ? "font-bold text-foreground" : "text-muted-foreground"}>{r.l}</span>
                  <span className={`tabular-nums ${r.b ? "font-black text-primary" : "font-bold"}`}>{r.v}</span>
                </div>
              ))}
              <button className="mt-2 w-full rounded-xl bg-primary py-2.5 text-[12.5px] font-bold text-primary-foreground hover:bg-primary/90">Generate Q2 2026 VAT return</button>
            </div>
          </Surface>
        </div>

        <Surface padded={false}>
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <div className="text-[14px] font-black tracking-tight">Latest invoices</div>
              <div className="text-[11.5px] text-muted-foreground">May cycle · {INVOICES.length} most recent</div>
            </div>
            <div className="flex items-center gap-2">
              <button className="inline-flex items-center gap-1 rounded-xl border border-border bg-surface px-3 py-1.5 text-[12px] font-bold hover:bg-accent"><Filter className="h-3 w-3" /> Filter</button>
              <button className="inline-flex items-center gap-1 rounded-xl border border-border bg-surface px-3 py-1.5 text-[12px] font-bold hover:bg-accent"><Download className="h-3 w-3" /> Export</button>
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
                {INVOICES.map((i) => (
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

import { createFileRoute, Link } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { Surface } from "@/components/app/Surface";
import { StatusChip } from "@/components/app/StatusChip";
import { fetchInvoices } from "@/lib/apiClient";
import { Filter, Download, Search, MoreHorizontal } from "lucide-react";
import { useState, useMemo } from 'react';
import { exportToCsv } from '@/lib/csv';
import { saveView } from '@/lib/views';
import useRealtime from "@/lib/useRealtime";

export const Route = createFileRoute("/_app/billing/invoices/")({ component: Invoices });

const STATUS: Record<string, "success" | "warning" | "danger" | "neutral"> = {
  paid: "success",
  pending: "warning",
  overdue: "danger",
  failed: "danger",
  refunded: "neutral",
};

function Invoices() {
  const invoices = useRealtime('invoices', fetchInvoices, 'invoices:update');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return invoices;
    const q = search.toLowerCase().trim();
    return invoices.filter((i: any) => ((i.id || '') + ' ' + (i.customer||'') + ' ' + (i.plate||'')).toLowerCase().includes(q));
  }, [invoices, search]);

  const exportCsv = () => {
    const rows = (filtered || []).map((i: any) => ({ id: i.id, customer: i.customer, community: i.community, plate: i.plate, plan: i.plan, total: Number(i.total ?? 0).toFixed(2), status: i.status, date: i.date }));
    if (!rows.length) return;
    exportToCsv(`invoices_export_${new Date().toISOString().slice(0,10)}.csv`, rows);
  };

  return (
    <>
      <TopBar title="Invoices" subtitle="All invoices across plans, fleets and one-off services" />
      <div className="px-6 py-6 space-y-4">
        <Surface padded={false}>
          <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-3">
              <div className="flex items-center gap-2 rounded-xl border border-border bg-surface-muted px-2.5 py-1.5 text-[12.5px]">
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Invoice #, customer, plate…" className="w-64 bg-transparent outline-none" />
            </div>
            {["All status", "Date range", "Plan", "Community"].map((f) => (
              <button key={f} className="rounded-xl border border-border bg-surface px-3 py-1.5 text-[12px] font-bold hover:bg-accent">{f}</button>
            ))}
            <div className="ml-auto flex items-center gap-2">
              <button onClick={() => saveView('invoices_views', 'manual-save', { search })} className="inline-flex items-center gap-1 rounded-xl border border-border bg-surface px-3 py-1.5 text-[12px] font-bold hover:bg-accent"><Filter className="h-3 w-3" /> Saved</button>
              <button onClick={exportCsv} className="inline-flex items-center gap-1 rounded-xl border border-border bg-surface px-3 py-1.5 text-[12px] font-bold hover:bg-accent"><Download className="h-3 w-3" /> Export</button>
            </div>
          </div>
          <table className="w-full text-[12.5px]">
            <thead className="bg-surface-muted/40 text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-2.5 text-left">Invoice</th>
                <th className="px-4 py-2.5 text-left">Customer</th>
                <th className="px-4 py-2.5 text-left">Community</th>
                <th className="px-4 py-2.5 text-left">Plate</th>
                <th className="px-4 py-2.5 text-left">Plan</th>
                <th className="px-4 py-2.5 text-right">VAT</th>
                <th className="px-4 py-2.5 text-right">Total</th>
                <th className="px-4 py-2.5 text-left">Status</th>
                <th className="px-4 py-2.5 text-left">Date</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((i) => (
                <tr key={i.id} className="border-t border-border hover:bg-surface-muted/40">
                  <td className="px-4 py-3"><Link to="/billing/invoices/$id" params={{ id: i.id }} className="font-bold text-primary hover:underline">{i.id}</Link></td>
                  <td className="px-4 py-3">{i.customer}</td>
                  <td className="px-4 py-3 text-muted-foreground">{i.community}</td>
                  <td className="px-4 py-3 font-mono text-[11.5px]">{i.plate}</td>
                  <td className="px-4 py-3">{i.plan}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">{Number(i.vat ?? 0).toFixed(2)}</td>
                  <td className="px-4 py-3 text-right tabular-nums font-bold">AED {Number(i.total ?? 0).toFixed(2)}</td>
                  <td className="px-4 py-3"><StatusChip tone={STATUS[i.status]}>{i.status}</StatusChip></td>
                  <td className="px-4 py-3 text-muted-foreground">{i.date}</td>
                  <td className="px-4 py-3 text-right"><MoreHorizontal className="h-4 w-4 text-muted-foreground" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Surface>
      </div>
    </>
  );
}

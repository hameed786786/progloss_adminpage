import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useMemo } from 'react';
import { TopBar } from "@/components/app/TopBar";
import { Surface, SectionTitle } from "@/components/app/Surface";
import { KpiCard } from "@/components/app/KpiCard";
import { StatusChip } from "@/components/app/StatusChip";
import { FileCheck2, Download } from "lucide-react";
import { exportToCsv } from '@/lib/csv';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { fetchInvoices } from "@/lib/apiClient";
import useRealtime from "@/lib/useRealtime";

export const Route = createFileRoute("/_app/billing/vat")({ component: Page });

function parseDate(value?: string) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function quarterLabel(date: Date) {
  return `Q${Math.floor(date.getMonth() / 3) + 1} ${date.getFullYear()}`;
}

function monthLabel(date: Date) {
  return date.toLocaleString(undefined, { month: "short" });
}

function Page() {
  const invoices = useRealtime('invoices', fetchInvoices, 'invoices:update');
  const quarters = useMemo(() => {
    const grouped = new Map<string, { q: string; net: number; vat: number; status: string }>();
    for (const invoice of invoices as any[]) {
      const parsed = parseDate(invoice.date ?? invoice.createdAt ?? invoice.issuedAt);
      if (!parsed) continue;
      const key = quarterLabel(parsed);
      const current = grouped.get(key) ?? { q: key, net: 0, vat: 0, status: 'Filed' };
      current.net += Number(invoice.subtotal ?? invoice.total ?? 0);
      current.vat += Number(invoice.vat ?? 0);
      grouped.set(key, current);
    }
    return [...grouped.values()].sort((a, b) => a.q.localeCompare(b.q)).slice(-4).reverse();
  }, [invoices]);

  const monthly = useMemo(() => {
    const now = new Date();
    const months = Array.from({ length: 6 }, (_, index) => new Date(now.getFullYear(), now.getMonth() - (5 - index), 1));
    return months.map((month) => {
      const rows = (invoices as any[]).filter((invoice) => {
        const parsed = parseDate(invoice.date ?? invoice.createdAt ?? invoice.issuedAt);
        return parsed ? parsed.getFullYear() === month.getFullYear() && parsed.getMonth() === month.getMonth() : false;
      });
      return {
        m: monthLabel(month),
        net: Math.round(rows.reduce((sum, invoice) => sum + Number(invoice.subtotal ?? invoice.total ?? 0), 0) / 1000),
        vat: Math.round(rows.reduce((sum, invoice) => sum + Number(invoice.vat ?? 0), 0) / 1000),
      };
    });
  }, [invoices]);

  const outputVat = invoices.reduce((sum, invoice) => sum + Number(invoice.vat ?? 0), 0);
  const inputVat = Math.round(outputVat * 0.16);
  const netPayable = outputVat - inputVat;
  const taxableSales = invoices.reduce((sum, invoice) => sum + Number(invoice.subtotal ?? invoice.total ?? 0), 0);

  const exportVat = useCallback(() => {
    const rows = quarters.map(q => ({ period: q.q, net: q.net, vat: q.vat, status: q.status }));
    exportToCsv(`vat201_export_${new Date().toISOString().slice(0,10)}.csv`, rows as any);
  }, [quarters]);
  return (
    <>
      <TopBar title="VAT Reports" subtitle="FTA-compliant · TRN 100437289100003 · Quarterly filings" actions={
        <button onClick={exportVat} className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-primary px-3 text-[12.5px] font-bold text-primary-foreground"><Download className="h-3.5 w-3.5"/> Export VAT 201</button>
      }/>
      <div className="px-6 py-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <KpiCard label="Output VAT (MTD)" value={`AED ${outputVat.toLocaleString()}`} icon={FileCheck2} accent="primary" />
          <KpiCard label="Input VAT (MTD)" value={`AED ${inputVat.toLocaleString()}`} icon={FileCheck2} accent="primary" />
          <KpiCard label="Net payable" value={`AED ${netPayable.toLocaleString()}`} icon={FileCheck2} accent="warning" />
          <KpiCard label="Next filing" value="28 Jun 2026" icon={FileCheck2} accent="primary" hint="VAT 201 · Q2" />
        </div>
        <div className="grid gap-4 xl:grid-cols-3">
          <Surface className="xl:col-span-2">
            <SectionTitle title="Output VAT trend" sub="AED thousands · 5% rate" />
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={monthly} margin={{ left: -10, right: 10, top: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.93 0.008 250)" vertical={false} />
                <XAxis dataKey="m" tick={{ fontSize: 11, fill: "oklch(0.52 0.02 256)" }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fontSize: 11, fill: "oklch(0.52 0.02 256)" }} axisLine={false} tickLine={false}/>
                <Tooltip contentStyle={{ background: "white", border: "1px solid oklch(0.92 0.008 250)", borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="vat" fill="oklch(0.48 0.16 258)" radius={[6,6,0,0]} maxBarSize={36}/>
              </BarChart>
            </ResponsiveContainer>
          </Surface>
          <Surface>
            <SectionTitle title="VAT breakdown · May" />
            <div className="space-y-2.5 text-[12.5px]">
              {[
                ["Standard-rated supplies (5%)", `AED ${taxableSales.toLocaleString()}`],
                ["Zero-rated supplies", `AED ${invoices.filter((invoice: any) => Number(invoice.vat ?? 0) === 0).reduce((sum: number, invoice: any) => sum + Number(invoice.total ?? 0), 0).toLocaleString()}`],
                ["Exempt supplies", "AED 0"],
                ["Output VAT collected", `AED ${outputVat.toLocaleString()}`],
                ["Recoverable input VAT", `AED ${inputVat.toLocaleString()}`],
              ].map(([k,v]) => (
                <div key={k} className="flex justify-between border-b border-border pb-2 last:border-0">
                  <span className="text-muted-foreground">{k}</span><span className="font-bold tabular-nums">{v}</span>
                </div>
              ))}
              <div className="flex justify-between pt-2 text-[14px] font-black"><span>Net VAT payable</span><span>AED {netPayable.toLocaleString()}</span></div>
            </div>
          </Surface>
        </div>
        <Surface padded={false}>
          <div className="px-5 py-4 border-b border-border"><SectionTitle title="Quarterly filings" sub="VAT 201 history" /></div>
          <table className="w-full text-[12.5px]">
            <thead className="bg-surface-muted text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground"><tr><th className="px-4 py-3 text-left">Period</th><th className="px-4 py-3 text-right">Net supplies</th><th className="px-4 py-3 text-right">VAT</th><th className="px-4 py-3 text-right">Status</th><th className="px-4 py-3 text-right"></th></tr></thead>
            <tbody>
              {quarters.map(q => (
                <tr key={q.q} className="border-t border-border hover:bg-surface-muted/60">
                  <td className="px-4 py-3 font-bold">{q.q}</td>
                  <td className="px-4 py-3 text-right tabular-nums">AED {q.net.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right tabular-nums font-bold">AED {q.vat.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right"><StatusChip tone="success">{q.status}</StatusChip></td>
                  <td className="px-4 py-3 text-right"><button className="text-[11px] font-bold text-primary hover:underline">Download</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Surface>
      </div>
    </>
  );
}

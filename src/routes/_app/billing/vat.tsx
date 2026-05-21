import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { Surface, SectionTitle } from "@/components/app/Surface";
import { KpiCard } from "@/components/app/KpiCard";
import { StatusChip } from "@/components/app/StatusChip";
import { FileCheck2, Download } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/_app/billing/vat")({ component: Page });

const QUARTERS = [
  { q: "Q1 2026", net: 712420, vat: 35621, status: "Filed" },
  { q: "Q4 2025", net: 668120, vat: 33406, status: "Filed" },
  { q: "Q3 2025", net: 621880, vat: 31094, status: "Filed" },
  { q: "Q2 2025", net: 588210, vat: 29410, status: "Filed" },
];

const MONTHLY = [
  { m: "Dec", net: 168, vat: 8.4 }, { m: "Jan", net: 184, vat: 9.2 },
  { m: "Feb", net: 198, vat: 9.9 }, { m: "Mar", net: 221, vat: 11.05 },
  { m: "Apr", net: 247, vat: 12.35 }, { m: "May", net: 268, vat: 13.4 },
];

function Page() {
  return (
    <>
      <TopBar title="VAT Reports" subtitle="FTA-compliant · TRN 100437289100003 · Quarterly filings" actions={
        <button className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-primary px-3 text-[12.5px] font-bold text-primary-foreground"><Download className="h-3.5 w-3.5"/> Export VAT 201</button>
      }/>
      <div className="px-6 py-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <KpiCard label="Output VAT (MTD)" value="AED 13,421" delta={8.4} icon={FileCheck2} accent="primary" />
          <KpiCard label="Input VAT (MTD)" value="AED 2,180" icon={FileCheck2} accent="primary" />
          <KpiCard label="Net payable" value="AED 11,241" delta={9.2} icon={FileCheck2} accent="warning" />
          <KpiCard label="Next filing" value="28 Jun 2026" icon={FileCheck2} accent="primary" hint="VAT 201 · Q2" />
        </div>
        <div className="grid gap-4 xl:grid-cols-3">
          <Surface className="xl:col-span-2">
            <SectionTitle title="Output VAT trend" sub="AED thousands · 5% rate" />
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={MONTHLY} margin={{ left: -10, right: 10, top: 10 }}>
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
                ["Standard-rated supplies (5%)", "AED 268,420"],
                ["Zero-rated supplies", "AED 8,120"],
                ["Exempt supplies", "AED 0"],
                ["Output VAT collected", "AED 13,421"],
                ["Recoverable input VAT", "AED 2,180"],
              ].map(([k,v]) => (
                <div key={k} className="flex justify-between border-b border-border pb-2 last:border-0">
                  <span className="text-muted-foreground">{k}</span><span className="font-bold tabular-nums">{v}</span>
                </div>
              ))}
              <div className="flex justify-between pt-2 text-[14px] font-black"><span>Net VAT payable</span><span>AED 11,241</span></div>
            </div>
          </Surface>
        </div>
        <Surface padded={false}>
          <div className="px-5 py-4 border-b border-border"><SectionTitle title="Quarterly filings" sub="VAT 201 history" /></div>
          <table className="w-full text-[12.5px]">
            <thead className="bg-surface-muted text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground"><tr><th className="px-4 py-3 text-left">Period</th><th className="px-4 py-3 text-right">Net supplies</th><th className="px-4 py-3 text-right">VAT</th><th className="px-4 py-3 text-right">Status</th><th className="px-4 py-3 text-right"></th></tr></thead>
            <tbody>
              {QUARTERS.map(q => (
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

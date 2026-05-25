import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { Surface } from "@/components/app/Surface";
import { KpiCard } from "@/components/app/KpiCard";
import { StatusChip } from "@/components/app/StatusChip";
import { FileMinus, Plus } from "lucide-react";
import { fetchCreditNotes } from "@/lib/apiClient";
import useRealtime from "@/lib/useRealtime";

export const Route = createFileRoute("/_app/billing/credit")({ component: Page });

function Page() {
  const notes = useRealtime('creditNotes', fetchCreditNotes, 'creditNotes:update');
  const issuedThisMonth = notes.length;
  const creditLiability = notes.filter((note: any) => note.status !== 'applied').reduce((sum: number, note: any) => sum + Number(note.total ?? 0), 0);
  const appliedYtd = notes.filter((note: any) => note.status === 'applied').reduce((sum: number, note: any) => sum + Number(note.total ?? 0), 0);
  const pending = notes.filter((note: any) => note.status === 'pending').length;
  const rows = useMemo(() => notes, [notes]);

  return (
    <>
      <TopBar title="Credit Notes" subtitle="Customer credit balance & ledger adjustments" actions={
        <button className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-primary px-3 text-[12.5px] font-bold text-primary-foreground"><Plus className="h-3.5 w-3.5"/> Issue credit note</button>
      }/>
      <div className="px-6 py-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <KpiCard label="Issued this month" value={issuedThisMonth.toString()} icon={FileMinus} accent="primary" />
          <KpiCard label="Credit liability" value={`AED ${creditLiability.toLocaleString()}`} icon={FileMinus} accent="warning" />
          <KpiCard label="Applied YTD" value={`AED ${appliedYtd.toLocaleString()}`} icon={FileMinus} accent="success" />
          <KpiCard label="Pending approval" value={pending.toString()} icon={FileMinus} accent="warning" />
        </div>
        <Surface padded={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-[12.5px] min-w-180">
              <thead className="bg-surface-muted text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left">Credit note</th>
                  <th className="px-4 py-3 text-left">Linked invoice</th>
                  <th className="px-4 py-3 text-left">Customer</th>
                  <th className="px-4 py-3 text-left">Reason</th>
                  <th className="px-4 py-3 text-right">Subtotal</th>
                  <th className="px-4 py-3 text-right">VAT 5%</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((n: any) => (
                  <tr key={n.id} className="border-t border-border hover:bg-surface-muted/60">
                    <td className="px-4 py-3 font-mono font-bold">{n.id}</td>
                    <td className="px-4 py-3 font-mono text-muted-foreground">{n.invoice}</td>
                    <td className="px-4 py-3">{n.customer}</td>
                    <td className="px-4 py-3 text-muted-foreground">{n.reason}</td>
                    <td className="px-4 py-3 text-right tabular-nums">AED {Number(n.amount ?? 0).toFixed(2)}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">AED {Number(n.vat ?? 0).toFixed(2)}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-bold">AED {Number(n.total ?? 0).toFixed(2)}</td>
                    <td className="px-4 py-3 text-right"><StatusChip tone={n.status==="applied"?"success":"warning"}>{n.status}</StatusChip></td>
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

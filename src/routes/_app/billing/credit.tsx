import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { Surface } from "@/components/app/Surface";
import { KpiCard } from "@/components/app/KpiCard";
import { StatusChip } from "@/components/app/StatusChip";
import { FileMinus, Plus } from "lucide-react";

export const Route = createFileRoute("/_app/billing/credit")({ component: Page });

const NOTES = [
  { id: "CN-2026-0118", invoice: "INV-2026-04814", customer: "Sophia Chen", reason: "Service downgrade", amount: 240.00, vat: 12.00, total: 252.00, issued: "12 May 2026", status: "applied" },
  { id: "CN-2026-0117", invoice: "INV-2026-04812", customer: "Maryam Al Hashimi", reason: "Goodwill credit", amount: 90.00, vat: 4.50, total: 94.50, issued: "11 May 2026", status: "applied" },
  { id: "CN-2026-0116", invoice: "INV-2026-04809", customer: "Omar Hourani", reason: "Plan correction", amount: 65.00, vat: 3.25, total: 68.25, issued: "09 May 2026", status: "pending" },
  { id: "CN-2026-0115", invoice: "INV-2026-04802", customer: "Hamdan Al Suwaidi", reason: "SLA breach compensation", amount: 200.00, vat: 10.00, total: 210.00, issued: "07 May 2026", status: "applied" },
];

function Page() {
  return (
    <>
      <TopBar title="Credit Notes" subtitle="Customer credit balance & ledger adjustments" actions={
        <button className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-primary px-3 text-[12.5px] font-bold text-primary-foreground"><Plus className="h-3.5 w-3.5"/> Issue credit note</button>
      }/>
      <div className="px-6 py-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <KpiCard label="Issued this month" value="18" icon={FileMinus} accent="primary" />
          <KpiCard label="Credit liability" value="AED 4,820" icon={FileMinus} accent="warning" />
          <KpiCard label="Applied YTD" value="AED 38,420" delta={12.1} icon={FileMinus} accent="success" />
          <KpiCard label="Pending approval" value="2" icon={FileMinus} accent="warning" />
        </div>
        <Surface padded={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-[12.5px] min-w-[720px]">
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
                {NOTES.map(n => (
                  <tr key={n.id} className="border-t border-border hover:bg-surface-muted/60">
                    <td className="px-4 py-3 font-mono font-bold">{n.id}</td>
                    <td className="px-4 py-3 font-mono text-muted-foreground">{n.invoice}</td>
                    <td className="px-4 py-3">{n.customer}</td>
                    <td className="px-4 py-3 text-muted-foreground">{n.reason}</td>
                    <td className="px-4 py-3 text-right tabular-nums">AED {n.amount.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">AED {n.vat.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-bold">AED {n.total.toFixed(2)}</td>
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

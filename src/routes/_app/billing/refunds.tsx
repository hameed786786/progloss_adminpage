import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { Surface } from "@/components/app/Surface";
import { KpiCard } from "@/components/app/KpiCard";
import { StatusChip } from "@/components/app/StatusChip";
import { Undo2, Plus } from "lucide-react";

export const Route = createFileRoute("/_app/billing/refunds")({ component: Page });

const REFUNDS = [
  { id: "REF-2026-0421", invoice: "INV-2026-04819", customer: "Tom Pereira", amount: 273.00, reason: "Cancellation within 24h", approver: "Layla Hassan", date: "Today 10:18", status: "completed" },
  { id: "REF-2026-0420", invoice: "INV-2026-04812", customer: "Maryam Al Hashimi", amount: 60.00, reason: "Partial · skipped wash", approver: "Layla Hassan", date: "Yesterday", status: "completed" },
  { id: "REF-2026-0419", invoice: "INV-2026-04805", customer: "Hamdan Al Suwaidi", amount: 720.00, reason: "Plan paused mid-cycle", approver: "Pending", date: "12 May", status: "pending" },
  { id: "REF-2026-0418", invoice: "INV-2026-04791", customer: "Sophia Chen", amount: 1240.00, reason: "Service defect", approver: "Rashid Al Mansoori", date: "11 May", status: "completed" },
  { id: "REF-2026-0417", invoice: "INV-2026-04780", customer: "Karim Boutros", amount: 130.00, reason: "Duplicate charge", approver: "System", date: "09 May", status: "completed" },
];

function Page() {
  return (
    <>
      <TopBar title="Refunds" subtitle="Issued refunds · reasons & audit trail" actions={
        <button className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-primary px-3 text-[12.5px] font-bold text-primary-foreground"><Plus className="h-3.5 w-3.5"/> Issue refund</button>
      }/>
      <div className="px-6 py-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <KpiCard label="Refunded (MTD)" value="AED 8,420" icon={Undo2} accent="primary" />
          <KpiCard label="Refunds count" value="22" delta={-8.1} icon={Undo2} accent="success" />
          <KpiCard label="Awaiting approval" value="3" icon={Undo2} accent="warning" />
          <KpiCard label="Refund rate" value="1.4%" delta={-0.3} icon={Undo2} accent="success" />
        </div>
        <Surface padded={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-[12.5px] min-w-[720px]">
              <thead className="bg-surface-muted text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
                <tr><th className="px-4 py-3 text-left">Refund ID</th><th className="px-4 py-3 text-left">Invoice</th><th className="px-4 py-3 text-left">Customer</th><th className="px-4 py-3 text-right">Amount</th><th className="px-4 py-3 text-left">Reason</th><th className="px-4 py-3 text-left">Approver</th><th className="px-4 py-3 text-left">Date</th><th className="px-4 py-3 text-right">Status</th></tr>
              </thead>
              <tbody>
                {REFUNDS.map(r => (
                  <tr key={r.id} className="border-t border-border hover:bg-surface-muted/60">
                    <td className="px-4 py-3 font-mono font-bold">{r.id}</td>
                    <td className="px-4 py-3 font-mono text-muted-foreground">{r.invoice}</td>
                    <td className="px-4 py-3">{r.customer}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-bold">AED {r.amount.toFixed(2)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.reason}</td>
                    <td className="px-4 py-3">{r.approver}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.date}</td>
                    <td className="px-4 py-3 text-right"><StatusChip tone={r.status==="completed"?"success":"warning"}>{r.status}</StatusChip></td>
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

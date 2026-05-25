import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { Surface } from "@/components/app/Surface";
import { KpiCard } from "@/components/app/KpiCard";
import { StatusChip } from "@/components/app/StatusChip";
import { Undo2, Plus } from "lucide-react";
import { fetchInvoices } from "@/lib/apiClient";
import useRealtime from "@/lib/useRealtime";

export const Route = createFileRoute("/_app/billing/refunds")({ component: Page });

function formatDate(value?: string) {
  if (!value) return "—";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleDateString(undefined, { day: "2-digit", month: "short" });
}

function Page() {
  const invoices = useRealtime('invoices', fetchInvoices, 'invoices:update');
  const refunds = invoices
    .filter((invoice: any) => invoice.status === 'refunded')
    .map((invoice: any, index: number) => ({
      id: `REF-${String(index + 1).padStart(4, '0')}`,
      invoice: invoice.id,
      customer: invoice.customer,
      amount: Number(invoice.total ?? 0),
      reason: invoice.reason ?? 'Refunded from invoice status',
      approver: invoice.approvedBy ?? 'Finance Admin',
      date: formatDate(invoice.date ?? invoice.refundedAt ?? invoice.updatedAt),
      status: 'completed',
    }));

  const refundedTotal = refunds.reduce((sum, refund) => sum + Number(refund.amount ?? 0), 0);
  const refundCount = refunds.length;
  const awaitingApproval = refunds.filter((refund) => refund.status === 'pending').length;
  const refundRate = invoices.length ? (refundCount / invoices.length) * 100 : 0;

  return (
    <>
      <TopBar title="Refunds" subtitle="Issued refunds · reasons & audit trail" actions={
        <button className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-primary px-3 text-[12.5px] font-bold text-primary-foreground"><Plus className="h-3.5 w-3.5"/> Issue refund</button>
      }/>
      <div className="px-6 py-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <KpiCard label="Refunded" value={`AED ${refundedTotal.toLocaleString()}`} icon={Undo2} accent="primary" />
          <KpiCard label="Refunds count" value={refundCount.toString()} icon={Undo2} accent="success" />
          <KpiCard label="Awaiting approval" value={awaitingApproval.toString()} icon={Undo2} accent="warning" />
          <KpiCard label="Refund rate" value={`${refundRate.toFixed(1)}%`} icon={Undo2} accent="success" />
        </div>
        <Surface padded={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-[12.5px] min-w-180">
              <thead className="bg-surface-muted text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
                <tr><th className="px-4 py-3 text-left">Refund ID</th><th className="px-4 py-3 text-left">Invoice</th><th className="px-4 py-3 text-left">Customer</th><th className="px-4 py-3 text-right">Amount</th><th className="px-4 py-3 text-left">Reason</th><th className="px-4 py-3 text-left">Approver</th><th className="px-4 py-3 text-left">Date</th><th className="px-4 py-3 text-right">Status</th></tr>
              </thead>
              <tbody>
                {refunds.map(r => (
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

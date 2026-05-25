import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { Surface } from "@/components/app/Surface";
import { StatusChip } from "@/components/app/StatusChip";
import { Filter, Download, MoreHorizontal } from "lucide-react";
import { exportToCsv } from '@/lib/csv';
import { fetchPayments } from "@/lib/apiClient";
import useRealtime from "@/lib/useRealtime";

export const Route = createFileRoute("/_app/payments/transactions")({ component: Transactions });

const STAT: Record<string, "success"|"warning"|"danger"> = { captured: "success", pending: "warning", failed: "danger" };

function Transactions() {
  const rows = useRealtime('payments', fetchPayments, 'payments:update');
  const total = (rows || []).filter((payment) => payment.status === "captured").reduce((sum, payment) => sum + Number(payment.amount ?? 0), 0);
  const exportCsv = () => {
    const rowsData = (rows || []).map((p: any) => ({ id: p.id, customer: p.customer, method: p.method, gateway: p.gateway, amount: Number(p.amount ?? 0).toFixed(2), status: p.status, date: p.date }));
    if (!rowsData.length) return;
    exportToCsv(`payments_export_${new Date().toISOString().slice(0,10)}.csv`, rowsData as any);
  };
  return (
    <>
      <TopBar title="Transactions" subtitle={`Today · ${rows?.length ?? 0} processed · AED ${total.toLocaleString()} captured`} />
      <div className="px-6 py-6">
        <Surface padded={false}>
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            {["All","Captured","Pending","Failed","Refunded"].map((t,i) => (
              <button key={t} className={`rounded-lg px-3 py-1.5 text-[12px] font-bold ${i===0 ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"}`}>{t}</button>
            ))}
            <div className="ml-auto flex gap-2">
              <button className="inline-flex items-center gap-1 rounded-xl border border-border bg-surface px-3 py-1.5 text-[12px] font-bold hover:bg-accent"><Filter className="h-3 w-3" /> Filter</button>
              <button onClick={exportCsv} className="inline-flex items-center gap-1 rounded-xl border border-border bg-surface px-3 py-1.5 text-[12px] font-bold hover:bg-accent"><Download className="h-3 w-3" /> Export</button>
            </div>
          </div>
          <table className="w-full text-[12.5px]">
            <thead className="bg-surface-muted/40 text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
              <tr><th className="px-4 py-2.5 text-left">Transaction</th><th className="px-4 py-2.5 text-left">Customer</th><th className="px-4 py-2.5 text-left">Method</th><th className="px-4 py-2.5 text-left">Gateway</th><th className="px-4 py-2.5 text-right">Amount</th><th className="px-4 py-2.5 text-left">Status</th><th className="px-4 py-2.5 text-left">Time</th><th className="px-4 py-2.5"></th></tr>
            </thead>
            <tbody>
              {(rows || []).map((p) => (
                <tr key={p.id} className="border-t border-border hover:bg-surface-muted/40">
                  <td className="px-4 py-3 font-mono text-[11.5px] font-bold">{p.id}</td>
                  <td className="px-4 py-3">{p.customer}</td>
                  <td className="px-4 py-3">{p.method}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.gateway}</td>
                  <td className="px-4 py-3 text-right tabular-nums font-bold">AED {Number(p.amount ?? 0).toFixed(2)}</td>
                  <td className="px-4 py-3"><StatusChip tone={STAT[p.status]}>{p.status}</StatusChip></td>
                  <td className="px-4 py-3 text-muted-foreground">{p.date}</td>
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

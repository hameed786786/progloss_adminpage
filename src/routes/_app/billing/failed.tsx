import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { Surface } from "@/components/app/Surface";
import { KpiCard } from "@/components/app/KpiCard";
import { StatusChip } from "@/components/app/StatusChip";
import { AlertOctagon, RefreshCcw, Mail } from "lucide-react";
import { fetchPayments } from "@/lib/apiClient";
import useRealtime from "@/lib/useRealtime";

export const Route = createFileRoute("/_app/billing/failed")({ component: Page });

const fetchPaymentsWrapper = async () => fetchPayments();

function Page() {
  const payments = useRealtime('payments', fetchPaymentsWrapper, 'payments:update');
  const failed = payments.filter((p: any) => p.status === 'failed' || p.status === 'retrying' || p.status === 'blocked');
  const failedAmount = failed.reduce((sum: number, payment: any) => sum + Number(payment.amount ?? 0), 0);
  const capturedAmount = payments.filter((payment: any) => payment.status === 'captured').reduce((sum: number, payment: any) => sum + Number(payment.amount ?? 0), 0);
  const recoveryRate = payments.length ? (payments.filter((payment: any) => payment.status === 'captured').length / payments.length) * 100 : 0;
  const recovered = payments.filter((payment: any) => payment.status === 'captured').reduce((sum: number, payment: any) => sum + Number(payment.amount ?? 0), 0);

  return (
    <>
      <TopBar title="Failed Payments" subtitle="Recover lost revenue · automatic dunning + manual retry" />
      <div className="px-6 py-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <KpiCard label="Failed payments" value={failed.length.toString()} icon={AlertOctagon} accent="danger" />
          <KpiCard label="At-risk revenue" value={`AED ${failedAmount.toLocaleString()}`} icon={AlertOctagon} accent="warning" />
          <KpiCard label="Recovered" value={`AED ${capturedAmount.toLocaleString()}`} icon={RefreshCcw} accent="success" />
          <KpiCard label="Recovery rate" value={`${recoveryRate.toFixed(1)}%`} icon={RefreshCcw} accent="primary" />
        </div>
        <Surface padded={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-[12.5px] min-w-210">
              <thead className="bg-surface-muted text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
                <tr><th className="px-4 py-3 text-left">Invoice</th><th className="px-4 py-3 text-left">Customer</th><th className="px-4 py-3 text-right">Amount</th><th className="px-4 py-3 text-left">Method</th><th className="px-4 py-3 text-left">Reason</th><th className="px-4 py-3 text-center">Attempts</th><th className="px-4 py-3 text-left">Next retry</th><th className="px-4 py-3 text-right">Status</th><th className="px-4 py-3 text-right"></th></tr>
              </thead>
              <tbody>
                {failed.map((f: any) => (
                  <tr key={f.id} className="border-t border-border hover:bg-surface-muted/60">
                      <td className="px-4 py-3 font-mono font-bold">{f.id}</td>
                      <td className="px-4 py-3">{f.customer ?? f.customerName ?? f.payer}</td>
                      <td className="px-4 py-3 text-right tabular-nums font-bold">AED {(f.amount ?? 0).toFixed(2)}</td>
                      <td className="px-4 py-3 text-muted-foreground">{f.method ?? f.paymentMethod}</td>
                      <td className="px-4 py-3"><StatusChip tone="danger">{f.reason ?? f.failureReason ?? 'Failed'}</StatusChip></td>
                      <td className="px-4 py-3 text-center tabular-nums">{f.attempts ?? 0}/4</td>
                      <td className="px-4 py-3 text-muted-foreground">{f.nextAttempt ?? f.next ?? '—'}</td>
                      <td className="px-4 py-3 text-right"><StatusChip tone={f.status==="retrying"?"warning":f.status==="blocked"?"danger":"neutral"}>{f.status}</StatusChip></td>
                      <td className="px-4 py-3 text-right"><div className="flex justify-end gap-1"><button className="inline-flex h-7 items-center gap-1 rounded-md border border-border px-2 text-[11px] font-bold hover:bg-accent"><RefreshCcw className="h-3 w-3"/>Retry</button><button className="inline-flex h-7 items-center gap-1 rounded-md border border-border px-2 text-[11px] font-bold hover:bg-accent"><Mail className="h-3 w-3"/>Email</button></div></td>
                  </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Surface>
        <Surface>
          <div className="text-[13px] font-black mb-3">Recent gateway events</div>
          <div className="space-y-2">
              {failed.map((p: any) => (
                <div key={p.id} className="flex items-center justify-between rounded-xl border border-border bg-surface-muted/40 px-3 py-2.5">
                  <div><div className="text-[12.5px] font-bold">{p.customer ?? p.customerName} · <span className="font-mono text-muted-foreground">{p.id}</span></div><div className="text-[11px] text-muted-foreground">{p.gateway ?? p.processor} · {p.method ?? p.paymentMethod} · {p.date ?? p.ts}</div></div>
                  <div className="tabular-nums font-bold text-destructive">AED {(p.amount ?? 0).toFixed(2)}</div>
                </div>
              ))}
          </div>
        </Surface>
      </div>
    </>
  );
}

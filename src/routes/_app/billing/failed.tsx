import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { Surface } from "@/components/app/Surface";
import { KpiCard } from "@/components/app/KpiCard";
import { StatusChip } from "@/components/app/StatusChip";
import { AlertOctagon, RefreshCcw, Mail } from "lucide-react";
import { PAYMENTS } from "@/lib/data";

export const Route = createFileRoute("/_app/billing/failed")({ component: Page });

const FAILED = [
  { id: "INV-2026-04817", customer: "Karim Boutros", amount: 273.00, method: "Mastercard •• 1209", reason: "Insufficient funds", attempts: 3, lastTry: "Today 09:42", next: "Tomorrow 09:00", status: "retrying" },
  { id: "INV-2026-04802", customer: "Sophia Chen", amount: 1302.00, method: "Apple Pay", reason: "Card declined", attempts: 2, lastTry: "Yesterday", next: "Today 18:00", status: "retrying" },
  { id: "INV-2026-04798", customer: "Omar Hourani", amount: 273.00, method: "Visa •• 4421", reason: "Expired card", attempts: 4, lastTry: "10 May", next: "—", status: "blocked" },
  { id: "INV-2026-04785", customer: "Tom Pereira", amount: 260.00, method: "AED Wallet", reason: "Wallet inactive", attempts: 1, lastTry: "08 May", next: "—", status: "abandoned" },
];

function Page() {
  return (
    <>
      <TopBar title="Failed Payments" subtitle="Recover lost revenue · automatic dunning + manual retry" />
      <div className="px-6 py-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <KpiCard label="Failed (24h)" value="12" delta={-18.3} icon={AlertOctagon} accent="danger" />
          <KpiCard label="At-risk revenue" value="AED 3,148" icon={AlertOctagon} accent="warning" />
          <KpiCard label="Recovered (30d)" value="AED 14,820" delta={22.4} icon={RefreshCcw} accent="success" />
          <KpiCard label="Recovery rate" value="68.4%" delta={4.1} icon={RefreshCcw} accent="primary" />
        </div>
        <Surface padded={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-[12.5px] min-w-[840px]">
              <thead className="bg-surface-muted text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
                <tr><th className="px-4 py-3 text-left">Invoice</th><th className="px-4 py-3 text-left">Customer</th><th className="px-4 py-3 text-right">Amount</th><th className="px-4 py-3 text-left">Method</th><th className="px-4 py-3 text-left">Reason</th><th className="px-4 py-3 text-center">Attempts</th><th className="px-4 py-3 text-left">Next retry</th><th className="px-4 py-3 text-right">Status</th><th className="px-4 py-3 text-right"></th></tr>
              </thead>
              <tbody>
                {FAILED.map(f => (
                  <tr key={f.id} className="border-t border-border hover:bg-surface-muted/60">
                    <td className="px-4 py-3 font-mono font-bold">{f.id}</td>
                    <td className="px-4 py-3">{f.customer}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-bold">AED {f.amount.toFixed(2)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{f.method}</td>
                    <td className="px-4 py-3"><StatusChip tone="danger">{f.reason}</StatusChip></td>
                    <td className="px-4 py-3 text-center tabular-nums">{f.attempts}/4</td>
                    <td className="px-4 py-3 text-muted-foreground">{f.next}</td>
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
            {PAYMENTS.filter(p=>p.status==="failed").map(p => (
              <div key={p.id} className="flex items-center justify-between rounded-xl border border-border bg-surface-muted/40 px-3 py-2.5">
                <div><div className="text-[12.5px] font-bold">{p.customer} · <span className="font-mono text-muted-foreground">{p.id}</span></div><div className="text-[11px] text-muted-foreground">{p.gateway} · {p.method} · {p.date}</div></div>
                <div className="tabular-nums font-bold text-destructive">AED {p.amount.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </Surface>
      </div>
    </>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { Surface } from "@/components/app/Surface";
import { KpiCard } from "@/components/app/KpiCard";
import { StatusChip } from "@/components/app/StatusChip";
import { RefreshCcw, Calendar, AlertTriangle, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/_app/subscriptions/renewals")({ component: Page });

const RENEWALS = [
  { id: "SUB-20480", customer: "Maryam Al Hashimi", plan: "Royal Monthly", amount: 441.00, dueIn: "Tomorrow", method: "Visa •• 4421", autopay: true, status: "scheduled" },
  { id: "SUB-20481", customer: "Omar Hourani", plan: "Premium Bi-weekly", amount: 273.00, dueIn: "in 2 days", method: "Mastercard •• 7710", autopay: true, status: "scheduled" },
  { id: "SUB-20484", customer: "Priya Nair", plan: "Eco Weekly", amount: 152.25, dueIn: "in 3 days", method: "Visa •• 0098", autopay: true, status: "scheduled" },
  { id: "SUB-20485", customer: "Karim Boutros", plan: "Premium Bi-weekly", amount: 273.00, dueIn: "in 4 days", method: "Mastercard •• 1209", autopay: false, status: "at-risk" },
  { id: "SUB-20486", customer: "Aisha Mubarak", plan: "Eco Weekly", amount: 152.25, dueIn: "in 5 days", method: "Visa •• 0098", autopay: true, status: "scheduled" },
  { id: "SUB-20487", customer: "Hamdan Al Suwaidi", plan: "Royal Monthly", amount: 756.00, dueIn: "in 6 days", method: "Paused", autopay: false, status: "paused" },
];

function Page() {
  return (
    <>
      <TopBar title="Renewals" subtitle="184 renewals due in next 7 days · AED 48,920 expected" />
      <div className="px-6 py-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <KpiCard label="Due in 7 days" value="184" delta={6.8} icon={Calendar} accent="warning" />
          <KpiCard label="Expected revenue" value="AED 48,920" icon={Calendar} accent="primary" />
          <KpiCard label="At-risk" value="12" icon={AlertTriangle} accent="danger" hint="No valid card" />
          <KpiCard label="Auto-renewing" value="92.4%" delta={1.1} icon={CheckCircle2} accent="success" />
        </div>
        <Surface padded={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-[12.5px] min-w-[720px]">
              <thead className="bg-surface-muted text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
                <tr><th className="px-4 py-3 text-left">Subscription</th><th className="px-4 py-3 text-left">Customer</th><th className="px-4 py-3 text-left">Plan</th><th className="px-4 py-3 text-right">Amount</th><th className="px-4 py-3 text-left">Due</th><th className="px-4 py-3 text-left">Method</th><th className="px-4 py-3 text-right">Status</th></tr>
              </thead>
              <tbody>
                {RENEWALS.map(r => (
                  <tr key={r.id} className="border-t border-border hover:bg-surface-muted/60">
                    <td className="px-4 py-3 font-mono font-bold">{r.id}</td>
                    <td className="px-4 py-3">{r.customer}</td>
                    <td className="px-4 py-3 font-bold">{r.plan}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-bold">AED {r.amount.toFixed(2)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.dueIn}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.method}{r.autopay && <RefreshCcw className="inline ml-1.5 h-3 w-3 text-primary"/>}</td>
                    <td className="px-4 py-3 text-right"><StatusChip tone={r.status==="scheduled"?"info":r.status==="at-risk"?"danger":"warning"}>{r.status}</StatusChip></td>
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

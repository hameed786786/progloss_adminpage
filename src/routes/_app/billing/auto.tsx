import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { Surface, SectionTitle } from "@/components/app/Surface";
import { KpiCard } from "@/components/app/KpiCard";
import { StatusChip } from "@/components/app/StatusChip";
import { Repeat, Play, Pause, Calendar, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/_app/billing/auto")({ component: Page });

const CYCLES = [
  { id: "CYC-2026-05-E", plan: "Eco Weekly", run: "Mon 06:00 GST", next: "20 May, 06:00", invoices: 412, amount: 59740, status: "Running" },
  { id: "CYC-2026-05-P", plan: "Premium Bi-weekly", run: "Sun 22:00 GST", next: "26 May, 22:00", invoices: 638, amount: 165880, status: "Scheduled" },
  { id: "CYC-2026-05-R", plan: "Royal Monthly", run: "1st 02:00 GST", next: "01 Jun, 02:00", invoices: 281, amount: 118020, status: "Scheduled" },
  { id: "CYC-2026-05-F", plan: "Fleet Care", run: "1st 04:00 GST", next: "01 Jun, 04:00", invoices: 47, amount: 58280, status: "Paused" },
];

function Page() {
  return (
    <>
      <TopBar title="Auto Billing" subtitle="Recurring invoice cycles & dunning rules" actions={
        <button className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-primary px-3 text-[12.5px] font-bold text-primary-foreground"><Play className="h-3.5 w-3.5" /> Run cycle</button>
      }/>
      <div className="px-6 py-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <KpiCard label="Active cycles" value="3 / 4" icon={Repeat} accent="primary" hint="Fleet Care paused" />
          <KpiCard label="Invoices this month" value="1,378" delta={6.4} icon={CheckCircle2} accent="success" />
          <KpiCard label="Expected MRR" value="AED 401,920" delta={4.2} icon={Calendar} accent="primary" />
          <KpiCard label="Dunning emails sent" value="38" icon={Calendar} accent="warning" />
        </div>
        <Surface padded={false}>
          <div className="px-5 py-4 border-b border-border"><SectionTitle title="Billing cycles" sub="Eco · Premium · Royal · Fleet Care" /></div>
          <div className="overflow-x-auto">
            <table className="w-full text-[12.5px] min-w-[720px]">
              <thead className="bg-surface-muted text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left">Cycle ID</th>
                  <th className="px-4 py-3 text-left">Plan</th>
                  <th className="px-4 py-3 text-left">Schedule</th>
                  <th className="px-4 py-3 text-left">Next run</th>
                  <th className="px-4 py-3 text-right">Invoices</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3 text-right">Status</th>
                  <th className="px-4 py-3 text-right"></th>
                </tr>
              </thead>
              <tbody>
                {CYCLES.map(c => (
                  <tr key={c.id} className="border-t border-border hover:bg-surface-muted/60">
                    <td className="px-4 py-3 font-mono font-bold">{c.id}</td>
                    <td className="px-4 py-3 font-bold">{c.plan}</td>
                    <td className="px-4 py-3 text-muted-foreground">{c.run}</td>
                    <td className="px-4 py-3">{c.next}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{c.invoices}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-bold">AED {c.amount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">
                      <StatusChip tone={c.status==="Running"?"success":c.status==="Paused"?"warning":"info"}>{c.status}</StatusChip>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="inline-flex h-7 items-center gap-1 rounded-md border border-border bg-surface px-2 text-[11px] font-bold hover:bg-accent">
                        {c.status==="Paused" ? <><Play className="h-3 w-3"/> Resume</> : <><Pause className="h-3 w-3"/> Pause</>}
                      </button>
                    </td>
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

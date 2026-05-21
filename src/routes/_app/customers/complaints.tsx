import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { Surface } from "@/components/app/Surface";
import { KpiCard } from "@/components/app/KpiCard";
import { StatusChip } from "@/components/app/StatusChip";
import { MessageSquareWarning, Clock, ShieldAlert, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/_app/customers/complaints")({ component: Page });

const COMPLAINTS = [
  { id: "CMP-3041", subject: "Damage to alloy rim during wash", customer: "Maryam Al Hashimi", community: "Marina Gate 2", severity: "high", status: "investigating", sla: "1h 12m", owner: "Sara Khoury", opened: "Today 09:42" },
  { id: "CMP-3040", subject: "Wash skipped 3 weeks in a row", customer: "Sophia Chen", community: "Burj Vista 1", severity: "urgent", status: "escalated", sla: "Breached", owner: "Operations Lead", opened: "Today 07:10" },
  { id: "CMP-3039", subject: "Foam left on side mirrors", customer: "Aisha Mubarak", community: "Dubai Hills", severity: "low", status: "resolved", sla: "—", owner: "Imran Saeed", opened: "Yesterday" },
  { id: "CMP-3038", subject: "Technician arrived 2h late", customer: "Karim Boutros", community: "Park Island", severity: "medium", status: "in-progress", sla: "4h 31m", owner: "Khalid Noor", opened: "Today 08:18" },
  { id: "CMP-3037", subject: "Water leak into trunk", customer: "Hamdan Al Suwaidi", community: "Emirates Hills 47", severity: "high", status: "escalated", sla: "30m", owner: "Rashid Al Mansoori", opened: "Today 10:51" },
  { id: "CMP-3036", subject: "Wrong vehicle washed", customer: "Tom Pereira", community: "Bay Central", severity: "urgent", status: "resolved", sla: "—", owner: "Sara Khoury", opened: "12 May" },
];

const TONE = { urgent: "danger", high: "danger", medium: "warning", low: "neutral" } as const;
const STATUS = { investigating: "warning", escalated: "danger", "in-progress": "info", resolved: "success" } as const;

function Page() {
  return (
    <>
      <TopBar title="Complaints" subtitle="Customer escalations · root-cause & SLA monitoring" />
      <div className="px-6 py-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <KpiCard label="Open complaints" value="14" delta={-22.1} icon={MessageSquareWarning} accent="danger" />
          <KpiCard label="SLA breaches" value="1" icon={ShieldAlert} accent="danger" />
          <KpiCard label="Avg resolution" value="6h 42m" delta={-12.4} icon={Clock} accent="success" />
          <KpiCard label="Resolved (7d)" value="38" delta={9.1} icon={CheckCircle2} accent="success" />
        </div>
        <Surface padded={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-[12.5px] min-w-[840px]">
              <thead className="bg-surface-muted text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
                <tr><th className="px-4 py-3 text-left">ID</th><th className="px-4 py-3 text-left">Subject</th><th className="px-4 py-3 text-left">Customer</th><th className="px-4 py-3 text-left">Community</th><th className="px-4 py-3 text-left">Severity</th><th className="px-4 py-3 text-left">Status</th><th className="px-4 py-3 text-left">SLA</th><th className="px-4 py-3 text-left">Owner</th></tr>
              </thead>
              <tbody>
                {COMPLAINTS.map(c => (
                  <tr key={c.id} className="border-t border-border hover:bg-surface-muted/60">
                    <td className="px-4 py-3 font-mono font-bold">{c.id}</td>
                    <td className="px-4 py-3"><div className="font-bold">{c.subject}</div><div className="text-[10.5px] text-muted-foreground">{c.opened}</div></td>
                    <td className="px-4 py-3">{c.customer}</td>
                    <td className="px-4 py-3 text-muted-foreground">{c.community}</td>
                    <td className="px-4 py-3"><StatusChip tone={TONE[c.severity as keyof typeof TONE]}>{c.severity}</StatusChip></td>
                    <td className="px-4 py-3"><StatusChip tone={STATUS[c.status as keyof typeof STATUS]}>{c.status}</StatusChip></td>
                    <td className="px-4 py-3 tabular-nums font-bold">{c.sla}</td>
                    <td className="px-4 py-3">{c.owner}</td>
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

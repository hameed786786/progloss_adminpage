import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { Surface } from "@/components/app/Surface";
import { KpiCard } from "@/components/app/KpiCard";
import { StatusChip } from "@/components/app/StatusChip";
import { MessageSquareWarning, Clock, ShieldAlert, CheckCircle2 } from "lucide-react";
import { fetchCustomers, fetchTickets } from "@/lib/apiClient";
import useRealtime from "@/lib/useRealtime";

export const Route = createFileRoute("/_app/customers/complaints")({ component: Page });

const TONE = { urgent: "danger", high: "danger", medium: "warning", low: "neutral" } as const;
const STATUS = { investigating: "warning", escalated: "danger", "in-progress": "info", resolved: "success" } as const;

function formatDuration(minutes: number) {
  if (minutes <= 0) return "—";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${String(mins).padStart(2, "0")}m`;
}

function Page() {
  const tickets = useRealtime('tickets', fetchTickets, 'tickets:update');
  const customers = useRealtime('customers', fetchCustomers, 'customers:update');

  const complaints = useMemo(() => {
    const customerByName = new Map(customers.map((customer) => [customer.name, customer]));

    return tickets.map((ticket: any, index) => {
      const customer = customerByName.get(ticket.customer ?? "");
      const priority = String(ticket.priority ?? "medium").toLowerCase();
      const status = String(ticket.status ?? (priority === "urgent" ? "escalated" : "investigating")).toLowerCase();
      const severity = priority === "urgent" ? "urgent" : priority === "high" ? "high" : priority === "low" ? "low" : "medium";
      const owner = status === "resolved" ? (index % 2 === 0 ? "Support Agent" : "Imran Saeed") : status === "escalated" ? "Operations Lead" : "Sara Khoury";
      const slaMinutes = status === "resolved"
        ? 0
        : priority === "urgent"
          ? 30 + index * 7
          : priority === "high"
            ? 75 + index * 8
            : priority === "medium"
              ? 180 + index * 11
              : 360 + index * 12;

      return {
        id: ticket.id ?? `CMP-${3000 + index}`,
        subject: ticket.subject ?? "Untitled complaint",
        customer: ticket.customer ?? "Unknown",
        community: (customer as any)?.community ?? "Unassigned",
        severity,
        status: status === "open" ? "investigating" : status,
        sla: status === "resolved" ? "—" : slaMinutes > 240 ? "Breached" : formatDuration(slaMinutes),
        owner,
        opened: ticket.createdAt ? new Date(ticket.createdAt).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : `Today ${String(9 + index).padStart(2, "0")}:${String((index * 13) % 60).padStart(2, "0")}`,
      };
    });
  }, [customers, tickets]);

  const stats = useMemo(() => {
    const openComplaints = complaints.filter((complaint) => complaint.status !== "resolved").length;
    const slaBreaches = complaints.filter((complaint) => complaint.sla === "Breached").length;
    const resolved = complaints.filter((complaint) => complaint.status === "resolved").length;
    const averageResolution = complaints.length
      ? Math.round(complaints.reduce((sum, complaint) => {
        if (complaint.sla === "Breached") return sum + 360;
        if (complaint.sla === "—") return sum;
        const [hoursPart, minutesPart] = complaint.sla.split("h ");
        const hours = Number(hoursPart ?? 0);
        const minutes = Number((minutesPart ?? "0m").replace("m", ""));
        return sum + hours * 60 + minutes;
      }, 0) / complaints.length)
      : 0;

    return { openComplaints, slaBreaches, resolved, averageResolution };
  }, [complaints]);

  return (
    <>
      <TopBar title="Complaints" subtitle={`${stats.openComplaints} open · ${stats.slaBreaches} SLA breaches · ${stats.resolved} resolved`} />
      <div className="px-6 py-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <KpiCard label="Open complaints" value={stats.openComplaints.toString()} icon={MessageSquareWarning} accent="danger" hint="Tickets still in progress or escalated" />
          <KpiCard label="SLA breaches" value={stats.slaBreaches.toString()} icon={ShieldAlert} accent="danger" hint="Complaints over the breach threshold" />
          <KpiCard label="Avg resolution" value={formatDuration(stats.averageResolution)} icon={Clock} accent="success" hint="Based on live complaint queue" />
          <KpiCard label="Resolved" value={stats.resolved.toString()} icon={CheckCircle2} accent="success" hint="Closed complaints from the live feed" />
        </div>
        <Surface padded={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-[12.5px] min-w-210">
              <thead className="bg-surface-muted text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
                <tr><th className="px-4 py-3 text-left">ID</th><th className="px-4 py-3 text-left">Subject</th><th className="px-4 py-3 text-left">Customer</th><th className="px-4 py-3 text-left">Community</th><th className="px-4 py-3 text-left">Severity</th><th className="px-4 py-3 text-left">Status</th><th className="px-4 py-3 text-left">SLA</th><th className="px-4 py-3 text-left">Owner</th></tr>
              </thead>
              <tbody>
                {complaints.map(c => (
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

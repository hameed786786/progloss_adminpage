import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { Surface, SectionTitle } from "@/components/app/Surface";
import { StatusChip } from "@/components/app/StatusChip";
import { AlertTriangle, Clock, Paperclip, MessageSquare, User } from "lucide-react";
import { fetchTickets } from "@/lib/apiClient";
import useRealtime from "@/lib/useRealtime";

export const Route = createFileRoute("/_app/customers/tickets")({ component: Tickets });

const PRIO: Record<string, "danger"|"warning"|"info"|"neutral"> = { urgent: "danger", high: "warning", medium: "info", low: "neutral" };
const STAT: Record<string, "danger"|"warning"|"primary"|"success"> = { escalated: "danger", open: "warning", "in-progress": "primary", resolved: "success" };

function Tickets() {
  const rows = useRealtime('tickets', fetchTickets, 'tickets:update');
  const counts = {
    open: rows.filter((ticket) => ticket.status === "open").length,
    progress: rows.filter((ticket) => ticket.status === "in-progress").length,
    escalated: rows.filter((ticket) => ticket.status === "escalated").length,
    resolved: rows.filter((ticket) => ticket.status === "resolved").length,
  };
  return (
    <>
      <TopBar title="Ticketing Center" subtitle={`Support queue · SLA monitoring · ${rows.length} active tickets`} />
      <div className="px-6 py-6 space-y-4">
        <div className="grid gap-3 md:grid-cols-4">
          {[
            { label: "Open", count: counts.open, tone: "warning" as const },
            { label: "In Progress", count: counts.progress, tone: "primary" as const },
            { label: "Escalated", count: counts.escalated, tone: "danger" as const },
            { label: "Resolved · 7d", count: 41, tone: "success" as const },
          ].map((s) => (
            <Surface key={s.label} className="py-4!">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{s.label}</span>
                <StatusChip tone={s.tone}>{s.tone === "danger" ? "Action" : "Live"}</StatusChip>
              </div>
              <div className="mt-2 text-[26px] font-black tracking-tight">{s.count}</div>
            </Surface>
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <Surface padded={false} className="xl:col-span-2 overflow-hidden">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-1 rounded-lg border border-border bg-surface-muted p-0.5 text-[11.5px] font-bold">
                {["All","Open","In Progress","Escalated","Resolved"].map((t,i) => (
                  <button key={t} className={`px-2.5 py-1 rounded-md ${i===0 ? "bg-surface text-foreground shadow-card" : "text-muted-foreground"}`}>{t}</button>
                ))}
              </div>
              <span className="text-[11.5px] text-muted-foreground">Avg first response · 14m</span>
            </div>
            <table className="w-full text-[12.5px]">
              <thead className="bg-surface-muted/40 text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
                <tr><th className="px-4 py-2.5 text-left">Ticket</th><th className="px-4 py-2.5 text-left">Priority</th><th className="px-4 py-2.5 text-left">Status</th><th className="px-4 py-2.5 text-left">SLA</th><th className="px-4 py-2.5 text-left">Assigned</th></tr>
              </thead>
              <tbody>
                {rows.map((t) => (
                  <tr key={t.id} className="border-t border-border hover:bg-surface-muted/40 cursor-pointer">
                    <td className="px-4 py-3">
                      <div className="font-bold text-foreground">{t.subject}</div>
                      <div className="text-[11px] text-muted-foreground">{t.id} · {t.customer} · {t.created ?? "—"}</div>
                    </td>
                    <td className="px-4 py-3"><StatusChip tone={PRIO[t.priority ?? "medium"]}>{t.priority ?? "medium"}</StatusChip></td>
                    <td className="px-4 py-3"><StatusChip tone={STAT[t.status] ?? "warning"}>{t.status ?? "open"}</StatusChip></td>
                    <td className="px-4 py-3">
                      <div className={`inline-flex items-center gap-1 text-[11.5px] font-bold ${(t.sla ?? "—") === "Breached" ? "text-destructive" : "text-foreground"}`}>
                        <Clock className="h-3 w-3" /> {t.sla ?? "—"}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{t.assigned ?? "Unassigned"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Surface>

          <Surface>
            <SectionTitle title="TKT-9822" sub="Wrong plate marked as completed" />
            <div className="space-y-3 text-[12.5px]">
              <div className="flex items-center gap-2"><StatusChip tone="danger">escalated</StatusChip><StatusChip tone="danger">urgent</StatusChip><span className="text-[11px] text-muted-foreground">SLA breached</span></div>
              <div className="rounded-xl border border-border bg-surface-muted/40 p-3">
                <div className="flex items-center gap-2 text-[11.5px] font-bold"><User className="h-3 w-3" /> Sophia Chen</div>
                <p className="mt-2 text-foreground/80">My Mercedes G63 (Q-15-67120) was marked clean at 7:10am but the technician washed plate Q-15-67220 instead. Please verify and reschedule.</p>
                <div className="mt-2 flex items-center gap-1 text-[11px] text-muted-foreground"><Paperclip className="h-3 w-3" /> 2 attachments · photo evidence</div>
              </div>
              <div className="rounded-xl border border-warning/30 bg-warning/5 p-3 text-[12px]">
                <div className="flex items-center gap-1.5 font-bold text-[oklch(0.45_0.13_60)]"><AlertTriangle className="h-3.5 w-3.5" /> Internal note · Layla Hassan</div>
                <p className="mt-1.5 text-foreground/80">Confirmed via dispatch logs. Reassigning PRG-T-018 for re-wash today 16:00. Compensation: 1 free wash credit.</p>
              </div>
              <div className="flex gap-2 pt-1">
                <input placeholder="Reply to customer…" className="flex-1 rounded-xl border border-border bg-surface px-3 py-2 text-[12.5px] outline-none focus:border-primary" />
                <button className="rounded-xl bg-primary px-3 text-[12px] font-bold text-primary-foreground hover:bg-primary/90"><MessageSquare className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          </Surface>
        </div>
      </div>
    </>
  );
}

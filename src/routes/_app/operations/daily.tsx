import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { Surface, SectionTitle } from "@/components/app/Surface";
import { KpiCard } from "@/components/app/KpiCard";
import { StatusChip } from "@/components/app/StatusChip";
import { Car, Clock, UserCheck, Calendar, CheckCircle2 } from "lucide-react";
import { fetchTickets, fetchStaff } from "@/lib/apiClient";
import useRealtime from "@/lib/useRealtime";

export const Route = createFileRoute("/_app/operations/daily")({ component: Page });

function Page() {
  const tickets = useRealtime('tickets', fetchTickets, 'tickets:update');
  const staff = useRealtime('staff', fetchStaff, 'staff:update');

  const todayQueue = (tickets || []).filter(() => true);
  const activeTechs = (staff || []).filter((s) => s.status !== "Offline");

  const shifts = useMemo(() => {
    const labels: Record<string, string> = {
      Morning: "Morning · 06:00–14:00",
      Afternoon: "Afternoon · 10:00–18:00",
      Evening: "Evening · 14:00–22:00",
      Night: "Night · 22:00–06:00",
    };
    const grouped = new Map<string, any[]>();
    (staff || []).forEach((member) => {
      const key = member.shift || "Unassigned";
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key)!.push(member);
    });

    return Array.from(grouped.entries()).map(([shiftName, members]) => {
      const on = members.filter((m) => m.status !== "Offline").length;
      const expected = Math.max(members.length, on);
      return {
        name: labels[shiftName] ?? shiftName,
        on,
        expected,
        supervisor: members.find((m) => String(m.role || "").toLowerCase().includes("supervisor"))?.name ?? members[0]?.name ?? "Unassigned",
      };
    });
  }, [staff]);

  const completedCount = todayQueue.filter((ticket) => ["done", "closed", "resolved", "completed"].includes(String(ticket.status || "").toLowerCase())).length;
  const openCount = todayQueue.filter((ticket) => ["open", "pending", "queued", "in-progress", "en-route"].includes(String(ticket.status || "").toLowerCase())).length;
  const onTimeRate = todayQueue.length ? Math.round((completedCount / todayQueue.length) * 100) : 0;
  const avgWashMinutes = openCount ? Math.max(24, Math.round(36 + (openCount / Math.max(activeTechs.length, 1)) * 5)) : 34;

  return (
    <>
      <TopBar title="Daily Operations" subtitle={`Live queue · ${todayQueue.length} work orders · ${activeTechs.length} technicians active`} />
      <div className="px-6 py-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <KpiCard label="Cars cleaned" value={completedCount.toString()} icon={Car} accent="primary" hint="Completed work orders" />
          <KpiCard label="Avg wash time" value={`${avgWashMinutes}m`} icon={Clock} accent="success" />
          <KpiCard label="Techs on shift" value={`${activeTechs.length} / ${Math.max((staff || []).length, activeTechs.length)}`} icon={UserCheck} accent="primary" />
          <KpiCard label="On-time rate" value={`${onTimeRate}%`} icon={CheckCircle2} accent="success" />
        </div>
        <Surface>
          <SectionTitle title="Shifts today" />
          <div className="grid gap-3 md:grid-cols-3">
            {shifts.map(s => (
              <div key={s.name} className="rounded-xl border border-border bg-surface-muted/40 p-4">
                <div className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><Calendar className="h-3 w-3"/> {s.name}</div>
                <div className="mt-2 flex items-end justify-between"><span className="text-[28px] font-black tabular-nums">{s.on}</span><span className="text-[12px] text-muted-foreground mb-1">of {s.expected}</span></div>
                <div className="mt-2 h-1.5 rounded-full bg-surface overflow-hidden"><div className="h-full rounded-full bg-primary" style={{ width: `${(s.on/s.expected)*100}%` }}/></div>
                <div className="mt-3 text-[11.5px] text-muted-foreground">Supervisor · <span className="font-bold text-foreground">{s.supervisor}</span></div>
              </div>
            ))}
          </div>
        </Surface>
        <div className="grid gap-4 xl:grid-cols-2">
          <Surface padded={false}>
            <div className="px-5 py-4 border-b border-border"><SectionTitle title="Today's queue" sub={`${todayQueue.length} work orders`}/></div>
              <div className="divide-y divide-border max-h-105 overflow-y-auto">
                {todayQueue.map((w: any) => (
                <div key={w.id} className="flex items-center justify-between px-5 py-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2"><span className="text-[12.5px] font-bold font-mono">{w.id}</span><span className="text-[11px] text-muted-foreground">{w.slot ?? "today"}</span></div>
                    <div className="mt-0.5 text-[12px] truncate"><span className="font-bold">{w.customer ?? "Unknown customer"}</span> · {w.subject ?? "General service"}</div>
                  </div>
                  <StatusChip tone={w.status==="in-progress"?"primary":w.status==="en-route"?"info":w.status==="open"?"warning":"neutral"}>{w.status ?? "open"}</StatusChip>
                </div>
              ))}
            </div>
          </Surface>
          <Surface padded={false}>
            <div className="px-5 py-4 border-b border-border"><SectionTitle title="On-shift technicians"/></div>
            <div className="divide-y divide-border max-h-105 overflow-y-auto">
              {staff.filter(s=>s.status!=="Offline").map(s => (
                <div key={s.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-[11px] font-black text-primary">{s.name.split(" ").map(n=>n[0]).slice(0,2).join("")}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12.5px] font-bold truncate">{s.name}</div>
                    <div className="text-[10.5px] text-muted-foreground">{s.zone} · {s.shift}</div>
                  </div>
                  <StatusChip tone={s.status==="Cleaning"?"primary":s.status==="Available"?"success":s.status==="Break"?"warning":"info"}>{s.status}</StatusChip>
                </div>
              ))}
            </div>
          </Surface>
        </div>
      </div>
    </>
  );
}

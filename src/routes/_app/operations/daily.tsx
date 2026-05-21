import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { Surface, SectionTitle } from "@/components/app/Surface";
import { KpiCard } from "@/components/app/KpiCard";
import { StatusChip } from "@/components/app/StatusChip";
import { Car, Clock, UserCheck, Calendar, CheckCircle2 } from "lucide-react";
import { DISPATCH_QUEUE, STAFF } from "@/lib/data";

export const Route = createFileRoute("/_app/operations/daily")({ component: Page });

const SHIFTS = [
  { name: "Morning · 06:00–14:00", on: 38, expected: 42, supervisor: "Sara Khoury" },
  { name: "Afternoon · 10:00–18:00", on: 32, expected: 34, supervisor: "Khalid Noor" },
  { name: "Evening · 14:00–22:00", on: 18, expected: 18, supervisor: "Abdellah Naciri" },
];

function Page() {
  return (
    <>
      <TopBar title="Daily Operations" subtitle="Wednesday · 20 May 2026 · Dubai · Morning shift in progress" />
      <div className="px-6 py-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <KpiCard label="Cars cleaned" value="847" delta={3.2} icon={Car} accent="primary" hint="Target 940" />
          <KpiCard label="Avg wash time" value="38m" delta={-4.1} icon={Clock} accent="success" />
          <KpiCard label="Techs on shift" value="88 / 94" icon={UserCheck} accent="primary" />
          <KpiCard label="On-time rate" value="92%" delta={1.4} icon={CheckCircle2} accent="success" />
        </div>
        <Surface>
          <SectionTitle title="Shifts today" />
          <div className="grid gap-3 md:grid-cols-3">
            {SHIFTS.map(s => (
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
            <div className="px-5 py-4 border-b border-border"><SectionTitle title="Today's queue" sub={`${DISPATCH_QUEUE.length} work orders`}/></div>
            <div className="divide-y divide-border max-h-[420px] overflow-y-auto">
              {DISPATCH_QUEUE.map(w => (
                <div key={w.id} className="flex items-center justify-between px-5 py-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2"><span className="text-[12.5px] font-bold font-mono">{w.id}</span><span className="text-[11px] text-muted-foreground">{w.slot}</span></div>
                    <div className="mt-0.5 text-[12px] truncate"><span className="font-mono font-bold">{w.plate}</span> · {w.community} · <span className="text-muted-foreground">{w.plan}</span></div>
                  </div>
                  <StatusChip tone={w.status==="in-progress"?"primary":w.status==="en-route"?"info":"neutral"}>{w.status}</StatusChip>
                </div>
              ))}
            </div>
          </Surface>
          <Surface padded={false}>
            <div className="px-5 py-4 border-b border-border"><SectionTitle title="On-shift technicians"/></div>
            <div className="divide-y divide-border max-h-[420px] overflow-y-auto">
              {STAFF.filter(s=>s.status!=="Offline").map(s => (
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

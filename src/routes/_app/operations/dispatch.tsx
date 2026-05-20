import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { Surface, SectionTitle } from "@/components/app/Surface";
import { StatusChip } from "@/components/app/StatusChip";
import { DISPATCH_QUEUE, STAFF } from "@/lib/data";
import { GripVertical, MapPin, Search } from "lucide-react";

export const Route = createFileRoute("/_app/operations/dispatch")({ component: Dispatch });

const STAT: Record<string, "primary"|"info"|"warning"|"success"> = { "in-progress": "primary", "en-route": "info", queued: "warning", done: "success" };

function Dispatch() {
  return (
    <>
      <TopBar title="Dispatch Center" subtitle={`${DISPATCH_QUEUE.length} work orders in queue · drag to reassign`} />
      <div className="grid gap-4 px-6 py-6 xl:grid-cols-5">
        <Surface className="xl:col-span-3 !p-0 overflow-hidden">
          <div className="relative h-[600px] bg-gradient-to-br from-[oklch(0.97_0.015_220)] to-[oklch(0.95_0.025_258)]">
            <svg className="absolute inset-0 h-full w-full opacity-50">
              <defs><pattern id="dg" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M 48 0 L 0 0 0 48" fill="none" stroke="oklch(0.86 0.015 250)" strokeWidth="0.5"/></pattern></defs>
              <rect width="100%" height="100%" fill="url(#dg)" />
            </svg>
            <div className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-xl bg-white/95 px-3 py-2 shadow-card">
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
              <input className="w-56 bg-transparent text-[12px] outline-none" placeholder="Filter by zone, plate, technician…" />
            </div>
            {[
              { t: "18%", l: "22%", n: "Marina · 2 WO" },
              { t: "32%", l: "48%", n: "Burj Vista · 1 WO" },
              { t: "52%", l: "30%", n: "Damac · 1 WO" },
              { t: "28%", l: "74%", n: "Em. Hills · 1 WO" },
              { t: "68%", l: "60%", n: "Dubai Hills · 1 WO" },
              { t: "78%", l: "26%", n: "JBR · 1 WO" },
            ].map((p, i) => (
              <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ top: p.t, left: p.l }}>
                <div className="rounded-xl bg-primary px-2.5 py-1.5 text-[11px] font-bold text-primary-foreground shadow-elevated flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {p.n}
                </div>
              </div>
            ))}
          </div>
        </Surface>

        <div className="xl:col-span-2 space-y-3">
          <Surface className="!p-4">
            <SectionTitle title="Booking queue" sub="Today · sorted by slot" />
            <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
              {DISPATCH_QUEUE.map((w) => (
                <div key={w.id} className="group flex items-center gap-2 rounded-xl border border-border bg-surface-muted/40 p-2.5 hover:border-primary/30 cursor-grab">
                  <GripVertical className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground" />
                  <div className="flex-1 leading-tight">
                    <div className="flex items-center gap-2"><span className="font-bold text-[12.5px]">{w.id}</span><StatusChip tone={STAT[w.status]}>{w.status}</StatusChip></div>
                    <div className="text-[11px] text-muted-foreground">{w.community} · {w.plate} · {w.slot}</div>
                  </div>
                  <div className="text-right text-[11px]"><div className="text-muted-foreground">Tech</div><div className="font-bold">{w.tech}</div></div>
                </div>
              ))}
            </div>
          </Surface>
          <Surface className="!p-4">
            <SectionTitle title="Technician load" sub="Active capacity today" />
            <div className="space-y-2">
              {STAFF.slice(0, 6).map((s) => {
                const load = s.status === "Cleaning" ? 92 : s.status === "En Route" ? 70 : s.status === "Available" ? 30 : s.status === "Break" ? 50 : 0;
                return (
                  <div key={s.id} className="flex items-center gap-3 text-[12px]">
                    <div className="w-32 truncate font-bold">{s.name}</div>
                    <div className="flex-1 h-1.5 rounded-full bg-surface-muted overflow-hidden">
                      <div className={`h-full rounded-full ${load > 85 ? "bg-destructive" : load > 60 ? "bg-[oklch(0.74_0.15_75)]" : "bg-primary"}`} style={{ width: `${load}%` }} />
                    </div>
                    <div className="w-10 text-right tabular-nums font-bold">{load}%</div>
                  </div>
                );
              })}
            </div>
          </Surface>
        </div>
      </div>
    </>
  );
}

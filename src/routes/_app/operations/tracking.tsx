import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { Surface, SectionTitle } from "@/components/app/Surface";
import { StatusChip } from "@/components/app/StatusChip";
import { STAFF } from "@/lib/data";
import { MapPin, Radio, Coffee, Wrench, Circle } from "lucide-react";

export const Route = createFileRoute("/_app/operations/tracking")({ component: Tracking });

const STATUS_TONE: Record<string, "success"|"warning"|"primary"|"info"|"neutral"> = {
  Cleaning: "primary", "En Route": "info", Available: "success", Break: "warning", Offline: "neutral",
};

function Tracking() {
  return (
    <>
      <TopBar title="Staff Live Tracking" subtitle={`${STAFF.filter(s=>s.status!=="Offline").length} technicians online · Dubai operational zones`} />
      <div className="grid gap-4 px-6 py-6 xl:grid-cols-5">
        <Surface className="xl:col-span-3 !p-0 overflow-hidden">
          <div className="relative h-[560px] bg-gradient-to-br from-[oklch(0.96_0.02_220)] via-[oklch(0.97_0.015_250)] to-[oklch(0.95_0.03_258)]">
            <svg className="absolute inset-0 h-full w-full opacity-40" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="oklch(0.85 0.02 250)" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
            {/* Fake routes/streets */}
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 600 560" preserveAspectRatio="none">
              <path d="M 0 180 Q 200 120 380 200 T 600 240" stroke="oklch(0.88 0.02 250)" strokeWidth="6" fill="none" strokeLinecap="round"/>
              <path d="M 80 0 Q 120 200 280 300 T 460 560" stroke="oklch(0.88 0.02 250)" strokeWidth="4" fill="none" strokeLinecap="round"/>
              <path d="M 0 420 L 600 380" stroke="oklch(0.9 0.02 250)" strokeWidth="3" fill="none"/>
            </svg>
            {/* Pins */}
            {[
              { top: "22%", left: "18%", c: "primary", l: "Marina Gate 2" },
              { top: "38%", left: "44%", c: "primary", l: "Burj Vista 1" },
              { top: "58%", left: "32%", c: "info", l: "Damac Heights" },
              { top: "30%", left: "72%", c: "primary", l: "Emirates Hills 47" },
              { top: "70%", left: "62%", c: "warning", l: "Dubai Hills Hub" },
            ].map((p, i) => (
              <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ top: p.top, left: p.left }}>
                <div className={`relative flex h-9 w-9 items-center justify-center rounded-full ring-4 ring-white shadow-elevated ${
                  p.c === "primary" ? "bg-primary text-primary-foreground" :
                  p.c === "info" ? "bg-[oklch(0.62_0.14_230)] text-white" :
                  "bg-[oklch(0.74_0.15_75)] text-white"
                }`}>
                  <MapPin className="h-4 w-4" />
                  <span className={`absolute -inset-1 rounded-full opacity-40 ${
                    p.c === "primary" ? "bg-primary" : p.c === "info" ? "bg-[oklch(0.62_0.14_230)]" : "bg-[oklch(0.74_0.15_75)]"
                  } animate-ping`} />
                </div>
                <div className="mt-1 rounded-md bg-white px-1.5 py-0.5 text-[10px] font-bold text-foreground shadow-card whitespace-nowrap">{p.l}</div>
              </div>
            ))}
            <div className="absolute left-4 top-4 rounded-xl bg-white/90 px-3 py-2 backdrop-blur shadow-card">
              <div className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">Live Map · Dubai</div>
              <div className="mt-0.5 flex items-center gap-2 text-[11px]"><Circle className="h-2 w-2 fill-primary text-primary" /> 6 active · <Circle className="h-2 w-2 fill-[oklch(0.74_0.15_75)] text-[oklch(0.74_0.15_75)]" /> 1 break</div>
            </div>
          </div>
        </Surface>

        <div className="xl:col-span-2 space-y-3">
          <Surface className="!py-3">
            <div className="flex items-center gap-1 rounded-lg border border-border bg-surface-muted p-0.5 text-[11.5px] font-bold">
              {["All","Cleaning","En Route","Available","Break"].map((t,i) => (
                <button key={t} className={`flex-1 rounded-md px-2 py-1 ${i===0 ? "bg-surface text-foreground shadow-card" : "text-muted-foreground"}`}>{t}</button>
              ))}
            </div>
          </Surface>
          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
            {STAFF.map((s) => (
              <Surface key={s.id} className="!p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-[11px] font-black text-primary">
                      {s.name.split(" ").map(n=>n[0]).slice(0,2).join("")}
                    </div>
                    <div className="leading-tight">
                      <div className="text-[13px] font-black">{s.name}</div>
                      <div className="text-[11px] text-muted-foreground">{s.id} · {s.role}</div>
                    </div>
                  </div>
                  <StatusChip tone={STATUS_TONE[s.status]}>{s.status === "Cleaning" ? <Wrench className="h-2.5 w-2.5" /> : s.status === "Break" ? <Coffee className="h-2.5 w-2.5" /> : <Radio className="h-2.5 w-2.5" />}{s.status}</StatusChip>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-[11.5px]">
                  <div><div className="text-muted-foreground">Building</div><div className="font-bold">{s.building}</div></div>
                  <div><div className="text-muted-foreground">Vehicle</div><div className="font-mono font-bold">{s.plate}</div></div>
                  <div><div className="text-muted-foreground">Shift</div><div className="font-bold">{s.shift}</div></div>
                  <div><div className="text-muted-foreground">ETA</div><div className="font-bold text-primary">{s.eta}</div></div>
                </div>
              </Surface>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { Surface, SectionTitle } from "@/components/app/Surface";
import { StatusChip } from "@/components/app/StatusChip";
import { PLANS } from "@/lib/data";
import { Plus, Sparkles, Repeat, Car, Check } from "lucide-react";

export const Route = createFileRoute("/_app/subscriptions/plans")({ component: PlansPage });

function PlansPage() {
  return (
    <>
      <TopBar title="Subscription Plans" subtitle="Manage pricing, frequency, perks and vehicle support"
        actions={<button className="hidden md:inline-flex h-9 items-center gap-1.5 rounded-xl bg-primary px-3 text-[12.5px] font-bold text-primary-foreground hover:bg-primary/90"><Plus className="h-3.5 w-3.5" /> New plan</button>}/>
      <div className="px-6 py-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {PLANS.map((p, i) => (
          <Surface key={p.id} className="flex flex-col">
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary"><Sparkles className="h-4 w-4" /></div>
              {i === 1 && <StatusChip tone="primary">Most popular</StatusChip>}
            </div>
            <div className="mt-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{p.id}</div>
              <div className="text-[17px] font-black tracking-tight">{p.name}</div>
            </div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-[28px] font-black tracking-tight">{p.price}</span>
              <span className="text-[12px] text-muted-foreground">AED · {p.freq}</span>
            </div>
            <div className="mt-3 flex gap-2 text-[11px]">
              <div className="flex items-center gap-1 rounded-md bg-surface-muted px-2 py-1 font-bold"><Repeat className="h-3 w-3" /> {p.washes} washes</div>
              <div className="flex items-center gap-1 rounded-md bg-surface-muted px-2 py-1 font-bold"><Car className="h-3 w-3" /> {p.vehicles} vehicle{p.vehicles>1?"s":""}</div>
            </div>
            <ul className="mt-4 space-y-1.5 text-[12.5px] flex-1">
              {p.perks.map((b) => (
                <li key={b} className="flex items-start gap-2"><Check className="mt-0.5 h-3.5 w-3.5 text-primary shrink-0" /><span className="text-foreground/80">{b}</span></li>
              ))}
            </ul>
            <div className="mt-4 border-t border-border pt-3 flex items-center justify-between text-[11.5px]">
              <span className="text-muted-foreground">{p.active} active</span>
              <button className="text-primary font-bold hover:underline">Edit plan</button>
            </div>
          </Surface>
        ))}
      </div>
    </>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { Surface } from "@/components/app/Surface";
import { StatusChip } from "@/components/app/StatusChip";
import { ROLES } from "@/lib/data";
import { ShieldCheck, MoreHorizontal, Plus } from "lucide-react";

export const Route = createFileRoute("/_app/rbac/roles")({ component: Roles });

function Roles() {
  return (
    <>
      <TopBar title="Roles" subtitle={`${ROLES.length} roles · ${ROLES.reduce((s,r)=>s+r.users,0)} users assigned`} actions={
        <button className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-primary px-3 text-[12.5px] font-bold text-primary-foreground hover:bg-primary/90"><Plus className="h-3.5 w-3.5" /> New role</button>
      } />
      <div className="px-6 py-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {ROLES.map((r) => (
          <Surface key={r.id}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><ShieldCheck className="h-4 w-4" /></div>
                <div>
                  <div className="text-[14px] font-black tracking-tight">{r.name}</div>
                  <div className="text-[11px] text-muted-foreground">{r.id}</div>
                </div>
              </div>
              <button className="text-muted-foreground hover:text-foreground"><MoreHorizontal className="h-4 w-4" /></button>
            </div>
            <p className="mt-3 text-[12.5px] text-foreground/80">{r.desc}</p>
            <div className="mt-4 flex items-center justify-between text-[11.5px]">
              <StatusChip tone="primary">{r.users} users</StatusChip>
              <button className="text-primary font-bold hover:underline">Manage permissions →</button>
            </div>
          </Surface>
        ))}
      </div>
    </>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { Surface } from "@/components/app/Surface";
import { KpiCard } from "@/components/app/KpiCard";
import { StatusChip } from "@/components/app/StatusChip";
import { UserCog, Search, Plus } from "lucide-react";
import { STAFF } from "@/lib/data";

export const Route = createFileRoute("/_app/staff/directory")({ component: Page });

function Page() {
  return (
    <>
      <TopBar title="Staff Directory" subtitle="94 employees · 8 zones · Dubai operations" actions={
        <button className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-primary px-3 text-[12.5px] font-bold text-primary-foreground"><Plus className="h-3.5 w-3.5"/> Add staff</button>
      }/>
      <div className="px-6 py-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <KpiCard label="Total staff" value="94" icon={UserCog} accent="primary" />
          <KpiCard label="Technicians" value="78" icon={UserCog} accent="primary" />
          <KpiCard label="Supervisors" value="11" icon={UserCog} accent="primary" />
          <KpiCard label="Office / admin" value="5" icon={UserCog} accent="primary" />
        </div>
        <Surface padded={false}>
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-surface-muted px-3 py-1.5">
              <Search className="h-3.5 w-3.5 text-muted-foreground"/>
              <input placeholder="Search by name, role, zone…" className="flex-1 bg-transparent text-[13px] outline-none"/>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[12.5px] min-w-[720px]">
              <thead className="bg-surface-muted text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
                <tr><th className="px-4 py-3 text-left">Staff ID</th><th className="px-4 py-3 text-left">Name</th><th className="px-4 py-3 text-left">Role</th><th className="px-4 py-3 text-left">Zone</th><th className="px-4 py-3 text-left">Shift</th><th className="px-4 py-3 text-right">Status</th></tr>
              </thead>
              <tbody>
                {STAFF.map(s => (
                  <tr key={s.id} className="border-t border-border hover:bg-surface-muted/60">
                    <td className="px-4 py-3 font-mono font-bold">{s.id}</td>
                    <td className="px-4 py-3"><div className="flex items-center gap-2.5"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-[10.5px] font-black text-primary">{s.name.split(" ").map(n=>n[0]).slice(0,2).join("")}</div><span className="font-bold">{s.name}</span></div></td>
                    <td className="px-4 py-3">{s.role}</td>
                    <td className="px-4 py-3 text-muted-foreground">{s.zone}</td>
                    <td className="px-4 py-3">{s.shift}</td>
                    <td className="px-4 py-3 text-right"><StatusChip tone={s.status==="Cleaning"?"primary":s.status==="Available"?"success":s.status==="Break"?"warning":s.status==="Offline"?"neutral":"info"}>{s.status}</StatusChip></td>
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

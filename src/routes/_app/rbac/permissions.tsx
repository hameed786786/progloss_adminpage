import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { Surface } from "@/components/app/Surface";
import { ROLES, PERM_MODULES, PERM_ACTIONS, PERM_MATRIX } from "@/lib/data";
import { ShieldCheck, Save, Search } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_app/rbac/permissions")({ component: Permissions });

function Cell({ v }: { v: number }) {
  if (v === 1) return <div className="mx-auto h-5 w-5 rounded-md bg-primary flex items-center justify-center text-[10px] font-black text-primary-foreground">✓</div>;
  if (v === 0.5) return <div className="mx-auto h-5 w-5 rounded-md bg-[oklch(0.97_0.06_75)] border border-[oklch(0.85_0.12_75)] flex items-center justify-center text-[9px] font-black text-[oklch(0.45_0.13_60)]">½</div>;
  return <div className="mx-auto h-5 w-5 rounded-md bg-surface-muted border border-border" />;
}

function Permissions() {
  const [role, setRole] = useState(ROLES[1].name);
  const matrix = PERM_MATRIX[role];
  return (
    <>
      <TopBar title="Permission Matrix" subtitle="Enterprise-grade RBAC · 8 roles · 12 modules · 7 actions" actions={
        <button className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-primary px-3 text-[12.5px] font-bold text-primary-foreground hover:bg-primary/90"><Save className="h-3.5 w-3.5" /> Save changes</button>
      }/>
      <div className="grid gap-4 px-6 py-6 xl:grid-cols-4">
        <Surface className="xl:col-span-1">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-surface-muted px-2.5 py-1.5 text-[12px] mb-3">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
            <input className="w-full bg-transparent outline-none" placeholder="Find a role…" />
          </div>
          <div className="space-y-1">
            {ROLES.map((r) => (
              <button key={r.id} onClick={() => setRole(r.name)} className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition-colors ${role === r.name ? "bg-primary/8 ring-1 ring-primary/20" : "hover:bg-accent"}`}>
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${role === r.name ? "bg-primary text-primary-foreground" : "bg-surface-muted text-muted-foreground"}`}>
                  <ShieldCheck className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 min-w-0 leading-tight">
                  <div className="text-[12.5px] font-bold truncate">{r.name}</div>
                  <div className="text-[10.5px] text-muted-foreground truncate">{r.users} users · {r.id}</div>
                </div>
              </button>
            ))}
          </div>
        </Surface>

        <Surface padded={false} className="xl:col-span-3 overflow-hidden">
          <div className="border-b border-border px-5 py-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Editing role</div>
            <div className="mt-0.5 text-[18px] font-black tracking-tight">{role}</div>
            <div className="text-[12px] text-muted-foreground">{ROLES.find(r => r.name === role)?.desc}</div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead className="bg-surface-muted/50 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left">Module</th>
                  {PERM_ACTIONS.map(a => <th key={a} className="px-2 py-3 text-center min-w-[68px]">{a}</th>)}
                </tr>
              </thead>
              <tbody>
                {PERM_MODULES.map((m) => (
                  <tr key={m} className="border-t border-border hover:bg-surface-muted/30">
                    <td className="px-4 py-2.5 font-bold text-foreground">{m}</td>
                    {(matrix[m] ?? [0,0,0,0,0,0,0]).map((v: number, i: number) => (
                      <td key={i} className="px-2 py-2.5"><Cell v={v} /></td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-border px-5 py-3 text-[11.5px]">
            <div className="flex items-center gap-3 text-muted-foreground">
              <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-primary"></span>Full</span>
              <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-[oklch(0.97_0.06_75)] ring-1 ring-[oklch(0.85_0.12_75)]"></span>Partial</span>
              <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-surface-muted ring-1 ring-border"></span>None</span>
            </div>
            <span className="text-muted-foreground">Changes auto-versioned · last saved 2m ago</span>
          </div>
        </Surface>
      </div>
    </>
  );
}

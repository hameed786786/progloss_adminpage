import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { Surface } from "@/components/app/Surface";
import { SuccessCard } from "@/components/app/SuccessCard";
import { ShieldCheck, Save, Search, ChevronDown } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { fetchStaff, saveRolePermissions, fetchRolePermissions, fetchRoles } from "@/lib/apiClient";
import useRealtime from "@/lib/useRealtime";

export const Route = createFileRoute("/_app/rbac/permissions")({ component: Permissions });

function Cell({ v, onClick }: { v: number; onClick?: () => void }) {
  const base = "mx-auto h-5 w-5 rounded-md flex items-center justify-center cursor-pointer";
  if (v === 1) return <div onClick={onClick} className={`${base} bg-primary text-[10px] font-black text-primary-foreground`}>✓</div>;
  if (v === 0.5) return <div onClick={onClick} className={`${base} bg-[oklch(0.97_0.06_75)] border border-[oklch(0.85_0.12_75)] text-[9px] font-black text-[oklch(0.45_0.13_60)]`}>½</div>;
  return <div onClick={onClick} className={`${base} bg-surface-muted border border-border`} />;
}

function Permissions() {
  const staff = useRealtime('staff', fetchStaff, 'staff:update');
  const roleDefs = useRealtime('roles', fetchRoles, 'roles:update');
  const roles = useMemo(() => {
    const dbRoles = (roleDefs ?? []).map((def) => {
      const name = def.name ?? 'User';
      const users = staff.filter((member) => (member.role ?? 'User') === name).length;
      return {
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name,
        users,
        desc: def.desc || 'Managed by super admin',
      };
    }).filter(r => r.name !== 'Super Admin');

    if (dbRoles.length > 0) return dbRoles;

    const fallbackMap = new Map<string, { id: string; name: string; users: number; desc: string }>();
    for (const member of staff) {
      const name = member.role ?? 'User';
      const current = fallbackMap.get(name) ?? { id: name.toLowerCase().replace(/\s+/g, '-'), name, users: 0, desc: 'Derived from live staff records' };
      current.users += 1;
      fallbackMap.set(name, current);
    }
    return [...fallbackMap.values()].filter(r => r.name !== 'Super Admin');
  }, [staff, roleDefs]);
  const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  let initialRoleFromUrl = urlParams.get('role') ?? undefined;
  if (initialRoleFromUrl === 'Super Admin') initialRoleFromUrl = undefined;
  const [role, setRole] = useState(initialRoleFromUrl ?? roles[0]?.name ?? 'User');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const PERM_MODULES = ['Dashboard', 'Customers', 'Billing', 'Operations', 'Staff', 'Subscriptions', 'RBAC', 'Reports'];
  const PERM_ACTIONS = ['View', 'Create', 'Edit', 'Delete', 'Approve', 'Export', 'Admin'];
  const defaultMatrix = Object.fromEntries(PERM_MODULES.map((module) => [module, PERM_ACTIONS.map((_, index) => (index < 2 ? 1 : 0))]));
  const [matrixState, setMatrixState] = useState<Record<string, number[]>>(defaultMatrix);

  // Load persisted matrix for role if exists
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const remote = await fetchRolePermissions(role);
        if (!mounted) return;
        if (remote) setMatrixState(remote);
        else setMatrixState(Object.fromEntries(PERM_MODULES.map((m) => [m, PERM_ACTIONS.map((_, index) => (index < 2 ? 1 : 0))])));
      } catch (err) {
        if (mounted) setMatrixState(defaultMatrix);
      }
    })();
    return () => { mounted = false };
  }, [role, roleDefs]);

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    window.setTimeout(() => setSuccessMessage((current) => (current === message ? null : current)), 3000);
  };

  return (
    <>
      <TopBar title="Permission Matrix" subtitle="Enterprise-grade RBAC · 8 roles · 12 modules · 7 actions" actions={
        <button className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-primary px-3 text-[12.5px] font-bold text-primary-foreground hover:bg-primary/90"><Save className="h-3.5 w-3.5" /> Save</button>
      }/>
      <div className="grid gap-4 px-4 py-4 md:px-6 md:py-6 xl:grid-cols-4">
        {successMessage ? (
          <div className="xl:col-span-4">
            <SuccessCard
              title="Permissions saved"
              message={successMessage}
              onDismiss={() => setSuccessMessage(null)}
            />
          </div>
        ) : null}
        {/* Mobile role picker */}
        <div className="xl:hidden">
          <button onClick={() => setPickerOpen(!pickerOpen)} className="flex w-full items-center justify-between rounded-xl border border-border bg-surface px-3 py-2.5 text-left shadow-card">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"><ShieldCheck className="h-3.5 w-3.5" /></div>
              <div className="leading-tight">
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Editing role</div>
                <div className="text-[13px] font-black">{role}</div>
              </div>
            </div>
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${pickerOpen ? "rotate-180" : ""}`} />
          </button>
          {pickerOpen && (
            <div className="mt-2 max-h-72 overflow-y-auto rounded-xl border border-border bg-surface p-1.5 shadow-card">
              {roles.map((r) => (
                <button key={r.id} onClick={() => { setRole(r.name); setPickerOpen(false); }} className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left ${role === r.name ? "bg-primary/8" : "hover:bg-accent"}`}>
                  <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground" />
                  <div className="flex-1 min-w-0"><div className="text-[12.5px] font-bold truncate">{r.name}</div><div className="text-[10.5px] text-muted-foreground truncate">{r.users} users</div></div>
                </button>
              ))}
            </div>
          )}
        </div>

        <Surface className="hidden xl:block xl:col-span-1">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-surface-muted px-2.5 py-1.5 text-[12px] mb-3">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
            <input className="w-full bg-transparent outline-none" placeholder="Find a role…" />
          </div>
          <div className="space-y-1">
            {roles.map((r) => (
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
            <div className="hidden xl:block border-b border-border px-5 py-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Editing role</div>
            <div className="mt-0.5 text-[18px] font-black tracking-tight">{role}</div>
            <div className="text-[12px] text-muted-foreground">{roles.find(r => r.name === role)?.desc}</div>
          </div>
          <div className="overflow-x-auto -webkit-overflow-scrolling-touch">
            <table className="w-full text-[12px] min-w-160">
              <thead className="bg-surface-muted/50 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="sticky left-0 z-10 bg-surface-muted/95 backdrop-blur px-3 py-3 text-left">Module</th>
                  {PERM_ACTIONS.map(a => <th key={a} className="px-2 py-3 text-center min-w-15">{a}</th>)}
                </tr>
              </thead>
              <tbody>
                {PERM_MODULES.map((m) => (
                  <tr key={m} className="border-t border-border hover:bg-surface-muted/30">
                    <td className="sticky left-0 z-10 bg-surface px-3 py-2.5 font-bold text-foreground">{m}</td>
                            {(matrixState[m] ?? [0,0,0,0,0,0,0]).map((v: number, i: number) => (
                                <td key={i} className="px-2 py-2.5">
                                  <Cell v={v} onClick={() => {
                                    setMatrixState((prev) => {
                                      const next = { ...prev };
                                      const arr = [...(next[m] ?? [0,0,0,0,0,0,0])];
                                      arr[i] = arr[i] === 0 ? 1 : arr[i] === 1 ? 0.5 : 0;
                                      next[m] = arr;
                                      return next;
                                    });
                                  }} />
                                </td>
                              ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-4 py-3 text-[11px]">
            <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
              <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-primary"></span>Full</span>
              <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-[oklch(0.97_0.06_75)] ring-1 ring-[oklch(0.85_0.12_75)]"></span>Partial</span>
              <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-surface-muted ring-1 ring-border"></span>None</span>
            </div>
              <div className="flex items-center gap-2">
              <button onClick={async () => {
                await saveRolePermissions(role, matrixState);
                showSuccess(`Saved permissions for ${role}.`);
              }} className="inline-flex h-8 items-center gap-2 rounded-xl bg-primary px-3 text-[12px] font-bold text-primary-foreground">Save</button>
              <span className="text-muted-foreground">Auto-versioned · saved just now</span>
            </div>
          </div>
        </Surface>
      </div>
    </>
  );
}

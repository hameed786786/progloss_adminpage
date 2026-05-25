import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { Surface } from "@/components/app/Surface";
import { StatusChip } from "@/components/app/StatusChip";
import { SuccessCard } from "@/components/app/SuccessCard";
import { ShieldCheck, MoreHorizontal, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { fetchStaff, saveRole, fetchRoles } from "@/lib/apiClient";
import useRealtime from "@/lib/useRealtime";

export const Route = createFileRoute("/_app/rbac/roles")({ component: Roles });

function Roles() {
  const staff = useRealtime('staff', fetchStaff, 'staff:update');
  const remoteRoles = useRealtime('roles', fetchRoles, 'roles:update');

  const roles = useMemo(() => {
    const map: Record<string, { id: string; name: string; desc?: string; users: number }> = {};
    for (const s of staff) {
      const role = s.role ?? 'User';
      if (!map[role]) map[role] = { id: role.toLowerCase().replace(/\s+/g, '-'), name: role, users: 0 };
      map[role].users++;
    }
    for (const r of remoteRoles) {
      if (!map[r.name]) map[r.name] = { id: r.name.toLowerCase().replace(/\s+/g, '-'), name: r.name, users: 0, desc: r.desc };
      else if (r.desc) map[r.name].desc = r.desc;
    }
    return Object.values(map);
  }, [staff, remoteRoles]);

  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    window.setTimeout(() => setSuccessMessage((current) => (current === message ? null : current)), 3000);
  };

  async function handleCreate() {
    if (!name.trim()) return;
    const newRole = { name: name.trim(), desc: desc.trim() };
    await saveRole(newRole);
    setCreating(false);
    setName('');
    setDesc('');
    showSuccess(`Created role ${newRole.name}.`);
  }

  

  return (
    <>
      <TopBar title="Roles" subtitle={`${roles.length} roles · ${staff.length} users assigned`} actions={
        <button onClick={() => setCreating(true)} className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-primary px-3 text-[12.5px] font-bold text-primary-foreground hover:bg-primary/90"><Plus className="h-3.5 w-3.5" /> New role</button>
      } />
      <div className="px-6 py-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {successMessage ? (
          <div className="md:col-span-2 xl:col-span-3">
            <SuccessCard title="Role updated" message={successMessage} onDismiss={() => setSuccessMessage(null)} />
          </div>
        ) : null}
        {roles.map((r) => (
          <Surface key={r.id}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><ShieldCheck className="h-4 w-4" /></div>
                <div>
                  <div className="text-[14px] font-black tracking-tight">{r.name}</div>
                  <div className="text-[11px] text-muted-foreground">{r.id}</div>
                </div>
              </div>
              {/* Show three-dots button but no dropdown functionality */}
              <button
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                aria-label={`Role actions for ${r.name}`}
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-3 text-[12.5px] text-foreground/80">{r.desc}</p>
            <div className="mt-4 flex items-center justify-between text-[11.5px]">
              <StatusChip tone="primary">{r.users} users</StatusChip>
              <Link
                to="/rbac/permissions"
                search={{ role: r.name }}
                className="font-bold text-primary hover:underline"
              >
                Manage permissions →
              </Link>
            </div>
          </Surface>
        ))}
      </div>

      {creating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-full max-w-lg rounded-xl bg-surface p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="text-lg font-black">Create new role</div>
              <button onClick={() => setCreating(false)} className="text-muted-foreground">✕</button>
            </div>
            <div className="mt-4 space-y-3">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Role name" className="w-full rounded-lg border border-border px-3 py-2" />
              <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Description (optional)" className="w-full rounded-lg border border-border px-3 py-2" />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setCreating(false)} className="rounded-lg px-3 py-2">Cancel</button>
              <button onClick={handleCreate} className="rounded-lg bg-primary px-3 py-2 text-primary-foreground font-bold">Create</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

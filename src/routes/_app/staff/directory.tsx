import { useEffect, useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { Surface } from "@/components/app/Surface";
import { KpiCard } from "@/components/app/KpiCard";
import { StatusChip } from "@/components/app/StatusChip";
import { SuccessCard } from "@/components/app/SuccessCard";
import { UserCog, Search, Plus } from "lucide-react";
import { fetchStaff, saveStaff, getCurrentUserRole } from "@/lib/apiClient";
import { fetchRoles } from "@/lib/apiClient";
import useRealtime from "@/lib/useRealtime";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const STAFF_ROLE_OPTIONS = ["Senior Technician", "Technician", "Supervisor", "Office Admin"] as const;
const STAFF_STATUS_OPTIONS = ["Cleaning", "En Route", "Available", "Break", "Offline"] as const;

export const Route = createFileRoute("/_app/staff/directory")({ component: Page });

function Page() {
  const [staff, setStaff] = useState<any[]>([]);
  const liveStaff = useRealtime('staff', fetchStaff, 'staff:update');
  const liveRoles = useRealtime('roles', fetchRoles, 'roles:update');
  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [noUsers, setNoUsers] = useState<boolean | null>(null);
  const [form, setForm] = useState({
    id: '',
    name: '',
    role: 'Technician',
    zone: '',
    status: 'Available',
    shift: '',
  });

  useEffect(() => {
    setStaff(liveStaff);
  }, [liveStaff]);

  useEffect(() => {
    let mounted = true;
    fetch('/api/setup')
      .then((r) => r.json())
      .then((payload) => {
        if (!mounted) return;
        if (payload && payload.success && payload.data) setNoUsers(Boolean(payload.data.noUsers));
      })
      .catch(() => {
        if (mounted) setNoUsers(false);
      });
    return () => { mounted = false };
  }, []);

  const roleOptions = useMemo(() => {
    const names = liveRoles
      .map((role) => role?.name)
      .filter((name): name is string => Boolean(name && name.trim()));
    const unique = Array.from(new Set(names));
    return unique.length > 0 ? unique : ["Super Admin", "Operations Admin", "Finance Admin", "Dispatcher", "Support Agent", "Inventory Manager", "Supervisor", "Staff"];
  }, [liveRoles]);

  const rows = staff;
  const technicians = rows.filter((member) => /technician/i.test(member.role ?? "")).length;
  const supervisors = rows.filter((member) => /supervisor|lead/i.test(member.role ?? "")).length;
  const office = Math.max(rows.length - technicians - supervisors, 0);

  const filteredRows = useMemo(() => {
    if (!search) return rows;
    const q = search.toLowerCase().trim();
    return rows.filter((s) => ((s.name||'') + ' ' + (s.role||'') + ' ' + (s.zone||'')).toLowerCase().includes(q));
  }, [rows, search]);

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    window.setTimeout(() => setSuccessMessage((current) => (current === message ? null : current)), 3000);
  };

  const handleCreateStaff = async () => {
    if (!form.name.trim()) {
      setFormError('Name is required.');
      return;
    }
    setFormError(null);
    const trimmedName = form.name.trim();
    const generatedId = `PRG-T-${Math.abs(trimmedName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % 1000}`;
    setSaving(true);
    try {
      const role = form.role.trim();
      const resolvedRole = roleOptions.includes(role) ? role : roleOptions[0] ?? 'Technician';
      await saveStaff({
        id: form.id.trim() || generatedId,
        name: trimmedName,
        role: resolvedRole,
        zone: form.zone.trim() || '—',
        status: form.status.trim() || 'Available',
        shift: form.shift.trim() || '—',
      });
      setCreateOpen(false);
      setForm({ id: '', name: '', role: 'Technician', zone: '', status: 'Available', shift: '' });
      showSuccess(`Added ${trimmedName} to staff.`);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Failed to create staff member.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <TopBar title="Staff Directory" subtitle={`${rows.length} employees · Dubai operations`} actions={
        (import.meta.env.DEV || getCurrentUserRole() === 'Super Admin' || noUsers === true) ? (
          <button onClick={() => setCreateOpen(true)} className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-primary px-3 text-[12.5px] font-bold text-primary-foreground"><Plus className="h-3.5 w-3.5"/> Add staff</button>
        ) : (
          <button disabled className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-surface-muted px-3 text-[12.5px] font-bold text-muted-foreground" title={noUsers ? 'First-run setup: create initial staff' : 'Sign in as Super Admin to add staff'}><Plus className="h-3.5 w-3.5"/> Add staff</button>
        )
      }/>
      <div className="px-6 py-6 space-y-6">
        {successMessage ? (
          <SuccessCard title="Staff saved" message={successMessage} onDismiss={() => setSuccessMessage(null)} />
        ) : null}
        <div className="grid gap-4 md:grid-cols-4">
          <KpiCard label="Total staff" value={rows.length.toString()} icon={UserCog} accent="primary" />
          <KpiCard label="Technicians" value={technicians.toString()} icon={UserCog} accent="primary" />
          <KpiCard label="Supervisors" value={supervisors.toString()} icon={UserCog} accent="primary" />
          <KpiCard label="Office / admin" value={office.toString()} icon={UserCog} accent="primary" />
        </div>
        <Surface padded={false}>
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <div className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-surface-muted px-3 py-1.5">
              <Search className="h-3.5 w-3.5 text-muted-foreground"/>
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, role, zone…" className="flex-1 bg-transparent text-[13px] outline-none"/>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[12.5px] min-w-180">
              <thead className="bg-surface-muted text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
                <tr><th className="px-4 py-3 text-left">Staff ID</th><th className="px-4 py-3 text-left">Name</th><th className="px-4 py-3 text-left">Role</th><th className="px-4 py-3 text-left">Zone</th><th className="px-4 py-3 text-left">Shift</th><th className="px-4 py-3 text-right">Status</th></tr>
              </thead>
              <tbody>
                {filteredRows.map(s => (
                  <tr key={s.id} className="border-t border-border hover:bg-surface-muted/60">
                    <td className="px-4 py-3 font-mono font-bold">{s.id}</td>
                    <td className="px-4 py-3"><div className="flex items-center gap-2.5"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-[10.5px] font-black text-primary">{s.name.split(" ").map(n=>n[0]).slice(0,2).join("")}</div><span className="font-bold">{s.name}</span></div></td>
                    <td className="px-4 py-3">{s.role}</td>
                    <td className="px-4 py-3 text-muted-foreground">{s.zone}</td>
                    <td className="px-4 py-3">{s.shift ?? "—"}</td>
                    <td className="px-4 py-3 text-right"><StatusChip tone={s.status==="Cleaning"?"primary":s.status==="Available"?"success":s.status==="Break"?"warning":s.status==="Offline"?"neutral":"info"}>{s.status}</StatusChip></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Surface>
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add staff member</DialogTitle>
            <DialogDescription>Create a new staff record. ID is optional and will be generated if left blank.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 py-2">
            <label className="grid gap-1 text-sm">
              <span className="text-[12px] font-bold text-muted-foreground">Staff ID</span>
              <input value={form.id} onChange={(e) => setForm((current) => ({ ...current, id: e.target.value }))} className="h-10 rounded-xl border border-border bg-surface px-3 text-sm outline-none" placeholder="PRG-T-999" />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-[12px] font-bold text-muted-foreground">Name</span>
              <input value={form.name} onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))} className="h-10 rounded-xl border border-border bg-surface px-3 text-sm outline-none" placeholder="Enter staff name" />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-[12px] font-bold text-muted-foreground">Role</span>
              <Select value={form.role} onValueChange={(value) => setForm((current) => ({ ...current, role: value }))}>
                <SelectTrigger className="h-10 rounded-xl border-border bg-surface px-3 text-sm outline-none">
                  <SelectValue placeholder="Choose a role" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="grid gap-1 text-sm">
                <span className="text-[12px] font-bold text-muted-foreground">Zone</span>
                <input value={form.zone} onChange={(e) => setForm((current) => ({ ...current, zone: e.target.value }))} className="h-10 rounded-xl border border-border bg-surface px-3 text-sm outline-none" placeholder="Marina" />
              </label>
              <label className="grid gap-1 text-sm">
                <span className="text-[12px] font-bold text-muted-foreground">Status</span>
                <Select value={form.status} onValueChange={(value) => setForm((current) => ({ ...current, status: value }))}>
                  <SelectTrigger className="h-10 rounded-xl border-border bg-surface px-3 text-sm outline-none">
                    <SelectValue placeholder="Choose a status" />
                  </SelectTrigger>
                  <SelectContent>
                    {STAFF_STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>
            </div>
            <label className="grid gap-1 text-sm">
              <span className="text-[12px] font-bold text-muted-foreground">Shift</span>
              <input value={form.shift} onChange={(e) => setForm((current) => ({ ...current, shift: e.target.value }))} className="h-10 rounded-xl border border-border bg-surface px-3 text-sm outline-none" placeholder="Morning" />
            </label>
            {formError ? <p className="text-[12px] font-medium text-red-600">{formError}</p> : null}
          </div>

          <DialogFooter>
            <button onClick={() => setCreateOpen(false)} className="h-10 rounded-xl border border-border px-4 text-sm font-bold">Cancel</button>
            <button disabled={saving || !form.name.trim()} onClick={handleCreateStaff} className="h-10 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground disabled:opacity-50">{saving ? 'Saving...' : 'Save staff'}</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { Surface, SectionTitle } from "@/components/app/Surface";
import { SuccessCard } from "@/components/app/SuccessCard";
import { StatusChip } from "@/components/app/StatusChip";
import { Plus, Sparkles, Repeat, Car, Check } from "lucide-react";
import { fetchPlans, savePlan, updatePlan } from "@/lib/apiClient";
import { useEffect, useMemo, useState } from "react";
import useRealtime from "@/lib/useRealtime";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/_app/subscriptions/plans")({ component: PlansPage });

function PlansPage() {
  const displayPlans = useRealtime('plans', fetchPlans, 'plans:update');
  const [localPlans, setLocalPlans] = useState<any[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editPlan, setEditPlan] = useState<any | null>(null);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    price: '',
    freq: 'monthly',
    washes: '',
    vehicles: '',
    perks: '',
  });

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    window.setTimeout(() => setSuccessMessage((current) => (current === message ? null : current)), 3000);
  };

  useEffect(() => {
    return () => setSuccessMessage(null);
  }, []);

  useEffect(() => {
    setLocalPlans(displayPlans);
  }, [displayPlans]);

  const plans = useMemo(() => {
    const map = new Map<string, any>();
    for (const plan of displayPlans) map.set(plan.id, plan);
    for (const plan of localPlans) map.set(plan.id, plan);
    return Array.from(map.values());
  }, [displayPlans, localPlans]);

  const handleNew = async () => {
    const name = window.prompt('Plan name');
    if (!name) return;
    const price = Number(window.prompt('Price (number)', '0')) || 0;
    const id = name.toLowerCase().replace(/\s+/g, '-');
    try {
      await savePlan({ id, name, price, freq: 'monthly', washes: 0, vehicles: 1, perks: [], active: 0 });
      setLocalPlans((current) => [...current.filter((plan) => plan.id !== id), { id, name, price, freq: 'monthly', washes: 0, vehicles: 1, perks: [], active: 0 }]);
      showSuccess(`Created plan ${name}.`);
    } catch (err) {
      console.error('Failed to save plan', err);
    }
  };

  const handleEdit = async (p: any) => {
    setEditPlan(p);
    setEditForm({
      name: p.name ?? '',
      price: String(p.price ?? 0),
      freq: p.freq ?? 'monthly',
      washes: String(p.washes ?? 0),
      vehicles: String(p.vehicles ?? 1),
      perks: Array.isArray(p.perks) ? p.perks.join(', ') : '',
    });
    setEditError(null);
    setEditOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editPlan) return;
    const name = editForm.name.trim();
    if (!name) {
      setEditError('Plan name is required.');
      return;
    }

    const payload = {
      ...editPlan,
      name,
      price: Number(editForm.price) || 0,
      freq: editForm.freq,
      washes: Number(editForm.washes) || 0,
      vehicles: Number(editForm.vehicles) || 1,
      perks: editForm.perks
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    };

    setEditSaving(true);
    setEditError(null);
    try {
      await updatePlan(editPlan.id, payload);
      setLocalPlans((current) => current.map((plan) => (plan.id === editPlan.id ? { ...plan, ...payload, id: editPlan.id } : plan)));
      showSuccess(`Updated plan ${name}.`);
      setEditOpen(false);
      setEditPlan(null);
    } catch (err) {
      setEditError(err instanceof Error ? err.message : 'Failed to update plan.');
      console.error('Failed to update plan', err);
    } finally {
      setEditSaving(false);
    }
  };
  return (
    <>
      <TopBar title="Subscription Plans" subtitle="Manage pricing, frequency, perks and vehicle support"
        actions={<button onClick={handleNew} className="hidden md:inline-flex h-9 items-center gap-1.5 rounded-xl bg-primary px-3 text-[12.5px] font-bold text-primary-foreground hover:bg-primary/90"><Plus className="h-3.5 w-3.5" /> New plan</button>}/>
      <div className="px-6 py-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {successMessage ? (
          <div className="md:col-span-2 xl:col-span-4">
            <SuccessCard
              title="Plan saved"
              message={successMessage}
              onDismiss={() => setSuccessMessage(null)}
            />
          </div>
        ) : null}
        {plans.map((p, i) => (
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
              {(p.perks ?? []).map((b: string) => (
                <li key={b} className="flex items-start gap-2"><Check className="mt-0.5 h-3.5 w-3.5 text-primary shrink-0" /><span className="text-foreground/80">{b}</span></li>
              ))}
            </ul>
            <div className="mt-4 border-t border-border pt-3 flex items-center justify-between text-[11.5px]">
              <span className="text-muted-foreground">{p.active ?? 0} active</span>
              <button onClick={() => handleEdit(p)} className="text-primary font-bold hover:underline">Edit plan</button>
            </div>
          </Surface>
        ))}
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit plan</DialogTitle>
            <DialogDescription>Update the plan details without using browser prompts.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 py-2">
            <label className="grid gap-1 text-sm">
              <span className="text-[12px] font-bold text-muted-foreground">Plan name</span>
              <input
                value={editForm.name}
                onChange={(e) => setEditForm((current) => ({ ...current, name: e.target.value }))}
                className="h-10 rounded-xl border border-border bg-surface px-3 text-sm outline-none"
                placeholder="Plan name"
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="grid gap-1 text-sm">
                <span className="text-[12px] font-bold text-muted-foreground">Price (AED)</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={editForm.price}
                  onChange={(e) => setEditForm((current) => ({ ...current, price: e.target.value }))}
                  className="h-10 rounded-xl border border-border bg-surface px-3 text-sm outline-none"
                  placeholder="0"
                />
              </label>

              <label className="grid gap-1 text-sm">
                <span className="text-[12px] font-bold text-muted-foreground">Frequency</span>
                <Select value={editForm.freq} onValueChange={(value) => setEditForm((current) => ({ ...current, freq: value }))}>
                  <SelectTrigger className="h-10 rounded-xl border-border bg-surface px-3 text-sm outline-none">
                    <SelectValue placeholder="Choose frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {['weekly', 'bi-weekly', 'monthly'].map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="grid gap-1 text-sm">
                <span className="text-[12px] font-bold text-muted-foreground">Washes</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={editForm.washes}
                  onChange={(e) => setEditForm((current) => ({ ...current, washes: e.target.value }))}
                  className="h-10 rounded-xl border border-border bg-surface px-3 text-sm outline-none"
                  placeholder="0"
                />
              </label>
              <label className="grid gap-1 text-sm">
                <span className="text-[12px] font-bold text-muted-foreground">Vehicles</span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={editForm.vehicles}
                  onChange={(e) => setEditForm((current) => ({ ...current, vehicles: e.target.value }))}
                  className="h-10 rounded-xl border border-border bg-surface px-3 text-sm outline-none"
                  placeholder="1"
                />
              </label>
            </div>

            <label className="grid gap-1 text-sm">
              <span className="text-[12px] font-bold text-muted-foreground">Perks</span>
              <textarea
                value={editForm.perks}
                onChange={(e) => setEditForm((current) => ({ ...current, perks: e.target.value }))}
                className="min-h-24 rounded-xl border border-border bg-surface px-3 py-2 text-sm outline-none"
                placeholder="Enter perks separated by commas"
              />
            </label>

            {editError ? <p className="text-[12px] font-medium text-red-600">{editError}</p> : null}
          </div>

          <DialogFooter>
            <button onClick={() => setEditOpen(false)} className="h-10 rounded-xl border border-border px-4 text-sm font-bold">
              Cancel
            </button>
            <button
              disabled={editSaving || !editForm.name.trim()}
              onClick={handleSaveEdit}
              className="h-10 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground disabled:opacity-50"
            >
              {editSaving ? 'Saving...' : 'Save changes'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

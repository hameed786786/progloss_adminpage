import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { Surface } from "@/components/app/Surface";
import { StatusChip } from "@/components/app/StatusChip";
import { Building2, Users, Car, Wrench, Banknote } from "lucide-react";
import { fetchCustomers, fetchStaff, fetchInvoices } from "@/lib/apiClient";
import useRealtime from "@/lib/useRealtime";

export const Route = createFileRoute("/_app/apartments/communities")({ component: Communities });

function Communities() {
  const customers = useRealtime('customers', fetchCustomers, 'customers:update');
  const staff = useRealtime('staff', fetchStaff, 'staff:update');
  const invoices = useRealtime('invoices', fetchInvoices, 'invoices:update');

  const communities = Array.from(new Set(customers.map((c) => c.community).filter(Boolean))).map((name) => {
    const cust = customers.filter((c) => c.community === name);
    const invs = invoices.filter((i) => i.community === name);
    const st = staff.filter((u) => u.building === name || u.zone === name);
    const mrr = invs.reduce((s, x) => s + Number(x.total ?? 0), 0);
    return {
      name,
      units: cust.length || 1,
      vehicles: cust.reduce((s, x) => s + (x.vehicles ?? 0), 0),
      residents: cust.length,
      staff: st.length,
      mrr,
      complaints: invs.filter((x) => x.status !== 'paid').length,
      occupancy: Math.min(100, Math.max(cust.length * 12, 10)),
    };
  });
  return (
    <>
      <TopBar title="Communities" subtitle={`${communities.length} buildings under management · Dubai region`} />
      <div className="px-6 py-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {communities.map((a) => (
          <Surface key={a.name}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Building2 className="h-4.5 w-4.5" /></div>
                <div>
                  <div className="text-[14px] font-black tracking-tight">{a.name}</div>
                  <div className="text-[11px] text-muted-foreground">{a.units} units · Dubai</div>
                </div>
              </div>
              {a.complaints > 0 ? <StatusChip tone={a.complaints > 2 ? "danger" : "warning"}>{a.complaints} open</StatusChip> : <StatusChip tone="success">No issues</StatusChip>}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-[12px]">
              <div className="rounded-xl bg-surface-muted px-3 py-2.5"><div className="flex items-center gap-1 text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground"><Users className="h-3 w-3" /> Residents</div><div className="mt-0.5 text-[16px] font-black tabular-nums">{a.residents}</div></div>
              <div className="rounded-xl bg-surface-muted px-3 py-2.5"><div className="flex items-center gap-1 text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground"><Car className="h-3 w-3" /> Vehicles</div><div className="mt-0.5 text-[16px] font-black tabular-nums">{a.vehicles}</div></div>
              <div className="rounded-xl bg-surface-muted px-3 py-2.5"><div className="flex items-center gap-1 text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground"><Wrench className="h-3 w-3" /> Staff</div><div className="mt-0.5 text-[16px] font-black tabular-nums">{a.staff}</div></div>
              <div className="rounded-xl bg-primary/8 px-3 py-2.5"><div className="flex items-center gap-1 text-[10.5px] font-bold uppercase tracking-wider text-primary"><Banknote className="h-3 w-3" /> MRR</div><div className="mt-0.5 text-[15px] font-black tabular-nums text-primary">AED {a.mrr.toLocaleString()}</div></div>
            </div>
            <div className="mt-3 flex items-center justify-between text-[11.5px]">
              <span className="text-muted-foreground">Occupancy</span>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-24 rounded-full bg-surface-muted overflow-hidden"><div className="h-full rounded-full bg-primary" style={{ width: `${a.occupancy}%` }} /></div>
                <span className="tabular-nums font-bold">{a.occupancy}%</span>
              </div>
            </div>
          </Surface>
        ))}
      </div>
    </>
  );
}

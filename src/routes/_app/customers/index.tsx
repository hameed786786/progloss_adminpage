import { createFileRoute, Link } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { Surface } from "@/components/app/Surface";
import { StatusChip } from "@/components/app/StatusChip";
import { CUSTOMERS } from "@/lib/data";
import { Filter, Download, ChevronDown, MoreHorizontal, Search } from "lucide-react";

export const Route = createFileRoute("/_app/customers/")({ component: CustomersPage });

const STATUS: Record<string, "success" | "warning" | "danger" | "neutral"> = {
  active: "success", paused: "warning", "churn-risk": "danger", cancelled: "neutral",
};

function CustomersPage() {
  return (
    <>
      <TopBar title="Customers" subtitle="1,378 active · 142 new this month · 38 churn-risk" />
      <div className="px-6 py-6 space-y-4">
        <Surface padded={false}>
          <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-3">
            <div className="flex items-center gap-2 rounded-xl border border-border bg-surface-muted px-2.5 py-1.5 text-[12.5px]">
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
              <input placeholder="Search name, email, plate…" className="w-64 bg-transparent outline-none" />
            </div>
            {["All status","Plan","Community","Vehicles"].map((f) => (
              <button key={f} className="inline-flex items-center gap-1 rounded-xl border border-border bg-surface px-3 py-1.5 text-[12px] font-bold text-foreground hover:bg-accent">
                {f} <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </button>
            ))}
            <div className="ml-auto flex items-center gap-2">
              <button className="inline-flex items-center gap-1 rounded-xl border border-border bg-surface px-3 py-1.5 text-[12px] font-bold hover:bg-accent"><Filter className="h-3 w-3" /> Saved views</button>
              <button className="inline-flex items-center gap-1 rounded-xl border border-border bg-surface px-3 py-1.5 text-[12px] font-bold hover:bg-accent"><Download className="h-3 w-3" /> Export</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[12.5px]">
              <thead className="bg-surface-muted/60 text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5 text-left">Customer</th>
                  <th className="px-4 py-2.5 text-left">Community</th>
                  <th className="px-4 py-2.5 text-right">Vehicles</th>
                  <th className="px-4 py-2.5 text-left">Plan</th>
                  <th className="px-4 py-2.5 text-left">Status</th>
                  <th className="px-4 py-2.5 text-left">Since</th>
                  <th className="px-4 py-2.5 text-right">LTV (AED)</th>
                  <th className="px-4 py-2.5"></th>
                </tr>
              </thead>
              <tbody>
                {CUSTOMERS.map((c) => (
                  <tr key={c.id} className="border-t border-border hover:bg-surface-muted/40">
                    <td className="px-4 py-3">
                      <Link to="/customers/$id" params={{ id: c.id }} className="group flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-[11px] font-black text-primary">
                          {c.name.split(" ").map(n=>n[0]).slice(0,2).join("")}
                        </div>
                        <div className="leading-tight">
                          <div className="font-bold text-foreground group-hover:text-primary">{c.name}</div>
                          <div className="text-[11px] text-muted-foreground">{c.email}</div>
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-foreground/80">{c.community}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{c.vehicles}</td>
                    <td className="px-4 py-3">{c.plan}</td>
                    <td className="px-4 py-3"><StatusChip tone={STATUS[c.status]}>{c.status}</StatusChip></td>
                    <td className="px-4 py-3 text-muted-foreground">{c.since}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-bold">{c.ltv.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right"><button className="text-muted-foreground hover:text-foreground"><MoreHorizontal className="h-4 w-4" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-border px-4 py-3 text-[11.5px] text-muted-foreground">
            <span>Showing 1–8 of 1,378 customers</span>
            <div className="flex items-center gap-1">
              <button className="rounded-md border border-border bg-surface px-2 py-1 hover:bg-accent">Prev</button>
              <button className="rounded-md bg-primary px-2.5 py-1 font-bold text-primary-foreground">1</button>
              <button className="rounded-md border border-border bg-surface px-2.5 py-1 hover:bg-accent">2</button>
              <button className="rounded-md border border-border bg-surface px-2.5 py-1 hover:bg-accent">3</button>
              <button className="rounded-md border border-border bg-surface px-2 py-1 hover:bg-accent">Next</button>
            </div>
          </div>
        </Surface>
      </div>
    </>
  );
}

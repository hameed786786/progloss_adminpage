import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { Surface } from "@/components/app/Surface";
import { KpiCard } from "@/components/app/KpiCard";
import { StatusChip } from "@/components/app/StatusChip";
import { APARTMENTS, CUSTOMERS } from "@/lib/data";
import { Car, MapPin, Hash, Search } from "lucide-react";

export const Route = createFileRoute("/_app/apartments/vehicles")({ component: Page });

const VEHICLES = CUSTOMERS.flatMap((c, ci) =>
  Array.from({ length: c.vehicles }).map((_, i) => ({
    plate: `${["P","R","Q","T","S","O","M","N"][(ci+i)%8]}-${10+ci*7+i}-${30000+ci*1100+i*173}`,
    make: ["Range Rover","Lexus LX","Audi Q8","Mercedes G","BMW X5","Tesla Model Y","Porsche Cayenne"][(ci+i)%7],
    color: ["Obsidian Black","Pearl White","Silver","Midnight Blue","Champagne"][(ci+i)%5],
    customer: c.name,
    community: c.community,
    plan: c.plan,
    lastWash: ["Today 09:42","Yesterday","2d ago","3d ago","Today 11:08"][(ci+i)%5],
    status: i === 0 ? "active" : (i % 3 === 0 ? "queued" : "active"),
  }))
);

function Page() {
  return (
    <>
      <TopBar title="Vehicle Mapping" subtitle={`${VEHICLES.length} vehicles registered across ${APARTMENTS.length} communities`} />
      <div className="px-6 py-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <KpiCard label="Total vehicles" value={VEHICLES.length} icon={Car} accent="primary" />
          <KpiCard label="Active today" value={VEHICLES.filter(v=>v.status==="active").length} delta={5.2} icon={Car} accent="success" />
          <KpiCard label="Queued wash" value={VEHICLES.filter(v=>v.status==="queued").length} icon={Hash} accent="warning" />
          <KpiCard label="Communities" value={APARTMENTS.length} icon={MapPin} accent="primary" />
        </div>
        <Surface padded={false}>
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-surface-muted px-3 py-1.5">
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
              <input placeholder="Search plates, vehicles, customers…" className="flex-1 bg-transparent text-[13px] outline-none" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[12.5px] min-w-[720px]">
              <thead className="bg-surface-muted text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left">Plate</th>
                  <th className="px-4 py-3 text-left">Vehicle</th>
                  <th className="px-4 py-3 text-left">Customer</th>
                  <th className="px-4 py-3 text-left">Community</th>
                  <th className="px-4 py-3 text-left">Plan</th>
                  <th className="px-4 py-3 text-left">Last wash</th>
                  <th className="px-4 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {VEHICLES.slice(0, 20).map((v, i) => (
                  <tr key={i} className="border-t border-border hover:bg-surface-muted/60">
                    <td className="px-4 py-3 font-mono font-bold">{v.plate}</td>
                    <td className="px-4 py-3"><div className="font-bold">{v.make}</div><div className="text-[10.5px] text-muted-foreground">{v.color}</div></td>
                    <td className="px-4 py-3">{v.customer}</td>
                    <td className="px-4 py-3 text-muted-foreground">{v.community}</td>
                    <td className="px-4 py-3"><StatusChip tone="primary" dot={false}>{v.plan}</StatusChip></td>
                    <td className="px-4 py-3 text-muted-foreground">{v.lastWash}</td>
                    <td className="px-4 py-3 text-right"><StatusChip tone={v.status==="active"?"success":"warning"}>{v.status}</StatusChip></td>
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

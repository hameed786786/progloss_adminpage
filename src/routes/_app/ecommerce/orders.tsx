import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { Surface } from "@/components/app/Surface";
import { KpiCard } from "@/components/app/KpiCard";
import { StatusChip } from "@/components/app/StatusChip";
import { ShoppingBag, Truck, CheckCircle2, Banknote } from "lucide-react";

export const Route = createFileRoute("/_app/ecommerce/orders")({ component: Page });

const ORDERS = [
  { id: "ORD-2026-2841", customer: "Maryam Al Hashimi", items: 3, total: 685.00, channel: "App", status: "delivered", date: "Today 09:11" },
  { id: "ORD-2026-2842", customer: "Sophia Chen", items: 1, total: 380.00, channel: "Web", status: "shipped", date: "Today 08:42" },
  { id: "ORD-2026-2843", customer: "Aisha Mubarak", items: 2, total: 175.00, channel: "App", status: "processing", date: "Today 08:01" },
  { id: "ORD-2026-2844", customer: "Hamdan Al Suwaidi", items: 5, total: 1240.00, channel: "Concierge", status: "delivered", date: "Yesterday" },
  { id: "ORD-2026-2845", customer: "Karim Boutros", items: 1, total: 220.00, channel: "Web", status: "cancelled", date: "Yesterday" },
  { id: "ORD-2026-2846", customer: "Omar Hourani", items: 4, total: 460.00, channel: "App", status: "shipped", date: "12 May" },
];

function Page() {
  return (
    <>
      <TopBar title="Orders" subtitle="One-off ecommerce orders · fulfilment & status" />
      <div className="px-6 py-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <KpiCard label="Orders (MTD)" value="248" delta={18.4} icon={ShoppingBag} accent="primary" />
          <KpiCard label="Revenue" value="AED 62,180" delta={22.1} icon={Banknote} accent="success" />
          <KpiCard label="In transit" value="14" icon={Truck} accent="primary" />
          <KpiCard label="Fulfilment rate" value="98.4%" delta={0.6} icon={CheckCircle2} accent="success" />
        </div>
        <Surface padded={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-[12.5px] min-w-[720px]">
              <thead className="bg-surface-muted text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
                <tr><th className="px-4 py-3 text-left">Order</th><th className="px-4 py-3 text-left">Customer</th><th className="px-4 py-3 text-right">Items</th><th className="px-4 py-3 text-right">Total</th><th className="px-4 py-3 text-left">Channel</th><th className="px-4 py-3 text-left">Date</th><th className="px-4 py-3 text-right">Status</th></tr>
              </thead>
              <tbody>
                {ORDERS.map(o => (
                  <tr key={o.id} className="border-t border-border hover:bg-surface-muted/60">
                    <td className="px-4 py-3 font-mono font-bold">{o.id}</td>
                    <td className="px-4 py-3">{o.customer}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{o.items}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-bold">AED {o.total.toFixed(2)}</td>
                    <td className="px-4 py-3"><StatusChip tone="info" dot={false}>{o.channel}</StatusChip></td>
                    <td className="px-4 py-3 text-muted-foreground">{o.date}</td>
                    <td className="px-4 py-3 text-right"><StatusChip tone={o.status==="delivered"?"success":o.status==="cancelled"?"danger":o.status==="shipped"?"info":"warning"}>{o.status}</StatusChip></td>
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

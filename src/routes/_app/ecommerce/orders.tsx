import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { Surface } from "@/components/app/Surface";
import { KpiCard } from "@/components/app/KpiCard";
import { StatusChip } from "@/components/app/StatusChip";
import { ShoppingBag, Truck, CheckCircle2, Banknote } from "lucide-react";
import { fetchInvoices } from "@/lib/apiClient";
import useRealtime from "@/lib/useRealtime";

export const Route = createFileRoute("/_app/ecommerce/orders")({ component: Page });

function Page() {
  const invoices = useRealtime('invoices', fetchInvoices, 'invoices:update');

  const orders = useMemo(() => {
    return (invoices || []).map((invoice: any, idx: number) => {
      const state = String(invoice.status || '').toLowerCase();
      const status = state === 'paid' ? 'delivered' : state === 'overdue' ? 'processing' : state === 'cancelled' ? 'cancelled' : 'shipped';
      const channel = idx % 3 === 0 ? 'App' : idx % 3 === 1 ? 'Web' : 'Concierge';
      return {
        id: `ORD-${invoice.id}`,
        customer: invoice.customer,
        items: Math.max(1, Math.round(Number(invoice.total ?? 0) / 220)),
        total: Number(invoice.total ?? 0),
        channel,
        status,
        date: invoice.date,
      };
    });
  }, [invoices]);

  const revenue = orders.reduce((sum, order) => sum + Number(order.total ?? 0), 0);
  const inTransit = orders.filter((order) => order.status === 'shipped' || order.status === 'processing').length;
  const delivered = orders.filter((order) => order.status === 'delivered').length;
  const fulfilmentRate = orders.length ? ((delivered / orders.length) * 100).toFixed(1) : '0.0';

  return (
    <>
      <TopBar title="Orders" subtitle="Live orders derived from billing records" />
      <div className="px-6 py-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <KpiCard label="Orders (MTD)" value={orders.length.toString()} icon={ShoppingBag} accent="primary" />
          <KpiCard label="Revenue" value={`AED ${revenue.toLocaleString()}`} icon={Banknote} accent="success" />
          <KpiCard label="In transit" value={inTransit.toString()} icon={Truck} accent="primary" />
          <KpiCard label="Fulfilment rate" value={`${fulfilmentRate}%`} icon={CheckCircle2} accent="success" />
        </div>
        <Surface padded={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-[12.5px] min-w-180">
              <thead className="bg-surface-muted text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
                <tr><th className="px-4 py-3 text-left">Order</th><th className="px-4 py-3 text-left">Customer</th><th className="px-4 py-3 text-right">Items</th><th className="px-4 py-3 text-right">Total</th><th className="px-4 py-3 text-left">Channel</th><th className="px-4 py-3 text-left">Date</th><th className="px-4 py-3 text-right">Status</th></tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id} className="border-t border-border hover:bg-surface-muted/60">
                    <td className="px-4 py-3 font-mono font-bold">{o.id}</td>
                    <td className="px-4 py-3">{o.customer}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{o.items}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-bold">AED {Number(o.total ?? 0).toFixed(2)}</td>
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

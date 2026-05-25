import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { Surface } from "@/components/app/Surface";
import { KpiCard } from "@/components/app/KpiCard";
import { StatusChip } from "@/components/app/StatusChip";
import { ShoppingBag, Plus, Package } from "lucide-react";
import { fetchPlans, fetchCustomers } from "@/lib/apiClient";
import useRealtime from "@/lib/useRealtime";

export const Route = createFileRoute("/_app/ecommerce/products")({ component: Page });

function Page() {
  const plans = useRealtime('plans', fetchPlans, 'plans:update');
  const customers = useRealtime('customers', fetchCustomers, 'customers:update');

  const products = useMemo(() => {
    return (plans || []).map((plan: any, index: number) => {
      const subscribed = (customers || []).filter((customer: any) => customer.plan === plan.name).length;
      const stock = Math.max(0, 150 - subscribed * 8);
      const sold = subscribed * 12;
      const status = stock === 0 ? 'out-of-stock' : stock < 20 ? 'low-stock' : 'active';
      return {
        sku: plan.id || `PG-PLAN-${index + 1}`,
        name: `${plan.name} Package`,
        category: 'Subscription',
        price: Number(plan.price ?? 0),
        stock,
        sold,
        status,
      };
    });
  }, [plans, customers]);

  const lowOrOut = products.filter((product) => product.status !== 'active').length;

  return (
    <>
      <TopBar title="Products" subtitle="Detailing & ecommerce catalogue" actions={
        <button className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-primary px-3 text-[12.5px] font-bold text-primary-foreground"><Plus className="h-3.5 w-3.5"/> New product</button>
      }/>
      <div className="px-6 py-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <KpiCard label="Total SKUs" value={String(products.length)} icon={ShoppingBag} accent="primary" />
          <KpiCard label="Units in stock" value={products.reduce((s,p)=>s+p.stock,0).toLocaleString()} icon={Package} accent="primary" />
          <KpiCard label="Units sold (MTD)" value={products.reduce((s,p)=>s+p.sold,0).toLocaleString()} icon={ShoppingBag} accent="success" />
          <KpiCard label="Low / out of stock" value={lowOrOut.toString()} icon={Package} accent="warning" />
        </div>
        <Surface padded={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-[12.5px] min-w-180">
              <thead className="bg-surface-muted text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
                <tr><th className="px-4 py-3 text-left">SKU</th><th className="px-4 py-3 text-left">Product</th><th className="px-4 py-3 text-left">Category</th><th className="px-4 py-3 text-right">Price</th><th className="px-4 py-3 text-right">Stock</th><th className="px-4 py-3 text-right">Sold</th><th className="px-4 py-3 text-right">Status</th></tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.sku} className="border-t border-border hover:bg-surface-muted/60">
                    <td className="px-4 py-3 font-mono font-bold">{p.sku}</td>
                    <td className="px-4 py-3 font-bold">{p.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.category}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-bold">AED {Number(p.price ?? 0).toFixed(2)}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{p.stock}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{p.sold}</td>
                    <td className="px-4 py-3 text-right"><StatusChip tone={p.status==="active"?"success":p.status==="low-stock"?"warning":"danger"}>{p.status}</StatusChip></td>
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

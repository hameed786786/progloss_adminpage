import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { Surface } from "@/components/app/Surface";
import { KpiCard } from "@/components/app/KpiCard";
import { StatusChip } from "@/components/app/StatusChip";
import { ShoppingBag, Plus, Package } from "lucide-react";

export const Route = createFileRoute("/_app/ecommerce/products")({ component: Page });

const PRODUCTS = [
  { sku: "PG-WAX-01", name: "Progloss Ceramic Wax 500ml", category: "Detailing", price: 220, stock: 84, sold: 312, status: "active" },
  { sku: "PG-FOM-02", name: "Eco Snow Foam Concentrate 1L", category: "Wash", price: 95, stock: 218, sold: 1142, status: "active" },
  { sku: "PG-INT-04", name: "Interior Detail Kit (5 pcs)", category: "Detailing", price: 380, stock: 42, sold: 188, status: "active" },
  { sku: "PG-AIR-08", name: "Oud Air Freshener", category: "Cabin", price: 65, stock: 412, sold: 920, status: "active" },
  { sku: "PG-SHN-11", name: "Tyre Shine Spray 750ml", category: "Wash", price: 78, stock: 6, sold: 642, status: "low-stock" },
  { sku: "PG-MIC-12", name: "Microfibre Towel Pack ×6", category: "Accessories", price: 110, stock: 0, sold: 480, status: "out-of-stock" },
  { sku: "PG-GLS-15", name: "Glass Treatment 250ml", category: "Detailing", price: 145, stock: 96, sold: 220, status: "active" },
];

function Page() {
  return (
    <>
      <TopBar title="Products" subtitle="Detailing & ecommerce catalogue" actions={
        <button className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-primary px-3 text-[12.5px] font-bold text-primary-foreground"><Plus className="h-3.5 w-3.5"/> New product</button>
      }/>
      <div className="px-6 py-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <KpiCard label="Total SKUs" value={String(PRODUCTS.length)} icon={ShoppingBag} accent="primary" />
          <KpiCard label="Units in stock" value={PRODUCTS.reduce((s,p)=>s+p.stock,0).toLocaleString()} icon={Package} accent="primary" />
          <KpiCard label="Units sold (MTD)" value={PRODUCTS.reduce((s,p)=>s+p.sold,0).toLocaleString()} delta={14.2} icon={ShoppingBag} accent="success" />
          <KpiCard label="Low / out of stock" value="2" icon={Package} accent="warning" />
        </div>
        <Surface padded={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-[12.5px] min-w-[720px]">
              <thead className="bg-surface-muted text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
                <tr><th className="px-4 py-3 text-left">SKU</th><th className="px-4 py-3 text-left">Product</th><th className="px-4 py-3 text-left">Category</th><th className="px-4 py-3 text-right">Price</th><th className="px-4 py-3 text-right">Stock</th><th className="px-4 py-3 text-right">Sold</th><th className="px-4 py-3 text-right">Status</th></tr>
              </thead>
              <tbody>
                {PRODUCTS.map(p => (
                  <tr key={p.sku} className="border-t border-border hover:bg-surface-muted/60">
                    <td className="px-4 py-3 font-mono font-bold">{p.sku}</td>
                    <td className="px-4 py-3 font-bold">{p.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.category}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-bold">AED {p.price}</td>
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

import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { Surface } from "@/components/app/Surface";
import { KpiCard } from "@/components/app/KpiCard";
import { StatusChip } from "@/components/app/StatusChip";
import { Tag, Plus } from "lucide-react";

export const Route = createFileRoute("/_app/ecommerce/coupons")({ component: Page });

const COUPONS = [
  { code: "WELCOME20", type: "% off", value: 20, scope: "First order", redeemed: 412, cap: 1000, expires: "30 Jun 2026", status: "active" },
  { code: "SUMMER15", type: "% off", value: 15, scope: "Storefront", redeemed: 182, cap: 500, expires: "31 Aug 2026", status: "active" },
  { code: "WAX100", type: "AED off", value: 100, scope: "Ceramic Wax", redeemed: 88, cap: 200, expires: "20 Jun 2026", status: "active" },
  { code: "FLEET500", type: "AED off", value: 500, scope: "Fleet plan", redeemed: 12, cap: 50, expires: "31 Dec 2026", status: "active" },
  { code: "RAMADAN25", type: "% off", value: 25, scope: "All plans", redeemed: 248, cap: 248, expires: "10 Apr 2026", status: "expired" },
];

function Page() {
  return (
    <>
      <TopBar title="Ecommerce Coupons" subtitle="Storefront discount codes & redemption tracking" actions={
        <button className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-primary px-3 text-[12.5px] font-bold text-primary-foreground"><Plus className="h-3.5 w-3.5"/> New coupon</button>
      }/>
      <div className="px-6 py-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <KpiCard label="Active codes" value="4" icon={Tag} accent="primary" />
          <KpiCard label="Total redemptions" value="942" delta={18.2} icon={Tag} accent="success" />
          <KpiCard label="Discount value (MTD)" value="AED 18,420" icon={Tag} accent="warning" />
          <KpiCard label="Avg basket lift" value="+12.4%" delta={2.1} icon={Tag} accent="success" />
        </div>
        <Surface padded={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-[12.5px] min-w-[720px]">
              <thead className="bg-surface-muted text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
                <tr><th className="px-4 py-3 text-left">Code</th><th className="px-4 py-3 text-left">Discount</th><th className="px-4 py-3 text-left">Scope</th><th className="px-4 py-3 text-right">Redeemed</th><th className="px-4 py-3 text-left">Expires</th><th className="px-4 py-3 text-right">Status</th></tr>
              </thead>
              <tbody>
                {COUPONS.map(c => (
                  <tr key={c.code} className="border-t border-border hover:bg-surface-muted/60">
                    <td className="px-4 py-3 font-mono font-black tracking-wider">{c.code}</td>
                    <td className="px-4 py-3 font-bold">{c.type === "% off" ? `${c.value}%` : `AED ${c.value}`}</td>
                    <td className="px-4 py-3 text-muted-foreground">{c.scope}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{c.redeemed} / {c.cap}</td>
                    <td className="px-4 py-3 text-muted-foreground">{c.expires}</td>
                    <td className="px-4 py-3 text-right"><StatusChip tone={c.status==="active"?"success":"neutral"}>{c.status}</StatusChip></td>
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

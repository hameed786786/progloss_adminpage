import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { Surface } from "@/components/app/Surface";
import { KpiCard } from "@/components/app/KpiCard";
import { StatusChip } from "@/components/app/StatusChip";
import { Tag, Plus } from "lucide-react";
import { fetchPlans, fetchInvoices } from "@/lib/apiClient";
import useRealtime from "@/lib/useRealtime";

export const Route = createFileRoute("/_app/ecommerce/coupons")({ component: Page });

function Page() {
  const plans = useRealtime('plans', fetchPlans, 'plans:update');
  const invoices = useRealtime('invoices', fetchInvoices, 'invoices:update');

  const coupons = useMemo(() => {
    return (plans || []).map((plan: any, idx: number) => {
      const redeemed = (invoices || []).filter((invoice: any) => invoice.plan === plan.name).length;
      const cap = Math.max(50, redeemed + 100 + idx * 25);
      const pct = idx % 2 === 0;
      return {
        code: `PLAN${idx + 1}${String(plan.name || 'X').replace(/[^A-Za-z]/g, '').slice(0, 4).toUpperCase()}`,
        type: pct ? '% off' : 'AED off',
        value: pct ? 10 + idx * 5 : 50 + idx * 25,
        scope: plan.name,
        redeemed,
        cap,
        expires: '31 Dec 2026',
        status: redeemed >= cap ? 'expired' : 'active',
      };
    });
  }, [plans, invoices]);

  const activeCodes = coupons.filter((coupon) => coupon.status === 'active').length;
  const redemptions = coupons.reduce((sum, coupon) => sum + coupon.redeemed, 0);
  const discountValue = coupons.reduce((sum, coupon) => {
    const perUse = coupon.type === '% off' ? 35 : coupon.value;
    return sum + perUse * coupon.redeemed;
  }, 0);
  const avgBasketLift = coupons.length ? (8 + (activeCodes / coupons.length) * 6).toFixed(1) : '0.0';

  return (
    <>
      <TopBar title="Ecommerce Coupons" subtitle="Storefront discount codes & redemption tracking" actions={
        <button className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-primary px-3 text-[12.5px] font-bold text-primary-foreground"><Plus className="h-3.5 w-3.5"/> New coupon</button>
      }/>
      <div className="px-6 py-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <KpiCard label="Active codes" value={activeCodes.toString()} icon={Tag} accent="primary" />
          <KpiCard label="Total redemptions" value={redemptions.toString()} icon={Tag} accent="success" />
          <KpiCard label="Discount value (MTD)" value={`AED ${discountValue.toLocaleString()}`} icon={Tag} accent="warning" />
          <KpiCard label="Avg basket lift" value={`+${avgBasketLift}%`} icon={Tag} accent="success" />
        </div>
        <Surface padded={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-[12.5px] min-w-180">
              <thead className="bg-surface-muted text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
                <tr><th className="px-4 py-3 text-left">Code</th><th className="px-4 py-3 text-left">Discount</th><th className="px-4 py-3 text-left">Scope</th><th className="px-4 py-3 text-right">Redeemed</th><th className="px-4 py-3 text-left">Expires</th><th className="px-4 py-3 text-right">Status</th></tr>
              </thead>
              <tbody>
                {coupons.map(c => (
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

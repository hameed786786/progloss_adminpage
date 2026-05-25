import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { Surface } from "@/components/app/Surface";
import { KpiCard } from "@/components/app/KpiCard";
import { StatusChip } from "@/components/app/StatusChip";
import { Ticket, Plus } from "lucide-react";
import { fetchPlans, fetchInvoices } from "@/lib/apiClient";
import useRealtime from "@/lib/useRealtime";

export const Route = createFileRoute("/_app/subscriptions/coupons")({ component: Page });

function Page() {
  const plans = useRealtime('plans', fetchPlans, 'plans:update');
  const invoices = useRealtime('invoices', fetchInvoices, 'invoices:update');

  const coupons = useMemo(() => {
    return (plans || []).map((plan: any, idx: number) => {
      const redeemed = (invoices || []).filter((invoice: any) => invoice.plan === plan.name).length;
      const cap = Math.max(40, redeemed + 90 + idx * 20);
      const isPercent = idx % 2 === 0;
      const value = isPercent ? 10 + idx * 5 : 60 + idx * 20;
      return {
        code: `${String(plan.name || 'PLAN').replace(/[^A-Za-z]/g, '').slice(0, 4).toUpperCase()}${idx + 1}`,
        plan: plan.name,
        discount: isPercent ? `${value}% off first month` : `AED ${value} off`,
        redeemed,
        cap,
        expires: '31 Dec 2026',
        status: redeemed >= cap ? 'expired' : 'active',
      };
    });
  }, [plans, invoices]);

  const activeCoupons = coupons.filter((coupon) => coupon.status === 'active').length;
  const totalRedemptions = coupons.reduce((sum, coupon) => sum + coupon.redeemed, 0);
  const discountGiven = coupons.reduce((sum, coupon) => sum + coupon.redeemed * 35, 0);
  const avgUplift = coupons.length ? (10 + (activeCoupons / coupons.length) * 8).toFixed(1) : '0.0';

  return (
    <>
      <TopBar title="Subscription Coupons" subtitle="Plan-level discount codes & promotions" actions={
        <button className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-primary px-3 text-[12.5px] font-bold text-primary-foreground"><Plus className="h-3.5 w-3.5"/> New coupon</button>
      }/>
      <div className="px-6 py-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <KpiCard label="Active coupons" value={activeCoupons.toString()} icon={Ticket} accent="primary" />
          <KpiCard label="Total redemptions" value={totalRedemptions.toString()} icon={Ticket} accent="success" />
          <KpiCard label="Discount given (MTD)" value={`AED ${discountGiven.toLocaleString()}`} icon={Ticket} accent="warning" />
          <KpiCard label="Avg uplift" value={`+${avgUplift}%`} icon={Ticket} accent="success" />
        </div>
        <Surface padded={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-[12.5px] min-w-180">
              <thead className="bg-surface-muted text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
                <tr><th className="px-4 py-3 text-left">Code</th><th className="px-4 py-3 text-left">Plan</th><th className="px-4 py-3 text-left">Discount</th><th className="px-4 py-3 text-right">Redeemed</th><th className="px-4 py-3 text-left">Expires</th><th className="px-4 py-3 text-right">Status</th></tr>
              </thead>
              <tbody>
                {coupons.map(c => (
                  <tr key={c.code} className="border-t border-border hover:bg-surface-muted/60">
                    <td className="px-4 py-3 font-mono font-black tracking-wider">{c.code}</td>
                    <td className="px-4 py-3 font-bold">{c.plan}</td>
                    <td className="px-4 py-3">{c.discount}</td>
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

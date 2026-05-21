import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { Surface } from "@/components/app/Surface";
import { KpiCard } from "@/components/app/KpiCard";
import { StatusChip } from "@/components/app/StatusChip";
import { Ticket, Plus } from "lucide-react";

export const Route = createFileRoute("/_app/subscriptions/coupons")({ component: Page });

const COUPONS = [
  { code: "ECO50", plan: "Eco Weekly", discount: "50% off first month", redeemed: 218, cap: 500, expires: "30 Jun 2026", status: "active" },
  { code: "ROYAL3M", plan: "Royal Monthly", discount: "AED 200 off · 3 months", redeemed: 42, cap: 150, expires: "31 Jul 2026", status: "active" },
  { code: "FLEET20", plan: "Fleet Care", discount: "20% off annual prepay", redeemed: 8, cap: 30, expires: "31 Dec 2026", status: "active" },
  { code: "WINBACK", plan: "Any plan", discount: "1 free wash + 15% off", redeemed: 88, cap: 200, expires: "30 Sep 2026", status: "active" },
  { code: "NYE2026", plan: "Premium Bi-weekly", discount: "AED 100 off", redeemed: 412, cap: 412, expires: "31 Jan 2026", status: "expired" },
];

function Page() {
  return (
    <>
      <TopBar title="Subscription Coupons" subtitle="Plan-level discount codes & promotions" actions={
        <button className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-primary px-3 text-[12.5px] font-bold text-primary-foreground"><Plus className="h-3.5 w-3.5"/> New coupon</button>
      }/>
      <div className="px-6 py-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <KpiCard label="Active coupons" value="4" icon={Ticket} accent="primary" />
          <KpiCard label="Total redemptions" value="356" delta={14.2} icon={Ticket} accent="success" />
          <KpiCard label="Discount given (MTD)" value="AED 24,180" icon={Ticket} accent="warning" />
          <KpiCard label="Avg uplift" value="+18.4%" delta={3.1} icon={Ticket} accent="success" />
        </div>
        <Surface padded={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-[12.5px] min-w-[720px]">
              <thead className="bg-surface-muted text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
                <tr><th className="px-4 py-3 text-left">Code</th><th className="px-4 py-3 text-left">Plan</th><th className="px-4 py-3 text-left">Discount</th><th className="px-4 py-3 text-right">Redeemed</th><th className="px-4 py-3 text-left">Expires</th><th className="px-4 py-3 text-right">Status</th></tr>
              </thead>
              <tbody>
                {COUPONS.map(c => (
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

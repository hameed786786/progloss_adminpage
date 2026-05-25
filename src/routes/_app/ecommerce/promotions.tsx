import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { Surface, SectionTitle } from "@/components/app/Surface";
import { KpiCard } from "@/components/app/KpiCard";
import { StatusChip } from "@/components/app/StatusChip";
import { Megaphone, Eye, MousePointerClick, Sparkles } from "lucide-react";
import { fetchCustomers, fetchPayments, fetchInvoices } from "@/lib/apiClient";
import useRealtime from "@/lib/useRealtime";

export const Route = createFileRoute("/_app/ecommerce/promotions")({ component: Page });

function Page() {
  const customers = useRealtime('customers', fetchCustomers, 'customers:update');
  const payments = useRealtime('payments', fetchPayments, 'payments:update');
  const invoices = useRealtime('invoices', fetchInvoices, 'invoices:update');

  const campaigns = useMemo(() => {
    const totalCustomers = (customers || []).length;
    const paidInvoices = (invoices || []).filter((invoice: any) => String(invoice.status || '').toLowerCase() === 'paid').length;
    const capturedPayments = (payments || []).filter((payment: any) => String(payment.status || '').toLowerCase() === 'captured').length;

    return [
      {
        name: 'Plan Renewal Push',
        channels: ['Push', 'Email', 'In-app'],
        starts: '01 May',
        ends: '31 May',
        reach: totalCustomers,
        ctr: totalCustomers ? Number(((capturedPayments / totalCustomers) * 100).toFixed(1)) : 0,
        conv: capturedPayments,
        status: 'live',
      },
      {
        name: 'Overdue Recovery',
        channels: ['SMS', 'Email'],
        starts: '10 May',
        ends: '30 Jun',
        reach: (invoices || []).length,
        ctr: invoices.length ? Number(((paidInvoices / Math.max(invoices.length, 1)) * 100).toFixed(1)) : 0,
        conv: paidInvoices,
        status: 'live',
      },
      {
        name: 'High LTV Upsell',
        channels: ['Email', 'Concierge'],
        starts: '01 Apr',
        ends: '30 Apr',
        reach: (customers || []).filter((customer: any) => Number(customer.ltv ?? 0) >= 5000).length,
        ctr: 9.2,
        conv: (customers || []).filter((customer: any) => Number(customer.ltv ?? 0) >= 5000 && customer.status === 'active').length,
        status: 'ended',
      },
    ];
  }, [customers, payments, invoices]);

  const liveCount = campaigns.filter((campaign) => campaign.status === 'live').length;
  const reach = campaigns.reduce((sum, campaign) => sum + campaign.reach, 0);
  const avgCtr = campaigns.length ? (campaigns.reduce((sum, campaign) => sum + campaign.ctr, 0) / campaigns.length).toFixed(1) : '0.0';
  const attributedRevenue = (payments || []).filter((payment: any) => String(payment.status || '').toLowerCase() === 'captured').reduce((sum: number, payment: any) => sum + Number(payment.amount ?? 0), 0);

  return (
    <>
      <TopBar title="Promotions" subtitle="Lifecycle, seasonal & cross-sell campaigns" />
      <div className="px-6 py-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <KpiCard label="Live campaigns" value={liveCount.toString()} icon={Megaphone} accent="primary" />
          <KpiCard label="Reach (MTD)" value={reach.toLocaleString()} icon={Eye} accent="primary" />
          <KpiCard label="Avg CTR" value={`${avgCtr}%`} icon={MousePointerClick} accent="success" />
          <KpiCard label="Attributed revenue" value={`AED ${attributedRevenue.toLocaleString()}`} icon={Sparkles} accent="success" />
        </div>
        <Surface padded={false}>
          <div className="px-5 py-4 border-b border-border"><SectionTitle title="Active & past campaigns" /></div>
          <div className="overflow-x-auto">
            <table className="w-full text-[12.5px] min-w-180">
              <thead className="bg-surface-muted text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
                <tr><th className="px-4 py-3 text-left">Campaign</th><th className="px-4 py-3 text-left">Channels</th><th className="px-4 py-3 text-left">Window</th><th className="px-4 py-3 text-right">Reach</th><th className="px-4 py-3 text-right">CTR</th><th className="px-4 py-3 text-right">Conv.</th><th className="px-4 py-3 text-right">Status</th></tr>
              </thead>
              <tbody>
                {campaigns.map(c => (
                  <tr key={c.name} className="border-t border-border hover:bg-surface-muted/60">
                    <td className="px-4 py-3 font-bold">{c.name}</td>
                    <td className="px-4 py-3"><div className="flex flex-wrap gap-1">{c.channels.map(ch => <StatusChip key={ch} tone="info" dot={false}>{ch}</StatusChip>)}</div></td>
                    <td className="px-4 py-3 text-muted-foreground">{c.starts} → {c.ends}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{c.reach.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-bold">{c.ctr}%</td>
                    <td className="px-4 py-3 text-right tabular-nums">{c.conv}</td>
                    <td className="px-4 py-3 text-right"><StatusChip tone={c.status==="live"?"success":"neutral"}>{c.status}</StatusChip></td>
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

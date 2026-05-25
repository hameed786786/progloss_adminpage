import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { Surface, SectionTitle } from "@/components/app/Surface";
import { KpiCard } from "@/components/app/KpiCard";
import { StatusChip } from "@/components/app/StatusChip";
import { Repeat, Play, Pause, Calendar, CheckCircle2 } from "lucide-react";
import { fetchCustomers, fetchInvoices, fetchPlans } from "@/lib/apiClient";
import useRealtime from "@/lib/useRealtime";

export const Route = createFileRoute("/_app/billing/auto")({ component: Page });

function isCurrentMonth(dateValue?: string) {
  if (!dateValue) return false;
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return false;
  const now = new Date();
  return parsed.getFullYear() === now.getFullYear() && parsed.getMonth() === now.getMonth();
}

function formatFrequency(freq?: string) {
  const normalized = (freq ?? "").toLowerCase();
  if (normalized.includes("bi-week")) return "Sun 22:00 GST";
  if (normalized.includes("week")) return "Mon 06:00 GST";
  if (normalized.includes("month")) return "1st 02:00 GST";
  return "Scheduled";
}

function nextRunLabel(freq?: string) {
  const now = new Date();
  const normalized = (freq ?? "").toLowerCase();
  const deltaDays = normalized.includes("bi-week") ? 14 : normalized.includes("week") ? 7 : 30;
  const next = new Date(now);
  next.setDate(now.getDate() + deltaDays);
  return next.toLocaleDateString(undefined, { day: "2-digit", month: "short" }) + ", 06:00";
}

function Page() {
  const plans = useRealtime('plans', fetchPlans, 'plans:update');
  const invoices = useRealtime('invoices', fetchInvoices, 'invoices:update');
  const customers = useRealtime('customers', fetchCustomers, 'customers:update');

  const cycles = useMemo(() => {
    return plans.map((plan) => {
      const activeCustomers = customers.filter((customer) => customer.plan === plan.name && customer.status !== 'cancelled').length;
      const planInvoices = invoices.filter((invoice) => invoice.plan === plan.name);
      const currentMonthInvoices = planInvoices.filter((invoice) => isCurrentMonth(invoice.date)).length;
      const amount = planInvoices.length
        ? planInvoices.reduce((sum, invoice) => sum + Number(invoice.total ?? 0), 0)
        : activeCustomers * Number(plan.price ?? 0);
      const status = activeCustomers === 0 ? 'Paused' : currentMonthInvoices > 0 ? 'Running' : 'Scheduled';

      return {
        id: plan.id,
        plan: plan.name,
        run: formatFrequency(plan.freq),
        next: nextRunLabel(plan.freq),
        invoices: planInvoices.length || activeCustomers,
        amount,
        status,
      };
    });
  }, [customers, invoices, plans]);

  const activeCycles = cycles.filter((cycle) => cycle.status !== 'Paused').length;
  const invoicesThisMonth = invoices.filter((invoice) => isCurrentMonth(invoice.date)).length;
  const expectedMrr = customers.reduce((sum, customer) => {
    const plan = plans.find((item) => item.name === customer.plan);
    return customer.status === 'cancelled' ? sum : sum + Number(plan?.price ?? 0);
  }, 0);
  const dunningEmails = invoices.filter((invoice) => ['failed', 'pending', 'overdue'].includes(String(invoice.status))).length;

  return (
    <>
      <TopBar title="Auto Billing" subtitle="Recurring invoice cycles & dunning rules" actions={
        <button className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-primary px-3 text-[12.5px] font-bold text-primary-foreground"><Play className="h-3.5 w-3.5" /> Run cycle</button>
      }/>
      <div className="px-6 py-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <KpiCard label="Active cycles" value={`${activeCycles} / ${cycles.length}`} icon={Repeat} accent="primary" hint="Live plan coverage" />
          <KpiCard label="Invoices this month" value={invoicesThisMonth.toString()} icon={CheckCircle2} accent="success" />
          <KpiCard label="Expected MRR" value={`AED ${expectedMrr.toLocaleString()}`} icon={Calendar} accent="primary" />
          <KpiCard label="Dunning emails sent" value={dunningEmails.toString()} icon={Calendar} accent="warning" />
        </div>
        <Surface padded={false}>
          <div className="px-5 py-4 border-b border-border"><SectionTitle title="Billing cycles" sub="Live plan schedule from customers and invoices" /></div>
          <div className="overflow-x-auto">
            <table className="w-full text-[12.5px] min-w-180">
              <thead className="bg-surface-muted text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left">Cycle ID</th>
                  <th className="px-4 py-3 text-left">Plan</th>
                  <th className="px-4 py-3 text-left">Schedule</th>
                  <th className="px-4 py-3 text-left">Next run</th>
                  <th className="px-4 py-3 text-right">Invoices</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3 text-right">Status</th>
                  <th className="px-4 py-3 text-right"></th>
                </tr>
              </thead>
              <tbody>
                {cycles.map(c => (
                  <tr key={c.id} className="border-t border-border hover:bg-surface-muted/60">
                    <td className="px-4 py-3 font-mono font-bold">{c.id}</td>
                    <td className="px-4 py-3 font-bold">{c.plan}</td>
                    <td className="px-4 py-3 text-muted-foreground">{c.run}</td>
                    <td className="px-4 py-3">{c.next}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{c.invoices}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-bold">AED {c.amount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">
                      <StatusChip tone={c.status==="Running"?"success":c.status==="Paused"?"warning":"info"}>{c.status}</StatusChip>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="inline-flex h-7 items-center gap-1 rounded-md border border-border bg-surface px-2 text-[11px] font-bold hover:bg-accent">
                        {c.status==="Paused" ? <><Play className="h-3 w-3"/> Resume</> : <><Pause className="h-3 w-3"/> Pause</>}
                      </button>
                    </td>
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

import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { TopBar } from "@/components/app/TopBar";
import { Surface, SectionTitle } from "@/components/app/Surface";
import { StatusChip } from "@/components/app/StatusChip";
import { fetchCustomers, fetchInvoices, fetchTickets } from '@/lib/apiClient';
import useRealtime from "@/lib/useRealtime";
import { ArrowLeft, Mail, Phone, Building2, Car, CreditCard, MessageSquare, Activity, FileText } from "lucide-react";

export const Route = createFileRoute("/_app/customers/$id")({ component: CustomerDetail });

function parseDate(value?: string) {
  if (!value) return null;
  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) return parsed;
  const normalized = value.replace(/\s+/g, " ").trim();
  const fallback = new Date(Date.parse(normalized));
  return Number.isNaN(fallback.getTime()) ? null : fallback;
}

function formatRelativeDate(value?: string) {
  const parsed = parseDate(value);
  if (!parsed) return value ?? 'Unknown';
  return parsed.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function CustomerDetail() {
  const { id } = Route.useParams();
  const customers = useRealtime('customers', fetchCustomers, 'customers:update');
  const invoices = useRealtime('invoices', fetchInvoices, 'invoices:update');
  const tickets = useRealtime('tickets', fetchTickets, 'tickets:update');
  const customer = useMemo(() => customers.find((item) => item.id === id) ?? { name: 'Unknown', id, status: 'active', community: 'N/A', vehicles: 0, plan: 'N/A', since: 'N/A', ltv: 0, email: 'N/A', phone: 'N/A' }, [customers, id]);
  const invoicesFor = useMemo(() => invoices.filter((item: any) => item.customer === customer.name || item.customerId === customer.id), [customer.id, customer.name, invoices]);
  const ticketsFor = useMemo(() => tickets.filter((item: any) => item.customer === customer.name || item.customerId === customer.id), [customer.id, customer.name, tickets]);
  const completedWashes = invoicesFor.filter((item: any) => String(item.status ?? '').toLowerCase() === 'paid').length;
  const lastInvoice = useMemo(() => {
    return [...invoicesFor]
      .map((item: any) => ({ ...item, parsedDate: parseDate(item.date ?? item.createdAt ?? item.issuedAt) }))
      .sort((a, b) => (b.parsedDate?.getTime() ?? 0) - (a.parsedDate?.getTime() ?? 0))[0];
  }, [invoicesFor]);
  const vehicleCards = useMemo(() => {
    const plates = Array.from(new Set(invoicesFor.map((item: any) => item.plate).filter(Boolean)));
    const count = Math.max(Number(customer.vehicles ?? 0), plates.length);
    return Array.from({ length: count }, (_, index) => ({
      plate: plates[index] ?? `Vehicle ${index + 1}`,
      model: index === 0 ? 'Live vehicle record' : 'Customer vehicle',
      lastWash: index === 0 && lastInvoice ? `${lastInvoice.status} · ${formatRelativeDate(lastInvoice.date)}` : 'Live data unavailable',
      healthy: index === 0 ? String(lastInvoice?.status ?? '').toLowerCase() === 'paid' : true,
    }));
  }, [customer.vehicles, invoicesFor, lastInvoice]);
  const recentActivity = useMemo(() => {
    const invoiceEvents = invoicesFor.slice(0, 3).map((item: any) => ({
      icon: FileText,
      t: `Invoice ${item.id} ${String(item.status ?? 'updated')} · AED ${Number(item.total ?? 0).toFixed(2)}`,
      time: item.date ?? item.createdAt ?? 'Recent',
    }));
    const ticketEvents = ticketsFor.slice(0, 2).map((item: any) => ({
      icon: MessageSquare,
      t: `Ticket ${item.id} · ${item.subject}`,
      time: item.createdAt ? formatRelativeDate(item.createdAt) : 'Recent',
    }));
    const customerEvents = [
      {
        icon: Activity,
        t: `${customer.name} customer profile loaded from live backend data`,
        time: customer.since ? `Customer since ${customer.since}` : 'Live customer',
      },
      ...(lastInvoice ? [{ icon: CreditCard, t: `Latest invoice ${lastInvoice.id} · ${lastInvoice.status}`, time: formatRelativeDate(lastInvoice.date) }] : []),
    ];
    return [...customerEvents, ...invoiceEvents, ...ticketEvents].slice(0, 5);
  }, [customer.name, customer.since, invoicesFor, lastInvoice, ticketsFor]);

  return (
    <>
      <TopBar title={customer.name} subtitle={`${customer.id} · ${customer.community} · Customer since ${customer.since}`} />
      <div className="px-6 py-6 space-y-4">
        <Link to="/customers" className="inline-flex items-center gap-1 text-[12px] font-bold text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" /> All customers
        </Link>

        <div className="grid gap-4 xl:grid-cols-3">
          <Surface className="xl:col-span-1">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-[18px] font-black text-primary">
                {customer.name.split(" ").map((name: string) => name[0]).slice(0, 2).join("")}
              </div>
              <div>
                <div className="text-[16px] font-black tracking-tight">{customer.name}</div>
                <StatusChip tone={customer.status === "active" ? "success" : customer.status === "paused" ? "warning" : "danger"}>{customer.status}</StatusChip>
              </div>
            </div>
            <div className="mt-5 space-y-2.5 text-[12.5px]">
              <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-muted-foreground" /> {customer.email}</div>
              <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-muted-foreground" /> {customer.phone}</div>
              <div className="flex items-center gap-2"><Building2 className="h-3.5 w-3.5 text-muted-foreground" /> {customer.community}</div>
              <div className="flex items-center gap-2"><Car className="h-3.5 w-3.5 text-muted-foreground" /> {customer.vehicles} vehicle(s)</div>
              <div className="flex items-center gap-2"><CreditCard className="h-3.5 w-3.5 text-muted-foreground" /> {customer.plan}</div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 text-center">
              <div className="rounded-xl bg-surface-muted px-3 py-3">
                <div className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">LTV</div>
                <div className="mt-0.5 text-[18px] font-black">AED {customer.ltv.toLocaleString()}</div>
              </div>
              <div className="rounded-xl bg-surface-muted px-3 py-3">
                <div className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">Washes</div>
                <div className="mt-0.5 text-[18px] font-black">{completedWashes}</div>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="flex-1 rounded-xl bg-primary px-3 py-2 text-[12px] font-bold text-primary-foreground hover:bg-primary/90">Message</button>
              <button className="flex-1 rounded-xl border border-border bg-surface px-3 py-2 text-[12px] font-bold hover:bg-accent">Open ticket</button>
            </div>
          </Surface>

          <div className="xl:col-span-2 space-y-4">
            <Surface>
              <SectionTitle title="Vehicles" sub={`${customer.vehicles} registered`} />
              <div className="grid gap-3 sm:grid-cols-2">
                {vehicleCards.map((vehicle, index) => (
                  <div key={index} className="rounded-xl border border-border bg-surface-muted/40 p-4">
                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      <Car className="h-3.5 w-3.5" /> Dubai · Private
                    </div>
                    <div className="mt-1 text-[16px] font-black tracking-tight">{vehicle.plate}</div>
                    <div className="mt-1 text-[12px] text-muted-foreground">{vehicle.model}</div>
                    <div className="mt-3 flex items-center justify-between text-[11.5px]">
                      <span className="text-muted-foreground">Last wash · {vehicle.lastWash}</span>
                      <StatusChip tone={vehicle.healthy ? "success" : "warning"}>{vehicle.healthy ? "Healthy" : "Pending"}</StatusChip>
                    </div>
                  </div>
                ))}
              </div>
            </Surface>

            <Surface>
              <SectionTitle title="Recent invoices" sub="Last 6 months" />
              <div className="overflow-hidden rounded-xl border border-border">
                <table className="w-full text-[12.5px]">
                  <thead className="bg-surface-muted text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
                    <tr><th className="px-3 py-2 text-left">Invoice</th><th className="px-3 py-2 text-left">Date</th><th className="px-3 py-2 text-right">Amount</th><th className="px-3 py-2 text-left">Status</th></tr>
                  </thead>
                  <tbody>
                    {invoicesFor.slice(0, 5).map((item) => (
                      <tr key={item.id} className="border-t border-border">
                        <td className="px-3 py-2.5"><Link to="/billing/invoices/$id" params={{ id: item.id }} className="font-bold text-primary hover:underline">{item.id}</Link></td>
                        <td className="px-3 py-2.5 text-muted-foreground">{item.date}</td>
                        <td className="px-3 py-2.5 text-right tabular-nums font-bold">AED {Number(item.total ?? 0).toFixed(2)}</td>
                        <td className="px-3 py-2.5"><StatusChip tone={item.status === "paid" ? "success" : item.status === "overdue" ? "danger" : item.status === "failed" ? "danger" : "warning"}>{item.status}</StatusChip></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Surface>

            <Surface>
              <SectionTitle title="Activity timeline" />
              <div className="relative space-y-4 pl-5 before:absolute before:left-1.5 before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-border">
                {recentActivity.map((entry, index) => (
                  <div key={index} className="relative">
                    <div className="absolute -left-4.5 top-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-primary ring-4 ring-background"></div>
                    <div className="flex items-start gap-2">
                      <entry.icon className="mt-0.5 h-3.5 w-3.5 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="text-[12.5px] text-foreground">{entry.t}</div>
                        <div className="text-[11px] text-muted-foreground">{entry.time}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Surface>
          </div>
        </div>
      </div>
    </>
  );
}

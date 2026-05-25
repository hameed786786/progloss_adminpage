import { createFileRoute, Link } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { Surface, SectionTitle } from "@/components/app/Surface";
import { StatusChip } from "@/components/app/StatusChip";
import { fetchInvoices } from "@/lib/apiClient";
import useRealtime from "@/lib/useRealtime";
import { ArrowLeft, Download, Send, Printer, Mail, CheckCircle2, Clock, FileText } from "lucide-react";

export const Route = createFileRoute("/_app/billing/invoices/$id")({ component: InvoiceDetail });

function InvoiceDetail() {
  const { id } = Route.useParams();
  const invoices = useRealtime('invoices', fetchInvoices, 'invoices:update');
  const inv = invoices.find((item) => item.id === id) ?? invoices[0] ?? { id, customer: 'Unknown', community: 'N/A', date: '—', plan: 'N/A', plate: 'N/A', status: 'pending', subtotal: 0, vat: 0, total: 0 };

  const items = [
    { name: `${inv.plan} subscription`, qty: 1, price: inv.subtotal * 0.85, total: inv.subtotal * 0.85 },
    { name: "Premium ceramic top-up", qty: 1, price: inv.subtotal * 0.10, total: inv.subtotal * 0.10 },
    { name: "Interior detail add-on", qty: 1, price: inv.subtotal * 0.05, total: inv.subtotal * 0.05 },
  ];

  return (
    <>
      <TopBar
        title={inv.id}
        subtitle={`${inv.customer} · ${inv.community} · ${inv.date}`}
        actions={
          <div className="flex items-center gap-2">
            <button className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border bg-surface px-3 text-[12.5px] font-bold hover:bg-accent"><Printer className="h-3.5 w-3.5" /> Print</button>
            <button className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border bg-surface px-3 text-[12.5px] font-bold hover:bg-accent"><Mail className="h-3.5 w-3.5" /> Resend</button>
            <button className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-primary px-3 text-[12.5px] font-bold text-primary-foreground hover:bg-primary/90"><Download className="h-3.5 w-3.5" /> Download PDF</button>
          </div>
        }
      />
      <div className="px-6 py-6 space-y-4">
        <Link to="/billing/invoices" className="inline-flex items-center gap-1 text-[12px] font-bold text-muted-foreground hover:text-foreground"><ArrowLeft className="h-3.5 w-3.5" /> Invoices</Link>

        <div className="grid gap-4 xl:grid-cols-3">
          <Surface className="xl:col-span-2 p-0! overflow-hidden">
            <div className="bg-primary px-8 py-6 text-primary-foreground">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.18em] opacity-80">Tax Invoice</div>
                  <div className="mt-1 text-[26px] font-black tracking-tight">{inv.id}</div>
                  <div className="mt-1 text-[12px] opacity-90">Issued · {inv.date} · UAE · TRN 100123456700003</div>
                </div>
                <div className="text-right">
                  <div className="text-[18px] font-black tracking-tight">Progloss</div>
                  <div className="text-[11px] opacity-90">Eco Smart Car Care, Dubai</div>
                  <div className="text-[11px] opacity-80">finance@progloss.ae</div>
                </div>
              </div>
            </div>
            <div className="px-8 py-6">
              <div className="grid grid-cols-2 gap-6 text-[12.5px]">
                <div>
                  <div className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">Billed to</div>
                  <div className="mt-1 font-black text-[14px]">{inv.customer}</div>
                  <div className="text-muted-foreground">{inv.community}, Dubai</div>
                  <div className="text-muted-foreground">Vehicle · {inv.plate}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">Payment</div>
                  <div className="mt-1">Visa •• 4421 · Auto-charge</div>
                  <div className="text-muted-foreground">Due on receipt</div>
                  <div className="mt-2"><StatusChip tone={inv.status === "paid" ? "success" : inv.status === "overdue" || inv.status === "failed" ? "danger" : "warning"}>{inv.status.toUpperCase()}</StatusChip></div>
                </div>
              </div>

              <div className="mt-6 overflow-hidden rounded-xl border border-border">
                <table className="w-full text-[12.5px]">
                  <thead className="bg-surface-muted text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
                    <tr><th className="px-3 py-2 text-left">Service</th><th className="px-3 py-2 text-right">Qty</th><th className="px-3 py-2 text-right">Unit (AED)</th><th className="px-3 py-2 text-right">Amount</th></tr>
                  </thead>
                  <tbody>
                    {items.map((it, i) => (
                      <tr key={i} className="border-t border-border">
                        <td className="px-3 py-3 font-bold">{it.name}</td>
                        <td className="px-3 py-3 text-right tabular-nums">{it.qty}</td>
                        <td className="px-3 py-3 text-right tabular-nums">{it.price.toFixed(2)}</td>
                        <td className="px-3 py-3 text-right tabular-nums font-bold">{it.total.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 ml-auto w-full max-w-xs space-y-1.5 text-[12.5px]">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="tabular-nums">AED {inv.subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">VAT 5%</span><span className="tabular-nums">AED {inv.vat.toFixed(2)}</span></div>
                <div className="flex justify-between border-t border-border pt-2 mt-2"><span className="font-black">Total due</span><span className="tabular-nums text-[16px] font-black text-primary">AED {inv.total.toFixed(2)}</span></div>
              </div>
            </div>
          </Surface>

          <div className="space-y-4">
            <Surface>
              <SectionTitle title="VAT breakdown" />
              <div className="space-y-2 text-[12.5px]">
                <div className="flex justify-between"><span className="text-muted-foreground">Taxable amount</span><span className="tabular-nums font-bold">AED {inv.subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">VAT rate</span><span className="tabular-nums font-bold">5.00%</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Output VAT</span><span className="tabular-nums font-bold text-primary">AED {inv.vat.toFixed(2)}</span></div>
                <div className="rounded-xl bg-surface-muted px-3 py-2 text-[11.5px] text-muted-foreground mt-2">Filed under FTA TRN 100123456700003 · cycle Q2-2026.</div>
              </div>
            </Surface>

            <Surface>
              <SectionTitle title="Status timeline" />
              <div className="relative space-y-3 pl-5 before:absolute before:left-1.5 before:top-1.5 before:h-[calc(100%-1rem)] before:w-px before:bg-border">
                {[
                  { i: FileText, t: "Invoice generated", ts: inv.date + " · 06:00", done: true },
                  { i: Send, t: "Email delivered to customer", ts: inv.date + " · 06:01", done: true },
                  { i: Clock, t: "Payment auto-charged", ts: inv.date + " · 06:05", done: inv.status === "paid" },
                  { i: CheckCircle2, t: inv.status === "paid" ? "Receipt issued" : "Receipt pending", ts: inv.status === "paid" ? inv.date + " · 06:06" : "—", done: inv.status === "paid" },
                ].map((e, i) => (
                  <div key={i} className="relative">
                    <div className={`absolute -left-4.5 top-0.5 flex h-3 w-3 items-center justify-center rounded-full ring-4 ring-background ${e.done ? "bg-primary" : "bg-border"}`} />
                    <div className="flex items-start gap-2">
                      <e.i className={`mt-0.5 h-3.5 w-3.5 ${e.done ? "text-foreground" : "text-muted-foreground"}`} />
                      <div className="flex-1">
                        <div className={`text-[12.5px] ${e.done ? "text-foreground font-medium" : "text-muted-foreground"}`}>{e.t}</div>
                        <div className="text-[11px] text-muted-foreground">{e.ts}</div>
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

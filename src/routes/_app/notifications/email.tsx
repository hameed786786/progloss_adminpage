import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { Surface } from "@/components/app/Surface";
import { KpiCard } from "@/components/app/KpiCard";
import { StatusChip } from "@/components/app/StatusChip";
import { Mail, Plus } from "lucide-react";

export const Route = createFileRoute("/_app/notifications/email")({ component: Page });

const TEMPLATES = [
  { id: "EML-INV", name: "VAT Invoice", subject: "Your Progloss invoice {{invoice}}", trigger: "invoice.issued", sent: 1378, open: 72.4, click: 38.2, status: "active" },
  { id: "EML-RFD", name: "Refund confirmation", subject: "Refund processed · {{amount}} AED", trigger: "refund.completed", sent: 22, open: 88.1, click: 12.4, status: "active" },
  { id: "EML-WLC", name: "Welcome onboarding", subject: "Welcome to Progloss, {{name}}", trigger: "customer.created", sent: 142, open: 64.8, click: 41.2, status: "active" },
  { id: "EML-DUN", name: "Dunning · payment failed", subject: "Action needed · payment for {{invoice}}", trigger: "payment.failed", sent: 38, open: 58.2, click: 28.4, status: "active" },
  { id: "EML-NWS", name: "Monthly newsletter", subject: "Detail tips · May edition", trigger: "manual", sent: 0, open: 0, click: 0, status: "draft" },
];

function Page() {
  return (
    <>
      <TopBar title="Email Templates" subtitle="Transactional & marketing email library" actions={
        <button className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-primary px-3 text-[12.5px] font-bold text-primary-foreground"><Plus className="h-3.5 w-3.5"/> New template</button>
      }/>
      <div className="px-6 py-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <KpiCard label="Sent (30d)" value="4,218" delta={12.1} icon={Mail} accent="primary" />
          <KpiCard label="Open rate" value="71.4%" delta={1.8} icon={Mail} accent="success" />
          <KpiCard label="Click rate" value="32.1%" delta={2.4} icon={Mail} accent="success" />
          <KpiCard label="Bounce rate" value="0.8%" delta={-0.2} icon={Mail} accent="success" />
        </div>
        <Surface padded={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-[12.5px] min-w-[720px]">
              <thead className="bg-surface-muted text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
                <tr><th className="px-4 py-3 text-left">ID</th><th className="px-4 py-3 text-left">Template</th><th className="px-4 py-3 text-left">Trigger</th><th className="px-4 py-3 text-right">Sent</th><th className="px-4 py-3 text-right">Open</th><th className="px-4 py-3 text-right">Click</th><th className="px-4 py-3 text-right">Status</th></tr>
              </thead>
              <tbody>
                {TEMPLATES.map(t => (
                  <tr key={t.id} className="border-t border-border hover:bg-surface-muted/60">
                    <td className="px-4 py-3 font-mono font-bold">{t.id}</td>
                    <td className="px-4 py-3"><div className="font-bold">{t.name}</div><div className="text-[10.5px] text-muted-foreground">{t.subject}</div></td>
                    <td className="px-4 py-3 font-mono text-muted-foreground">{t.trigger}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{t.sent}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-bold">{t.open}%</td>
                    <td className="px-4 py-3 text-right tabular-nums">{t.click}%</td>
                    <td className="px-4 py-3 text-right"><StatusChip tone={t.status==="active"?"success":"neutral"}>{t.status}</StatusChip></td>
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

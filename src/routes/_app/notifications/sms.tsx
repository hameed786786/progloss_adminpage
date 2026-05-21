import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { Surface } from "@/components/app/Surface";
import { KpiCard } from "@/components/app/KpiCard";
import { StatusChip } from "@/components/app/StatusChip";
import { MessageSquare, Plus, Phone } from "lucide-react";

export const Route = createFileRoute("/_app/notifications/sms")({ component: Page });

const TEMPLATES = [
  { id: "SMS-OTP", name: "Login OTP", body: "Your Progloss code: {{code}}. Valid 5 min.", sender: "PROGLOSS", sent24h: 412, delivered: 99.4, status: "active" },
  { id: "SMS-ARR", name: "Technician arrived", body: "Your technician {{tech}} has arrived at {{building}}.", sender: "PROGLOSS", sent24h: 184, delivered: 98.8, status: "active" },
  { id: "SMS-PAY", name: "Payment failed", body: "Your payment for {{invoice}} failed. Update card in app.", sender: "PROGLOSS", sent24h: 12, delivered: 100, status: "active" },
  { id: "SMS-RNW", name: "Renewal reminder", body: "Your {{plan}} renews tomorrow. AED {{amount}}.", sender: "PROGLOSS", sent24h: 28, delivered: 99.1, status: "active" },
];

function Page() {
  return (
    <>
      <TopBar title="SMS Notifications" subtitle="UAE telco SMS · sender ID PROGLOSS" actions={
        <button className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-primary px-3 text-[12.5px] font-bold text-primary-foreground"><Plus className="h-3.5 w-3.5"/> New template</button>
      }/>
      <div className="px-6 py-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <KpiCard label="Sent (24h)" value="636" icon={MessageSquare} accent="primary" />
          <KpiCard label="Delivery rate" value="99.2%" delta={0.3} icon={Phone} accent="success" />
          <KpiCard label="Cost (MTD)" value="AED 1,184" icon={MessageSquare} accent="primary" />
          <KpiCard label="Opt-outs" value="6" icon={MessageSquare} accent="warning" />
        </div>
        <Surface padded={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-[12.5px] min-w-[640px]">
              <thead className="bg-surface-muted text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
                <tr><th className="px-4 py-3 text-left">ID</th><th className="px-4 py-3 text-left">Template</th><th className="px-4 py-3 text-left">Sender</th><th className="px-4 py-3 text-right">Sent 24h</th><th className="px-4 py-3 text-right">Delivered</th><th className="px-4 py-3 text-right">Status</th></tr>
              </thead>
              <tbody>
                {TEMPLATES.map(t => (
                  <tr key={t.id} className="border-t border-border hover:bg-surface-muted/60">
                    <td className="px-4 py-3 font-mono font-bold">{t.id}</td>
                    <td className="px-4 py-3"><div className="font-bold">{t.name}</div><div className="text-[11px] text-muted-foreground">{t.body}</div></td>
                    <td className="px-4 py-3 font-mono">{t.sender}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{t.sent24h}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-bold">{t.delivered}%</td>
                    <td className="px-4 py-3 text-right"><StatusChip tone="success">{t.status}</StatusChip></td>
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

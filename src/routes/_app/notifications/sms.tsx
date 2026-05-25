import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { Surface } from "@/components/app/Surface";
import { KpiCard } from "@/components/app/KpiCard";
import { StatusChip } from "@/components/app/StatusChip";
import { MessageSquare, Plus, Phone } from "lucide-react";
import { fetchNotificationTemplates } from "@/lib/apiClient";
import useRealtime from "@/lib/useRealtime";

export const Route = createFileRoute("/_app/notifications/sms")({ component: Page });

function Page() {
  const templates = useRealtime('notificationTemplates', fetchNotificationTemplates, 'notificationTemplates:update');
  const rows = useMemo(() => (templates || []).filter((template: any) => template.type === 'sms'), [templates]);
  const sent24h = rows.reduce((sum: number, item: any) => sum + Number(item.sent24h ?? 0), 0);
  const deliveryRate = rows.length ? rows.reduce((sum: number, item: any) => sum + Number(item.delivered ?? 0), 0) / rows.length : 0;

  return (
    <>
      <TopBar title="SMS Notifications" subtitle="UAE telco SMS · sender ID PROGLOSS" actions={
        <button className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-primary px-3 text-[12.5px] font-bold text-primary-foreground"><Plus className="h-3.5 w-3.5"/> New template</button>
      }/>
      <div className="px-6 py-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <KpiCard label="Sent (24h)" value={sent24h.toString()} icon={MessageSquare} accent="primary" />
          <KpiCard label="Delivery rate" value={`${deliveryRate.toFixed(1)}%`} icon={Phone} accent="success" />
          <KpiCard label="Cost (MTD)" value={`AED ${(sent24h * 0.18).toFixed(0)}`} icon={MessageSquare} accent="primary" />
          <KpiCard label="Opt-outs" value={Math.max(0, Math.round((100 - deliveryRate) / 2)).toString()} icon={MessageSquare} accent="warning" />
        </div>
        <Surface padded={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-[12.5px] min-w-160">
              <thead className="bg-surface-muted text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
                <tr><th className="px-4 py-3 text-left">ID</th><th className="px-4 py-3 text-left">Template</th><th className="px-4 py-3 text-left">Sender</th><th className="px-4 py-3 text-right">Sent 24h</th><th className="px-4 py-3 text-right">Delivered</th><th className="px-4 py-3 text-right">Status</th></tr>
              </thead>
              <tbody>
                {rows.map((t: any) => (
                  <tr key={t.id} className="border-t border-border hover:bg-surface-muted/60">
                    <td className="px-4 py-3 font-mono font-bold">{t.id}</td>
                    <td className="px-4 py-3"><div className="font-bold">{t.name}</div><div className="text-[11px] text-muted-foreground">{t.body}</div></td>
                    <td className="px-4 py-3 font-mono">{t.sender}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{t.sent24h ?? 0}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-bold">{Number(t.delivered ?? 0).toFixed(1)}%</td>
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

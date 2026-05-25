import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { Surface } from "@/components/app/Surface";
import { KpiCard } from "@/components/app/KpiCard";
import { StatusChip } from "@/components/app/StatusChip";
import { Mail, Plus } from "lucide-react";
import { fetchNotificationTemplates } from "@/lib/apiClient";
import useRealtime from "@/lib/useRealtime";

export const Route = createFileRoute("/_app/notifications/email")({ component: Page });

function Page() {
  const templates = useRealtime('notificationTemplates', fetchNotificationTemplates, 'notificationTemplates:update');
  const rows = useMemo(() => (templates || []).filter((template: any) => template.type === 'email'), [templates]);
  const sent = rows.reduce((sum: number, item: any) => sum + Number(item.sent ?? 0), 0);
  const avgOpen = rows.length ? rows.reduce((sum: number, item: any) => sum + Number(item.open ?? 0), 0) / rows.length : 0;
  const avgClick = rows.length ? rows.reduce((sum: number, item: any) => sum + Number(item.click ?? 0), 0) / rows.length : 0;
  const bounce = Math.max(0, 2.0 - avgOpen / 50);

  return (
    <>
      <TopBar title="Email Templates" subtitle="Transactional & marketing email library" actions={
        <button className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-primary px-3 text-[12.5px] font-bold text-primary-foreground"><Plus className="h-3.5 w-3.5"/> New template</button>
      }/>
      <div className="px-6 py-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <KpiCard label="Sent (30d)" value={sent.toLocaleString()} icon={Mail} accent="primary" />
          <KpiCard label="Open rate" value={`${avgOpen.toFixed(1)}%`} icon={Mail} accent="success" />
          <KpiCard label="Click rate" value={`${avgClick.toFixed(1)}%`} icon={Mail} accent="success" />
          <KpiCard label="Bounce rate" value={`${bounce.toFixed(1)}%`} icon={Mail} accent="success" />
        </div>
        <Surface padded={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-[12.5px] min-w-180">
              <thead className="bg-surface-muted text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
                <tr><th className="px-4 py-3 text-left">ID</th><th className="px-4 py-3 text-left">Template</th><th className="px-4 py-3 text-left">Trigger</th><th className="px-4 py-3 text-right">Sent</th><th className="px-4 py-3 text-right">Open</th><th className="px-4 py-3 text-right">Click</th><th className="px-4 py-3 text-right">Status</th></tr>
              </thead>
              <tbody>
                {rows.map((t: any) => (
                  <tr key={t.id} className="border-t border-border hover:bg-surface-muted/60">
                    <td className="px-4 py-3 font-mono font-bold">{t.id}</td>
                    <td className="px-4 py-3"><div className="font-bold">{t.name}</div><div className="text-[10.5px] text-muted-foreground">{t.subject}</div></td>
                    <td className="px-4 py-3 font-mono text-muted-foreground">{t.trigger}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{t.sent}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-bold">{Number(t.open ?? 0).toFixed(1)}%</td>
                    <td className="px-4 py-3 text-right tabular-nums">{Number(t.click ?? 0).toFixed(1)}%</td>
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

import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { Surface, SectionTitle } from "@/components/app/Surface";
import { KpiCard } from "@/components/app/KpiCard";
import { StatusChip } from "@/components/app/StatusChip";
import { Bell, Plus, Send } from "lucide-react";
import { fetchNotificationTemplates } from "@/lib/apiClient";
import useRealtime from "@/lib/useRealtime";

export const Route = createFileRoute("/_app/notifications/push")({ component: Page });

function Page() {
  const templates = useRealtime('notificationTemplates', fetchNotificationTemplates, 'notificationTemplates:update');
  const rows = useMemo(() => (templates || []).filter((template: any) => template.type === 'push'), [templates]);
  const sent24h = rows.reduce((sum: number, item: any) => sum + Number(item.sent24h ?? 0), 0);
  const openRate = rows.length ? rows.reduce((sum: number, item: any) => sum + Number(item.open ?? 0), 0) / rows.length : 0;

  return (
    <>
      <TopBar title="Push Notifications" subtitle="Mobile + web push · template library" actions={
        <button className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-primary px-3 text-[12.5px] font-bold text-primary-foreground"><Plus className="h-3.5 w-3.5"/> New template</button>
      }/>
      <div className="px-6 py-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <KpiCard label="Sent (24h)" value={sent24h.toString()} icon={Send} accent="primary" />
          <KpiCard label="Open rate" value={`${openRate.toFixed(1)}%`} icon={Bell} accent="success" />
          <KpiCard label="Subscribed devices" value={Math.max(0, sent24h * 3).toLocaleString()} icon={Bell} accent="primary" />
          <KpiCard label="Templates" value={String(rows.length)} icon={Bell} accent="primary" />
        </div>
        <Surface padded={false}>
          <div className="px-5 py-4 border-b border-border"><SectionTitle title="Push templates" /></div>
          <div className="divide-y divide-border">
            {rows.map((t: any) => (
              <div key={t.id} className="flex flex-col gap-2 px-5 py-3.5 md:flex-row md:items-center md:gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2"><span className="text-[13px] font-black">{t.name}</span><StatusChip tone={t.status==="active"?"success":"neutral"}>{t.status}</StatusChip></div>
                  <div className="mt-0.5 text-[11.5px] text-muted-foreground font-mono">{t.trigger}</div>
                  <div className="mt-1 text-[12px] text-foreground/80">{t.body}</div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-[11.5px] md:w-44">
                  <div><div className="text-muted-foreground">Sent 24h</div><div className="font-bold tabular-nums">{t.sent24h ?? 0}</div></div>
                  <div><div className="text-muted-foreground">Open</div><div className="font-bold tabular-nums">{Number(t.open ?? 0).toFixed(1)}%</div></div>
                </div>
              </div>
            ))}
          </div>
        </Surface>
      </div>
    </>
  );
}

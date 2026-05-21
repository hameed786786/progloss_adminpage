import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { Surface, SectionTitle } from "@/components/app/Surface";
import { KpiCard } from "@/components/app/KpiCard";
import { StatusChip } from "@/components/app/StatusChip";
import { Bell, Plus, Send } from "lucide-react";

export const Route = createFileRoute("/_app/notifications/push")({ component: Page });

const TEMPLATES = [
  { id: "PUSH-WSH", name: "Wash completed", trigger: "wash.completed", body: "Your {{plate}} is sparkling clean ✨ Tap for photos.", sent24h: 412, open: 78.4, status: "active" },
  { id: "PUSH-ETA", name: "Technician ETA", trigger: "wo.en_route", body: "{{tech}} is 5 min away from {{building}}.", sent24h: 188, open: 64.2, status: "active" },
  { id: "PUSH-RNW", name: "Renewal in 3 days", trigger: "sub.renewal.t-3", body: "Your {{plan}} renews on {{date}}. Manage in-app.", sent24h: 42, open: 41.8, status: "active" },
  { id: "PUSH-PRM", name: "Summer detail promo", trigger: "manual", body: "20% off ceramic wax this week only.", sent24h: 0, open: 0, status: "draft" },
];

function Page() {
  return (
    <>
      <TopBar title="Push Notifications" subtitle="Mobile + web push · template library" actions={
        <button className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-primary px-3 text-[12.5px] font-bold text-primary-foreground"><Plus className="h-3.5 w-3.5"/> New template</button>
      }/>
      <div className="px-6 py-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <KpiCard label="Sent (24h)" value="642" delta={4.1} icon={Send} accent="primary" />
          <KpiCard label="Open rate" value="68.2%" delta={2.4} icon={Bell} accent="success" />
          <KpiCard label="Subscribed devices" value="2,184" icon={Bell} accent="primary" />
          <KpiCard label="Templates" value={String(TEMPLATES.length)} icon={Bell} accent="primary" />
        </div>
        <Surface padded={false}>
          <div className="px-5 py-4 border-b border-border"><SectionTitle title="Push templates" /></div>
          <div className="divide-y divide-border">
            {TEMPLATES.map(t => (
              <div key={t.id} className="flex flex-col gap-2 px-5 py-3.5 md:flex-row md:items-center md:gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2"><span className="text-[13px] font-black">{t.name}</span><StatusChip tone={t.status==="active"?"success":"neutral"}>{t.status}</StatusChip></div>
                  <div className="mt-0.5 text-[11.5px] text-muted-foreground font-mono">{t.trigger}</div>
                  <div className="mt-1 text-[12px] text-foreground/80">{t.body}</div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-[11.5px] md:w-44">
                  <div><div className="text-muted-foreground">Sent 24h</div><div className="font-bold tabular-nums">{t.sent24h}</div></div>
                  <div><div className="text-muted-foreground">Open</div><div className="font-bold tabular-nums">{t.open}%</div></div>
                </div>
              </div>
            ))}
          </div>
        </Surface>
      </div>
    </>
  );
}

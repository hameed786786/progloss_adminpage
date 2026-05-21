import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { Surface, SectionTitle } from "@/components/app/Surface";
import { KpiCard } from "@/components/app/KpiCard";
import { StatusChip } from "@/components/app/StatusChip";
import { Megaphone, Eye, MousePointerClick, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_app/ecommerce/promotions")({ component: Page });

const CAMPAIGNS = [
  { name: "Summer Detail Festival", channels: ["Push","Email","In-app"], starts: "20 May", ends: "30 Jun", reach: 12420, ctr: 8.4, conv: 312, status: "live" },
  { name: "Fleet Care quarterly bundle", channels: ["Email","Concierge"], starts: "01 May", ends: "30 Jun", reach: 184, ctr: 14.2, conv: 18, status: "live" },
  { name: "Ramadan Royale", channels: ["Push","SMS","Email"], starts: "10 Mar", ends: "10 Apr", reach: 18920, ctr: 11.1, conv: 482, status: "ended" },
  { name: "Eco upgrade nudge", channels: ["In-app"], starts: "15 May", ends: "Ongoing", reach: 412, ctr: 6.8, conv: 38, status: "live" },
];

function Page() {
  return (
    <>
      <TopBar title="Promotions" subtitle="Lifecycle, seasonal & cross-sell campaigns" />
      <div className="px-6 py-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <KpiCard label="Live campaigns" value="3" icon={Megaphone} accent="primary" />
          <KpiCard label="Reach (MTD)" value="32,140" delta={24.1} icon={Eye} accent="primary" />
          <KpiCard label="Avg CTR" value="9.8%" delta={1.4} icon={MousePointerClick} accent="success" />
          <KpiCard label="Attributed revenue" value="AED 48,420" delta={32.4} icon={Sparkles} accent="success" />
        </div>
        <Surface padded={false}>
          <div className="px-5 py-4 border-b border-border"><SectionTitle title="Active & past campaigns" /></div>
          <div className="overflow-x-auto">
            <table className="w-full text-[12.5px] min-w-[720px]">
              <thead className="bg-surface-muted text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
                <tr><th className="px-4 py-3 text-left">Campaign</th><th className="px-4 py-3 text-left">Channels</th><th className="px-4 py-3 text-left">Window</th><th className="px-4 py-3 text-right">Reach</th><th className="px-4 py-3 text-right">CTR</th><th className="px-4 py-3 text-right">Conv.</th><th className="px-4 py-3 text-right">Status</th></tr>
              </thead>
              <tbody>
                {CAMPAIGNS.map(c => (
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

import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { Surface } from "@/components/app/Surface";
import { KpiCard } from "@/components/app/KpiCard";
import { StatusChip } from "@/components/app/StatusChip";
import { Award, Star } from "lucide-react";
import { STAFF } from "@/lib/data";

export const Route = createFileRoute("/_app/staff/performance")({ component: Page });

const ROWS = STAFF.map((s, i) => ({
  ...s,
  rating: [4.9, 4.8, 4.6, 5.0, 4.4, 4.7, 3.9][i] ?? 4.5,
  complaints: [0, 0, 1, 0, 2, 1, 4][i] ?? 0,
  qcScore: [98, 96, 88, 100, 82, 92, 71][i] ?? 90,
  bonus: [820, 720, 280, 1180, 140, 420, 0][i] ?? 0,
  tier: i === 3 ? "Platinum" : i < 2 ? "Gold" : i < 5 ? "Silver" : "Improve",
}));

const TIER_TONE = { Platinum: "primary", Gold: "success", Silver: "info", Improve: "warning" } as const;

function Page() {
  return (
    <>
      <TopBar title="Staff Performance" subtitle="QC score · customer rating · bonus tracker" />
      <div className="px-6 py-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <KpiCard label="Avg rating" value="4.7 / 5" delta={0.2} icon={Star} accent="success" />
          <KpiCard label="Avg QC score" value="91" delta={1.4} icon={Award} accent="success" />
          <KpiCard label="Bonus pool (MTD)" value="AED 18,420" icon={Award} accent="primary" />
          <KpiCard label="Improvement plans" value="2" icon={Award} accent="warning" />
        </div>
        <Surface padded={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-[12.5px] min-w-[720px]">
              <thead className="bg-surface-muted text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
                <tr><th className="px-4 py-3 text-left">Staff</th><th className="px-4 py-3 text-left">Role</th><th className="px-4 py-3 text-right">Rating</th><th className="px-4 py-3 text-right">QC score</th><th className="px-4 py-3 text-right">Complaints</th><th className="px-4 py-3 text-right">Bonus</th><th className="px-4 py-3 text-right">Tier</th></tr>
              </thead>
              <tbody>
                {ROWS.map(r => (
                  <tr key={r.id} className="border-t border-border hover:bg-surface-muted/60">
                    <td className="px-4 py-3"><div className="flex items-center gap-2.5"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-[10.5px] font-black text-primary">{r.name.split(" ").map(n=>n[0]).slice(0,2).join("")}</div><span className="font-bold">{r.name}</span></div></td>
                    <td className="px-4 py-3 text-muted-foreground">{r.role}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-bold">{r.rating.toFixed(1)} <Star className="inline h-3 w-3 fill-[oklch(0.74_0.15_75)] text-[oklch(0.74_0.15_75)]"/></td>
                    <td className="px-4 py-3 text-right tabular-nums">{r.qcScore}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{r.complaints}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-bold">AED {r.bonus}</td>
                    <td className="px-4 py-3 text-right"><StatusChip tone={TIER_TONE[r.tier as keyof typeof TIER_TONE]}>{r.tier}</StatusChip></td>
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

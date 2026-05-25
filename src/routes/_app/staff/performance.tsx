import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { Surface } from "@/components/app/Surface";
import { KpiCard } from "@/components/app/KpiCard";
import { StatusChip } from "@/components/app/StatusChip";
import { Award, Star } from "lucide-react";
import { fetchStaff, fetchTickets } from "@/lib/apiClient";
import useRealtime from "@/lib/useRealtime";

export const Route = createFileRoute("/_app/staff/performance")({ component: Page });

const TIER_TONE = { Platinum: "primary", Gold: "success", Silver: "info", Improve: "warning" } as const;

function Page() {
  const staff = useRealtime('staff', fetchStaff, 'staff:update');
  const tickets = useRealtime('tickets', fetchTickets, 'tickets:update');

  const rows = useMemo(() => {
    return (staff || []).map((s: any) => {
      const assigned = (tickets || []).filter((ticket: any) => {
        const techValue = `${ticket.tech ?? ticket.assignee ?? ""}`.toLowerCase();
        return techValue.includes(String(s.name || "").toLowerCase());
      });
      const complaints = assigned.filter((ticket: any) => {
        const status = String(ticket.status || "").toLowerCase();
        const priority = String(ticket.priority || "").toLowerCase();
        return status === "escalated" || priority === "urgent";
      }).length;
      const statusBonus = s.status === "Cleaning" ? 4 : s.status === "Available" ? 2 : s.status === "Break" ? -2 : 0;
      const qcScore = Math.max(65, Math.min(100, 94 + statusBonus - complaints * 6));
      const rating = Number(Math.max(3.6, Math.min(5, 3.9 + qcScore / 100)).toFixed(1));
      const bonus = Math.max(0, Math.round((qcScore - 75) * 18));
      const tier = qcScore >= 97 ? "Platinum" : qcScore >= 90 ? "Gold" : qcScore >= 80 ? "Silver" : "Improve";
      return { ...s, complaints, qcScore, rating, bonus, tier };
    });
  }, [staff, tickets]);

  const avgRating = rows.length ? (rows.reduce((sum, row) => sum + row.rating, 0) / rows.length).toFixed(1) : "0.0";
  const avgQc = rows.length ? Math.round(rows.reduce((sum, row) => sum + row.qcScore, 0) / rows.length) : 0;
  const bonusPool = rows.reduce((sum, row) => sum + row.bonus, 0);
  const improveCount = rows.filter((row) => row.tier === "Improve").length;

  return (
    <>
      <TopBar title="Staff Performance" subtitle="Live QC score · customer rating · bonus tracker" />
      <div className="px-6 py-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <KpiCard label="Avg rating" value={`${avgRating} / 5`} icon={Star} accent="success" />
          <KpiCard label="Avg QC score" value={avgQc.toString()} icon={Award} accent="success" />
          <KpiCard label="Bonus pool (MTD)" value={`AED ${bonusPool.toLocaleString()}`} icon={Award} accent="primary" />
          <KpiCard label="Improvement plans" value={improveCount.toString()} icon={Award} accent="warning" />
        </div>
        <Surface padded={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-[12.5px] min-w-180">
              <thead className="bg-surface-muted text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
                <tr><th className="px-4 py-3 text-left">Staff</th><th className="px-4 py-3 text-left">Role</th><th className="px-4 py-3 text-right">Rating</th><th className="px-4 py-3 text-right">QC score</th><th className="px-4 py-3 text-right">Complaints</th><th className="px-4 py-3 text-right">Bonus</th><th className="px-4 py-3 text-right">Tier</th></tr>
              </thead>
              <tbody>
                {rows.map(r => (
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

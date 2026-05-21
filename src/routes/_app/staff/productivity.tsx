import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { Surface, SectionTitle } from "@/components/app/Surface";
import { KpiCard } from "@/components/app/KpiCard";
import { TrendingUp, Car, Timer, Star } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { STAFF } from "@/lib/data";

export const Route = createFileRoute("/_app/staff/productivity")({ component: Page });

const DATA = STAFF.map((s, i) => ({ name: s.name.split(" ")[0], washes: [38,34,12,42,18,28,4][i] ?? 20 }));

function Page() {
  return (
    <>
      <TopBar title="Productivity" subtitle="Output per technician · last 7 days" />
      <div className="px-6 py-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <KpiCard label="Washes / tech / day" value="9.4" delta={4.2} icon={Car} accent="success" />
          <KpiCard label="Avg cycle time" value="38m" delta={-3.1} icon={Timer} accent="success" />
          <KpiCard label="Top performer" value="Abdellah N." icon={Star} accent="primary" hint="42 washes / week" />
          <KpiCard label="Efficiency index" value="118" delta={6.1} icon={TrendingUp} accent="success" hint="vs 100 baseline" />
        </div>
        <Surface>
          <SectionTitle title="Washes per technician" sub="Last 7 days" />
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={DATA} margin={{ left: -10, right: 10, top: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.93 0.008 250)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "oklch(0.52 0.02 256)" }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fontSize: 11, fill: "oklch(0.52 0.02 256)" }} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{ background: "white", border: "1px solid oklch(0.92 0.008 250)", borderRadius: 12, fontSize: 12 }} />
              <Bar dataKey="washes" fill="oklch(0.48 0.16 258)" radius={[8,8,0,0]} maxBarSize={42}/>
            </BarChart>
          </ResponsiveContainer>
        </Surface>
      </div>
    </>
  );
}

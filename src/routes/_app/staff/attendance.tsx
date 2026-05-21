import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { Surface } from "@/components/app/Surface";
import { KpiCard } from "@/components/app/KpiCard";
import { StatusChip } from "@/components/app/StatusChip";
import { Clock, LogIn, LogOut, AlertTriangle } from "lucide-react";
import { STAFF } from "@/lib/data";

export const Route = createFileRoute("/_app/staff/attendance")({ component: Page });

const ROWS = STAFF.map((s, i) => ({
  ...s,
  in: ["06:02","05:58","09:51","05:54","09:48","09:55","—"][i] ?? "—",
  out: ["—","—","—","—","—","—","17:42"][i] ?? "—",
  hours: ["6.1h","6.2h","2.3h","6.3h","2.3h","2.2h","8.0h"][i] ?? "—",
  state: i === 6 ? "Absent" : i === 4 ? "Late" : "On time",
}));

function Page() {
  return (
    <>
      <TopBar title="Attendance" subtitle="Today · 20 May 2026 · Geo-fenced clock in/out" />
      <div className="px-6 py-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <KpiCard label="Clocked in" value="88 / 94" delta={1.1} icon={LogIn} accent="success" />
          <KpiCard label="Late arrivals" value="6" icon={AlertTriangle} accent="warning" />
          <KpiCard label="Absences" value="3" icon={LogOut} accent="danger" />
          <KpiCard label="Avg hours / day" value="7.8h" icon={Clock} accent="primary" />
        </div>
        <Surface padded={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-[12.5px] min-w-[720px]">
              <thead className="bg-surface-muted text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
                <tr><th className="px-4 py-3 text-left">Staff ID</th><th className="px-4 py-3 text-left">Name</th><th className="px-4 py-3 text-left">Shift</th><th className="px-4 py-3 text-right">Clock in</th><th className="px-4 py-3 text-right">Clock out</th><th className="px-4 py-3 text-right">Hours</th><th className="px-4 py-3 text-right">State</th></tr>
              </thead>
              <tbody>
                {ROWS.map(r => (
                  <tr key={r.id} className="border-t border-border hover:bg-surface-muted/60">
                    <td className="px-4 py-3 font-mono font-bold">{r.id}</td>
                    <td className="px-4 py-3 font-bold">{r.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.shift}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-bold">{r.in}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{r.out}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{r.hours}</td>
                    <td className="px-4 py-3 text-right"><StatusChip tone={r.state==="On time"?"success":r.state==="Late"?"warning":"danger"}>{r.state}</StatusChip></td>
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

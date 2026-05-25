import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { Surface } from "@/components/app/Surface";
import { KpiCard } from "@/components/app/KpiCard";
import { StatusChip } from "@/components/app/StatusChip";
import { Clock, LogIn, LogOut, AlertTriangle } from "lucide-react";
import { fetchStaff } from "@/lib/apiClient";
import useRealtime from "@/lib/useRealtime";

export const Route = createFileRoute("/_app/staff/attendance")({ component: Page });

function makeRow(s: any, i: number) {
  return {
    ...s,
    in: s.status === 'Available' ? '06:02' : s.status === 'Cleaning' ? '07:30' : '—',
    out: s.status === 'Offline' ? '—' : '17:00',
    hours: s.status === 'Available' ? '7.8h' : s.status === 'Cleaning' ? '6.5h' : '—',
    state: s.status === 'Offline' ? 'Absent' : s.status === 'Break' ? 'Late' : 'On time',
  };
}

function Page() {
  const staff = useRealtime('staff', fetchStaff, 'staff:update');

  const ROWS = staff.map(makeRow);
  const clockedIn = staff.filter((member) => member.status !== 'Offline').length;
  const lateArrivals = staff.filter((member) => member.status === 'Break').length;
  const absences = staff.filter((member) => member.status === 'Offline').length;
  const avgHours = staff.length ? (staff.filter((member) => member.status !== 'Offline').length * 7.8) / staff.length : 0;

  return (
    <>
      <TopBar title="Attendance" subtitle="Today · 20 May 2026 · Geo-fenced clock in/out" />
      <div className="px-6 py-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <KpiCard label="Clocked in" value={`${clockedIn} / ${staff.length}`} icon={LogIn} accent="success" />
          <KpiCard label="Late arrivals" value={lateArrivals.toString()} icon={AlertTriangle} accent="warning" />
          <KpiCard label="Absences" value={absences.toString()} icon={LogOut} accent="danger" />
          <KpiCard label="Avg hours / day" value={`${avgHours.toFixed(1)}h`} icon={Clock} accent="primary" />
        </div>
        <Surface padded={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-[12.5px] min-w-180">
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

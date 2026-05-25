import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { Surface } from "@/components/app/Surface";
import useRealtime from "@/lib/useRealtime";
import { useState, useMemo } from 'react';
// no audit REST endpoint currently; subscribe to realtime audit channel
const fetchEmpty = async () => [] as any[];
import { History, Search, Download } from "lucide-react";
import { exportToCsv } from '@/lib/csv';

export const Route = createFileRoute("/_app/audit")({ component: AuditLogs });

function AuditLogs() {
  const events = useRealtime('audit', fetchEmpty, 'audit:update');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return events;
    const q = search.toLowerCase().trim();
    return events.filter((a: any) => ((a.actor||'') + ' ' + (a.action||'') + ' ' + (a.ip||'')).toLowerCase().includes(q));
  }, [events, search]);

  const exportCsv = () => {
    const rows = (filtered || []).map((a: any) => ({ ts: a.ts, actor: a.actor, role: a.role, action: a.action, ip: a.ip }));
    if (!rows.length) return;
    exportToCsv(`audit_export_${new Date().toISOString().slice(0,10)}.csv`, rows);
  };

  return (
    <>
      <TopBar title="Audit Logs" subtitle="Tamper-evident · system-wide activity trail" actions={
        <button onClick={exportCsv} className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border bg-surface px-3 text-[12.5px] font-bold hover:bg-accent"><Download className="h-3.5 w-3.5" /> Export CSV</button>
      } />
      <div className="px-6 py-6 space-y-4">
        <Surface padded={false}>
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <div className="flex items-center gap-2 rounded-xl border border-border bg-surface-muted px-2.5 py-1.5 text-[12px] flex-1 max-w-md">
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search actor, action, IP…" className="w-full bg-transparent outline-none" />
            </div>
            { ["All","Super Admin","Finance","Operations","System"].map((t,i) => (
              <button key={t} className={`rounded-lg px-2.5 py-1.5 text-[11.5px] font-bold ${i===0 ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"}`}>{t}</button>
            )) }
          </div>
          <div className="divide-y divide-border">
            {filtered.map((a: any, i) => (
              <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-surface-muted/40">
                <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0"><History className="h-3.5 w-3.5" /></div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12.5px] text-foreground"><span className="font-bold">{a.actor}</span> <span className="text-muted-foreground">·</span> <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{a.role}</span></div>
                  <div className="text-[12.5px] text-foreground/80 mt-0.5">{a.action}</div>
                </div>
                <div className="text-right text-[11.5px] text-muted-foreground shrink-0">
                  <div>{a.ts}</div>
                  <div className="font-mono text-[10.5px]">{a.ip}</div>
                </div>
              </div>
            ))}
          </div>
        </Surface>
      </div>
    </>
  );
}

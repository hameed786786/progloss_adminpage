import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from 'react';
import { TopBar } from "@/components/app/TopBar";
import { Surface } from "@/components/app/Surface";
import { StatusChip } from "@/components/app/StatusChip";
import { fetchCustomers } from '@/lib/apiClient';
import { exportToCsv } from '@/lib/csv';
import { saveView } from '@/lib/views';
import { Filter, Download, ChevronDown, MoreHorizontal, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useRealtime from '@/lib/useRealtime';

export const Route = createFileRoute("/_app/customers/")({ component: CustomersPage });

const STATUS: Record<string, "success" | "warning" | "danger" | "neutral"> = {
  active: "success", paused: "warning", "churn-risk": "danger", cancelled: "neutral",
};

function CustomersPage() {
  const customers = useRealtime('customers', fetchCustomers, 'customers:update');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');
  const [communityFilter, setCommunityFilter] = useState('all');
  const [vehicleFilter, setVehicleFilter] = useState('all');
  const pageSize = 20;

  const summary = useMemo(() => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const parsedCustomers = customers.map((customer) => ({
      ...customer,
      sinceDate: new Date(customer.since ?? customer.createdAt ?? ''),
    }));
    const active = parsedCustomers.filter((customer) => customer.status === 'active').length;
    const churnRisk = parsedCustomers.filter((customer) => customer.status === 'churn-risk').length;
    const newThisMonth = parsedCustomers.filter((customer) => customer.sinceDate && !Number.isNaN(customer.sinceDate.getTime()) && customer.sinceDate >= monthStart).length;
    return { active, churnRisk, newThisMonth };
  }, [customers]);

  const filterOptions = useMemo(() => {
    const plans = Array.from(new Set(customers.map((c) => c.plan).filter((value) => Boolean(value)))).sort();
    const communities = Array.from(new Set(customers.map((c) => c.community).filter((value) => Boolean(value)))).sort();
    return { plans, communities };
  }, [customers]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return customers.filter((c) => {
      const matchesSearch = !q || (
        (c.name || '').toLowerCase().includes(q) ||
        (c.email || '').toLowerCase().includes(q) ||
        (c.plate || '').toLowerCase().includes(q) ||
        (c.community || '').toLowerCase().includes(q)
      );
      const matchesStatus = statusFilter === 'all' || (c.status || '').toLowerCase() === statusFilter;
      const matchesPlan = planFilter === 'all' || (c.plan || '') === planFilter;
      const matchesCommunity = communityFilter === 'all' || (c.community || '') === communityFilter;
      const vehicleCount = Number(c.vehicles ?? 0);
      const matchesVehicles = vehicleFilter === 'all'
        || (vehicleFilter === '1' && vehicleCount === 1)
        || (vehicleFilter === '2' && vehicleCount === 2)
        || (vehicleFilter === '3' && vehicleCount === 3)
        || (vehicleFilter === '4+' && vehicleCount >= 4);
      return matchesSearch && matchesStatus && matchesPlan && matchesCommunity && matchesVehicles;
    });
  }, [customers, search, statusFilter, planFilter, communityFilter, vehicleFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = useMemo(() => filtered.slice((page - 1) * pageSize, page * pageSize), [filtered, page]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, planFilter, communityFilter, vehicleFilter]);

  const filterLabel = (label: string, value: string, formatter?: (input: string) => string) => (
    <>
      {label} {value === 'all' ? 'All' : formatter ? formatter(value) : value} <ChevronDown className="h-3 w-3 text-muted-foreground" />
    </>
  );

  const exportCsv = () => {
    const rows = (filtered || []).map((c) => ({ id: c.id, name: c.name, email: c.email, community: c.community, plan: c.plan, status: c.status, ltv: c.ltv }));
    if (!rows.length) return;
    exportToCsv(`customers_export_${new Date().toISOString().slice(0,10)}.csv`, rows);
  };

  return (
    <>
      <TopBar title="Customers" subtitle={`${summary.active} active · ${summary.newThisMonth} new this month · ${summary.churnRisk} churn-risk`} />
      <div className="px-6 py-6 space-y-4">
        <Surface padded={false}>
          <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-3">
              <div className="flex items-center gap-2 rounded-xl border border-border bg-surface-muted px-2.5 py-1.5 text-[12.5px]">
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
              <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search name, email, plate…" className="w-64 bg-transparent outline-none" />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="inline-flex items-center gap-1 rounded-xl border border-border bg-surface px-3 py-1.5 text-[12px] font-bold text-foreground hover:bg-accent">
                  {filterLabel('Status', statusFilter, (v) => v.replace('-', ' '))}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-44">
                {['all', 'active', 'paused', 'churn-risk', 'cancelled'].map((value) => (
                  <DropdownMenuItem key={value} onClick={() => setStatusFilter(value)}>
                    {value === 'all' ? 'All status' : value.replace('-', ' ')}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="inline-flex items-center gap-1 rounded-xl border border-border bg-surface px-3 py-1.5 text-[12px] font-bold text-foreground hover:bg-accent">
                  {filterLabel('Plan', planFilter)}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem onClick={() => setPlanFilter('all')}>All plans</DropdownMenuItem>
                {filterOptions.plans.map((plan) => (
                  <DropdownMenuItem key={plan} onClick={() => setPlanFilter(plan)}>{plan}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="inline-flex items-center gap-1 rounded-xl border border-border bg-surface px-3 py-1.5 text-[12px] font-bold text-foreground hover:bg-accent">
                  {filterLabel('Community', communityFilter)}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64 max-h-72 overflow-y-auto">
                <DropdownMenuItem onClick={() => setCommunityFilter('all')}>All communities</DropdownMenuItem>
                {filterOptions.communities.map((community) => (
                  <DropdownMenuItem key={community} onClick={() => setCommunityFilter(community)}>{community}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="inline-flex items-center gap-1 rounded-xl border border-border bg-surface px-3 py-1.5 text-[12px] font-bold text-foreground hover:bg-accent">
                  {filterLabel('Vehicles', vehicleFilter)}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-44">
                {[
                  ['all', 'All vehicles'],
                  ['1', '1 vehicle'],
                  ['2', '2 vehicles'],
                  ['3', '3 vehicles'],
                  ['4+', '4+ vehicles'],
                ].map(([value, label]) => (
                  <DropdownMenuItem key={value} onClick={() => setVehicleFilter(value)}>{label}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <button
              onClick={() => {
                setSearch('');
                setStatusFilter('all');
                setPlanFilter('all');
                setCommunityFilter('all');
                setVehicleFilter('all');
                setPage(1);
              }}
              className="inline-flex items-center gap-1 rounded-xl border border-border bg-surface px-3 py-1.5 text-[12px] font-bold text-foreground hover:bg-accent"
            >
              Reset filters
            </button>
            <div className="ml-auto flex items-center gap-2">
              <button onClick={() => saveView('customers_views', 'manual-save', { search, page })} className="inline-flex items-center gap-1 rounded-xl border border-border bg-surface px-3 py-1.5 text-[12px] font-bold hover:bg-accent"><Filter className="h-3 w-3" /> Saved views</button>
              <button onClick={exportCsv} className="inline-flex items-center gap-1 rounded-xl border border-border bg-surface px-3 py-1.5 text-[12px] font-bold hover:bg-accent"><Download className="h-3 w-3" /> Export</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[12.5px]">
              <thead className="bg-surface-muted/60 text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5 text-left">Customer</th>
                  <th className="px-4 py-2.5 text-left">Community</th>
                  <th className="px-4 py-2.5 text-right">Vehicles</th>
                  <th className="px-4 py-2.5 text-left">Plan</th>
                  <th className="px-4 py-2.5 text-left">Status</th>
                  <th className="px-4 py-2.5 text-left">Since</th>
                  <th className="px-4 py-2.5 text-right">LTV (AED)</th>
                  <th className="px-4 py-2.5"></th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((c) => (
                  <tr key={c.id} className="border-t border-border hover:bg-surface-muted/40">
                    <td className="px-4 py-3">
                      <Link to="/customers/$id" params={{ id: c.id }} className="group flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-[11px] font-black text-primary">
                          {c.name.split(" ").map(n=>n[0]).slice(0,2).join("")}
                        </div>
                        <div className="leading-tight">
                          <div className="font-bold text-foreground group-hover:text-primary">{c.name}</div>
                          <div className="text-[11px] text-muted-foreground">{c.email}</div>
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-foreground/80">{c.community}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{c.vehicles}</td>
                    <td className="px-4 py-3">{c.plan}</td>
                    <td className="px-4 py-3"><StatusChip tone={STATUS[c.status]}>{c.status}</StatusChip></td>
                    <td className="px-4 py-3 text-muted-foreground">{c.since}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-bold">{c.ltv.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right"><button className="text-muted-foreground hover:text-foreground"><MoreHorizontal className="h-4 w-4" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-border px-4 py-3 text-[11.5px] text-muted-foreground">
            <span>Showing {filtered.length} customers</span>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="rounded-md border border-border bg-surface px-2 py-1 hover:bg-accent">Prev</button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.min(totalPages, Math.max(1, i + 1));
                return (
                  <button key={i} onClick={() => setPage(pageNum)} className={`rounded-md px-2.5 py-1 ${pageNum === page ? 'bg-primary font-bold text-primary-foreground' : 'border border-border bg-surface hover:bg-accent'}`}>{pageNum}</button>
                );
              })}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="rounded-md border border-border bg-surface px-2 py-1 hover:bg-accent">Next</button>
            </div>
          </div>
        </Surface>
      </div>
    </>
  );
}

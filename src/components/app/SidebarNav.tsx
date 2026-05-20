import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Users, MessageSquareWarning, LifeBuoy, GitBranch,
  CreditCard, RefreshCcw, Ticket, Wrench, Map, Radar,
  UserCog, Clock, TrendingUp, Award,
  Building2, Banknote, Car,
  Receipt, FileText, Repeat, FileCheck2, Undo2, AlertOctagon, FileMinus, Download,
  Wallet, Network, ScrollText,
  BarChart3, ShoppingBag, Tag, Megaphone, Bell, Mail, MessageSquare,
  ShieldCheck, KeyRound, History, Settings, Sparkles, ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Item = { label: string; to: string; icon: any };
type Group = { label: string; icon: any; items?: Item[]; to?: string };

const NAV: Group[] = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
  { label: "Customers", icon: Users, items: [
    { label: "All Customers", to: "/customers", icon: Users },
    { label: "Complaints", to: "/customers/complaints", icon: MessageSquareWarning },
    { label: "Tickets", to: "/customers/tickets", icon: LifeBuoy },
    { label: "Customer Lifecycle", to: "/customers/lifecycle", icon: GitBranch },
  ]},
  { label: "Subscriptions", icon: CreditCard, items: [
    { label: "Plans", to: "/subscriptions/plans", icon: CreditCard },
    { label: "Active Subscriptions", to: "/subscriptions/active", icon: Repeat },
    { label: "Renewals", to: "/subscriptions/renewals", icon: RefreshCcw },
    { label: "Coupons", to: "/subscriptions/coupons", icon: Ticket },
  ]},
  { label: "Operations", icon: Wrench, items: [
    { label: "Daily Operations", to: "/operations/daily", icon: Wrench },
    { label: "Dispatch Center", to: "/operations/dispatch", icon: Map },
    { label: "Staff Live Tracking", to: "/operations/tracking", icon: Radar },
  ]},
  { label: "Staff", icon: UserCog, items: [
    { label: "Staff Directory", to: "/staff/directory", icon: UserCog },
    { label: "Attendance", to: "/staff/attendance", icon: Clock },
    { label: "Productivity", to: "/staff/productivity", icon: TrendingUp },
    { label: "Performance", to: "/staff/performance", icon: Award },
  ]},
  { label: "Apartments", icon: Building2, items: [
    { label: "Communities", to: "/apartments/communities", icon: Building2 },
    { label: "Revenue", to: "/apartments/revenue", icon: Banknote },
    { label: "Vehicle Mapping", to: "/apartments/vehicles", icon: Car },
  ]},
  { label: "Billing & VAT", icon: Receipt, items: [
    { label: "Overview", to: "/billing/overview", icon: Receipt },
    { label: "Invoices", to: "/billing/invoices", icon: FileText },
    { label: "Auto Billing", to: "/billing/auto", icon: Repeat },
    { label: "VAT Reports", to: "/billing/vat", icon: FileCheck2 },
    { label: "Refunds", to: "/billing/refunds", icon: Undo2 },
    { label: "Failed Payments", to: "/billing/failed", icon: AlertOctagon },
    { label: "Credit Notes", to: "/billing/credit", icon: FileMinus },
    { label: "Exports", to: "/billing/exports", icon: Download },
  ]},
  { label: "Payments", icon: Wallet, items: [
    { label: "Transactions", to: "/payments/transactions", icon: Wallet },
    { label: "AutoPay", to: "/payments/autopay", icon: Repeat },
    { label: "Gateway Logs", to: "/payments/gateway", icon: Network },
  ]},
  { label: "Analytics", icon: BarChart3, to: "/analytics" },
  { label: "Ecommerce", icon: ShoppingBag, items: [
    { label: "Products", to: "/ecommerce/products", icon: ShoppingBag },
    { label: "Orders", to: "/ecommerce/orders", icon: ScrollText },
    { label: "Coupons", to: "/ecommerce/coupons", icon: Tag },
    { label: "Promotions", to: "/ecommerce/promotions", icon: Megaphone },
  ]},
  { label: "Notifications", icon: Bell, items: [
    { label: "Push", to: "/notifications/push", icon: Bell },
    { label: "Email", to: "/notifications/email", icon: Mail },
    { label: "SMS", to: "/notifications/sms", icon: MessageSquare },
  ]},
  { label: "RBAC", icon: ShieldCheck, items: [
    { label: "Roles", to: "/rbac/roles", icon: ShieldCheck },
    { label: "Permissions", to: "/rbac/permissions", icon: KeyRound },
  ]},
  { label: "Audit Logs", icon: History, to: "/audit" },
  { label: "Settings", icon: Settings, to: "/settings" },
];

function NavItem({ to, label, icon: Icon, depth = 0 }: { to: string; label: string; icon: any; depth?: number }) {
  const { location } = useRouterState();
  const active = location.pathname === to || (to !== "/dashboard" && location.pathname.startsWith(to));
  return (
    <Link
      to={to}
      className={cn(
        "group flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition-colors",
        depth > 0 ? "ml-7 text-muted-foreground" : "text-foreground/80",
        active
          ? "bg-primary/8 text-primary"
          : "hover:bg-accent hover:text-foreground"
      )}
    >
      <Icon className={cn("h-[15px] w-[15px]", active ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} strokeWidth={1.75} />
      <span className="truncate">{label}</span>
    </Link>
  );
}

function NavGroup({ group }: { group: Group }) {
  const { location } = useRouterState();
  const groupActive = group.items?.some((i) => location.pathname.startsWith(i.to)) ?? false;
  const [open, setOpen] = useState(groupActive);
  if (group.to) return <NavItem to={group.to} label={group.label} icon={group.icon} />;
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium text-foreground/80 transition-colors hover:bg-accent"
      >
        <group.icon className="h-[15px] w-[15px] text-muted-foreground" strokeWidth={1.75} />
        <span className="flex-1 text-left">{group.label}</span>
        <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="mt-0.5 flex flex-col gap-0.5 py-0.5">
          {group.items?.map((i) => <NavItem key={i.to} {...i} depth={1} />)}
        </div>
      )}
    </div>
  );
}

export function SidebarNav() {
  return (
    <aside className="hidden lg:flex h-screen w-[252px] shrink-0 flex-col border-r border-border bg-sidebar">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-card">
          <Sparkles className="h-[18px] w-[18px]" strokeWidth={2} />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-[15px] font-black tracking-tight text-foreground">Progloss</span>
          <span className="text-[10.5px] font-medium uppercase tracking-[0.12em] text-muted-foreground">Super Admin</span>
        </div>
      </div>
      <div className="px-3">
        <div className="rounded-xl border border-border bg-surface-muted px-3 py-2.5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Workspace</div>
          <div className="mt-0.5 truncate text-[13px] font-bold text-foreground">Progloss Dubai HQ</div>
        </div>
      </div>
      <nav className="mt-3 flex-1 overflow-y-auto px-3 pb-4">
        <div className="flex flex-col gap-0.5">
          {NAV.map((g) => <NavGroup key={g.label} group={g} />)}
        </div>
      </nav>
      <div className="border-t border-border px-3 py-3">
        <div className="flex items-center gap-2.5 rounded-lg px-2 py-1.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">RA</div>
          <div className="min-w-0 flex-1 leading-tight">
            <div className="truncate text-[12.5px] font-bold text-foreground">Rashid Al Mansoori</div>
            <div className="truncate text-[10.5px] text-muted-foreground">Super Admin · Dubai</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

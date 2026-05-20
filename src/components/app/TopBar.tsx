import { Search, Bell, Command, Plus, HelpCircle } from "lucide-react";

export function TopBar({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-20 flex flex-col gap-3 border-b border-border bg-background/85 px-6 py-4 backdrop-blur-md lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:py-5">
      <div className="min-w-0">
        <h1 className="truncate text-[22px] font-black leading-tight tracking-tight text-foreground">{title}</h1>
        {subtitle && <p className="mt-0.5 text-[13px] text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-[13px] text-muted-foreground shadow-card transition-colors hover:border-primary/30 w-[280px]">
          <Search className="h-3.5 w-3.5" />
          <input
            placeholder="Search customers, invoices, plates…"
            className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          />
          <kbd className="hidden md:inline-flex items-center gap-0.5 rounded-md border border-border bg-surface-muted px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground">
            <Command className="h-2.5 w-2.5" /> K
          </kbd>
        </div>
        {actions}
        <button className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
          <HelpCircle className="h-4 w-4" />
        </button>
        <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
        </button>
        <button className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-primary px-3 text-[13px] font-bold text-primary-foreground shadow-card transition-colors hover:bg-primary/90">
          <Plus className="h-3.5 w-3.5" /> Create
        </button>
      </div>
    </header>
  );
}

import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SidebarNav } from "@/components/app/SidebarNav";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <SidebarNav />
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}

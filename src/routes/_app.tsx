import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { SidebarNav } from "@/components/app/SidebarNav";
import { getCurrentUserRole } from "@/lib/apiClient";

export const Route = createFileRoute("/_app")({
  beforeLoad: ({ location }) => {
    const role = getCurrentUserRole();

    if (role !== "Super Admin") {
      throw redirect({
        to: "/login",
        search: location.href ? { redirect: location.href } : undefined,
      });
    }
  },
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

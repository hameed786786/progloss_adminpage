import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { PageStub } from "@/components/app/PageStub";
export const Route = createFileRoute("/_app/notifications/push")({ component: () => (<><TopBar title="Push Notifications" subtitle="Mobile push delivery and templates"/><div className="px-6 py-6"><PageStub title="Push Notifications" description="Mobile push delivery and templates Configure, monitor and orchestrate this module from the Progloss admin." /></div></>) });

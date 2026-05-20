import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { PageStub } from "@/components/app/PageStub";
export const Route = createFileRoute("/_app/subscriptions/active")({ component: () => (<><TopBar title="Active Subscriptions" subtitle="1,624 active subscriptions across all plans"/><div className="px-6 py-6"><PageStub title="Active Subscriptions" description="1,624 active subscriptions across all plans Configure, monitor and orchestrate this module from the Progloss admin." /></div></>) });

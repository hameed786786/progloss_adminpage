import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { PageStub } from "@/components/app/PageStub";
export const Route = createFileRoute("/_app/billing/auto")({ component: () => (<><TopBar title="Auto Billing" subtitle="Recurring billing cycles and retry logic"/><div className="px-6 py-6"><PageStub title="Auto Billing" description="Recurring billing cycles and retry logic Configure, monitor and orchestrate this module from the Progloss admin." /></div></>) });

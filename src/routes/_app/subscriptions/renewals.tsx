import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { PageStub } from "@/components/app/PageStub";
export const Route = createFileRoute("/_app/subscriptions/renewals")({ component: () => (<><TopBar title="Renewals" subtitle="184 renewals due in next 7 days"/><div className="px-6 py-6"><PageStub title="Renewals" description="184 renewals due in next 7 days Configure, monitor and orchestrate this module from the Progloss admin." /></div></>) });

import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { PageStub } from "@/components/app/PageStub";
export const Route = createFileRoute("/_app/payments/gateway")({ component: () => (<><TopBar title="Gateway Logs" subtitle="Network Intl, Stripe and Telr webhook trail"/><div className="px-6 py-6"><PageStub title="Gateway Logs" description="Network Intl, Stripe and Telr webhook trail Configure, monitor and orchestrate this module from the Progloss admin." /></div></>) });

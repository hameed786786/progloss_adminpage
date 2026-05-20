import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { PageStub } from "@/components/app/PageStub";
export const Route = createFileRoute("/_app/ecommerce/orders")({ component: () => (<><TopBar title="Orders" subtitle="One-off ecommerce orders and fulfilment"/><div className="px-6 py-6"><PageStub title="Orders" description="One-off ecommerce orders and fulfilment Configure, monitor and orchestrate this module from the Progloss admin." /></div></>) });

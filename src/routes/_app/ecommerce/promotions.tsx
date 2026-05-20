import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { PageStub } from "@/components/app/PageStub";
export const Route = createFileRoute("/_app/ecommerce/promotions")({ component: () => (<><TopBar title="Promotions" subtitle="Seasonal campaigns and bundles"/><div className="px-6 py-6"><PageStub title="Promotions" description="Seasonal campaigns and bundles Configure, monitor and orchestrate this module from the Progloss admin." /></div></>) });

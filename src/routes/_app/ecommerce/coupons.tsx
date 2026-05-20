import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { PageStub } from "@/components/app/PageStub";
export const Route = createFileRoute("/_app/ecommerce/coupons")({ component: () => (<><TopBar title="Ecommerce Coupons" subtitle="Storefront discount codes"/><div className="px-6 py-6"><PageStub title="Ecommerce Coupons" description="Storefront discount codes Configure, monitor and orchestrate this module from the Progloss admin." /></div></>) });

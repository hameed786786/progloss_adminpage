import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { PageStub } from "@/components/app/PageStub";
export const Route = createFileRoute("/_app/ecommerce/products")({ component: () => (<><TopBar title="Products" subtitle="Add-on services, ceramic packages and detailing"/><div className="px-6 py-6"><PageStub title="Products" description="Add-on services, ceramic packages and detailing Configure, monitor and orchestrate this module from the Progloss admin." /></div></>) });

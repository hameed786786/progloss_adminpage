import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { PageStub } from "@/components/app/PageStub";
export const Route = createFileRoute("/_app/billing/credit")({ component: () => (<><TopBar title="Credit Notes" subtitle="Issued credit notes and adjustments"/><div className="px-6 py-6"><PageStub title="Credit Notes" description="Issued credit notes and adjustments Configure, monitor and orchestrate this module from the Progloss admin." /></div></>) });

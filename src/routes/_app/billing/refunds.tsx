import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { PageStub } from "@/components/app/PageStub";
export const Route = createFileRoute("/_app/billing/refunds")({ component: () => (<><TopBar title="Refunds" subtitle="Issued refunds, reasons and audit trail"/><div className="px-6 py-6"><PageStub title="Refunds" description="Issued refunds, reasons and audit trail Configure, monitor and orchestrate this module from the Progloss admin." /></div></>) });

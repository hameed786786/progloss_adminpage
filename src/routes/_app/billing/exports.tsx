import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { PageStub } from "@/components/app/PageStub";
export const Route = createFileRoute("/_app/billing/exports")({ component: () => (<><TopBar title="Billing Exports" subtitle="CSV, XLSX and accounting integration exports"/><div className="px-6 py-6"><PageStub title="Billing Exports" description="CSV, XLSX and accounting integration exports Configure, monitor and orchestrate this module from the Progloss admin." /></div></>) });

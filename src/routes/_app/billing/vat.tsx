import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { PageStub } from "@/components/app/PageStub";
export const Route = createFileRoute("/_app/billing/vat")({ component: () => (<><TopBar title="VAT Reports" subtitle="FTA-compliant VAT returns and breakdowns"/><div className="px-6 py-6"><PageStub title="VAT Reports" description="FTA-compliant VAT returns and breakdowns Configure, monitor and orchestrate this module from the Progloss admin." /></div></>) });

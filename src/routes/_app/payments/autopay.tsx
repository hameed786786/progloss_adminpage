import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { PageStub } from "@/components/app/PageStub";
export const Route = createFileRoute("/_app/payments/autopay")({ component: () => (<><TopBar title="AutoPay" subtitle="Customer auto-charge configurations"/><div className="px-6 py-6"><PageStub title="AutoPay" description="Customer auto-charge configurations Configure, monitor and orchestrate this module from the Progloss admin." /></div></>) });

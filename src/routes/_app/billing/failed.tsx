import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { PageStub } from "@/components/app/PageStub";
export const Route = createFileRoute("/_app/billing/failed")({ component: () => (<><TopBar title="Failed Payments" subtitle="Failed charges with retry status and dunning"/><div className="px-6 py-6"><PageStub title="Failed Payments" description="Failed charges with retry status and dunning Configure, monitor and orchestrate this module from the Progloss admin." /></div></>) });

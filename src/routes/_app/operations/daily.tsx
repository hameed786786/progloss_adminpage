import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { PageStub } from "@/components/app/PageStub";
export const Route = createFileRoute("/_app/operations/daily")({ component: () => (<><TopBar title="Daily Operations" subtitle="Today\'s wash schedule and operational health"/><div className="px-6 py-6"><PageStub title="Daily Operations" description="Today\'s wash schedule and operational health Configure, monitor and orchestrate this module from the Progloss admin." /></div></>) });

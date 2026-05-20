import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { PageStub } from "@/components/app/PageStub";
export const Route = createFileRoute("/_app/staff/performance")({ component: () => (<><TopBar title="Performance" subtitle="Quality scores, customer ratings and incidents"/><div className="px-6 py-6"><PageStub title="Performance" description="Quality scores, customer ratings and incidents Configure, monitor and orchestrate this module from the Progloss admin." /></div></>) });

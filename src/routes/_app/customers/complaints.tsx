import { createFileRoute } from "@tanstack/react-router";
import { PageStub } from "@/components/app/PageStub";
import { TopBar } from "@/components/app/TopBar";
export const Route = createFileRoute("/_app/customers/complaints")({ component: () => (<><TopBar title="Complaints" subtitle="Customer complaint queue and resolution"/><div className="px-6 py-6"><PageStub title="Complaints queue" description="Track, triage and resolve customer complaints with SLA monitoring and root-cause analysis."/></div></>) });

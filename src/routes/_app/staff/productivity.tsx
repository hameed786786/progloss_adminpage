import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { PageStub } from "@/components/app/PageStub";
export const Route = createFileRoute("/_app/staff/productivity")({ component: () => (<><TopBar title="Productivity" subtitle="Washes per shift and time-on-task analytics"/><div className="px-6 py-6"><PageStub title="Productivity" description="Washes per shift and time-on-task analytics Configure, monitor and orchestrate this module from the Progloss admin." /></div></>) });

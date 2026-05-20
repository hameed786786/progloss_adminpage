import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { PageStub } from "@/components/app/PageStub";
export const Route = createFileRoute("/_app/staff/directory")({ component: () => (<><TopBar title="Staff Directory" subtitle="94 technicians, supervisors and admins"/><div className="px-6 py-6"><PageStub title="Staff Directory" description="94 technicians, supervisors and admins Configure, monitor and orchestrate this module from the Progloss admin." /></div></>) });

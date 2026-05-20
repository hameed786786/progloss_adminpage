import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { PageStub } from "@/components/app/PageStub";
export const Route = createFileRoute("/_app/staff/attendance")({ component: () => (<><TopBar title="Attendance" subtitle="Shift check-ins, breaks and absences"/><div className="px-6 py-6"><PageStub title="Attendance" description="Shift check-ins, breaks and absences Configure, monitor and orchestrate this module from the Progloss admin." /></div></>) });

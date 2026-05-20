import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { PageStub } from "@/components/app/PageStub";
export const Route = createFileRoute("/_app/notifications/sms")({ component: () => (<><TopBar title="SMS" subtitle="SMS templates, segments and delivery reports"/><div className="px-6 py-6"><PageStub title="SMS" description="SMS templates, segments and delivery reports Configure, monitor and orchestrate this module from the Progloss admin." /></div></>) });

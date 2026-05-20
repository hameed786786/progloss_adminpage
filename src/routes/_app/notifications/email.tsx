import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { PageStub } from "@/components/app/PageStub";
export const Route = createFileRoute("/_app/notifications/email")({ component: () => (<><TopBar title="Email" subtitle="Transactional and marketing email"/><div className="px-6 py-6"><PageStub title="Email" description="Transactional and marketing email Configure, monitor and orchestrate this module from the Progloss admin." /></div></>) });

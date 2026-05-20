import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { PageStub } from "@/components/app/PageStub";
export const Route = createFileRoute("/_app/settings")({ component: () => (<><TopBar title="Settings" subtitle="Workspace, branding, integrations and security"/><div className="px-6 py-6"><PageStub title="Settings" description="Workspace, branding, integrations and security Configure, monitor and orchestrate this module from the Progloss admin." /></div></>) });

import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { PageStub } from "@/components/app/PageStub";
export const Route = createFileRoute("/_app/apartments/vehicles")({ component: () => (<><TopBar title="Vehicle Mapping" subtitle="Vehicles mapped to residents and apartments"/><div className="px-6 py-6"><PageStub title="Vehicle Mapping" description="Vehicles mapped to residents and apartments Configure, monitor and orchestrate this module from the Progloss admin." /></div></>) });

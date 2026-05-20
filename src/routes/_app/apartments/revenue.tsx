import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { PageStub } from "@/components/app/PageStub";
export const Route = createFileRoute("/_app/apartments/revenue")({ component: () => (<><TopBar title="Apartment Revenue" subtitle="Revenue per building and per-vehicle averages"/><div className="px-6 py-6"><PageStub title="Apartment Revenue" description="Revenue per building and per-vehicle averages Configure, monitor and orchestrate this module from the Progloss admin." /></div></>) });

import { createFileRoute } from "@tanstack/react-router";
import { PageStub } from "@/components/app/PageStub";
import { TopBar } from "@/components/app/TopBar";
export const Route = createFileRoute("/_app/customers/lifecycle")({ component: () => (<><TopBar title="Customer Lifecycle" subtitle="Onboarding → Active → Renewal → Churn cohorts"/><div className="px-6 py-6"><PageStub title="Lifecycle cohorts" description="Visualize customer journey stages, retention curves and lifecycle-stage automations."/></div></>) });

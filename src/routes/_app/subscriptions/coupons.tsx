import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { PageStub } from "@/components/app/PageStub";
export const Route = createFileRoute("/_app/subscriptions/coupons")({ component: () => (<><TopBar title="Subscription Coupons" subtitle="Promo codes and discount management"/><div className="px-6 py-6"><PageStub title="Subscription Coupons" description="Promo codes and discount management Configure, monitor and orchestrate this module from the Progloss admin." /></div></>) });

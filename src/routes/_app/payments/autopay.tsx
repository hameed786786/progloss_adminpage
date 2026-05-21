import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { Surface } from "@/components/app/Surface";
import { KpiCard } from "@/components/app/KpiCard";
import { StatusChip } from "@/components/app/StatusChip";
import { Repeat, CreditCard, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/_app/payments/autopay")({ component: Page });

const MANDATES = [
  { id: "AP-2026-9182", customer: "Maryam Al Hashimi", method: "Visa •• 4421", plan: "Royal Monthly", nextCharge: "01 Jun", amount: 441.00, status: "active" },
  { id: "AP-2026-9183", customer: "Omar Hourani", method: "Mastercard •• 7710", plan: "Premium Bi-weekly", nextCharge: "26 May", amount: 273.00, status: "active" },
  { id: "AP-2026-9184", customer: "Sophia Chen", method: "Apple Pay", plan: "Fleet Care", nextCharge: "01 Jun", amount: 1302.00, status: "paused" },
  { id: "AP-2026-9185", customer: "Aisha Mubarak", method: "Visa •• 0098", plan: "Eco Weekly", nextCharge: "Tomorrow", amount: 152.25, status: "active" },
  { id: "AP-2026-9186", customer: "Karim Boutros", method: "Mastercard •• 1209", plan: "Premium Bi-weekly", nextCharge: "—", amount: 273.00, status: "revoked" },
];

function Page() {
  return (
    <>
      <TopBar title="AutoPay Mandates" subtitle="Tokenized recurring charges · PCI-DSS Level 1" />
      <div className="px-6 py-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <KpiCard label="Active mandates" value="1,218" delta={4.8} icon={Repeat} accent="success" />
          <KpiCard label="Auto-charged (MTD)" value="AED 384,180" delta={6.4} icon={CreditCard} accent="primary" />
          <KpiCard label="Mandate revocations" value="14" icon={ShieldCheck} accent="warning" />
          <KpiCard label="Coverage rate" value="88.4%" delta={1.2} icon={ShieldCheck} accent="success" />
        </div>
        <Surface padded={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-[12.5px] min-w-[720px]">
              <thead className="bg-surface-muted text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
                <tr><th className="px-4 py-3 text-left">Mandate</th><th className="px-4 py-3 text-left">Customer</th><th className="px-4 py-3 text-left">Method</th><th className="px-4 py-3 text-left">Plan</th><th className="px-4 py-3 text-left">Next charge</th><th className="px-4 py-3 text-right">Amount</th><th className="px-4 py-3 text-right">Status</th></tr>
              </thead>
              <tbody>
                {MANDATES.map(m => (
                  <tr key={m.id} className="border-t border-border hover:bg-surface-muted/60">
                    <td className="px-4 py-3 font-mono font-bold">{m.id}</td>
                    <td className="px-4 py-3">{m.customer}</td>
                    <td className="px-4 py-3 text-muted-foreground">{m.method}</td>
                    <td className="px-4 py-3">{m.plan}</td>
                    <td className="px-4 py-3">{m.nextCharge}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-bold">AED {m.amount.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right"><StatusChip tone={m.status==="active"?"success":m.status==="paused"?"warning":"danger"}>{m.status}</StatusChip></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Surface>
      </div>
    </>
  );
}

// Realistic Progloss mock data — Dubai car wash operations
export const COMMUNITIES = [
  "Marina Gate 2", "Burj Vista 1", "Damac Heights", "JBR Sadaf 5",
  "Bay Central", "Park Island Sanibel", "Princess Tower", "Cayan Tower",
  "Emirates Hills Villa 47", "Arabian Ranches III", "Dubai Hills Estate",
];

export const PLATES = ["P-12-34892","R-77-21034","Q-15-67120","T-44-90211","S-28-44102","O-91-55103","M-12-77321","N-66-31049"];

export const CUSTOMERS = [
  { id: "CUS-10421", name: "Maryam Al Hashimi", email: "maryam.h@meraas.ae", phone: "+971 50 412 8821", community: "Marina Gate 2", vehicles: 2, plan: "Royal Monthly", status: "active", since: "Jan 2024", ltv: 8420 },
  { id: "CUS-10422", name: "Omar Hourani", email: "o.hourani@gmail.com", phone: "+971 56 220 7733", community: "Damac Heights", vehicles: 1, plan: "Premium Bi-weekly", status: "active", since: "Mar 2024", ltv: 3120 },
  { id: "CUS-10423", name: "Sophia Chen", email: "sophia.chen@axios.io", phone: "+971 52 880 1180", community: "Burj Vista 1", vehicles: 3, plan: "Fleet Care", status: "active", since: "Aug 2023", ltv: 14210 },
  { id: "CUS-10424", name: "Hamdan Al Suwaidi", email: "hamdan.s@etisalat.ae", phone: "+971 50 110 4477", community: "Emirates Hills Villa 47", vehicles: 4, plan: "Royal Monthly", status: "paused", since: "Oct 2022", ltv: 21450 },
  { id: "CUS-10425", name: "Priya Nair", email: "priya.nair@accenture.com", phone: "+971 54 661 0098", community: "JBR Sadaf 5", vehicles: 1, plan: "Eco Weekly", status: "active", since: "May 2025", ltv: 740 },
  { id: "CUS-10426", name: "Karim Boutros", email: "k.boutros@aramex.com", phone: "+971 50 718 3290", community: "Park Island Sanibel", vehicles: 2, plan: "Premium Bi-weekly", status: "churn-risk", since: "Feb 2023", ltv: 6280 },
  { id: "CUS-10427", name: "Aisha Mubarak", email: "aisha.m@adq.ae", phone: "+971 56 909 1212", community: "Dubai Hills Estate", vehicles: 1, plan: "Eco Weekly", status: "active", since: "Nov 2024", ltv: 1180 },
  { id: "CUS-10428", name: "Tom Pereira", email: "tom.p@dpworld.com", phone: "+971 52 311 7745", community: "Bay Central", vehicles: 1, plan: "Premium Bi-weekly", status: "cancelled", since: "Sep 2023", ltv: 2640 },
];

export const INVOICES = [
  { id: "INV-2026-04812", customer: "Maryam Al Hashimi", community: "Marina Gate 2", plate: "P-12-34892", plan: "Royal Monthly", subtotal: 420.00, vat: 21.00, total: 441.00, status: "paid", date: "12 May 2026" },
  { id: "INV-2026-04813", customer: "Omar Hourani", community: "Damac Heights", plate: "R-77-21034", plan: "Premium Bi-weekly", subtotal: 260.00, vat: 13.00, total: 273.00, status: "paid", date: "12 May 2026" },
  { id: "INV-2026-04814", customer: "Sophia Chen", community: "Burj Vista 1", plate: "Q-15-67120", plan: "Fleet Care", subtotal: 1240.00, vat: 62.00, total: 1302.00, status: "overdue", date: "08 May 2026" },
  { id: "INV-2026-04815", customer: "Hamdan Al Suwaidi", community: "Emirates Hills 47", plate: "T-44-90211", plan: "Royal Monthly", subtotal: 720.00, vat: 36.00, total: 756.00, status: "pending", date: "14 May 2026" },
  { id: "INV-2026-04816", customer: "Priya Nair", community: "JBR Sadaf 5", plate: "S-28-44102", plan: "Eco Weekly", subtotal: 145.00, vat: 7.25, total: 152.25, status: "paid", date: "13 May 2026" },
  { id: "INV-2026-04817", customer: "Karim Boutros", community: "Park Island", plate: "O-91-55103", plan: "Premium Bi-weekly", subtotal: 260.00, vat: 13.00, total: 273.00, status: "failed", date: "11 May 2026" },
  { id: "INV-2026-04818", customer: "Aisha Mubarak", community: "Dubai Hills", plate: "M-12-77321", plan: "Eco Weekly", subtotal: 145.00, vat: 7.25, total: 152.25, status: "paid", date: "15 May 2026" },
  { id: "INV-2026-04819", customer: "Tom Pereira", community: "Bay Central", plate: "N-66-31049", plan: "Premium Bi-weekly", subtotal: 260.00, vat: 13.00, total: 273.00, status: "refunded", date: "07 May 2026" },
];

export const STAFF = [
  { id: "PRG-T-012", name: "Imran Saeed", role: "Senior Technician", zone: "Marina", status: "Cleaning", building: "Marina Gate 2", plate: "P-12-34892", shift: "06:00–14:00", eta: "11m" },
  { id: "PRG-T-018", name: "Joseph Mwangi", role: "Technician", zone: "Downtown", status: "En Route", building: "Burj Vista 1", plate: "Q-15-67120", shift: "06:00–14:00", eta: "4m" },
  { id: "PRG-T-021", name: "Rohit Sharma", role: "Technician", zone: "JBR", status: "Available", building: "—", plate: "—", shift: "10:00–18:00", eta: "—" },
  { id: "PRG-T-027", name: "Abdellah Naciri", role: "Lead Technician", zone: "Emirates Hills", status: "Cleaning", building: "Villa 47", plate: "T-44-90211", shift: "06:00–14:00", eta: "22m" },
  { id: "PRG-T-031", name: "Maxim Volkov", role: "Technician", zone: "Dubai Hills", status: "Break", building: "Hub-3", plate: "—", shift: "10:00–18:00", eta: "8m" },
  { id: "PRG-T-035", name: "Daniel Okafor", role: "Technician", zone: "Damac Heights", status: "Cleaning", building: "Tower B", plate: "R-77-21034", shift: "10:00–18:00", eta: "9m" },
  { id: "PRG-T-038", name: "Ali Rida", role: "Technician", zone: "Bay Central", status: "Offline", building: "—", plate: "—", shift: "—", eta: "—" },
];

export const TICKETS = [
  { id: "TKT-9821", subject: "Water spots on rear windshield", customer: "Maryam Al Hashimi", priority: "high", status: "open", sla: "2h 14m", assigned: "Imran Saeed", created: "Today, 09:42" },
  { id: "TKT-9822", subject: "Wrong plate marked as completed", customer: "Sophia Chen", priority: "urgent", status: "escalated", sla: "Breached", assigned: "Operations Admin", created: "Today, 07:10" },
  { id: "TKT-9823", subject: "Reschedule weekend slot", customer: "Aisha Mubarak", priority: "low", status: "in-progress", sla: "11h 02m", assigned: "Support Agent", created: "Yesterday" },
  { id: "TKT-9824", subject: "VAT receipt missing in app", customer: "Omar Hourani", priority: "medium", status: "open", sla: "5h 31m", assigned: "Finance Admin", created: "Today, 11:08" },
  { id: "TKT-9825", subject: "Subscription paused but charged", customer: "Hamdan Al Suwaidi", priority: "urgent", status: "in-progress", sla: "1h 09m", assigned: "Finance Admin", created: "Today, 08:55" },
  { id: "TKT-9826", subject: "Eco-foam smells different today", customer: "Priya Nair", priority: "low", status: "resolved", sla: "—", assigned: "Imran Saeed", created: "12 May" },
];

export const PLANS = [
  { id: "PLN-ECO", name: "Eco Weekly", price: 145, freq: "weekly", washes: 4, vehicles: 1, perks: ["Waterless eco wash","Tyre dressing","Interior vacuum"], active: 412 },
  { id: "PLN-PRE", name: "Premium Bi-weekly", price: 260, freq: "bi-weekly", washes: 2, vehicles: 1, perks: ["Premium foam","Interior detail","Glass treatment","Dashboard polish"], active: 638 },
  { id: "PLN-ROY", name: "Royal Monthly", price: 420, freq: "monthly", washes: 4, vehicles: 2, perks: ["Ceramic top-up","Engine bay clean","Leather conditioning","Priority slots"], active: 281 },
  { id: "PLN-FLT", name: "Fleet Care", price: 1240, freq: "monthly", washes: 16, vehicles: 8, perks: ["Dedicated technician","SLA 4h","Custom reports","Quarterly detail"], active: 47 },
];

export const APARTMENTS = [
  { name: "Marina Gate 2", units: 248, residents: 142, vehicles: 168, staff: 4, mrr: 38420, complaints: 2, occupancy: 87 },
  { name: "Burj Vista 1", units: 312, residents: 188, vehicles: 221, staff: 5, mrr: 52110, complaints: 4, occupancy: 91 },
  { name: "Damac Heights", units: 280, residents: 167, vehicles: 198, staff: 4, mrr: 44280, complaints: 1, occupancy: 84 },
  { name: "JBR Sadaf 5", units: 196, residents: 98, vehicles: 112, staff: 3, mrr: 24180, complaints: 0, occupancy: 76 },
  { name: "Park Island Sanibel", units: 168, residents: 91, vehicles: 108, staff: 3, mrr: 21940, complaints: 3, occupancy: 81 },
  { name: "Emirates Hills Villa 47", units: 1, residents: 6, vehicles: 9, staff: 1, mrr: 4280, complaints: 0, occupancy: 100 },
];

export const REVENUE_TREND = [
  { m: "Dec", mrr: 168, churn: 1.8 },
  { m: "Jan", mrr: 184, churn: 1.6 },
  { m: "Feb", mrr: 198, churn: 1.4 },
  { m: "Mar", mrr: 221, churn: 1.5 },
  { m: "Apr", mrr: 247, churn: 1.2 },
  { m: "May", mrr: 268, churn: 1.1 },
];

export const COMPLAINT_TREND = [
  { d: "Mon", c: 7 }, { d: "Tue", c: 4 }, { d: "Wed", c: 9 },
  { d: "Thu", c: 5 }, { d: "Fri", c: 12 }, { d: "Sat", c: 8 }, { d: "Sun", c: 3 },
];

export const SUBSCRIPTION_GROWTH = [
  { m: "Dec", new: 88, churn: 22 },
  { m: "Jan", new: 104, churn: 18 },
  { m: "Feb", new: 121, churn: 24 },
  { m: "Mar", new: 138, churn: 19 },
  { m: "Apr", new: 156, churn: 26 },
  { m: "May", new: 172, churn: 21 },
];

export const PAYMENTS = [
  { id: "TXN-2026-9001", method: "Visa •• 4421", customer: "Maryam Al Hashimi", gateway: "Network Intl", amount: 441.00, status: "captured", date: "Today 11:02" },
  { id: "TXN-2026-9002", method: "Mastercard •• 7710", customer: "Omar Hourani", gateway: "Network Intl", amount: 273.00, status: "captured", date: "Today 10:48" },
  { id: "TXN-2026-9003", method: "Apple Pay", customer: "Sophia Chen", gateway: "Stripe", amount: 1302.00, status: "failed", date: "Today 09:11" },
  { id: "TXN-2026-9004", method: "AED Wallet", customer: "Hamdan Al Suwaidi", gateway: "Telr", amount: 756.00, status: "pending", date: "Today 08:32" },
  { id: "TXN-2026-9005", method: "Visa •• 0098", customer: "Priya Nair", gateway: "Network Intl", amount: 152.25, status: "captured", date: "Today 07:55" },
  { id: "TXN-2026-9006", method: "Mastercard •• 1209", customer: "Karim Boutros", gateway: "Stripe", amount: 273.00, status: "failed", date: "Today 07:21" },
];

export const AUDIT = [
  { ts: "Today 11:42", actor: "Rashid Al Mansoori", role: "Super Admin", action: "Updated permission matrix · Finance Admin · billing.refund.create", ip: "94.200.12.41" },
  { ts: "Today 10:18", actor: "Layla Hassan", role: "Finance Admin", action: "Issued refund AED 273.00 on INV-2026-04817", ip: "31.215.6.118" },
  { ts: "Today 09:51", actor: "System", role: "AutoBilling", action: "Generated 412 invoices for Eco Weekly cycle", ip: "—" },
  { ts: "Today 08:33", actor: "Khalid Noor", role: "Dispatcher", action: "Reassigned PRG-T-018 → Burj Vista 1 (TKT-9822)", ip: "94.200.18.7" },
  { ts: "Yesterday 19:02", actor: "Sara Khoury", role: "Operations Admin", action: "Created plan PLN-ROY revision v3.2", ip: "31.215.6.74" },
  { ts: "Yesterday 17:46", actor: "System", role: "Gateway", action: "Webhook failure retry · Stripe · payment_intent.failed", ip: "—" },
];

export const ROLES = [
  { id: "ROL-SUP", name: "Super Admin", users: 2, color: "primary", desc: "Full access across every module and workspace." },
  { id: "ROL-OPS", name: "Operations Admin", users: 4, color: "info", desc: "Oversees dispatch, daily ops and staff productivity." },
  { id: "ROL-FIN", name: "Finance Admin", users: 3, color: "warning", desc: "Owns billing, VAT, refunds and gateway reconciliation." },
  { id: "ROL-DSP", name: "Dispatcher", users: 6, color: "info", desc: "Assigns technicians and manages the live queue." },
  { id: "ROL-SUP2", name: "Support Agent", users: 8, color: "neutral", desc: "Handles tickets, complaints and reschedules." },
  { id: "ROL-INV", name: "Inventory Manager", users: 2, color: "neutral", desc: "Stock, consumables and supplier orders." },
  { id: "ROL-SPV", name: "Supervisor", users: 5, color: "neutral", desc: "Building-level supervision and QC sign-off." },
  { id: "ROL-STF", name: "Staff", users: 84, color: "neutral", desc: "Field technicians executing wash orders." },
];

export const PERM_MODULES = [
  "Dashboard","Customers","Subscriptions","Operations","Staff","Apartments",
  "Billing & VAT","Payments","Analytics","Ecommerce","RBAC","Audit",
];
export const PERM_ACTIONS = ["Read","Create","Update","Delete","Export","Billing","Analytics"];

// Matrix: 1=full, 0.5=partial, 0=none
export const PERM_MATRIX: Record<string, Record<string, number[]>> = {
  "Super Admin":        Object.fromEntries(PERM_MODULES.map((m) => [m, [1,1,1,1,1,1,1]])),
  "Operations Admin":   Object.fromEntries(PERM_MODULES.map((m) => [m, m === "Billing & VAT" || m === "RBAC" ? [1,0,0,0,1,0,1] : [1,1,1, m==="Audit"?0:0.5, 1, 0, 1]])),
  "Finance Admin":      Object.fromEntries(PERM_MODULES.map((m) => [m, m === "Billing & VAT" || m === "Payments" ? [1,1,1,0.5,1,1,1] : [1,0,0,0,1,1,1]])),
  "Dispatcher":         Object.fromEntries(PERM_MODULES.map((m) => [m, m === "Operations" ? [1,1,1,0,0.5,0,0.5] : [1,0,0,0,0,0,0]])),
  "Support Agent":      Object.fromEntries(PERM_MODULES.map((m) => [m, m === "Customers" ? [1,1,1,0,0,0,0] : [1,0,0,0,0,0,0]])),
  "Inventory Manager":  Object.fromEntries(PERM_MODULES.map((m) => [m, [1,0,0,0,0.5,0,0]])),
  "Supervisor":         Object.fromEntries(PERM_MODULES.map((m) => [m, m === "Staff" ? [1,0,1,0,0.5,0,0.5] : [1,0,0,0,0,0,0]])),
  "Staff":              Object.fromEntries(PERM_MODULES.map((m) => [m, m === "Operations" ? [1,0,0.5,0,0,0,0] : [0,0,0,0,0,0,0]])),
};

export const DISPATCH_QUEUE = [
  { id: "WO-12041", plate: "P-12-34892", community: "Marina Gate 2", plan: "Royal", slot: "08:00–09:00", tech: "Imran Saeed", status: "in-progress" },
  { id: "WO-12042", plate: "R-77-21034", community: "Damac Heights", plan: "Premium", slot: "08:00–09:00", tech: "Daniel Okafor", status: "in-progress" },
  { id: "WO-12043", plate: "Q-15-67120", community: "Burj Vista 1", plan: "Fleet", slot: "09:00–10:00", tech: "Joseph Mwangi", status: "en-route" },
  { id: "WO-12044", plate: "T-44-90211", community: "Emirates Hills 47", plan: "Royal", slot: "09:00–10:30", tech: "Abdellah Naciri", status: "in-progress" },
  { id: "WO-12045", plate: "S-28-44102", community: "JBR Sadaf 5", plan: "Eco", slot: "10:00–10:30", tech: "Unassigned", status: "queued" },
  { id: "WO-12046", plate: "M-12-77321", community: "Dubai Hills", plan: "Eco", slot: "10:30–11:00", tech: "Unassigned", status: "queued" },
  { id: "WO-12047", plate: "N-66-31049", community: "Bay Central", plan: "Premium", slot: "11:00–12:00", tech: "Unassigned", status: "queued" },
];

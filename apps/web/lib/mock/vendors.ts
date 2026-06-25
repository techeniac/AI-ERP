import type { Vendor } from "@/lib/types";

export const mockVendors: Vendor[] = [
  {
    id: "vend-001", name: "PricewaterhouseCoopers Middle East", category: "IT Services",
    email: "it.me@pwc.com", phone: "+971-4-304-3100", contactName: "Khalid Al Mansouri",
    country: "UAE", taxNumber: "100234567890001", paymentTermsDays: 30,
    currency: "AED", status: "active", rating: 4.8, totalPurchased: 4200000,
    createdAt: "2024-01-15T09:00:00.000Z",
  },
  {
    id: "vend-002", name: "Amazon Web Services", category: "Cloud / Software",
    email: "billing@aws.amazon.com", phone: "+1-800-090-8453", contactName: "Support Team",
    country: "USA", paymentTermsDays: 0,
    currency: "USD", status: "active", rating: 4.9, totalPurchased: 85000,
    createdAt: "2024-02-01T09:00:00.000Z",
  },
  {
    id: "vend-003", name: "Grand Stores LLC", category: "Office Supplies",
    email: "corporate@grandstores.ae", phone: "+971-4-355-8800", contactName: "Sara Al Marzooqi",
    country: "UAE", taxNumber: "100345678901002", paymentTermsDays: 15,
    currency: "AED", status: "active", rating: 3.9, totalPurchased: 340000,
    createdAt: "2024-03-01T09:00:00.000Z",
  },
  {
    id: "vend-004", name: "JWT MENA FZ LLC", category: "Marketing",
    email: "accounts@jwt.ae", phone: "+971-4-365-6000", contactName: "Nadia Al Sayed",
    country: "UAE", taxNumber: "100456789012003", paymentTermsDays: 45,
    currency: "AED", status: "active", rating: 4.3, totalPurchased: 1850000,
    createdAt: "2024-03-15T09:00:00.000Z",
  },
  {
    id: "vend-005", name: "Al Tamimi & Company", category: "Legal",
    email: "billing@tamimi.com", phone: "+971-4-364-1641", contactName: "Ahmed Al Tamimi",
    country: "UAE", taxNumber: "100567890123004", paymentTermsDays: 30,
    currency: "AED", status: "active", rating: 4.7, totalPurchased: 2100000,
    createdAt: "2024-04-01T09:00:00.000Z",
  },
  {
    id: "vend-006", name: "Aramex International", category: "Logistics",
    email: "accounts@aramex.com", phone: "+971-4-286-5000", contactName: "Rami Tabari",
    country: "UAE", taxNumber: "100678901234005", paymentTermsDays: 30,
    currency: "AED", status: "active", rating: 4.2, totalPurchased: 680000,
    createdAt: "2024-04-15T09:00:00.000Z",
  },
  {
    id: "vend-007", name: "Schneider Electric Gulf FZE", category: "Maintenance",
    email: "gulf.services@schneider-electric.com", phone: "+971-4-881-6000",
    contactName: "Faisal Al Rashidi", country: "UAE", taxNumber: "100789012345006",
    paymentTermsDays: 30, currency: "AED", status: "active", rating: 4.5,
    totalPurchased: 1250000, createdAt: "2024-05-01T09:00:00.000Z",
  },
  {
    id: "vend-008", name: "Microsoft Gulf FZ LLC", category: "Software Licenses",
    email: "gulflicensing@microsoft.com", phone: "+971-4-813-2100", contactName: "Licensing Team",
    country: "UAE", taxNumber: "100890123456007", paymentTermsDays: 30,
    currency: "AED", status: "active", rating: 4.6, totalPurchased: 3400000,
    createdAt: "2024-05-15T09:00:00.000Z",
  },
  {
    id: "vend-009", name: "Fetchr (formerly Quiqup)", category: "Logistics",
    email: "billing@fetchr.us", phone: "+971-4-358-1234", contactName: "Logistics Support",
    country: "UAE", taxNumber: "100901234567008", paymentTermsDays: 15,
    currency: "AED", status: "active", rating: 4.1, totalPurchased: 420000,
    createdAt: "2024-06-01T09:00:00.000Z",
  },
  {
    id: "vend-010", name: "Etisalat Business (e&)", category: "Telecom / Connectivity",
    email: "business@etisalat.ae", phone: "+971-4-101-1234", contactName: "Business Support",
    country: "UAE", taxNumber: "100012345678009", paymentTermsDays: 30,
    currency: "AED", status: "active", rating: 4.0, totalPurchased: 520000,
    createdAt: "2024-06-15T09:00:00.000Z",
  },
  {
    id: "vend-011", name: "Axiom Telecom LLC", category: "IT Hardware",
    email: "corporate@axiomtelecom.com", phone: "+971-4-223-5555", contactName: "Omar Al Falasi",
    country: "UAE", taxNumber: "100123456789010", paymentTermsDays: 7,
    currency: "AED", status: "active", rating: 4.0, totalPurchased: 180000,
    createdAt: "2024-07-01T09:00:00.000Z",
  },
  {
    id: "vend-012", name: "IBM Middle East & Africa", category: "IT Services",
    email: "billing.mea@ibm.com", phone: "+971-4-391-3900", contactName: "Account Manager",
    country: "UAE", taxNumber: "100234567890011", paymentTermsDays: 30,
    currency: "AED", status: "active", rating: 4.4, totalPurchased: 72000,
    createdAt: "2024-07-15T09:00:00.000Z",
  },
];

export function getMockVendorById(id: string): Vendor | undefined {
  return mockVendors.find((v) => v.id === id);
}

import type { PurchaseRequest, PRStatus } from "@/lib/types";

export const mockPurchaseRequests: PurchaseRequest[] = [
  // ── DRAFT (2) ─────────────────────────────────────────────────────────────
  {
    id: "pr-001", prNumber: "PR-2026-0011",
    requesterId: "user-ops", requesterName: "Vikram Nair", requestorName: "Vikram Nair", department: "Operations",
    items: [
      { id: "pri-001-1", description: "Standing Desk (Height Adjustable)", quantity: 4, estimatedPrice: 18000, suggestedVendor: "Grand Stores LLC" },
      { id: "pri-001-2", description: "Ergonomic Chair", quantity: 4, estimatedPrice: 12000, suggestedVendor: "Grand Stores LLC" },
    ],
    totalEstimated: 120000, totalAmount: 120000, currency: "AED",
    title: "Upgrading workstations for the new operations team members joining ...", justification: "Upgrading workstations for the new operations team members joining next month.",
    requiredByDate: "2026-07-15T00:00:00.000Z",
    status: "draft", createdAt: "2026-06-22T10:00:00.000Z", updatedAt: "2026-06-22T10:00:00.000Z",
  },
  {
    id: "pr-002", prNumber: "PR-2026-0012",
    requesterId: "user-admin", requesterName: "Arjun Sharma", requestorName: "Arjun Sharma", department: "Technology",
    items: [
      { id: "pri-002-1", description: "MacBook Pro M4 (16-inch)", quantity: 2, estimatedPrice: 195000, suggestedVendor: "Apple Gulf FZ LLC" },
      { id: "pri-002-2", description: "External 4K Monitor (27-inch)", quantity: 2, estimatedPrice: 42000 },
    ],
    totalEstimated: 474000, totalAmount: 474000, currency: "AED",
    title: "New hardware for two senior developers onboarding in July 2026", justification: "New hardware for two senior developers onboarding in July 2026.",
    requiredByDate: "2026-07-01T00:00:00.000Z",
    status: "draft", createdAt: "2026-06-23T08:30:00.000Z", updatedAt: "2026-06-23T08:30:00.000Z",
  },

  // ── SUBMITTED (4) ─────────────────────────────────────────────────────────
  {
    id: "pr-003", prNumber: "PR-2026-0007",
    requesterId: "user-support", requesterName: "Ananya Singh", requestorName: "Ananya Singh", department: "Customer Success",
    items: [
      { id: "pri-003-1", description: "Freshdesk Pro Plan – 10 agents (Annual)", quantity: 10, estimatedPrice: 5200, suggestedVendor: "Freshworks" },
    ],
    totalEstimated: 52000, totalAmount: 52000, currency: "AED",
    title: "Current plan expiring July 31", justification: "Current plan expiring July 31. Renewal for the customer success team.",
    requiredByDate: "2026-07-25T00:00:00.000Z",
    status: "submitted", createdAt: "2026-06-10T09:00:00.000Z", updatedAt: "2026-06-10T09:30:00.000Z",
  },
  {
    id: "pr-004", prNumber: "PR-2026-0008",
    requesterId: "user-ops", requesterName: "Vikram Nair", requestorName: "Vikram Nair", department: "Operations",
    items: [
      { id: "pri-004-1", description: "AWS EC2 Reserved Instances (1-year)", quantity: 3, estimatedPrice: 280000, suggestedVendor: "Amazon Web Services" },
      { id: "pri-004-2", description: "AWS RDS PostgreSQL (Multi-AZ)", quantity: 1, estimatedPrice: 180000, suggestedVendor: "Amazon Web Services" },
    ],
    totalEstimated: 1020000, totalAmount: 1020000, currency: "AED",
    title: "Infrastructure upgrade for the new client onboardings planned in Q3...", justification: "Infrastructure upgrade for the new client onboardings planned in Q3 2026. Reserved instances will save 35% vs on-demand.",
    requiredByDate: "2026-07-20T00:00:00.000Z",
    status: "submitted", createdAt: "2026-06-15T10:00:00.000Z", updatedAt: "2026-06-15T10:30:00.000Z",
  },
  {
    id: "pr-005", prNumber: "PR-2026-0009",
    requesterId: "user-sales", requesterName: "Rahul Mehta", requestorName: "Rahul Mehta", department: "Sales",
    items: [
      { id: "pri-005-1", description: "LinkedIn Sales Navigator – Team Plan (5 seats)", quantity: 5, estimatedPrice: 85000 },
      { id: "pri-005-2", description: "ZoomInfo Professional (3 seats)", quantity: 3, estimatedPrice: 110000 },
    ],
    totalEstimated: 415000, totalAmount: 415000, currency: "AED",
    title: "Sales tools to support the new outbound SDR team", justification: "Sales tools to support the new outbound SDR team. Expected to generate 3x ROI based on pipeline targets.",
    requiredByDate: "2026-07-01T00:00:00.000Z",
    status: "submitted", createdAt: "2026-06-18T11:00:00.000Z", updatedAt: "2026-06-18T11:30:00.000Z",
  },
  {
    id: "pr-006", prNumber: "PR-2026-0010",
    requesterId: "user-admin", requesterName: "Arjun Sharma", requestorName: "Arjun Sharma", department: "Technology",
    items: [
      { id: "pri-006-1", description: "Cybersecurity Penetration Test (Annual)", quantity: 1, estimatedPrice: 350000, suggestedVendor: "Cybereason Inc" },
      { id: "pri-006-2", description: "SSL Wildcard Certificate (3-year)", quantity: 1, estimatedPrice: 28000 },
    ],
    totalEstimated: 378000, totalAmount: 378000, currency: "AED",
    title: "Annual security compliance requirement", justification: "Annual security compliance requirement. ISO 27001 audit scheduled for September 2026.",
    requiredByDate: "2026-08-01T00:00:00.000Z",
    status: "submitted", createdAt: "2026-06-20T09:00:00.000Z", updatedAt: "2026-06-20T09:30:00.000Z",
  },

  // ── APPROVED (3) ──────────────────────────────────────────────────────────
  {
    id: "pr-007", prNumber: "PR-2026-0003",
    requesterId: "user-ops", requesterName: "Vikram Nair", requestorName: "Vikram Nair", department: "Operations",
    items: [
      { id: "pri-007-1", description: "Zoom Business Plan – 20 hosts (Annual)", quantity: 20, estimatedPrice: 8500, suggestedVendor: "Zoom" },
    ],
    totalEstimated: 170000, totalAmount: 170000, currency: "AED",
    title: "Video conferencing for remote team coordination and client meetings", justification: "Video conferencing for remote team coordination and client meetings.",
    requiredByDate: "2026-06-01T00:00:00.000Z",
    status: "approved", createdAt: "2026-05-10T09:00:00.000Z", updatedAt: "2026-05-15T14:00:00.000Z",
  },
  {
    id: "pr-008", prNumber: "PR-2026-0004",
    requesterId: "user-finance", requesterName: "Priya Patel", requestorName: "Priya Patel", department: "Finance",
    items: [
      { id: "pri-008-1", description: "Zoho Books Plus (Multi-user)", quantity: 1, estimatedPrice: 54000, suggestedVendor: "Zoho Corporation" },
      { id: "pri-008-2", description: "Accountant-Assisted Setup & Training (2 days)", quantity: 2, estimatedPrice: 12000 },
    ],
    totalEstimated: 78000, totalAmount: 78000, currency: "AED",
    title: "Accounting software for the new subsidiary entity to be incorporate...", justification: "Accounting software for the new subsidiary entity to be incorporated in July.",
    requiredByDate: "2026-06-15T00:00:00.000Z",
    status: "approved", createdAt: "2026-05-20T10:00:00.000Z", updatedAt: "2026-05-25T11:00:00.000Z",
  },
  {
    id: "pr-009", prNumber: "PR-2026-0005",
    requesterId: "user-admin", requesterName: "Arjun Sharma", requestorName: "Arjun Sharma", department: "Technology",
    items: [
      { id: "pri-009-1", description: "GitHub Enterprise Cloud – 15 seats (Annual)", quantity: 15, estimatedPrice: 19500, suggestedVendor: "GitHub" },
    ],
    totalEstimated: 292500, totalAmount: 292500, currency: "AED",
    title: "Development team source code management and CI/CD", justification: "Development team source code management and CI/CD. Current plan at capacity.",
    requiredByDate: "2026-06-30T00:00:00.000Z",
    status: "approved", createdAt: "2026-05-28T09:00:00.000Z", updatedAt: "2026-06-02T10:00:00.000Z",
  },

  // ── REJECTED (2) ──────────────────────────────────────────────────────────
  {
    id: "pr-010", prNumber: "PR-2026-0001",
    requesterId: "user-sales", requesterName: "Rahul Mehta", requestorName: "Rahul Mehta", department: "Sales",
    items: [
      { id: "pri-010-1", description: "Salesforce Enterprise – 10 seats (Annual)", quantity: 10, estimatedPrice: 285000 },
    ],
    totalEstimated: 2850000, totalAmount: 2850000, currency: "AED",
    title: "CRM upgrade to Salesforce for better pipeline tracking", justification: "CRM upgrade to Salesforce for better pipeline tracking.",
    requiredByDate: "2026-05-01T00:00:00.000Z",
    status: "rejected", createdAt: "2026-04-10T10:00:00.000Z", updatedAt: "2026-04-18T15:00:00.000Z",
  },
  {
    id: "pr-011", prNumber: "PR-2026-0002",
    requesterId: "user-ops", requesterName: "Vikram Nair", requestorName: "Vikram Nair", department: "Operations",
    items: [
      { id: "pri-011-1", description: "Office Renovation – Conference Room A", quantity: 1, estimatedPrice: 800000 },
    ],
    totalEstimated: 800000, totalAmount: 800000, currency: "AED",
    title: "Upgrade conference room with new AV equipment and furniture", justification: "Upgrade conference room with new AV equipment and furniture.",
    requiredByDate: "2026-05-15T00:00:00.000Z",
    status: "rejected", createdAt: "2026-04-20T09:00:00.000Z", updatedAt: "2026-04-28T14:00:00.000Z",
  },

  // ── CONVERTED (1) ─────────────────────────────────────────────────────────
  {
    id: "pr-012", prNumber: "PR-2026-0006",
    requesterId: "user-ops", requesterName: "Vikram Nair", requestorName: "Vikram Nair", department: "Operations",
    items: [
      { id: "pri-012-1", description: "Schneider Electric UPS (10 KVA)", quantity: 2, estimatedPrice: 85000, suggestedVendor: "Schneider Electric Gulf" },
      { id: "pri-012-2", description: "Installation & AMC (1 year)", quantity: 2, estimatedPrice: 12000, suggestedVendor: "Schneider Electric Gulf" },
    ],
    totalEstimated: 194000, totalAmount: 194000, currency: "AED",
    title: "Power backup for new server room expansion", justification: "Power backup for new server room expansion. Critical for 99.9% uptime SLA.",
    requiredByDate: "2026-06-20T00:00:00.000Z",
    status: "converted", createdAt: "2026-05-25T09:00:00.000Z", updatedAt: "2026-06-05T10:00:00.000Z",
  },
];

export function getMockPurchaseRequestsByStatus(status: PRStatus): PurchaseRequest[] {
  return mockPurchaseRequests.filter((pr) => pr.status === status);
}

export function getMockPurchaseRequestById(id: string): PurchaseRequest | undefined {
  return mockPurchaseRequests.find((pr) => pr.id === id);
}

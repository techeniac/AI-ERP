export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "proposal"
  | "negotiation"
  | "won"
  | "lost";

export type LeadSource =
  | "website"
  | "referral"
  | "linkedin"
  | "cold_outreach"
  | "event"
  | "partner"
  | "other";

export interface Lead {
  id: string;
  company: string;
  companyName?: string;
  contactName: string;
  email: string;
  phone?: string;
  source: LeadSource;
  ownerId: string;
  ownerName: string;
  ownerAvatar?: string;
  assigneeName?: string;
  status: LeadStatus;
  estimatedValue: number;
  value?: number;
  currency: "AED" | "INR" | "USD";
  expectedCloseDate?: string;
  industry?: string;
  description?: string;
  aiScore: number;
  aiScoreBreakdown?: {
    companySize: number;
    engagement: number;
    source: number;
    timing: number;
  };
  daysInStage: number;
  nextActionDue?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  entityType: "lead" | "customer" | "ticket" | "invoice" | "task" | "approval";
  entityId: string;
  type: "note" | "call" | "email" | "meeting" | "stage_change" | "created" | "updated" | "approved" | "rejected";
  description: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: string;
  metadata?: Record<string, string | number | boolean>;
}

export type CustomerStatus = "active" | "inactive" | "prospect" | "churned";

export interface Customer {
  id: string;
  name: string;
  type: "business" | "individual";
  status: CustomerStatus;
  industry?: string;
  country: string;
  city?: string;
  website?: string;
  logo?: string;
  accountManagerId: string;
  accountManagerName: string;
  creditTermsDays: number;
  currency: "AED" | "INR" | "USD" | "GBP" | "EUR";
  phone?: string;
  email?: string;
  address?: string;
  aiHealthScore: number;
  healthScore?: number;
  totalInvoiced: number;
  totalRevenue?: number;
  outstandingBalance: number;
  openInvoicesCount?: number;
  avgPaymentDays: number;
  lastActivityDate?: string;
  createdAt: string;
}

export interface Contact {
  id: string;
  customerId: string;
  name: string;
  role: string;
  email: string;
  phone?: string;
  isPrimary: boolean;
}

export type OrgPlan = "starter" | "growth" | "enterprise";
export type OrgStatus = "active" | "trial" | "suspended" | "churned";

export const ALL_MODULES = [
  { key: "dashboard",   label: "Dashboard" },
  { key: "crm",        label: "CRM" },
  { key: "customers",  label: "Customers" },
  { key: "support",    label: "Support" },
  { key: "finance",    label: "Finance" },
  { key: "hr",         label: "HR" },
  { key: "operations", label: "Operations" },
  { key: "procurement",label: "Procurement" },
  { key: "documents",  label: "Documents" },
  { key: "reports",    label: "Reports" },
  { key: "ai",         label: "AI Assistant" },
  { key: "analytics",  label: "Analytics" },
] as const;

export type ModuleKey = typeof ALL_MODULES[number]["key"];

export interface SubscriptionPlan {
  id: string;
  slug: OrgPlan;
  name: string;
  tagline: string;
  monthlyPriceAed: number;
  annualPriceAed: number;
  trialDays: number;
  maxUsers: number;        // -1 = unlimited
  maxStorageGb: number;   // -1 = unlimited
  maxOrgs: number;
  includedModules: ModuleKey[];
  isActive: boolean;
  color: "slate" | "blue" | "indigo";
}

export const mockSubscriptionPlans: SubscriptionPlan[] = [
  {
    id: "plan-starter",
    slug: "starter",
    name: "Starter",
    tagline: "Perfect for small teams getting started",
    monthlyPriceAed: 0,
    annualPriceAed: 0,
    trialDays: 14,
    maxUsers: 10,
    maxStorageGb: 5,
    maxOrgs: 1,
    includedModules: ["dashboard", "crm", "customers", "support", "documents"],
    isActive: true,
    color: "slate",
  },
  {
    id: "plan-growth",
    slug: "growth",
    name: "Growth",
    tagline: "For growing businesses that need more power",
    monthlyPriceAed: 1499,
    annualPriceAed: 14990,
    trialDays: 0,
    maxUsers: 50,
    maxStorageGb: 50,
    maxOrgs: 1,
    includedModules: ["dashboard", "crm", "customers", "support", "finance", "hr", "operations", "documents", "reports"],
    isActive: true,
    color: "blue",
  },
  {
    id: "plan-enterprise",
    slug: "enterprise",
    name: "Enterprise",
    tagline: "Full-featured platform for large organisations",
    monthlyPriceAed: 4999,
    annualPriceAed: 49990,
    trialDays: 0,
    maxUsers: -1,
    maxStorageGb: -1,
    maxOrgs: 1,
    includedModules: ["dashboard", "crm", "customers", "support", "finance", "hr", "operations", "procurement", "documents", "reports", "ai", "analytics"],
    isActive: true,
    color: "indigo",
  },
];

export interface PlatformOrg {
  id: string;
  name: string;
  slug: string;
  plan: OrgPlan;
  status: OrgStatus;
  industry: string;
  country: string;
  userCount: number;
  adminEmail: string;
  mrr: number;
  storageUsedMb: number;
  createdAt: string;
  trialEndsAt?: string;
  lastActiveAt: string;
  modules: string[];
}

export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  role: string;
  orgId: string;
  orgName: string;
  status: "active" | "inactive" | "invited";
  lastLoginAt: string;
  createdAt: string;
}

export interface PlatformAuditLog {
  id: string;
  orgId: string;
  orgName: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  details: string;
  ipAddress: string;
  createdAt: string;
}

export interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  description: string;
  enabledGlobally: boolean;
  enabledForOrgs: string[];
  rolloutPercent: number;
  category: "ai" | "finance" | "crm" | "ops" | "platform";
}

export interface PlatformAnnouncement {
  id: string;
  title: string;
  body: string;
  type: "info" | "warning" | "maintenance" | "feature";
  targetPlan: OrgPlan | "all";
  status: "draft" | "scheduled" | "sent";
  sentAt?: string;
  scheduledFor?: string;
  createdAt: string;
  createdBy: string;
}

export const mockPlatformOrgs: PlatformOrg[] = [
  {
    id: "org-001", name: "Emaar Properties PJSC", slug: "emaar", plan: "enterprise", status: "active",
    industry: "Real Estate", country: "Dubai, UAE", userCount: 42, adminEmail: "ops@emaar.ae",
    mrr: 249000, storageUsedMb: 8420, createdAt: "2024-01-15T09:00:00Z", lastActiveAt: "2026-06-25T18:00:00Z",
    modules: ["dashboard", "crm", "customers", "finance", "procurement", "support", "operations", "hr", "documents", "approvals", "reports", "ai"],
  },
  {
    id: "org-002", name: "Majid Al Futtaim Holding", slug: "maf", plan: "growth", status: "active",
    industry: "Retail / Entertainment", country: "Dubai, UAE", userCount: 18, adminEmail: "admin@maf.ae",
    mrr: 89000, storageUsedMb: 3210, createdAt: "2024-03-10T10:00:00Z", lastActiveAt: "2026-06-25T16:30:00Z",
    modules: ["dashboard", "crm", "customers", "finance", "support", "operations", "documents", "approvals", "reports"],
  },
  {
    id: "org-003", name: "Emirates Group", slug: "emirates-group", plan: "enterprise", status: "active",
    industry: "Aviation", country: "Dubai, UAE", userCount: 56, adminEmail: "it@emiratesgroup.com",
    mrr: 349000, storageUsedMb: 12800, createdAt: "2023-11-20T08:00:00Z", lastActiveAt: "2026-06-25T09:00:00Z",
    modules: ["dashboard", "crm", "customers", "finance", "procurement", "support", "operations", "hr", "documents", "approvals", "reports", "ai"],
  },
  {
    id: "org-004", name: "DP World Limited", slug: "dp-world", plan: "growth", status: "active",
    industry: "Ports / Logistics", country: "Dubai, UAE", userCount: 24, adminEmail: "admin@dpworld.com",
    mrr: 79000, storageUsedMb: 2870, createdAt: "2024-05-01T11:00:00Z", lastActiveAt: "2026-06-24T14:00:00Z",
    modules: ["dashboard", "crm", "customers", "finance", "support", "documents", "approvals", "reports"],
  },
  {
    id: "org-005", name: "Careem Networks FZ LLC", slug: "careem", plan: "starter", status: "trial",
    industry: "Technology / Mobility", country: "Dubai, UAE", userCount: 8, adminEmail: "tech@careem.com",
    mrr: 0, storageUsedMb: 450, createdAt: "2026-06-10T09:00:00Z", trialEndsAt: "2026-06-27T23:59:59Z",
    lastActiveAt: "2026-06-25T11:00:00Z",
    modules: ["dashboard", "crm", "customers", "support", "documents"],
  },
  {
    id: "org-006", name: "First Abu Dhabi Bank (FAB)", slug: "fab", plan: "growth", status: "active",
    industry: "Banking / Financial Services", country: "Abu Dhabi, UAE", userCount: 15, adminEmail: "ops@bankfab.com",
    mrr: 65000, storageUsedMb: 1980, createdAt: "2024-08-15T10:00:00Z", lastActiveAt: "2026-06-23T15:00:00Z",
    modules: ["dashboard", "crm", "customers", "finance", "procurement", "support", "documents", "approvals"],
  },
  {
    id: "org-007", name: "Noon.com FZ LLC", slug: "noon", plan: "enterprise", status: "suspended",
    industry: "E-commerce", country: "Dubai, UAE", userCount: 31, adminEmail: "admin@noon.com",
    mrr: 199000, storageUsedMb: 5600, createdAt: "2023-09-05T08:00:00Z", lastActiveAt: "2026-05-15T10:00:00Z",
    modules: ["dashboard", "crm", "customers", "finance", "support", "documents", "approvals", "reports", "ai"],
  },
  {
    id: "org-008", name: "Aldar Properties PJSC", slug: "aldar", plan: "growth", status: "active",
    industry: "Real Estate", country: "Abu Dhabi, UAE", userCount: 22, adminEmail: "it@aldar.ae",
    mrr: 89000, storageUsedMb: 3450, createdAt: "2024-02-28T09:00:00Z", lastActiveAt: "2026-06-25T08:00:00Z",
    modules: ["dashboard", "crm", "customers", "finance", "support", "operations", "documents", "approvals", "reports"],
  },
  {
    id: "org-009", name: "Dubizzle Group (Bayut)", slug: "dubizzle", plan: "starter", status: "trial",
    industry: "PropTech", country: "Dubai, UAE", userCount: 6, adminEmail: "admin@dubizzle.com",
    mrr: 0, storageUsedMb: 280, createdAt: "2026-06-18T10:00:00Z", trialEndsAt: "2026-06-30T23:59:59Z",
    lastActiveAt: "2026-06-25T13:00:00Z",
    modules: ["dashboard", "crm", "customers", "support"],
  },
  {
    id: "org-010", name: "Kitopi DMCC", slug: "kitopi", plan: "starter", status: "churned",
    industry: "Cloud Kitchens / FoodTech", country: "Dubai, UAE", userCount: 5, adminEmail: "tech@kitopi.com",
    mrr: 0, storageUsedMb: 120, createdAt: "2024-06-01T09:00:00Z", lastActiveAt: "2025-12-10T10:00:00Z",
    modules: ["dashboard", "crm", "support"],
  },
];

export const mockPlatformUsers: PlatformUser[] = [
  { id: "pu-001", name: "Mohammed Al Rashidi", email: "mohammed@emaar.ae", role: "Super Admin", orgId: "org-001", orgName: "Emaar Properties PJSC", status: "active", lastLoginAt: "2026-06-25T08:30:00Z", createdAt: "2024-01-15T09:00:00Z" },
  { id: "pu-002", name: "Sara Al Marzouqi", email: "sara@emaar.ae", role: "Finance", orgId: "org-001", orgName: "Emaar Properties PJSC", status: "active", lastLoginAt: "2026-06-24T14:00:00Z", createdAt: "2024-01-20T10:00:00Z" },
  { id: "pu-003", name: "Khalid Al Falasi", email: "khalid@emaar.ae", role: "Operations", orgId: "org-001", orgName: "Emaar Properties PJSC", status: "active", lastLoginAt: "2026-06-23T11:00:00Z", createdAt: "2024-02-01T09:00:00Z" },
  { id: "pu-004", name: "Faisal Belhoul", email: "faisal@maf.ae", role: "Super Admin", orgId: "org-002", orgName: "Majid Al Futtaim Holding", status: "active", lastLoginAt: "2026-06-24T16:30:00Z", createdAt: "2024-03-10T10:00:00Z" },
  { id: "pu-005", name: "Priya Nambiar", email: "priya@maf.ae", role: "Sales Manager", orgId: "org-002", orgName: "Majid Al Futtaim Holding", status: "active", lastLoginAt: "2026-06-22T10:00:00Z", createdAt: "2024-03-15T09:00:00Z" },
  { id: "pu-006", name: "Ahmed Al Mansouri", email: "ahmed@emiratesgroup.com", role: "Super Admin", orgId: "org-003", orgName: "Emirates Group", status: "active", lastLoginAt: "2026-06-25T09:00:00Z", createdAt: "2023-11-20T08:00:00Z" },
  { id: "pu-007", name: "Ravi Kumar", email: "ravi@emiratesgroup.com", role: "Finance", orgId: "org-003", orgName: "Emirates Group", status: "active", lastLoginAt: "2026-06-24T12:00:00Z", createdAt: "2023-12-01T09:00:00Z" },
  { id: "pu-008", name: "Anita Sharma", email: "anita@emiratesgroup.com", role: "HR", orgId: "org-003", orgName: "Emirates Group", status: "active", lastLoginAt: "2026-06-22T09:00:00Z", createdAt: "2024-01-10T10:00:00Z" },
  { id: "pu-009", name: "Majid Al Sayed", email: "majid@dpworld.com", role: "Super Admin", orgId: "org-004", orgName: "DP World Limited", status: "active", lastLoginAt: "2026-06-23T14:00:00Z", createdAt: "2024-05-01T11:00:00Z" },
  { id: "pu-010", name: "Carlos Reyes", email: "carlos@dpworld.com", role: "Operations", orgId: "org-004", orgName: "DP World Limited", status: "inactive", lastLoginAt: "2026-05-10T10:00:00Z", createdAt: "2024-05-10T09:00:00Z" },
  { id: "pu-011", name: "Omar Al Nuaimi", email: "omar@careem.com", role: "Super Admin", orgId: "org-005", orgName: "Careem Networks FZ LLC", status: "active", lastLoginAt: "2026-06-25T11:00:00Z", createdAt: "2026-06-10T09:00:00Z" },
  { id: "pu-012", name: "Fatima Hassan", email: "fatima@careem.com", role: "Support Agent", orgId: "org-005", orgName: "Careem Networks FZ LLC", status: "invited", lastLoginAt: "2026-06-10T09:00:00Z", createdAt: "2026-06-12T10:00:00Z" },
  { id: "pu-013", name: "Walid Al Hamdan", email: "walid@bankfab.com", role: "Super Admin", orgId: "org-006", orgName: "First Abu Dhabi Bank (FAB)", status: "active", lastLoginAt: "2026-06-23T15:00:00Z", createdAt: "2024-08-15T10:00:00Z" },
  { id: "pu-014", name: "Deepa Menon", email: "deepa@bankfab.com", role: "Finance", orgId: "org-006", orgName: "First Abu Dhabi Bank (FAB)", status: "active", lastLoginAt: "2026-06-22T14:00:00Z", createdAt: "2024-08-20T09:00:00Z" },
  { id: "pu-015", name: "Samer Al Debei", email: "samer@noon.com", role: "Super Admin", orgId: "org-007", orgName: "Noon.com FZ LLC", status: "inactive", lastLoginAt: "2026-05-15T10:00:00Z", createdAt: "2023-09-05T08:00:00Z" },
  { id: "pu-016", name: "Hamdan Al Mazrouei", email: "hamdan@aldar.ae", role: "Super Admin", orgId: "org-008", orgName: "Aldar Properties PJSC", status: "active", lastLoginAt: "2026-06-25T08:00:00Z", createdAt: "2024-02-28T09:00:00Z" },
  { id: "pu-017", name: "Lena Schmidt", email: "lena@aldar.ae", role: "Finance", orgId: "org-008", orgName: "Aldar Properties PJSC", status: "active", lastLoginAt: "2026-06-24T10:00:00Z", createdAt: "2024-03-05T09:00:00Z" },
  { id: "pu-018", name: "James Park", email: "james@aldar.ae", role: "Support Agent", orgId: "org-008", orgName: "Aldar Properties PJSC", status: "active", lastLoginAt: "2026-06-23T16:00:00Z", createdAt: "2024-03-10T09:00:00Z" },
  { id: "pu-019", name: "Tariq Farouk", email: "tariq@dubizzle.com", role: "Super Admin", orgId: "org-009", orgName: "Dubizzle Group (Bayut)", status: "active", lastLoginAt: "2026-06-25T13:00:00Z", createdAt: "2026-06-18T10:00:00Z" },
  { id: "pu-020", name: "Aisha Al Blooshi", email: "aisha@dubizzle.com", role: "Sales Manager", orgId: "org-009", orgName: "Dubizzle Group (Bayut)", status: "invited", lastLoginAt: "2026-06-18T10:00:00Z", createdAt: "2026-06-18T10:30:00Z" },
  { id: "pu-021", name: "Luke Morrison", email: "luke@kitopi.com", role: "Super Admin", orgId: "org-010", orgName: "Kitopi DMCC", status: "inactive", lastLoginAt: "2025-12-10T10:00:00Z", createdAt: "2024-06-01T09:00:00Z" },
  { id: "pu-022", name: "Nour Al Khatib", email: "nour@emaar.ae", role: "Sales Manager", orgId: "org-001", orgName: "Emaar Properties PJSC", status: "active", lastLoginAt: "2026-06-24T09:00:00Z", createdAt: "2024-03-01T09:00:00Z" },
  { id: "pu-023", name: "Yasmin Al Suwaidi", email: "yasmin@maf.ae", role: "HR", orgId: "org-002", orgName: "Majid Al Futtaim Holding", status: "active", lastLoginAt: "2026-06-23T11:00:00Z", createdAt: "2024-04-01T09:00:00Z" },
  { id: "pu-024", name: "Raj Patel", email: "raj@bankfab.com", role: "Operations", orgId: "org-006", orgName: "First Abu Dhabi Bank (FAB)", status: "active", lastLoginAt: "2026-06-21T14:00:00Z", createdAt: "2024-09-01T09:00:00Z" },
  { id: "pu-025", name: "Layla Al Awadhi", email: "layla@emiratesgroup.com", role: "Sales Manager", orgId: "org-003", orgName: "Emirates Group", status: "active", lastLoginAt: "2026-06-22T10:00:00Z", createdAt: "2024-02-01T09:00:00Z" },
];

export const mockPlatformAuditLogs: PlatformAuditLog[] = [
  { id: "al-001", orgId: "org-001", orgName: "Emaar Properties PJSC", userId: "pu-001", userName: "Mohammed Al Rashidi", action: "LOGIN", resource: "auth", details: "Logged in successfully", ipAddress: "91.74.58.14", createdAt: "2026-06-25T08:30:00Z" },
  { id: "al-002", orgId: "org-003", orgName: "Emirates Group", userId: "pu-006", userName: "Ahmed Al Mansouri", action: "INVOICE_APPROVED", resource: "finance", details: "Approved invoice INV-2026-0089 for AED 42,000", ipAddress: "5.62.142.88", createdAt: "2026-06-25T08:15:00Z" },
  { id: "al-003", orgId: "org-008", orgName: "Aldar Properties PJSC", userId: "pu-016", userName: "Hamdan Al Mazrouei", action: "USER_CREATED", resource: "users", details: "Added new user lena@aldar.ae with Finance role", ipAddress: "82.148.10.20", createdAt: "2026-06-25T08:00:00Z" },
  { id: "al-004", orgId: "org-002", orgName: "Majid Al Futtaim Holding", userId: "pu-004", userName: "Faisal Belhoul", action: "LEAD_CONVERTED", resource: "crm", details: "Lead Landmark Group converted to customer", ipAddress: "91.74.80.45", createdAt: "2026-06-24T17:30:00Z" },
  { id: "al-005", orgId: "org-001", orgName: "Emaar Properties PJSC", userId: "pu-002", userName: "Sara Al Marzouqi", action: "REPORT_EXPORTED", resource: "reports", details: "Exported AR Aging report (June 2026) as CSV", ipAddress: "91.74.58.14", createdAt: "2026-06-24T16:00:00Z" },
  { id: "al-006", orgId: "org-006", orgName: "First Abu Dhabi Bank (FAB)", userId: "pu-013", userName: "Walid Al Hamdan", action: "SETTINGS_UPDATED", resource: "settings", details: "Updated company TRN number", ipAddress: "195.229.0.88", createdAt: "2026-06-24T15:45:00Z" },
  { id: "al-007", orgId: "org-004", orgName: "DP World Limited", userId: "pu-009", userName: "Majid Al Sayed", action: "APPROVAL_REJECTED", resource: "approvals", details: "Rejected PR-2026-0045 (AED 85,000 office supplies)", ipAddress: "5.62.60.120", createdAt: "2026-06-24T15:00:00Z" },
  { id: "al-008", orgId: "org-003", orgName: "Emirates Group", userId: "pu-007", userName: "Ravi Kumar", action: "PAYMENT_RECORDED", resource: "finance", details: "Recorded payment AED 128,000 from ENOC via UAEFTS", ipAddress: "5.62.142.88", createdAt: "2026-06-24T14:30:00Z" },
  { id: "al-009", orgId: "org-001", orgName: "Emaar Properties PJSC", userId: "pu-022", userName: "Nour Al Khatib", action: "TICKET_ESCALATED", resource: "support", details: "Escalated TKT-0088 to L2 — SLA breach imminent", ipAddress: "91.74.58.14", createdAt: "2026-06-24T13:00:00Z" },
  { id: "al-010", orgId: "org-005", orgName: "Careem Networks FZ LLC", userId: "pu-011", userName: "Omar Al Nuaimi", action: "USER_INVITED", resource: "users", details: "Invited fatima@careem.com as Support Agent", ipAddress: "82.148.72.10", createdAt: "2026-06-24T12:00:00Z" },
  { id: "al-011", orgId: "org-008", orgName: "Aldar Properties PJSC", userId: "pu-017", userName: "Lena Schmidt", action: "INVOICE_CREATED", resource: "finance", details: "Created draft invoice INV-2026-0101 for AED 85,000", ipAddress: "82.148.10.20", createdAt: "2026-06-24T11:30:00Z" },
  { id: "al-012", orgId: "org-002", orgName: "Majid Al Futtaim Holding", userId: "pu-023", userName: "Yasmin Al Suwaidi", action: "EMPLOYEE_ADDED", resource: "hr", details: "Added new employee Reem Al Naqbi — Marketing Analyst", ipAddress: "91.74.80.45", createdAt: "2026-06-24T10:00:00Z" },
  { id: "al-013", orgId: "org-003", orgName: "Emirates Group", userId: "pu-025", userName: "Layla Al Awadhi", action: "LEAD_CREATED", resource: "crm", details: "New lead added: Etihad Cargo (AED 450,000 est.)", ipAddress: "5.62.142.88", createdAt: "2026-06-24T09:30:00Z" },
  { id: "al-014", orgId: "org-006", orgName: "First Abu Dhabi Bank (FAB)", userId: "pu-014", userName: "Deepa Menon", action: "EXPENSE_SUBMITTED", resource: "finance", details: "Expense claim AED 2,800 submitted — GITEX conference travel", ipAddress: "195.229.0.88", createdAt: "2026-06-24T09:00:00Z" },
  { id: "al-015", orgId: "org-001", orgName: "Emaar Properties PJSC", userId: "pu-003", userName: "Khalid Al Falasi", action: "TASK_COMPLETED", resource: "operations", details: "Marked task 'Q2 vendor audit' as completed", ipAddress: "91.74.58.14", createdAt: "2026-06-23T18:00:00Z" },
  { id: "al-016", orgId: "org-004", orgName: "DP World Limited", userId: "pu-009", userName: "Majid Al Sayed", action: "DOCUMENT_UPLOADED", resource: "documents", details: "Uploaded NDA — Abu Dhabi Ports (confidential)", ipAddress: "5.62.60.120", createdAt: "2026-06-23T16:30:00Z" },
  { id: "al-017", orgId: "org-009", orgName: "Dubizzle Group (Bayut)", userId: "pu-019", userName: "Tariq Farouk", action: "LOGIN", resource: "auth", details: "Logged in successfully", ipAddress: "82.148.140.10", createdAt: "2026-06-23T13:00:00Z" },
  { id: "al-018", orgId: "org-008", orgName: "Aldar Properties PJSC", userId: "pu-018", userName: "James Park", action: "TICKET_RESOLVED", resource: "support", details: "Resolved TKT-0072 — API integration issue", ipAddress: "82.148.10.20", createdAt: "2026-06-23T11:00:00Z" },
  { id: "al-019", orgId: "org-003", orgName: "Emirates Group", userId: "pu-008", userName: "Anita Sharma", action: "LEAVE_APPROVED", resource: "hr", details: "Approved annual leave for Layla Al Awadhi (5 days)", ipAddress: "5.62.142.88", createdAt: "2026-06-23T10:00:00Z" },
  { id: "al-020", orgId: "org-006", orgName: "First Abu Dhabi Bank (FAB)", userId: "pu-013", userName: "Walid Al Hamdan", action: "VENDOR_ADDED", resource: "procurement", details: "Added vendor Gulf Medical Supplies as approved supplier", ipAddress: "195.229.0.88", createdAt: "2026-06-22T15:00:00Z" },
];

export const mockFeatureFlags: FeatureFlag[] = [
  { id: "ff-001", key: "ai_suggested_replies", name: "AI Suggested Replies", description: "Show AI-generated reply suggestions in support ticket detail", enabledGlobally: true, enabledForOrgs: ["org-001", "org-002", "org-003", "org-006", "org-008"], rolloutPercent: 100, category: "ai" },
  { id: "ff-002", key: "ai_lead_scoring", name: "AI Lead Scoring", description: "Enable AI-powered lead scoring with breakdown in CRM", enabledGlobally: true, enabledForOrgs: ["org-001", "org-002", "org-003", "org-004", "org-008"], rolloutPercent: 100, category: "ai" },
  { id: "ff-003", key: "ai_cfo_agent", name: "CFO AI Agent", description: "Dedicated CFO AI agent for financial insights and forecasting", enabledGlobally: false, enabledForOrgs: ["org-001", "org-003"], rolloutPercent: 20, category: "ai" },
  { id: "ff-004", key: "expense_management", name: "Expense Management", description: "Employee expense claims module under Finance", enabledGlobally: true, enabledForOrgs: [], rolloutPercent: 100, category: "finance" },
  { id: "ff-005", key: "multi_currency", name: "Multi-Currency Invoicing", description: "Allow invoices in USD, GBP, EUR in addition to AED", enabledGlobally: false, enabledForOrgs: ["org-001", "org-003", "org-008"], rolloutPercent: 30, category: "finance" },
  { id: "ff-006", key: "crm_whatsapp_integration", name: "WhatsApp CRM Integration", description: "Send WhatsApp messages directly from lead and customer detail pages", enabledGlobally: false, enabledForOrgs: ["org-001", "org-002"], rolloutPercent: 15, category: "crm" },
  { id: "ff-007", key: "ops_gantt_chart", name: "Gantt Chart View in Operations", description: "Gantt timeline view for project tasks in Operations module", enabledGlobally: false, enabledForOrgs: ["org-003", "org-001"], rolloutPercent: 10, category: "ops" },
  { id: "ff-008", key: "platform_sso", name: "SSO / SAML Login", description: "Allow enterprise orgs to authenticate via SAML 2.0 SSO", enabledGlobally: false, enabledForOrgs: ["org-001", "org-003", "org-007"], rolloutPercent: 25, category: "platform" },
];

export const mockPlatformAnnouncements: PlatformAnnouncement[] = [
  { id: "an-001", title: "Scheduled Maintenance — 28 June 2026, 02:00–04:00 GST (UTC+4)", body: "We will be performing database upgrades and infrastructure maintenance. Expect downtime of 1–2 hours. Please save all work before 01:45 GST.", type: "maintenance", targetPlan: "all", status: "scheduled", scheduledFor: "2026-06-27T22:00:00Z", createdAt: "2026-06-22T10:00:00Z", createdBy: "Platform Admin" },
  { id: "an-002", title: "New Feature: Expense Management Module Now Live", body: "All organisations on Growth and Enterprise plans now have access to the new Expense Management module under Finance. Submit, approve, and track employee expense claims with receipt attachments.", type: "feature", targetPlan: "growth", status: "sent", sentAt: "2026-06-20T09:00:00Z", createdAt: "2026-06-19T14:00:00Z", createdBy: "Platform Admin" },
  { id: "an-003", title: "Trial Expiry Reminder — Upgrade Before June 30", body: "Your free trial ends on June 30, 2026. Upgrade to a paid plan to retain all your data and continue using the platform without interruption. Use code EARLYBIRD for 20% off your first 3 months.", type: "warning", targetPlan: "starter", status: "sent", sentAt: "2026-06-18T10:00:00Z", createdAt: "2026-06-17T16:00:00Z", createdBy: "Platform Admin" },
  { id: "an-004", title: "Introducing AI Lead Scoring — Now Available", body: "AI-powered lead scoring is now enabled for all plans. Each lead in your CRM now gets an AI score (0–100) based on company size, engagement, source quality, and deal timing. See the breakdown in lead detail.", type: "feature", targetPlan: "all", status: "sent", sentAt: "2026-06-10T09:00:00Z", createdAt: "2026-06-09T14:00:00Z", createdBy: "Platform Admin" },
  { id: "an-005", title: "Q2 Platform Performance Report", body: "Platform uptime for Q2 2026: 99.94%. Average API response time: 142ms. We resolved 3 incidents during the quarter. Full report available in the Admin Console.", type: "info", targetPlan: "all", status: "sent", sentAt: "2026-06-01T09:00:00Z", createdAt: "2026-05-31T10:00:00Z", createdBy: "Platform Admin" },
  { id: "an-006", title: "Enterprise SSO Launch Draft", body: "Draft announcement for SSO/SAML launch for Enterprise customers in the UAE.", type: "feature", targetPlan: "enterprise", status: "draft", createdAt: "2026-06-25T08:00:00Z", createdBy: "Platform Admin" },
];

export const platformMrrChart: { month: string; mrr: number }[] = [
  { month: "Jul '25", mrr: 420000 },
  { month: "Aug '25", mrr: 510000 },
  { month: "Sep '25", mrr: 580000 },
  { month: "Oct '25", mrr: 640000 },
  { month: "Nov '25", mrr: 700000 },
  { month: "Dec '25", mrr: 780000 },
  { month: "Jan '26", mrr: 850000 },
  { month: "Feb '26", mrr: 910000 },
  { month: "Mar '26", mrr: 960000 },
  { month: "Apr '26", mrr: 1020000 },
  { month: "May '26", mrr: 1080000 },
  { month: "Jun '26", mrr: 1120000 },
];

export const orgGrowthChart: { month: string; newOrgs: number }[] = [
  { month: "Jul '25", newOrgs: 2 },
  { month: "Aug '25", newOrgs: 3 },
  { month: "Sep '25", newOrgs: 1 },
  { month: "Oct '25", newOrgs: 4 },
  { month: "Nov '25", newOrgs: 2 },
  { month: "Dec '25", newOrgs: 3 },
  { month: "Jan '26", newOrgs: 5 },
  { month: "Feb '26", newOrgs: 2 },
  { month: "Mar '26", newOrgs: 4 },
  { month: "Apr '26", newOrgs: 3 },
  { month: "May '26", newOrgs: 2 },
  { month: "Jun '26", newOrgs: 3 },
];

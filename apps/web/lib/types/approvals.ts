export type ApprovalStatus = "pending" | "approved" | "rejected" | "expired" | "cancelled";

export type ApprovalEntityType =
  | "invoice"
  | "purchase_request"
  | "expense"
  | "leave"
  | "contract"
  | "journal_entry"
  | "refund";

export interface ApprovalLevel {
  level: number;
  approverId: string;
  approverName: string;
  approverAvatar?: string;
  status: "pending" | "approved" | "rejected" | "skipped";
  requiredBy?: string;
  decidedAt?: string;
  comment?: string;
}

export interface ApprovalRequest {
  id: string;
  entityType: ApprovalEntityType;
  entityId: string;
  entityTitle: string;
  title: string;
  requestedById: string;
  requestedByName: string;
  requestedByAvatar?: string;
  requestorName: string;
  requestorAvatar?: string;
  status: ApprovalStatus;
  currentLevel: number;
  totalLevels: number;
  levels: ApprovalLevel[];
  amount?: number;
  currency?: "AED" | "INR" | "USD" | "GBP" | "EUR";
  priority: "critical" | "high" | "medium" | "low";
  notes?: string;
  description?: string;
  dueDate?: string;
  currentApproverName?: string;
  daysWaiting: number;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

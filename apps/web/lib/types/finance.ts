export type InvoiceStatus =
  | "draft"
  | "approved"
  | "sent"
  | "partially_paid"
  | "paid"
  | "overdue"
  | "cancelled"
  | "void";

export type PaymentMethod = "bank_transfer" | "card" | "cheque" | "cash" | "upi";

export interface InvoiceLine {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  taxAmount: number;
  lineTotal: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  customerEmail?: string;
  customerAddress?: string;
  invoiceDate: string;
  issueDate?: string;
  dueDate: string;
  lines: InvoiceLine[];
  subtotal: number;
  taxTotal: number;
  total: number;
  totalAmount: number;
  balanceDue: number;
  currency: "AED" | "INR" | "USD" | "GBP" | "EUR";
  status: InvoiceStatus;
  notes?: string;
  terms?: string;
  bankDetails?: string;
  createdById: string;
  createdByName: string;
  approvedById?: string;
  approvedAt?: string;
  sentAt?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  customerId: string;
  customerName: string;
  invoiceId: string;
  invoiceNumber: string;
  amount: number;
  currency: "AED" | "INR" | "USD" | "GBP" | "EUR";
  paymentDate: string;
  method: PaymentMethod;
  reference?: string;
  referenceNumber?: string;
  notes?: string;
  recordedById: string;
  recordedByName: string;
  createdAt: string;
}

export interface ARAgingBucket {
  label: string;
  minDays: number;
  maxDays: number;
  amount: number;
  invoiceCount: number;
}

export interface KPIDataPoint {
  month: string;
  value: number;
  target?: number;
}

export interface FinanceSummary {
  totalAR: number;
  totalAP: number;
  cashPosition: number;
  revenueMTD: number;
  overdueAmount: number;
  arAgingBuckets: ARAgingBucket[];
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  email?: string;
  phone?: string;
  contactName?: string;
  country: string;
  taxNumber?: string;
  paymentTermsDays: number;
  paymentTerms?: string;
  currency: "AED" | "INR" | "USD" | "GBP" | "EUR";
  status: "active" | "inactive" | "blacklisted";
  rating: number;
  totalPurchased: number;
  totalSpend?: number;
  createdAt: string;
}

export type PRStatus = "draft" | "pending" | "submitted" | "approved" | "rejected" | "converted";

export interface PurchaseRequestItem {
  id: string;
  description: string;
  quantity: number;
  estimatedPrice: number;
  suggestedVendor?: string;
}

export interface PurchaseRequest {
  id: string;
  prNumber: string;
  requesterId: string;
  requesterName: string;
  requestorName: string;
  title: string;
  description?: string;
  department: string;
  items: PurchaseRequestItem[];
  totalEstimated: number;
  totalAmount: number;
  currency: "AED" | "INR" | "USD";
  justification: string;
  requiredByDate: string;
  requiredBy?: string;
  status: PRStatus;
  createdAt: string;
  updatedAt: string;
}

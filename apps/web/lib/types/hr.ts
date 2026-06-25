export type EmploymentType = "full_time" | "part_time" | "contract" | "intern";
export type EmployeeStatus = "active" | "inactive" | "on_leave" | "terminated";

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  department: string;
  designation: string;
  jobTitle: string;
  employmentType: EmploymentType;
  status: EmployeeStatus;
  managerId?: string;
  managerName?: string;
  joinDate: string;
  endDate?: string;
  salary?: number;
  currency?: "AED" | "INR" | "USD";
  leaveBalance?: {
    casual: number;
    sick: number;
    earned: number;
  };
  createdAt: string;
  updatedAt?: string;
}

export type DocumentClassification = "public" | "internal" | "confidential" | "restricted";
export type DocumentType =
  | "contract"
  | "invoice"
  | "purchase_order"
  | "hr_document"
  | "policy"
  | "report"
  | "presentation"
  | "technical"
  | "legal"
  | "certificate"
  | "design"
  | "training"
  | "other";

export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  entityType: "customer" | "vendor" | "employee" | "invoice" | "lead" | "project" | "ticket" | "company";
  entityId: string;
  entityName: string;
  fileUrl?: string;
  fileSize: number;
  mimeType: string;
  uploadedById: string;
  uploadedByName: string;
  classification: DocumentClassification;
  tags?: string[];
  version?: number;
  createdAt: string;
  updatedAt?: string;
}

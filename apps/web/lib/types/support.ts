export type TicketPriority = "critical" | "high" | "medium" | "low";

export type TicketStatus =
  | "new"
  | "assigned"
  | "in_progress"
  | "pending_customer"
  | "escalated"
  | "resolved"
  | "closed";

export interface SLAConfig {
  priority: TicketPriority;
  firstResponseHours: number;
  resolutionHours: number;
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorType: "agent" | "customer";
  body: string;
  isInternal: boolean;
  createdAt: string;
}

export interface Ticket {
  id: string;
  ticketNumber: string;
  customerId: string;
  customerName: string;
  subject: string;
  body: string;
  priority: TicketPriority;
  status: TicketStatus;
  assigneeId?: string;
  assigneeName?: string;
  assigneeAvatar?: string;
  tags?: string[];
  slaConfig: SLAConfig;
  firstResponseAt?: string;
  resolvedAt?: string;
  closedAt?: string;
  slaBreached: boolean;
  slaDeadline: string;
  slaPercentUsed: number;
  messages: TicketMessage[];
  createdAt: string;
  updatedAt: string;
}

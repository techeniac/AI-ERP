import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusVariant =
  | "draft"
  | "approved"
  | "sent"
  | "paid"
  | "partially_paid"
  | "overdue"
  | "cancelled"
  | "void"
  | "new"
  | "contacted"
  | "qualified"
  | "proposal"
  | "negotiation"
  | "won"
  | "lost"
  | "in_progress"
  | "pending_customer"
  | "escalated"
  | "resolved"
  | "closed"
  | "assigned"
  | "todo"
  | "review"
  | "blocked"
  | "done"
  | "active"
  | "inactive"
  | "prospect"
  | "churned"
  | "pending"
  | "rejected"
  | "expired"
  | "planning"
  | "on_hold"
  | "completed"
  | "submitted"
  | "converted"
  | "critical"
  | "high"
  | "medium"
  | "low"
  | "full_time"
  | "part_time"
  | "contract"
  | "contractor"
  | "intern"
  | "on_leave"
  | "terminated"
  | "blacklisted";

const VARIANT_CONFIG: Record<
  StatusVariant,
  { label: string; className: string }
> = {
  // Invoice statuses
  draft:         { label: "Draft",         className: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300" },
  approved:      { label: "Approved",      className: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300" },
  sent:          { label: "Sent",          className: "bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300" },
  paid:          { label: "Paid",          className: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300" },
  partially_paid:{ label: "Partial",       className: "bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/30 dark:text-teal-300" },
  overdue:       { label: "Overdue",       className: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300" },
  cancelled:     { label: "Cancelled",     className: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400" },
  void:          { label: "Void",          className: "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-500" },
  // Lead statuses
  new:           { label: "New",           className: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300" },
  contacted:     { label: "Contacted",     className: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300" },
  qualified:     { label: "Qualified",     className: "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300" },
  proposal:      { label: "Proposal",      className: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300" },
  negotiation:   { label: "Negotiation",   className: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300" },
  won:           { label: "Won",           className: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300" },
  lost:          { label: "Lost",          className: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300" },
  // Ticket statuses
  in_progress:   { label: "In Progress",   className: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300" },
  pending_customer:{ label: "Pending",     className: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300" },
  escalated:     { label: "Escalated",     className: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300" },
  resolved:      { label: "Resolved",      className: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300" },
  closed:        { label: "Closed",        className: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400" },
  assigned:      { label: "Assigned",      className: "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300" },
  // Task statuses
  todo:          { label: "To Do",         className: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300" },
  review:        { label: "Review",        className: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300" },
  blocked:       { label: "Blocked",       className: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300" },
  done:          { label: "Done",          className: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300" },
  // Customer statuses
  active:        { label: "Active",        className: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300" },
  inactive:      { label: "Inactive",      className: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400" },
  prospect:      { label: "Prospect",      className: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300" },
  churned:       { label: "Churned",       className: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300" },
  // Approval statuses
  pending:       { label: "Pending",       className: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300" },
  rejected:      { label: "Rejected",      className: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300" },
  expired:       { label: "Expired",       className: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400" },
  // Project statuses
  planning:      { label: "Planning",      className: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300" },
  on_hold:       { label: "On Hold",       className: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300" },
  completed:     { label: "Completed",     className: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300" },
  // PR statuses
  submitted:     { label: "Submitted",     className: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300" },
  converted:     { label: "Converted",     className: "bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/30 dark:text-teal-300" },
  // Priority
  critical:      { label: "Critical",      className: "bg-red-600 text-white border-red-700" },
  high:          { label: "High",          className: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300" },
  medium:        { label: "Medium",        className: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300" },
  low:           { label: "Low",           className: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400" },
  // Employment type
  full_time:     { label: "Full-time",     className: "bg-blue-100 text-blue-800 border-blue-200" },
  part_time:     { label: "Part-time",     className: "bg-purple-100 text-purple-800 border-purple-200" },
  contract:      { label: "Contract",      className: "bg-amber-100 text-amber-800 border-amber-200" },
  contractor:    { label: "Contractor",    className: "bg-amber-100 text-amber-800 border-amber-200" },
  intern:        { label: "Intern",        className: "bg-gray-100 text-gray-700 border-gray-200" },
  // Employee statuses
  on_leave:      { label: "On Leave",      className: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300" },
  terminated:    { label: "Terminated",    className: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300" },
  // Vendor statuses
  blacklisted:   { label: "Blacklisted",   className: "bg-red-100 text-red-900 border-red-300 dark:bg-red-900/40 dark:text-red-300" },
};

interface StatusBadgeProps {
  status: StatusVariant | string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = VARIANT_CONFIG[status as StatusVariant] ?? { label: status, className: "bg-gray-100 text-gray-700" };
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-xs font-medium border px-2 py-0.5 capitalize",
        config.className,
        className
      )}
    >
      {config.label}
    </Badge>
  );
}

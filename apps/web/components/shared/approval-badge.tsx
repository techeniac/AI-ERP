import { CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ApprovalStatus } from "@/lib/types";

interface ApprovalBadgeProps {
  status: ApprovalStatus;
  className?: string;
  showIcon?: boolean;
}

const CONFIG: Record<ApprovalStatus, { label: string; icon: React.ElementType; className: string }> = {
  pending:   { label: "Pending Approval", icon: Clock,         className: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300" },
  approved:  { label: "Approved",         icon: CheckCircle2,  className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300" },
  rejected:  { label: "Rejected",         icon: XCircle,       className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" },
  expired:   { label: "Expired",          icon: AlertCircle,   className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400" },
  cancelled: { label: "Cancelled",        icon: XCircle,       className: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-500" },
};

export function ApprovalBadge({ status, className, showIcon = true }: ApprovalBadgeProps) {
  const config = CONFIG[status];
  const Icon = config.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        config.className,
        className
      )}
    >
      {showIcon && <Icon className="h-3.5 w-3.5" />}
      {config.label}
    </span>
  );
}

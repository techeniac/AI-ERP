"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, XCircle, Clock, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { ApprovalBadge } from "@/components/shared/approval-badge";
import { mockApprovals } from "@/lib/mock/approvals";
import { formatCurrencyCompact, formatDate, formatRelative } from "@/lib/utils/format";
import type { ApprovalRequest, ApprovalStatus } from "@/lib/types";
import { toast } from "sonner";

const STATUS_TABS: { value: ApprovalStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "expired", label: "Expired" },
];

const ENTITY_TYPE_LABELS: Record<string, string> = {
  invoice: "Invoice",
  purchase_request: "Purchase Request",
  expense: "Expense",
  leave: "Leave Request",
  contract: "Contract",
  budget: "Budget",
  employee: "Employee",
  refund: "Refund",
  travel: "Travel",
  conference: "Conference",
};

function ApprovalCard({ approval }: { approval: ApprovalRequest }) {
  const [localStatus, setLocalStatus] = useState(approval.status);

  function handleApprove() {
    setLocalStatus("approved");
    toast.success(`Approved: ${approval.title ?? approval.entityTitle}`);
  }

  function handleReject() {
    setLocalStatus("rejected");
    toast.error(`Rejected: ${approval.title ?? approval.entityTitle}`);
  }

  const isPending = localStatus === "pending";

  return (
    <Card className={isPending ? "border-amber-200 hover:shadow-md transition-shadow" : ""}>
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarImage src={approval.requestorAvatar ?? approval.requestedByAvatar} alt={approval.requestorName ?? approval.requestedByName} />
            <AvatarFallback className="bg-[var(--brand-navy)] text-white text-xs font-bold">
              {(approval.requestorName ?? approval.requestedByName).split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-sm">{approval.title ?? approval.entityTitle}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {approval.requestorName ?? approval.requestedByName} · {ENTITY_TYPE_LABELS[approval.entityType] ?? approval.entityType}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <StatusBadge status={approval.priority} />
                <ApprovalBadge status={localStatus} />
              </div>
            </div>

            {approval.description && (
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{approval.description}</p>
            )}

            <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
              {approval.amount != null && (
                <span className="font-semibold text-foreground tabular-nums">
                  {formatCurrencyCompact(approval.amount)}
                </span>
              )}
              <span>Submitted: {formatRelative(approval.createdAt)}</span>
              {approval.dueDate && (
                <span className={new Date(approval.dueDate) < new Date() && isPending ? "text-red-600 font-medium" : ""}>
                  Due: {formatDate(approval.dueDate)}
                </span>
              )}
              {approval.currentApproverName && (
                <span>Approver: {approval.currentApproverName}</span>
              )}
            </div>

            {/* Approval levels */}
            {approval.levels && approval.levels.length > 1 && (
              <div className="mt-3 flex items-center gap-2">
                {approval.levels.map((level, i) => (
                  <div key={level.level} className="flex items-center gap-1">
                    {i > 0 && <div className="w-4 h-px bg-muted-foreground/30" />}
                    <div className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                      level.status === "approved"
                        ? "bg-emerald-100 text-emerald-700"
                        : level.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      <span>L{level.level}</span>
                      <span>{level.approverName?.split(" ")[0]}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {isPending && (
          <div className="flex gap-2 mt-4 border-t pt-4">
            <Button
              size="sm"
              className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white h-8"
              onClick={handleApprove}
            >
              <CheckCircle2 className="h-4 w-4" />
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 text-red-600 border-red-200 hover:bg-red-50 h-8"
              onClick={handleReject}
            >
              <XCircle className="h-4 w-4" />
              Reject
            </Button>
            <Button size="sm" variant="ghost" className="h-8 text-xs ml-auto">
              View Details
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function ApprovalsPage() {
  const [search, setSearch] = useState("");
  const [statusTab, setStatusTab] = useState<string>("pending");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const { data: approvals } = useQuery({
    queryKey: ["approvals"],
    queryFn: () => mockApprovals,
  });

  const filtered = (approvals ?? []).filter((a) => {
    const matchSearch =
      !search ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.requestorName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusTab === "all" || a.status === statusTab;
    const matchType = typeFilter === "all" || a.entityType === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  const pendingCount = (approvals ?? []).filter((a) => a.status === "pending").length;
  const pendingAmount = (approvals ?? [])
    .filter((a) => a.status === "pending" && a.amount != null)
    .reduce((s, a) => s + (a.amount ?? 0), 0);

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Approvals"
        description="Manage approval workflows across all modules"
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Pending Action", value: pendingCount.toString(), highlight: pendingCount > 0 },
          { label: "Pending Amount", value: formatCurrencyCompact(pendingAmount) },
          { label: "Approved Today", value: (approvals ?? []).filter((a) => a.status === "approved" && a.updatedAt?.startsWith("2026-06-23")).length.toString() },
          { label: "Total Requests", value: (approvals ?? []).length.toString() },
        ].map((stat) => (
          <Card key={stat.label} className={stat.highlight ? "border-amber-200 bg-amber-50/50" : ""}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className={`text-xl font-bold mt-1 ${stat.highlight ? "text-amber-700" : ""}`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search approvals…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-44 h-9">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {Object.entries(ENTITY_TYPE_LABELS).map(([v, l]) => (
              <SelectItem key={v} value={v}>{l}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs value={statusTab} onValueChange={setStatusTab}>
        <TabsList className="h-9">
          {STATUS_TABS.map((s) => {
            const count = s.value === "all" ? (approvals ?? []).length : (approvals ?? []).filter((a) => a.status === s.value).length;
            return (
              <TabsTrigger key={s.value} value={s.value} className="gap-1.5 text-xs">
                {s.label}
                <Badge variant="outline" className="h-4 px-1 text-xs">{count}</Badge>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value={statusTab} className="mt-4 space-y-3">
          {filtered.length === 0 ? (
            <EmptyState
              title="No approvals found"
              description={statusTab === "pending" ? "You are all caught up!" : "Try adjusting your filters"}
              icon={<CheckCircle2 className="h-8 w-8" />}
            />
          ) : (
            filtered.map((approval) => (
              <ApprovalCard key={approval.id} approval={approval} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

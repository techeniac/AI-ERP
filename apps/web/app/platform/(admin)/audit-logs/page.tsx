"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockPlatformAuditLogs } from "@/lib/mock/platform";
import { formatDateTime } from "@/lib/utils/format";

const ACTION_COLORS: Record<string, string> = {
  LOGIN: "bg-blue-100 text-blue-700",
  INVOICE_APPROVED: "bg-emerald-100 text-emerald-700",
  INVOICE_CREATED: "bg-emerald-100 text-emerald-700",
  PAYMENT_RECORDED: "bg-emerald-100 text-emerald-700",
  USER_CREATED: "bg-indigo-100 text-indigo-700",
  USER_INVITED: "bg-indigo-100 text-indigo-700",
  LEAD_CONVERTED: "bg-violet-100 text-violet-700",
  LEAD_CREATED: "bg-violet-100 text-violet-700",
  REPORT_EXPORTED: "bg-gray-100 text-gray-700",
  SETTINGS_UPDATED: "bg-amber-100 text-amber-700",
  APPROVAL_REJECTED: "bg-red-100 text-red-700",
  TICKET_ESCALATED: "bg-orange-100 text-orange-700",
  TICKET_RESOLVED: "bg-emerald-100 text-emerald-700",
  EMPLOYEE_ADDED: "bg-teal-100 text-teal-700",
  TASK_COMPLETED: "bg-emerald-100 text-emerald-700",
  DOCUMENT_UPLOADED: "bg-gray-100 text-gray-700",
  EXPENSE_SUBMITTED: "bg-amber-100 text-amber-700",
  LEAVE_APPROVED: "bg-teal-100 text-teal-700",
  VENDOR_ADDED: "bg-gray-100 text-gray-700",
};

const ALL_RESOURCES = ["auth", "finance", "users", "crm", "reports", "settings", "approvals", "support", "hr", "operations", "documents", "procurement"];

export default function AuditLogsPage() {
  const { data: logs } = useQuery({ queryKey: ["platform-audit-logs"], queryFn: () => mockPlatformAuditLogs });
  const [search, setSearch] = useState("");
  const [resourceFilter, setResourceFilter] = useState("all");

  const allLogs = logs ?? [];
  const sorted = [...allLogs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const filtered = sorted.filter((l) => {
    const matchSearch = !search ||
      l.userName.toLowerCase().includes(search.toLowerCase()) ||
      l.orgName.toLowerCase().includes(search.toLowerCase()) ||
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.details.toLowerCase().includes(search.toLowerCase());
    const matchResource = resourceFilter === "all" || l.resource === resourceFilter;
    return matchSearch && matchResource;
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Audit Logs</h1>
        <p className="text-sm text-muted-foreground mt-1">All platform activity across tenant organisations</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total Events</p>
            <p className="text-2xl font-bold mt-1">{allLogs.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Organisations Involved</p>
            <p className="text-2xl font-bold mt-1">{new Set(allLogs.map((l) => l.orgId)).size}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Unique Users</p>
            <p className="text-2xl font-bold mt-1">{new Set(allLogs.map((l) => l.userId)).size}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by user, org, action, or details…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <Select value={resourceFilter} onValueChange={setResourceFilter}>
          <SelectTrigger className="w-44 h-9"><SelectValue placeholder="All Resources" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Resources</SelectItem>
            {ALL_RESOURCES.map((r) => (
              <SelectItem key={r} value={r} className="capitalize">{r}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                {["Timestamp", "Action", "Resource", "User", "Organisation", "Details", "IP Address"].map((h) => (
                  <th key={h} className="h-9 px-4 text-left text-xs font-semibold text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((log) => {
                const actionClass = ACTION_COLORS[log.action] ?? "bg-gray-100 text-gray-600";
                return (
                  <tr key={log.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-2.5 text-xs text-muted-foreground whitespace-nowrap">{formatDateTime(log.createdAt)}</td>
                    <td className="px-4 py-2.5">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap ${actionClass}`}>{log.action}</span>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground capitalize">{log.resource}</td>
                    <td className="px-4 py-2.5">
                      <p className="font-medium text-xs">{log.userName}</p>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground">{log.orgName}</td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground max-w-xs truncate" title={log.details}>{log.details}</td>
                    <td className="px-4 py-2.5 text-xs font-mono text-muted-foreground">{log.ipAddress}</td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-10 text-center text-sm text-muted-foreground">No audit events match the current filters</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

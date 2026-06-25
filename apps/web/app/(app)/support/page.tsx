"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, HeadphonesIcon, AlertTriangle, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { mockTickets } from "@/lib/mock/tickets";
import { formatRelative, formatDate } from "@/lib/utils/format";
import type { TicketStatus } from "@/lib/types";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { TOKEN } from "@/lib/tokens";

const STATUS_TABS: { value: TicketStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "assigned", label: "Assigned" },
  { value: "in_progress", label: "In Progress" },
  { value: "escalated", label: "Escalated" },
  { value: "pending_customer", label: "Pending" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

function SLABar({ percent, breached }: { percent: number; breached: boolean }) {
  const color = breached ? TOKEN.critical : percent > 80 ? TOKEN.warning : percent > 60 ? TOKEN.teal : TOKEN.success;
  const srLabel = breached ? "SLA breached" : percent > 80 ? "SLA at risk" : "SLA on track";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${Math.min(percent, 100)}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-xs tabular-nums" style={{ color }}>
        {Math.min(percent, 100).toFixed(0)}%
      </span>
      <span className="sr-only">{srLabel}</span>
    </div>
  );
}

export default function SupportPage() {
  const [search, setSearch] = useState("");
  const [statusTab, setStatusTab] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  const { data: tickets } = useQuery({
    queryKey: ["tickets"],
    queryFn: () => mockTickets,
  });

  const filtered = (tickets ?? []).filter((t) => {
    const matchSearch =
      !search ||
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.ticketNumber.toLowerCase().includes(search.toLowerCase()) ||
      t.customerName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusTab === "all" || t.status === statusTab;
    const matchPriority = priorityFilter === "all" || t.priority === priorityFilter;
    return matchSearch && matchStatus && matchPriority;
  });

  const breachedCount = (tickets ?? []).filter((t) => t.slaBreached && !["closed", "resolved"].includes(t.status)).length;
  const openCount = (tickets ?? []).filter((t) => !["closed", "resolved"].includes(t.status)).length;
  const escalatedCount = (tickets ?? []).filter((t) => t.status === "escalated").length;

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Support Tickets"
        description="Manage customer support requests and SLA compliance"
        actions={
          <Button className="bg-[var(--brand-navy)] hover:bg-[var(--brand-navy)]/90 text-white gap-2">
            <Plus className="h-4 w-4" />
            New Ticket
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Open Tickets</p>
            <p className="text-2xl font-bold mt-1">{openCount}</p>
          </CardContent>
        </Card>
        <Card className={breachedCount > 0 ? "border-red-200 bg-red-50/50" : ""}>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">SLA Breached</p>
            <p className={cn("text-2xl font-bold mt-1", breachedCount > 0 ? "text-red-600" : "")}>{breachedCount}</p>
          </CardContent>
        </Card>
        <Card className={escalatedCount > 0 ? "border-orange-200 bg-orange-50/50" : ""}>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Escalated</p>
            <p className={cn("text-2xl font-bold mt-1", escalatedCount > 0 ? "text-orange-600" : "")}>{escalatedCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total Tickets</p>
            <p className="text-2xl font-bold mt-1">{(tickets ?? []).length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tickets…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-36 h-9">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Status tabs */}
      <Tabs value={statusTab} onValueChange={setStatusTab}>
        <TabsList className="h-9 flex-wrap gap-1">
          {STATUS_TABS.map((s) => {
            const count = s.value === "all" ? (tickets ?? []).length : (tickets ?? []).filter((t) => t.status === s.value).length;
            return (
              <TabsTrigger key={s.value} value={s.value} className="gap-1.5 h-7 text-xs">
                {s.label}
                <Badge variant="outline" className="h-4 px-1 text-xs ml-0.5">{count}</Badge>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value={statusTab} className="mt-4">
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    {["Ticket", "Subject", "Customer", "Priority", "Assignee", "SLA", "Status", "Updated"].map((h) => (
                      <th key={h} className="h-10 px-4 text-left text-xs font-semibold text-muted-foreground">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((ticket) => (
                    <tr key={ticket.id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <Link href={`/support/${ticket.id}`} className="font-mono text-xs font-semibold hover:text-[var(--brand-teal)]">
                          {ticket.ticketNumber}
                        </Link>
                      </td>
                      <td className="px-4 py-3 max-w-[250px]">
                        <Link href={`/support/${ticket.id}`} className="hover:text-[var(--brand-teal)]">
                          <p className="font-medium truncate" title={ticket.subject}>{ticket.subject}</p>
                        </Link>
                        {ticket.slaBreached && (
                          <Badge variant="destructive" className="text-[10px] h-4 px-1 mt-0.5">SLA BREACHED</Badge>
                        )}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{ticket.customerName}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs capitalize">{ticket.priority}</span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">
                        {ticket.assigneeName ?? "Unassigned"}
                      </td>
                      <td className="px-4 py-3 min-w-[100px]">
                        <SLABar percent={ticket.slaPercentUsed} breached={ticket.slaBreached} />
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={ticket.status} />
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                        {formatRelative(ticket.updatedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="py-12">
                  <EmptyState
                    title="No tickets found"
                    description="Try adjusting your search or filters"
                    icon={<HeadphonesIcon className="h-8 w-8" />}
                  />
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

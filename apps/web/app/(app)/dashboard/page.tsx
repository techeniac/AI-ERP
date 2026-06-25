"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/shared/stat-card";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { useAuth } from "@/lib/hooks/use-auth";
import {
  dashboardKPIs,
  revenueChartData,
  pipelineStageData,
  arAgingSummary,
  topCustomersData,
  ticketTrendData,
  taskCompletionData,
} from "@/lib/mock/dashboard-kpis";
import { mockTickets } from "@/lib/mock/tickets";
import { mockTasks } from "@/lib/mock/tasks";
import { mockApprovals } from "@/lib/mock/approvals";
import { mockLeads } from "@/lib/mock/leads";
import { mockEmployees } from "@/lib/mock/employees";
import { mockInvoices } from "@/lib/mock/invoices";
import { getRecentActivity } from "@/lib/mock/activity";
import { formatCurrencyCompact, formatRelative, formatDate } from "@/lib/utils/format";
import { TOKEN } from "@/lib/tokens";
import Link from "next/link";
import { cn } from "@/lib/utils";

// ── Shared chart components ──────────────────────────────────────────────────

function MiniLineChart({ data, label }: { data: { label: string; value: number }[]; label?: string }) {
  const max = Math.max(...data.map((d) => d.value));
  const min = Math.min(...data.map((d) => d.value));
  const range = max - min || 1;
  const h = 60;
  const w = 280;
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((d.value - min) / range) * h;
    return `${x},${y}`;
  });
  return (
    <div className="overflow-hidden">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-16">
        <polyline points={pts.join(" ")} fill="none" stroke="var(--brand-teal)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        <polyline points={`0,${h} ${pts.join(" ")} ${w},${h}`} fill="var(--brand-teal)" fillOpacity="0.08" stroke="none" />
      </svg>
      <div className="flex justify-between mt-1">
        <span className="text-xs text-muted-foreground">{data[0]?.label}</span>
        <span className="text-xs font-semibold text-[var(--brand-teal)]">
          {label === "currency" ? formatCurrencyCompact(data[data.length - 1]?.value ?? 0) : (data[data.length - 1]?.value ?? 0)}
        </span>
        <span className="text-xs text-muted-foreground">{data[data.length - 1]?.label}</span>
      </div>
    </div>
  );
}

function SimpleBarChart({ data }: { data: { label: string; value: number; color?: string }[] }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="space-y-2">
      {data.map((item) => (
        <div key={item.label} className="flex items-center gap-3">
          <span className="w-20 shrink-0 text-xs text-muted-foreground truncate text-right">{item.label}</span>
          <div className="flex-1 h-5 bg-muted rounded overflow-hidden">
            <div className="h-full rounded" style={{ width: `${(item.value / max) * 100}%`, backgroundColor: item.color ?? "var(--brand-teal)" }} />
          </div>
          <span className="text-xs font-semibold tabular-nums w-16 text-right">{formatCurrencyCompact(item.value)}</span>
        </div>
      ))}
    </div>
  );
}

// ── Role-specific sections ───────────────────────────────────────────────────

function SuperAdminDashboard() {
  const { data: recentTickets } = useQuery({
    queryKey: ["recent-tickets"], queryFn: () =>
      mockTickets.filter((t) => !["closed","resolved"].includes(t.status))
        .sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0,5),
  });
  const { data: pendingTasks } = useQuery({
    queryKey: ["pending-tasks"], queryFn: () =>
      mockTasks.filter((t) => ["todo","in_progress"].includes(t.status))
        .sort((a,b) => new Date(a.dueDate ?? "9999").getTime() - new Date(b.dueDate ?? "9999").getTime()).slice(0,5),
  });
  const { data: pendingApprovals } = useQuery({ queryKey: ["pending-approvals"], queryFn: () => mockApprovals.filter((a) => a.status === "pending").slice(0,4) });
  const { data: activity } = useQuery({ queryKey: ["recent-activity"], queryFn: () => getRecentActivity(8) });

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Revenue Trend</CardTitle><CardDescription>Monthly invoiced revenue (last 12 months)</CardDescription></CardHeader>
          <CardContent><MiniLineChart data={revenueChartData} label="currency" /></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Sales Pipeline</CardTitle><CardDescription>By stage (deal value)</CardDescription></CardHeader>
          <CardContent className="space-y-2">
            {pipelineStageData.map((s) => (
              <div key={s.stage} className="flex items-center gap-3">
                <div className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="flex-1 text-sm text-muted-foreground">{s.stage}</span>
                <span className="text-xs font-medium">{s.count}</span>
                <span className="text-xs font-semibold tabular-nums w-20 text-right">{formatCurrencyCompact(s.value)}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <div><CardTitle className="text-base font-semibold">Open Tickets</CardTitle><CardDescription>Requiring attention</CardDescription></div>
            <Link href="/support" className="text-xs text-[var(--brand-teal)] hover:underline font-medium">View all →</Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {(recentTickets ?? []).map((t) => (
              <Link key={t.id} href={`/support/${t.id}`}>
                <div className="flex items-start gap-3 rounded-lg p-2 hover:bg-muted/50">
                  <div className="min-w-0 flex-1"><p className="text-sm font-medium truncate">{t.subject}</p><p className="text-xs text-muted-foreground">{t.customerName}</p></div>
                  <div className="flex flex-col items-end gap-1 shrink-0"><StatusBadge status={t.priority} />{t.slaBreached && <Badge variant="destructive" className="text-xs h-4 px-1">SLA</Badge>}</div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <div><CardTitle className="text-base font-semibold">My Tasks</CardTitle><CardDescription>Upcoming due dates</CardDescription></div>
            <Link href="/operations" className="text-xs text-[var(--brand-teal)] hover:underline font-medium">View all →</Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {(pendingTasks ?? []).map((task) => {
              const overdue = task.dueDate && new Date(task.dueDate) < new Date();
              return (
                <div key={task.id} className="flex items-start gap-3 rounded-lg p-2 hover:bg-muted/50">
                  <div className="min-w-0 flex-1"><p className="text-sm font-medium truncate">{task.title}</p>
                    <p className={cn("text-xs mt-0.5", overdue ? "text-red-600 font-medium" : "text-muted-foreground")}>{overdue ? "Overdue: " : "Due "}{formatDate(task.dueDate ?? null)}</p>
                  </div>
                  <StatusBadge status={task.priority as "critical"|"high"|"medium"|"low"} />
                </div>
              );
            })}
          </CardContent>
        </Card>
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <div><CardTitle className="text-base font-semibold">Pending Approvals</CardTitle><CardDescription>Awaiting your action</CardDescription></div>
              <Link href="/approvals" className="text-xs text-[var(--brand-teal)] hover:underline font-medium">View all →</Link>
            </CardHeader>
            <CardContent className="space-y-2">
              {(pendingApprovals ?? []).map((a) => (
                <Link key={a.id} href="/approvals">
                  <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted/50 cursor-pointer">
                    <div className="min-w-0 flex-1"><p className="text-sm font-medium truncate">{a.title}</p><p className="text-xs text-muted-foreground">{a.requestorName}</p></div>
                    <StatusBadge status={a.priority as "critical"|"high"|"medium"|"low"} />
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">AR Aging</CardTitle><CardDescription>Receivables by age bucket</CardDescription></CardHeader>
            <CardContent className="space-y-2">
              {arAgingSummary.map((b) => (
                <div key={b.label} className="flex items-center gap-3">
                  <div className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: b.color }} />
                  <span className="flex-1 text-xs text-muted-foreground">{b.label}</span>
                  <span className="text-xs font-semibold">{formatCurrencyCompact(b.value)}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Recent Activity</CardTitle><CardDescription>Latest actions across the platform</CardDescription></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {(activity ?? []).map((item) => (
              <div key={item.id} className="flex items-start gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground text-xs font-semibold">
                  {item.actorName.split(" ").map((n) => n[0]).join("").slice(0,2)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-foreground">{item.description}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{formatRelative(item.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function FinanceDashboard() {
  const { data: overdueInvoices } = useQuery({
    queryKey: ["overdue-invoices"], queryFn: () =>
      mockInvoices.filter((i) => i.status === "overdue")
        .sort((a,b) => b.balanceDue - a.balanceDue).slice(0,5),
  });
  const { data: pendingApprovals } = useQuery({ queryKey: ["pending-approvals"], queryFn: () => mockApprovals.filter((a) => a.status === "pending").slice(0,5) });

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Revenue Trend</CardTitle><CardDescription>Monthly invoiced revenue (last 12 months)</CardDescription></CardHeader>
          <CardContent><MiniLineChart data={revenueChartData} label="currency" /></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">AR Aging</CardTitle><CardDescription>Receivables by age bucket</CardDescription></CardHeader>
          <CardContent>
            <SimpleBarChart data={arAgingSummary} />
            <div className="mt-3 pt-3 border-t">
              <p className="text-xs text-muted-foreground">Total outstanding</p>
              <p className="text-lg font-bold tabular-nums">{formatCurrencyCompact(arAgingSummary.reduce((s,b) => s + b.value, 0))}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <div><CardTitle className="text-base font-semibold">Overdue Invoices</CardTitle><CardDescription>Highest balance due first</CardDescription></div>
            <Link href="/finance" className="text-xs text-[var(--brand-teal)] hover:underline font-medium">View all →</Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {(overdueInvoices ?? []).map((inv) => (
              <Link key={inv.id} href={`/finance/${inv.id}`}>
                <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted/50 cursor-pointer">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{inv.invoiceNumber} · {inv.customerName}</p>
                    <p className="text-xs text-red-600 mt-0.5">Due {formatDate(inv.dueDate)}</p>
                  </div>
                  <span className="text-sm font-bold text-red-600 tabular-nums">{formatCurrencyCompact(inv.balanceDue)}</span>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <div><CardTitle className="text-base font-semibold">Pending Approvals</CardTitle><CardDescription>Finance approvals awaiting action</CardDescription></div>
            <Link href="/approvals" className="text-xs text-[var(--brand-teal)] hover:underline font-medium">View all →</Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {(pendingApprovals ?? []).map((a) => (
              <Link key={a.id} href="/approvals">
                <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted/50 cursor-pointer">
                  <div className="min-w-0 flex-1"><p className="text-sm font-medium truncate">{a.title}</p><p className="text-xs text-muted-foreground">{a.requestorName}</p></div>
                  <StatusBadge status={a.priority as "critical"|"high"|"medium"|"low"} />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Top Customers by Revenue</CardTitle><CardDescription>Lifetime invoiced value</CardDescription></CardHeader>
        <CardContent><SimpleBarChart data={topCustomersData} /></CardContent>
      </Card>
    </>
  );
}

function SalesDashboard() {
  const { data: hotLeads } = useQuery({
    queryKey: ["hot-leads"], queryFn: () =>
      mockLeads.filter((l) => !["won","lost"].includes(l.status))
        .sort((a,b) => b.estimatedValue - a.estimatedValue).slice(0,6),
  });
  const { data: pendingApprovals } = useQuery({ queryKey: ["pending-approvals"], queryFn: () => mockApprovals.filter((a) => a.status === "pending").slice(0,4) });

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Sales Pipeline</CardTitle><CardDescription>Active deals by stage</CardDescription></CardHeader>
          <CardContent className="space-y-2">
            {pipelineStageData.map((s) => (
              <div key={s.stage} className="flex items-center gap-3">
                <div className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="flex-1 text-sm text-muted-foreground">{s.stage}</span>
                <span className="text-xs font-medium tabular-nums">{s.count} deals</span>
                <span className="text-xs font-semibold tabular-nums w-20 text-right">{formatCurrencyCompact(s.value)}</span>
              </div>
            ))}
            <div className="pt-2 border-t flex justify-between">
              <span className="text-xs text-muted-foreground">Total pipeline</span>
              <span className="text-sm font-bold">{formatCurrencyCompact(pipelineStageData.reduce((s,d) => s + d.value, 0))}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Revenue Trend</CardTitle><CardDescription>Monthly invoiced revenue (last 12 months)</CardDescription></CardHeader>
          <CardContent><MiniLineChart data={revenueChartData} label="currency" /></CardContent>
        </Card>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <div><CardTitle className="text-base font-semibold">Top Leads by Value</CardTitle><CardDescription>Active pipeline, highest first</CardDescription></div>
            <Link href="/crm" className="text-xs text-[var(--brand-teal)] hover:underline font-medium">View all →</Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {(hotLeads ?? []).map((lead) => (
              <Link key={lead.id} href={`/crm/${lead.id}`}>
                <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted/50 cursor-pointer">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{lead.company}</p>
                    <p className="text-xs text-muted-foreground">{lead.contactName} · {lead.status.replace("_"," ")}</p>
                  </div>
                  <span className="text-sm font-semibold tabular-nums text-[var(--brand-teal)]">{formatCurrencyCompact(lead.estimatedValue)}</span>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <div><CardTitle className="text-base font-semibold">Pending Approvals</CardTitle><CardDescription>Awaiting your sign-off</CardDescription></div>
            <Link href="/approvals" className="text-xs text-[var(--brand-teal)] hover:underline font-medium">View all →</Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {(pendingApprovals ?? []).map((a) => (
              <Link key={a.id} href="/approvals">
                <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted/50 cursor-pointer">
                  <div className="min-w-0 flex-1"><p className="text-sm font-medium truncate">{a.title}</p><p className="text-xs text-muted-foreground">{a.requestorName}</p></div>
                  <StatusBadge status={a.priority as "critical"|"high"|"medium"|"low"} />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Top Customers</CardTitle><CardDescription>By lifetime revenue</CardDescription></CardHeader>
        <CardContent><SimpleBarChart data={topCustomersData} /></CardContent>
      </Card>
    </>
  );
}

function SupportDashboard() {
  const { data: openTickets } = useQuery({
    queryKey: ["open-tickets"], queryFn: () =>
      mockTickets.filter((t) => !["closed","resolved"].includes(t.status))
        .sort((a,b) => {
          if (a.slaBreached && !b.slaBreached) return -1;
          if (!a.slaBreached && b.slaBreached) return 1;
          const pri = { critical:0, high:1, medium:2, low:3 };
          return (pri[a.priority as keyof typeof pri] ?? 2) - (pri[b.priority as keyof typeof pri] ?? 2);
        }).slice(0,8),
  });
  const { data: pendingApprovals } = useQuery({ queryKey: ["pending-approvals"], queryFn: () => mockApprovals.filter((a) => a.status === "pending").slice(0,4) });

  const breached = mockTickets.filter((t) => t.slaBreached && !["closed","resolved"].includes(t.status));
  const byPriority = [
    { label: "Critical", count: mockTickets.filter(t => t.priority === "critical" && !["closed","resolved"].includes(t.status)).length, color: TOKEN.critical },
    { label: "High", count: mockTickets.filter(t => t.priority === "high" && !["closed","resolved"].includes(t.status)).length, color: TOKEN.orange },
    { label: "Medium", count: mockTickets.filter(t => t.priority === "medium" && !["closed","resolved"].includes(t.status)).length, color: TOKEN.warning },
    { label: "Low", count: mockTickets.filter(t => t.priority === "low" && !["closed","resolved"].includes(t.status)).length, color: TOKEN.neutral },
  ];

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Ticket Volume Trend</CardTitle><CardDescription>Weekly open tickets (last 8 weeks)</CardDescription></CardHeader>
          <CardContent><MiniLineChart data={ticketTrendData} /></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">By Priority</CardTitle><CardDescription>Open tickets breakdown</CardDescription></CardHeader>
          <CardContent className="space-y-3 pt-2">
            {byPriority.map((p) => (
              <div key={p.label} className="flex items-center gap-3">
                <div className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: p.color }} />
                <span className="flex-1 text-sm text-muted-foreground">{p.label}</span>
                <span className="text-sm font-bold tabular-nums">{p.count}</span>
              </div>
            ))}
            <div className="pt-2 border-t flex justify-between">
              <span className="text-xs text-muted-foreground">SLA breached</span>
              <span className={cn("text-sm font-bold", breached.length > 0 ? "text-red-600" : "text-green-600")}>{breached.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <div><CardTitle className="text-base font-semibold">Open Tickets</CardTitle><CardDescription>SLA breaches and high priority first</CardDescription></div>
            <Link href="/support" className="text-xs text-[var(--brand-teal)] hover:underline font-medium">View all →</Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {(openTickets ?? []).map((t) => (
              <Link key={t.id} href={`/support/${t.id}`}>
                <div className="flex items-start gap-3 rounded-lg p-2 hover:bg-muted/50">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{t.subject}</p>
                    <p className="text-xs text-muted-foreground">{t.customerName} · {t.ticketNumber}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <StatusBadge status={t.priority} />
                    {t.slaBreached && <Badge variant="destructive" className="text-xs h-4 px-1">SLA</Badge>}
                  </div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <div><CardTitle className="text-base font-semibold">Pending Approvals</CardTitle><CardDescription>Awaiting your action</CardDescription></div>
            <Link href="/approvals" className="text-xs text-[var(--brand-teal)] hover:underline font-medium">View all →</Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {(pendingApprovals ?? []).map((a) => (
              <Link key={a.id} href="/approvals">
                <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted/50 cursor-pointer">
                  <div className="min-w-0 flex-1"><p className="text-sm font-medium truncate">{a.title}</p><p className="text-xs text-muted-foreground">{a.requestorName}</p></div>
                  <StatusBadge status={a.priority as "critical"|"high"|"medium"|"low"} />
                </div>
              </Link>
            ))}
            {(pendingApprovals ?? []).length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No pending approvals</p>}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function OperationsDashboard() {
  const { data: pendingTasks } = useQuery({
    queryKey: ["pending-tasks"], queryFn: () =>
      mockTasks.filter((t) => ["todo","in_progress"].includes(t.status))
        .sort((a,b) => new Date(a.dueDate ?? "9999").getTime() - new Date(b.dueDate ?? "9999").getTime()).slice(0,8),
  });
  const { data: pendingApprovals } = useQuery({ queryKey: ["pending-approvals"], queryFn: () => mockApprovals.filter((a) => a.status === "pending").slice(0,4) });

  const overdueTasks = mockTasks.filter((t) => t.dueDate && new Date(t.dueDate) < new Date() && !["done","cancelled"].includes(t.status));
  const byStatus = [
    { label: "To Do", count: mockTasks.filter(t => t.status === "todo").length, color: TOKEN.neutral },
    { label: "In Progress", count: mockTasks.filter(t => t.status === "in_progress").length, color: TOKEN.info },
    { label: "Review", count: mockTasks.filter(t => t.status === "review").length, color: TOKEN.purple },
    { label: "Done", count: mockTasks.filter(t => t.status === "done").length, color: TOKEN.success },
  ];

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Task Completion Rate</CardTitle><CardDescription>Monthly completion % (last 6 months)</CardDescription></CardHeader>
          <CardContent><MiniLineChart data={taskCompletionData} /></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Task Status</CardTitle><CardDescription>All tasks breakdown</CardDescription></CardHeader>
          <CardContent className="space-y-3 pt-2">
            {byStatus.map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <div className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="flex-1 text-sm text-muted-foreground">{s.label}</span>
                <span className="text-sm font-bold tabular-nums">{s.count}</span>
              </div>
            ))}
            <div className="pt-2 border-t flex justify-between">
              <span className="text-xs text-muted-foreground">Overdue</span>
              <span className={cn("text-sm font-bold", overdueTasks.length > 0 ? "text-red-600" : "text-green-600")}>{overdueTasks.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <div><CardTitle className="text-base font-semibold">My Tasks</CardTitle><CardDescription>Overdue and upcoming first</CardDescription></div>
            <Link href="/operations" className="text-xs text-[var(--brand-teal)] hover:underline font-medium">View all →</Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {(pendingTasks ?? []).map((task) => {
              const overdue = task.dueDate && new Date(task.dueDate) < new Date();
              return (
                <div key={task.id} className="flex items-start gap-3 rounded-lg p-2 hover:bg-muted/50">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{task.title}</p>
                    <p className={cn("text-xs mt-0.5", overdue ? "text-red-600 font-medium" : "text-muted-foreground")}>{overdue ? "Overdue: " : "Due "}{formatDate(task.dueDate ?? null)}</p>
                  </div>
                  <StatusBadge status={task.priority as "critical"|"high"|"medium"|"low"} />
                </div>
              );
            })}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <div><CardTitle className="text-base font-semibold">Pending Approvals</CardTitle><CardDescription>Awaiting your action</CardDescription></div>
            <Link href="/approvals" className="text-xs text-[var(--brand-teal)] hover:underline font-medium">View all →</Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {(pendingApprovals ?? []).map((a) => (
              <Link key={a.id} href="/approvals">
                <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted/50 cursor-pointer">
                  <div className="min-w-0 flex-1"><p className="text-sm font-medium truncate">{a.title}</p><p className="text-xs text-muted-foreground">{a.requestorName}</p></div>
                  <StatusBadge status={a.priority as "critical"|"high"|"medium"|"low"} />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function HRDashboard() {
  const { data: pendingApprovals } = useQuery({ queryKey: ["pending-approvals"], queryFn: () => mockApprovals.filter((a) => a.status === "pending").slice(0,5) });

  const deptCounts = mockEmployees.reduce<Record<string,number>>((acc, e) => {
    if (e.status === "active") { acc[e.department] = (acc[e.department] ?? 0) + 1; }
    return acc;
  }, {});
  const deptData = Object.entries(deptCounts)
    .sort((a,b) => b[1] - a[1])
    .map(([label, value]) => ({ label, value }));

  const onLeave = mockEmployees.filter((e) => e.status === "on_leave").length;
  const recentJoins = [...mockEmployees]
    .filter((e) => e.status === "active")
    .sort((a,b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime())
    .slice(0,5);

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Headcount by Department</CardTitle><CardDescription>Active employees</CardDescription></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {deptData.map((d) => {
                const total = mockEmployees.filter(e => e.status === "active").length;
                return (
                  <div key={d.label} className="flex items-center gap-3">
                    <span className="w-32 shrink-0 text-xs text-muted-foreground truncate text-right">{d.label}</span>
                    <div className="flex-1 h-5 bg-muted rounded overflow-hidden">
                      <div className="h-full rounded bg-[var(--brand-teal)]" style={{ width: `${(d.value / total) * 100}%` }} />
                    </div>
                    <span className="text-xs font-semibold tabular-nums w-6 text-right">{d.value}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 pt-3 border-t">
              <div className="text-center"><p className="text-2xl font-bold">{mockEmployees.filter(e => e.status === "active").length}</p><p className="text-xs text-muted-foreground">Active</p></div>
              <div className="text-center"><p className="text-2xl font-bold text-amber-600">{onLeave}</p><p className="text-xs text-muted-foreground">On Leave</p></div>
              <div className="text-center"><p className="text-2xl font-bold text-muted-foreground">{mockEmployees.filter(e => e.status === "inactive").length}</p><p className="text-xs text-muted-foreground">Inactive</p></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <div><CardTitle className="text-base font-semibold">Pending Approvals</CardTitle><CardDescription>HR approvals queue</CardDescription></div>
            <Link href="/approvals" className="text-xs text-[var(--brand-teal)] hover:underline font-medium">View all →</Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {(pendingApprovals ?? []).map((a) => (
              <Link key={a.id} href="/approvals">
                <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted/50 cursor-pointer">
                  <div className="min-w-0 flex-1"><p className="text-sm font-medium truncate">{a.title}</p><p className="text-xs text-muted-foreground">{a.requestorName}</p></div>
                  <StatusBadge status={a.priority as "critical"|"high"|"medium"|"low"} />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
          <div><CardTitle className="text-base font-semibold">Recent Joiners</CardTitle><CardDescription>Latest employees added</CardDescription></div>
          <Link href="/hr" className="text-xs text-[var(--brand-teal)] hover:underline font-medium">View all →</Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentJoins.map((emp) => (
              <Link key={emp.id} href={`/hr/${emp.id}`}>
                <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted/50 cursor-pointer">
                  <img src={emp.avatar} alt={emp.name} className="h-8 w-8 rounded-full bg-muted" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{emp.name}</p>
                    <p className="text-xs text-muted-foreground">{emp.jobTitle} · {emp.department}</p>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">Joined {formatDate(emp.joinDate)}</span>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

// ── KPI config per role ──────────────────────────────────────────────────────

const KPI_MODULES: Record<string, string[]> = {
  super_admin: ["finance", "crm", "support", "operations", "approvals"],
  finance: ["finance", "approvals"],
  sales_manager: ["crm", "approvals"],
  support_agent: ["support", "approvals"],
  operations: ["operations", "approvals"],
  hr: ["hr", "approvals"],
  employee: ["approvals"],
};

// ── Main page ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { user } = useAuth();

  const { data: kpis } = useQuery({ queryKey: ["dashboard-kpis"], queryFn: () => dashboardKPIs });

  const allowedModules = KPI_MODULES[user?.role ?? "employee"] ?? [];
  const visibleKPIs = (kpis ?? []).filter((k) => allowedModules.includes(k.module ?? "")).slice(0, 8);

  const breachedTickets = mockTickets.filter((t) => t.slaBreached && !["closed","resolved"].includes(t.status));

  const greeting = () => {
    const h = new Date().getHours();
    return h < 12 ? "morning" : h < 18 ? "afternoon" : "evening";
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title={`Good ${greeting()}, ${user?.name?.split(" ")[0] ?? "there"}`}
        description={`Here's what's happening across your business today, ${new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}`}
      />

      {/* SLA alert — only show to roles with support visibility */}
      {breachedTickets.length > 0 && ["super_admin","support_agent"].includes(user?.role ?? "") && (
        <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 dark:border-red-900/50 dark:bg-red-900/20">
          <AlertTriangle className="h-5 w-5 shrink-0 text-red-600" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-800 dark:text-red-300">
              {breachedTickets.length} SLA breach{breachedTickets.length > 1 ? "es" : ""} require immediate attention
            </p>
            <p className="text-xs text-red-600 dark:text-red-400 mt-0.5">
              {breachedTickets.map((t) => t.ticketNumber).join(", ")}
            </p>
          </div>
          <Link href="/support" className="text-xs font-semibold text-red-700 hover:text-red-900 underline">View tickets →</Link>
        </div>
      )}

      {/* KPI grid */}
      {visibleKPIs.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {visibleKPIs.map((kpi) => <StatCard key={kpi.id} kpi={kpi} />)}
        </div>
      )}

      {/* Role-specific content */}
      {user?.role === "super_admin" && <SuperAdminDashboard />}
      {user?.role === "finance" && <FinanceDashboard />}
      {user?.role === "sales_manager" && <SalesDashboard />}
      {user?.role === "support_agent" && <SupportDashboard />}
      {user?.role === "operations" && <OperationsDashboard />}
      {user?.role === "hr" && <HRDashboard />}
    </div>
  );
}

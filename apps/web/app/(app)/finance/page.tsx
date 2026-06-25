"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, Receipt, Download, Wallet, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { mockInvoices } from "@/lib/mock/invoices";
import { mockPayments } from "@/lib/mock/payments";
import { arAgingSummary, revenueChartData } from "@/lib/mock/dashboard-kpis";
import { formatCurrency, formatCurrencyCompact, formatDate, formatRelative } from "@/lib/utils/format";
import type { InvoiceStatus } from "@/lib/types";
import Link from "next/link";

type ExpenseStatus = "pending" | "approved" | "rejected" | "reimbursed";

interface Expense {
  id: string;
  date: string;
  submittedBy: string;
  department: string;
  category: string;
  description: string;
  amount: number;
  status: ExpenseStatus;
  receiptAttached: boolean;
}

const MOCK_EXPENSES: Expense[] = [
  { id: "exp-001", date: "2026-06-20", submittedBy: "Arjun Sharma", department: "Engineering", category: "Travel", description: "Flight to Bangalore for client meeting — Infosys Q2 review", amount: 14500, status: "approved", receiptAttached: true },
  { id: "exp-002", date: "2026-06-18", submittedBy: "Rahul Mehta", department: "Sales", category: "Entertainment", description: "Client dinner — Swiggy Instamart deal closure", amount: 8200, status: "pending", receiptAttached: true },
  { id: "exp-003", date: "2026-06-17", submittedBy: "Ananya Singh", department: "Customer Success", category: "Software", description: "Zoom Pro annual subscription renewal", amount: 52000, status: "approved", receiptAttached: false },
  { id: "exp-004", date: "2026-06-15", submittedBy: "Vikram Nair", department: "Operations", category: "Office Supplies", description: "Stationery and printer cartridges for operations team", amount: 3800, status: "reimbursed", receiptAttached: true },
  { id: "exp-005", date: "2026-06-14", submittedBy: "Priya Patel", department: "Finance", category: "Training", description: "GST compliance workshop — ICAI Bengaluru", amount: 6500, status: "approved", receiptAttached: true },
  { id: "exp-006", date: "2026-06-12", submittedBy: "Deepika Rao", department: "HR", category: "Recruitment", description: "LinkedIn Recruiter subscription — June", amount: 28000, status: "pending", receiptAttached: false },
  { id: "exp-007", date: "2026-06-10", submittedBy: "Rahul Mehta", department: "Sales", category: "Travel", description: "Hotel accommodation — Mumbai client visits (3 nights)", amount: 18900, status: "reimbursed", receiptAttached: true },
  { id: "exp-008", date: "2026-06-08", submittedBy: "Arjun Sharma", department: "Engineering", category: "Software", description: "AWS usage overage — May billing cycle", amount: 41200, status: "approved", receiptAttached: true },
  { id: "exp-009", date: "2026-06-05", submittedBy: "Pooja Verma", department: "Marketing", category: "Advertising", description: "Google Ads campaign — June ERP awareness drive", amount: 35000, status: "rejected", receiptAttached: true },
  { id: "exp-010", date: "2026-06-03", submittedBy: "Vikram Nair", department: "Operations", category: "Maintenance", description: "Office AC servicing and filter replacement", amount: 7600, status: "reimbursed", receiptAttached: true },
];

const EXPENSE_STATUS_COLORS: Record<ExpenseStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
  reimbursed: "bg-blue-100 text-blue-700",
};

const STATUS_FILTERS: { value: InvoiceStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "draft", label: "Draft" },
  { value: "approved", label: "Approved" },
  { value: "sent", label: "Sent" },
  { value: "partially_paid", label: "Partial" },
  { value: "paid", label: "Paid" },
  { value: "overdue", label: "Overdue" },
  { value: "void", label: "Void" },
];

function MiniBar({ data }: { data: { label: string; value: number; color?: string }[] }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="space-y-2">
      {data.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <span className="w-20 text-xs text-muted-foreground text-right shrink-0">{item.label}</span>
          <div className="flex-1 h-5 bg-muted rounded overflow-hidden">
            <div
              className="h-full rounded"
              style={{ width: `${(item.value / max) * 100}%`, backgroundColor: item.color ?? "var(--brand-teal)" }}
            />
          </div>
          <span className="text-xs font-semibold w-16 text-right tabular-nums">
            {formatCurrencyCompact(item.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function FinancePage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: invoices } = useQuery({
    queryKey: ["invoices"],
    queryFn: () => mockInvoices,
  });

  const { data: payments } = useQuery({
    queryKey: ["payments"],
    queryFn: () => mockPayments,
  });

  const filtered = (invoices ?? []).filter((inv) => {
    const matchSearch =
      !search ||
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || inv.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalOutstanding = (invoices ?? [])
    .filter((i) => ["sent", "overdue", "partially_paid"].includes(i.status))
    .reduce((s, i) => s + (i.balanceDue ?? i.total), 0);

  const totalOverdue = (invoices ?? [])
    .filter((i) => i.status === "overdue")
    .reduce((s, i) => s + (i.balanceDue ?? i.total), 0);

  const totalPaidMonth = (payments ?? [])
    .filter((p) => p.paymentDate.startsWith("2026-06"))
    .reduce((s, p) => s + p.amount, 0);

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Finance"
        description="Invoices, payments, and accounts receivable"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2 h-9">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button className="bg-[var(--brand-navy)] hover:bg-[var(--brand-navy)]/90 text-white gap-2 h-9">
              <Plus className="h-4 w-4" />
              New Invoice
            </Button>
          </div>
        }
      />

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Outstanding AR", value: formatCurrencyCompact(totalOutstanding), sub: "across all open invoices", highlight: true },
          { label: "Overdue", value: formatCurrencyCompact(totalOverdue), sub: `${(invoices ?? []).filter((i) => i.status === "overdue").length} invoices`, danger: totalOverdue > 0 },
          { label: "Collected (June)", value: formatCurrencyCompact(totalPaidMonth), sub: `${(payments ?? []).filter((p) => p.paymentDate.startsWith("2026-06")).length} payments` },
          { label: "Total Invoices", value: (invoices ?? []).length.toString(), sub: `${(invoices ?? []).filter((i) => i.status === "draft").length} draft, ${(invoices ?? []).filter((i) => i.status === "sent").length} sent` },
        ].map((stat) => (
          <Card key={stat.label} className={stat.danger ? "border-red-200 bg-red-50/50 dark:border-red-900/50" : ""}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              {stat.danger ? (
                <div className="flex items-center gap-1.5 mt-1">
                  <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
                  <p className="text-xl font-bold tabular-nums text-red-700">{stat.value}</p>
                </div>
              ) : (
                <p className="text-xl font-bold mt-1 tabular-nums">{stat.value}</p>
              )}
              <p className="text-xs text-muted-foreground mt-0.5">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="invoices">
        <TabsList className="h-9">
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="aging">AR Aging</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="mt-4 space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search invoices…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_FILTERS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    {["Invoice #", "Customer", "Issue Date", "Due Date", "Amount", "Balance Due", "Status", ""].map((h) => (
                      <th key={h} className="h-10 px-4 text-left text-xs font-semibold text-muted-foreground">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((inv) => (
                    <tr key={inv.id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <Link href={`/finance/${inv.id}`} className="font-mono font-semibold text-sm hover:text-[var(--brand-teal)]">
                          {inv.invoiceNumber}
                        </Link>
                      </td>
                      <td className="px-4 py-3 font-medium">{inv.customerName}</td>
                      <td className="px-4 py-3 text-muted-foreground">{formatDate(inv.issueDate)}</td>
                      <td className="px-4 py-3 text-muted-foreground">{formatDate(inv.dueDate)}</td>
                      <td className="px-4 py-3 font-semibold tabular-nums">{formatCurrencyCompact(inv.totalAmount)}</td>
                      <td className="px-4 py-3 tabular-nums">
                        {inv.balanceDue > 0 ? (
                          <span className="font-semibold text-red-600">{formatCurrencyCompact(inv.balanceDue)}</span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={inv.status} />
                      </td>
                      <td className="px-4 py-3">
                        <Button variant="ghost" size="sm" className="h-7 text-xs">View</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="py-12">
                  <EmptyState
                    title="No invoices found"
                    description="Try adjusting your search or filters"
                    icon={<Receipt className="h-8 w-8" />}
                  />
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="mt-4">
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    {["Payment Ref", "Customer", "Date", "Amount", "Method", "Invoice", "Notes"].map((h) => (
                      <th key={h} className="h-10 px-4 text-left text-xs font-semibold text-muted-foreground">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(payments ?? []).map((pay) => (
                    <tr key={pay.id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs font-medium">{pay.referenceNumber}</td>
                      <td className="px-4 py-3 font-medium">{pay.customerName}</td>
                      <td className="px-4 py-3 text-muted-foreground">{formatDate(pay.paymentDate)}</td>
                      <td className="px-4 py-3 font-semibold tabular-nums text-emerald-600">
                        {formatCurrencyCompact(pay.amount)}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground capitalize">{pay.method?.replace("_", " ")}</td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{pay.invoiceNumber}</td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{pay.notes ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="aging" className="mt-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">AR Aging Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <MiniBar data={arAgingSummary} />
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {arAgingSummary.map((bucket) => (
                    <div key={bucket.label} className="rounded-lg border p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: bucket.color }} />
                        <span className="text-xs text-muted-foreground">{bucket.label}</span>
                      </div>
                      <p className="text-lg font-bold tabular-nums">{formatCurrencyCompact(bucket.value)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Overdue Invoices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(invoices ?? [])
                    .filter((i) => i.status === "overdue")
                    .map((inv) => (
                      <Link key={inv.id} href={`/finance/${inv.id}`}>
                        <div className="flex items-center justify-between rounded-lg p-3 hover:bg-muted/50 cursor-pointer border">
                          <div>
                            <p className="text-sm font-semibold">{inv.invoiceNumber}</p>
                            <p className="text-xs text-muted-foreground">{inv.customerName}</p>
                            <p className="text-xs text-red-600 mt-0.5">Due: {formatDate(inv.dueDate)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-red-600 tabular-nums">{formatCurrencyCompact(inv.balanceDue)}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  {(invoices ?? []).filter((i) => i.status === "overdue").length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-6">No overdue invoices</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="expenses" className="mt-4 space-y-4">
          {/* Expense KPI strip */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { label: "Total Submitted", value: formatCurrencyCompact(MOCK_EXPENSES.reduce((s, e) => s + e.amount, 0)), sub: `${MOCK_EXPENSES.length} claims` },
              { label: "Pending Review", value: formatCurrencyCompact(MOCK_EXPENSES.filter(e => e.status === "pending").reduce((s, e) => s + e.amount, 0)), sub: `${MOCK_EXPENSES.filter(e => e.status === "pending").length} awaiting`, danger: MOCK_EXPENSES.filter(e => e.status === "pending").length > 0 },
              { label: "Approved", value: formatCurrencyCompact(MOCK_EXPENSES.filter(e => e.status === "approved").reduce((s, e) => s + e.amount, 0)), sub: `${MOCK_EXPENSES.filter(e => e.status === "approved").length} claims` },
              { label: "Reimbursed", value: formatCurrencyCompact(MOCK_EXPENSES.filter(e => e.status === "reimbursed").reduce((s, e) => s + e.amount, 0)), sub: "this month" },
            ].map((stat) => (
              <Card key={stat.label} className={stat.danger ? "border-amber-200 bg-amber-50/50 dark:border-amber-900/50" : ""}>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className={`text-xl font-bold mt-1 tabular-nums ${stat.danger ? "text-amber-700" : ""}`}>{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{stat.sub}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Employee expense claims — June 2026</p>
            <Button className="bg-[var(--brand-navy)] hover:bg-[var(--brand-navy)]/90 text-white gap-2 h-9">
              <Plus className="h-4 w-4" />
              Submit Expense
            </Button>
          </div>

          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    {["Date", "Submitted By", "Department", "Category", "Description", "Amount", "Receipt", "Status"].map((h) => (
                      <th key={h} className="h-10 px-4 text-left text-xs font-semibold text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MOCK_EXPENSES.map((exp) => (
                    <tr key={exp.id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">{formatDate(exp.date)}</td>
                      <td className="px-4 py-3 font-medium">{exp.submittedBy}</td>
                      <td className="px-4 py-3 text-muted-foreground">{exp.department}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="text-xs">{exp.category}</Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground max-w-[260px] truncate">{exp.description}</td>
                      <td className="px-4 py-3 font-semibold tabular-nums">{formatCurrencyCompact(exp.amount)}</td>
                      <td className="px-4 py-3">
                        {exp.receiptAttached ? (
                          <span className="text-xs text-emerald-600 font-medium">✓ Attached</span>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${EXPENSE_STATUS_COLORS[exp.status]}`}>
                          {exp.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

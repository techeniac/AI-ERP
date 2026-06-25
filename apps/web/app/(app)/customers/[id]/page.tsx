"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Globe, Mail, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { mockCustomers } from "@/lib/mock/customers";
import { mockInvoices } from "@/lib/mock/invoices";
import { mockTickets } from "@/lib/mock/tickets";
import { formatCurrencyCompact, formatDate } from "@/lib/utils/format";
import { TOKEN } from "@/lib/tokens";

function HealthScoreBar({ score }: { score: number }) {
  const color = score >= 80 ? TOKEN.success : score >= 60 ? TOKEN.warning : TOKEN.danger;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${score}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-semibold w-7 tabular-nums" style={{ color }}>{score}</span>
    </div>
  );
}

const MOCK_CONTACTS = [
  { name: "Rajesh Kumar", role: "CTO", email: "rajesh.kumar@customer.com", isPrimary: true },
  { name: "Sunita Sharma", role: "Finance Manager", email: "sunita.sharma@customer.com", isPrimary: false },
  { name: "Amit Verma", role: "IT Head", email: "amit.verma@customer.com", isPrimary: false },
];

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const customer = mockCustomers.find((c) => c.id === id);

  if (!customer) {
    return (
      <div className="p-6">
        <Link href="/customers" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Customers
        </Link>
        <EmptyState title="Customer not found" description="This customer may have been deleted or the ID is incorrect." />
      </div>
    );
  }

  const customerInvoices = mockInvoices.filter((inv) => inv.customerId === id);
  const customerTickets = mockTickets.filter((t) => t.customerName === customer.name || t.customerId === id);

  return (
    <div className="p-6 space-y-6">
      <div>
        <Link href="/customers" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-3">
          <ArrowLeft className="h-4 w-4" /> Customers
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarFallback className="bg-[var(--brand-navy)] text-white text-lg font-bold">
                {customer.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-bold">{customer.name}</h1>
              <p className="text-sm text-muted-foreground">{customer.industry} · {customer.country}</p>
            </div>
          </div>
          <StatusBadge status={customer.status} />
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total Invoiced", value: formatCurrencyCompact(customer.totalInvoiced) },
          { label: "Outstanding", value: formatCurrencyCompact(customer.outstandingBalance) },
          { label: "Avg Payment Days", value: `${customer.avgPaymentDays}d` },
          { label: "Health Score", value: `${customer.aiHealthScore}/100` },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-xl font-bold mt-1 tabular-nums">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="h-9">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="invoices">Invoices ({customerInvoices.length})</TabsTrigger>
          <TabsTrigger value="tickets">Tickets ({customerTickets.length})</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4 grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {[
                { label: "Account Manager", value: customer.accountManagerName },
                { label: "Credit Terms", value: `Net ${customer.creditTermsDays}` },
                { label: "Currency", value: customer.currency },
                { label: "Country", value: customer.country },
                { label: "Industry", value: customer.industry ?? "—" },
                { label: "Type", value: customer.type === "business" ? "Business" : "Individual" },
              ].map((row) => (
                <div key={row.label} className="flex justify-between">
                  <span className="text-muted-foreground text-xs">{row.label}</span>
                  <span className="text-xs font-medium">{row.value}</span>
                </div>
              ))}
              {customer.email && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                  <Mail className="h-3 w-3" /> {customer.email}
                </div>
              )}
              {customer.phone && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Phone className="h-3 w-3" /> {customer.phone}
                </div>
              )}
              {customer.website && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Globe className="h-3 w-3" /> {customer.website}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Health Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Overall</span>
                    <span className="font-bold">{customer.aiHealthScore}/100</span>
                  </div>
                  <HealthScoreBar score={customer.aiHealthScore} />
                </div>
                <p className="text-xs text-muted-foreground">
                  {customer.aiHealthScore >= 80
                    ? "Excellent account health. Low churn risk."
                    : customer.aiHealthScore >= 60
                    ? "Good health, some areas need attention."
                    : "At risk. Consider a proactive check-in."}
                </p>
                {customer.lastActivityDate && (
                  <p className="text-xs text-muted-foreground">
                    Last activity: {formatDate(customer.lastActivityDate)}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="mt-4">
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    {["Invoice #", "Date", "Due Date", "Total", "Status"].map((h) => (
                      <th key={h} className="h-10 px-4 text-left text-xs font-semibold text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {customerInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-sm text-muted-foreground">No invoices found</td>
                    </tr>
                  ) : (
                    customerInvoices.map((inv) => (
                      <tr key={inv.id} className="border-b hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs font-semibold">{inv.invoiceNumber}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(inv.invoiceDate)}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(inv.dueDate)}</td>
                        <td className="px-4 py-3 font-semibold tabular-nums text-xs">{formatCurrencyCompact(inv.total)}</td>
                        <td className="px-4 py-3"><StatusBadge status={inv.status} /></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="tickets" className="mt-4">
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    {["Ticket #", "Subject", "Priority", "Status", "Created"].map((h) => (
                      <th key={h} className="h-10 px-4 text-left text-xs font-semibold text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {customerTickets.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-sm text-muted-foreground">No tickets found</td>
                    </tr>
                  ) : (
                    customerTickets.map((t) => (
                      <tr key={t.id} className="border-b hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs font-semibold">{t.ticketNumber}</td>
                        <td className="px-4 py-3 text-xs max-w-[200px] truncate" title={t.subject}>{t.subject}</td>
                        <td className="px-4 py-3"><StatusBadge status={t.priority} /></td>
                        <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(t.createdAt)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="contacts" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MOCK_CONTACTS.map((contact) => (
              <Card key={contact.name}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-[var(--brand-teal)] text-white text-sm font-bold">
                        {contact.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm">{contact.name}</p>
                        {contact.isPrimary && (
                          <Badge className="text-xs px-1.5 py-0 bg-[var(--brand-navy)]/10 text-[var(--brand-navy)] border-0">Primary</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{contact.role}</p>
                      <p className="text-xs text-muted-foreground mt-1 truncate">{contact.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Download, Send, CheckCircle2, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { mockInvoices } from "@/lib/mock/invoices";
import { formatCurrencyCompact, formatDate } from "@/lib/utils/format";
import { toast } from "sonner";

export default function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const invoice = mockInvoices.find((inv) => inv.id === id);

  if (!invoice) {
    return (
      <div className="p-6">
        <Link href="/finance" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Finance
        </Link>
        <EmptyState title="Invoice not found" description="This invoice may have been deleted or the ID is incorrect." />
      </div>
    );
  }

  const isOverdue = invoice.status === "overdue";

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div>
        <Link href="/finance" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-3">
          <ArrowLeft className="h-4 w-4" /> Finance
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-sm text-muted-foreground">{invoice.invoiceNumber}</span>
              <StatusBadge status={invoice.status} />
              {isOverdue && (
                <span className="text-xs text-red-600 font-medium">
                  Overdue by {Math.max(0, Math.floor((Date.now() - new Date(invoice.dueDate).getTime()) / 86400000))} days
                </span>
              )}
            </div>
            <h1 className="text-xl font-bold">Invoice to {invoice.customerName}</h1>
          </div>
          <div className="flex gap-2 shrink-0 flex-wrap justify-end">
            <Button variant="outline" size="sm" className="gap-1.5 h-8">
              <Download className="h-3.5 w-3.5" /> Download PDF
            </Button>
            {invoice.status === "draft" && (
              <Button size="sm" className="bg-[var(--brand-navy)] hover:bg-[var(--brand-navy)]/90 text-white gap-1.5 h-8"
                onClick={() => toast.success("Invoice approved")}>
                <CheckCircle2 className="h-3.5 w-3.5" /> Approve
              </Button>
            )}
            {invoice.status === "approved" && (
              <Button size="sm" className="bg-[var(--brand-teal)] hover:bg-[var(--brand-teal)]/90 text-white gap-1.5 h-8"
                onClick={() => toast.success("Invoice sent to customer")}>
                <Send className="h-3.5 w-3.5" /> Send to Customer
              </Button>
            )}
            {(invoice.status === "sent" || invoice.status === "overdue") && (
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 h-8"
                onClick={() => toast.success("Payment recorded")}>
                <CreditCard className="h-3.5 w-3.5" /> Record Payment
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Invoice meta */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Bill To</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p className="font-semibold">{invoice.customerName}</p>
            {invoice.customerEmail && <p className="text-muted-foreground text-xs">{invoice.customerEmail}</p>}
            {invoice.customerAddress && <p className="text-muted-foreground text-xs leading-relaxed">{invoice.customerAddress}</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Invoice Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { label: "Invoice Date", value: formatDate(invoice.invoiceDate) },
              { label: "Due Date", value: formatDate(invoice.dueDate) },
              { label: "Currency", value: invoice.currency },
              { label: "Terms", value: invoice.terms ?? "Net 30" },
              { label: "Created By", value: invoice.createdByName },
            ].map((row) => (
              <div key={row.label} className="flex justify-between text-xs">
                <span className="text-muted-foreground">{row.label}</span>
                <span className="font-medium">{row.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Line items */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Line Items</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  {["Description", "Qty", "Unit Price", "Tax Rate", "Tax", "Total"].map((h) => (
                    <th key={h} className="h-9 px-4 text-left text-xs font-semibold text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {invoice.lines.map((line) => (
                  <tr key={line.id} className="border-b">
                    <td className="px-4 py-3 text-sm">{line.description}</td>
                    <td className="px-4 py-3 text-xs tabular-nums">{line.quantity}</td>
                    <td className="px-4 py-3 text-xs tabular-nums">{formatCurrencyCompact(line.unitPrice)}</td>
                    <td className="px-4 py-3 text-xs tabular-nums">{line.taxRate}%</td>
                    <td className="px-4 py-3 text-xs tabular-nums">{formatCurrencyCompact(line.taxAmount)}</td>
                    <td className="px-4 py-3 text-xs font-semibold tabular-nums">{formatCurrencyCompact(line.lineTotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="p-4 space-y-2 border-t">
            <div className="flex justify-end">
              <div className="w-56 space-y-2">
                {[
                  { label: "Subtotal", value: invoice.subtotal },
                  { label: "Tax", value: invoice.taxTotal },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{row.label}</span>
                    <span className="tabular-nums">{formatCurrencyCompact(row.value)}</span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between text-base font-bold">
                  <span>Total</span>
                  <span className="tabular-nums">{formatCurrencyCompact(invoice.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes / Bank Details */}
      {(invoice.notes || invoice.bankDetails) && (
        <div className="grid gap-4 md:grid-cols-2">
          {invoice.notes && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{invoice.notes}</p>
              </CardContent>
            </Card>
          )}
          {invoice.bankDetails && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Bank Details</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-mono text-muted-foreground">{invoice.bankDetails}</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

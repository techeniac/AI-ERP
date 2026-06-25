"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { mockPurchaseRequests } from "@/lib/mock/purchase-requests";
import { mockVendors } from "@/lib/mock/vendors";
import { formatCurrencyCompact, formatDate, formatRelative } from "@/lib/utils/format";
import type { PRStatus } from "@/lib/types";
import Link from "next/link";

const PR_STATUSES: { value: PRStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "draft", label: "Draft" },
  { value: "submitted", label: "Submitted" },
  { value: "pending", label: "Pending Approval" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "converted", label: "Converted to PO" },
];

export default function ProcurementPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: prs } = useQuery({
    queryKey: ["purchase-requests"],
    queryFn: () => mockPurchaseRequests,
  });

  const { data: vendors } = useQuery({
    queryKey: ["vendors"],
    queryFn: () => mockVendors,
  });

  const filteredPRs = (prs ?? []).filter((pr) => {
    const matchSearch =
      !search ||
      pr.title.toLowerCase().includes(search.toLowerCase()) ||
      pr.prNumber.toLowerCase().includes(search.toLowerCase()) ||
      pr.requestorName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || pr.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPending = (prs ?? [])
    .filter((p) => p.status === "pending")
    .reduce((s, p) => s + p.totalAmount, 0);

  const totalApproved = (prs ?? [])
    .filter((p) => p.status === "approved")
    .reduce((s, p) => s + p.totalAmount, 0);

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Procurement"
        description="Purchase requests, vendor management and spend control"
        actions={
          <Button className="bg-[var(--brand-navy)] hover:bg-[var(--brand-navy)]/90 text-white gap-2">
            <Plus className="h-4 w-4" />
            New Purchase Request
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total PRs", value: (prs ?? []).length.toString() },
          { label: "Pending Approval", value: formatCurrencyCompact(totalPending) },
          { label: "Approved Spend", value: formatCurrencyCompact(totalApproved) },
          { label: "Active Vendors", value: (vendors ?? []).filter((v) => v.status === "active").length.toString() },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="text-xl font-bold mt-1">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="purchase-requests">
        <TabsList className="h-9">
          <TabsTrigger value="purchase-requests">Purchase Requests</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
        </TabsList>

        <TabsContent value="purchase-requests" className="mt-4 space-y-4">
          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search purchase requests…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-44 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PR_STATUSES.map((s) => (
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
                    {["PR Number", "Title", "Requestor", "Department", "Amount", "Status", "Required By", "Created"].map((h) => (
                      <th key={h} className="h-10 px-4 text-left text-xs font-semibold text-muted-foreground">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredPRs.map((pr) => (
                    <tr key={pr.id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs font-semibold">{pr.prNumber}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium">{pr.title}</p>
                        {pr.description && (
                          <p className="text-xs text-muted-foreground truncate max-w-[200px]">{pr.description}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{pr.requestorName}</td>
                      <td className="px-4 py-3 text-muted-foreground">{pr.department}</td>
                      <td className="px-4 py-3 font-semibold tabular-nums">{formatCurrencyCompact(pr.totalAmount)}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={pr.status} />
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{formatDate(pr.requiredBy ?? null)}</td>
                      <td className="px-4 py-3 text-muted-foreground">{formatRelative(pr.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredPRs.length === 0 && (
                <div className="py-12">
                  <EmptyState
                    title="No purchase requests"
                    description="Try adjusting your filters"
                    icon={<ShoppingCart className="h-8 w-8" />}
                  />
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="vendors" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(vendors ?? []).map((vendor) => (
              <Card key={vendor.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold truncate">{vendor.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{vendor.category}</p>
                    </div>
                    <StatusBadge status={vendor.status} />
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-muted-foreground">Total Spend</p>
                      <p className="font-semibold">{formatCurrencyCompact(vendor.totalSpend ?? 0)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Payment Terms</p>
                      <p className="font-semibold">{vendor.paymentTerms ?? "—"}</p>
                    </div>
                  </div>
                  {vendor.rating != null && (
                    <div className="mt-2 flex items-center gap-1">
                      {"★".repeat(Math.round(vendor.rating))}{"☆".repeat(5 - Math.round(vendor.rating))}
                      <span className="text-xs text-muted-foreground ml-1">{vendor.rating.toFixed(1)}/5</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

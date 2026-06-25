"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, Building2, Mail, Phone, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { mockCustomers } from "@/lib/mock/customers";
import { formatCurrencyCompact, formatDate, formatNumber } from "@/lib/utils/format";
import { TOKEN } from "@/lib/tokens";
import type { CustomerStatus } from "@/lib/types";
import Link from "next/link";

const STATUS_FILTERS: { value: CustomerStatus | "all"; label: string }[] = [
  { value: "all", label: "All Customers" },
  { value: "active", label: "Active" },
  { value: "prospect", label: "Prospect" },
  { value: "inactive", label: "Inactive" },
  { value: "churned", label: "Churned" },
];

function HealthScoreBar({ score }: { score: number }) {
  const color = score >= 80 ? TOKEN.success : score >= 60 ? TOKEN.warning : TOKEN.danger;
  const label = score >= 80 ? "Good" : score >= 60 ? "Fair" : "Poor";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-xs font-semibold tabular-nums w-7" style={{ color }}>
        {score}
      </span>
      <span className="sr-only">{label}</span>
    </div>
  );
}

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: customers } = useQuery({
    queryKey: ["customers"],
    queryFn: () => mockCustomers,
  });

  const filtered = (customers ?? []).filter((c) => {
    const matchSearch =
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.industry?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalRevenue = (customers ?? []).reduce((s, c) => s + (c.totalInvoiced ?? 0), 0);
  const activeCount = (customers ?? []).filter((c) => c.status === "active").length;
  const avgHealth = Math.round(
    (customers ?? []).reduce((s, c) => s + (c.aiHealthScore ?? 0), 0) /
      Math.max((customers ?? []).length, 1)
  );

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Customers"
        description="Manage your customer accounts and relationships"
        actions={
          <Button className="bg-[var(--brand-navy)] hover:bg-[var(--brand-navy)]/90 text-white gap-2">
            <Plus className="h-4 w-4" />
            Add Customer
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total Customers", value: (customers ?? []).length.toString() },
          { label: "Active", value: activeCount.toString() },
          { label: "Total Revenue", value: formatCurrencyCompact(totalRevenue) },
          { label: "Avg Health Score", value: `${avgHealth}/100` },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="text-xl font-bold mt-1">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search customers…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-44 h-9">
            <SelectValue placeholder="All customers" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_FILTERS.map((s) => (
              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Customer grid */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No customers found"
          description="Try adjusting your search or filters"
          icon={<Building2 className="h-8 w-8" />}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((customer) => (
            <Link key={customer.id} href={`/customers/${customer.id}`}>
              <Card className="cursor-pointer hover:shadow-md hover:border-[var(--brand-teal)]/50 transition-all h-full">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarFallback className="bg-[var(--brand-navy)] text-white text-xs font-bold">
                        {customer.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm truncate" title={customer.name}>{customer.name}</p>
                      <p className="text-xs text-muted-foreground truncate" title={customer.industry ?? ""}>{customer.industry}</p>
                    </div>
                    <StatusBadge status={customer.status} />
                  </div>

                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">Health Score</span>
                    </div>
                    <HealthScoreBar score={customer.aiHealthScore} />
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-muted-foreground">Invoiced</p>
                      <p className="font-semibold">{formatCurrencyCompact(customer.totalInvoiced ?? 0)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Outstanding</p>
                      <p className="font-semibold">{formatCurrencyCompact(customer.outstandingBalance ?? 0)}</p>
                    </div>
                  </div>

                  {customer.country && (
                    <p className="mt-2 text-xs text-muted-foreground truncate" title={customer.country}>
                      {customer.country}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

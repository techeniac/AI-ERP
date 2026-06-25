"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, Filter, TrendingUp, Phone, Mail, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { mockLeads } from "@/lib/mock/leads";
import { pipelineStageData } from "@/lib/mock/dashboard-kpis";
import { formatCurrencyCompact, formatRelative, formatDate } from "@/lib/utils/format";
import { TOKEN } from "@/lib/tokens";
import type { Lead, LeadStatus } from "@/lib/types";
import Link from "next/link";

const STAGES: { value: LeadStatus | "all"; label: string }[] = [
  { value: "all", label: "All Stages" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "proposal", label: "Proposal" },
  { value: "negotiation", label: "Negotiation" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
];

const STAGE_COLORS: Record<string, string> = {
  new: TOKEN.neutral,
  contacted: TOKEN.info,
  qualified: TOKEN.purple,
  proposal: TOKEN.warning,
  negotiation: TOKEN.teal,
  won: TOKEN.success,
  lost: TOKEN.danger,
};

function KanbanColumn({ stage, leads }: { stage: string; leads: Lead[] }) {
  const total = leads.reduce((s, l) => s + (l.estimatedValue ?? 0), 0);
  const color = STAGE_COLORS[stage.toLowerCase()] ?? "#6b7280";

  return (
    <div className="flex-1 min-w-[220px] max-w-[280px]">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
          <span className="text-sm font-semibold capitalize">{stage}</span>
          <Badge variant="outline" className="h-5 text-xs px-1.5">{leads.length}</Badge>
        </div>
        <span className="text-xs font-medium text-muted-foreground">{formatCurrencyCompact(total)}</span>
      </div>
      <div className="space-y-2 min-h-[80px]">
        {leads.map((lead) => (
          <Link key={lead.id} href={`/crm/${lead.id}`}>
            <Card className="cursor-pointer hover:shadow-md transition-shadow hover:border-[var(--brand-teal)]/50">
              <CardContent className="p-3">
                <p className="text-sm font-semibold truncate" title={lead.company}>{lead.company}</p>
                <p className="text-xs text-muted-foreground truncate mt-0.5" title={lead.contactName}>{lead.contactName}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs font-bold text-[var(--brand-teal)]">
                    {formatCurrencyCompact(lead.estimatedValue ?? 0)}
                  </span>
                  <span className="text-xs text-muted-foreground">{lead.ownerName.split(" ")[0]}</span>
                </div>
                {lead.expectedCloseDate && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Close: {formatDate(lead.expectedCloseDate)}
                  </p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function CRMPage() {
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState<string>("all");

  const { data: leads } = useQuery({
    queryKey: ["leads"],
    queryFn: () => mockLeads,
  });

  const filtered = (leads ?? []).filter((l) => {
    const matchSearch =
      !search ||
      l.company.toLowerCase().includes(search.toLowerCase()) ||
      l.contactName.toLowerCase().includes(search.toLowerCase());
    const matchStage = stageFilter === "all" || l.status === stageFilter;
    return matchSearch && matchStage;
  });

  const byStage = STAGES.filter((s) => s.value !== "all").reduce<Record<string, Lead[]>>((acc, s) => {
    acc[s.value] = filtered.filter((l) => l.status === s.value);
    return acc;
  }, {});

  const pipelineValue = (leads ?? [])
    .filter((l) => !["won", "lost"].includes(l.status))
    .reduce((s, l) => s + (l.estimatedValue ?? 0), 0);

  const wonValue = (leads ?? [])
    .filter((l) => l.status === "won")
    .reduce((s, l) => s + (l.estimatedValue ?? 0), 0);

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="CRM: Sales Pipeline"
        description="Track leads from first contact to closed deal"
        actions={
          <Button className="bg-[var(--brand-navy)] hover:bg-[var(--brand-navy)]/90 text-white gap-2">
            <Plus className="h-4 w-4" />
            Add Lead
          </Button>
        }
      />

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total Leads", value: (leads ?? []).length, suffix: "" },
          { label: "Pipeline Value", value: formatCurrencyCompact(pipelineValue), suffix: "" },
          { label: "Won This Quarter", value: formatCurrencyCompact(wonValue), suffix: "" },
          { label: "Win Rate", value: `${(((leads ?? []).filter((l) => l.status === "won").length / Math.max((leads ?? []).filter((l) => ["won", "lost"].includes(l.status)).length, 1)) * 100).toFixed(0)}%`, suffix: "" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="text-xl font-bold mt-1 text-foreground tabular-nums">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search leads…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <Select value={stageFilter} onValueChange={setStageFilter}>
          <SelectTrigger className="w-40 h-9">
            <SelectValue placeholder="All stages" />
          </SelectTrigger>
          <SelectContent>
            {STAGES.map((s) => (
              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex rounded-md border overflow-hidden">
          <button
            onClick={() => setView("kanban")}
            className={`px-3 py-1.5 text-sm font-medium transition-colors ${view === "kanban" ? "bg-[var(--brand-navy)] text-white" : "bg-background text-muted-foreground hover:bg-muted"}`}
          >
            Kanban
          </button>
          <button
            onClick={() => setView("list")}
            className={`px-3 py-1.5 text-sm font-medium transition-colors ${view === "list" ? "bg-[var(--brand-navy)] text-white" : "bg-background text-muted-foreground hover:bg-muted"}`}
          >
            List
          </button>
        </div>
      </div>

      {view === "kanban" ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {STAGES.filter((s) => s.value !== "all").map((s) => (
            <KanbanColumn key={s.value} stage={s.value} leads={byStage[s.value] ?? []} />
          ))}
        </div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  {["Company", "Contact", "Stage", "Value", "Source", "Owner", "Expected Close", "Last Updated"].map((h) => (
                    <th key={h} className="h-10 px-4 text-left text-xs font-semibold text-muted-foreground">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b hover:bg-muted/30 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3">
                      <Link href={`/crm/${lead.id}`} className="font-semibold hover:text-[var(--brand-teal)]">
                        {lead.company}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{lead.contactName}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={lead.status} />
                    </td>
                    <td className="px-4 py-3 font-semibold tabular-nums">
                      {formatCurrencyCompact(lead.estimatedValue ?? 0)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground capitalize">{lead.source?.replace("_", " ")}</td>
                    <td className="px-4 py-3 text-muted-foreground">{lead.ownerName}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(lead.expectedCloseDate ?? null)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatRelative(lead.updatedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-12">
                <EmptyState
                  title="No leads found"
                  description="Try adjusting your search or filters"
                  icon={<TrendingUp className="h-8 w-8" />}
                />
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}

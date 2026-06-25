"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Phone, Mail, UserPlus, CheckCircle2, Users, StickyNote, ArrowRightLeft, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { mockLeads } from "@/lib/mock/leads";
import { formatCurrencyCompact, formatDate, formatRelative } from "@/lib/utils/format";
import { toast } from "sonner";
import { TOKEN } from "@/lib/tokens";

const ACTIVITY_ICONS: Record<string, React.ReactNode> = {
  call: <Phone className="h-3 w-3" />,
  email: <Mail className="h-3 w-3" />,
  meeting: <Users className="h-3 w-3" />,
  note: <StickyNote className="h-3 w-3" />,
  stage_change: <ArrowRightLeft className="h-3 w-3" />,
  created: <Plus className="h-3 w-3" />,
};

export default function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const lead = mockLeads.find((l) => l.id === id);
  const [convertOpen, setConvertOpen] = useState(false);
  const [converted, setConverted] = useState(false);

  if (!lead) {
    return (
      <div className="p-6">
        <Link href="/crm" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> CRM
        </Link>
        <EmptyState title="Lead not found" description="This lead may have been deleted or the ID is incorrect." />
      </div>
    );
  }

  const scoreColor = lead.aiScore >= 70 ? TOKEN.success : lead.aiScore >= 50 ? TOKEN.warning : TOKEN.danger;
  const scoreDash = (lead.aiScore / 100) * 251;

  const MOCK_ACTIVITIES = [
    { type: "call", description: `Introductory call with ${lead.contactName}. Discussed pain points in current ERP system.`, date: lead.createdAt },
    { type: "email", description: "Sent product overview deck and pricing proposal.", date: lead.updatedAt },
    { type: "meeting", description: `Product demo scheduled. ${lead.contactName} brought in 2 IT team members.`, date: lead.expectedCloseDate ?? lead.updatedAt },
    { type: "note", description: "Decision expected within 2 weeks. Budget approved at AED 180K. Key concern: data migration timeline.", date: lead.updatedAt },
  ].filter((_, i) => i < 3);

  return (
    <div className="p-6 space-y-6">
      <div>
        <Link href="/crm" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-3">
          <ArrowLeft className="h-4 w-4" /> CRM: Sales Pipeline
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{lead.company}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {lead.contactName} · {lead.email}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <StatusBadge status={lead.status} />
            {converted ? (
              <div className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium">
                <CheckCircle2 className="h-4 w-4" />
                Converted to Customer
              </div>
            ) : (
              <Button
                variant="outline"
                className="h-8 text-sm gap-1.5 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                onClick={() => setConvertOpen(true)}
              >
                <UserPlus className="h-3.5 w-3.5" />
                Convert to Customer
              </Button>
            )}
            <Button className="bg-[var(--brand-navy)] hover:bg-[var(--brand-navy)]/90 text-white h-8 text-sm">
              Edit Lead
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* Main content */}
        <div className="space-y-4">
          {/* AI Score Breakdown */}
          {lead.aiScoreBreakdown && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">AI Score Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(lead.aiScoreBreakdown).map(([key, val]) => (
                  <div key={key} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                      <span className="font-semibold">{val}/100</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[var(--brand-teal)] transition-all"
                        style={{ width: `${val}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Description */}
          {lead.description && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{lead.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Activity Timeline */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative pl-6 space-y-4">
                <div className="absolute left-2 top-1 bottom-1 w-px bg-border" />
                {MOCK_ACTIVITIES.map((act, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-4 flex h-5 w-5 items-center justify-center rounded-full bg-background border-2 border-[var(--brand-teal)] text-[var(--brand-teal)]">
                      {ACTIVITY_ICONS[act.type] ?? <span className="h-2 w-2 rounded-full bg-[var(--brand-teal)]" />}
                    </div>
                    <div className="ml-2">
                      <p className="text-sm">{act.description}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{formatRelative(act.date)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="mt-4 w-full text-xs">
                Log Activity
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* AI Score gauge */}
          <Card>
            <CardContent className="p-5 flex flex-col items-center">
              <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wide">AI Lead Score</p>
              <div className="relative">
                <svg viewBox="0 0 100 100" className="h-28 w-28 -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--border)" strokeWidth="12" />
                  <circle
                    cx="50" cy="50" r="40"
                    fill="transparent"
                    stroke={scoreColor}
                    strokeWidth="12"
                    strokeDasharray={`${scoreDash} ${251 - scoreDash}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-bold" style={{ color: scoreColor }}>{lead.aiScore}</p>
                    <p className="text-xs text-muted-foreground">/100</p>
                    <p className="text-xs font-medium mt-0.5" style={{ color: scoreColor }}>
                      {lead.aiScore >= 70 ? "Strong" : lead.aiScore >= 50 ? "Fair" : "Weak"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Facts */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Lead Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "Owner", value: lead.ownerName },
                { label: "Source", value: lead.source.replace("_", " ") },
                { label: "Value", value: formatCurrencyCompact(lead.estimatedValue) },
                { label: "Expected Close", value: formatDate(lead.expectedCloseDate ?? null) },
                { label: "Days in Stage", value: `${lead.daysInStage} days` },
                { label: "Industry", value: lead.industry ?? "—" },
                { label: "Phone", value: lead.phone ?? "—" },
              ].map((row) => (
                <div key={row.label} className="flex items-start justify-between gap-2">
                  <span className="text-xs text-muted-foreground">{row.label}</span>
                  <span className="text-xs font-medium text-right capitalize">{row.value}</span>
                </div>
              ))}

              {lead.tags && lead.tags.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground mb-1.5">Tags</p>
                    <div className="flex flex-wrap gap-1">
                      {lead.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs">
              <Mail className="h-3.5 w-3.5" /> Email
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs">
              <Phone className="h-3.5 w-3.5" /> Call
            </Button>
          </div>
        </div>
      </div>

      {/* Convert to Customer Dialog */}
      <Dialog open={convertOpen} onOpenChange={setConvertOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Convert Lead to Customer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              The following customer account will be created from this lead. You can edit details after conversion.
            </p>
            <div className="rounded-lg border bg-muted/30 p-4 space-y-3 text-sm">
              {[
                { label: "Company Name", value: lead.company },
                { label: "Contact Name", value: lead.contactName },
                { label: "Email", value: lead.email },
                { label: "Phone", value: lead.phone ?? "—" },
                { label: "Industry", value: lead.industry ?? "—" },
                { label: "Currency", value: lead.currency ?? "AED" },
                { label: "Credit Terms", value: "Net 30" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">{row.label}</span>
                  <span className="font-medium text-right">{row.value}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              This lead will be marked as <strong>Won</strong> and linked to the new customer account.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConvertOpen(false)}>Cancel</Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
              onClick={() => {
                setConvertOpen(false);
                setConverted(true);
                toast.success(`${lead.company} converted to customer`, {
                  description: "View in the Customers module",
                  action: { label: "View Customers", onClick: () => {} },
                });
              }}
            >
              <CheckCircle2 className="h-4 w-4" />
              Confirm Conversion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

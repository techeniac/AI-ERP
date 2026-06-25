"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { mockPlatformOrgs, type OrgPlan, type OrgStatus, type PlatformOrg } from "@/lib/mock/platform";
import { formatCurrencyCompact, formatDate, formatRelative } from "@/lib/utils/format";
import { toast } from "sonner";
import Link from "next/link";

const planColor: Record<OrgPlan, string> = {
  starter: "bg-gray-100 text-gray-700",
  growth: "bg-blue-100 text-blue-700",
  enterprise: "bg-purple-100 text-purple-700",
};
const statusColor: Record<OrgStatus, string> = {
  active: "bg-emerald-100 text-emerald-700",
  trial: "bg-amber-100 text-amber-700",
  suspended: "bg-red-100 text-red-700",
  churned: "bg-gray-100 text-gray-500",
};

export default function OrganizationsPage() {
  const { data: orgs } = useQuery({ queryKey: ["platform-orgs"], queryFn: () => mockPlatformOrgs });
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState<OrgPlan | "all">("all");
  const [statusFilter, setStatusFilter] = useState<OrgStatus | "all">("all");

  const [extraOrgs, setExtraOrgs] = useState<PlatformOrg[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formPlan, setFormPlan] = useState<OrgPlan>("starter");
  const [formIndustry, setFormIndustry] = useState("");
  const [formCountry, setFormCountry] = useState("United Arab Emirates");
  const [formEmail, setFormEmail] = useState("");

  const derivedSlug = formName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  function handleCreate() {
    if (!formName.trim() || !formEmail.trim()) return;
    const now = new Date().toISOString();
    const newOrg: PlatformOrg = {
      id: `org-${Date.now()}`,
      name: formName.trim(),
      slug: derivedSlug,
      plan: formPlan,
      status: "trial",
      industry: formIndustry.trim() || "Other",
      country: formCountry.trim() || "United Arab Emirates",
      adminEmail: formEmail.trim(),
      userCount: 1,
      mrr: 0,
      storageUsedMb: 0,
      modules: ["dashboard", "crm", "finance", "support"],
      createdAt: now,
      trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      lastActiveAt: now,
    };
    setExtraOrgs((prev) => [newOrg, ...prev]);
    setCreateOpen(false);
    setFormName("");
    setFormPlan("starter");
    setFormIndustry("");
    setFormCountry("United Arab Emirates");
    setFormEmail("");
    toast.success("Organisation created");
  }

  const allOrgs = [...extraOrgs, ...(orgs ?? [])];
  const filtered = allOrgs.filter((o) => {
    const matchSearch = !search || o.name.toLowerCase().includes(search.toLowerCase()) || o.slug.includes(search.toLowerCase());
    const matchPlan = planFilter === "all" || o.plan === planFilter;
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchPlan && matchStatus;
  });

  const kpis = [
    { label: "Total", value: allOrgs.length },
    { label: "Active", value: allOrgs.filter((o) => o.status === "active").length },
    { label: "Trial", value: allOrgs.filter((o) => o.status === "trial").length },
    { label: "Suspended", value: allOrgs.filter((o) => o.status === "suspended").length },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Organizations</h1>
          <p className="text-sm text-muted-foreground mt-1">All tenant organisations on the platform</p>
        </div>
        <Button
          className="bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5"
          onClick={() => setCreateOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Create Organisation
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {kpis.map((k) => (
          <Card key={k.label}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{k.label}</p>
              <p className="text-2xl font-bold mt-1">{k.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search organisations…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9" />
        </div>
        <Select value={planFilter} onValueChange={(v) => setPlanFilter(v as OrgPlan | "all")}>
          <SelectTrigger className="w-40 h-9"><SelectValue placeholder="All Plans" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Plans</SelectItem>
            <SelectItem value="starter">Starter</SelectItem>
            <SelectItem value="growth">Growth</SelectItem>
            <SelectItem value="enterprise">Enterprise</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as OrgStatus | "all")}>
          <SelectTrigger className="w-40 h-9"><SelectValue placeholder="All Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="trial">Trial</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
            <SelectItem value="churned">Churned</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                {["Organisation", "Plan", "Status", "Users", "MRR", "Industry", "Country", "Created", "Last Active", ""].map((h) => (
                  <th key={h} className="h-10 px-4 text-left text-xs font-semibold text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((org) => (
                <tr key={org.id} className="border-b hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium">{org.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{org.slug}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${planColor[org.plan]}`}>{org.plan}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusColor[org.status]}`}>{org.status}</span>
                  </td>
                  <td className="px-4 py-3 tabular-nums">{org.userCount}</td>
                  <td className="px-4 py-3 font-semibold tabular-nums">{org.mrr > 0 ? formatCurrencyCompact(org.mrr) : "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{org.industry}</td>
                  <td className="px-4 py-3 text-muted-foreground">{org.country}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{formatDate(org.createdAt)}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{formatRelative(org.lastActiveAt)}</td>
                  <td className="px-4 py-3">
                    <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
                      <Link href={`/platform/organizations/${org.id}`}>View</Link>
                    </Button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={10} className="px-4 py-10 text-center text-sm text-muted-foreground">No organisations match the current filters</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Organisation</DialogTitle>
          </DialogHeader>
          <div className="py-3 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="org-name">Organisation Name <span className="text-red-500">*</span></Label>
              <Input
                id="org-name"
                placeholder="e.g. Acme Corp"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
              {formName && (
                <p className="text-xs text-muted-foreground font-mono">Slug: {derivedSlug}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="org-plan">Plan</Label>
              <Select value={formPlan} onValueChange={(v) => setFormPlan(v as OrgPlan)}>
                <SelectTrigger id="org-plan" className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="starter">Starter</SelectItem>
                  <SelectItem value="growth">Growth</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="org-industry">Industry</Label>
              <Input
                id="org-industry"
                placeholder="e.g. Food Technology"
                value={formIndustry}
                onChange={(e) => setFormIndustry(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="org-country">Country</Label>
              <Input
                id="org-country"
                placeholder="e.g. United Arab Emirates"
                value={formCountry}
                onChange={(e) => setFormCountry(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="org-email">Admin Email <span className="text-red-500">*</span></Label>
              <Input
                id="org-email"
                type="email"
                placeholder="admin@company.com"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={handleCreate}
              disabled={!formName.trim() || !formEmail.trim()}
            >
              Create Organisation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

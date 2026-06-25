"use client";

import { use, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Building2, Users, CreditCard, HardDrive } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { mockPlatformOrgs, mockPlatformUsers, type OrgPlan, type OrgStatus } from "@/lib/mock/platform";
import { formatCurrencyCompact, formatDate, formatDateTime, formatRelative } from "@/lib/utils/format";
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
const userStatusColor: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700",
  inactive: "bg-gray-100 text-gray-500",
  invited: "bg-blue-100 text-blue-700",
};

export default function OrgDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: orgs } = useQuery({ queryKey: ["platform-orgs"], queryFn: () => mockPlatformOrgs });
  const { data: users } = useQuery({ queryKey: ["platform-users"], queryFn: () => mockPlatformUsers });

  const org = orgs?.find((o) => o.id === id);
  const orgUsers = users?.filter((u) => u.orgId === id) ?? [];

  const [localStatus, setLocalStatus] = useState<OrgStatus | undefined>(undefined);
  const [localPlan, setLocalPlan] = useState<OrgPlan | undefined>(undefined);
  const [suspendOpen, setSuspendOpen] = useState(false);
  const [planOpen, setPlanOpen] = useState(false);
  const [newPlan, setNewPlan] = useState<OrgPlan>("starter");

  const effectiveStatus: OrgStatus = localStatus ?? org?.status ?? "active";
  const effectivePlan: OrgPlan = localPlan ?? org?.plan ?? "starter";

  if (!org) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Organisation not found</p>
        <Button variant="ghost" className="mt-4" asChild>
          <Link href="/platform/organizations"><ArrowLeft className="mr-2 h-4 w-4" />Back</Link>
        </Button>
      </div>
    );
  }

  const storagePct = Math.min(100, (org.storageUsedMb / (effectivePlan === "enterprise" ? 51200 : effectivePlan === "growth" ? 20480 : 5120)) * 100);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/platform/organizations"><ArrowLeft className="h-4 w-4 mr-1" />Organizations</Link>
        </Button>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{org.name}</h1>
          <p className="text-sm text-muted-foreground font-mono mt-0.5">{org.slug} · {org.id}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${planColor[effectivePlan]}`}>{effectivePlan}</span>
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusColor[effectiveStatus]}`}>{effectiveStatus}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => { setNewPlan(effectivePlan); setPlanOpen(true); }}
          >
            Change Plan
          </Button>
          {effectiveStatus === "suspended" ? (
            <Button
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => { setLocalStatus("active"); toast.success("Organisation reactivated"); }}
            >
              Reactivate
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="border-red-200 text-red-600 hover:bg-red-50"
              onClick={() => setSuspendOpen(true)}
            >
              Suspend Org
            </Button>
          )}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground">Users</p>
              <Users className="h-4 w-4 text-indigo-500" />
            </div>
            <p className="text-2xl font-bold">{org.userCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground">MRR</p>
              <CreditCard className="h-4 w-4 text-indigo-500" />
            </div>
            <p className="text-2xl font-bold">{org.mrr > 0 ? formatCurrencyCompact(org.mrr) : "—"}</p>
            <p className="text-xs text-muted-foreground mt-0.5">monthly</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground">Storage Used</p>
              <HardDrive className="h-4 w-4 text-indigo-500" />
            </div>
            <p className="text-2xl font-bold">{org.storageUsedMb >= 1024 ? `${(org.storageUsedMb / 1024).toFixed(1)} GB` : `${org.storageUsedMb} MB`}</p>
            <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-indigo-500" style={{ width: `${storagePct}%` }} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground">Last Active</p>
              <Building2 className="h-4 w-4 text-indigo-500" />
            </div>
            <p className="text-base font-semibold">{formatRelative(org.lastActiveAt)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Org Details */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Organisation Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {[
              ["Industry", org.industry],
              ["Country", org.country],
              ["Admin Email", org.adminEmail],
              ["Created", formatDateTime(org.createdAt)],
              [org.trialEndsAt ? "Trial Ends" : null, org.trialEndsAt ? formatDate(org.trialEndsAt) : null],
              ["Modules", org.modules.length + " enabled"],
            ].filter(([k]) => k !== null).map(([k, v]) => (
              <div key={k as string} className="flex justify-between items-start border-b pb-2 last:border-0 last:pb-0">
                <span className="text-muted-foreground">{k}</span>
                <span className="font-medium text-right">{v}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Modules */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Enabled Modules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1.5">
              {org.modules.map((m) => (
                <Badge key={m} variant="secondary" className="text-xs capitalize">{m}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Users ({orgUsers.length})</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                {["Name", "Email", "Role", "Status", "Last Login", "Member Since"].map((h) => (
                  <th key={h} className="h-9 px-4 text-left text-xs font-semibold text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orgUsers.map((u) => (
                <tr key={u.id} className="border-b hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-2.5 font-medium">{u.name}</td>
                  <td className="px-4 py-2.5 text-muted-foreground text-xs">{u.email}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{u.role}</td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${userStatusColor[u.status]}`}>{u.status}</span>
                  </td>
                  <td className="px-4 py-2.5 text-xs text-muted-foreground">{formatRelative(u.lastLoginAt)}</td>
                  <td className="px-4 py-2.5 text-xs text-muted-foreground">{formatDate(u.createdAt)}</td>
                </tr>
              ))}
              {orgUsers.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">No users found for this organisation</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Suspend confirmation */}
      <Dialog open={suspendOpen} onOpenChange={setSuspendOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Suspend Organisation</DialogTitle>
          </DialogHeader>
          <div className="py-3 space-y-3">
            <p className="text-sm text-muted-foreground">
              Suspending <strong>{org.name}</strong> will immediately prevent all users from logging in. Billing continues until the subscription is cancelled.
            </p>
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
              This action affects <strong>{org.userCount} users</strong>. They will see an &ldquo;Account suspended&rdquo; message on login.
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSuspendOpen(false)}>Cancel</Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => {
                setLocalStatus("suspended");
                setSuspendOpen(false);
                toast.success(`${org.name} has been suspended`);
              }}
            >
              Confirm Suspension
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change plan */}
      <Dialog open={planOpen} onOpenChange={setPlanOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Change Plan</DialogTitle>
          </DialogHeader>
          <div className="py-3 space-y-3">
            <p className="text-sm text-muted-foreground">Current plan: <strong className="capitalize">{effectivePlan}</strong></p>
            <div className="grid gap-2">
              {(["starter", "growth", "enterprise"] as OrgPlan[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setNewPlan(p)}
                  className={`flex items-center justify-between rounded-lg border p-3 text-left transition-colors ${newPlan === p ? "border-indigo-500 bg-indigo-50" : "border-border hover:bg-muted/50"}`}
                >
                  <div>
                    <p className="text-sm font-medium capitalize">{p}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {p === "starter"
                        ? "Core modules, up to 10 users, 5 GB storage"
                        : p === "growth"
                        ? "All modules, up to 50 users, 20 GB storage, AI features"
                        : "Unlimited users, 50 GB storage, AI features, priority support"}
                    </p>
                  </div>
                  {newPlan === p && <div className="h-4 w-4 rounded-full bg-indigo-600 shrink-0" />}
                </button>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPlanOpen(false)}>Cancel</Button>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={() => {
                setLocalPlan(newPlan);
                setPlanOpen(false);
                toast.success(`Plan changed to ${newPlan}`);
              }}
            >
              Confirm Plan Change
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

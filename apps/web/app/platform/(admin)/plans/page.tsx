"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CreditCard, Users, HardDrive, Pencil, Check, X, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  mockSubscriptionPlans,
  mockPlatformOrgs,
  ALL_MODULES,
  type SubscriptionPlan,
  type ModuleKey,
} from "@/lib/mock/platform";
import { toast } from "sonner";

const PLAN_COLORS: Record<SubscriptionPlan["color"], string> = {
  slate:  "border-slate-200  bg-slate-50  text-slate-700",
  blue:   "border-blue-200   bg-blue-50   text-blue-700",
  indigo: "border-indigo-200 bg-indigo-50 text-indigo-700",
};

const PLAN_HEADER_COLORS: Record<SubscriptionPlan["color"], string> = {
  slate:  "bg-slate-100  text-slate-800",
  blue:   "bg-blue-100   text-blue-800",
  indigo: "bg-indigo-100 text-indigo-800",
};

const PLAN_BADGE_COLORS: Record<SubscriptionPlan["color"], string> = {
  slate:  "bg-slate-200  text-slate-700",
  blue:   "bg-blue-200   text-blue-700",
  indigo: "bg-indigo-200 text-indigo-700",
};

function formatLimit(val: number, unit: string) {
  return val === -1 ? "Unlimited" : `${val.toLocaleString()} ${unit}`;
}

function formatPrice(aed: number) {
  return aed === 0 ? "Free" : `AED ${aed.toLocaleString()}/mo`;
}

export default function PlansPage() {
  const { data: plans = [] } = useQuery({
    queryKey: ["platform", "plans"],
    queryFn: () => mockSubscriptionPlans,
  });

  const { data: orgs = [] } = useQuery({
    queryKey: ["platform", "orgs"],
    queryFn: () => mockPlatformOrgs,
  });

  const [planOverrides, setPlanOverrides] = useState<Record<string, Partial<SubscriptionPlan>>>({});
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);

  function getMergedPlan(p: SubscriptionPlan): SubscriptionPlan {
    return { ...p, ...(planOverrides[p.id] ?? {}) };
  }

  function getSubscriberCount(slug: string) {
    return orgs.filter((o) => o.plan === slug && o.status !== "churned").length;
  }

  function getMRR(slug: string) {
    return orgs.filter((o) => o.plan === slug).reduce((sum, o) => sum + o.mrr, 0);
  }

  function handleSave(updated: SubscriptionPlan) {
    setPlanOverrides((prev) => ({ ...prev, [updated.id]: updated }));
    setEditingPlan(null);
    toast.success(`${updated.name} plan updated`);
  }

  const merged = plans.map(getMergedPlan);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100">
          <Package className="h-5 w-5 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Subscription Plans</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Configure pricing, limits, and included modules for each plan</p>
        </div>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-3 gap-4">
        {merged.map((plan) => (
          <Card key={plan.id} className={`border ${PLAN_COLORS[plan.color]}`}>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold">{plan.name}</span>
                <span className={`text-xs font-bold rounded-full px-2 py-0.5 ${PLAN_BADGE_COLORS[plan.color]}`}>
                  {getSubscriberCount(plan.slug)} active
                </span>
              </div>
              <p className="text-xl font-bold">{formatPrice(plan.monthlyPriceAed)}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                MRR: AED {getMRR(plan.slug).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {merged.map((plan) => (
          <Card key={plan.id} className={`border-2 ${plan.isActive ? PLAN_COLORS[plan.color] : "border-border bg-muted/30 opacity-60"}`}>
            {/* Plan header */}
            <CardHeader className={`rounded-t-xl pb-4 ${PLAN_HEADER_COLORS[plan.color]}`}>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <p className="text-xs mt-0.5 opacity-70">{plan.tagline}</p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0 hover:bg-white/30"
                  onClick={() => setEditingPlan(plan)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-bold">
                  {plan.monthlyPriceAed === 0 ? "Free" : `AED ${plan.monthlyPriceAed.toLocaleString()}`}
                </span>
                {plan.monthlyPriceAed > 0 && <span className="text-xs ml-1 opacity-70">/month</span>}
              </div>
              {plan.annualPriceAed > 0 && (
                <p className="text-xs opacity-60 -mt-1">
                  AED {plan.annualPriceAed.toLocaleString()}/year (save {Math.round((1 - plan.annualPriceAed / (plan.monthlyPriceAed * 12)) * 100)}%)
                </p>
              )}
              {plan.trialDays > 0 && (
                <Badge variant="secondary" className="mt-2 text-xs w-fit">{plan.trialDays}-day free trial</Badge>
              )}
            </CardHeader>

            <CardContent className="pt-4 space-y-4">
              {/* Limits */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-3.5 w-3.5 shrink-0" />
                  <span>{formatLimit(plan.maxUsers, "users")}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <HardDrive className="h-3.5 w-3.5 shrink-0" />
                  <span>{formatLimit(plan.maxStorageGb, "GB storage")}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CreditCard className="h-3.5 w-3.5 shrink-0" />
                  <span>{getSubscriberCount(plan.slug)} subscribers</span>
                </div>
              </div>

              <Separator />

              {/* Modules */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                  Included modules ({plan.includedModules.length}/{ALL_MODULES.length})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_MODULES.map((mod) => {
                    const included = plan.includedModules.includes(mod.key as ModuleKey);
                    return (
                      <span
                        key={mod.key}
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                          included
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-muted text-muted-foreground line-through opacity-50"
                        }`}
                      >
                        {included ? <Check className="h-2.5 w-2.5" /> : <X className="h-2.5 w-2.5" />}
                        {mod.label}
                      </span>
                    );
                  })}
                </div>
              </div>

              <Separator />

              {/* Status toggle */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Plan active</span>
                <Switch
                  checked={plan.isActive}
                  onCheckedChange={(v) => {
                    setPlanOverrides((prev) => ({
                      ...prev,
                      [plan.id]: { ...(prev[plan.id] ?? {}), isActive: v },
                    }));
                    toast.success(`${plan.name} plan ${v ? "activated" : "deactivated"}`);
                  }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit dialog */}
      {editingPlan && (
        <PlanEditDialog
          plan={editingPlan}
          onSave={handleSave}
          onClose={() => setEditingPlan(null)}
        />
      )}
    </div>
  );
}

function PlanEditDialog({
  plan,
  onSave,
  onClose,
}: {
  plan: SubscriptionPlan;
  onSave: (p: SubscriptionPlan) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<SubscriptionPlan>({ ...plan });

  function toggleModule(key: ModuleKey) {
    setDraft((prev) => ({
      ...prev,
      includedModules: prev.includedModules.includes(key)
        ? prev.includedModules.filter((m) => m !== key)
        : [...prev.includedModules, key],
    }));
  }

  function setField<K extends keyof SubscriptionPlan>(key: K, val: SubscriptionPlan[K]) {
    setDraft((prev) => ({ ...prev, [key]: val }));
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit {plan.name} Plan</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Tagline */}
          <div className="space-y-1.5">
            <Label>Tagline</Label>
            <Input
              value={draft.tagline}
              onChange={(e) => setField("tagline", e.target.value)}
            />
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Monthly Price (AED)</Label>
              <Input
                type="number"
                min={0}
                value={draft.monthlyPriceAed}
                onChange={(e) => setField("monthlyPriceAed", Number(e.target.value))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Annual Price (AED)</Label>
              <Input
                type="number"
                min={0}
                value={draft.annualPriceAed}
                onChange={(e) => setField("annualPriceAed", Number(e.target.value))}
              />
            </div>
          </div>

          {/* Limits */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Max Users <span className="text-muted-foreground text-xs">(-1 = unlimited)</span></Label>
              <Input
                type="number"
                min={-1}
                value={draft.maxUsers}
                onChange={(e) => setField("maxUsers", Number(e.target.value))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Max Storage GB <span className="text-muted-foreground text-xs">(-1 = unlimited)</span></Label>
              <Input
                type="number"
                min={-1}
                value={draft.maxStorageGb}
                onChange={(e) => setField("maxStorageGb", Number(e.target.value))}
              />
            </div>
          </div>

          {/* Trial days */}
          <div className="space-y-1.5">
            <Label>Trial Days <span className="text-muted-foreground text-xs">(0 = no trial)</span></Label>
            <Input
              type="number"
              min={0}
              max={90}
              value={draft.trialDays}
              onChange={(e) => setField("trialDays", Number(e.target.value))}
            />
          </div>

          <Separator />

          {/* Modules */}
          <div className="space-y-2">
            <Label>Included Modules</Label>
            <div className="grid grid-cols-2 gap-2">
              {ALL_MODULES.map((mod) => {
                const included = draft.includedModules.includes(mod.key as ModuleKey);
                return (
                  <button
                    key={mod.key}
                    type="button"
                    onClick={() => toggleModule(mod.key as ModuleKey)}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm text-left transition-colors ${
                      included
                        ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                        : "border-border bg-background text-muted-foreground hover:bg-muted/50"
                    }`}
                  >
                    <div className={`h-4 w-4 shrink-0 rounded flex items-center justify-center ${included ? "bg-emerald-500" : "border border-muted-foreground"}`}>
                      {included && <Check className="h-2.5 w-2.5 text-white" />}
                    </div>
                    {mod.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSave(draft)}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

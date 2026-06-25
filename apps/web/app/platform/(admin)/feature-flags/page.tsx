"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Flag, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockFeatureFlags, mockPlatformOrgs, type FeatureFlag, type OrgPlan } from "@/lib/mock/platform";
import { toast } from "sonner";

const categoryColor: Record<FeatureFlag["category"], string> = {
  ai: "bg-violet-100 text-violet-700",
  finance: "bg-emerald-100 text-emerald-700",
  crm: "bg-blue-100 text-blue-700",
  ops: "bg-orange-100 text-orange-700",
  platform: "bg-indigo-100 text-indigo-700",
};

const planColor: Record<OrgPlan, string> = {
  starter: "bg-gray-100 text-gray-600",
  growth: "bg-blue-100 text-blue-700",
  enterprise: "bg-purple-100 text-purple-700",
};

type Category = FeatureFlag["category"] | "all";

export default function FeatureFlagsPage() {
  const { data: flags } = useQuery({ queryKey: ["platform-flags"], queryFn: () => mockFeatureFlags });
  const { data: orgs } = useQuery({ queryKey: ["platform-orgs"], queryFn: () => mockPlatformOrgs });

  const [globalStates, setGlobalStates] = useState<Record<string, boolean>>({});
  const [orgOverrides, setOrgOverrides] = useState<Record<string, string[]>>({});
  const [expandedFlagId, setExpandedFlagId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<Category>("all");

  const allFlags = flags ?? [];
  const allOrgs = orgs ?? [];
  const filtered = allFlags.filter((f) => categoryFilter === "all" || f.category === categoryFilter);

  function getEnabled(flag: FeatureFlag): boolean {
    return flag.id in globalStates ? globalStates[flag.id] : flag.enabledGlobally;
  }

  function getEnabledOrgs(flag: FeatureFlag): string[] {
    return flag.id in orgOverrides ? orgOverrides[flag.id] : flag.enabledForOrgs;
  }

  function toggle(flag: FeatureFlag) {
    const newVal = !getEnabled(flag);
    setGlobalStates((s) => ({ ...s, [flag.id]: newVal }));
    toast.success(`${flag.name} ${newVal ? "enabled" : "disabled"} globally`);
  }

  function toggleOrgOverride(flag: FeatureFlag, orgId: string) {
    const current = getEnabledOrgs(flag);
    const isOn = current.includes(orgId);
    const next = isOn ? current.filter((id) => id !== orgId) : [...current, orgId];
    setOrgOverrides((s) => ({ ...s, [flag.id]: next }));
    const orgName = allOrgs.find((o) => o.id === orgId)?.name ?? orgId;
    toast.success(`${flag.name} ${isOn ? "disabled" : "enabled"} for ${orgName}`);
  }

  const kpis = [
    { label: "Total Flags", value: allFlags.length },
    { label: "Enabled Globally", value: allFlags.filter((f) => getEnabled(f)).length },
    { label: "Partial Rollout", value: allFlags.filter((f) => !getEnabled(f) && f.rolloutPercent > 0).length },
    { label: "Disabled", value: allFlags.filter((f) => !getEnabled(f) && f.rolloutPercent === 0).length },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Feature Flags</h1>
        <p className="text-sm text-muted-foreground mt-1">Toggle features globally or per organisation</p>
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

      <div className="flex items-center gap-3">
        <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as Category)}>
          <SelectTrigger className="w-44 h-9"><SelectValue placeholder="All Categories" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="ai">AI</SelectItem>
            <SelectItem value="finance">Finance</SelectItem>
            <SelectItem value="crm">CRM</SelectItem>
            <SelectItem value="ops">Operations</SelectItem>
            <SelectItem value="platform">Platform</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">{filtered.length} flag{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      <div className="space-y-3">
        {filtered.map((flag) => {
          const enabled = getEnabled(flag);
          const enabledOrgs = getEnabledOrgs(flag);
          const isExpanded = expandedFlagId === flag.id;

          return (
            <Card key={flag.id} className={enabled ? "border-indigo-200" : ""}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Flag className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="font-semibold text-sm">{flag.name}</span>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium uppercase ${categoryColor[flag.category]}`}>{flag.category}</span>
                    </div>
                    <p className="text-xs text-muted-foreground font-mono mb-2">{flag.key}</p>
                    <p className="text-sm text-muted-foreground">{flag.description}</p>

                    <div className="flex flex-wrap gap-3 mt-3 text-xs text-muted-foreground">
                      <span>
                        <span className="font-medium">Rollout:</span> {enabled ? "100%" : `${flag.rolloutPercent}%`}
                      </span>
                      <button
                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                        onClick={() => setExpandedFlagId(isExpanded ? null : flag.id)}
                      >
                        <span className="font-medium">Org overrides:</span>
                        <span>{enabledOrgs.length}</span>
                        {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                      </button>
                    </div>

                    {!enabled && flag.rolloutPercent > 0 && (
                      <div className="mt-2 flex items-center gap-2">
                        <div className="h-1.5 w-32 rounded-full bg-muted overflow-hidden">
                          <div className="h-full rounded-full bg-indigo-400" style={{ width: `${flag.rolloutPercent}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground">{flag.rolloutPercent}% rollout</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <Switch
                      checked={enabled}
                      onCheckedChange={() => toggle(flag)}
                      className="data-[state=checked]:bg-indigo-600"
                    />
                    <span className={`text-xs font-medium ${enabled ? "text-indigo-600" : "text-muted-foreground"}`}>
                      {enabled ? "Global ON" : "Off / Partial"}
                    </span>
                  </div>
                </div>

                {/* Per-org override panel */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                      Per-Organisation Overrides
                      <span className="ml-2 normal-case font-normal">— overrides the global toggle for specific orgs</span>
                    </p>
                    <div className="space-y-1">
                      {allOrgs.map((org) => {
                        const isOrgEnabled = enabledOrgs.includes(org.id);
                        return (
                          <div
                            key={org.id}
                            className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="text-sm font-medium">{org.name}</span>
                              <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium capitalize ${planColor[org.plan]}`}>
                                {org.plan}
                              </span>
                              <span className="text-xs text-muted-foreground font-mono">{org.slug}</span>
                            </div>
                            <Switch
                              checked={isOrgEnabled}
                              onCheckedChange={() => toggleOrgOverride(flag, org.id)}
                              className="data-[state=checked]:bg-indigo-600"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { useQuery } from "@tanstack/react-query";
import { CreditCard, TrendingUp, Building2, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockPlatformOrgs, platformMrrChart, type OrgPlan } from "@/lib/mock/platform";
import { formatCurrency, formatCurrencyCompact } from "@/lib/utils/format";
import { TOKEN } from "@/lib/tokens";

const planColor: Record<OrgPlan, string> = {
  starter: "bg-gray-100 text-gray-700",
  growth: "bg-blue-100 text-blue-700",
  enterprise: "bg-purple-100 text-purple-700",
};

const PLAN_PRICES: Record<OrgPlan, number> = {
  starter: 0,
  growth: 79000,
  enterprise: 249000,
};

const W = 500;
const H = 140;

function LineChart({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * W;
      const y = H - ((v - min) / range) * (H - 20) - 10;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none" style={{ height: 130 }}>
      <polyline fill="none" stroke={TOKEN.platform} strokeWidth="2.5" points={pts} strokeLinecap="round" strokeLinejoin="round" />
      <polyline fill={`${TOKEN.platform}18`} stroke="none" points={`0,${H} ${pts} ${W},${H}`} />
    </svg>
  );
}

export default function BillingPage() {
  const { data: orgs } = useQuery({ queryKey: ["platform-orgs"], queryFn: () => mockPlatformOrgs });
  const { data: mrrData } = useQuery({ queryKey: ["platform-mrr"], queryFn: () => platformMrrChart });

  const allOrgs = orgs ?? [];
  const mrr = mrrData ?? [];

  const activeOrgs = allOrgs.filter((o) => o.status === "active");
  const totalMrr = activeOrgs.reduce((s, o) => s + o.mrr, 0);
  const totalArr = totalMrr * 12;
  const prevMrr = mrr[mrr.length - 2]?.mrr ?? totalMrr;
  const mrrGrowth = prevMrr > 0 ? (((totalMrr - prevMrr) / prevMrr) * 100).toFixed(1) : "0.0";
  const paidOrgs = activeOrgs.filter((o) => o.mrr > 0).length;

  const byPlan = (["starter", "growth", "enterprise"] as OrgPlan[]).map((plan) => {
    const planOrgs = allOrgs.filter((o) => o.plan === plan);
    const planRevenue = planOrgs.reduce((s, o) => s + o.mrr, 0);
    return { plan, count: planOrgs.length, revenue: planRevenue, price: PLAN_PRICES[plan] };
  });

  const topByMrr = [...activeOrgs]
    .filter((o) => o.mrr > 0)
    .sort((a, b) => b.mrr - a.mrr)
    .slice(0, 8);

  const maxMrr = topByMrr[0]?.mrr ?? 1;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Billing & Revenue</h1>
        <p className="text-sm text-muted-foreground mt-1">Platform-wide revenue metrics and subscription breakdown</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground">Total MRR</p>
              <CreditCard className="h-4 w-4 text-indigo-500" />
            </div>
            <p className="text-2xl font-bold">{formatCurrencyCompact(totalMrr)}</p>
            <p className="text-xs text-emerald-600 mt-0.5">+{mrrGrowth}% MoM</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground">ARR (Annualised)</p>
              <TrendingUp className="h-4 w-4 text-indigo-500" />
            </div>
            <p className="text-2xl font-bold">{formatCurrencyCompact(totalArr)}</p>
            <p className="text-xs text-muted-foreground mt-0.5">MRR × 12</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground">Paying Orgs</p>
              <Building2 className="h-4 w-4 text-indigo-500" />
            </div>
            <p className="text-2xl font-bold">{paidOrgs}</p>
            <p className="text-xs text-muted-foreground mt-0.5">of {activeOrgs.length} active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground">Avg MRR per Org</p>
              <BarChart3 className="h-4 w-4 text-indigo-500" />
            </div>
            <p className="text-2xl font-bold">{formatCurrencyCompact(paidOrgs > 0 ? totalMrr / paidOrgs : 0)}</p>
            <p className="text-xs text-muted-foreground mt-0.5">paying orgs only</p>
          </CardContent>
        </Card>
      </div>

      {/* MRR Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">MRR Trend (12 months)</CardTitle>
          <p className="text-xs text-muted-foreground">Monthly recurring revenue over time</p>
        </CardHeader>
        <CardContent>
          <LineChart data={mrr.map((d) => d.mrr)} />
          <div className="flex justify-between mt-2">
            <span className="text-xs text-muted-foreground">{mrr[0]?.month} — {formatCurrencyCompact(mrr[0]?.mrr ?? 0)}</span>
            <span className="text-xs font-semibold text-indigo-600">{mrr[mrr.length - 1]?.month} — {formatCurrencyCompact(mrr[mrr.length - 1]?.mrr ?? 0)}</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Plan Breakdown */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Revenue by Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {byPlan.map(({ plan, count, revenue, price }) => (
              <div key={plan}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${planColor[plan]}`}>{plan}</span>
                    <span className="text-sm text-muted-foreground">{count} org{count !== 1 ? "s" : ""}</span>
                    {price > 0 && <span className="text-xs text-muted-foreground">@ {formatCurrencyCompact(price)}/mo</span>}
                  </div>
                  <span className="text-sm font-semibold">{revenue > 0 ? formatCurrencyCompact(revenue) : "—"}</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-indigo-500"
                    style={{ width: totalMrr > 0 ? `${(revenue / totalMrr) * 100}%` : "0%" }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {totalMrr > 0 ? `${((revenue / totalMrr) * 100).toFixed(1)}%` : "0%"} of total MRR
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top orgs by MRR */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Top Organisations by MRR</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topByMrr.map((org, i) => (
              <div key={org.id} className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-4 shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-sm font-medium truncate">{org.name}</span>
                    <span className="text-sm font-bold ml-2 shrink-0">{formatCurrencyCompact(org.mrr)}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-indigo-400" style={{ width: `${(org.mrr / maxMrr) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Full billing table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">All Active Subscriptions</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                {["Organisation", "Plan", "MRR", "ARR (est.)", "Users", "Admin"].map((h) => (
                  <th key={h} className="h-9 px-4 text-left text-xs font-semibold text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {activeOrgs.filter((o) => o.mrr > 0).sort((a, b) => b.mrr - a.mrr).map((org) => (
                <tr key={org.id} className="border-b hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-2.5 font-medium">{org.name}</td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${planColor[org.plan]}`}>{org.plan}</span>
                  </td>
                  <td className="px-4 py-2.5 font-semibold">{formatCurrency(org.mrr)}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{formatCurrencyCompact(org.mrr * 12)}</td>
                  <td className="px-4 py-2.5">{org.userCount}</td>
                  <td className="px-4 py-2.5 text-muted-foreground text-xs">{org.adminEmail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

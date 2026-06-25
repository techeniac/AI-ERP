"use client";

import { useQuery } from "@tanstack/react-query";
import { Building2, Users, TrendingUp, Clock, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockPlatformOrgs, platformMrrChart, orgGrowthChart } from "@/lib/mock/platform";
import { formatCurrencyCompact, formatDate, formatRelative } from "@/lib/utils/format";
import { TOKEN } from "@/lib/tokens";
import Link from "next/link";

const W = 500;
const H = 160;

function LineChart({ data, color = TOKEN.platform }: { data: number[]; color?: string }) {
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
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none" style={{ height: 140 }}>
      <polyline fill="none" stroke={color} strokeWidth="2.5" points={pts} strokeLinecap="round" strokeLinejoin="round" />
      <polyline
        fill={`${color}18`}
        stroke="none"
        points={`0,${H} ${pts} ${W},${H}`}
      />
    </svg>
  );
}

function BarChart({ data, color = TOKEN.platform }: { data: number[]; color?: string }) {
  const max = Math.max(...data);
  const barW = W / data.length - 4;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none" style={{ height: 140 }}>
      {data.map((v, i) => {
        const bh = (v / max) * (H - 20);
        const x = i * (W / data.length) + 2;
        const y = H - bh - 4;
        return <rect key={i} x={x} y={y} width={barW} height={bh} fill={color} rx="3" opacity="0.8" />;
      })}
    </svg>
  );
}

export default function PlatformDashboardPage() {
  const { data: orgs } = useQuery({ queryKey: ["platform-orgs"], queryFn: () => mockPlatformOrgs });
  const { data: mrrData } = useQuery({ queryKey: ["platform-mrr"], queryFn: () => platformMrrChart });
  const { data: growthData } = useQuery({ queryKey: ["platform-growth"], queryFn: () => orgGrowthChart });

  const allOrgs = orgs ?? [];
  const mrr = mrrData ?? [];
  const growth = growthData ?? [];

  const activeOrgs = allOrgs.filter((o) => o.status === "active");
  const trialOrgs = allOrgs.filter((o) => o.status === "trial");
  const suspendedOrgs = allOrgs.filter((o) => o.status === "suspended");
  const totalUsers = allOrgs.reduce((s, o) => s + o.userCount, 0);
  const totalMrr = activeOrgs.reduce((s, o) => s + o.mrr, 0);
  const prevMrr = mrr[mrr.length - 2]?.mrr ?? totalMrr;
  const mrrGrowth = prevMrr > 0 ? (((totalMrr - prevMrr) / prevMrr) * 100).toFixed(1) : "0.0";
  const totalStorageGb = (allOrgs.reduce((s, o) => s + o.storageUsedMb, 0) / 1024).toFixed(1);
  const avgUsers = allOrgs.length > 0 ? (totalUsers / allOrgs.length).toFixed(1) : "0";
  const churnRate = allOrgs.length > 0 ? ((allOrgs.filter((o) => o.status === "churned").length / allOrgs.length) * 100).toFixed(1) : "0";
  const newThisMonth = growth[growth.length - 1]?.newOrgs ?? 0;

  const needsAttention = allOrgs.filter((o) => {
    if (o.status === "suspended") return true;
    if (o.status === "trial" && o.trialEndsAt) {
      const daysLeft = (new Date(o.trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
      return daysLeft < 7;
    }
    return false;
  });

  const recentOrgs = [...allOrgs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  const kpis1 = [
    { label: "Total Organisations", value: allOrgs.length.toString(), sub: `${activeOrgs.length} active`, icon: Building2 },
    { label: "Total Users", value: totalUsers.toString(), sub: `across all orgs`, icon: Users },
    { label: "Platform MRR", value: formatCurrencyCompact(totalMrr), sub: `+${mrrGrowth}% MoM`, icon: TrendingUp, positive: true },
    { label: "Active Trials", value: trialOrgs.length.toString(), sub: "free trial period", icon: Clock },
  ];

  const kpis2 = [
    { label: "New Orgs This Month", value: newThisMonth.toString(), sub: "June 2026" },
    { label: "Churn Rate", value: `${churnRate}%`, sub: "all time", danger: parseFloat(churnRate) > 10 },
    { label: "Avg Users per Org", value: avgUsers, sub: "across all plans" },
    { label: "Total Storage Used", value: `${totalStorageGb} GB`, sub: "across all orgs" },
  ];

  const planColor: Record<string, string> = { starter: "bg-gray-100 text-gray-700", growth: "bg-blue-100 text-blue-700", enterprise: "bg-purple-100 text-purple-700" };
  const statusColor: Record<string, string> = { active: "bg-emerald-100 text-emerald-700", trial: "bg-amber-100 text-amber-700", suspended: "bg-red-100 text-red-700", churned: "bg-gray-100 text-gray-500" };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Platform Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">All organisations, users, and revenue — platform-wide view</p>
      </div>

      {/* KPI row 1 */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis1.map((k) => (
          <Card key={k.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground">{k.label}</p>
                <k.icon className="h-4 w-4 text-indigo-500" />
              </div>
              <p className="text-2xl font-bold tabular-nums">{k.value}</p>
              <p className={`text-xs mt-0.5 ${k.positive ? "text-emerald-600" : "text-muted-foreground"}`}>{k.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* KPI row 2 */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis2.map((k) => (
          <Card key={k.label}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-1">{k.label}</p>
              <p className={`text-2xl font-bold tabular-nums ${k.danger ? "text-red-600" : ""}`}>{k.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{k.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Platform MRR Trend</CardTitle>
            <p className="text-xs text-muted-foreground">12-month monthly recurring revenue</p>
          </CardHeader>
          <CardContent>
            <LineChart data={mrr.map((d) => d.mrr)} color={TOKEN.platform} />
            <div className="flex justify-between mt-2">
              <span className="text-xs text-muted-foreground">{mrr[0]?.month}</span>
              <span className="text-xs font-semibold text-indigo-600">{formatCurrencyCompact(mrr[mrr.length - 1]?.mrr ?? 0)}</span>
              <span className="text-xs text-muted-foreground">{mrr[mrr.length - 1]?.month}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">New Org Signups</CardTitle>
            <p className="text-xs text-muted-foreground">Monthly new organisation registrations</p>
          </CardHeader>
          <CardContent>
            <BarChart data={growth.map((d) => d.newOrgs)} color={TOKEN.platform} />
            <div className="flex justify-between mt-2">
              <span className="text-xs text-muted-foreground">{growth[0]?.month}</span>
              <span className="text-xs font-semibold text-indigo-600">{growth[growth.length - 1]?.newOrgs} this month</span>
              <span className="text-xs text-muted-foreground">{growth[growth.length - 1]?.month}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tables */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Recent Organisations</CardTitle>
            <p className="text-xs text-muted-foreground">Latest 5 signups</p>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">Org</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">Plan</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">Joined</th>
                </tr>
              </thead>
              <tbody>
                {recentOrgs.map((org) => (
                  <tr key={org.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-2.5">
                      <Link href={`/platform/organizations/${org.id}`} className="font-medium hover:text-indigo-600">{org.name}</Link>
                      <p className="text-xs text-muted-foreground">{org.slug}</p>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${planColor[org.plan]}`}>{org.plan}</span>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground">{formatRelative(org.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Needs Attention
            </CardTitle>
            <p className="text-xs text-muted-foreground">Suspended orgs or trials expiring soon</p>
          </CardHeader>
          <CardContent className="p-0">
            {needsAttention.length === 0 ? (
              <p className="px-4 py-8 text-sm text-muted-foreground text-center">All clear — no orgs need attention</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40">
                    <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">Org</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">Action needed</th>
                  </tr>
                </thead>
                <tbody>
                  {needsAttention.map((org) => (
                    <tr key={org.id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-2.5">
                        <Link href={`/platform/organizations/${org.id}`} className="font-medium hover:text-indigo-600">{org.name}</Link>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusColor[org.status]}`}>{org.status}</span>
                      </td>
                      <td className="px-4 py-2.5 text-xs text-muted-foreground">
                        {org.status === "suspended" ? "Review suspension" : `Trial ends ${formatDate(org.trialEndsAt ?? null)}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

"use client";

import { useQuery } from "@tanstack/react-query";
import { BarChart3, Download, TrendingUp, Receipt, HeadphonesIcon, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/page-header";
import {
  revenueChartData,
  pipelineStageData,
  ticketTrendData,
  arAgingSummary,
  taskCompletionData,
  topCustomersData,
  invoiceStatusData,
} from "@/lib/mock/dashboard-kpis";
import { formatCurrencyCompact, formatNumber } from "@/lib/utils/format";

function BarChart({ data, height = 120 }: { data: { label: string; value: number; color?: string }[]; height?: number }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="space-y-2">
      {data.map((item) => (
        <div key={item.label} className="flex items-center gap-3">
          <span className="w-20 text-xs text-muted-foreground text-right shrink-0 truncate">{item.label}</span>
          <div className="flex-1 h-6 bg-muted rounded overflow-hidden">
            <div
              className="h-full rounded transition-all duration-700"
              style={{
                width: `${(item.value / max) * 100}%`,
                backgroundColor: item.color ?? "var(--brand-teal)",
              }}
            />
          </div>
          <span className="text-xs font-semibold tabular-nums w-16 text-right">
            {item.value > 1000 ? formatCurrencyCompact(item.value) : formatNumber(item.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

function LineSparkline({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map((d) => d.value));
  const min = Math.min(...data.map((d) => d.value));
  const range = max - min || 1;
  const h = 80;
  const w = 400;
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((d.value - min) / range) * (h - 8);
    return `${x},${y}`;
  });

  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-20">
        <defs>
          <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--brand-teal)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="var(--brand-teal)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline
          points={pts.join(" ")}
          fill="none"
          stroke="var(--brand-teal)"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <polyline
          points={`0,${h} ${pts.join(" ")} ${w},${h}`}
          fill="url(#sparkGrad)"
          stroke="none"
        />
        {data.map((d, i) => {
          const x = (i / (data.length - 1)) * w;
          const y = h - ((d.value - min) / range) * (h - 8);
          return <circle key={i} cx={x} cy={y} r="3" fill="var(--brand-teal)" />;
        })}
      </svg>
      <div className="flex justify-between text-xs text-muted-foreground mt-1">
        {data.filter((_, i) => i === 0 || i === data.length - 1 || i % 3 === 0).map((d) => (
          <span key={d.label}>{d.label}</span>
        ))}
      </div>
    </div>
  );
}

function DonutChart({ data }: { data: { label: string; value: number; color?: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  let offset = 0;
  const r = 40;
  const c = 2 * Math.PI * r;

  return (
    <div className="flex items-center gap-6">
      <div className="relative shrink-0">
        <svg viewBox="0 0 100 100" className="w-24 h-24 -rotate-90">
          {data.map((item, i) => {
            const pct = item.value / total;
            const dash = pct * c;
            const seg = (
              <circle
                key={i}
                cx="50" cy="50" r={r}
                fill="transparent"
                stroke={item.color ?? "#6b7280"}
                strokeWidth="18"
                strokeDasharray={`${dash} ${c - dash}`}
                strokeDashoffset={-offset * c}
              />
            );
            offset += pct;
            return seg;
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold">{total}</span>
        </div>
      </div>
      <div className="space-y-1.5">
        {data.map((item) => (
          <div key={item.label} className="flex items-center gap-2 text-xs">
            <div className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-muted-foreground">{item.label}</span>
            <span className="font-semibold ml-auto pl-4">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const REPORT_CATALOG = [
  {
    category: "Finance",
    icon: Receipt,
    reports: [
      "Profit & Loss Statement",
      "Balance Sheet",
      "AR Aging Report",
      "Cash Flow Statement",
      "Invoice Summary by Customer",
      "Payment Receipt Report",
    ],
  },
  {
    category: "Sales / CRM",
    icon: TrendingUp,
    reports: [
      "Sales Pipeline Report",
      "Lead Conversion Funnel",
      "Revenue by Customer",
      "Sales by Rep",
      "Win/Loss Analysis",
    ],
  },
  {
    category: "Support",
    icon: HeadphonesIcon,
    reports: [
      "SLA Compliance Report",
      "Ticket Volume Trend",
      "First Response Time",
      "Resolution Time by Category",
      "CSAT Score Report",
    ],
  },
  {
    category: "Operations",
    icon: CheckSquare,
    reports: [
      "Task Completion Rate",
      "Project Status Summary",
      "Time Logged by Employee",
      "Overdue Tasks Report",
    ],
  },
];

export default function ReportsPage() {
  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Reports & Analytics"
        description="Business intelligence across all modules"
        actions={
          <Button variant="outline" className="gap-2 h-9">
            <Download className="h-4 w-4" />
            Export All
          </Button>
        }
      />

      <Tabs defaultValue="overview">
        <TabsList className="h-9">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="finance">Finance</TabsTrigger>
          <TabsTrigger value="crm">CRM</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
          <TabsTrigger value="catalog">Report Catalog</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4 space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Revenue Trend (12 months)</CardTitle>
                <CardDescription>Monthly invoiced revenue vs previous year</CardDescription>
              </CardHeader>
              <CardContent>
                <LineSparkline data={revenueChartData} />
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground border-t pt-3">
                  <span>Latest month</span>
                  <span className="font-bold text-foreground text-sm">{formatCurrencyCompact(revenueChartData[revenueChartData.length - 1]?.value ?? 0)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Task Completion Rate</CardTitle>
                <CardDescription>% of tasks completed on time — last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <LineSparkline data={taskCompletionData} />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Invoice Status Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <DonutChart data={invoiceStatusData} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Top Customers by Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart data={topCustomersData} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">AR Aging</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart data={arAgingSummary} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="finance" className="mt-4 space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Revenue by Month</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart data={revenueChartData} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">AR Aging Buckets</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart data={arAgingSummary} />
                <div className="mt-4 text-center">
                  <p className="text-2xl font-bold tabular-nums">
                    {formatCurrencyCompact(arAgingSummary.reduce((s, b) => s + b.value, 0))}
                  </p>
                  <p className="text-xs text-muted-foreground">Total Outstanding Receivables</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="crm" className="mt-4 space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Pipeline by Stage</CardTitle>
                <CardDescription>Deal value in each stage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {pipelineStageData.map((stage) => (
                    <div key={stage.stage} className="flex items-center gap-3">
                      <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: stage.color }} />
                      <span className="flex-1 text-sm text-muted-foreground">{stage.stage}</span>
                      <span className="text-xs font-medium">{stage.count} deals</span>
                      <span className="text-sm font-bold tabular-nums w-24 text-right">
                        {formatCurrencyCompact(stage.value)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 border-t pt-3 flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Pipeline</span>
                  <span className="text-base font-bold">
                    {formatCurrencyCompact(pipelineStageData.reduce((s, d) => s + d.value, 0))}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Top Customers by Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart data={topCustomersData} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="support" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Ticket Volume (Weekly)</CardTitle>
              <CardDescription>Last 8 weeks</CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart data={ticketTrendData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="catalog" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {REPORT_CATALOG.map((cat) => (
              <Card key={cat.category}>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <cat.icon className="h-4 w-4 text-[var(--brand-teal)]" />
                    <CardTitle className="text-base">{cat.category}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1.5">
                    {cat.reports.map((report) => (
                      <li key={report} className="flex items-center justify-between group">
                        <span className="text-sm text-muted-foreground">{report}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Export
                        </Button>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

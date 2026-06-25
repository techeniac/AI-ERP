import type { DashboardKPI, ChartDataPoint, PipelineStageData } from "@/lib/types";
import { TOKEN } from "@/lib/tokens";

export const dashboardKPIs: DashboardKPI[] = [
  {
    id: "kpi-revenue",
    title: "Monthly Revenue",
    value: 4250000,
    previousValue: 3890000,
    unit: "currency_aed",
    trend: "up",
    trendPercent: 9.25,
    description: "Total invoiced revenue this month",
    module: "finance",
  },
  {
    id: "kpi-outstanding-ar",
    title: "Outstanding AR",
    value: 8640000,
    previousValue: 9120000,
    unit: "currency_aed",
    trend: "down",
    trendPercent: -5.26,
    description: "Total accounts receivable outstanding",
    module: "finance",
  },
  {
    id: "kpi-open-leads",
    title: "Open Leads",
    value: 18,
    previousValue: 22,
    unit: "count",
    trend: "down",
    trendPercent: -18.18,
    description: "Active leads in pipeline",
    module: "crm",
  },
  {
    id: "kpi-pipeline-value",
    title: "Pipeline Value",
    value: 24800000,
    previousValue: 21500000,
    unit: "currency_aed",
    trend: "up",
    trendPercent: 15.35,
    description: "Total value of active sales pipeline",
    module: "crm",
  },
  {
    id: "kpi-open-tickets",
    title: "Open Tickets",
    value: 12,
    previousValue: 18,
    unit: "count",
    trend: "down",
    trendPercent: -33.33,
    description: "Active support tickets",
    module: "support",
  },
  {
    id: "kpi-sla-breach-rate",
    title: "SLA Breach Rate",
    value: 8.3,
    previousValue: 12.5,
    unit: "percent",
    trend: "down",
    trendPercent: -33.6,
    description: "Percentage of tickets breaching SLA",
    module: "support",
  },
  {
    id: "kpi-overdue-tasks",
    title: "Overdue Tasks",
    value: 7,
    previousValue: 4,
    unit: "count",
    trend: "up",
    trendPercent: 75,
    description: "Tasks past their due date",
    module: "operations",
  },
  {
    id: "kpi-pending-approvals",
    title: "Pending Approvals",
    value: 8,
    previousValue: 5,
    unit: "count",
    trend: "up",
    trendPercent: 60,
    description: "Approvals awaiting action",
    module: "approvals",
  },
  {
    id: "kpi-collection-rate",
    title: "Collection Rate",
    value: 87.4,
    previousValue: 82.1,
    unit: "percent",
    trend: "up",
    trendPercent: 6.46,
    description: "Percentage of invoiced amount collected",
    module: "finance",
  },
  {
    id: "kpi-avg-deal-size",
    title: "Avg Deal Size",
    value: 1380000,
    previousValue: 1250000,
    unit: "currency_aed",
    trend: "up",
    trendPercent: 10.4,
    description: "Average closed deal value this quarter",
    module: "crm",
  },
  {
    id: "kpi-avg-resolution-time",
    title: "Avg Resolution Time",
    value: 4.2,
    previousValue: 5.8,
    unit: "days",
    trend: "down",
    trendPercent: -27.59,
    description: "Average ticket resolution time",
    module: "support",
  },
  {
    id: "kpi-headcount",
    title: "Active Headcount",
    value: 19,
    previousValue: 18,
    unit: "count",
    trend: "up",
    trendPercent: 5.56,
    description: "Active full-time employees",
    module: "hr",
  },
];

// Monthly revenue for the last 12 months
export const revenueChartData: ChartDataPoint[] = [
  { label: "Jul '25", value: 3200000, previousValue: 2800000 },
  { label: "Aug '25", value: 3450000, previousValue: 3100000 },
  { label: "Sep '25", value: 3680000, previousValue: 3200000 },
  { label: "Oct '25", value: 3920000, previousValue: 3400000 },
  { label: "Nov '25", value: 3750000, previousValue: 3600000 },
  { label: "Dec '25", value: 4100000, previousValue: 3800000 },
  { label: "Jan '26", value: 3850000, previousValue: 3700000 },
  { label: "Feb '26", value: 3960000, previousValue: 3850000 },
  { label: "Mar '26", value: 4280000, previousValue: 4100000 },
  { label: "Apr '26", value: 4050000, previousValue: 3960000 },
  { label: "May '26", value: 3890000, previousValue: 4050000 },
  { label: "Jun '26", value: 4250000, previousValue: 3890000 },
];

// Invoice status breakdown
export const invoiceStatusData: ChartDataPoint[] = [
  { label: "Paid", value: 22, color: TOKEN.success },
  { label: "Sent", value: 8, color: TOKEN.info },
  { label: "Overdue", value: 5, color: TOKEN.danger },
  { label: "Draft", value: 3, color: TOKEN.neutral },
  { label: "Partial", value: 2, color: TOKEN.warning },
];

// Sales pipeline by stage
export const pipelineStageData: PipelineStageData[] = [
  { stage: "New", count: 5, value: 3200000, color: TOKEN.neutral },
  { stage: "Contacted", count: 4, value: 4800000, color: TOKEN.info },
  { stage: "Qualified", count: 4, value: 5600000, color: TOKEN.purple },
  { stage: "Proposal", count: 3, value: 4900000, color: TOKEN.warning },
  { stage: "Negotiation", count: 2, value: 3200000, color: TOKEN.teal },
  { stage: "Won", count: 6, value: 11200000, color: TOKEN.success },
];

// Support ticket trends (weekly for last 8 weeks)
export const ticketTrendData: ChartDataPoint[] = [
  { label: "W1 Apr", value: 24, previousValue: 18 },
  { label: "W2 Apr", value: 19, previousValue: 22 },
  { label: "W3 Apr", value: 22, previousValue: 21 },
  { label: "W4 Apr", value: 17, previousValue: 20 },
  { label: "W1 May", value: 20, previousValue: 17 },
  { label: "W2 May", value: 15, previousValue: 19 },
  { label: "W3 May", value: 18, previousValue: 15 },
  { label: "W4 May", value: 12, previousValue: 18 },
];

// AR aging summary
export const arAgingSummary: ChartDataPoint[] = [
  { label: "0-30 days", value: 3240000, color: TOKEN.success },
  { label: "31-60 days", value: 2180000, color: TOKEN.warning },
  { label: "61-90 days", value: 1850000, color: TOKEN.danger },
  { label: "90+ days", value: 1370000, color: TOKEN.overdue },
];

// Task completion rate (last 6 months)
export const taskCompletionData: ChartDataPoint[] = [
  { label: "Jan '26", value: 78 },
  { label: "Feb '26", value: 82 },
  { label: "Mar '26", value: 75 },
  { label: "Apr '26", value: 88 },
  { label: "May '26", value: 84 },
  { label: "Jun '26", value: 79 },
];

// Top customers by revenue
export const topCustomersData: ChartDataPoint[] = [
  { label: "Emirates NBD Bank", value: 8500000 },
  { label: "Aldar Properties PJSC", value: 6200000 },
  { label: "DAMAC Properties", value: 4800000 },
  { label: "Etihad Aviation Group", value: 3900000 },
  { label: "Majid Al Futtaim Retail", value: 3400000 },
];

export interface AIMessage {
  id: string;
  role: "user" | "assistant" | "tool";
  content: string;
  createdAt: Date;
}

export interface AIActionCard {
  id: string;
  type: "create_invoice" | "create_lead" | "update_status" | "draft_email" | "create_task" | "generate_report";
  title: string;
  description: string;
  details: Record<string, string | number | boolean>;
  requiresApproval: boolean;
}

export interface AIContextSuggestion {
  id: string;
  label: string;
  prompt: string;
}

export interface DashboardKPI {
  id: string;
  label?: string;
  title?: string;
  value: number;
  previousValue: number;
  unit: "currency_aed" | "currency_inr" | "currency_usd" | "count" | "percent" | "days";
  trend: "up" | "down" | "flat";
  trendPercent: number;
  trendPositive?: boolean;
  icon?: string;
  description?: string;
  module?: string;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  target?: number;
  secondary?: number;
  previousValue?: number;
  color?: string;
}

export interface PipelineStageData {
  stage: string;
  count: number;
  value: number;
  color?: string;
}

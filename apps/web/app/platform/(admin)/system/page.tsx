"use client";

import { Activity, Server, Database, Zap, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface ServiceStatus {
  name: string;
  status: "operational" | "degraded" | "outage";
  latency: string;
  uptime: string;
}

interface Incident {
  id: string;
  title: string;
  severity: "low" | "medium" | "high";
  status: "resolved" | "investigating" | "monitoring";
  date: string;
  resolution: string;
}

const SERVICES: ServiceStatus[] = [
  { name: "API Gateway", status: "operational", latency: "42ms", uptime: "99.98%" },
  { name: "Authentication Service", status: "operational", latency: "18ms", uptime: "100.00%" },
  { name: "Database (Primary)", status: "operational", latency: "5ms", uptime: "99.97%" },
  { name: "Database (Replica)", status: "operational", latency: "8ms", uptime: "99.95%" },
  { name: "File Storage (S3)", status: "operational", latency: "120ms", uptime: "99.99%" },
  { name: "Email Service (SES)", status: "operational", latency: "210ms", uptime: "99.92%" },
  { name: "AI Inference (Claude)", status: "operational", latency: "840ms", uptime: "99.80%" },
  { name: "Background Jobs (BullMQ)", status: "operational", latency: "—", uptime: "99.89%" },
  { name: "CDN (CloudFront)", status: "operational", latency: "14ms", uptime: "100.00%" },
  { name: "WebSocket Server", status: "operational", latency: "25ms", uptime: "99.91%" },
];

const INCIDENTS: Incident[] = [
  {
    id: "INC-003",
    title: "Elevated API latency on /finance/invoices endpoint",
    severity: "low",
    status: "resolved",
    date: "15 Jun 2026, 14:30 IST",
    resolution: "Database query plan updated. P95 latency returned to <100ms.",
  },
  {
    id: "INC-002",
    title: "AI Inference degraded — Claude API upstream timeout",
    severity: "medium",
    status: "resolved",
    date: "3 Jun 2026, 09:15 IST",
    resolution: "Anthropic resolved upstream outage. Graceful retry logic activated during incident.",
  },
  {
    id: "INC-001",
    title: "Email delivery delays — SES queue buildup",
    severity: "low",
    status: "resolved",
    date: "21 May 2026, 17:00 IST",
    resolution: "AWS SES queue cleared. All deferred emails delivered within 45 minutes.",
  },
];

const statusBadge: Record<ServiceStatus["status"], { label: string; cls: string }> = {
  operational: { label: "Operational", cls: "bg-emerald-100 text-emerald-700" },
  degraded: { label: "Degraded", cls: "bg-amber-100 text-amber-700" },
  outage: { label: "Outage", cls: "bg-red-100 text-red-700" },
};

const incidentSeverity: Record<Incident["severity"], string> = {
  low: "bg-gray-100 text-gray-600",
  medium: "bg-amber-100 text-amber-700",
  high: "bg-red-100 text-red-700",
};

const incidentStatus: Record<Incident["status"], string> = {
  resolved: "bg-emerald-100 text-emerald-700",
  investigating: "bg-red-100 text-red-700",
  monitoring: "bg-amber-100 text-amber-700",
};

const INFRA = [
  { label: "CPU Usage (avg)", value: 34, unit: "%" },
  { label: "Memory Usage", value: 58, unit: "%" },
  { label: "Database Connections", value: 42, unit: "% of pool" },
  { label: "Disk Usage", value: 61, unit: "%" },
  { label: "Cache Hit Rate", value: 94, unit: "%" },
  { label: "Queue Backlog", value: 8, unit: "% of capacity" },
];

export default function SystemHealthPage() {
  const allOperational = SERVICES.every((s) => s.status === "operational");

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">System Health</h1>
        <p className="text-sm text-muted-foreground mt-1">Real-time infrastructure and service status (Phase 1 — static mock)</p>
      </div>

      {/* Overall status */}
      <Card className={allOperational ? "border-emerald-200 bg-emerald-50/50" : "border-red-200 bg-red-50/50"}>
        <CardContent className="p-5 flex items-center gap-4">
          {allOperational ? (
            <CheckCircle2 className="h-8 w-8 text-emerald-500 shrink-0" />
          ) : (
            <AlertCircle className="h-8 w-8 text-red-500 shrink-0" />
          )}
          <div>
            <p className="font-bold text-base">{allOperational ? "All Systems Operational" : "Some Services Degraded"}</p>
            <p className="text-sm text-muted-foreground">Last checked: just now · Uptime (30d): 99.94%</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs text-muted-foreground">Q2 2026 Incidents</p>
            <p className="text-2xl font-bold">3</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Services */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Server className="h-4 w-4 text-indigo-500" />
              Service Status
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">Service</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">Latency</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">Uptime (30d)</th>
                </tr>
              </thead>
              <tbody>
                {SERVICES.map((s) => {
                  const b = statusBadge[s.status];
                  return (
                    <tr key={s.name} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-2 font-medium text-xs">{s.name}</td>
                      <td className="px-4 py-2">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${b.cls}`}>{b.label}</span>
                      </td>
                      <td className="px-4 py-2 text-xs text-muted-foreground tabular-nums">{s.latency}</td>
                      <td className="px-4 py-2 text-xs font-semibold tabular-nums">{s.uptime}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Infrastructure */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="h-4 w-4 text-indigo-500" />
                Infrastructure Metrics
              </CardTitle>
              <p className="text-xs text-muted-foreground">Live resource utilisation across the platform</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {INFRA.map((m) => (
                <div key={m.label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">{m.label}</span>
                    <span className={`text-sm font-bold tabular-nums ${m.value > 80 ? "text-red-600" : m.value > 65 ? "text-amber-600" : "text-foreground"}`}>
                      {m.value}{m.unit}
                    </span>
                  </div>
                  <Progress value={m.value} className="h-1.5" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Incidents */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4 text-indigo-500" />
            Recent Incidents (Q2 2026)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {INCIDENTS.map((inc) => (
            <div key={inc.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{inc.id}</span>
                  <span className="font-semibold text-sm">{inc.title}</span>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${incidentSeverity[inc.severity]}`}>{inc.severity}</span>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${incidentStatus[inc.status]}`}>{inc.status}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-1">{inc.date}</p>
              <p className="text-sm text-muted-foreground">{inc.resolution}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

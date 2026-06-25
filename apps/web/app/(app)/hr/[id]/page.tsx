"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, Calendar, User, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { mockEmployees } from "@/lib/mock/employees";
import { formatDate, formatCurrencyCompact } from "@/lib/utils/format";
import { TOKEN } from "@/lib/tokens";

const LEAVE_CONFIG = [
  { key: "casual" as const, label: "Casual Leave", max: 12, color: TOKEN.info },
  { key: "sick" as const, label: "Sick Leave", max: 12, color: TOKEN.success },
  { key: "earned" as const, label: "Earned Leave", max: 30, color: TOKEN.purple },
];

const MOCK_DOCUMENTS = [
  { name: "Offer Letter", type: "PDF", date: "Jan 2020", size: "245 KB" },
  { name: "Aadhaar Card (masked)", type: "PDF", date: "Jan 2020", size: "180 KB" },
  { name: "Experience Certificate (prev)", type: "PDF", date: "Jan 2020", size: "120 KB" },
];

export default function EmployeeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const emp = mockEmployees.find((e) => e.id === id);

  if (!emp) {
    return (
      <div className="p-6">
        <Link href="/hr" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Human Resources
        </Link>
        <EmptyState title="Employee not found" description="This employee may have been removed or the ID is incorrect." />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <Link href="/hr" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-3">
          <ArrowLeft className="h-4 w-4" /> Human Resources
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Left: profile card */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Avatar className="h-20 w-20 mb-3">
                <AvatarImage src={emp.avatar} alt={emp.name} />
                <AvatarFallback className="bg-[var(--brand-navy)] text-white text-xl font-bold">
                  {emp.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <h1 className="text-lg font-bold">{emp.name}</h1>
              <p className="text-sm text-muted-foreground">{emp.designation}</p>
              <Badge className="mt-1.5 bg-[var(--brand-teal)]/15 text-[var(--brand-teal)] border-0 text-xs">
                {emp.department}
              </Badge>
              <div className="mt-2 flex gap-2 justify-center flex-wrap">
                <StatusBadge status={emp.status} />
                <Badge variant="outline" className="text-xs capitalize">
                  {emp.employmentType.replace("_", " ")}
                </Badge>
              </div>

              <Separator className="my-3" />

              <div className="w-full space-y-2 text-xs text-muted-foreground">
                {emp.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{emp.email}</span>
                  </div>
                )}
                {emp.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 shrink-0" />
                    <span>{emp.phone}</span>
                  </div>
                )}
                {emp.managerName && (
                  <div className="flex items-center gap-2">
                    <User className="h-3.5 w-3.5 shrink-0" />
                    <span>Reports to {emp.managerName}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 shrink-0" />
                  <span>Joined {formatDate(emp.joinDate)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: details */}
        <div className="space-y-4">
          {/* Employment */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Employment Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2 text-sm">
              {[
                { label: "Employee ID", value: emp.id },
                { label: "Department", value: emp.department },
                { label: "Designation", value: emp.designation },
                { label: "Employment Type", value: emp.employmentType.replace("_", " ") },
                { label: "Join Date", value: formatDate(emp.joinDate) },
                { label: "Manager", value: emp.managerName ?? "—" },
              ].map((row) => (
                <div key={row.label}>
                  <p className="text-xs text-muted-foreground">{row.label}</p>
                  <p className="font-medium capitalize">{row.value}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Leave Balance */}
          {emp.leaveBalance && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Leave Balance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {LEAVE_CONFIG.map(({ key, label, max, color }) => {
                  const balance = emp.leaveBalance?.[key] ?? 0;
                  const used = max - balance;
                  return (
                    <div key={key} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium">{label}</span>
                        <span className="text-muted-foreground">
                          <span className="font-bold text-foreground">{balance}</span> / {max} days remaining
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${(used / max) * 100}%`, backgroundColor: color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {/* Salary */}
          {emp.salary && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Compensation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Annual CTC</span>
                  <span className="text-xl font-bold tabular-nums">
                    {formatCurrencyCompact(emp.salary)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {emp.currency ?? "AED"} · Confidential
                </p>
              </CardContent>
            </Card>
          )}

          {/* Documents */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Documents</CardTitle>
            </CardHeader>
            <CardContent className="divide-y">
              {MOCK_DOCUMENTS.map((doc) => (
                <div key={doc.name} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100 text-red-700 text-xs font-bold">
                      {doc.type}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">{doc.date} · {doc.size}</p>
                    </div>
                  </div>
                  <button className="text-xs text-[var(--brand-teal)] hover:underline">View</button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

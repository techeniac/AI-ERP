"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, UserCheck, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { mockEmployees } from "@/lib/mock/employees";
import { formatDate } from "@/lib/utils/format";
import type { Employee } from "@/lib/types";
import Link from "next/link";

const DEPARTMENTS = ["all", "Technology", "Finance", "Sales", "Customer Success", "Operations", "Human Resources", "Marketing"];

export default function HRPage() {
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: employees } = useQuery({
    queryKey: ["employees"],
    queryFn: () => mockEmployees,
  });

  const filtered = (employees ?? []).filter((e) => {
    const matchSearch =
      !search ||
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      e.designation?.toLowerCase().includes(search.toLowerCase());
    const matchDept = deptFilter === "all" || e.department === deptFilter;
    const matchStatus = statusFilter === "all" || e.status === statusFilter;
    return matchSearch && matchDept && matchStatus;
  });

  const activeCount = (employees ?? []).filter((e) => e.status === "active").length;
  const deptCounts = (employees ?? []).reduce<Record<string, number>>((acc, e) => {
    if (e.department) acc[e.department] = (acc[e.department] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Human Resources"
        description="Employee directory, records, and HR management"
        actions={
          <Button className="bg-[var(--brand-navy)] hover:bg-[var(--brand-navy)]/90 text-white gap-2">
            <Plus className="h-4 w-4" />
            Add Employee
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total Employees", value: (employees ?? []).length.toString() },
          { label: "Active", value: activeCount.toString() },
          { label: "Departments", value: Object.keys(deptCounts).length.toString() },
          { label: "On Leave", value: (employees ?? []).filter((e) => e.status === "on_leave").length.toString() },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="text-xl font-bold mt-1">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="directory">
        <TabsList className="h-9">
          <TabsTrigger value="directory">Directory</TabsTrigger>
          <TabsTrigger value="departments">By Department</TabsTrigger>
        </TabsList>

        <TabsContent value="directory" className="mt-4 space-y-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search employees…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
            <Select value={deptFilter} onValueChange={setDeptFilter}>
              <SelectTrigger className="w-44 h-9">
                <SelectValue placeholder="All departments" />
              </SelectTrigger>
              <SelectContent>
                {DEPARTMENTS.map((d) => (
                  <SelectItem key={d} value={d}>{d === "all" ? "All Departments" : d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36 h-9">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="on_leave">On Leave</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              title="No employees found"
              description="Try adjusting your search or filters"
              icon={<UserCheck className="h-8 w-8" />}
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((emp) => (
                <Link key={emp.id} href={`/hr/${emp.id}`}>
                  <Card className="cursor-pointer hover:shadow-md hover:border-[var(--brand-teal)]/50 transition-all h-full">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-11 w-11 shrink-0">
                          <AvatarImage src={emp.avatar} alt={emp.name} />
                          <AvatarFallback className="bg-[var(--brand-navy)] text-white font-bold text-sm">
                            {emp.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-sm truncate">{emp.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{emp.designation}</p>
                          <p className="text-xs text-[var(--brand-teal)] mt-0.5">{emp.department}</p>
                        </div>
                        <StatusBadge status={emp.status} />
                      </div>

                      <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                        {emp.email && (
                          <div className="flex items-center gap-1.5 truncate">
                            <Mail className="h-3 w-3 shrink-0" />
                            <span className="truncate">{emp.email}</span>
                          </div>
                        )}
                        {emp.phone && (
                          <div className="flex items-center gap-1.5">
                            <Phone className="h-3 w-3 shrink-0" />
                            <span>{emp.phone}</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-muted-foreground">Type</p>
                          <p className="font-semibold capitalize">{emp.employmentType?.replace("_", " ")}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Joined</p>
                          <p className="font-semibold">{formatDate(emp.joinDate ?? null)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="departments" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(deptCounts).map(([dept, count]) => {
              const deptEmps = (employees ?? []).filter((e) => e.department === dept);
              return (
                <Card key={dept} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-semibold">{dept}</p>
                      <span className="text-2xl font-bold text-[var(--brand-navy)]">{count}</span>
                    </div>
                    <div className="flex -space-x-2">
                      {deptEmps.slice(0, 5).map((emp) => (
                        <Avatar key={emp.id} className="h-8 w-8 border-2 border-background">
                          <AvatarImage src={emp.avatar} alt={emp.name} />
                          <AvatarFallback className="bg-[var(--brand-navy)] text-white text-xs">
                            {emp.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {count > 5 && (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                          +{count - 5}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

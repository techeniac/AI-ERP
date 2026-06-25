"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, CheckSquare, FolderOpen, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { mockTasks, mockProjects } from "@/lib/mock/tasks";
import { formatDate, formatRelative, formatDuration } from "@/lib/utils/format";
import type { Task } from "@/lib/types";
import { cn } from "@/lib/utils";
import { TOKEN } from "@/lib/tokens";

const TASK_STATUSES = ["all", "todo", "in_progress", "review", "done", "blocked", "on_hold"] as const;

const STATUS_COLUMNS = [
  { status: "todo", label: "To Do", color: TOKEN.neutral },
  { status: "in_progress", label: "In Progress", color: TOKEN.info },
  { status: "review", label: "Review", color: TOKEN.purple },
  { status: "done", label: "Done", color: TOKEN.success },
];

function TaskCard({ task }: { task: Task }) {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "done";
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow hover:border-[var(--brand-teal)]/50">
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium leading-tight">{task.title}</p>
          <StatusBadge status={task.priority as "critical" | "high" | "medium" | "low"} />
        </div>
        {task.projectName && (
          <p className="text-xs text-[var(--brand-teal)] mt-1 truncate" title={task.projectName ?? ""}>{task.projectName}</p>
        )}
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-muted-foreground">{task.assigneeName?.split(" ")[0]}</span>
          {task.dueDate && (
            <span className={cn("text-xs", isOverdue ? "text-red-600 font-semibold" : "text-muted-foreground")}>
              {isOverdue ? "Overdue · " : ""}{formatDate(task.dueDate)}
            </span>
          )}
        </div>
        {task.estimatedHours != null && (
          <div className="mt-2">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>{formatDuration(task.loggedHours ?? 0)} logged</span>
              <span>{formatDuration(task.estimatedHours)} est.</span>
            </div>
            <Progress
              value={Math.min(((task.loggedHours ?? 0) / task.estimatedHours) * 100, 100)}
              className="h-1"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function OperationsPage() {
  const [taskSearch, setTaskSearch] = useState("");
  const [assigneeFilter, setAssigneeFilter] = useState<string>("all");

  const { data: tasks } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => mockTasks,
  });

  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: () => mockProjects,
  });

  const assignees = Array.from(
    new Set((tasks ?? []).map((t) => t.assigneeName).filter(Boolean))
  ) as string[];

  const filteredTasks = (tasks ?? []).filter((t) => {
    const matchSearch =
      !taskSearch ||
      t.title.toLowerCase().includes(taskSearch.toLowerCase()) ||
      t.assigneeName?.toLowerCase().includes(taskSearch.toLowerCase());
    const matchAssignee = assigneeFilter === "all" || t.assigneeName === assigneeFilter;
    return matchSearch && matchAssignee;
  });

  const byStatus = STATUS_COLUMNS.reduce<Record<string, Task[]>>((acc, col) => {
    acc[col.status] = filteredTasks.filter((t) => t.status === col.status);
    return acc;
  }, {});

  const overdueTasks = (tasks ?? []).filter(
    (t) => t.dueDate && new Date(t.dueDate) < new Date() && !["done", "cancelled"].includes(t.status)
  );

  const totalLoggedHours = (tasks ?? []).reduce((s, t) => s + (t.loggedHours ?? 0), 0);

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Operations"
        description="Tasks, projects, and team productivity"
        actions={
          <Button className="bg-[var(--brand-navy)] hover:bg-[var(--brand-navy)]/90 text-white gap-2">
            <Plus className="h-4 w-4" />
            New Task
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total Tasks", value: (tasks ?? []).length.toString() },
          { label: "In Progress", value: (tasks ?? []).filter((t) => t.status === "in_progress").length.toString() },
          { label: "Overdue", value: overdueTasks.length.toString(), danger: overdueTasks.length > 0 },
          { label: "Hours Logged", value: `${totalLoggedHours.toFixed(0)}h` },
        ].map((stat) => (
          <Card key={stat.label} className={stat.danger ? "border-red-200 bg-red-50/50" : ""}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className={cn("text-xl font-bold mt-1", stat.danger ? "text-red-600" : "")}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="board">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <TabsList className="h-9">
            <TabsTrigger value="board">Board</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
          </TabsList>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search tasks…"
                value={taskSearch}
                onChange={(e) => setTaskSearch(e.target.value)}
                className="pl-9 h-9 w-48"
              />
            </div>
            <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
              <SelectTrigger className="w-40 h-9">
                <SelectValue placeholder="All assignees" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assignees</SelectItem>
                {assignees.map((a) => (
                  <SelectItem key={a} value={a}>{a}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="board" className="mt-4">
          <div className="flex gap-4 overflow-x-auto pb-4">
            {STATUS_COLUMNS.map((col) => (
              <div key={col.status} className="flex-1 min-w-[240px] max-w-[300px]">
                <div className="flex items-center gap-2 mb-3 px-1">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: col.color }} />
                  <span className="text-sm font-semibold">{col.label}</span>
                  <Badge variant="outline" className="h-5 text-xs px-1.5">{byStatus[col.status]?.length ?? 0}</Badge>
                </div>
                <div className="space-y-2 min-h-[80px]">
                  {(byStatus[col.status] ?? []).map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list" className="mt-4">
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    {["Task", "Project", "Assignee", "Priority", "Status", "Due Date", "Hours"].map((h) => (
                      <th key={h} className="h-10 px-4 text-left text-xs font-semibold text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((task) => {
                    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !["done", "cancelled"].includes(task.status);
                    return (
                      <tr key={task.id} className="border-b hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-medium">{task.title}</p>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">{task.projectName ?? "—"}</td>
                        <td className="px-4 py-3 text-muted-foreground">{task.assigneeName}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={task.priority as "critical" | "high" | "medium" | "low"} />
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={task.status as "todo" | "in_progress" | "review" | "done" | "blocked"} />
                        </td>
                        <td className={cn("px-4 py-3 text-xs", isOverdue ? "text-red-600 font-semibold" : "text-muted-foreground")}>
                          {formatDate(task.dueDate ?? null)}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs tabular-nums">
                          {task.loggedHours ?? 0}h / {task.estimatedHours ?? 0}h
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(projects ?? []).map((project) => (
              <Card key={project.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold truncate" title={project.name}>{project.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{project.description}</p>
                    </div>
                    <StatusBadge status={project.status} />
                  </div>

                  <div className="mt-3 space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold">{project.completionPercent ?? project.percentComplete ?? 0}%</span>
                    </div>
                    <Progress value={project.completionPercent ?? project.percentComplete ?? 0} className="h-1.5" />
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-muted-foreground">Tasks</p>
                      <p className="font-semibold">{project.completedTaskCount}/{project.taskCount}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Owner</p>
                      <p className="font-semibold">{project.ownerName?.split(" ")[0]}</p>
                    </div>
                  </div>

                  {project.endDate && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Due: {formatDate(project.endDate)}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

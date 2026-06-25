export type TaskPriority = "critical" | "high" | "medium" | "low";
export type TaskStatus = "todo" | "in_progress" | "review" | "blocked" | "done" | "cancelled";

export interface TimeLog {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  hours: number;
  date: string;
  note?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  projectId?: string;
  projectName?: string;
  assigneeId?: string;
  assigneeName?: string;
  assigneeAvatar?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  loggedHours?: number;
  timeLogs?: TimeLog[];
  tags?: string[];
  dependencies?: string[];
  createdAt: string;
  updatedAt: string;
}

export type ProjectStatus = "planning" | "active" | "on_hold" | "completed" | "cancelled";

export interface Project {
  id: string;
  name: string;
  description?: string;
  customerId?: string;
  customerName?: string;
  ownerId: string;
  ownerName: string;
  status: ProjectStatus;
  startDate: string;
  endDate?: string;
  budget?: number;
  budgetUsed?: number;
  taskCount: number;
  completedTaskCount: number;
  percentComplete: number;
  completionPercent?: number;
  createdAt: string;
}

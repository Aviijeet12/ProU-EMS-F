"use client";

import { useState, useMemo } from "react";
import { useAuth } from "@/context/auth-context";
import { useData, type Task } from "@/context/data-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "todo", label: "Pending" },
  { value: "in-progress", label: "In Progress" },
  { value: "done", label: "Completed" },
];

export default function EmployeeTasksPage() {
  const { user } = useAuth();
  const { employees, tasks, updateTask } = useData();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Always define hooks first
  const employee = employees.find((e) => e.owner === user?.id) || null;
  const employeeId = employee?._id;
  // Robust filter: match by assignee ID or assignee.email
  const myTasks = employeeId ? tasks.filter((t) => {
    if (typeof t.assignee === "object" && t.assignee !== null) {
      if (t.assignee._id && t.assignee._id === employeeId) return true;
      if (t.assignee.email && user?.email && t.assignee.email === user.email) return true;
    } else if (typeof t.assignee === "string") {
      if (t.assignee === employeeId) return true;
    }
    return false;
  }) : [];
  console.log('DEBUG employee tasks page tasks:', tasks);
  console.log('DEBUG employee tasks page myTasks:', myTasks);
  console.log('DEBUG employee tasks page employee:', employee);
  console.log('DEBUG employee tasks page user:', user);
  const filteredTasks = useMemo(() => {
    return myTasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        (task.description?.toLowerCase().includes(search.toLowerCase()) ?? false);

      const matchesStatus =
        statusFilter === "all" || task.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [myTasks, search, statusFilter]);

  if (!employeeId) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground text-lg">
          No employee profile found. Please complete your profile first.
        </p>
      </div>
    );
  }

  const handleUpdateStatus = async (
    task: Task,
    newStatus: "todo" | "in-progress" | "done"
  ) => {
    await updateTask(task._id, { status: newStatus });
    toast.success(`Task marked as ${newStatus.replace("-", " ")}`);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-400 bg-red-400/10 border-red-400/30";
      case "medium":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/30";
      case "low":
        return "text-green-400 bg-green-400/10 border-green-400/30";
      default:
        return "text-muted-foreground bg-secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-primary" />;
      case "in-progress":
        return <Clock className="w-5 h-5 text-accent" />;
      case "pending":
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Tasks</h1>
        <p className="text-muted-foreground">
          Track and update your assigned tasks
        </p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-11 h-12 bg-secondary/50 border-border/50 rounded-xl"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48 h-12 bg-secondary/50 border-border/50 rounded-xl">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground">No tasks found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <div
              key={task._id}
              className="glass-card rounded-2xl p-6 hover:border-accent/30 transition-all duration-300"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Task Info */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="mt-1">{getStatusIcon(task.status)}</div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg mb-1">{task.title}</h3>

                    <p className="text-muted-foreground text-sm mb-3">
                      {task.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          "text-xs px-2 py-1 rounded-full border font-medium",
                          getPriorityColor(task.priority || "medium")
                        )}
                      >
                        {(task.priority ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1) : "Medium")} {" "}
                        Priority
                      </span>

                      <span className="text-xs text-muted-foreground">
                        Due:{" "}
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }) : "No Due Date"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 lg:flex-shrink-0">
                  {task.status === "todo" && (
                    <Button
                      onClick={() =>
                        handleUpdateStatus(task, "in-progress")
                      }
                      className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl"
                    >
                      Start Task
                    </Button>
                  )}

                  {task.status === "in-progress" && (
                    <Button
                      onClick={() =>
                        handleUpdateStatus(task, "done")
                      }
                      className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl"
                    >
                      Mark Complete
                    </Button>
                  )}

                  {task.status === "done" && (
                    <span className="px-4 py-2 rounded-xl bg-primary/10 text-primary font-medium text-sm">
                      Completed
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

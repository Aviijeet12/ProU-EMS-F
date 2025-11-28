"use client";

import { type Task, useData } from "@/context/data-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Calendar, User, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const statusConfig = {
  todo: {
    label: "Pending",
    class: "border-warning/50 bg-warning/10 text-warning",
    glow: "shadow-warning/20",
  },
  "in-progress": {
    label: "In Progress",
    class: "border-info/50 bg-info/10 text-info",
    glow: "shadow-info/20",
  },
  done: {
    label: "Completed",
    class: "border-primary/50 bg-primary/10 text-primary",
    glow: "shadow-primary/20",
  },
};

const priorityConfig = {
  low: {
    label: "Low",
    class: "text-muted-foreground",
    dot: "bg-muted-foreground",
  },
  medium: {
    label: "Medium",
    class: "text-warning",
    dot: "bg-warning",
  },
  high: {
    label: "High",
    class: "text-destructive",
    dot: "bg-destructive animate-pulse",
  },
};

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
    console.log('DEBUG TaskCard:', { task });
  const { employees } = useData();

  // FIX: match backend IDs (task.assignee is MongoDB _id)
  let assignedEmployee = undefined;
  let assigneeEmail = undefined;
  if (typeof task.assignee === "object" && task.assignee !== null) {
    if (typeof (task.assignee as any)._id === "string") {
      assignedEmployee = employees.find((e) => e._id === (task.assignee as any)._id);
    }
    if (typeof (task.assignee as any).email === "string") {
      assigneeEmail = (task.assignee as any).email;
    }
  } else if (typeof task.assignee === "string") {
    assignedEmployee = employees.find((e) => e._id === task.assignee);
  }

  const status = statusConfig[task.status as keyof typeof statusConfig] || statusConfig["todo"];
  const priority = priorityConfig[task.priority as keyof typeof priorityConfig] || priorityConfig["medium"];

  return (
    <div className="glass-card rounded-2xl p-6 group card-lift relative overflow-hidden">
      <div
        className={cn(
          "absolute top-0 left-0 right-0 h-1 rounded-t-2xl",
          task.status === "todo" &&
            "bg-gradient-to-r from-warning/50 via-warning to-warning/50",
          task.status === "in-progress" &&
            "bg-gradient-to-r from-info/50 via-info to-info/50",
          task.status === "done" &&
            "bg-gradient-to-r from-primary/50 via-primary to-primary/50"
        )}
      />

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className={cn(
              "rounded-xl px-3 py-1",
              status.class,
              `shadow-lg ${status.glow}`
            )}
          >
            {status.label}
          </Badge>

          <div className="flex items-center gap-2">
            <span className={cn("w-2 h-2 rounded-full", priority.dot)} />
            <span className={cn("text-xs font-semibold", priority.class)}>
              {priority.label}
            </span>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-xl"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="glass border-border/50 rounded-xl"
          >
            <DropdownMenuItem
              onClick={() => onEdit(task)}
              className="gap-2 rounded-lg"
            >
              <Edit className="h-4 w-4" /> Edit
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => onDelete(task)}
              className="gap-2 text-destructive focus:text-destructive rounded-lg"
            >
              <Trash2 className="h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors duration-300 neon-underline inline-block">
        {task.title}
      </h3>

      <p className="text-sm text-muted-foreground line-clamp-2 mb-5">
        {task.description}
      </p>

      <div className="pt-4 border-t border-border/30 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors">
          <div className="w-8 h-8 rounded-lg bg-secondary/50 flex items-center justify-center">
            <User className="h-4 w-4" />
          </div>
          <span className="font-medium">
            {assignedEmployee
              ? `${assignedEmployee.name}${assignedEmployee.email ? ` (${assignedEmployee.email})` : ""}`
              : assigneeEmail
                ? assigneeEmail
                : "Unassigned"}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>
            {new Date(task.dueDate ?? "1970-01-01").toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}

"use client";

import type { Employee } from "@/context/data-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Mail, Building, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface EmployeeCardProps {
  employee: Employee;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

export function EmployeeCard({ employee, onEdit, onDelete }: EmployeeCardProps) {
  return (
    <div className="glass-card rounded-2xl p-6 hover:glow-primary transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center group-hover:scale-105 transition-transform">
            <span className="text-xl font-bold text-primary">
              {employee.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
          </div>

          <div>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {employee.name}
            </h3>
            <p className="text-sm text-muted-foreground">{employee.position}</p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="glass border-border/50">
            <DropdownMenuItem
              onClick={() => onEdit(employee)}
              className="gap-2"
            >
              <Edit className="h-4 w-4" /> Edit
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => onDelete(employee)}
              className="gap-2 text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="h-4 w-4" />
          <span className="truncate">{employee.email}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Building className="h-4 w-4" />
          <span>{employee.department}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
        <Badge
          variant="outline"
          className={cn(
            "rounded-lg",
            employee.status === "active"
              ? "border-primary/50 bg-primary/10 text-primary"
              : "border-muted-foreground/50 bg-muted text-muted-foreground"
          )}
        >
          {employee.status === "active" ? "● Active" : "○ Inactive"}
        </Badge>
      </div>
    </div>
  );
}

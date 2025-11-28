"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { type Employee, useData } from "@/context/data-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface EmployeeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee?: Employee | null;
}

const departments = ["Engineering", "Design", "Marketing", "Product", "HR", "Finance", "Sales"];

export function EmployeeFormModal({ isOpen, onClose, employee }: EmployeeFormModalProps) {
  const { addEmployee, updateEmployee, reload } = useData();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    position: "",
    status: "active" as "active" | "inactive",
  });

  const [isLoading, setIsLoading] = useState(false);

  // Pre-fill form when editing
  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name,
        email: employee.email ?? "",
        department: employee.department ?? "",
        position: employee.position ?? "",
        status: employee.status === "inactive" ? "inactive" : "active",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        department: "",
        position: "",
        status: "active",
      });
    }
  }, [employee, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      name: formData.name,
      email: formData.email,
      department: formData.department,
      position: formData.position,
      status: formData.status,
    };

    setIsLoading(true);
    if (employee && employee._id) {
      await updateEmployee(employee._id, payload);
      toast.success("Employee updated successfully");
    } else {
      await addEmployee(payload);
      toast.success("Employee added successfully");
    }
    await reload();
    setIsLoading(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass border-border/50 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {employee ? "Edit Employee" : "Add New Employee"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="John Doe"
              required
              className="bg-secondary/50 border-border/50"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="john@company.com"
              required
              className="bg-secondary/50 border-border/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Department */}
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select
                value={formData.department}
                onValueChange={(value) =>
                  setFormData({ ...formData, department: value })
                }
              >
                <SelectTrigger className="bg-secondary/50 border-border/50">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="glass border-border/50">
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "active" | "inactive") =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger className="bg-secondary/50 border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass border-border/50">
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Position */}
          <div className="space-y-2">
            <Label htmlFor="position">Position</Label>
            <Input
              id="position"
              value={formData.position}
              onChange={(e) =>
                setFormData({ ...formData, position: e.target.value })
              }
              placeholder="Software Engineer"
              required
              className="bg-secondary/50 border-border/50"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-border/50 bg-transparent"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isLoading ? "Saving..." : employee ? "Update" : "Add Employee"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { useData } from "@/context/data-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Phone, Briefcase, Save, X, Edit3 } from "lucide-react";
import { toast } from "sonner";

export default function EmployeeProfilePage() {
  const { user } = useAuth();
  const { employees, tasks, updateEmployee } = useData();

  const employee = employees.find(
    (e) => String(e.owner) === String(user?.id)
  );

  const employeeId = employee?._id;

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || user?.name || "",
        email: employee.email || user?.email || "",
        phone: employee.phone || "Not Provided",
        position: employee.position || "Employee",
      });
    }
  }, [employee, user]);

  if (!employee) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground text-lg">
          No profile found for your account.
        </p>
      </div>
    );
  }

  const myTasks = tasks.filter((t) => t.assignee === employeeId);
  const completedTasks = myTasks.filter((t) => t.status === "done").length;
  const inProgressTasks = myTasks.filter(
    (t) => t.status === "in-progress"
  ).length;

  const handleSave = async () => {
    if (!employeeId) return;

    await updateEmployee(employeeId, formData);

    toast.success("Profile updated");
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: employee.name || "",
      email: employee.email || "",
      phone: employee.phone || "Not Provided",
      position: employee.position || "Employee",
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground">
            View and manage your profile
          </p>
        </div>

        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel} className="rounded-xl">
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="glass-card rounded-2xl p-6 text-center">
          <div className="w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl font-bold text-accent">
              {formData.name.charAt(0).toUpperCase()}
            </span>
          </div>

          <h2 className="text-xl font-bold mb-1">{formData.name}</h2>
          <p className="text-accent font-medium">{formData.position}</p>
          <p className="text-muted-foreground text-sm">{formData.email}</p>

          <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-border/50">
            <div>
              <p className="text-2xl font-bold text-primary">{completedTasks}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-accent">{inProgressTasks}</p>
              <p className="text-xs text-muted-foreground">In Progress</p>
            </div>
          </div>
        </div>

        {/* Editable Fields */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 space-y-6">
          <div className="space-y-2">
            <Label>Full Name</Label>
            {isEditing ? (
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-12 bg-secondary/50 rounded-xl"
              />
            ) : (
              <p className="font-medium">{formData.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Mail className="w-4 h-4" /> Email Address
            </Label>
            {isEditing ? (
              <Input
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="h-12 bg-secondary/50 rounded-xl"
              />
            ) : (
              <p className="font-medium">{formData.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Phone className="w-4 h-4" /> Phone Number
            </Label>
            {isEditing ? (
              <Input
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="h-12 bg-secondary/50 rounded-xl"
              />
            ) : (
              <p className="font-medium">{formData.phone}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" /> Position
            </Label>
            {isEditing ? (
              <Input
                value={formData.position}
                onChange={(e) =>
                  setFormData({ ...formData, position: e.target.value })
                }
                className="h-12 bg-secondary/50 rounded-xl"
              />
            ) : (
              <p className="font-medium">{formData.position}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

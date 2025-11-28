"use client"

import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { useData } from "@/context/data-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, Building2, Briefcase, Calendar, Edit3, Save, X } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export default function EmployeeProfilePage() {
  const { user } = useAuth()
  const { getEmployeeById, updateEmployee, tasks } = useData()
  const [isEditing, setIsEditing] = useState(false)

  const employeeId = user?.employeeId || "1"
  const employee = getEmployeeById(employeeId)

  const [formData, setFormData] = useState({
    name: employee?.name || "",
    email: employee?.email || "",
    phone: employee?.phone || "",
    bio: employee?.bio || "",
  })

  // Get task stats for this employee
  const myTasks = tasks.filter((t) => t.assignedTo === employeeId)
  const completedTasks = myTasks.filter((t) => t.status === "completed").length
  const inProgressTasks = myTasks.filter((t) => t.status === "in-progress").length

  const handleSave = () => {
    updateEmployee(employeeId, formData)
    toast.success("Profile updated successfully")
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      name: employee?.name || "",
      email: employee?.email || "",
      phone: employee?.phone || "",
      bio: employee?.bio || "",
    })
    setIsEditing(false)
  }

  if (!employee) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Employee profile not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground">View and manage your profile information</p>
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
            <Button variant="outline" onClick={handleCancel} className="rounded-xl bg-transparent">
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl">
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
            <span className="text-3xl font-bold text-accent">{employee.name.charAt(0).toUpperCase()}</span>
          </div>
          <h2 className="text-xl font-bold mb-1">{employee.name}</h2>
          <p className="text-accent font-medium mb-1">{employee.position}</p>
          <p className="text-muted-foreground text-sm">{employee.department}</p>

          <div
            className={cn(
              "mt-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
              employee.status === "active" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
            )}
          >
            <span
              className={cn(
                "w-2 h-2 rounded-full mr-2",
                employee.status === "active" ? "bg-primary" : "bg-muted-foreground",
              )}
            />
            {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
          </div>

          {/* Stats */}
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

        {/* Details */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-6">Profile Information</h3>

          <div className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Full Name</Label>
              {isEditing ? (
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-12 bg-secondary/50 border-border/50 rounded-xl"
                />
              ) : (
                <p className="text-foreground font-medium">{employee.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email Address
              </Label>
              {isEditing ? (
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-12 bg-secondary/50 border-border/50 rounded-xl"
                />
              ) : (
                <p className="text-foreground font-medium">{employee.email}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground flex items-center gap-2">
                <Phone className="w-4 h-4" /> Phone Number
              </Label>
              {isEditing ? (
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="h-12 bg-secondary/50 border-border/50 rounded-xl"
                />
              ) : (
                <p className="text-foreground font-medium">{employee.phone || "Not provided"}</p>
              )}
            </div>

            {/* Department & Position (Read-only) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground flex items-center gap-2">
                  <Building2 className="w-4 h-4" /> Department
                </Label>
                <p className="text-foreground font-medium">{employee.department}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground flex items-center gap-2">
                  <Briefcase className="w-4 h-4" /> Position
                </Label>
                <p className="text-foreground font-medium">{employee.position}</p>
              </div>
            </div>

            {/* Join Date */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Join Date
              </Label>
              <p className="text-foreground font-medium">{employee.joinDate}</p>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Bio</Label>
              {isEditing ? (
                <Textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="min-h-[100px] bg-secondary/50 border-border/50 rounded-xl resize-none"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="text-foreground">{employee.bio || "No bio provided"}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

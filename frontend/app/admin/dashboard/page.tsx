"use client"

import { useData } from "@/context/data-context"
import { useAuth } from "@/context/auth-context"
import { StatsCard } from "@/components/stats-card"
import { TaskCard } from "@/components/task-card"
import { Users, CheckSquare, Clock, TrendingUp, Sparkles } from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { useState } from "react"
import { TaskFormModal } from "@/components/task-form-modal"
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal"
import type { Task } from "@/context/data-context"
import { toast } from "sonner"

const activityData = [
  { name: "Mon", tasks: 12, completed: 8 },
  { name: "Tue", tasks: 19, completed: 14 },
  { name: "Wed", tasks: 15, completed: 12 },
  { name: "Thu", tasks: 22, completed: 18 },
  { name: "Fri", tasks: 18, completed: 15 },
  { name: "Sat", tasks: 8, completed: 6 },
  { name: "Sun", tasks: 5, completed: 4 },
]

export default function AdminDashboardPage() {
  const { employees, tasks, deleteTask } = useData()
  const { user } = useAuth()
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [deletingTask, setDeletingTask] = useState<Task | null>(null)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)

  const activeEmployees = employees.filter((e) => e.status === "active").length
  const pendingTasks = tasks.filter((t) => t.status === "todo").length
  const inProgressTasks = tasks.filter((t) => t.status === "in-progress").length
  const completedTasks = tasks.filter((t) => t.status === "done").length
  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4)

  const pieData = [
    { name: "Pending", value: pendingTasks, color: "#facc15" },
    { name: "In Progress", value: inProgressTasks, color: "#00d4ff" },
    { name: "Completed", value: completedTasks, color: "#00ffd5" },
  ]

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setIsTaskModalOpen(true)
  }

  const handleDeleteTask = (task: Task) => {
    setDeletingTask(task)
  }

  const confirmDeleteTask = () => {
    if (deletingTask) {
      deleteTask(deletingTask._id)
      toast.success("Task deleted successfully")
      setDeletingTask(null)
    }
  }

  return (
    <div className="space-y-8">
      <div className="relative">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-4xl font-bold">
            Welcome back, <span className="text-primary text-glow">{user?.name || "Admin"}</span>
          </h1>
          <Sparkles className="w-8 h-8 text-primary animate-pulse" />
        </div>
        <p className="text-muted-foreground text-lg">{"Here's what's happening with your team today"}</p>
        <div className="absolute -bottom-4 left-0 w-32 h-1 bg-gradient-to-r from-primary to-accent rounded-full" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-4">
        <StatsCard
          title="Total Employees"
          value={employees.length}
          change={`${activeEmployees} active`}
          icon={Users}
        />
        <StatsCard
          title="Total Tasks"
          value={tasks.length}
          change={`${pendingTasks} pending`}
          icon={CheckSquare}
          iconColor="text-accent"
        />
        <StatsCard
          title="In Progress"
          value={inProgressTasks}
          change="Active tasks"
          icon={Clock}
          iconColor="text-info"
        />
        <StatsCard
          title="Completed"
          value={completedTasks}
          change={`${Math.round((completedTasks / tasks.length) * 100) || 0}% completion rate`}
          icon={TrendingUp}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent/10 to-transparent rounded-bl-full" />
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            Weekly Activity
            <span className="text-xs font-normal text-muted-foreground bg-secondary/50 px-2 py-1 rounded-lg">
              Last 7 days
            </span>
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ffd5" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#00ffd5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={12} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(10, 10, 18, 0.95)",
                    border: "1px solid rgba(0, 255, 213, 0.2)",
                    borderRadius: "16px",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="tasks"
                  stroke="#00d4ff"
                  fillOpacity={1}
                  fill="url(#colorTasks)"
                  strokeWidth={3}
                />
                <Area
                  type="monotone"
                  dataKey="completed"
                  stroke="#00ffd5"
                  fillOpacity={1}
                  fill="url(#colorCompleted)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Distribution */}
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full" />
          <h2 className="text-xl font-bold mb-6">Task Distribution</h2>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(10, 10, 18, 0.95)",
                    border: "1px solid rgba(0, 255, 213, 0.2)",
                    borderRadius: "16px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-5 mt-4">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full shadow-lg"
                  style={{ backgroundColor: item.color, boxShadow: `0 0 10px ${item.color}50` }}
                />
                <span className="text-sm text-muted-foreground font-medium">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Tasks */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Recent Tasks</h2>
          <div className="h-px flex-1 mx-4 bg-gradient-to-r from-border to-transparent" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {recentTasks.map((task) => (
            <TaskCard key={task._id} task={task} onEdit={handleEditTask} onDelete={handleDeleteTask} />
          ))}
        </div>
      </div>

      <TaskFormModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false)
          setEditingTask(null)
        }}
        task={editingTask}
      />

      <DeleteConfirmationModal
        isOpen={!!deletingTask}
        onClose={() => setDeletingTask(null)}
        onConfirm={confirmDeleteTask}
        title="Delete Task"
        description="Are you sure you want to delete this task? This action cannot be undone."
      />
    </div>
  )
}

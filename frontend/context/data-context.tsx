"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export interface Employee {
  id: string
  name: string
  email: string
  department: string
  position: string
  status: "active" | "inactive"
  avatar?: string
  joinDate: string
  phone?: string
  bio?: string
}

export interface Task {
  id: string
  title: string
  description: string
  status: "pending" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
  assignedTo: string
  dueDate: string
  createdAt: string
}

interface DataContextType {
  employees: Employee[]
  tasks: Task[]
  addEmployee: (employee: Omit<Employee, "id">) => void
  updateEmployee: (id: string, employee: Partial<Employee>) => void
  deleteEmployee: (id: string) => void
  addTask: (task: Omit<Task, "id" | "createdAt">) => void
  updateTask: (id: string, task: Partial<Task>) => void
  deleteTask: (id: string) => void
  getEmployeeTasks: (employeeId: string) => Task[]
  getEmployeeById: (id: string) => Employee | undefined
}

const mockEmployees: Employee[] = [
  {
    id: "1",
    name: "Alex Morgan",
    email: "alex@proums.io",
    department: "Engineering",
    position: "Senior Developer",
    status: "active",
    joinDate: "2023-01-15",
    phone: "+1 234 567 8901",
    bio: "Passionate full-stack developer with 5+ years of experience in building scalable applications.",
  },
  {
    id: "2",
    name: "Sarah Chen",
    email: "sarah@proums.io",
    department: "Design",
    position: "UI/UX Lead",
    status: "active",
    joinDate: "2023-03-20",
    phone: "+1 234 567 8902",
    bio: "Creative designer focused on creating intuitive and beautiful user experiences.",
  },
  {
    id: "3",
    name: "Marcus Johnson",
    email: "marcus@proums.io",
    department: "Marketing",
    position: "Marketing Manager",
    status: "active",
    joinDate: "2023-02-10",
    phone: "+1 234 567 8903",
    bio: "Strategic marketing professional with expertise in digital campaigns and brand building.",
  },
  {
    id: "4",
    name: "Emily Williams",
    email: "emily@proums.io",
    department: "Engineering",
    position: "Frontend Developer",
    status: "inactive",
    joinDate: "2022-11-05",
    phone: "+1 234 567 8904",
    bio: "Frontend specialist passionate about React and modern web technologies.",
  },
  {
    id: "5",
    name: "David Kim",
    email: "david@proums.io",
    department: "Product",
    position: "Product Manager",
    status: "active",
    joinDate: "2023-04-01",
    phone: "+1 234 567 8905",
    bio: "Product leader with a track record of shipping successful products at scale.",
  },
  {
    id: "6",
    name: "Jessica Taylor",
    email: "jessica@proums.io",
    department: "HR",
    position: "HR Specialist",
    status: "active",
    joinDate: "2023-05-15",
    phone: "+1 234 567 8906",
    bio: "HR professional dedicated to building inclusive and high-performing teams.",
  },
]

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Implement Dashboard Analytics",
    description: "Build real-time analytics dashboard with charts",
    status: "in-progress",
    priority: "high",
    assignedTo: "1",
    dueDate: "2024-12-20",
    createdAt: "2024-11-01",
  },
  {
    id: "2",
    title: "Design System Update",
    description: "Update component library with new brand colors",
    status: "completed",
    priority: "medium",
    assignedTo: "2",
    dueDate: "2024-11-30",
    createdAt: "2024-10-15",
  },
  {
    id: "3",
    title: "Q4 Marketing Campaign",
    description: "Launch holiday marketing campaign across all channels",
    status: "pending",
    priority: "high",
    assignedTo: "3",
    dueDate: "2024-12-15",
    createdAt: "2024-11-10",
  },
  {
    id: "4",
    title: "API Documentation",
    description: "Complete REST API documentation for v2",
    status: "in-progress",
    priority: "medium",
    assignedTo: "1",
    dueDate: "2024-12-10",
    createdAt: "2024-11-05",
  },
  {
    id: "5",
    title: "User Research Study",
    description: "Conduct user interviews for new features",
    status: "pending",
    priority: "low",
    assignedTo: "5",
    dueDate: "2024-12-25",
    createdAt: "2024-11-12",
  },
  {
    id: "6",
    title: "Performance Optimization",
    description: "Optimize database queries and caching",
    status: "completed",
    priority: "high",
    assignedTo: "1",
    dueDate: "2024-11-25",
    createdAt: "2024-10-20",
  },
]

const DataContext = createContext<DataContextType | null>(null)

export function DataProvider({ children }: { children: ReactNode }) {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees)
  const [tasks, setTasks] = useState<Task[]>(mockTasks)

  const addEmployee = (employee: Omit<Employee, "id">) => {
    const newEmployee = { ...employee, id: Date.now().toString() }
    setEmployees((prev) => [...prev, newEmployee])
  }

  const updateEmployee = (id: string, employee: Partial<Employee>) => {
    setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, ...employee } : e)))
  }

  const deleteEmployee = (id: string) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id))
  }

  const addTask = (task: Omit<Task, "id" | "createdAt">) => {
    const newTask = { ...task, id: Date.now().toString(), createdAt: new Date().toISOString().split("T")[0] }
    setTasks((prev) => [...prev, newTask])
  }

  const updateTask = (id: string, task: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...task } : t)))
  }

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  const getEmployeeTasks = (employeeId: string) => {
    return tasks.filter((t) => t.assignedTo === employeeId)
  }

  const getEmployeeById = (id: string) => {
    return employees.find((e) => e.id === id)
  }

  return (
    <DataContext.Provider
      value={{
        employees,
        tasks,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        addTask,
        updateTask,
        deleteTask,
        getEmployeeTasks,
        getEmployeeById,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}

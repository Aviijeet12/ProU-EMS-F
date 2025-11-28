"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "employee"
  employeeId?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; role?: "admin" | "employee" }>
  register: (name: string, email: string, password: string, role: "admin" | "employee") => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

const ADMIN_EMAIL = "admin@proums.io"
const ADMIN_PASSWORD = "admin123"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem("proums_user")
    const token = localStorage.getItem("proums_token")

    if (storedUser && token) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; role?: "admin" | "employee" }> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (email && password.length >= 6) {
      const isAdmin = email.toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD

      const mockUser: User = {
        id: isAdmin ? "admin-1" : Date.now().toString(),
        email,
        name: isAdmin ? "Administrator" : email.split("@")[0],
        role: isAdmin ? "admin" : "employee",
        employeeId: isAdmin ? undefined : "1", // Link to first employee for demo
      }

      localStorage.setItem("proums_token", "mock_jwt_token_" + Date.now())
      localStorage.setItem("proums_user", JSON.stringify(mockUser))
      setUser(mockUser)
      return { success: true, role: mockUser.role }
    }
    return { success: false }
  }

  const register = async (
    name: string,
    email: string,
    password: string,
    role: "admin" | "employee",
  ): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (name && email && password.length >= 6) {
      const mockUser: User = {
        id: Date.now().toString(),
        email,
        name,
        role,
        employeeId: role === "employee" ? Date.now().toString() : undefined,
      }
      localStorage.setItem("proums_token", "mock_jwt_token_" + Date.now())
      localStorage.setItem("proums_user", JSON.stringify(mockUser))
      setUser(mockUser)
      return true
    }
    return false
  }

  const logout = () => {
    localStorage.removeItem("proums_token")
    localStorage.removeItem("proums_user")
    setUser(null)
    router.push("/login")
  }

  return <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

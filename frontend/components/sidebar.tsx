"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, CheckSquare, LogOut, Menu, X, Zap, UserCircle, ListTodo } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const adminNavItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/employees", label: "Employees", icon: Users },
  { href: "/admin/tasks", label: "Tasks", icon: CheckSquare },
]

const employeeNavItems = [
  { href: "/employee/dashboard", label: "My Dashboard", icon: LayoutDashboard },
  { href: "/employee/tasks", label: "My Tasks", icon: ListTodo },
  { href: "/employee/profile", label: "My Profile", icon: UserCircle },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const navItems = user?.role === "admin" ? adminNavItems : employeeNavItems

  return (
    <>
      {/* Mobile menu button - enhanced */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden glass rounded-xl"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-md z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-full w-72 glass border-r border-border/30 transition-transform duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-primary/0 via-primary/30 to-primary/0" />

        <div className="flex flex-col h-full p-6">
          <Link
            href={user?.role === "admin" ? "/admin/dashboard" : "/employee/dashboard"}
            className="flex items-center gap-3 mb-10 group"
            onClick={() => setIsOpen(false)}
          >
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center glow-primary group-hover:scale-110 transition-transform duration-300 border border-primary/30">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <div className="absolute inset-0 rounded-2xl border border-primary/30 animate-ping opacity-20" />
            </div>
            <div>
              <span className="text-xl font-bold text-foreground">
                ProU-<span className="text-primary text-glow">EMS</span>
              </span>
              <p className="text-xs text-muted-foreground">Management System</p>
            </div>
          </Link>

          <div
            className={cn(
              "mb-8 px-4 py-2.5 rounded-xl text-xs font-semibold text-center uppercase tracking-wider shimmer",
              user?.role === "admin"
                ? "bg-gradient-to-r from-primary/20 to-primary/10 text-primary border border-primary/30"
                : "bg-gradient-to-r from-accent/20 to-accent/10 text-accent border border-accent/30",
            )}
          >
            {user?.role === "admin" ? "Admin Portal" : "Employee Portal"}
          </div>

          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden",
                    isActive
                      ? "bg-gradient-to-r from-primary/20 to-primary/5 text-primary border border-primary/20"
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground border border-transparent",
                  )}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full shadow-lg shadow-primary/50" />
                  )}
                  <item.icon
                    className={cn(
                      "w-5 h-5 transition-all duration-300 group-hover:scale-110",
                      isActive && "text-primary drop-shadow-lg",
                    )}
                  />
                  <span className="font-medium">{item.label}</span>
                  {!isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  )}
                </Link>
              )
            })}
          </nav>

          <div className="pt-6 border-t border-border/30">
            <div className="flex items-center gap-3 mb-4 px-2 py-3 rounded-xl bg-secondary/20">
              <div
                className={cn(
                  "w-11 h-11 rounded-xl flex items-center justify-center border",
                  user?.role === "admin"
                    ? "bg-gradient-to-br from-primary/30 to-primary/10 border-primary/30"
                    : "bg-gradient-to-br from-accent/30 to-accent/10 border-accent/30",
                )}
              >
                <span className={cn("text-sm font-bold", user?.role === "admin" ? "text-primary" : "text-accent")}>
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{user?.name || "User"}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email || "user@example.com"}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl h-12 transition-all duration-300 group"
              onClick={logout}
            >
              <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}

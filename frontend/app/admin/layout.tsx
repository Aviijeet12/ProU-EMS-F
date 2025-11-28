"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { DataProvider } from "@/context/data-context"
import { Sidebar } from "@/components/sidebar"
import { ThreeBackground } from "@/components/three-background"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
    if (!isLoading && user && user.role !== "admin") {
      router.push("/employee/dashboard")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ThreeBackground />
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  if (!user || user.role !== "admin") {
    return null
  }

  return (
    <DataProvider>
      <ThreeBackground />
      <Sidebar />
      <main className="lg:pl-64 min-h-screen">
        <div className="p-4 lg:p-8 pt-20 lg:pt-8">{children}</div>
      </main>
    </DataProvider>
  )
}

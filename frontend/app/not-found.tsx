"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThreeBackground } from "@/components/three-background"
import { Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <ThreeBackground />

      <div className="text-center">
        <h1 className="text-[150px] font-bold leading-none text-glow text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved to another location.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button variant="outline" onClick={() => window.history.back()} className="gap-2 border-border/50">
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          <Link href="/dashboard">
            <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Home className="h-4 w-4" />
              Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThreeBackground } from "@/components/three-background";
import { Zap, Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);

    if (!result.success) {
      toast.error("Invalid credentials");
      return;
    }

    toast.success("Welcome back!");

    // Role based redirect from backend
    if (result.role === "admin") {
      router.push("/admin/dashboard");
    } else {
      router.push("/employee/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <ThreeBackground />

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/40 to-primary/10 flex items-center justify-center glow-primary border border-primary/30 float">
              <Zap className="w-8 h-8 text-primary" />
            </div>
            <Sparkles className="w-5 h-5 text-primary absolute -top-2 -right-2 animate-pulse" />
          </div>
          <div>
            <span className="text-3xl font-bold">
              ProU-<span className="text-primary text-glow">EMS</span>
            </span>
            <p className="text-sm text-muted-foreground">Employee Management System</p>
          </div>
        </div>

        {/* Login Card */}
        <div className="gradient-border p-8">
          <div className="glass rounded-2xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
              <p className="text-muted-foreground">Sign in to continue to your dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold tracking-wide">
                  Email Address
                </Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 h-14 bg-secondary/30 border-border/50 rounded-xl focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold tracking-wide">
                  Password
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 h-14 bg-secondary/30 border-border/50 rounded-xl focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>

              {/* SIGN IN BUTTON */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 rounded-xl font-bold text-base group relative overflow-hidden shimmer"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Sign In
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>
            </form>

            {/* Register link for EMPLOYEES ONLY */}
            <div className="mt-8 pt-6 border-t border-border/30 text-center">
              <p className="text-sm text-muted-foreground mb-5">New employee?</p>
              <Link href="/register">
                <Button
                  variant="outline"
                  className="w-full h-14 rounded-xl hover:bg-primary/10 hover:border-primary group transition-all duration-300"
                >
                  <span className="font-semibold">Create Employee Account</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}

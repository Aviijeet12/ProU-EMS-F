"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
  iconColor?: string;
}

export function StatsCard({
  title,
  value,
  change,
  icon: Icon,
  iconColor = "text-primary",
}: StatsCardProps) {
  return (
    <div className="glass-card rounded-2xl p-6 group card-lift relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-sm text-muted-foreground mb-2 font-medium tracking-wide uppercase">
            {title}
          </p>

          <p className="text-4xl font-bold text-foreground group-hover:text-glow transition-all duration-300">
            {value}
          </p>

          {change && (
            <p className="text-sm mt-3 font-medium text-muted-foreground">
              {change}
            </p>
          )}
        </div>

        {/* Icon */}
        <div
          className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110",
            "bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20",
            "group-hover:border-primary/40 group-hover:shadow-lg group-hover:shadow-primary/20"
          )}
        >
          <Icon className={cn("w-7 h-7", iconColor)} />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
}

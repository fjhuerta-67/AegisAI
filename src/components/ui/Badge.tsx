import * as React from "react"
import { cn } from "@/src/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'destructive' | 'warning' | 'outline' | 'secondary' | 'accent';
  children?: React.ReactNode;
  className?: string;
}

function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold font-sans transition-all duration-200",
        {
          "bg-blue-50 text-[#1A73E8] border border-blue-200/80": variant === "default",
          "bg-emerald-50 text-emerald-700 border border-emerald-200": variant === "success",
          "bg-rose-50 text-rose-700 border border-rose-200": variant === "destructive",
          "bg-amber-50 text-amber-800 border border-amber-200": variant === "warning",
          "bg-slate-900 text-white border border-slate-800 font-semibold": variant === "accent",
          "bg-slate-100 text-slate-700 border border-slate-200": variant === "secondary",
          "bg-transparent text-slate-700 border border-slate-300": variant === "outline",
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { Badge }

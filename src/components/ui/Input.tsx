import * as React from "react"
import { cn } from "@/src/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 font-sans transition-all duration-200 focus-visible:outline-none focus-visible:border-[#1A73E8] focus-visible:ring-2 focus-visible:ring-[#1A73E8]/20 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-100 shadow-2xs",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }

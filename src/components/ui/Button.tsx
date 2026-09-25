import * as React from "react"
import { cn } from "@/src/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-sans font-semibold transition-all duration-200 ease-out rounded-xl cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A73E8]/40 disabled:pointer-events-none disabled:opacity-50 select-none",
          {
            "bg-[#1A73E8] text-white border border-blue-600/40 hover:bg-[#1557B0] hover:shadow-sm active:scale-[0.98]": variant === 'primary',
            "bg-white border border-slate-300/90 text-slate-800 hover:bg-slate-100 hover:border-slate-400 active:scale-[0.98] shadow-xs": variant === 'secondary',
            "bg-slate-900 text-white border border-slate-800 hover:bg-slate-800 active:scale-[0.98] shadow-xs": variant === 'accent',
            "bg-rose-600 text-white border border-rose-700 hover:bg-rose-700 active:scale-[0.98] shadow-xs": variant === 'danger',
            "border border-slate-300 text-slate-700 hover:bg-slate-100/80 hover:text-slate-900 active:scale-[0.98]": variant === 'outline',
            "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80": variant === 'ghost',
            "h-8 px-3 text-xs gap-1.5": size === 'sm',
            "h-9 px-4 py-2 text-sm gap-2": size === 'md',
            "h-11 px-6 text-base gap-2.5": size === 'lg',
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }

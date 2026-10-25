import * as React from "react"
import { cn } from "@/src/lib/utils"

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        "text-[10px] uppercase opacity-60 font-bold tracking-[0.05em] font-sans text-gray-700 mb-1 block",
        className
      )}
      {...props}
    />
  )
)
Label.displayName = "Label"

export { Label }

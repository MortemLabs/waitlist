import * as React from "react"
import { cn } from "@/lib/utils"

export const Select = React.forwardRef<HTMLSelectElement, React.ComponentProps<"select">>(
  ({ className, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "flex h-12 w-full rounded-none border border-input bg-ink px-4 py-3 text-base text-foreground outline-none transition-colors duration-100 ease-out focus-visible:border-signal focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none md:text-sm",
        className,
      )}
      {...props}
    />
  ),
)

Select.displayName = "Select"

import * as React from "react"
import { cn } from "@/lib/utils"

export const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "flex h-12 w-full rounded-none border border-input bg-ink px-4 py-3 text-base text-foreground shadow-none outline-none transition-colors duration-100 ease-out placeholder:text-fg-muted focus-visible:border-signal focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none md:text-sm",
        className,
      )}
      {...props}
    />
  ),
)

Input.displayName = "Input"

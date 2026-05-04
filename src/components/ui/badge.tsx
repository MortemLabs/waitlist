import { type VariantProps, cva } from "class-variance-authority"
import type * as React from "react"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex min-h-6 items-center rounded-none border px-2 py-0.5 font-mono text-[0.6875rem] uppercase tracking-[0.16em]",
  {
    defaultVariants: {
      variant: "default",
    },
    variants: {
      variant: {
        default: "border-line bg-ink-3 text-paper",
        error: "border-signal bg-transparent text-signal",
        outline: "border-line text-foreground",
        secondary: "border-line bg-ink-2 text-paper",
        success: "border-line bg-transparent text-paper",
        warning: "border-signal/60 bg-transparent text-signal",
      },
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ className, variant }))} {...props} />
}

import { cn } from "@/lib/utils"

type MarkProps = {
  alt?: string
  className?: string
  size?: number
}

export function Mark({ alt = "", className, size = 32 }: MarkProps) {
  return (
    <img
      src="/mortem-icon.svg"
      alt={alt}
      width={size}
      height={size}
      className={cn("inline-block align-middle", className)}
      decoding="async"
    />
  )
}

export function Wordmark({ className, size = 28 }: { className?: string; size?: number }) {
  return (
    <span className={cn("inline-flex items-center gap-3 align-middle", className)}>
      <Mark size={size} alt="Mortem" />
      <span className="font-display text-3xl leading-none">
        Mortem<span className="pl-0.5 text-signal">.</span>
      </span>
    </span>
  )
}

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function XLogo({ className }: Readonly<{ className?: string }>) {
  return (
    <svg
      aria-hidden
      className={cn("shrink-0", className)}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

type XUpdatesLinkProps = Readonly<{
  className?: string
  handle: string
  href: string
  /** Header: tight with nav buttons. Footer: slightly more padded. */
  density?: "header" | "footer"
}>

export function XUpdatesLink({ className, density = "header", handle, href }: XUpdatesLinkProps) {
  return (
    <a
      aria-label={`Mortem updates on X (@${handle})`}
      className={cn(
        density === "header" && buttonVariants({ variant: "ghost", size: "default" }),
        density === "header" && "group max-w-full",
        density === "footer" &&
          "inline-flex max-w-full items-center gap-2.5 whitespace-nowrap border border-line bg-ink-2 px-3 py-2.5 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-foreground transition-colors duration-100 ease-out hover:border-signal hover:bg-ink-3 active:translate-y-px motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 group",
        className,
      )}
      href={href}
      rel="noopener noreferrer"
      target="_blank"
    >
      <span className="flex shrink-0 items-center justify-center text-foreground transition-colors duration-100 group-hover:text-signal">
        <XLogo className={density === "footer" ? "size-5" : "size-[18px]"} />
      </span>
      <span
        className={cn(
          "truncate",
          density === "footer" && "font-normal normal-case tracking-normal",
        )}
      >
        @{handle}
      </span>
    </a>
  )
}

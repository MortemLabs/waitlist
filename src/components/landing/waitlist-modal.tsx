"use client"

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { X } from "lucide-react"
import { useEffect, useId, useState } from "react"
import { Button, type ButtonProps } from "@/components/ui/button"
import { WaitlistForm } from "./waitlist-form"

type WaitlistModalProps = {
  referredByCode?: string | null
  triggerLabel: string
  triggerSize?: ButtonProps["size"]
  triggerVariant?: ButtonProps["variant"]
}

export function WaitlistModal({
  referredByCode,
  triggerLabel,
  triggerSize = "lg",
  triggerVariant = "default",
}: WaitlistModalProps) {
  const [open, setOpen] = useState(false)
  const reduceMotion = useReducedMotion()
  const titleId = useId()

  useEffect(() => {
    if (!open) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false)
      }
    }

    window.addEventListener("keydown", onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  return (
    <>
      <Button type="button" size={triggerSize} variant={triggerVariant} onClick={() => setOpen(true)}>
        {triggerLabel}
      </Button>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 px-4 py-6 backdrop-blur-[2px]"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={reduceMotion ? undefined : { opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              className="relative w-full max-w-2xl border border-line bg-ink p-1"
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: 20 }}
              transition={{ duration: 0.24, ease: [0.2, 0.8, 0.2, 1] }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between border border-line border-b-0 bg-ink-2 px-5 py-4">
                <div>
                  <p className="eyebrow">Open the case file</p>
                  <h2 id={titleId} className="mt-2 font-display text-3xl leading-tight">
                    Request early access before the next bad trade lands.
                  </h2>
                </div>
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  aria-label="Close waitlist popup"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>

              <WaitlistForm
                autoFocusEmail
                className="border-t-0"
                referredByCode={referredByCode}
              />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}

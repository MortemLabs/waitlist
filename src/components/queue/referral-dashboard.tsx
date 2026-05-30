"use client"

import { motion, useReducedMotion } from "framer-motion"
import { Check, Copy, Loader2 } from "lucide-react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

type ReferralDashboardProps = {
  email: string
  referralCount: number
  referralLink: string
  status: "locked" | "priority"
  verificationState: "already_verified" | "expired" | "idle" | "invalid" | "verified"
}

const TARGET_REFERRALS = 3

export function ReferralDashboard({
  email,
  referralCount,
  referralLink,
  status,
  verificationState,
}: ReferralDashboardProps) {
  const reduceMotion = useReducedMotion()
  const [copied, setCopied] = useState(false)
  const [copying, setCopying] = useState(false)
  const clampedCount = Math.min(referralCount, TARGET_REFERRALS)
  const progress = `${(clampedCount / TARGET_REFERRALS) * 100}%`

  const onCopy = async () => {
    setCopying(true)

    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } finally {
      setCopying(false)
    }
  }

  const verificationHint = verificationHintLine(verificationState)

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
          <h1 className="font-display text-3xl leading-tight md:text-[2.125rem]">Your case is on file.</h1>
          <Badge variant={status === "priority" ? "error" : "outline"}>
            {status === "priority" ? "Priority queue" : "Waitlist"}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{email}</p>
        {verificationHint ? (
          <p className="text-sm leading-relaxed text-fg-muted">{verificationHint}</p>
        ) : null}
      </header>

      <section className="border border-line bg-ink-2 px-5 py-8 md:px-8 md:py-10">
        <div className="space-y-8 md:space-y-10">
          <div className="space-y-4">
            <div>
              <h2 className="case-meta text-fg-muted">Referral link</h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                Share this URL only. Invited sign-ups count toward your total after they verify email.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
              <div className="min-w-0 flex-1 border border-line bg-ink px-3 py-3 font-mono text-[0.75rem] leading-relaxed tracking-tight text-foreground [overflow-wrap:anywhere]">
                {referralLink}
              </div>
              <Button
                className="h-auto shrink-0 px-6 py-3 sm:self-stretch sm:py-3"
                disabled={copying}
                type="button"
                onClick={onCopy}
              >
                {copying ? <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden /> : null}
                {copied ? <Check className="size-4 shrink-0" aria-hidden /> : null}
                {!copying && !copied ? <Copy className="size-4 shrink-0" aria-hidden /> : null}
                <span>{copied ? "Copied" : copying ? "Copying…" : "Copy"}</span>
              </Button>
            </div>
          </div>

          <hr className="border-0 border-t border-line" />

          <div className="space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-2 gap-y-3">
              <div>
                <h2 className="case-meta text-fg-muted">Verified referrals</h2>
                <p className="mt-2 font-display text-2xl tabular-nums leading-none md:text-[1.625rem]">
                  {clampedCount} / {TARGET_REFERRALS}
                </p>
              </div>
            </div>
            <div className="h-2 border border-line bg-ink">
              {reduceMotion ? (
                <div className="h-full bg-signal" style={{ width: progress }} />
              ) : (
                <motion.div
                  animate={{ width: progress }}
                  className="h-full bg-signal"
                  initial={{ width: 0 }}
                  transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
                />
              )}
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {status === "priority"
                ? "You’re in the priority queue. Spots are still reviewed manually."
                : `${TARGET_REFERRALS} verified referrals unlock priority placement in review.`}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

function verificationHintLine(state: ReferralDashboardProps["verificationState"]) {
  switch (state) {
    case "idle":
      return "Confirm your email from the signup message — referral credits only apply after verification."
    case "expired":
      return null
    case "invalid":
      return null
    case "already_verified":
      return null
    case "verified":
      return null
    default:
      return null
  }
}

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

  return (
    <div className="space-y-4">
      <section className="border border-line bg-ink-2 p-5 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line pb-4">
          <div>
            <p className="eyebrow">Queue dashboard</p>
            <h1 className="mt-2 font-display text-4xl leading-tight">Your case is on file.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{email}</p>
          </div>
          <Badge variant={status === "priority" ? "error" : "outline"}>
            {status === "priority" ? "Priority queue" : "Waitlist"}
          </Badge>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <StatCard
            label="Verification"
            value={verificationLabel(verificationState)}
            detail="Referral credit only counts after verification."
          />
          <StatCard
            label="Verified referrals"
            value={`${referralCount} / ${TARGET_REFERRALS}`}
            detail="Only verified signups move the count."
          />
          <StatCard
            label="Queue status"
            value={status === "priority" ? "Moved up" : "Still filing"}
            detail="Three verified referrals move you higher in review."
          />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="border border-line bg-ink-2 p-5 md:p-6">
          <p className="eyebrow">Referral progress</p>
          <h2 className="mt-2 font-display text-3xl leading-tight">
            Bring three verified operators into the file.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
            Share your link. We only count referred operators after they submit and verify their
            email. The goal is quality signal, not vanity traffic.
          </p>

          <div className="mt-6 border border-line bg-ink p-4">
            <div className="flex items-center justify-between gap-4">
              <span className="case-meta">Progress</span>
              <span className="font-mono text-sm text-foreground">
                {clampedCount} / {TARGET_REFERRALS}
              </span>
            </div>
            <div className="mt-3 h-3 border border-line bg-ink-2">
              {reduceMotion ? (
                <div className="h-full bg-signal" style={{ width: progress }} />
              ) : (
                <motion.div
                  className="h-full bg-signal"
                  initial={{ width: 0 }}
                  animate={{ width: progress }}
                  transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
                />
              )}
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {Array.from({ length: TARGET_REFERRALS }).map((_, index) => {
                const unlocked = index < referralCount
                return (
                  <div
                    key={index}
                    className="border border-line bg-ink-2 px-4 py-3 text-center"
                  >
                    <p className="case-meta text-fg-muted">Referral 0{index + 1}</p>
                    <p className="mt-2 font-display text-2xl leading-none">
                      {unlocked ? "Filed" : "Pending"}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </article>

        <article className="border border-line bg-ink-2 p-5 md:p-6">
          <p className="eyebrow">Share link</p>
          <h2 className="mt-2 font-display text-3xl leading-tight">
            Send people here, not to the homepage.
          </h2>
          <div className="mt-5 border border-line bg-ink p-4">
            <p className="break-all font-mono text-xs leading-6 text-muted-foreground">
              {referralLink}
            </p>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button type="button" onClick={onCopy} disabled={copying}>
              {copying ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
              {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
              {copied ? "Copied" : "Copy link"}
            </Button>
          </div>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Priority queue unlocks at three verified referrals. Access is still reviewed manually.
          </p>
        </article>
      </section>
    </div>
  )
}

function verificationLabel(
  state: "already_verified" | "expired" | "idle" | "invalid" | "verified",
) {
  switch (state) {
    case "already_verified":
      return "Already verified"
    case "expired":
      return "Link expired"
    case "invalid":
      return "Link invalid"
    case "verified":
      return "Verified now"
    default:
      return "Pending"
  }
}

function StatCard({
  detail,
  label,
  value,
}: Readonly<{ detail: string; label: string; value: string }>) {
  return (
    <div className="border border-line bg-ink p-4">
      <p className="eyebrow">{label}</p>
      <p className="mt-3 font-display text-3xl leading-none">{value}</p>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{detail}</p>
    </div>
  )
}

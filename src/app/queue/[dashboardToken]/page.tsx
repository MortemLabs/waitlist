import Link from "next/link"
import { Wordmark } from "@/components/mortem/mark"
import { ReferralDashboard } from "@/components/queue/referral-dashboard"
import { Button } from "@/components/ui/button"
import { getDb } from "@/db/client"
import { getAppUrl } from "@/lib/env"
import { findEntryByDashboardToken } from "@/lib/waitlist/service"
import { cn } from "@/lib/utils"

type QueuePageProps = {
  params: Promise<{ dashboardToken: string }>
  searchParams: Promise<{ verify?: string }>
}

export const dynamic = "force-dynamic"

export default async function QueuePage({ params, searchParams }: QueuePageProps) {
  const { dashboardToken } = await params
  const { verify } = await searchParams
  const entry = await findEntryByDashboardToken(getDb(), dashboardToken)

  if (entry === undefined) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <div className="tape h-2 w-full" aria-hidden="true" />
        <div className="mx-auto max-w-2xl px-4 py-8 md:px-6 lg:py-12">
          <Wordmark />
          <section className="mt-12 border border-line bg-ink-2 px-6 py-8 md:px-8">
            <p className="case-meta text-fg-muted">Missing record</p>
            <h1 className="mt-3 font-display text-3xl leading-tight md:text-4xl">That dashboard is not on file.</h1>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              The token may be wrong, expired, or copied from an older session.
            </p>
            <div className="mt-8">
              <Button asChild>
                <Link href="/">Return to the landing page</Link>
              </Button>
            </div>
          </section>
        </div>
      </main>
    )
  }

  const verificationState = toVerificationState(verify)
  const status = entry.priorityUnlockedAt === null ? "locked" : "priority"
  const referralLink = `${getAppUrl()}/r/${entry.referralCode}`

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="tape h-2 w-full" aria-hidden="true" />
      <div className="mx-auto max-w-2xl px-4 pb-14 pt-6 md:px-6 md:pb-16 lg:pt-10">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-6">
          <Wordmark />
          <Button asChild variant="outline" size="sm">
            <Link href="/">Back to site</Link>
          </Button>
        </div>

        {verificationState === "verified" ? (
          <Banner eyebrow="Confirmed" tone="accent" title="Verification filed">
            Your place in line is confirmed. Referral credit is live from this point forward.
          </Banner>
        ) : null}
        {verificationState === "already_verified" ? (
          <Banner eyebrow="Account" tone="accent" title="Already verified">
            Share your referral link below — referrals still must verify email to count.
          </Banner>
        ) : null}
        {verificationState === "expired" ? (
          <Banner eyebrow="Action required" tone="warning" title="Verification link expired">
            Submit the form again from the landing page and Mortem will issue a fresh verification email.
          </Banner>
        ) : null}

        <div className="mt-6 md:mt-8">
          <ReferralDashboard
            email={entry.email}
            referralCount={entry.verifiedReferralCount}
            referralLink={referralLink}
            status={status}
            verificationState={verificationState}
          />
        </div>
      </div>
    </main>
  )
}

function Banner({
  children,
  eyebrow,
  title,
  tone = "default",
}: Readonly<{
  children: string
  eyebrow?: string
  /** Positive notice (e.g. just verified); uses signal accent strip */
  tone?: "accent" | "default" | "warning"
  title: string
}>) {
  return (
    <aside
      className={cn(
        "mt-6 border-l-2 px-5 py-4",
        tone === "warning" ? "border-signal/75 bg-ink-2" : "",
        tone === "accent" ? "border-signal bg-ink-2" : "",
        tone === "default" ? "border-line bg-ink-2" : "",
      )}
      role="status"
    >
      {eyebrow ? <p className="case-meta text-fg-muted">{eyebrow}</p> : null}
      <h2 className={cn("font-display text-xl leading-snug md:text-2xl", eyebrow !== undefined ? "mt-2" : undefined)}>
        {title}
      </h2>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">{children}</p>
    </aside>
  )
}

function toVerificationState(
  value: string | undefined,
): "already_verified" | "expired" | "idle" | "invalid" | "verified" {
  if (
    value === "already_verified" ||
    value === "expired" ||
    value === "invalid" ||
    value === "verified"
  ) {
    return value
  }

  return "idle"
}

import Link from "next/link"
import { Wordmark } from "@/components/mortem/mark"
import { ReferralDashboard } from "@/components/queue/referral-dashboard"
import { Button } from "@/components/ui/button"
import { getDb } from "@/db/client"
import { getAppUrl } from "@/lib/env"
import { findEntryByDashboardToken } from "@/lib/waitlist/service"

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
        <div className="mx-auto max-w-5xl px-4 py-6 md:px-6 lg:px-8">
          <Wordmark />
          <section className="mt-10 border border-line bg-ink-2 p-6 md:p-8">
            <p className="eyebrow">Missing record</p>
            <h1 className="mt-3 font-display text-4xl leading-tight">That dashboard is not on file.</h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
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
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-center sm:justify-between">
          <Wordmark />
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link href="/">Back to site</Link>
            </Button>
          </div>
        </div>

        {verificationState === "verified" ? (
          <Banner
            title="Verification filed."
            body="Your place in line is confirmed. Referral credit is live from this point forward."
          />
        ) : null}
        {verificationState === "already_verified" ? (
          <Banner
            title="Already verified."
            body="Your email was already confirmed. Keep using the same referral link below."
          />
        ) : null}
        {verificationState === "expired" ? (
          <Banner
            title="Verification link expired."
            body="Submit the form again from the landing page and Mortem will issue a fresh verification email."
            variant="warning"
          />
        ) : null}

        <div className="mt-8">
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
  body,
  title,
  variant = "default",
}: Readonly<{ body: string; title: string; variant?: "default" | "warning" }>) {
  return (
    <section className="mt-8 border border-line bg-ink-2 p-5">
      <p className="eyebrow">{variant === "warning" ? "Action required" : "Status update"}</p>
      <h2 className="mt-2 font-display text-3xl leading-tight">{title}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">{body}</p>
    </section>
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

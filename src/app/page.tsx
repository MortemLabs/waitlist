import { cookies } from "next/headers"
import Link from "next/link"
import { Wordmark } from "@/components/mortem/mark"
import { WaitlistModal } from "@/components/landing/waitlist-modal"
import { Button } from "@/components/ui/button"
import { Reveal } from "@/components/landing/reveal"

const diagnosisSteps = [
  {
    body: "Mortem aligns agent payloads, market state, and onchain outcomes in a single evidence chain. No more guessing which system lied first.",
    step: "01",
    title: "Trace the failure.",
  },
  {
    body: "Every claim has to survive timestamps, quote age, liquidity moves, and the exact execution path that fired.",
    step: "02",
    title: "Prove what went wrong.",
  },
  {
    body: "The next move is a code-scoped remediation path, not another dashboard. Fix the branch, tighten the guardrail, ship the next version.",
    step: "03",
    title: "Patch the logic.",
  },
] as const

const queueSteps = [
  {
    body: "Tell us who you are and what keeps breaking.",
    title: "Join",
  },
  {
    body: "Verify your email so the queue stays real.",
    title: "Verify",
  },
  {
    body: "Three verified referrals move you into the priority queue.",
    title: "Move up",
  },
] as const

type LandingPageProps = {
  searchParams?: Promise<{ referred?: string; verify?: string }>
}

export default async function HomePage({ searchParams }: LandingPageProps) {
  const cookieStore = await cookies()
  const referredByCode = cookieStore.get("mortem-ref")?.value ?? null
  const resolvedSearch = (await searchParams) ?? {}

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="tape h-2 w-full" aria-hidden="true" />

      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
        <nav
          className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-center sm:justify-between"
          aria-label="Primary"
        >
          <Wordmark />
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild variant="outline">
              <Link href="#how-it-works">How it works</Link>
            </Button>
            <WaitlistModal referredByCode={referredByCode} triggerLabel="Join the queue" triggerSize="default" />
          </div>
        </nav>

        {resolvedSearch.referred === "1" ? (
          <section className="mt-8 border border-line bg-ink-2 p-5">
            <p className="eyebrow">Referral filed</p>
            <h2 className="mt-2 font-display text-3xl leading-tight">
              This request was opened from a referral link.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
              The referral only counts after you complete signup and verify your email.
            </p>
          </section>
        ) : null}

        {resolvedSearch.verify === "invalid" ? (
          <section className="mt-8 border border-line bg-ink-2 p-5">
            <p className="eyebrow">Verification failed</p>
            <h2 className="mt-2 font-display text-3xl leading-tight">
              That verification link is no longer valid.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
              Submit the form again and Mortem will issue a fresh verification email.
            </p>
          </section>
        ) : null}

        <section className="grid gap-10 py-14 lg:grid-cols-[minmax(0,1.05fr)_420px] lg:items-center lg:py-20">
          <Reveal>
            <div className="max-w-3xl">
              <p className="eyebrow">Case File № EA-001 · Solana agent early access</p>
              <h1 className="mt-6 font-display text-5xl leading-[0.92] tracking-tight md:text-7xl lg:text-[5.75rem]">
                Catch bad trading decisions before more capital gets buried
                <span className="text-signal">.</span>
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-7 text-muted-foreground md:text-xl md:leading-8">
                Mortem helps Solana trading teams catch bad agent decisions, see what caused them,
                and fix the logic before the same loss repeats.
              </p>

              <div className="mt-10 grid gap-4 border border-line bg-ink-2 p-5 md:grid-cols-3">
                <SignalCard
                  label="Agent decision"
                  meta="Payload captured"
                  value="The strategy fired the buy path."
                />
                <SignalCard
                  label="Market reality"
                  meta="Context diverged"
                  value="Liquidity shifted and the quote aged out."
                />
                <SignalCard
                  label="Bad outcome"
                  meta="Loss realized"
                  value="Execution landed worse than the model assumed."
                />
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <WaitlistModal referredByCode={referredByCode} triggerLabel="Request early access" />
                <Button asChild size="lg" variant="outline">
                  <Link href="#beta-access">View the queue</Link>
                </Button>
              </div>
              <p className="mt-5 max-w-xl text-sm leading-6 text-muted-foreground">
                Three verified referrals move you into the priority queue.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <aside className="border border-line bg-ink p-1">
              <div className="border border-line bg-ink-2 p-5 md:p-6">
                <div className="border-b border-line pb-4">
                  <div>
                    <p className="eyebrow">Beta docket</p>
                    <h2 className="mt-2 font-display text-3xl leading-tight">
                      The first cohort is small on purpose.
                    </h2>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <DocketRow
                    label="Focus"
                    value="Bad trading decisions tied to payloads, market context, and execution."
                  />
                  <DocketRow
                    label="Who it is for"
                    value="Builders and operators with a clear failure mode to fix."
                  />
                  <DocketRow
                    label="Priority rule"
                    value="Three verified referrals move you ahead in the queue."
                  />
                </div>
              </div>
            </aside>
          </Reveal>
        </section>

        <section id="how-it-works" className="py-12 md:py-16">
          <Reveal>
            <div className="max-w-2xl">
              <p className="eyebrow">The process</p>
              <h2 className="mt-3 font-display text-4xl leading-tight md:text-5xl">
                Diagnose the trade. Prove the cause. Fix the branch.
              </h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                The product is simple: catch the mistake, show the evidence, and point to the fix.
              </p>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {diagnosisSteps.map((item, index) => (
              <Reveal key={item.step} delay={index * 0.04}>
                <article className="border border-line bg-ink-2 p-5 md:p-6">
                  <p className="case-meta text-signal">{item.step}</p>
                  <h3 className="mt-4 font-display text-3xl leading-tight">{item.title}</h3>
                  <p className="mt-4 text-base leading-7 text-muted-foreground">{item.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="beta-access" className="py-12 md:py-16">
          <Reveal>
            <div className="grid gap-8 border border-line bg-ink-2 p-6 md:p-8 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <p className="eyebrow">Beta access</p>
                <h2 className="mt-3 font-display text-4xl leading-tight">
                  A simple queue with one fast path.
                </h2>
                <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
                  Join, verify, and refer three other real operators if you want priority review.
                </p>
              </div>

              <div className="space-y-3">
                {queueSteps.map((item, index) => (
                  <div key={item.title} className="grid gap-3 border border-line bg-ink px-4 py-4 md:grid-cols-[52px_1fr]">
                    <div className="flex h-12 w-12 items-center justify-center border border-line font-mono text-sm text-signal">
                      0{index + 1}
                    </div>
                    <div>
                      <h3 className="font-display text-2xl leading-tight">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </section>

        <section className="border border-line bg-ink-2 px-6 py-12 text-center md:px-10 md:py-16">
          <p className="eyebrow">Final call</p>
          <h2 className="mt-3 font-display text-4xl leading-tight md:text-6xl">
            Get in before the next bad trade repeats.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
            Request early access. Verify your email. Bring three real referrals if you want
            priority review.
          </p>
          <div className="mt-8 flex justify-center">
            <WaitlistModal referredByCode={referredByCode} triggerLabel="Request early access" />
          </div>
        </section>

        <footer className="border-t border-line py-6">
          <p className="case-meta text-center text-fg-muted">☩ Ship · Learn · Bury · Repeat ☩</p>
        </footer>
      </div>
    </main>
  )
}

function SignalCard({
  label,
  meta,
  value,
}: Readonly<{ label: string; meta: string; value: string }>) {
  return (
    <div className="border border-line bg-ink px-4 py-4">
      <p className="case-meta text-signal">{meta}</p>
      <h2 className="mt-3 font-display text-2xl leading-tight">{label}</h2>
      <p className="mt-4 text-sm leading-6 text-muted-foreground">{value}</p>
    </div>
  )
}

function DocketRow({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div className="border border-line bg-ink px-4 py-4">
      <p className="case-meta text-fg-muted">{label}</p>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{value}</p>
    </div>
  )
}

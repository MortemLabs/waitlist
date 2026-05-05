import { cookies } from "next/headers"
import Link from "next/link"
import { Wordmark } from "@/components/mortem/mark"
import { WaitlistModal } from "@/components/landing/waitlist-modal"
import { Button } from "@/components/ui/button"
import { Reveal } from "@/components/landing/reveal"
import { TiltCard } from "@/components/landing/tilt-card"

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

const exhibits = [
  {
    exhibit: "A",
    label: "Agent decision",
    meta: "Payload captured",
    value: "The strategy fired the buy path.",
  },
  {
    exhibit: "B",
    label: "Market reality",
    meta: "Context diverged",
    value: "Liquidity shifted and the quote aged out.",
  },
  {
    exhibit: "C",
    label: "Bad outcome",
    meta: "Loss realized",
    value: "Execution landed worse than the model assumed.",
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

      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <nav
          className="flex flex-col gap-4 border-b border-line py-5 sm:flex-row sm:items-center sm:justify-between"
          aria-label="Primary"
        >
          <Wordmark />
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild variant="ghost">
              <Link href="#how-it-works">How it works</Link>
            </Button>
            <WaitlistModal referredByCode={referredByCode} triggerLabel="Join the queue" triggerSize="default" />
          </div>
        </nav>

        {resolvedSearch.referred === "1" ? (
          <section className="mt-8 border border-line bg-ink-2 p-5">
            <p className="eyebrow text-signal">Referral filed</p>
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
            <p className="eyebrow text-signal">Verification failed</p>
            <h2 className="mt-2 font-display text-3xl leading-tight">
              That verification link is no longer valid.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
              Submit the form again and Mortem will issue a fresh verification email.
            </p>
          </section>
        ) : null}

        {/* Hero */}
        <section className="pb-16 pt-8 md:pb-24 md:pt-12 lg:pb-28 lg:pt-14">
          <div>
            <Reveal>
              <div className="death-stamp mb-10 w-fit" style={{ transform: "none" }}>
                Case File № EA-001 · Solana agent early access
              </div>

              <h1 className="max-w-3xl font-display text-5xl leading-[0.92] tracking-tight md:text-7xl lg:text-[6rem]">
                Catch bad trading decisions before{" "}
                <em>more capital</em> gets buried
                <span className="text-signal">.</span>
              </h1>

              <p className="mt-8 max-w-xl text-base leading-7 text-muted-foreground md:text-xl md:leading-8">
                Mortem helps Solana trading teams catch bad agent decisions, see what caused them,
                and fix the logic before the same loss repeats.
              </p>

              <div className="mt-12 flex flex-wrap gap-3">
                <WaitlistModal referredByCode={referredByCode} triggerLabel="Request early access" triggerSize="lg" />
                <Button asChild size="lg" variant="outline">
                  <Link href="#how-it-works">How it works</Link>
                </Button>
              </div>
            </Reveal>
          </div>

          {/* Evidence chain */}
          <Reveal delay={0.06}>
            <div className="mt-16 border border-line">
              <div className="flex items-center justify-between border-b border-line bg-ink-3 px-4 py-2.5">
                <p className="case-meta text-fg-muted">Evidence chain</p>
                <p className="case-meta text-fg-muted">Three-point failure</p>
              </div>
              <div className="grid gap-px bg-line md:grid-cols-3">
                {exhibits.map((ex) => (
                  <TiltCard key={ex.exhibit}>
                    <ExhibitCard {...ex} />
                  </TiltCard>
                ))}
              </div>
            </div>
          </Reveal>
        </section>
      </div>

      {/* Section break */}
      <div className="tape h-1.5 w-full" aria-hidden="true" />

      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        {/* How it works */}
        <section id="how-it-works" className="py-16 md:py-20">
          <Reveal>
            <div className="max-w-2xl">
              <p className="eyebrow">The process</p>
              <h2 className="mt-3 font-display text-4xl leading-tight md:text-5xl">
                Diagnose the trade.<br />
                Prove the cause.<br />
                Fix the branch.
              </h2>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-px bg-line lg:grid-cols-3">
            {diagnosisSteps.map((item, index) => (
              <article
                key={item.step}
                className="relative overflow-hidden bg-ink-2 p-6 md:p-8"
              >
                <Reveal delay={index * 0.05}>
                  <div
                    className="pointer-events-none absolute -right-2 -top-6 select-none font-mono text-[9rem] font-bold leading-none text-ink-3"
                    aria-hidden="true"
                  >
                    {item.step}
                  </div>
                  <div className="relative">
                    <div className="mb-5 h-px w-10 bg-signal" aria-hidden="true" />
                    <p className="case-meta text-signal">{item.step}</p>
                    <h3 className="mt-3 font-display text-3xl leading-tight">{item.title}</h3>
                    <p className="mt-4 text-sm leading-7 text-muted-foreground">{item.body}</p>
                  </div>
                </Reveal>
              </article>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative mb-16 overflow-hidden border border-line grid-noise">
          <div className="px-6 py-14 text-center md:px-10 md:py-20">
            <div className="tape mx-auto mb-8 h-1.5 w-20" aria-hidden="true" />
            <p className="eyebrow">Final call</p>
            <h2 className="mt-4 font-display text-4xl leading-tight md:text-6xl">
              Get in before the next<br />
              <em>bad trade repeats.</em>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-muted-foreground md:text-lg">
              Request early access. Verify your email. Bring three real referrals if you want
              priority review.
            </p>
            <div className="mt-8 flex justify-center">
              <WaitlistModal
                referredByCode={referredByCode}
                triggerLabel="Request early access"
                triggerSize="lg"
              />
            </div>
          </div>
        </section>

        <footer className="border-t border-line py-8">
          <div className="death-stamp mx-auto w-fit" style={{ transform: "none" }}>
            ☩ Ship · Learn · Bury · Repeat ☩
          </div>
        </footer>
      </div>
    </main>
  )
}

function ExhibitCard({
  exhibit,
  label,
  meta,
  value,
}: Readonly<{ exhibit: string; label: string; meta: string; value: string }>) {
  return (
    <div className="bg-ink px-4 py-5">
      <div className="flex items-start justify-between gap-2">
        <p className="case-meta text-fg-muted">{meta}</p>
        <span className="case-meta shrink-0 border border-signal px-1.5 py-0.5 text-signal">
          EXHIBIT {exhibit}
        </span>
      </div>
      <h3 className="mt-3 font-display text-xl leading-tight">{label}</h3>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{value}</p>
    </div>
  )
}


function QueueStep({
  index,
  title,
  body,
}: Readonly<{ index: number; title: string; body: string }>) {
  return (
    <div className="flex gap-5 bg-ink-2 px-6 py-5 transition-colors duration-100 hover:bg-ink-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-line font-mono text-xs text-signal">
        0{index + 1}
      </div>
      <div>
        <h3 className="font-display text-2xl leading-tight">{title}</h3>
        <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{body}</p>
      </div>
    </div>
  )
}

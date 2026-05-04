import { cookies } from "next/headers"
import Link from "next/link"
import { Wordmark } from "@/components/mortem/mark"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Reveal } from "@/components/landing/reveal"
import { WaitlistForm } from "@/components/landing/waitlist-form"

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
    body: "Tell us who you are and which failure mode is costing you the most.",
    title: "Join the line",
  },
  {
    body: "Verify your email so the queue only moves real operators and real builders.",
    title: "Verify the operator",
  },
  {
    body: "Share your referral link. Only verified referrals count toward the queue.",
    title: "Bring three more",
  },
  {
    body: "Hit three verified referrals and you move into the priority queue for beta review.",
    title: "Move up the file",
  },
] as const

const proofCards = [
  {
    body: "You need payloads, market context, and the failing branch in one place so you can patch the bot before the next bad sequence lands.",
    eyebrow: "For bot builders",
    title: "Debug the exact path that buried the trade.",
  },
  {
    body: "You care less about observability vocabulary and more about whether the system can catch repeated execution failures before they compound.",
    eyebrow: "For trading teams",
    title: "Reduce repeat loss, not just retrospective confusion.",
  },
] as const

const faqs = [
  {
    answer:
      "No. Early access starts with retrospective diagnosis and a referral-gated queue. The beta cohort is for operators who want the real-time layer as it comes online.",
    question: "Is real-time intervention already live?",
  },
  {
    answer:
      "No. Three verified referrals move you into the priority queue. Access is still reviewed so the cohort stays useful and feedback stays sharp.",
    question: "Do 3 referrals guarantee instant access?",
  },
  {
    answer:
      "Bot builders, trading teams, and solo operators running live Solana strategies who need to know why trades failed before those failures repeat.",
    question: "Who is this actually for?",
  },
  {
    answer:
      "No. The first version keeps humans in the loop. Mortem explains the failure path and points to the code that should change before any automation gets trust.",
    question: "Will Mortem auto-edit my strategy code?",
  },
  {
    answer:
      "No. Referral credit only counts after the referred operator completes signup and verifies their email.",
    question: "Do unverified referrals count?",
  },
  {
    answer:
      "Waitlist records stay private and scoped to Mortem's beta process. Nothing here is used to train models or made public.",
    question: "What happens to my signup data?",
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
            <Badge variant="outline">Early access</Badge>
            <Button asChild variant="outline">
              <Link href="#how-it-works">Read the process</Link>
            </Button>
            <Button asChild>
              <Link href="#waitlist">Join the queue</Link>
            </Button>
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

        <section className="grid min-h-[calc(100vh-7rem)] gap-10 py-14 lg:grid-cols-[minmax(0,1.05fr)_460px] lg:items-center">
          <Reveal>
            <div className="max-w-3xl">
              <p className="eyebrow">Case File № EA-001 · Solana agent early access</p>
              <h1 className="mt-6 font-display text-5xl leading-[0.92] tracking-tight md:text-7xl lg:text-[5.75rem]">
                Catch bad trading decisions before more capital gets buried
                <span className="text-signal">.</span>
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-7 text-muted-foreground md:text-xl md:leading-8">
                Mortem is building the evidence layer for Solana trading agents: diagnose the exact
                failure, tie it to market context and onchain execution, then move the strategy
                toward a real fix before the same mistake repeats.
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
                <Button asChild size="lg">
                  <Link href="#waitlist">Request early access</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="#beta-access">How the queue works</Link>
                </Button>
              </div>

              <p className="mt-5 max-w-xl text-sm leading-6 text-muted-foreground">
                Early access is referral-gated. Three verified referrals move you into the priority
                queue. The point is signal, not vanity signup counts.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="grid-noise border border-line bg-ink p-1">
              <WaitlistForm referredByCode={referredByCode} />
            </div>
          </Reveal>
        </section>

        <section className="border-y border-line py-4">
          <div className="flex flex-col gap-3 text-center md:flex-row md:items-center md:justify-center">
            {[
              "Built for Solana agent workflows",
              "Referral queue favors real operators",
              "Verification required before credit counts",
            ].map((item) => (
              <div key={item} className="border border-line bg-ink-2 px-4 py-3 text-sm text-muted-foreground">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="py-12 md:py-16">
          <Reveal>
            <div className="text-center">
              <p className="eyebrow">The process</p>
              <h2 className="mt-3 font-display text-4xl leading-tight md:text-5xl">
                Diagnose the trade. Prove the cause. Fix the branch.
              </h2>
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
                  The waitlist is a queue, not a decoration.
                </h2>
                <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
                  The first cohort needs operators who can explain their failures clearly, verify
                  their identity, and bring in others who care about the same problem.
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

        <section className="py-12 md:py-16">
          <div className="grid gap-4 lg:grid-cols-2">
            {proofCards.map((item, index) => (
              <Reveal key={item.eyebrow} delay={index * 0.05}>
                <article className="border border-line bg-ink-2 p-6 md:p-8">
                  <p className="eyebrow">{item.eyebrow}</p>
                  <h2 className="mt-3 font-display text-4xl leading-tight">{item.title}</h2>
                  <p className="mt-5 text-base leading-7 text-muted-foreground">{item.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="py-12 md:py-16">
          <Reveal>
            <div className="mx-auto max-w-4xl">
              <div className="text-center">
                <p className="eyebrow">FAQ</p>
                <h2 className="mt-3 font-display text-4xl leading-tight md:text-5xl">
                  The first questions serious operators ask.
                </h2>
              </div>

              <div className="mt-10 divide-y divide-line border border-line bg-ink-2">
                {faqs.map((faq) => (
                  <details key={faq.question} className="group p-5">
                    <summary className="cursor-pointer list-none pr-6 text-left font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      {faq.question}
                    </summary>
                    <p className="mt-4 text-sm leading-6 text-muted-foreground">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </Reveal>
        </section>

        <section className="border border-line bg-ink-2 px-6 py-12 text-center md:px-10 md:py-16">
          <p className="eyebrow">Final call</p>
          <h2 className="mt-3 font-display text-4xl leading-tight md:text-6xl">
            Get the next bad trade on file before it repeats.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
            Join the queue, verify the operator, and bring in three more who care about fixing the
            same class of failure.
          </p>
          <div className="mt-8 flex justify-center">
            <Button asChild size="lg">
              <Link href="#waitlist">Request early access</Link>
            </Button>
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

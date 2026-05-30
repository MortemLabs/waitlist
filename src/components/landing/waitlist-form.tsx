"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { waitlistFormSchema } from "@/lib/waitlist/schema"
import { AlertCircle, Loader2, Mail } from "lucide-react"
import { useMemo, useState } from "react"

type SubmitSuccessPayload =
  | { awaitingVerification: true }
  | { awaitingVerification: false; redirectTo: string }

type WaitlistFormProps = {
  autoFocusEmail?: boolean
  className?: string
  referredByCode?: string | null
}

export function WaitlistForm({
  autoFocusEmail = false,
  className,
  referredByCode,
}: WaitlistFormProps) {
  const [email, setEmail] = useState("")
  const [fieldErrors, setFieldErrors] = useState<{ email?: string }>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emailSentTo, setEmailSentTo] = useState<string | null>(null)

  const referredLabel = useMemo(
    () =>
      referredByCode
        ? "Referral recorded. It counts after you verify your email."
        : null,
    [referredByCode],
  )

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError(null)

    const parsed = waitlistFormSchema.safeParse({
      email,
      referredByCode: referredByCode ?? undefined,
    })

    if (!parsed.success) {
      const flattened = parsed.error.flatten().fieldErrors
      setFieldErrors({
        email: flattened.email?.[0],
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/waitlist/submit", {
        body: JSON.stringify(parsed.data),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      })

      const payload = (await response.json()) as
        | { error?: string }
        | SubmitSuccessPayload

      if (!response.ok || !("awaitingVerification" in payload)) {
        setFormError(
          "error" in payload && payload.error
            ? payload.error
            : "We could not file your request. Try again.",
        )
        return
      }

      if (payload.awaitingVerification) {
        setEmailSentTo(parsed.data.email.trim().toLowerCase())
        return
      }

      window.location.assign(payload.redirectTo)
    } catch {
      setFormError("The form could not reach Mortem. Check the connection and retry.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (emailSentTo !== null) {
    return (
      <div
        className={cn("border border-line bg-ink-2 p-5 md:p-6", className)}
        role="status"
        aria-live="polite"
      >
        <div className="flex items-start justify-between gap-4 border-b border-line pb-4">
          <div>
            <p className="eyebrow">Check your inbox</p>
            <h2 className="mt-2 font-display text-3xl leading-tight">Verification link sent.</h2>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-line bg-ink">
            <Mail className="h-5 w-5 text-signal" aria-hidden="true" />
          </div>
        </div>
        <p className="mt-5 text-sm leading-7 text-muted-foreground">
          We emailed a secure link to <span className="font-mono text-foreground">{emailSentTo}</span>.
          Open it to confirm your address — then we will take you to your referral page. If it does not
          arrive in a minute, check spam or promotions.
        </p>
      </div>
    )
  }

  return (
    <form
      id="waitlist"
      onSubmit={onSubmit}
      className={cn("border border-line bg-ink-2 p-5 md:p-6", className)}
      noValidate
    >
      <div className="flex items-start justify-between gap-4 border-b border-line pb-4">
        <div>
          <p className="eyebrow">Early access request</p>
          <h2 className="mt-2 font-display text-3xl leading-tight">
            Join the queue.
          </h2>
        </div>
        <span className="case-meta text-signal">3 referrals = priority</span>
      </div>

      <div className="mt-5 space-y-4">
        <p className="max-w-lg text-sm leading-6 text-muted-foreground">
          File your email. We send one verification link, then open your referral page after you confirm it.
        </p>

        <Field
          error={fieldErrors.email}
          helper="Verification required."
          id="email"
          label="Email"
        >
          <Input
            id="email"
            type="email"
            autoFocus={autoFocusEmail}
            autoComplete="email"
            inputMode="email"
            spellCheck={false}
            placeholder="you@desk.xyz"
            value={email}
            onChange={(event) => {
              setEmail(event.currentTarget.value)
              setFieldErrors({})
              setFormError(null)
            }}
            aria-invalid={fieldErrors.email ? "true" : undefined}
            aria-describedby={fieldErrors.email ? "email-error" : "email-helper"}
          />
        </Field>

        {referredLabel ? (
          <div className="border border-line bg-ink px-4 py-3 text-sm text-muted-foreground">
            {referredLabel}
          </div>
        ) : null}

        {formError ? (
          <div className="border border-signal bg-transparent px-4 py-3 text-sm text-signal">
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <p>{formError}</p>
            </div>
          </div>
        ) : null}

        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <Button type="submit" size="lg" disabled={isSubmitting} aria-busy={isSubmitting}>
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
            Join the waitlist
          </Button>
          <p className="max-w-xs text-sm leading-6 text-muted-foreground">
            Verify your email. Three verified referrals move you up.
          </p>
        </div>
      </div>
    </form>
  )
}

function Field({
  children,
  error,
  helper,
  id,
  label,
}: Readonly<{
  children: React.ReactNode
  error?: string
  helper: string
  id: string
  label: string
}>) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-xs text-signal">
          {error}
        </p>
      ) : (
        <p id={`${id}-helper`} className="text-xs text-muted-foreground">
          {helper}
        </p>
      )}
    </div>
  )
}

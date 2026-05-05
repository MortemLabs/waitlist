"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { waitlistFormSchema, type WaitlistFormInput } from "@/lib/waitlist/schema"
import {
  FAILURE_MODE_OPTIONS,
  ROLE_OPTIONS,
  TEAM_TYPE_OPTIONS,
} from "@/lib/waitlist/options"
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
  const [form, setForm] = useState<WaitlistFormInput>({
    biggestFailureMode: FAILURE_MODE_OPTIONS[0].value,
    email: "",
    referredByCode: referredByCode ?? undefined,
    role: ROLE_OPTIONS[0].value,
    teamType: TEAM_TYPE_OPTIONS[0].value,
  })
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof WaitlistFormInput, string>>>(
    {},
  )
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

  const updateField = <Key extends keyof WaitlistFormInput>(key: Key, value: WaitlistFormInput[Key]) => {
    setForm((current) => ({ ...current, [key]: value }))
    setFieldErrors((current) => ({ ...current, [key]: undefined }))
    setFormError(null)
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError(null)

    const parsed = waitlistFormSchema.safeParse(form)

    if (!parsed.success) {
      const flattened = parsed.error.flatten().fieldErrors
      setFieldErrors({
        biggestFailureMode: flattened.biggestFailureMode?.[0],
        email: flattened.email?.[0],
        role: flattened.role?.[0],
        teamType: flattened.teamType?.[0],
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
        <Field
          error={fieldErrors.email}
          helper="Verification required."
          id="email"
          label="Work email"
        >
          <Input
            id="email"
            type="email"
            autoFocus={autoFocusEmail}
            autoComplete="email"
            inputMode="email"
            spellCheck={false}
            placeholder="you@desk.xyz"
            value={form.email}
            onChange={(event) => updateField("email", event.currentTarget.value)}
            aria-invalid={fieldErrors.email ? "true" : undefined}
            aria-describedby={fieldErrors.email ? "email-error" : "email-helper"}
          />
        </Field>

        <div className="grid gap-4 md:grid-cols-2">
          <Field
            error={fieldErrors.role}
            helper="Who will use the product?"
            id="role"
            label="Role"
          >
            <Select
              id="role"
              value={form.role}
              onChange={(event) => updateField("role", event.currentTarget.value)}
              aria-invalid={fieldErrors.role ? "true" : undefined}
              aria-describedby={fieldErrors.role ? "role-error" : "role-helper"}
            >
              {ROLE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </Field>

          <Field
            error={fieldErrors.teamType}
            helper="Choose the setup you run today."
            id="teamType"
            label="Setup"
          >
            <Select
              id="teamType"
              value={form.teamType}
              onChange={(event) => updateField("teamType", event.currentTarget.value)}
              aria-invalid={fieldErrors.teamType ? "true" : undefined}
              aria-describedby={fieldErrors.teamType ? "teamType-error" : "teamType-helper"}
            >
              {TEAM_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <Field
          error={fieldErrors.biggestFailureMode}
          helper="Pick the main thing you want to catch sooner."
          id="biggestFailureMode"
          label="Primary failure mode"
        >
          <Select
            id="biggestFailureMode"
            value={form.biggestFailureMode}
            onChange={(event) => updateField("biggestFailureMode", event.currentTarget.value)}
            aria-invalid={fieldErrors.biggestFailureMode ? "true" : undefined}
            aria-describedby={
              fieldErrors.biggestFailureMode
                ? "biggestFailureMode-error"
                : "biggestFailureMode-helper"
            }
          >
            {FAILURE_MODE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
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

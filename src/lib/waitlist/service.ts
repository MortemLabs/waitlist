import { createHash, randomBytes, randomUUID } from "node:crypto"
import { eq } from "drizzle-orm"
import type { Database } from "@/db/client"
import { waitlistEntries, type WaitlistEntry } from "@/db/schema"
import type { WaitlistFormInput } from "./schema"

const VERIFICATION_TTL_MS = 1000 * 60 * 60 * 24 * 3

type DatabaseExecutor = Database

export type SubmitWaitlistResult = {
  alreadyVerified: boolean
  dashboardToken: string
  verificationToken: string | null
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export function hashVerificationToken(token: string): string {
  return createHash("sha256").update(token).digest("hex")
}

export function createReferralCode(): string {
  return randomBytes(6).toString("base64url").replace(/[^A-Za-z0-9]/g, "").slice(0, 8).toUpperCase()
}

export function createDashboardToken(): string {
  return randomBytes(24).toString("base64url")
}

export function createVerificationToken(): string {
  return randomBytes(24).toString("base64url")
}

export function createVerificationExpiry(now = new Date()): Date {
  return new Date(now.getTime() + VERIFICATION_TTL_MS)
}

export function shouldIgnoreSelfReferral(email: string, referrerEmail: string): boolean {
  return normalizeEmail(email) === normalizeEmail(referrerEmail)
}

export async function submitWaitlistEntry(
  db: DatabaseExecutor,
  input: WaitlistFormInput,
  now = new Date(),
): Promise<SubmitWaitlistResult> {
  const email = normalizeEmail(input.email)
  const verificationToken = createVerificationToken()
  const verificationHash = hashVerificationToken(verificationToken)
  const verificationExpiry = createVerificationExpiry(now)

  return db.transaction(async (tx) => {
    const existing = await tx.query.waitlistEntries.findFirst({
      where: eq(waitlistEntries.email, email),
    })

    if (existing !== undefined) {
      const [updated] = await tx
        .update(waitlistEntries)
        .set({
          biggestFailureMode: input.biggestFailureMode,
          emailVerificationExpiresAt:
            existing.emailVerifiedAt === null ? verificationExpiry : existing.emailVerificationExpiresAt,
          emailVerificationTokenHash:
            existing.emailVerifiedAt === null ? verificationHash : existing.emailVerificationTokenHash,
          role: input.role,
          teamType: input.teamType,
          updatedAt: now,
        })
        .where(eq(waitlistEntries.id, existing.id))
        .returning()

      return {
        alreadyVerified: updated.emailVerifiedAt !== null,
        dashboardToken: updated.dashboardToken,
        verificationToken: updated.emailVerifiedAt === null ? verificationToken : null,
      }
    }

    let referredById: string | null = null

    if (input.referredByCode !== undefined && input.referredByCode.trim().length > 0) {
      const referrer = await tx.query.waitlistEntries.findFirst({
        where: eq(waitlistEntries.referralCode, input.referredByCode.trim().toUpperCase()),
      })

      if (
        referrer !== undefined &&
        !shouldIgnoreSelfReferral(email, referrer.email)
      ) {
        referredById = referrer.id
      }
    }

    const [created] = await tx
      .insert(waitlistEntries)
      .values({
        biggestFailureMode: input.biggestFailureMode,
        dashboardToken: createDashboardToken(),
        email,
        emailVerificationExpiresAt: verificationExpiry,
        emailVerificationTokenHash: verificationHash,
        id: randomUUID(),
        referralCode: createReferralCode(),
        referredById,
        role: input.role,
        teamType: input.teamType,
      })
      .returning()

    return {
      alreadyVerified: false,
      dashboardToken: created.dashboardToken,
      verificationToken,
    }
  })
}

export async function findEntryByDashboardToken(
  db: DatabaseExecutor,
  dashboardToken: string,
): Promise<WaitlistEntry | undefined> {
  return db.query.waitlistEntries.findFirst({
    where: eq(waitlistEntries.dashboardToken, dashboardToken),
  })
}

export async function findEntryByVerificationHash(
  db: DatabaseExecutor,
  verificationHash: string,
): Promise<WaitlistEntry | undefined> {
  return db.query.waitlistEntries.findFirst({
    where: eq(waitlistEntries.emailVerificationTokenHash, verificationHash),
  })
}

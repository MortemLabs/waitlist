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

export type VerifyWaitlistResult =
  | {
      dashboardToken: string
      email: string
      referralCode: string
      priorityUnlocked: boolean
      priorityUnlockedEntryId: string | null
      priorityUnlockedEmail: string | null
      priorityUnlockedReferralCount: number | null
      status: "already_verified" | "expired" | "verified"
    }
  | {
      status: "invalid"
    }

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export function isDuplicateEmail(existingEmail: string, incomingEmail: string): boolean {
  return normalizeEmail(existingEmail) === normalizeEmail(incomingEmail)
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
  return isDuplicateEmail(email, referrerEmail)
}

export function getVerificationStatus(
  entry: Pick<WaitlistEntry, "emailVerificationExpiresAt" | "emailVerifiedAt">,
  now = new Date(),
): "already_verified" | "expired" | "verified" {
  if (entry.emailVerifiedAt !== null) {
    return "already_verified"
  }

  if (
    entry.emailVerificationExpiresAt !== null &&
    entry.emailVerificationExpiresAt.getTime() < now.getTime()
  ) {
    return "expired"
  }

  return "verified"
}

export function getNextPriorityState(
  currentCount: number,
  priorityUnlockedAt: Date | null,
  now = new Date(),
) {
  const nextReferralCount = currentCount + 1
  const unlocksNow = priorityUnlockedAt === null && nextReferralCount >= 3

  return {
    nextReferralCount,
    priorityUnlockedAt: unlocksNow ? now : priorityUnlockedAt,
    unlocksNow,
  }
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

export async function verifyWaitlistEntry(
  db: DatabaseExecutor,
  rawToken: string,
  now = new Date(),
): Promise<VerifyWaitlistResult> {
  const verificationHash = hashVerificationToken(rawToken)

  return db.transaction(async (tx) => {
    const entry = await tx.query.waitlistEntries.findFirst({
      where: eq(waitlistEntries.emailVerificationTokenHash, verificationHash),
    })

    if (entry === undefined) {
      return { status: "invalid" }
    }

    const verificationStatus = getVerificationStatus(entry, now)

    if (verificationStatus === "already_verified" || verificationStatus === "expired") {
      return {
        dashboardToken: entry.dashboardToken,
        email: entry.email,
        referralCode: entry.referralCode,
        priorityUnlocked: false,
        priorityUnlockedEmail: null,
        priorityUnlockedEntryId: null,
        priorityUnlockedReferralCount: null,
        status: verificationStatus,
      }
    }

    const [updated] = await tx
      .update(waitlistEntries)
      .set({
        emailVerifiedAt: now,
        updatedAt: now,
      })
      .where(eq(waitlistEntries.id, entry.id))
      .returning()

    let priorityUnlocked = false
    let priorityUnlockedEntryId: string | null = null
    let priorityUnlockedEmail: string | null = null
    let priorityUnlockedReferralCount: number | null = null

    if (updated.referredById !== null) {
      const referrer = await tx.query.waitlistEntries.findFirst({
        where: eq(waitlistEntries.id, updated.referredById),
      })

      if (referrer !== undefined) {
        const nextPriorityState = getNextPriorityState(
          referrer.verifiedReferralCount,
          referrer.priorityUnlockedAt,
          now,
        )

        const [updatedReferrer] = await tx
          .update(waitlistEntries)
          .set({
            priorityUnlockedAt: nextPriorityState.priorityUnlockedAt,
            updatedAt: now,
            verifiedReferralCount: nextPriorityState.nextReferralCount,
          })
          .where(eq(waitlistEntries.id, referrer.id))
          .returning()

        if (nextPriorityState.unlocksNow) {
          priorityUnlocked = true
          priorityUnlockedEmail = updatedReferrer.email
          priorityUnlockedEntryId = updatedReferrer.id
          priorityUnlockedReferralCount = updatedReferrer.verifiedReferralCount
        }
      }
    }

    return {
      dashboardToken: updated.dashboardToken,
      email: updated.email,
      referralCode: updated.referralCode,
      priorityUnlocked,
      priorityUnlockedEmail,
      priorityUnlockedEntryId,
      priorityUnlockedReferralCount,
      status: "verified",
    }
  })
}

export async function markPriorityNotificationSent(
  db: DatabaseExecutor,
  entryId: string,
  now = new Date(),
): Promise<void> {
  await db
    .update(waitlistEntries)
    .set({
      priorityNotifiedAt: now,
      updatedAt: now,
    })
    .where(eq(waitlistEntries.id, entryId))
}

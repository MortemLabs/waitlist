import { describe, expect, it } from "vitest"
import {
  createVerificationExpiry,
  getNextPriorityState,
  getVerificationStatus,
  hashVerificationToken,
  isDuplicateEmail,
  normalizeEmail,
  shouldIgnoreSelfReferral,
} from "./service"

describe("waitlist service rules", () => {
  it("normalizes and de-dupes email addresses", () => {
    expect(normalizeEmail("  Sam@Mortem.dev ")).toBe("sam@mortem.dev")
    expect(isDuplicateEmail("Sam@Mortem.dev", " sam@mortem.dev ")).toBe(true)
  })

  it("blocks self-referrals after normalization", () => {
    expect(shouldIgnoreSelfReferral("Ops@Desk.xyz", " ops@desk.xyz ")).toBe(true)
    expect(shouldIgnoreSelfReferral("ops@desk.xyz", "another@desk.xyz")).toBe(false)
  })

  it("uses a stable verification token hash", () => {
    expect(hashVerificationToken("token-123")).toBe(hashVerificationToken("token-123"))
    expect(hashVerificationToken("token-123")).not.toBe(hashVerificationToken("token-456"))
  })

  it("marks expired verification windows correctly", () => {
    const now = new Date("2026-05-04T12:00:00.000Z")
    const expiry = createVerificationExpiry(new Date("2026-05-01T12:00:00.000Z"))

    expect(
      getVerificationStatus(
        {
          emailVerificationExpiresAt: expiry,
          emailVerifiedAt: null,
        },
        new Date(expiry.getTime() - 1000),
      ),
    ).toBe("verified")

    expect(
      getVerificationStatus(
        {
          emailVerificationExpiresAt: new Date(now.getTime() - 1000),
          emailVerifiedAt: null,
        },
        now,
      ),
    ).toBe("expired")

    expect(
      getVerificationStatus(
        {
          emailVerificationExpiresAt: now,
          emailVerifiedAt: now,
        },
        now,
      ),
    ).toBe("already_verified")
  })

  it("unlocks priority exactly at three verified referrals", () => {
    const now = new Date("2026-05-04T12:00:00.000Z")
    const beforeThreshold = getNextPriorityState(1, null, now)
    const atThreshold = getNextPriorityState(2, null, now)
    const afterUnlocked = getNextPriorityState(3, now, new Date("2026-05-05T12:00:00.000Z"))

    expect(beforeThreshold.nextReferralCount).toBe(2)
    expect(beforeThreshold.unlocksNow).toBe(false)

    expect(atThreshold.nextReferralCount).toBe(3)
    expect(atThreshold.unlocksNow).toBe(true)
    expect(atThreshold.priorityUnlockedAt).toEqual(now)

    expect(afterUnlocked.nextReferralCount).toBe(4)
    expect(afterUnlocked.unlocksNow).toBe(false)
    expect(afterUnlocked.priorityUnlockedAt).toEqual(now)
  })
})

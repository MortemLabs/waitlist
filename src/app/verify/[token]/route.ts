import { NextResponse } from "next/server"
import { getDb } from "@/db/client"
import { sendPriorityUnlockedEmail } from "@/lib/waitlist/mailer"
import {
  markPriorityNotificationSent,
  verifyWaitlistEntry,
} from "@/lib/waitlist/service"

export const runtime = "nodejs"

export async function GET(
  request: Request,
  context: { params: Promise<{ token: string }> },
) {
  const { token } = await context.params
  const db = getDb()
  const result = await verifyWaitlistEntry(db, token)

  if (result.status === "invalid") {
    return NextResponse.redirect(new URL("/?verify=invalid", request.url))
  }

  if (
    result.status === "verified" &&
    result.priorityUnlocked &&
    result.priorityUnlockedEmail !== null &&
    result.priorityUnlockedEntryId !== null &&
    result.priorityUnlockedReferralCount !== null
  ) {
    await sendPriorityUnlockedEmail({
      email: result.priorityUnlockedEmail,
      referralCount: result.priorityUnlockedReferralCount,
    })
    await markPriorityNotificationSent(db, result.priorityUnlockedEntryId)
  }

  return NextResponse.redirect(
    new URL(`/queue/${result.dashboardToken}?verify=${result.status}`, request.url),
  )
}

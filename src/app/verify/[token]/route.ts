import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { getDb } from "@/db/client"
import {
  MORTEM_DASHBOARD_COOKIE,
  mortemDashboardCookieOptions,
} from "@/lib/waitlist/dashboard-cookie"
import { sendConfirmationEmail, sendPriorityUnlockedEmail } from "@/lib/waitlist/mailer"
import {
  findEntryByDashboardToken,
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
    const cookieStore = await cookies()
    const savedDashboard = cookieStore.get(MORTEM_DASHBOARD_COOKIE)?.value
    if (savedDashboard !== undefined && savedDashboard.length > 0) {
      const entry = await findEntryByDashboardToken(db, savedDashboard)
      if (entry !== undefined && entry.emailVerifiedAt !== null) {
        const res = NextResponse.redirect(
          new URL(`/queue/${savedDashboard}?verify=already_verified`, request.url),
        )
        res.cookies.set(
          MORTEM_DASHBOARD_COOKIE,
          savedDashboard,
          mortemDashboardCookieOptions(request.url),
        )
        return res
      }
    }
    return NextResponse.redirect(new URL("/?verify=invalid", request.url))
  }

  if (result.status === "verified") {
    await sendConfirmationEmail({
      dashboardToken: result.dashboardToken,
      email: result.email,
      referralCode: result.referralCode,
    })
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

  const res = NextResponse.redirect(
    new URL(`/queue/${result.dashboardToken}?verify=${result.status}`, request.url),
  )
  res.cookies.set(
    MORTEM_DASHBOARD_COOKIE,
    result.dashboardToken,
    mortemDashboardCookieOptions(request.url),
  )
  return res
}

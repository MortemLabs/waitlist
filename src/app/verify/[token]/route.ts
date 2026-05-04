import { NextResponse } from "next/server"
import { getDb } from "@/db/client"
import { verifyWaitlistEntry } from "@/lib/waitlist/service"

export const runtime = "nodejs"

export async function GET(
  request: Request,
  context: { params: Promise<{ token: string }> },
) {
  const { token } = await context.params
  const result = await verifyWaitlistEntry(getDb(), token)

  if (result.status === "invalid") {
    return NextResponse.redirect(new URL("/?verify=invalid", request.url))
  }

  return NextResponse.redirect(
    new URL(`/queue/${result.dashboardToken}?verify=${result.status}`, request.url),
  )
}

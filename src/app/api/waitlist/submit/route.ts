import { NextResponse } from "next/server"
import { getDb } from "@/db/client"
import { submitWaitlistEntry } from "@/lib/waitlist/service"
import { waitlistFormSchema } from "@/lib/waitlist/schema"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = waitlistFormSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().formErrors[0] ?? "Invalid waitlist payload." },
        { status: 400 },
      )
    }

    const result = await submitWaitlistEntry(getDb(), parsed.data)

    return NextResponse.json({
      alreadyVerified: result.alreadyVerified,
      redirectTo: `/queue/${result.dashboardToken}`,
    })
  } catch (error) {
    console.error("[waitlist/submit]", error)

    return NextResponse.json(
      { error: "Mortem could not file the request. Try again in a moment." },
      { status: 500 },
    )
  }
}

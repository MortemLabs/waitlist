import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  context: { params: Promise<{ referralCode: string }> },
) {
  const { referralCode } = await context.params
  const cookieStore = await cookies()

  cookieStore.set("mortem-ref", referralCode.trim().toUpperCase(), {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
    sameSite: "lax",
    secure: request.url.startsWith("https://"),
  })

  return NextResponse.redirect(new URL("/?referred=1", request.url))
}

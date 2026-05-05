/** HttpOnly cookie holding the dashboard token after email verification. Used so stale verify links still send users to their referral page. */
export const MORTEM_DASHBOARD_COOKIE = "mortem-dashboard"

export function mortemDashboardCookieOptions(requestUrl: string) {
  return {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "lax" as const,
    secure: requestUrl.startsWith("https://"),
  }
}

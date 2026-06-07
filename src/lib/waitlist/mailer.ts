import { Resend } from "resend"
import { getAppUrl, getResendApiKey, getResendFromEmail } from "@/lib/env"
import { buildVerificationEmailHtml } from "@/lib/waitlist/verification-email-template"

const EMAIL_SIGN_OFF_TEXT = "\n\nBest,\nMortem Labs Team"

function emailWordmarkHeader(appUrl: string): string {
  const src = `${appUrl}/mortem-wordmark.png`
  return `
    <div style="margin:0 0 28px">
      <a href="${appUrl}" style="text-decoration:none;display:inline-block;line-height:0">
        <img src="${src}" alt="Mortem" width="220" style="display:block;border:0;outline:none;max-width:100%;height:auto" />
      </a>
    </div>`
}

function emailSignOffHtml(): string {
  return `
    <p style="font-size:15px;line-height:1.65;color:#C3BFB9;margin:32px 0 0">
      Best,<br />
      <span style="color:#EDEEE9">mortem team</span>
    </p>`
}

let resendClient: Resend | null = null

function getResendClient(): Resend {
  if (resendClient !== null) {
    return resendClient
  }

  resendClient = new Resend(getResendApiKey())
  return resendClient
}

export async function sendVerificationEmail({
  email,
  verificationToken,
}: {
  email: string
  verificationToken: string
}) {
  const appUrl = getAppUrl()
  const verificationUrl = `${appUrl}/verify/${verificationToken}`

  await getResendClient().emails.send({
    from: getResendFromEmail(),
    html: buildVerificationEmailHtml({
      preferencesUrl: `${appUrl}/preferences`,
      unsubscribeUrl: `${appUrl}/unsubscribe`,
      verificationUrl,
    }),
    subject: "Mortem early access — verify your email",
    text: `Confirm your email.\n\nOne click verifies the address and moves your request into the queue. This link expires in 30 minutes and can only be used once.\n\n${verificationUrl}\n\nDidn't request this? No action is needed — the link expires on its own and nothing was filed.`,
    to: email,
  })
}

export async function sendConfirmationEmail({
  email,
  referralCode,
  dashboardToken,
}: {
  email: string
  referralCode: string
  dashboardToken: string
}) {
  const appUrl = getAppUrl()
  const referralUrl = `${appUrl}/r/${referralCode}`
  const dashboardUrl = `${appUrl}/queue/${dashboardToken}`

  await getResendClient().emails.send({
    from: getResendFromEmail(),
    html: `
      <div style="background:#0E0D0C;color:#EDEEE9;padding:32px;font-family:Inter Tight,Arial,sans-serif">
        ${emailWordmarkHeader(appUrl)}
        <p style="font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#A39C95;margin:0 0 16px">Early access</p>
        <h1 style="font-family:Instrument Serif,Georgia,serif;font-size:36px;line-height:1.05;margin:0 0 16px">Filed. Verified. Case open.</h1>
        <p style="font-size:16px;line-height:1.7;color:#C3BFB9;margin:0 0 8px">
          Your place in the early-access queue is confirmed.
        </p>
        <p style="font-size:14px;line-height:1.7;color:#A39C95;margin:0 0 28px">
          Three verified referrals move your case to priority review. Share your link below.
        </p>
        <div style="border:1px solid #3A3530;padding:16px;margin:0 0 28px">
          <p style="font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:#A39C95;margin:0 0 8px;font-family:JetBrains Mono,monospace">Your referral link</p>
          <p style="font-size:14px;color:#EDEEE9;word-break:break-all;margin:0;font-family:JetBrains Mono,monospace">${referralUrl}</p>
        </div>
        <p style="margin:0 0 28px">
          <a href="${dashboardUrl}" style="display:inline-block;background:#DC2626;color:#EDEEE9;padding:14px 20px;text-decoration:none;font-family:JetBrains Mono,monospace;font-size:12px;letter-spacing:.16em;text-transform:uppercase">
            View your queue position
          </a>
        </p>
        <p style="font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#3A3530;margin:0 0 28px;font-family:JetBrains Mono,monospace">☩ Ship · Learn · Bury · Repeat ☩</p>
        ${emailSignOffHtml()}
      </div>
    `,
    subject: "Mortem early access — you're in the file",
    text: `Your Mortem early-access place is confirmed.\n\nShare your referral link to move up: ${referralUrl}\n\nView your dashboard: ${dashboardUrl}${EMAIL_SIGN_OFF_TEXT}`,
    to: email,
  })
}

export async function sendPriorityUnlockedEmail({
  email,
  referralCount,
}: {
  email: string
  referralCount: number
}) {
  const appUrl = getAppUrl()

  await getResendClient().emails.send({
    from: getResendFromEmail(),
    html: `
      <div style="background:#0E0D0C;color:#EDEEE9;padding:32px;font-family:Inter Tight,Arial,sans-serif">
        ${emailWordmarkHeader(appUrl)}
        <p style="font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#A39C95;margin:0 0 16px">Priority queue</p>
        <h1 style="font-family:Instrument Serif,Georgia,serif;font-size:36px;line-height:1.05;margin:0 0 16px">You moved up the file.</h1>
        <p style="font-size:16px;line-height:1.7;color:#C3BFB9;margin:0 0 16px">
          ${referralCount} verified referrals have been filed under your link. Your request is now marked for priority beta review.
        </p>
        <p style="font-size:14px;line-height:1.7;color:#A39C95;margin:0 0 24px">
          This does not mean instant access. It does move your case higher in the review queue.
        </p>
        <p style="margin:0 0 28px">
          <a href="${appUrl}" style="display:inline-block;background:#DC2626;color:#EDEEE9;padding:14px 20px;text-decoration:none;font-family:JetBrains Mono,monospace;font-size:12px;letter-spacing:.16em;text-transform:uppercase">
            Open Mortem
          </a>
        </p>
        ${emailSignOffHtml()}
      </div>
    `,
    subject: "Mortem early access — priority queue unlocked",
    text: `Your Mortem request is now in the priority queue after ${referralCount} verified referrals.${EMAIL_SIGN_OFF_TEXT}`,
    to: email,
  })
}
